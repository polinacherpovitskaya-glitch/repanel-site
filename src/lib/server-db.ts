import "server-only";

import { randomUUID } from "node:crypto";
import { Pool, type PoolClient } from "pg";

export const SITE_COLLECTIONS = [
  "products",
  "shop_orders",
  "order_timeline",
  "order_shipments",
  "notification_log",
  "certificates",
  "certificate_redemptions",
  "promo_codes",
  "promo_redemptions",
  "returns",
] as const;

export type SiteCollection = (typeof SITE_COLLECTIONS)[number];
export type JsonRow = Record<string, unknown>;

type Filter =
  | { kind: "eq"; column: string; value: unknown }
  | { kind: "neq"; column: string; value: unknown }
  | { kind: "in"; column: string; values: unknown[] }
  | { kind: "ilike"; column: string; pattern: string };

type OrderBy = { column: string; ascending: boolean };
type SelectOptions = { count?: "exact" | "planned" | "estimated"; head?: boolean };
type Mutation = { kind: "insert" | "update" | "delete"; values?: JsonRow | JsonRow[] };

export type DbError = Error & { code?: string };
export type DbResult<T = unknown> = {
  data: T;
  error: DbError | null;
  count: number | null;
  status: number;
  statusText: string;
};

const COLLECTION_SET = new Set<string>(SITE_COLLECTIONS);
let sitePool: Pool | null = null;

function databaseUrl(): string {
  const value = process.env.SITE_DATABASE_URL;
  if (!value) throw new Error("SITE_DATABASE_URL не задан");
  return value;
}

function pool(): Pool {
  if (!sitePool) {
    sitePool = new Pool({
      connectionString: databaseUrl(),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      statement_timeout: 10_000,
      application_name: "repanel-site",
    });
    sitePool.on("error", (error) => console.error("[site-db] idle client error", error));
  }
  return sitePool;
}

function collectionName(value: string): SiteCollection {
  if (!COLLECTION_SET.has(value)) throw new Error(`Недопустимая коллекция: ${value}`);
  return value as SiteCollection;
}

function writesFrozen(): boolean {
  return process.env.CUTOVER_WRITE_FREEZE === "1";
}

function writeFreezeError(): DbError {
  const error = new Error("Запись временно остановлена для безопасного переключения") as DbError;
  error.code = "WRITE_FROZEN";
  return error;
}

function defaultedRow(collection: SiteCollection, input: JsonRow): JsonRow {
  const now = new Date().toISOString();
  const row: JsonRow = {
    ...input,
    id: input.id || randomUUID(),
    created_at: input.created_at || now,
  };

  if (collection === "shop_orders") {
    row.tracking_token = input.tracking_token || randomUUID();
    row.submitted_at = input.submitted_at || now;
  }
  if (collection === "returns") row.updated_at = input.updated_at || now;
  return row;
}

function errorResult(error: unknown): DbResult<null> {
  const normalized = (error instanceof Error ? error : new Error(String(error))) as DbError;
  const frozen = normalized.code === "WRITE_FROZEN";
  return {
    data: null,
    error: normalized,
    count: null,
    status: frozen ? 503 : 500,
    statusText: normalized.message,
  };
}

function okResult<T>(data: T, count: number | null = null): DbResult<T> {
  return { data, error: null, count, status: 200, statusText: "OK" };
}

export function matchesLike(value: unknown, pattern: string): boolean {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const source = `^${escaped.replace(/%/g, ".*").replace(/_/g, ".")}$`;
  return new RegExp(source, "i").test(String(value ?? ""));
}

function matchesFilters(row: JsonRow, filters: Filter[]): boolean {
  return filters.every((filter) => {
    const value = row[filter.column];
    if (filter.kind === "eq") return value === filter.value;
    if (filter.kind === "neq") return value !== filter.value;
    if (filter.kind === "in") return filter.values.some((candidate) => candidate === value);
    return matchesLike(value, filter.pattern);
  });
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const aTime = typeof a === "string" ? Date.parse(a) : Number.NaN;
  const bTime = typeof b === "string" ? Date.parse(b) : Number.NaN;
  if (Number.isFinite(aTime) && Number.isFinite(bTime)) return aTime - bTime;
  return String(a).localeCompare(String(b), "ru");
}

function project(row: JsonRow, columns: string | undefined): JsonRow {
  if (!columns || columns.trim() === "*") return { ...row };
  const selected = columns.split(",").map((column) => column.trim()).filter(Boolean);
  return Object.fromEntries(selected.map((column) => [column, row[column]]));
}

async function readCollection(collection: SiteCollection, client: Pool | PoolClient = pool()): Promise<JsonRow[]> {
  const result = await client.query<{ id: string; body: JsonRow }>(
    "select id, body from site_records where collection = $1",
    [collection],
  );
  return result.rows.map((record) => ({ ...record.body, id: String(record.body.id ?? record.id) }));
}

export class SiteQueryBuilder<T = JsonRow[]> implements PromiseLike<DbResult<T>> {
  private mutation: Mutation | null = null;
  private columns: string | undefined;
  private selectOptions: SelectOptions = {};
  private filters: Filter[] = [];
  private orderBy: OrderBy[] = [];
  private rowLimit: number | null = null;
  private cardinality: "many" | "single" | "maybeSingle" = "many";
  private execution: Promise<DbResult<unknown>> | null = null;

  constructor(private readonly collection: SiteCollection) {}

  select(columns = "*", options: SelectOptions = {}): this {
    this.columns = columns;
    this.selectOptions = options;
    return this;
  }

  insert(values: JsonRow | JsonRow[]): this {
    this.mutation = { kind: "insert", values };
    return this;
  }

  update(values: JsonRow): this {
    this.mutation = { kind: "update", values };
    return this;
  }

  delete(): this {
    this.mutation = { kind: "delete" };
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ kind: "eq", column, value });
    return this;
  }

  neq(column: string, value: unknown): this {
    this.filters.push({ kind: "neq", column, value });
    return this;
  }

  in(column: string, values: unknown[]): this {
    this.filters.push({ kind: "in", column, values });
    return this;
  }

  ilike(column: string, pattern: string): this {
    this.filters.push({ kind: "ilike", column, pattern });
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}): this {
    this.orderBy.push({ column, ascending: options.ascending !== false });
    return this;
  }

  limit(value: number): this {
    this.rowLimit = Math.max(0, Math.floor(value));
    return this;
  }

  single<Result = JsonRow>(): SiteQueryBuilder<Result> {
    this.cardinality = "single";
    return this as unknown as SiteQueryBuilder<Result>;
  }

  maybeSingle<Result = JsonRow>(): SiteQueryBuilder<Result | null> {
    this.cardinality = "maybeSingle";
    return this as unknown as SiteQueryBuilder<Result | null>;
  }

  then<TResult1 = DbResult<T>, TResult2 = never>(
    onfulfilled?: ((value: DbResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    if (!this.execution) this.execution = this.execute();
    return this.execution.then(
      onfulfilled as ((value: DbResult<unknown>) => TResult1 | PromiseLike<TResult1>) | null | undefined,
      onrejected,
    );
  }

  private async execute(): Promise<DbResult<unknown>> {
    try {
      if (this.mutation && writesFrozen()) return errorResult(writeFreezeError());
      if (this.mutation?.kind === "insert") return await this.executeInsert(this.mutation.values);
      if (this.mutation?.kind === "update") return await this.executeUpdate(this.mutation.values as JsonRow);
      if (this.mutation?.kind === "delete") return await this.executeDelete();
      return await this.executeSelect();
    } catch (error) {
      return errorResult(error);
    }
  }

  private prepareRows(rows: JsonRow[]): JsonRow[] {
    let result = rows.filter((row) => matchesFilters(row, this.filters));
    if (this.orderBy.length) {
      result = [...result].sort((a, b) => {
        for (const order of this.orderBy) {
          const compared = compareValues(a[order.column], b[order.column]);
          if (compared !== 0) return order.ascending ? compared : -compared;
        }
        return 0;
      });
    }
    if (this.rowLimit != null) result = result.slice(0, this.rowLimit);
    return result;
  }

  private finishRows(rows: JsonRow[]): DbResult<unknown> {
    const count = this.selectOptions.count ? rows.length : null;
    if (this.selectOptions.head) return okResult(null, count);
    const projected = rows.map((row) => project(row, this.columns));
    if (this.cardinality === "single") {
      if (projected.length !== 1) return errorResult(new Error(`Ожидалась одна запись, найдено: ${projected.length}`));
      return okResult(projected[0], count);
    }
    if (this.cardinality === "maybeSingle") {
      if (projected.length > 1) return errorResult(new Error(`Ожидалась максимум одна запись, найдено: ${projected.length}`));
      return okResult(projected[0] ?? null, count);
    }
    return okResult(projected, count);
  }

  private async executeSelect(): Promise<DbResult<unknown>> {
    return this.finishRows(this.prepareRows(await readCollection(this.collection)));
  }

  private async executeInsert(values: JsonRow | JsonRow[] | undefined): Promise<DbResult<unknown>> {
    const source = Array.isArray(values) ? values : values ? [values] : [];
    const rows = source.map((row) => defaultedRow(this.collection, row));
    const client = await pool().connect();
    try {
      await client.query("begin");
      for (const row of rows) {
        await client.query(
          "insert into site_records (collection, id, body) values ($1, $2, $3::jsonb)",
          [this.collection, String(row.id), JSON.stringify(row)],
        );
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
    if (!this.columns) return okResult(null);
    return this.finishRows(rows);
  }

  private async executeUpdate(values: JsonRow): Promise<DbResult<unknown>> {
    const client = await pool().connect();
    try {
      await client.query("begin");
      const rows = this.prepareRows(await readCollection(this.collection, client));
      const updated: JsonRow[] = rows.map((row) => ({
        ...row,
        ...values,
        updated_at: new Date().toISOString(),
      }));
      for (const row of updated) {
        await client.query(
          "update site_records set body = $3::jsonb, updated_at = now() where collection = $1 and id = $2",
          [this.collection, String(row.id), JSON.stringify(row)],
        );
      }
      await client.query("commit");
      if (!this.columns) return okResult(null);
      return this.finishRows(updated);
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  private async executeDelete(): Promise<DbResult<unknown>> {
    const client = await pool().connect();
    try {
      await client.query("begin");
      const rows = this.prepareRows(await readCollection(this.collection, client));
      for (const row of rows) {
        await client.query("delete from site_records where collection = $1 and id = $2", [this.collection, String(row.id)]);
      }
      await client.query("commit");
      return okResult(null);
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }
}

export type SiteDatabase = { from(table: string): SiteQueryBuilder<JsonRow[]> };

const database: SiteDatabase = {
  from(table: string) {
    return new SiteQueryBuilder(collectionName(table));
  },
};

export function siteDb(): SiteDatabase {
  return database;
}

export async function pingSiteDb(): Promise<void> {
  await pool().query("select 1");
}

export const serverDbTesting = {
  matchesFilters,
  compareValues,
  project,
};

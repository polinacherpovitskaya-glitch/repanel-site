import "server-only";

import { randomUUID } from "node:crypto";
import { Driver } from "@ydbjs/core";
import { EnvironCredentialsProvider } from "@ydbjs/auth/environ";
import { query, type QueryClient } from "@ydbjs/query";
import { JsonDocument } from "@ydbjs/value/primitive";

const PERSONAL_DATA_TABLES = new Set([
  "shop_orders",
  "order_timeline",
  "returns",
  "certificates",
]);

const DEFAULT_TABLE = "personal_data_records";

type JsonRow = Record<string, unknown>;
type Filter =
  | { kind: "eq"; column: string; value: unknown }
  | { kind: "in"; column: string; values: unknown[] }
  | { kind: "ilike"; column: string; pattern: string };

type OrderBy = { column: string; ascending: boolean };
type SelectOptions = { count?: "exact" | "planned" | "estimated"; head?: boolean };

type DbError = Error & { code?: string };
type DbResult<T = unknown> = {
  data: T;
  error: DbError | null;
  count: number | null;
  status: number;
  statusText: string;
};

type Mutation = {
  kind: "insert" | "update" | "delete";
  values?: JsonRow | JsonRow[];
};

type YdbContext = {
  driver: Driver;
  sql: QueryClient;
  table: string;
};

let ydbContextPromise: Promise<YdbContext> | null = null;

function tableName(): string {
  const value = process.env.YDB_PERSONAL_DATA_TABLE ?? DEFAULT_TABLE;
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
    throw new Error("YDB_PERSONAL_DATA_TABLE содержит недопустимое имя таблицы");
  }
  return value;
}

async function getYdbContext(): Promise<YdbContext> {
  if (!ydbContextPromise) {
    ydbContextPromise = (async () => {
      const connectionString = process.env.YDB_CONNECTION_STRING;
      if (!connectionString) {
        throw new Error("YDB_CONNECTION_STRING не задан");
      }

      const credentials = new EnvironCredentialsProvider(connectionString);
      const driver = new Driver(connectionString, {
        credentialsProvider: credentials,
        secureOptions: credentials.secureOptions,
        "ydb.sdk.application": "repanel-site",
      });
      await driver.ready();

      return {
        driver,
        sql: query(driver, { poolOptions: { maxSize: 5 } }),
        table: tableName(),
      };
    })().catch((error) => {
      ydbContextPromise = null;
      throw error;
    });
  }
  return ydbContextPromise;
}

function defaultedRow(collection: string, input: JsonRow): JsonRow {
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
  if (collection === "returns") {
    row.updated_at = input.updated_at || now;
  }
  return row;
}

function errorResult(error: unknown): DbResult<null> {
  const normalized = error instanceof Error ? error : new Error(String(error));
  return {
    data: null,
    error: normalized,
    count: null,
    status: 500,
    statusText: normalized.message,
  };
}

function okResult<T>(data: T, count: number | null = null): DbResult<T> {
  return { data, error: null, count, status: 200, statusText: "OK" };
}

function matchesLike(value: unknown, pattern: string): boolean {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const source = `^${escaped.replace(/%/g, ".*").replace(/_/g, ".")}$`;
  return new RegExp(source, "i").test(String(value ?? ""));
}

function matchesFilters(row: JsonRow, filters: Filter[]): boolean {
  return filters.every((filter) => {
    const value = row[filter.column];
    if (filter.kind === "eq") return value === filter.value;
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
  const selected = columns
    .split(",")
    .map((column) => column.trim())
    .filter(Boolean);
  return Object.fromEntries(selected.map((column) => [column, row[column]]));
}

async function readCollection(collection: string): Promise<JsonRow[]> {
  const { sql, table } = await getYdbContext();
  const resultSets = await sql`
    SELECT id, body
    FROM ${sql.identifier(table)}
    WHERE collection = ${collection}
  `.isolation("onlineReadOnly", { allowInconsistentReads: false });

  const rows = (resultSets[0] ?? []) as Array<{ id: string; body: unknown }>;
  return rows.map((record) => {
    const body =
      record.body && typeof record.body === "object"
        ? (record.body as JsonRow)
        : (JSON.parse(String(record.body ?? "{}")) as JsonRow);
    return { ...body, id: String(body.id ?? record.id) };
  });
}

async function upsertRow(collection: string, row: JsonRow): Promise<void> {
  const { sql, table } = await getYdbContext();
  const id = String(row.id);
  const now = new Date();
  await sql`
    UPSERT INTO ${sql.identifier(table)}
      (collection, id, body, created_at, updated_at)
    VALUES
      (${collection}, ${id}, ${new JsonDocument(JSON.stringify(row))}, ${now}, ${now})
  `.idempotent(true);
}

async function deleteRow(collection: string, id: string): Promise<void> {
  const { sql, table } = await getYdbContext();
  await sql`
    DELETE FROM ${sql.identifier(table)}
    WHERE collection = ${collection} AND id = ${id}
  `.idempotent(true);
}

class YdbPostgrestBuilder<T = unknown> implements PromiseLike<DbResult<T>> {
  private readonly collection: string;
  private mutation: Mutation | null = null;
  private columns: string | undefined;
  private selectOptions: SelectOptions = {};
  private filters: Filter[] = [];
  private orderBy: OrderBy[] = [];
  private rowLimit: number | null = null;
  private cardinality: "many" | "single" | "maybeSingle" = "many";
  private execution: Promise<DbResult<unknown>> | null = null;

  constructor(collection: string) {
    this.collection = collection;
  }

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

  single<Result = T>(): YdbPostgrestBuilder<Result> {
    this.cardinality = "single";
    return this as unknown as YdbPostgrestBuilder<Result>;
  }

  maybeSingle<Result = T>(): YdbPostgrestBuilder<Result | null> {
    this.cardinality = "maybeSingle";
    return this as unknown as YdbPostgrestBuilder<Result | null>;
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
      if (projected.length !== 1) {
        return errorResult(new Error(`Ожидалась одна запись, найдено: ${projected.length}`));
      }
      return okResult(projected[0], count);
    }
    if (this.cardinality === "maybeSingle") {
      if (projected.length > 1) {
        return errorResult(new Error(`Ожидалась максимум одна запись, найдено: ${projected.length}`));
      }
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
    for (const row of rows) await upsertRow(this.collection, row);
    if (!this.columns) return okResult(null);
    return this.finishRows(rows);
  }

  private async executeUpdate(values: JsonRow): Promise<DbResult<unknown>> {
    const rows = this.prepareRows(await readCollection(this.collection));
    const updated = rows.map((row) => ({ ...row, ...values, updated_at: new Date().toISOString() }));
    for (const row of updated) await upsertRow(this.collection, row);
    if (!this.columns) return okResult(null);
    return this.finishRows(updated);
  }

  private async executeDelete(): Promise<DbResult<unknown>> {
    const rows = this.prepareRows(await readCollection(this.collection));
    for (const row of rows) await deleteRow(this.collection, String(row.id));
    return okResult(null);
  }
}

export function isPersonalDataTable(table: string): boolean {
  return PERSONAL_DATA_TABLES.has(table);
}

export function personalDataFrom(table: string): YdbPostgrestBuilder {
  if (!isPersonalDataTable(table)) {
    throw new Error(`Таблица ${table} не входит в российский контур персональных данных`);
  }
  return new YdbPostgrestBuilder(table);
}


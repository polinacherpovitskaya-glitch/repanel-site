import { NextResponse } from "next/server";
import { pingSiteDb } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pingSiteDb();
    return NextResponse.json({
      ok: true,
      database: "ok",
      writeFreeze: process.env.CUTOVER_WRITE_FREEZE === "1",
      version: process.env.APP_VERSION || "development",
    });
  } catch (error) {
    console.error("[health] database unavailable", error);
    return NextResponse.json(
      { ok: false, database: "unavailable", writeFreeze: process.env.CUTOVER_WRITE_FREEZE === "1" },
      { status: 503 },
    );
  }
}

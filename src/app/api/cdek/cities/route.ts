import { NextRequest, NextResponse } from "next/server";
import { findCities } from "@/lib/cdek";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json([]);
  try {
    const data = await findCities(q.trim());
    const arr = Array.isArray(data) ? data : [];
    return NextResponse.json(
      arr.slice(0, 10).map((c: { code: number; city: string; region?: string }) => ({
        code: c.code,
        city: c.city,
        region: c.region ?? "",
      })),
    );
  } catch (err) {
    console.warn("[cdek/cities]", err);
    return NextResponse.json([]);
  }
}

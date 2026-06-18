import { NextRequest, NextResponse } from "next/server";
import { getPickupPoints } from "@/lib/cdek";

export const runtime = "nodejs";

type CdekPoint = {
  code: string;
  name: string;
  type?: string;
  work_time?: string;
  location?: { address?: string; latitude?: number; longitude?: number };
};

export async function GET(req: NextRequest) {
  const cityCode = Number(new URL(req.url).searchParams.get("city_code"));
  if (!cityCode) return NextResponse.json([]);
  try {
    const data = await getPickupPoints(cityCode);
    const arr: CdekPoint[] = Array.isArray(data) ? data : [];
    return NextResponse.json(
      arr.map((p) => ({
        code: p.code,
        name: p.name,
        address: p.location?.address ?? "",
        workTime: p.work_time ?? "",
        type: p.type ?? "PVZ",
        lat: p.location?.latitude ?? null,
        lng: p.location?.longitude ?? null,
      })),
    );
  } catch (err) {
    console.warn("[cdek/pvz]", err);
    return NextResponse.json([]);
  }
}

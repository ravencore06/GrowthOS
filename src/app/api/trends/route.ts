import { NextResponse } from "next/server";
import { generateTrends } from "@/lib/data";
import type { PlatformId } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") as PlatformId | null;
  const trends = generateTrends(platform ?? undefined);
  return NextResponse.json({ trends });
}

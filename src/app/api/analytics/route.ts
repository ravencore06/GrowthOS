import { NextResponse } from "next/server";
import {
  generateAnalytics,
  getDashboardSummary,
  getScheduledPosts,
} from "@/lib/data";
import type { PlatformId } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") as PlatformId | null;
  const analytics = generateAnalytics(platform ?? undefined);
  const summary = getDashboardSummary(analytics, getScheduledPosts());
  return NextResponse.json({ analytics, summary });
}

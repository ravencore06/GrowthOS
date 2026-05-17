import { NextResponse } from "next/server";
import { optimizeCaption } from "@/lib/services";
import type { PlatformId } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    caption,
    platform = "instagram",
    goal = "engagement",
  } = body as {
    caption?: string;
    platform?: PlatformId;
    goal?: "engagement" | "reach" | "clicks";
  };

  if (!caption?.trim()) {
    return NextResponse.json({ error: "Caption is required" }, { status: 400 });
  }

  const result = optimizeCaption({
    caption: caption.trim(),
    platform,
    goal,
  });

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { generateContent } from "@/lib/services";
import type { ContentFormat, ContentTone, PlatformId } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    topic,
    platform = "instagram",
    tone = "casual",
    format = "post",
    includeHashtags = true,
  } = body as {
    topic?: string;
    platform?: PlatformId;
    tone?: ContentTone;
    format?: ContentFormat;
    includeHashtags?: boolean;
  };

  if (!topic?.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const content = generateContent({
    topic: topic.trim(),
    platform,
    tone,
    format,
    includeHashtags,
  });

  return NextResponse.json(content);
}

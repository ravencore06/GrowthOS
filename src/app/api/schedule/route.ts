import { NextResponse } from "next/server";
import {
  addScheduledPost,
  deleteScheduledPost,
  getScheduledPosts,
} from "@/lib/data";
import type { PlatformId } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ posts: getScheduledPosts() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content, platforms, scheduledAt, mediaType } = body as {
    title?: string;
    content?: string;
    platforms?: PlatformId[];
    scheduledAt?: string;
    mediaType?: "image" | "video" | "carousel";
  };

  if (!title?.trim() || !content?.trim() || !platforms?.length || !scheduledAt) {
    return NextResponse.json(
      { error: "title, content, platforms, and scheduledAt are required" },
      { status: 400 }
    );
  }

  const post = addScheduledPost({
    title: title.trim(),
    content: content.trim(),
    platforms,
    scheduledAt,
    mediaType,
  });

  return NextResponse.json(post, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  const ok = deleteScheduledPost(id);
  if (!ok) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

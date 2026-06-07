import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createPost, crossPost } from "@/lib/zernio";
import { getProfile, getConnectedAccounts, storeScheduledPost } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content, platforms, scheduledAt, mediaUrls } = body as {
    title?: string;
    content?: string;
    platforms?: string[];
    scheduledAt?: string;
    mediaUrls?: string;
  };

  if (!title?.trim() || !content?.trim() || !platforms?.length) {
    return NextResponse.json(
      { error: "title, content, and platforms are required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const profile = await getProfile(email);
    if (!profile?.zernioProfileId) {
      return NextResponse.json(
        { error: "No Zernio profile found. Connect a social account first." },
        { status: 400 }
      );
    }

    const accounts = await getConnectedAccounts(email);
    const platformAccountMap = new Map<string, string>();
    for (const acc of accounts) {
      platformAccountMap.set(acc.platform, acc.zernioAccountId);
    }

    const missingPlatforms = platforms.filter(
      (p) => !platformAccountMap.has(p)
    );
    if (missingPlatforms.length > 0) {
      return NextResponse.json(
        {
          error: `No connected account for: ${missingPlatforms.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const scheduleDate = scheduledAt ? new Date(scheduledAt) : new Date(now.getTime() + 60 * 60 * 1000);
    const diffMs = scheduleDate.getTime() - now.getTime();
    const scheduleMinutes = Math.max(1, Math.floor(diffMs / 60000));
    const publishNow = !scheduledAt || scheduleMinutes <= 1;

    let zernioResult;
    if (platforms.length === 1) {
      const platform = platforms[0];
      zernioResult = await createPost({
        content,
        platform,
        account_id: platformAccountMap.get(platform),
        profile_id: profile.zernioProfileId,
        publish_now: publishNow,
        schedule_minutes: publishNow ? undefined : scheduleMinutes,
        media_urls: mediaUrls,
        title,
      });
    } else {
      const accountIds = platforms
        .map((p) => platformAccountMap.get(p) ?? "")
        .join(",");
      zernioResult = await crossPost({
        content,
        platforms: platforms.join(","),
        account_ids: accountIds,
        profile_id: profile.zernioProfileId,
        publish_now: publishNow,
        media_urls: mediaUrls,
      });
    }

    const stored = await storeScheduledPost({
      email,
      zernioPostId: zernioResult.id,
      title,
      content,
      platforms,
      scheduledAt: scheduleDate.toISOString(),
      status: publishNow ? "published" : "scheduled",
    });

    return NextResponse.json({ post: stored }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to schedule post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getConnectUrl, createProfile, listProfiles } from "@/lib/zernio";
import { ensureProfile, getProfile } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  if (!platform) {
    return NextResponse.json(
      { error: "platform query parameter is required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    let profile = await getProfile(email);

    if (!profile?.zernioProfileId) {
      const existing = await listProfiles();
      const match = existing.find((p) => p.name === email);
      const zernioProfile = match ?? (await createProfile(email));
      profile = await ensureProfile(email, zernioProfile.id);
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/zernio/callback`;
    const { authUrl } = await getConnectUrl(
      platform as Parameters<typeof getConnectUrl>[0],
      profile.zernioProfileId!,
      redirectUrl
    );

    return NextResponse.json({ authUrl, profileId: profile.zernioProfileId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get connect URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

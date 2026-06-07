import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAccount } from "@/lib/zernio";
import { storeConnectedAccount } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;

  if (error) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(
      `${appUrl}/profile?error=${encodeURIComponent(error)}`
    );
  }

  if (!accountId) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/profile?error=missing_account_id`);
  }

  try {
    const account = await getAccount(accountId);
    if (email) {
      await storeConnectedAccount({
        email,
        platform: account.platform,
        zernioAccountId: account.id,
        name: account.name,
        username: account.username,
        avatar: account.avatar,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/profile?connected=${account.platform}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Callback failed";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/profile?error=${encodeURIComponent(message)}`);
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { disconnectAccount as zernioDisconnectAccount } from "@/lib/zernio";
import {
  getConnectedAccounts,
  removeConnectedAccount,
} from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const accounts = await getConnectedAccounts(email);
  return NextResponse.json({ accounts });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const accounts = await getConnectedAccounts(email);
    const account = accounts.find((a) => a.id === id);
    if (account?.zernioAccountId) {
      await zernioDisconnectAccount(account.zernioAccountId).catch(() => {});
    }
    await removeConnectedAccount(email, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to disconnect";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

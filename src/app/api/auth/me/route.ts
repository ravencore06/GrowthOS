import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;

  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const displayName = email.split("@")[0].replace(/[._]/g, " ");
  return NextResponse.json({
    email,
    name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
  });
}

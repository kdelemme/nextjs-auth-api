import "server-only";
import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().delete(SESSION_COOKIE_NAME);
  // could proxy to external API and invalidate the accessToken there for example
  return NextResponse.json({ success: true }, { status: 200 });
}

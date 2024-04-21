import { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from "@/lib/auth/helper";
import { decode, encode } from "@/lib/auth/server-session-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookie = cookies().get(SESSION_COOKIE_NAME);
  if (!cookie) {
    return NextResponse.json({}, { status: 401 });
  }

  const session = decode(cookie.value);
  if (!session) {
    // if the token cannot be decoded, we remove it
    cookies().delete(SESSION_COOKIE_NAME);
    return NextResponse.json({}, { status: 401 });
  }

  // Check the accessToken is still valid
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }
  );

  const user = await res.json();
  if (user && res.ok) {
    return NextResponse.json(user, { status: 200 });
  }

  // otherwise remove the session
  cookies().delete(SESSION_COOKIE_NAME);
  return NextResponse.json({}, { status: 401 });
}

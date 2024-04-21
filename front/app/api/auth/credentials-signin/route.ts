import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { encode } from "@/lib/auth/server-session-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({}, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/credentials-signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const user = await res.json();
  if (user && res.ok) {
    const session = encode(user);
    cookies().set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + SESSION_COOKIE_MAX_AGE),
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json(user, { status: 200 });
  }

  return NextResponse.json({}, { status: 401 });
}

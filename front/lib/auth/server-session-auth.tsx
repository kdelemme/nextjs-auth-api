import "server-only";

import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { Session } from "@/lib/types";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getServerSession(): Session | undefined {
  const cookie = cookies().get(SESSION_COOKIE_NAME);

  if (!cookie) {
    return undefined;
  }

  const session = decode(cookie.value);
  if (session) {
    return session;
  }
}

export function encode(user: Session) {
  if (!process.env.SESSION_JWT_SECRET) {
    throw new Error("process.env.SESSION_JWT_SECRET is not set");
  }

  const token = jwt.sign(user, process.env.SESSION_JWT_SECRET, {
    expiresIn: "7d",
    audience: "my-app",
    issuer: "my-app",
  });

  return token;
}

export function decode(token?: string): Session | undefined {
  if (!process.env.SESSION_JWT_SECRET) {
    throw new Error("process.env.SESSION_JWT_SECRET is not set");
  }

  if (!token) {
    return undefined;
  }

  try {
    const user = jwt.verify(token, process.env.SESSION_JWT_SECRET, {
      audience: "my-app",
      issuer: "my-app",
    });
    return user as Session;
  } catch (err) {
    console.log(err);
  }

  return undefined;
}

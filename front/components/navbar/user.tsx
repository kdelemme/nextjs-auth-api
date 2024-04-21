"use client";

import Link from "next/link";
import { useSession } from "../session/use-session";

export function UserNavbar() {
  const { session, logout } = useSession();

  if (!session) {
    return (
      <>
        <Link href="/account/register" className="btn">
          Register
        </Link>
        <Link href="/account/signin" className="btn">
          Sign In
        </Link>
      </>
    );
  }

  return (
    <>
      <a>Welcome {session.email}!</a>
      <button className="btn btn-secondary" onClick={() => logout()}>
        Logout
      </button>
    </>
  );
}

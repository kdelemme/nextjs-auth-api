"use client";

import { useState } from "react";
import { useSession } from "../session/use-session";

export function AmILoggedIn() {
  const { session, logout } = useSession();
  const [message, setMessage] = useState<string>();

  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1>Try registering an account / signin first</h1>{" "}
        <div className="alert alert-warning w-fit">⛔ No session ⛔</div>
      </div>
    );
  }

  // Example of accessing a protected API using the session's accessToken
  // Handle 401 here.
  const fetchProtectedApi = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/secure`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok && res.status === 401) {
      logout();
      return;
    }

    setMessage(data.message);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        className="btn btn-primary w-fit"
        onClick={() => fetchProtectedApi()}
      >
        Click me
      </button>
      {message && (
        <div className="alert alert-success w-fit mt-2">{message}</div>
      )}
    </div>
  );
}

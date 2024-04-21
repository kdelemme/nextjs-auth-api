"use client";

import { SESSION_CHECK_INTERVAL } from "@/lib/auth/helper";
import { Session } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface SessionProvider {
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;
  logout: () => void;
}

export const SessionContext = React.createContext<SessionProvider>({
  session: undefined,
  setSession: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
  initialSession: Session | undefined;
}

const SessionProvider = ({ children, initialSession }: Props) => {
  const intervalRef = useRef<number>();
  const [session, setSession] = useState<Session | undefined>(initialSession);
  const router = useRouter();

  const logout = async () => {
    if (!session) return;

    const res = await fetch("/api/auth/logout", { method: "POST" });
    const result = await res.json();

    if (res.ok && !!result?.success) {
      setSession(undefined);
      router.refresh();
    }
  };

  async function checkSession() {
    if (session) {
      const res = await fetch("/api/auth/session", { method: "POST" });

      if (!res.ok) {
        clearInterval(intervalRef.current);
        setSession(undefined);
        router.refresh();
      }
    }
  }

  // Check the session validity on initial rendering and at fixed interval
  useEffect(() => {
    checkSession();
    // @ts-ignore
    intervalRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;

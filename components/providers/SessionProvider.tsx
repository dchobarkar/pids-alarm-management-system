"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus
    >
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;

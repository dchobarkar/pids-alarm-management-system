import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import type { Role } from "@/lib/generated/prisma";
import { prisma } from "@/api/db";
import { getDashboardPathForRole as getPath } from "./dashboard-paths";

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
if (!secret && process.env.NODE_ENV !== "test") {
  console.warn(
    "[auth] AUTH_SECRET or NEXTAUTH_SECRET is not set. Sign-in may fail. Add one to .env (e.g. run: openssl rand -base64 32)",
  );
}

export const authOptions: NextAuthConfig = {
  secret,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // 8 hour rolling session; refreshed while user is active
    maxAge: 8 * 60 * 60, // 8 hours
    updateAge: 30 * 60, // refresh token age every 30 minutes of activity
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.role = (user as { role?: Role }).role as Role;
      }
      return token;
    },
    session({ session, token }) {
      if (
        session.user &&
        token &&
        typeof token.id === "string" &&
        typeof token.email === "string" &&
        token.role
      ) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role as Role;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      // Standard same-origin redirect handling recommended by NextAuth
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {
        // fall through
      }
      return baseUrl;
    },
  },
};

export const getDashboardPathForRole = (role: Role): string =>
  getPath(role);

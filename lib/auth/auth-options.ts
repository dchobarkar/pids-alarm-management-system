import type { Role } from "@/lib/generated/prisma";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { findUserByEmail } from "@/api/user/user.repository";
import {
  AUTH_ERROR_PATH,
  AUTH_SIGN_IN_PATH,
  SESSION_MAX_AGE_SECONDS,
  SESSION_UPDATE_AGE_SECONDS,
} from "@/constants/auth";

const secret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? undefined;

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

        const user = await findUserByEmail(email);
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
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },
  pages: {
    signIn: AUTH_SIGN_IN_PATH,
    error: AUTH_ERROR_PATH,
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

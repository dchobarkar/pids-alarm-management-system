import NextAuth from "next-auth";

import { authOptions } from "./auth-options";

/** NextAuth instance: handlers, signIn, signOut, auth. */
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

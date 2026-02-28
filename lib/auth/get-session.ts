import { auth } from "./nextauth";

/** Returns the current session or null if unauthenticated. */
export const getSession = async () => auth();

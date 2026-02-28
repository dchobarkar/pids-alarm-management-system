import type { Role } from "@/lib/generated/prisma";

/** A single user–chainage mapping with user and chainage details. */
export type ChainageMapping = {
  id: string;
  user: { id: string; name: string; email: string; role: Role };
  chainage: { id: string; label: string; startKm: number; endKm: number };
};

/** Chainage with its mapped users (for chainage-mapping UI). */
export type ChainageWithUsers = {
  id: string;
  label: string;
  startKm: number;
  endKm: number;
  users: {
    id: string;
    user: { id: string; name: string; email: string; role: Role };
  }[];
};

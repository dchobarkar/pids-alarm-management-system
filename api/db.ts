/**
 * Prisma Client singleton for the app.
 * Uses Prisma 7 driver adapter (PrismaPg). In Next.js, a single instance
 * is reused to avoid connection pool exhaustion from hot reload in development.
 *
 * Initialization is lazy so DATABASE_URL is only read at runtime, not during
 * `next build` (CI does not have DATABASE_URL; the Web App gets it from app settings).
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { getRequiredEnv } from "@/lib/env";
import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = getRequiredEnv("DATABASE_URL");

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

  return client;
}

/** Lazy proxy: only initializes (and reads DATABASE_URL) when first used at request time. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

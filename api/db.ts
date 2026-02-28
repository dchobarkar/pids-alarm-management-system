/**
 * Prisma Client singleton for the app.
 * Uses Prisma 7 driver adapter (PrismaPg). In Next.js, a single instance
 * is reused to avoid connection pool exhaustion from hot reload in development.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { getRequiredEnv } from "@/lib/env";
import { PrismaClient } from "@/lib/generated/prisma";

const connectionString = getRequiredEnv("DATABASE_URL");

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

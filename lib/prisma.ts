import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — prevents connection exhaustion during
 * hot reloads in development.
 *
 * NOTE: The site currently reads from lib/data.ts and does not require a
 * database. Wire this in when you move content into Postgres.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

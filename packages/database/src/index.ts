import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const database =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? [{ emit: "event", level: "error" }] : []
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database;
}

export { Prisma, PrismaClient } from "@prisma/client";
export type { QueueJob } from "@prisma/client";

import { PrismaClient } from "./generated/prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClient.$extends> | undefined
}

const prismaClient = new PrismaClient({
  accelerateUrl: process.env.ACCELERATE_URL!,
});

export const prisma = (
  globalForPrisma.prisma ??
  prismaClient.$extends(withAccelerate())
) as ReturnType<typeof prismaClient.$extends>;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
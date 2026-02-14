import { PrismaClient } from "./generated/prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var prisma: ReturnType<PrismaClient['$extends']> | undefined
}

const prismaClient = new PrismaClient({
  accelerateUrl: process.env.ACCELERATE_URL!,
});

export const prisma = global.prisma ?? (prismaClient.$extends(withAccelerate()) as any);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
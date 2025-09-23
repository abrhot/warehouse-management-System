// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create or reuse the global prisma instance
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// Named export (optional, in case you still want it)
export const prisma = client;

// Default export (so you can do `import prisma from '@/lib/prisma'`)
export default client;

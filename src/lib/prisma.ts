// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create or reuse the global prisma instance with connection pooling
const client = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  ...(process.env.DATABASE_URL && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL + (process.env.NODE_ENV === 'production' ? '?connection_limit=20' : ''),
      },
    },
  }),
});

// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

// Named export
export const prisma = client;

// Default export
export default client;

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

// Add error handling middleware
client.$use(async (params, next) => {
  const before = Date.now();
  try {
    const result = await next(params);
    const after = Date.now();
    if (after - before > 1000) { // Log slow queries
      console.warn(`[PRISMA] Slow query (${after - before}ms)`, {
        model: params.model,
        action: params.action,
        query: params.runInTransaction ? 'transaction' : params.action,
      });
    }
    return result;
  } catch (error) {
    console.error('[PRISMA] Error in query:', {
      error,
      model: params.model,
      action: params.action,
      args: JSON.stringify(params.args, (_, v) => 
        typeof v === 'bigint' ? v.toString() : v
      ).substring(0, 500),
    });
    throw error;
  }
});

// Named export
export const prisma = client;

// Default export
export default client;

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'Missing environment variable: DATABASE_URL\n' +
        'Copy .env.example to .env and set your Neon DB connection string.'
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });
}

export const prisma: PrismaClient = global._prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') global._prisma = prisma;

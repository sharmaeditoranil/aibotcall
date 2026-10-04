import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ||
  new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });

prisma.$on('warn' as never, (e: any) => {
  logger.warn({ prismaWarn: e }, 'Prisma Warning');
});

prisma.$on('error' as never, (e: any) => {
  logger.error({ prismaError: e }, 'Prisma Error');
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

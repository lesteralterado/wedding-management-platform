import { Prisma } from "@prisma/client";

/**
 * True when Prisma could not reach the database at all (missing DATABASE_URL, server down).
 * Public pages use this to fall back to the bundled demo wedding instead of crashing;
 * any other database error is a real bug and should still surface.
 */
export function isDatabaseUnavailable(error: unknown) {
  return error instanceof Prisma.PrismaClientInitializationError;
}

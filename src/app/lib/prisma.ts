// Library imports
import { PrismaClient } from '@prisma/client'

// Single instance of the PrismaClient class
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prismaInstance = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
}
export default prismaInstance;
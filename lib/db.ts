import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is missing. Using fallback mock prisma client.')
    return createPrismaMock()
  }
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    })

    const adapter = new PrismaPg(pool)

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (err) {
    console.error('Failed to initialize Prisma client:', err)
    return createPrismaMock()
  }
}

function createPrismaMock() {
  const mock: any = new Proxy({} as any, {
    get(target, prop) {
      if (prop === '$transaction') {
        return async (cb: any) => cb(mock)
      }
      return new Proxy({} as any, {
        get(target2, prop2) {
          // Return dummy functions for all model operations
          return async () => null
        }
      })
    }
  })
  return mock as PrismaClient
}

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma


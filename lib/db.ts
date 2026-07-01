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
          return async () => {
            const resultProxy: any = new Proxy({} as any, {
              get(target3, prop3) {
                if (prop3 === 'id') return 'mock-id-' + Math.random().toString(36).substring(2, 9)
                if (prop3 === 'organizationId') return 'mock-org-id'
                if (prop3 === 'organization') return { name: 'CallPilot Demo' }
                if (prop3 === 'role') return 'ADMIN'
                if (prop3 === 'email') return 'omaralizue@gmail.com'
                if (prop3 === 'firstName') return 'Developer'
                if (prop3 === 'lastName') return ''
                return resultProxy
              }
            })
            return resultProxy
          }
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


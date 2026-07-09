import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function repair() {
  console.log('\n⚙️ Repairing database: Resetting stuck PROCESSING calls and jobs...\n')
  try {
    // Reset background jobs that are stuck in PROCESSING or FAILED
    const updatedJobs = await prisma.backgroundJob.updateMany({
      where: {
        status: { in: ['PROCESSING'] },
      },
      data: {
        status: 'PENDING',
        attempts: 0,
        lastError: null,
      }
    })

    // Reset calls that are stuck in PROCESSING
    const updatedCalls = await prisma.call.updateMany({
      where: {
        status: 'PROCESSING',
      },
      data: {
        status: 'PENDING',
      }
    })

    console.log(`✅ Success: Reset ${updatedJobs.count} background jobs and ${updatedCalls.count} calls back to PENDING.`)
    console.log('🔄 They will now be re-processed using the new 30-second timeout configuration!\n')
  } catch (e) {
    console.error('❌ Failed to repair database:', e)
  } finally {
    await prisma.$disconnect()
  }
}

repair()

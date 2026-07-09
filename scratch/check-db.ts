import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function check() {
  console.log('\n🔍 Inspecting Database for Live App Call Audits...\n')

  try {
    // 1. Check total calls and their status
    const totalCalls = await prisma.call.count()
    console.log(`📊 Total calls in database: ${totalCalls}`)

    const callsByStatus = await prisma.call.groupBy({
      by: ['status'],
      _count: { id: true },
    })

    console.log('📌 Calls by Status:')
    callsByStatus.forEach((group) => {
      console.log(`   - ${group.status}: ${group._count.id}`)
    })

    // 2. Fetch the 5 most recent calls with their analysis details
    const recentCalls = await prisma.call.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        analysis: true,
      },
    })

    console.log('\n📝 5 Most Recent Call Uploads:')
    recentCalls.forEach((call, index) => {
      console.log(`\n[${index + 1}] Title: "${call.title}"`)
      console.log(`    ID: ${call.id}`)
      console.log(`    Status: ${call.status}`)
      console.log(`    Created At: ${call.createdAt.toISOString()}`)
      
      if (call.analysis) {
        const transcript = call.analysis.transcript as any[] || []
        console.log(`    Transcript segments: ${transcript.length}`)
        
        // Check if diarization was applied (if speakers are Agent/Customer or numeric IDs mapped)
        const speakers = Array.from(new Set(transcript.map(t => t.speaker)))
        console.log(`    Speakers detected: ${speakers.join(', ')}`)
        
        if (call.analysis.summary) {
          console.log(`    Summary: "${call.analysis.summary.substring(0, 100)}..."`)
        }
      } else {
        console.log(`    Analysis: None (Pending or Failed)`)
      }
    })

    // 3. Inspect Background Jobs logs
    console.log('\n⚙️ Background Jobs status:')
    const jobs = await prisma.backgroundJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    if (jobs.length === 0) {
      console.log('   No background job records found.')
    } else {
      jobs.forEach((job) => {
        console.log(`   - Call ID: ${job.callId}`)
        console.log(`     Status: ${job.status}`)
        console.log(`     Attempts: ${job.attempts}/${job.maxAttempts}`)
        if (job.lastError) {
          console.log(`     Last Error: ${job.lastError}`)
        }
      })
    }

  } catch (err) {
    console.error('❌ Database query failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

check()

import prisma from '@/lib/db'
import { GeminiService } from '@/services/gemini'
import { sendNotificationEmail } from '@/lib/mail'

export async function enqueueJob(callId: string) {
  // Create job in DB
  await prisma.backgroundJob.upsert({
    where: { callId },
    update: { status: 'PENDING', attempts: 0, lastError: null },
    create: {
      callId,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 3,
    },
  })

  // Start processing in the background (fire and forget)
  triggerProcessing()
}

// Global process flag to prevent multiple concurrent local queue loops
let isProcessingQueue = false

export function triggerProcessing() {
  // Fire and forget
  runQueueProcessor().catch((err) => {
    console.error('[Queue Processor] Critical failure:', err)
  })
}

async function runQueueProcessor() {
  if (isProcessingQueue) return
  isProcessingQueue = true

  try {
    let hasMore = true
    while (hasMore) {
      // Find a pending job
      const nextJob = await prisma.backgroundJob.findFirst({
        where: {
          OR: [
            { status: 'PENDING' },
            {
              status: 'FAILED',
              attempts: { lt: 3 }, // retry failed jobs up to maxAttempts (3)
            },
          ],
        },
        orderBy: { createdAt: 'asc' },
      })

      if (!nextJob) {
        hasMore = false
        break
      }

      // Try to acquire lock by transitioning status to PROCESSING
      const lockAcquired = await prisma.backgroundJob.updateMany({
        where: {
          id: nextJob.id,
          status: nextJob.status, // ensure status hasn't changed
          attempts: nextJob.attempts, // ensure attempts hasn't changed
        },
        data: {
          status: 'PROCESSING',
          attempts: { increment: 1 },
          updatedAt: new Date(),
        },
      })

      if (lockAcquired.count === 0) {
        // Another processor grabbed it
        continue
      }

      // Process the job
      try {
        await processJob(nextJob.callId)

        // Mark job as completed
        await prisma.backgroundJob.update({
          where: { id: nextJob.id },
          data: { status: 'COMPLETED', updatedAt: new Date() },
        })
      } catch (err) {
        const errorMsg = (err as Error).message || String(err)
        console.error(`[Queue Processor] Job failed for call ${nextJob.callId}:`, errorMsg)

        // Mark job as failed/retry-pending
        const nextAttempts = nextJob.attempts + 1
        await prisma.backgroundJob.update({
          where: { id: nextJob.id },
          data: {
            status: nextAttempts >= nextJob.maxAttempts ? 'FAILED' : 'PENDING',
            lastError: errorMsg,
            updatedAt: new Date(),
          },
        })

        // Also update Call status to FAILED if no retries remain
        if (nextAttempts >= nextJob.maxAttempts) {
          try {
            const failedCall = await prisma.call.update({
              where: { id: nextJob.callId },
              data: { status: 'FAILED' },
            })
            
            // Create Upload Failed notification
            const org = await prisma.organization.findUnique({
              where: { id: failedCall.organizationId },
              include: { users: true },
            })
            const adminUser = org?.users.find((u) => u.role === 'ADMIN') || org?.users[0]
            const targetUser = failedCall.agentId || adminUser?.id || ''
            if (targetUser) {
              await prisma.notification.create({
                data: {
                  userId: targetUser,
                  title: 'Upload Failed',
                  message: `Call audit failed: "${failedCall.title || failedCall.filename}" could not be processed. Error: ${errorMsg}`,
                  type: 'SYSTEM_ALERT',
                }
              })
              const userEmail = org?.users.find(u => u.id === targetUser)?.email || adminUser?.email
              if (userEmail) {
                sendNotificationEmail(userEmail, 'Upload Failed', `Call audit failed: "${failedCall.title || failedCall.filename}" could not be processed. Error: ${errorMsg}`)
              }
            }
          } catch (updateErr) {
            console.error('[Queue Processor] Failed to set call status to FAILED:', updateErr)
          }
        }
      }
    }
  } finally {
    isProcessingQueue = false
  }
}

export async function processJob(callId: string) {
  // 1. Fetch the Call
  const call = await prisma.call.findUnique({
    where: { id: callId },
    include: {
      team: {
        include: {
          qaScorecard: true,
        },
      },
    },
  })

  if (!call) throw new Error(`Call record ${callId} not found`)

  // Update call status to PROCESSING
  await prisma.call.update({
    where: { id: callId },
    data: { status: 'PROCESSING' },
  })

  // 2. Load custom scorecard or default
  let activeScorecard = call.team?.qaScorecard || null
  if (!activeScorecard) {
    activeScorecard = await prisma.qAScorecard.findFirst({
      where: {
        organizationId: call.organizationId,
        isArchived: false,
        parentId: null, // Initial or root scorecard
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  const defaultCompliance = [
    'Branded greeting used within first 5 seconds',
    'Recording disclosure stated explicitly',
    'Verify caller account identity and security tokens',
    'Offer standard recap and cancellation timelines',
  ]

  const defaultSoftSkills = [
    'Active Listening & Tone',
    'Professionalism & Empathy',
    'Resolution Speed',
  ]

  const rubric = {
    compliance: activeScorecard
      ? (activeScorecard.complianceItems as string[])
      : defaultCompliance,
    softSkills: activeScorecard
      ? (activeScorecard.softSkillItems as string[])
      : defaultSoftSkills,
  }

  // 2. Download and Analyze
  console.info(`[Queue Processor] Downloading audio file: ${call.fileUrl}`)
  const audioBuffer = await GeminiService.downloadAudio(call.fileUrl)

  const fileExt = call.filename.split('.').pop()?.toLowerCase()
  let mimeType = 'audio/mpeg'
  if (fileExt === 'wav') mimeType = 'audio/wav'
  if (fileExt === 'm4a') mimeType = 'audio/x-m4a'
  if (fileExt === 'aac') mimeType = 'audio/x-aac'

  console.info(`[Queue Processor] Auditing call ${callId} with Gemini API...`)
  const geminiResult = await GeminiService.analyzeCall(audioBuffer, mimeType, rubric)

  const sc = geminiResult.qaScorecard
  const score = Math.round(
    (sc.greeting.score +
      sc.verification.score +
      sc.compliance.score +
      sc.empathy.score +
      sc.listening.score +
      sc.problemSolving.score +
      sc.closing.score +
      sc.professionalism.score) /
      8
  )

  const checklist = {
    greeting: sc.greeting,
    verification: sc.verification,
    compliance: sc.compliance,
    empathy: sc.empathy,
    listening: sc.listening,
    problemSolving: sc.problemSolving,
    closing: sc.closing,
    professionalism: sc.professionalism,
    mistakes: sc.mistakes,
    improvements: sc.improvements,
  }

  // 3. Save Results in transaction
  await prisma.$transaction(async (tx) => {
    // A. Update Call status to COMPLETED and link the used QA Scorecard
    await tx.call.update({
      where: { id: callId },
      data: {
        status: 'COMPLETED',
        qaScorecardId: activeScorecard?.id || null,
      },
    })

    // B. Save Analysis
    await tx.callAnalysis.upsert({
      where: { callId },
      update: {
        summary: geminiResult.summary,
        sentimentOverall: geminiResult.sentimentOverall,
        sentimentScore: geminiResult.sentimentScore,
        transcript: geminiResult.transcript as any,
        coachingTips: geminiResult.coachingTips,
        strengths: geminiResult.strengths,
        improvements: geminiResult.improvements,
        aiCoachReport: geminiResult.aiCoachReport as any,
      },
      create: {
        callId,
        summary: geminiResult.summary,
        sentimentOverall: geminiResult.sentimentOverall,
        sentimentScore: geminiResult.sentimentScore,
        transcript: geminiResult.transcript as any,
        coachingTips: geminiResult.coachingTips,
        strengths: geminiResult.strengths,
        improvements: geminiResult.improvements,
        aiCoachReport: geminiResult.aiCoachReport as any,
      },
    })

    // C. Save QA scorecard
    const existingReport = await tx.qAReport.findFirst({
      where: { callId },
    })

    if (existingReport) {
      await tx.qAReport.update({
        where: { id: existingReport.id },
        data: {
          score,
          checklist: checklist as any,
          feedback: `Detailed QA Scorecard completed by Gemini. Overall Audit Score: ${score}%. Identified mistakes and suggested improvements registered.`,
        },
      })
    } else {
      // Find admin user for organization to assign as reviewer
      const org = await tx.organization.findUnique({
        where: { id: call.organizationId },
        include: { users: true },
      })
      const adminUser = org?.users.find((u) => u.role === 'ADMIN') || org?.users[0]
      await tx.qAReport.create({
        data: {
          callId,
          reviewerId: adminUser?.id || null,
          score,
          checklist: checklist as any,
          feedback: `Detailed QA Scorecard completed by Gemini. Overall Audit Score: ${score}%. Identified mistakes and suggested improvements registered.`,
        },
      })
    }

    // D. Save CRM Notes
    await tx.cRMNote.upsert({
      where: { callId },
      update: {
        summary: geminiResult.crmNotes.summary,
        keyPoints: geminiResult.crmNotes.keyPoints,
        actionItems: geminiResult.crmNotes.actionItems,
        customerName: geminiResult.crmNotes.customerName,
        agentName: geminiResult.crmNotes.agentName,
        callPurpose: geminiResult.crmNotes.callPurpose,
        issue: geminiResult.crmNotes.issue,
        resolution: geminiResult.crmNotes.resolution,
        followUp: geminiResult.crmNotes.followUp,
        productsMentioned: geminiResult.crmNotes.productsMentioned,
        callDuration: geminiResult.crmNotes.callDuration,
        importantNotes: geminiResult.crmNotes.importantNotes,
      },
      create: {
        callId,
        summary: geminiResult.crmNotes.summary,
        keyPoints: geminiResult.crmNotes.keyPoints,
        actionItems: geminiResult.crmNotes.actionItems,
        customerName: geminiResult.crmNotes.customerName,
        agentName: geminiResult.crmNotes.agentName,
        callPurpose: geminiResult.crmNotes.callPurpose,
        issue: geminiResult.crmNotes.issue,
        resolution: geminiResult.crmNotes.resolution,
        followUp: geminiResult.crmNotes.followUp,
        productsMentioned: geminiResult.crmNotes.productsMentioned,
        callDuration: geminiResult.crmNotes.callDuration,
        importantNotes: geminiResult.crmNotes.importantNotes,
      },
    })
  })

  // 4. Send Notifications
  try {
    const org = await prisma.organization.findUnique({
      where: { id: call.organizationId },
      include: { users: true },
    })
    const adminUser = org?.users.find((u) => u.role === 'ADMIN') || org?.users[0]
    const targetUser = call.agentId || adminUser?.id || ''
    const userEmail = org?.users.find((u) => u.id === targetUser)?.email || adminUser?.email

    if (targetUser) {
      // Complete notification
      const completeMsg = `Call audit complete: "${call.title || call.filename}" has been analyzed with a score of ${score}%.`
      await prisma.notification.create({
        data: {
          userId: targetUser,
          title: 'Analysis Complete',
          message: completeMsg,
          type: 'CALL_PROCESSED',
        }
      })
      if (userEmail) {
        sendNotificationEmail(userEmail, 'Analysis Complete', completeMsg)
      }

      // Low QA Score check (< 80)
      if (score < 80) {
        const lowScoreMsg = `Performance warning: Call "${call.title || call.filename}" scored ${score}%, which is below the satisfactory threshold.`
        await prisma.notification.create({
          data: {
            userId: targetUser,
            title: 'Low QA Score Alert',
            message: lowScoreMsg,
            type: 'QA_COMPLETED',
          }
        })
        if (userEmail) {
          sendNotificationEmail(userEmail, 'Low QA Score Alert', lowScoreMsg)
        }
      }
    }
  } catch (notifErr) {
    console.error('[Queue Processor] Failed to generate notifications:', notifErr)
  }

  console.info(`[Queue Processor] Call ${callId} processing completed successfully.`)
}

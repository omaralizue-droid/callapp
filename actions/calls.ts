'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { GeminiService } from '@/services/gemini'
import { checkLimit } from '@/services/usage'
import { enqueueJob } from '@/lib/queue'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/db'

interface CreateCallInput {
  title: string
  filename: string
  fileUrl: string
  fileSize: number
  duration: number
  customerName?: string
  customerId?: string
  agentId?: string
}

export async function createCallAction(input: CreateCallInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication required' }
  }

  let organizationId = ''

  if (process.env.DEV_AUTH_BYPASS !== 'false') {
    try {
      let org = await prisma.organization.findFirst()
      if (!org) {
        org = await prisma.organization.create({
          data: {
            id: 'dev-org-id',
            name: 'CallPilot Demo',
            slug: 'callpilot-demo'
          }
        })
      }
      organizationId = org.id

      const devProfile = await prisma.user.findUnique({
        where: { id: user.id }
      })
      if (!devProfile) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || 'omaralizue@gmail.com',
            supabaseId: user.id,
            role: 'ADMIN',
            organizationId: organizationId
          }
        })
      }

      // Ensure the selected agent exists in the database to avoid foreign key violations
      if (input.agentId) {
        const agentProfile = await prisma.user.findUnique({
          where: { id: input.agentId }
        })
        if (!agentProfile) {
          let agentName = 'Mock Agent'
          if (input.agentId === 'agent-1') agentName = 'Alex Rodriguez'
          else if (input.agentId === 'agent-2') agentName = 'Lisa Miller'
          else if (input.agentId === 'agent-3') agentName = 'David Kim'

          const names = agentName.split(' ')
          await prisma.user.create({
            data: {
              id: input.agentId,
              email: `${input.agentId}@example.com`,
              supabaseId: input.agentId,
              firstName: names[0],
              lastName: names[1] || '',
              role: 'AGENT',
              organizationId: organizationId
            }
          })
        }
      }
    } catch (e) {
      console.error('Failed to auto-provision mock database records under bypass:', e)
      organizationId = 'dev-org-id'
    }
  } else {
    // Retrieve user's organization
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organizationId: true },
    })

    if (!dbUser || !dbUser.organizationId) {
      return { error: 'User does not belong to any organization' }
    }
    organizationId = dbUser.organizationId
  }

  // ── Enforce Limits ──────────────────────────────────────────────────────────
  const callsLimitCheck = await checkLimit(organizationId, 'calls', 1)
  if (!callsLimitCheck.allowed) {
    return { error: 'Call limit exceeded. Please upgrade your plan.' }
  }

  const storageLimitCheck = await checkLimit(organizationId, 'storage', input.fileSize)
  if (!storageLimitCheck.allowed) {
    return { error: 'Storage limit exceeded. Please upgrade your plan.' }
  }

  const aiRequestsLimitCheck = await checkLimit(organizationId, 'aiRequests', 1)
  if (!aiRequestsLimitCheck.allowed) {
    return { error: 'AI requests limit exceeded. Please upgrade your plan.' }
  }

  const reportsLimitCheck = await checkLimit(organizationId, 'reports', 1)
  if (!reportsLimitCheck.allowed) {
    return { error: 'QA reports limit exceeded. Please upgrade your plan.' }
  }

  // Setup Default Fallback Mock Metrics
  let summary = 'The client disputed a subscription billing charge. The agent handled verification correctly and processed a partial refund matching guidelines.'
  let sentimentOverall: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL'
  let sentimentScore = 0.1
  let transcript: Prisma.InputJsonValue = [
    { speaker: 'Agent', text: 'Hello, thank you for calling support. My name is Alex, how may I help you today?', start: 1, end: 7, sentiment: 'positive', emotion: 'Neutral', turningPoint: false },
    { speaker: 'Customer', text: 'Hi, I see a charge on my card for $49 and I want to request a refund. I cancelled my subscription last month.', start: 8, end: 14, sentiment: 'negative', emotion: 'Angry', turningPoint: false },
    { speaker: 'Agent', text: 'I understand your frustration. Let me help check your profile. May I please verify your full name and security account PIN first?', start: 15, end: 21, sentiment: 'neutral', emotion: 'Neutral', turningPoint: false },
    { speaker: 'Customer', text: 'Yes, Marcus Vance, PIN 9821.', start: 22, end: 25, sentiment: 'neutral', emotion: 'Neutral', turningPoint: false },
    { speaker: 'Agent', text: 'Thank you Marcus, I see your cancellation was pending. I will submit the refund now, it will take 2-3 days.', start: 26, end: 32, sentiment: 'positive', emotion: 'Neutral', turningPoint: true },
  ]
  let coachingTips = [
    'Try to verify identity slightly faster next time.',
    'Confirm refund timelines clearly at call wrap.',
  ]
  let strengths = ['Polite greeting', 'Identity verification adherence']
  let improvements = ['Reducing handle time']
  
  // Detailed QA Scorecard variables
  let score = 92
  let checklist: Prisma.InputJsonValue = {
    greeting: { score: 95, explanation: 'Agent used a clear, branded greeting within the first 3 seconds of the call.' },
    verification: { score: 100, explanation: 'Caller identity verified successfully matching account guidelines.' },
    compliance: { score: 90, explanation: 'Standard call recording disclosure stated properly.' },
    empathy: { score: 95, explanation: 'Agent showed empathy during customer billing frustration.' },
    listening: { score: 85, explanation: 'Good active listening, though could cut down handle times slightly.' },
    problemSolving: { score: 90, explanation: 'Offered solid platform billing optimization tier plans.' },
    closing: { score: 95, explanation: 'Polite wrap up and cancellation status confirmed.' },
    professionalism: { score: 95, explanation: 'Maintained a professional, supportive tone throughout dialogue.' },
    mistakes: [
      'Initially missed validating alternative contact email address.',
    ],
    improvements: [
      'Try to mention refund timeline clear constraints early in the call.',
    ],
  }
  let feedback = 'Great compliance adherence. The agent verified the caller properly and resolved the issue efficiently.'
  
  // CRM Structured Fields
  let crmSummary = 'Billing issue resolved. Refund of $49 processed.'
  let crmKeyPoints: Prisma.InputJsonValue = ['Subscription cancelled', 'Identity verified', 'Refund requested and approved']
  let crmActionItems: Prisma.InputJsonValue = ['Verify billing log updates in 3 days']
  let crmCustomerName = 'Marcus Vance'
  let crmAgentName = 'Alex Rodriguez'
  let crmCallPurpose = 'Subscription billing refund dispute'
  let crmIssue = 'Charged $49 for subscription that customer cancelled last month.'
  let crmResolution = 'Verified customer name and PIN. Issued a refund of $49 to the customer card.'
  let crmFollowUp = 'Verify cancellation database sync in 3 business days.'
  let crmProductsMentioned: Prisma.InputJsonValue = ['Premium Support Subscription']
  let crmCallDuration = 182
  let crmImportantNotes = 'Customer requested email confirmation of the refund. PIN verification was successful.'

  // AI Coach default report values
  let aiCoachReport: Prisma.InputJsonValue = {
    detections: {
      interruptionsCount: 1,
      longSilencesCount: 1,
      wrongToneCount: 1,
      missedScriptCount: 1,
      missedComplianceCount: 0,
      details: [
        { type: 'interruption', timestamp: '0:08', seconds: 8, description: 'Agent spoke over customer while they were explaining the billing dispute details.' },
        { type: 'silence', timestamp: '0:22', seconds: 22, description: 'Long silence of 5.2 seconds while looking up account details without narrating action.' },
        { type: 'tone', timestamp: '0:15', seconds: 15, description: 'Agent used slightly monotone, scripted tone during identity checks.' },
        { type: 'script', timestamp: '0:26', seconds: 26, description: 'Failed to mention key loyalty contract renewal conditions explicitly.' }
      ]
    },
    insights: [
      {
        id: 'c-1',
        timestamp: '0:08',
        seconds: 8,
        originalTurn: 'Hi, I see a charge on my card for $49...',
        coachingAdvice: 'Avoid interrupting customers when they are venting frustrations. Interrupting signals defensiveness and can escalate customer irritation.',
        betterResponse: 'I hear you, and I completely understand wanting to get that refund sorted out immediately. Let me check the details on your subscription renewal contract.',
        rationale: 'Allowing the caller to finish voicing their issue creates a baseline of trust and validates their customer experience.'
      },
      {
        id: 'c-2',
        timestamp: '0:15',
        seconds: 15,
        originalTurn: 'May I please verify your full name and security account PIN first?',
        coachingAdvice: 'During security checks, keep a conversational, warm tone. A robotic delivery feels impersonal and checklist-driven.',
        betterResponse: 'To make sure we are looking at the correct account, would you mind sharing your name and account PIN? I will pull up your cancellation history immediately.',
        rationale: 'Injecting warmth into compliance steps reduces friction and keeps the customer cooperative.'
      }
    ]
  }

  const isBypass = process.env.DEV_AUTH_BYPASS === 'true'

  if (!process.env.GEMINI_API_KEY && !isBypass) {
    return { error: 'GEMINI_API_KEY is not configured in your Vercel/local environment variables. Please add it to your project settings.' }
  }

  // 1. Queue Gemini background processing job
  try {
    const call = await prisma.$transaction(async (tx) => {
      // Create Call record in PENDING state
      const newCall = await tx.call.create({
        data: {
          title: input.title,
          filename: input.filename,
          fileUrl: input.fileUrl,
          fileSize: input.fileSize,
          duration: input.duration,
          status: 'PENDING',
          customerName: input.customerName || 'Unknown Customer',
          customerId: input.customerId || 'CUST-0000',
          organizationId: organizationId,
          agentId: input.agentId || null,
        },
      })

      // Increment usage counters & save usage logs
      await tx.organization.update({
        where: { id: organizationId },
        data: {
          usedCalls: { increment: 1 },
          storageUsedBytes: { increment: input.fileSize },
          aiRequestsUsed: { increment: 1 },
          reportsUsed: { increment: 1 },
        },
      })

      await tx.usageLog.createMany({
        data: [
          {
            organizationId,
            type: 'CALL',
            amount: 1,
            description: 'Call uploaded and queued',
          },
          {
            organizationId,
            type: 'STORAGE',
            amount: input.fileSize,
            description: `Storage reserved by ${(input.fileSize / 1024 / 1024).toFixed(2)} MB`,
          },
          {
            organizationId,
            type: 'AI_REQUEST',
            amount: 1,
            description: 'Gemini AI analysis queued',
          },
          {
            organizationId,
            type: 'REPORT',
            amount: 1,
            description: 'QA report queued',
          },
        ],
      })

      return newCall
    })

    // Enqueue the background processing task (starts processing asynchronously)
    await enqueueJob(call.id)

    revalidatePath('/dashboard/overview')
    revalidatePath('/dashboard/calls')
    return { success: true, callId: call.id }
  } catch (err) {
    console.error('Failed to queue call record in transaction:', err)
    return { error: (err as Error).message || 'Database transaction error' }
  }
}

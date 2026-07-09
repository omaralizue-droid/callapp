import prisma from '@/lib/db'

// ── Plan Limits Configuration ──────────────────────────────────────────────
// Centralized limits per plan (must stay in sync with services/stripe.ts STRIPE_PLANS)
export interface PlanLimits {
  calls: number
  storageBytes: number  // in bytes
  aiRequests: number
  agents: number
  reports: number
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  starter: {
    calls: 100,
    storageBytes: 5 * 1024 * 1024 * 1024,  // 5 GB
    aiRequests: 100,
    agents: 5,
    reports: 50,
  },
  growth: {
    calls: 500,
    storageBytes: 25 * 1024 * 1024 * 1024,  // 25 GB
    aiRequests: 500,
    agents: 25,
    reports: 250,
  },
  business: {
    calls: 2500,
    storageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
    aiRequests: 2500,
    agents: 100,
    reports: 1000,
  },
  enterprise: {
    calls: 999999,
    storageBytes: 1024 * 1024 * 1024 * 1024, // 1 TB
    aiRequests: 999999,
    agents: 999999,
    reports: 999999,
  },
}

export async function getPlanLimits(planName: string): Promise<PlanLimits> {
  const key = planName.toLowerCase()
  return PLAN_LIMITS[key] || PLAN_LIMITS.starter
}

// ── Usage Status Interface ─────────────────────────────────────────────────
export interface UsageStatus {
  calls: { used: number; limit: number; exceeded: boolean }
  storage: { used: number; limit: number; exceeded: boolean }  // bytes
  aiRequests: { used: number; limit: number; exceeded: boolean }
  agents: { used: number; limit: number; exceeded: boolean }
  reports: { used: number; limit: number; exceeded: boolean }
  planName: string
  planStatus: string
}

// ── Check Usage Limits ────────────────────────────────────────────────────
export async function getUsageStatus(organizationId: string): Promise<UsageStatus> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      planName: true,
      planStatus: true,
      callLimit: true,
      usedCalls: true,
      storageLimit: true,
      storageUsedBytes: true,
      aiRequestsLimit: true,
      aiRequestsUsed: true,
      agentsLimit: true,
      agentsUsed: true,
      reportsLimit: true,
      reportsUsed: true,
    },
  })

  if (!org) {
    // Return default starter limits if org not found
    const defaults = PLAN_LIMITS.starter
    return {
      calls: { used: 0, limit: defaults.calls, exceeded: false },
      storage: { used: 0, limit: defaults.storageBytes, exceeded: false },
      aiRequests: { used: 0, limit: defaults.aiRequests, exceeded: false },
      agents: { used: 0, limit: defaults.agents, exceeded: false },
      reports: { used: 0, limit: defaults.reports, exceeded: false },
      planName: 'Starter',
      planStatus: 'TRIAL',
    }
  }

  // Convert BigInt values to Number for JSON serialization
  const storageUsed = Number(org.storageUsedBytes)
  const storageLimit = Number(org.storageLimit)

  return {
    calls: {
      used: org.usedCalls,
      limit: org.callLimit,
      exceeded: org.usedCalls >= org.callLimit,
    },
    storage: {
      used: storageUsed,
      limit: storageLimit,
      exceeded: storageUsed >= storageLimit,
    },
    aiRequests: {
      used: org.aiRequestsUsed,
      limit: org.aiRequestsLimit,
      exceeded: org.aiRequestsUsed >= org.aiRequestsLimit,
    },
    agents: {
      used: org.agentsUsed,
      limit: org.agentsLimit,
      exceeded: org.agentsUsed >= org.agentsLimit,
    },
    reports: {
      used: org.reportsUsed,
      limit: org.reportsLimit,
      exceeded: org.reportsUsed >= org.reportsLimit,
    },
    planName: org.planName,
    planStatus: org.planStatus,
  }
}

// ── Check Single Limit ────────────────────────────────────────────────────
export type UsageMetric = 'calls' | 'storage' | 'aiRequests' | 'agents' | 'reports'

export async function checkLimit(
  organizationId: string,
  metric: UsageMetric,
  additionalAmount: number = 1
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const status = await getUsageStatus(organizationId)
  const m = status[metric]
  return {
    allowed: m.used + additionalAmount <= m.limit,
    used: m.used,
    limit: m.limit,
  }
}

// ── Increment Usage Counters ──────────────────────────────────────────────
export async function incrementCallUsage(organizationId: string, amount: number = 1) {
  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: { usedCalls: { increment: amount } },
    }),
    prisma.usageLog.create({
      data: {
        organizationId,
        type: 'CALL',
        amount,
        description: 'Call uploaded and analyzed',
      },
    }),
  ])
}

export async function incrementStorageUsage(organizationId: string, bytes: number) {
  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: { storageUsedBytes: { increment: bytes } },
    }),
    prisma.usageLog.create({
      data: {
        organizationId,
        type: 'STORAGE',
        amount: bytes,
        description: `Storage increased by ${(bytes / 1024 / 1024).toFixed(2)} MB`,
      },
    }),
  ])
}

export async function incrementAIRequestUsage(organizationId: string, amount: number = 1) {
  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: { aiRequestsUsed: { increment: amount } },
    }),
    prisma.usageLog.create({
      data: {
        organizationId,
        type: 'AI_REQUEST',
        amount,
        description: 'Gemini AI analysis request',
      },
    }),
  ])
}

export async function incrementAgentUsage(organizationId: string, amount: number = 1) {
  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: { agentsUsed: { increment: amount } },
    }),
    prisma.usageLog.create({
      data: {
        organizationId,
        type: 'AGENT',
        amount,
        description: 'New agent added',
      },
    }),
  ])
}

export async function incrementReportUsage(organizationId: string, amount: number = 1) {
  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: { reportsUsed: { increment: amount } },
    }),
    prisma.usageLog.create({
      data: {
        organizationId,
        type: 'REPORT',
        amount,
        description: 'QA report generated',
      },
    }),
  ])
}

// ── Reset Monthly Usage ───────────────────────────────────────────────────
export async function resetMonthlyUsage(organizationId: string) {
  // Calculate next reset date (first day of next month)
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      usedCalls: 0,
      storageUsedBytes: 0,
      aiRequestsUsed: 0,
      agentsUsed: 0,
      reportsUsed: 0,
      usageResetAt: nextMonth,
    },
  })
}

// ── Sync Plan Limits After Plan Change ────────────────────────────────────
// Called after a Stripe subscription update to set the new limit values
export async function syncPlanLimits(organizationId: string, planName: string) {
  const limits = await getPlanLimits(planName)
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      callLimit: limits.calls,
      storageLimit: limits.storageBytes,
      aiRequestsLimit: limits.aiRequests,
      agentsLimit: limits.agents,
      reportsLimit: limits.reports,
    },
  })
}

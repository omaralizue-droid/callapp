import { assertRole } from '@/lib/rbac'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import CoachDashboardClient from '@/components/dashboard/CoachDashboardClient'
import { AICoachReport } from '@/types/calls'

export const revalidate = 0

export default async function CoachPage() {
  const profile = await assertRole(['ADMIN', 'MANAGER', 'QA', 'AGENT'])

  // Fetch all call analyses for this organization
  const dbCalls = await prisma.call.findMany({
    where: {
      organizationId: profile.organizationId || undefined,
      agentId: profile.role === 'AGENT' ? profile.id : undefined,
      isDeleted: false,
      status: 'COMPLETED',
    },
    include: {
      analysis: true,
      agent: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Format the database records to match our UI expectations
  const parsedCalls = dbCalls.map((c: Prisma.CallGetPayload<{ include: { analysis: true; agent: true } }>) => {
    let report: AICoachReport | null = null
    if (c.analysis && c.analysis.aiCoachReport) {
      try {
        report = (typeof c.analysis.aiCoachReport === 'string'
          ? JSON.parse(c.analysis.aiCoachReport)
          : c.analysis.aiCoachReport) as unknown as AICoachReport
      } catch (e) {
        console.error('Failed to parse aiCoachReport JSON:', e)
      }
    }
    return {
      id: c.id,
      title: c.title || c.filename,
      agentName: c.agent ? `${c.agent.firstName} ${c.agent.lastName}` : 'Unassigned',
      createdAt: c.createdAt.toISOString(),
      aiCoachReport: report
    }
  })

  return <CoachDashboardClient initialCalls={parsedCalls} userRole={profile.role} />
}

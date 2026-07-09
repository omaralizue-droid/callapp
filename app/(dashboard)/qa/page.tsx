import { assertRole } from '@/lib/rbac'
import prisma from '@/lib/db'
import QAGradingConsole from '@/components/dashboard/QAGradingConsole'

export const revalidate = 0

export default async function QABoardPage() {
  const profile = await assertRole(['ADMIN', 'MANAGER', 'QA'])
  const organizationId = profile.organizationId

  // Fetch pending and processing calls from the database
  const pendingCalls = organizationId
    ? await prisma.call.findMany({
        where: {
          organizationId,
          status: { in: ['PENDING', 'PROCESSING'] },
          isDeleted: false,
        },
        include: {
          agent: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  // Fetch custom scorecards
  const scorecards = organizationId
    ? await prisma.qAScorecard.findMany({
        where: { organizationId },
        orderBy: { updatedAt: 'desc' },
      })
    : []

  // Fetch teams for rubric assignment
  const teams = organizationId
    ? await prisma.team.findMany({
        where: {
          organizationId,
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          qaScorecardId: true,
        },
        orderBy: { name: 'asc' },
      })
    : []

  // Convert BigInt duration or fields if needed (duration is Float/Int so it is fine, no BigInt issues)
  return (
    <QAGradingConsole
      pendingCalls={pendingCalls as any}
      scorecards={scorecards as any}
      teams={teams as any}
    />
  )
}

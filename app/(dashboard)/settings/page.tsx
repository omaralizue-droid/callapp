import { assertRole } from '@/lib/rbac'
import SettingsForm from '@/components/dashboard/SettingsForm'
import prisma from '@/lib/db'
import { resolveBranding } from '@/lib/branding'

export const revalidate = 0

export default async function SettingsPage() {
  // Guard route - only ADMIN or MANAGER can access settings
  const profile = await assertRole(['ADMIN', 'MANAGER'])
  const orgId = profile.organizationId

  let initialBilling = {
    planName: 'Starter',
    planStatus: 'TRIAL',
    stripeCurrentPeriodEnd: null as string | null,
    stripeCancelAtPeriodEnd: false,
    callLimit: 100,
    usedCalls: 0,
    storageLimit: 5368709120,
    storageUsedBytes: 0,
    aiRequestsLimit: 100,
    aiRequestsUsed: 0,
    agentsLimit: 5,
    agentsUsed: 0,
    reportsLimit: 50,
    reportsUsed: 0,
    paymentHistories: [] as Array<{
      invoice: string
      date: string
      amount: string
      status: string
    }>,
  }

  if (orgId) {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        paymentHistories: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (org) {
      const databaseAgentCount = await prisma.user.count({
        where: { organizationId: orgId, role: 'AGENT' }
      })

      initialBilling = {
        planName: org.planName,
        planStatus: org.planStatus,
        stripeCurrentPeriodEnd: org.stripeCurrentPeriodEnd ? org.stripeCurrentPeriodEnd.toISOString() : null,
        stripeCancelAtPeriodEnd: org.stripeCancelAtPeriodEnd,
        callLimit: org.callLimit,
        usedCalls: org.usedCalls,
        storageLimit: Number(org.storageLimit),
        storageUsedBytes: Number(org.storageUsedBytes),
        aiRequestsLimit: org.aiRequestsLimit,
        aiRequestsUsed: org.aiRequestsUsed,
        agentsLimit: org.agentsLimit,
        agentsUsed: Math.max(org.agentsUsed, databaseAgentCount),
        reportsLimit: org.reportsLimit,
        reportsUsed: org.reportsUsed,
        paymentHistories: org.paymentHistories.map(p => ({
          invoice: p.stripeInvoiceId,
          date: p.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          amount: `$${p.amount.toFixed(2)}`,
          status: p.status,
        })),
      }
    }
  }

  // Fetch white-label branding
  const brandingOrg = orgId
    ? await prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          brandName:            true,
          brandLogoUrl:         true,
          brandColor:           true,
          brandColorDark:       true,
          emailFromName:        true,
          emailFooterText:      true,
          customDomain:         true,
          customDomainVerified: true,
        },
      })
    : null
  const initialBranding = resolveBranding(brandingOrg)

  // Fetch real users
  const users = orgId
    ? await prisma.user.findMany({
        where: { organizationId: orgId, isDeleted: false },
        include: { team: true },
        orderBy: { firstName: 'asc' },
      })
    : []

  const mappedUsers = users.map(u => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    team: u.team?.name || 'No team assigned',
  }))

  // Fetch invitations
  const invitations = orgId
    ? await prisma.organizationInvitation.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const mappedInvitations = invitations.map(i => ({
    id: i.id,
    email: i.email,
    role: i.role,
    isAccepted: i.isAccepted,
    isRevoked: i.isRevoked,
    expiresAt: i.expiresAt.toISOString(),
    createdAt: i.createdAt.toISOString(),
  }))

  // Fetch teams
  const dbTeams = orgId
    ? await prisma.team.findMany({
        where: { organizationId: orgId, isDeleted: false },
        include: { users: true },
        orderBy: { name: 'asc' },
      })
    : []

  const mappedTeams = dbTeams.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    membersCount: t.users.length,
  }))

  // Fetch API keys (metadata only — no secret hashes)
  const dbApiKeys = orgId
    ? await prisma.apiKey.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { auditLogs: true } },
        },
      })
    : []

  const mappedApiKeys = dbApiKeys.map(k => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix,
    scopes: k.scopes,
    rateLimitRpm: k.rateLimitRpm,
    isRevoked: k.isRevoked,
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    expiresAt: k.expiresAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
    auditLogCount: k._count.auditLogs,
  }))

  return (
    <SettingsForm
      initialBilling={initialBilling}
      currentUserRole={profile.role}
      initialUsers={mappedUsers}
      initialInvitations={mappedInvitations}
      initialTeams={mappedTeams}
      initialApiKeys={mappedApiKeys}
      initialBranding={initialBranding}
    />
  )
}

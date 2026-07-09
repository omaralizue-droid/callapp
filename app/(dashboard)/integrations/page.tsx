import { assertRole } from '@/lib/rbac'
import prisma from '@/lib/db'
import IntegrationsPage from '@/components/dashboard/IntegrationsPage'
import type { IntegrationRow } from '@/actions/integrations'

export const revalidate = 0

export default async function IntegrationsPageRoute() {
  const profile = await assertRole(['ADMIN', 'MANAGER'])
  const orgId = profile.organizationId

  const dbIntegrations = orgId
    ? await prisma.integration.findMany({
        where: { organizationId: orgId },
        orderBy: { provider: 'asc' },
      })
    : []

  const initialIntegrations: IntegrationRow[] = dbIntegrations.map(i => ({
    id: i.id,
    provider: i.provider,
    name: i.name,
    isEnabled: i.isEnabled,
    config: (i.config ?? {}) as Record<string, string>,
    status: i.status,
    lastSyncAt: i.lastSyncAt?.toISOString() ?? null,
    errorMessage: i.errorMessage,
    createdById: i.createdById,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }))

  return (
    <IntegrationsPage
      initialIntegrations={initialIntegrations}
      currentUserRole={profile.role}
    />
  )
}

'use server'

import prisma from '@/lib/db'
import { assertRole } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import type { IntegrationProvider } from '@/lib/integrations/registry'
import { testIntegrationConnection } from '@/services/integrations'

// Serializable integration shape (no Prisma-specific types)
export type IntegrationRow = {
  id: string
  provider: string
  name: string
  isEnabled: boolean
  config: Record<string, string>
  status: string
  lastSyncAt: string | null
  errorMessage: string | null
  createdById: string | null
  createdAt: string
  updatedAt: string
}

function mapIntegration(i: {
  id: string
  provider: string
  name: string
  isEnabled: boolean
  config: unknown
  status: string
  lastSyncAt: Date | null
  errorMessage: string | null
  createdById: string | null
  createdAt: Date
  updatedAt: Date
}): IntegrationRow {
  return {
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
  }
}

// ─── List all integrations for the org ───────────────────────────────────────
export async function listIntegrationsAction(): Promise<{ integrations: IntegrationRow[]; error?: string }> {
  const profile = await assertRole(['ADMIN', 'MANAGER'])
  const orgId = profile.organizationId
  if (!orgId) return { integrations: [], error: 'No organization context.' }

  try {
    const rows = await prisma.integration.findMany({
      where: { organizationId: orgId },
      orderBy: { provider: 'asc' },
    })
    return { integrations: rows.map(mapIntegration) }
  } catch (err) {
    return { integrations: [], error: (err as Error).message }
  }
}

// ─── Create a new integration ─────────────────────────────────────────────────
export async function createIntegrationAction(data: {
  provider: IntegrationProvider
  name: string
  config: Record<string, string>
}): Promise<{ integration?: IntegrationRow; error?: string }> {
  const profile = await assertRole(['ADMIN'])
  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.' }

  if (!data.provider) return { error: 'Provider is required.' }
  if (!data.name?.trim()) return { error: 'Integration name is required.' }

  try {
    const row = await prisma.integration.create({
      data: {
        provider: data.provider,
        name: data.name.trim(),
        config: data.config,
        status: 'DISCONNECTED',
        organizationId: orgId,
        createdById: profile.id,
      },
    })
    revalidatePath('/dashboard/integrations')
    return { integration: mapIntegration(row) }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Update an integration's config or enable state ──────────────────────────
export async function updateIntegrationAction(
  id: string,
  data: {
    name?: string
    config?: Record<string, string>
    isEnabled?: boolean
    status?: string
  },
): Promise<{ integration?: IntegrationRow; error?: string }> {
  const profile = await assertRole(['ADMIN'])

  // Verify ownership
  const existing = await prisma.integration.findUnique({ where: { id }, select: { organizationId: true } })
  if (!existing || existing.organizationId !== profile.organizationId) {
    return { error: 'Integration not found or unauthorized.' }
  }

  try {
    const row = await prisma.integration.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.config !== undefined && { config: data.config }),
        ...(data.isEnabled !== undefined && { isEnabled: data.isEnabled }),
        ...(data.status !== undefined && { status: data.status }),
      },
    })
    revalidatePath('/dashboard/integrations')
    return { integration: mapIntegration(row) }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Delete (disconnect) an integration ──────────────────────────────────────
export async function deleteIntegrationAction(id: string): Promise<{ success?: boolean; error?: string }> {
  const profile = await assertRole(['ADMIN'])

  const existing = await prisma.integration.findUnique({ where: { id }, select: { organizationId: true } })
  if (!existing || existing.organizationId !== profile.organizationId) {
    return { error: 'Integration not found or unauthorized.' }
  }

  try {
    await prisma.integration.delete({ where: { id } })
    revalidatePath('/dashboard/integrations')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Toggle enabled state ─────────────────────────────────────────────────────
export async function toggleIntegrationAction(
  id: string,
  enabled: boolean,
): Promise<{ integration?: IntegrationRow; error?: string }> {
  return updateIntegrationAction(id, { isEnabled: enabled })
}

// ─── Test connection ──────────────────────────────────────────────────────────
export async function testIntegrationAction(
  id: string,
): Promise<{ success: boolean; simulated: boolean; message: string; error?: string }> {
  const profile = await assertRole(['ADMIN'])

  const integration = await prisma.integration.findUnique({ where: { id } })
  if (!integration || integration.organizationId !== profile.organizationId) {
    return { success: false, simulated: false, message: '', error: 'Integration not found or unauthorized.' }
  }

  try {
    const result = await testIntegrationConnection(integration)

    // Update status based on test result
    await prisma.integration.update({
      where: { id },
      data: {
        status: result.success ? 'CONNECTED' : 'ERROR',
        lastSyncAt: result.success ? new Date() : undefined,
        errorMessage: result.success ? null : result.message,
      },
    })

    revalidatePath('/dashboard/integrations')
    return result
  } catch (err) {
    return { success: false, simulated: false, message: (err as Error).message, error: (err as Error).message }
  }
}

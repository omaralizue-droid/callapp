'use server'

import prisma from '@/lib/db'
import { assertRole } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

// Available scopes
export const API_SCOPES = [
  { id: 'calls:read',      label: 'Calls — Read',      description: 'Read call records and metadata' },
  { id: 'calls:write',     label: 'Calls — Write',     description: 'Upload and modify call records' },
  { id: 'qa:read',         label: 'QA — Read',         description: 'Read QA reports and scores' },
  { id: 'reports:read',    label: 'Reports — Read',    description: 'Access analytics reports' },
  { id: 'analytics:read',  label: 'Analytics — Read',  description: 'Read analytics data' },
  { id: 'upload:write',    label: 'Upload — Write',    description: 'Upload audio files for processing' },
] as const

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

function generateRawKey(): string {
  const random = crypto.randomBytes(24).toString('hex')
  return `cp_live_${random}`
}

// ─── Generate a new API Key ─────────────────────────────────────────────────
export async function generateApiKeyAction(data: {
  name: string
  scopes: string[]
  rateLimitRpm: number
  expiresAt?: string | null
}) {
  const profile = await assertRole(['ADMIN'])
  if (profile.role !== 'ADMIN' && profile.role !== 'OWNER') {
    return { error: 'Only administrators can manage API keys.' }
  }

  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.' }

  if (!data.name?.trim()) return { error: 'Key name is required.' }
  if (!data.scopes?.length) return { error: 'At least one scope must be selected.' }

  const rawKey = generateRawKey()
  const keyHash = hashKey(rawKey)
  const keyPrefix = rawKey.slice(0, 16) // "cp_live_" + 8 hex chars

  try {
    const apiKey = await prisma.apiKey.create({
      data: {
        name: data.name.trim(),
        keyPrefix,
        keyHash,
        scopes: data.scopes,
        rateLimitRpm: data.rateLimitRpm,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        organizationId: orgId,
        createdById: profile.id,
      },
    })

    // Write audit log
    await prisma.apiKeyAuditLog.create({
      data: {
        apiKeyId: apiKey.id,
        action: 'CREATED',
        performedById: profile.id,
        details: `Key "${apiKey.name}" created with scopes: ${data.scopes.join(', ')}`,
      },
    })

    revalidatePath('/dashboard/settings')

    // Return the raw key ONCE — it will never be retrievable again
    return {
      success: true,
      rawKey,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        keyPrefix: apiKey.keyPrefix,
        scopes: apiKey.scopes,
        rateLimitRpm: apiKey.rateLimitRpm,
        isRevoked: apiKey.isRevoked,
        lastUsedAt: apiKey.lastUsedAt?.toISOString() ?? null,
        expiresAt: apiKey.expiresAt?.toISOString() ?? null,
        createdAt: apiKey.createdAt.toISOString(),
      },
    }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

// ─── List API Keys (no secret values) ───────────────────────────────────────
export async function listApiKeysAction() {
  const profile = await assertRole(['ADMIN'])
  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.', keys: [] }

  try {
    const keys = await prisma.apiKey.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        rateLimitRpm: true,
        isRevoked: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        createdById: true,
        _count: { select: { auditLogs: true } },
      },
    })

    return {
      keys: keys.map(k => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        scopes: k.scopes,
        rateLimitRpm: k.rateLimitRpm,
        isRevoked: k.isRevoked,
        lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
        expiresAt: k.expiresAt?.toISOString() ?? null,
        createdAt: k.createdAt.toISOString(),
        createdById: k.createdById,
        auditLogCount: k._count.auditLogs,
      })),
    }
  } catch (err) {
    return { error: (err as Error).message, keys: [] }
  }
}

// ─── Revoke an API Key ───────────────────────────────────────────────────────
export async function revokeApiKeyAction(id: string) {
  const profile = await assertRole(['ADMIN'])
  if (profile.role !== 'ADMIN' && profile.role !== 'OWNER') {
    return { error: 'Only administrators can revoke API keys.' }
  }

  try {
    const key = await prisma.apiKey.update({
      where: { id },
      data: { isRevoked: true },
    })

    await prisma.apiKeyAuditLog.create({
      data: {
        apiKeyId: id,
        action: 'REVOKED',
        performedById: profile.id,
        details: `Key "${key.name}" revoked by ${profile.email}`,
      },
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

// ─── Regenerate an API Key (revoke old → create new with same settings) ──────
export async function regenerateApiKeyAction(id: string) {
  const profile = await assertRole(['ADMIN'])
  if (profile.role !== 'ADMIN' && profile.role !== 'OWNER') {
    return { error: 'Only administrators can regenerate API keys.' }
  }

  try {
    // Fetch existing key settings
    const existing = await prisma.apiKey.findUnique({ where: { id } })
    if (!existing) return { error: 'API key not found.' }
    if (existing.organizationId !== profile.organizationId) {
      return { error: 'Unauthorized.' }
    }

    const rawKey = generateRawKey()
    const keyHash = hashKey(rawKey)
    const keyPrefix = rawKey.slice(0, 16)

    // Update in-place (same record, new secret material)
    const updated = await prisma.apiKey.update({
      where: { id },
      data: {
        keyPrefix,
        keyHash,
        isRevoked: false,
        lastUsedAt: null,
      },
    })

    await prisma.apiKeyAuditLog.create({
      data: {
        apiKeyId: id,
        action: 'REGENERATED',
        performedById: profile.id,
        details: `Key "${updated.name}" regenerated by ${profile.email}`,
      },
    })

    revalidatePath('/dashboard/settings')
    return {
      success: true,
      rawKey,
      apiKey: {
        id: updated.id,
        name: updated.name,
        keyPrefix: updated.keyPrefix,
        scopes: updated.scopes,
        rateLimitRpm: updated.rateLimitRpm,
        isRevoked: updated.isRevoked,
        lastUsedAt: updated.lastUsedAt?.toISOString() ?? null,
        expiresAt: updated.expiresAt?.toISOString() ?? null,
        createdAt: updated.createdAt.toISOString(),
      },
    }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

// ─── Get Audit Logs for a specific key ──────────────────────────────────────
export async function getApiKeyAuditLogsAction(apiKeyId: string) {
  const profile = await assertRole(['ADMIN'])

  // Verify the key belongs to the org
  const key = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
    select: { organizationId: true, name: true },
  })
  if (!key || key.organizationId !== profile.organizationId) {
    return { error: 'Unauthorized or key not found.', logs: [] }
  }

  try {
    const logs = await prisma.apiKeyAuditLog.findMany({
      where: { apiKeyId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return {
      logs: logs.map(l => ({
        id: l.id,
        action: l.action,
        performedById: l.performedById,
        ipAddress: l.ipAddress,
        details: l.details,
        createdAt: l.createdAt.toISOString(),
      })),
    }
  } catch (err) {
    return { error: (err as Error).message, logs: [] }
  }
}

// ─── Usage stats across all org keys ────────────────────────────────────────
export async function getApiKeyUsageStatsAction() {
  const profile = await assertRole(['ADMIN'])
  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.', stats: null }

  try {
    const [total, active, revoked] = await Promise.all([
      prisma.apiKey.count({ where: { organizationId: orgId } }),
      prisma.apiKey.count({ where: { organizationId: orgId, isRevoked: false } }),
      prisma.apiKey.count({ where: { organizationId: orgId, isRevoked: true } }),
    ])

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyLogs = await prisma.apiKeyAuditLog.count({
      where: {
        apiKey: { organizationId: orgId },
        action: 'USED',
        createdAt: { gte: startOfMonth },
      },
    })

    const rateLimited = await prisma.apiKeyAuditLog.count({
      where: {
        apiKey: { organizationId: orgId },
        action: 'RATE_LIMITED',
        createdAt: { gte: startOfMonth },
      },
    })

    return {
      stats: { total, active, revoked, monthlyRequests: monthlyLogs, rateLimited },
    }
  } catch (err) {
    return { error: (err as Error).message, stats: null }
  }
}

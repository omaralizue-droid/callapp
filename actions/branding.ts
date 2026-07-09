'use server'

import prisma from '@/lib/db'
import { assertRole } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import {
  isValidHexColor,
  sanitizeHex,
  resolveBranding,
  type OrgBranding,
} from '@/lib/branding'
import { isValidDomain, normalizeDomain } from '@/lib/custom-domain'

// ─── Get ──────────────────────────────────────────────────────────────────────

/**
 * Returns the current organization's branding settings.
 */
export async function getOrgBrandingAction(): Promise<{
  branding?: OrgBranding
  error?: string
}> {
  const profile = await assertRole(['ADMIN', 'MANAGER'])
  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.' }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        brandName: true,
        brandLogoUrl: true,
        brandColor: true,
        brandColorDark: true,
        emailFromName: true,
        emailFooterText: true,
        customDomain: true,
        customDomainVerified: true,
      },
    })
    return { branding: resolveBranding(org) }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export interface UpdateBrandingInput {
  brandName?: string | null
  brandLogoUrl?: string | null
  brandColor?: string | null
  brandColorDark?: string | null
  emailFromName?: string | null
  emailFooterText?: string | null
  customDomain?: string | null
}

/**
 * Updates the organization's white-label branding fields.
 * Only ADMIN can update branding.
 */
export async function updateOrgBrandingAction(
  data: UpdateBrandingInput,
): Promise<{ branding?: OrgBranding; error?: string }> {
  const profile = await assertRole(['ADMIN'])
  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.' }

  // ── Validate inputs ──────────────────────────────────────────────────────
  if (data.brandColor !== undefined && data.brandColor !== null) {
    if (!isValidHexColor(data.brandColor)) {
      return { error: 'Brand color must be a valid hex color (e.g. #4f46e5).' }
    }
  }

  if (data.brandColorDark !== undefined && data.brandColorDark !== null) {
    if (!isValidHexColor(data.brandColorDark)) {
      return { error: 'Brand color (dark) must be a valid hex color.' }
    }
  }

  if (data.customDomain !== undefined && data.customDomain !== null && data.customDomain.trim() !== '') {
    if (!isValidDomain(data.customDomain)) {
      return { error: 'Custom domain must be a valid hostname (e.g. app.mycompany.com).' }
    }
  }

  if (data.brandName !== undefined && data.brandName !== null && data.brandName.trim().length > 80) {
    return { error: 'Brand name must be 80 characters or fewer.' }
  }

  // ── Build update payload ─────────────────────────────────────────────────
  const updateData: Record<string, unknown> = {}

  if (data.brandName !== undefined) {
    updateData.brandName = data.brandName?.trim() || null
  }
  if (data.brandLogoUrl !== undefined) {
    updateData.brandLogoUrl = data.brandLogoUrl?.trim() || null
  }
  if (data.brandColor !== undefined) {
    updateData.brandColor = data.brandColor ? sanitizeHex(data.brandColor) : null
  }
  if (data.brandColorDark !== undefined) {
    updateData.brandColorDark = data.brandColorDark ? sanitizeHex(data.brandColorDark) : null
  }
  if (data.emailFromName !== undefined) {
    updateData.emailFromName = data.emailFromName?.trim() || null
  }
  if (data.emailFooterText !== undefined) {
    updateData.emailFooterText = data.emailFooterText?.trim() || null
  }
  if (data.customDomain !== undefined) {
    const cleaned = data.customDomain ? normalizeDomain(data.customDomain) : null
    updateData.customDomain = cleaned || null
    // Reset verification when domain changes
    if (cleaned !== null) {
      updateData.customDomainVerified = false
    }
  }

  try {
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
      select: {
        brandName: true,
        brandLogoUrl: true,
        brandColor: true,
        brandColorDark: true,
        emailFromName: true,
        emailFooterText: true,
        customDomain: true,
        customDomainVerified: true,
      },
    })

    revalidatePath('/dashboard')
    return { branding: resolveBranding(org) }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ─── Reset ────────────────────────────────────────────────────────────────────

/**
 * Resets all white-label branding fields to null (restores CallPilot defaults).
 */
export async function resetOrgBrandingAction(): Promise<{ success?: boolean; error?: string }> {
  const profile = await assertRole(['ADMIN'])
  const orgId = profile.organizationId
  if (!orgId) return { error: 'No organization context.' }

  try {
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        brandName:            null,
        brandLogoUrl:         null,
        brandColor:           null,
        brandColorDark:       null,
        emailFromName:        null,
        emailFooterText:      null,
        customDomain:         null,
        customDomainVerified: false,
      },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

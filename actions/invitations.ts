'use server'

import prisma from '@/lib/db'
import { assertRole } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { Role } from '@/types'

export async function createInvitationAction(email: string, role: string) {
  // Only OWNER or ADMIN can invite
  const profile = await assertRole(['ADMIN'])
  const organizationId = profile.organizationId
  if (!organizationId) {
    return { error: 'No organization context found.' }
  }

  // Double check if profile role is ADMIN or OWNER (assertRole ADMIN allows ADMIN; in a real app OWNER falls back or is matched)
  if (profile.role !== 'ADMIN' && profile.role !== 'OWNER') {
    return { error: 'Unauthorized: Only administrators or owners can send invitations.' }
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) {
    return { error: 'Email address is required.' }
  }

  // Check if user is already in the organization
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
  if (existingUser && existingUser.organizationId === organizationId) {
    return { error: 'User is already a member of this organization.' }
  }

  try {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Check if there is already an active pending invitation for this email
    const existingInvite = await prisma.organizationInvitation.findFirst({
      where: {
        email: normalizedEmail,
        organizationId,
        isAccepted: false,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    })

    if (existingInvite) {
      return { error: 'An active pending invitation already exists for this email.' }
    }

    const invitation = await prisma.organizationInvitation.create({
      data: {
        email: normalizedEmail,
        role: role as any,
        token,
        organizationId,
        expiresAt,
      },
      include: { organization: true },
    })

    // Simulate sending email to console
    console.info(`
=========================================
[SMTP Mailer] ORGANIZATION INVITATION SENT
To: ${normalizedEmail}
Organization: ${invitation.organization.name}
Role: ${role}
Accept URL Link: http://localhost:3000/invite/accept?token=${token}
=========================================
    `.trim())

    revalidatePath('/dashboard/settings')
    return { success: true, invitation }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function revokeInvitationAction(id: string) {
  const profile = await assertRole(['ADMIN'])
  if (profile.role !== 'ADMIN' && profile.role !== 'OWNER') {
    return { error: 'Unauthorized.' }
  }

  try {
    await prisma.organizationInvitation.update({
      where: { id },
      data: { isRevoked: true },
    })
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function resendInvitationAction(id: string) {
  const profile = await assertRole(['ADMIN'])
  if (profile.role !== 'ADMIN' && profile.role !== 'OWNER') {
    return { error: 'Unauthorized.' }
  }

  try {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invitation = await prisma.organizationInvitation.update({
      where: { id },
      data: { expiresAt },
      include: { organization: true },
    })

    // Simulate sending email again to console
    console.info(`
=========================================
[SMTP Mailer] ORGANIZATION INVITATION RESENT
To: ${invitation.email}
Organization: ${invitation.organization.name}
Role: ${invitation.role}
Accept URL Link: http://localhost:3000/invite/accept?token=${invitation.token}
=========================================
    `.trim())

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function acceptInvitationAction(token: string) {
  // Validate token
  const invitation = await prisma.organizationInvitation.findUnique({
    where: { token },
    include: { organization: true },
  })

  if (!invitation || invitation.isAccepted || invitation.isRevoked || invitation.expiresAt < new Date()) {
    return { error: 'Invitation is invalid, expired, or has been revoked.' }
  }

  // Get current logged-in user profile
  let profile
  try {
    profile = await assertRole(['ADMIN', 'MANAGER', 'QA', 'AGENT'])
  } catch {
    return { error: 'You must be signed in to accept this invitation.' }
  }

  try {
    // Join organization inside a transaction
    await prisma.$transaction(async (tx) => {
      // Update user role and organization
      await tx.user.update({
        where: { id: profile.id },
        data: {
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      })

      // Mark invitation as accepted
      await tx.organizationInvitation.update({
        where: { id: invitation.id },
        data: { isAccepted: true },
      })
    })

    return { success: true, organizationName: invitation.organization.name }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

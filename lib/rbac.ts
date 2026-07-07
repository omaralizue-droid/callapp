import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { Role } from '@/types'
import { redirect } from 'next/navigation'

import { tenantStorage } from './tenant-context'

/**
 * Asserts the current authenticated user belongs to one of the allowed roles.
 * If not authenticated, redirects to /login.
 * If role is not allowed, redirects to /dashboard/unauthorized.
 */
export async function assertRole(allowedRoles: Role[]) {
  // Development bypass: skip auth and role checks when enabled
  if (process.env.DEV_AUTH_BYPASS !== 'false') {
    // Return a mock admin profile for local development
    const mockProfile = {
      id: 'dev-user',
      email: 'omaralizue@gmail.com',
      role: 'ADMIN' as Role,
      organizationId: 'mock-org-id',
      firstName: 'Developer',
      lastName: '',
    };
    tenantStorage.enterWith({
      organizationId: mockProfile.organizationId,
      userId: mockProfile.id,
      role: mockProfile.role,
    })
    return mockProfile;
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true,
      organizationId: true,
      firstName: true,
      lastName: true,
    },
  })

  if (!profile || !allowedRoles.includes(profile.role as Role)) {
    redirect('/dashboard/unauthorized')
  }

  // Populate context storage for dynamic tenant query boundaries
  tenantStorage.enterWith({
    organizationId: profile.organizationId || '',
    userId: profile.id,
    role: profile.role,
  })

  return {
    ...profile,
    role: profile.role as Role,
  }
}

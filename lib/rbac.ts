import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { Role } from '@/types'
import { redirect } from 'next/navigation'

/**
 * Asserts the current authenticated user belongs to one of the allowed roles.
 * If not authenticated, redirects to /login.
 * If role is not allowed, redirects to /dashboard/unauthorized.
 */
export async function assertRole(allowedRoles: Role[]) {
  // Development bypass: skip auth and role checks when enabled
  if (process.env.DEV_AUTH_BYPASS === 'true') {
    // Return a mock admin profile for local development
    return {
      id: 'dev-user',
      email: 'dev@example.com',
      role: 'admin' as Role,
      organizationId: null,
      firstName: 'Developer',
      lastName: '',
    };
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

  return {
    ...profile,
    role: profile.role as Role,
  }
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { resolveBranding, buildBrandCssVars } from '@/lib/branding'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's public profile and workspace organization
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
  })

  // Fallback profile if the database sync hasn't run yet or table is local
  if (!dbUser) {
    dbUser = {
      firstName: 'BPO User',
      lastName: '',
      email: user.email || '',
      role: 'AGENT',
      organization: {
        name: 'CallPilot Demo',
      },
    }
  }

  // Fetch branding for the user's organization
  const orgBrandingRow = await (async () => {
    try {
      // Find the user's organizationId first
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { organizationId: true },
      })
      if (!profile?.organizationId) return null

      return prisma.organization.findUnique({
        where: { id: profile.organizationId },
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
    } catch {
      return null
    }
  })()

  const branding = resolveBranding(orgBrandingRow)
  const brandCssVars = buildBrandCssVars(branding)

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  return (
    <>
      {/* Inject brand CSS variables as inline style — overrides :root defaults from globals.css */}
      <style dangerouslySetInnerHTML={{ __html: brandCssVars }} />
      <DashboardShell
        profile={dbUser}
        initialNotifications={notifications as any}
        branding={branding}
      >
        {children}
      </DashboardShell>
    </>
  )
}

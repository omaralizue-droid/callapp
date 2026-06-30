import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import DashboardShell from '@/components/dashboard/DashboardShell'

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

  return <DashboardShell profile={dbUser}>{children}</DashboardShell>
}

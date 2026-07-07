import { assertRole } from '@/lib/rbac'
import SettingsForm from '@/components/dashboard/SettingsForm'
import prisma from '@/lib/db'

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
      initialBilling = {
        planName: org.planName,
        planStatus: org.planStatus,
        stripeCurrentPeriodEnd: org.stripeCurrentPeriodEnd ? org.stripeCurrentPeriodEnd.toISOString() : null,
        stripeCancelAtPeriodEnd: org.stripeCancelAtPeriodEnd,
        callLimit: org.callLimit,
        usedCalls: org.usedCalls,
        paymentHistories: org.paymentHistories.map(p => ({
          invoice: p.stripeInvoiceId,
          date: p.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          amount: `$${p.amount.toFixed(2)}`,
          status: p.status,
        })),
      }
    }
  }

  return <SettingsForm initialBilling={initialBilling} />
}

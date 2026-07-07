'use server'

import { assertRole } from '@/lib/rbac'
import prisma from '@/lib/db'
import { getStripe, STRIPE_PLANS, StripeService } from '@/services/stripe'
import { revalidatePath } from 'next/cache'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Creates a Stripe Checkout Session for a selected plan
 */
export async function createCheckoutSessionAction(planId: string) {
  const profile = await assertRole(['ADMIN', 'OWNER', 'MANAGER'])
  const orgId = profile.organizationId

  if (!orgId) {
    return { error: 'Your user profile is not linked to any SaaS organization workspace.' }
  }

  const selectedPlan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS]
  if (!selectedPlan) {
    return { error: 'Invalid subscription plan selection.' }
  }

  const stripeCustomerId = await StripeService.getOrCreateCustomerId(orgId)
  if (!stripeCustomerId) {
    return { error: 'Failed to synchronize organization billing parameters.' }
  }

  const stripe = getStripe()
  if (!stripe) {
    // -------------------------------------------------------------
    // Mock Local Sandbox Bypass Execution
    // -------------------------------------------------------------
    console.info(`[Stripe Mock] Simulating checkout redirect for plan: ${selectedPlan.name}`)
    
    // Automatically apply selected plan to the local database org record
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        planName: selectedPlan.name,
        planStatus: 'ACTIVE',
        stripePriceId: selectedPlan.priceId,
        stripeSubscriptionId: `sub_mock_${Math.random().toString(36).substring(2, 10)}`,
        stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000), // 30 days
        callLimit: selectedPlan.callsLimit,
        trialEndsAt: null,
      },
    })

    // Create a mock invoice log
    await prisma.paymentHistory.create({
      data: {
        organizationId: orgId,
        stripeInvoiceId: `in_mock_${Math.random().toString(36).substring(2, 10)}`,
        amount: selectedPlan.price,
        status: 'PAID',
        planName: selectedPlan.name,
      },
    })

    revalidatePath('/dashboard/settings')
    return { url: `${APP_URL}/dashboard/settings?billing_status=checkout_success` }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // Support for 7-day trials out-of-the-box
        metadata: { organizationId: orgId },
      },
      success_url: `${APP_URL}/dashboard/settings?billing_status=checkout_success`,
      cancel_url: `${APP_URL}/dashboard/settings?billing_status=checkout_cancel`,
      metadata: { organizationId: orgId, planId },
    })

    return { url: session.url }
  } catch (err) {
    console.error('Failed to create Stripe checkout session:', err)
    return { error: `Stripe Integration error: ${(err as Error).message || String(err)}` }
  }
}

/**
 * Creates a Stripe Billing Portal session for active subscriptions
 */
export async function createPortalSessionAction() {
  const profile = await assertRole(['ADMIN', 'OWNER', 'MANAGER'])
  const orgId = profile.organizationId

  if (!orgId) {
    return { error: 'Your user profile is not linked to any SaaS organization workspace.' }
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  })

  if (!org || !org.stripeCustomerId) {
    return { error: 'No billing configuration exists for your organization.' }
  }

  const stripe = getStripe()
  if (!stripe) {
    // -------------------------------------------------------------
    // Mock Local Sandbox Portal Bypass Execution
    // -------------------------------------------------------------
    console.info(`[Stripe Mock] Launching billing customer portal for organization: ${org.name}`)
    // Reset to Starter Free Plan as a simulated cancel action inside portal
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        planName: 'Starter',
        planStatus: 'TRIAL',
        stripePriceId: STRIPE_PLANS.starter.priceId,
        callLimit: STRIPE_PLANS.starter.callsLimit,
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
      },
    })
    revalidatePath('/dashboard/settings')
    return { url: `${APP_URL}/dashboard/settings?billing_status=portal_reset_success` }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${APP_URL}/dashboard/settings`,
    })

    return { url: session.url }
  } catch (err) {
    console.error('Failed to create Stripe portal session:', err)
    return { error: `Stripe Portal error: ${(err as Error).message || String(err)}` }
  }
}

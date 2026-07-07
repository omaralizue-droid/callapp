import { NextResponse } from 'next/server'
import { getStripe, getPlanByPriceId, STRIPE_PLANS } from '@/services/stripe'
import prisma from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    console.warn('[Stripe Webhook] Stripe Client is uninitialized (missing API Key). Returning 400.')
    return new NextResponse('Webhook client uninitialized', { status: 400 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new NextResponse('Missing stripe signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    const rawBody = await req.text()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is missing. Cannot construct event.')
      return new NextResponse('Webhook secret missing', { status: 500 })
    }

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const errorMsg = (err as Error).message
    console.error(`[Stripe Webhook] Signature verification failed: ${errorMsg}`)
    return new NextResponse(`Webhook Error: ${errorMsg}`, { status: 400 })
  }

  const type = event.type
  console.info(`[Stripe Webhook] Received event of type: ${type}`)

  try {
    switch (type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orgId = session.metadata?.organizationId
        
        if (!orgId) {
          console.warn('[Stripe Webhook] No organizationId metadata found in Checkout Session.')
          break
        }

        const subscriptionId = session.subscription as string
        const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any
        const priceId = subscription.items.data[0].price.id
        const targetPlan = getPlanByPriceId(priceId)

        await prisma.organization.update({
          where: { id: orgId },
          data: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            planName: targetPlan.name,
            planStatus: 'ACTIVE',
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            callLimit: targetPlan.callsLimit,
            trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string
        
        if (!stripeCustomerId) break

        const org = await prisma.organization.findUnique({
          where: { stripeCustomerId },
        })

        if (!org) {
          console.warn(`[Stripe Webhook] Invoice payment succeeded but organization not found for customer: ${stripeCustomerId}`)
          break
        }

        // Record payment history log
        const amountPaid = invoice.amount_paid / 100 // convert cents to USD
        const stripeInvoiceId = invoice.id
        
        await prisma.paymentHistory.upsert({
          where: { stripeInvoiceId },
          create: {
            organizationId: org.id,
            stripeInvoiceId,
            amount: amountPaid,
            status: 'PAID',
            planName: org.planName,
            createdAt: new Date(),
          },
          update: {
            status: 'PAID',
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const stripeCustomerId = subscription.customer as string
        
        const org = await prisma.organization.findUnique({
          where: { stripeCustomerId },
        })

        if (!org) {
          console.warn(`[Stripe Webhook] Subscription updated, but organization not found for customer: ${stripeCustomerId}`)
          break
        }

        const priceId = subscription.items.data[0].price.id
        const targetPlan = getPlanByPriceId(priceId)
        
        // Check if subscription was cancelled or expired
        let status = 'ACTIVE'
        if (subscription.status === 'past_due') status = 'PAST_DUE'
        if (subscription.status === 'canceled') status = 'CANCELED'
        if (subscription.status === 'unpaid') status = 'EXPIRED'
        if (subscription.status === 'trialing') status = 'TRIAL'

        await prisma.organization.update({
          where: { id: org.id },
          data: {
            stripePriceId: priceId,
            planName: targetPlan.name,
            planStatus: status,
            stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            callLimit: targetPlan.callsLimit,
            trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const stripeCustomerId = subscription.customer as string

        const org = await prisma.organization.findUnique({
          where: { stripeCustomerId },
        })

        if (!org) break

        // EXPIRED/CANCELLED subscription resets organization plan to default Free Starter plan
        await prisma.organization.update({
          where: { id: org.id },
          data: {
            planName: 'Starter',
            planStatus: 'EXPIRED',
            stripePriceId: STRIPE_PLANS.starter.priceId,
            stripeSubscriptionId: null,
            stripeCurrentPeriodEnd: null,
            stripeCancelAtPeriodEnd: false,
            callLimit: STRIPE_PLANS.starter.callsLimit,
          },
        })
        break
      }
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })
  } catch (err) {
    console.error('[Stripe Webhook] Processing event failed:', err)
    return new NextResponse('Webhook processing failed', { status: 500 })
  }
}

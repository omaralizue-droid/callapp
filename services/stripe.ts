import Stripe from 'stripe'
import prisma from '@/lib/db'

// Price mappings (Test / Production Stripe Prices)
export const STRIPE_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    callsLimit: 100,
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter_test_id',
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 129,
    callsLimit: 500,
    priceId: process.env.STRIPE_PRICE_GROWTH || 'price_growth_test_id',
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 299,
    callsLimit: 2500,
    priceId: process.env.STRIPE_PRICE_BUSINESS || 'price_business_test_id',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    callsLimit: 999999,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_test_id',
  },
}

export const getPlanByPriceId = (priceId: string) => {
  return Object.values(STRIPE_PLANS).find(p => p.priceId === priceId) || STRIPE_PLANS.starter
}

export const getPlanByName = (name: string) => {
  return Object.values(STRIPE_PLANS).find(p => p.name.toLowerCase() === name.toLowerCase()) || STRIPE_PLANS.starter
}

// Lazy initializer for Stripe client to prevent crashes if key is missing during build time
let stripeClient: Stripe | null = null
export const getStripe = (): Stripe | null => {
  const apiKey = process.env.STRIPE_API_KEY
  if (!apiKey) return null
  if (!stripeClient) {
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2025-01-27.acronyms' as any, // standard latest version compatibility
    })
  }
  return stripeClient
}

export class StripeService {
  /**
   * Helper to ensure organization has a Stripe Customer ID
   */
  static async getOrCreateCustomerId(organizationId: string): Promise<string | null> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    })
    
    if (!org) return null
    if (org.stripeCustomerId) return org.stripeCustomerId

    const stripe = getStripe()
    if (!stripe) {
      // Return mock customer ID in bypass/local modes
      const mockCustomerId = `cus_mock_${Math.random().toString(36).substring(2, 10)}`
      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: mockCustomerId },
      })
      return mockCustomerId
    }

    const customer = await stripe.customers.create({
      email: `${org.slug}@callpilot-tenant.com`,
      name: org.name,
      metadata: { organizationId },
    })

    await prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customer.id },
    })

    return customer.id
  }
}

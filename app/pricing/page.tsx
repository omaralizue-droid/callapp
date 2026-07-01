'use client'

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

const PLANS = [
  {
    name: 'Starter',
    price: '$49',
    unit: '/month',
    desc: 'Perfect for small outbound teams or QA pilots.',
    features: ['Up to 500 call hours/mo', 'Standard QA compliance scoring', 'Basic AI call summaries', 'CSV export', 'Email support'],
    isPopular: false,
    cta: 'Start free trial',
    ctaHref: '/signup',
    ctaStyle: 'secondary',
  },
  {
    name: 'Professional',
    price: '$199',
    unit: '/month',
    desc: 'Ideal for scaling BPO departments with rich coaching needs.',
    features: ['Up to 3,000 call hours/mo', 'Custom QA compliance rubrics', 'Advanced AI coaching cards', 'Sentiment timeline analysis', 'HubSpot & Salesforce sync', 'Priority support'],
    isPopular: true,
    cta: 'Get started',
    ctaHref: '/signup',
    ctaStyle: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    desc: 'Built for enterprise multi-site operations.',
    features: ['Unlimited call volume', 'Dedicated LLM instance', 'SSO & role-based access', 'SOC2 compliance reports', 'Dedicated account manager', '99.9% uptime SLA'],
    isPopular: false,
    cta: 'Contact sales',
    ctaHref: '/contact',
    ctaStyle: 'secondary',
  },
]

const FAQS = [
  { q: 'What counts as a "call hour"?', a: 'A call hour is measured by the exact duration of audio uploaded or integrated via telephony. We bill by the second, not rounded minutes.' },
  { q: 'Can I change my plan later?', a: 'Yes. Upgrade, downgrade, or cancel at any time directly through your admin settings — no lock-in contracts.' },
  { q: 'Do you offer custom SLA agreements?', a: 'Enterprise plans include guaranteed 99.9% processing uptime, dedicated infrastructure, and custom SOC2 compliance reporting.' },
  { q: 'Is there a free trial?', a: 'All plans include a 14-day free trial with full access. No credit card required to start.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav activePage="pricing" />

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Choose the plan that fits your team. All plans include a 14-day free trial — no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, idx) => (
            <div key={idx}
              className={`p-8 rounded-xl border flex flex-col relative transition-all ${
                plan.isPopular
                  ? 'border-indigo-600 shadow-sm bg-white ring-1 ring-indigo-600/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold tracking-wider px-4 py-1 rounded-full uppercase bg-indigo-600 shadow-sm">
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.unit}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}
                className={`w-full text-center py-3 rounded-lg font-semibold text-xs transition-all ${
                  plan.ctaStyle === 'primary'
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                    : 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="max-w-5xl mx-auto mt-10 text-center">
          <p className="text-sm text-slate-500">
            All plans include: AI call transcription, compliance scoring, CRM export, and SSL encryption.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-900">Frequently asked questions</h2>
          <div className="space-y-5">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold mb-2 text-slate-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14 bg-indigo-600 shadow-lg shadow-indigo-600/10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Start your free trial today</h2>
          <p className="text-indigo-100 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            14 days free. No credit card required. Cancel anytime.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/50">
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

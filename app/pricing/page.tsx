import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight, Shield, Sparkles, Building2, Zap } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'CallPilot AI Pricing | Transparent Plans for Teams & Enterprise',
  description: 'Choose the best CallPilot AI plan for your contact center or BPO. Flexible pricing based on call volume, custom compliance scoring, and integrations.',
  openGraph: {
    title: 'CallPilot AI Pricing | Transparent Plans for Teams & Enterprise',
    description: 'Choose the best CallPilot AI plan for your contact center or BPO. Flexible pricing based on call volume, custom compliance scoring, and integrations.',
    url: 'https://callpilot.ai/pricing',
    type: 'website',
  }
}

const pricingStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'CallPilot AI Pricing Plans',
  'description': 'Pricing plans for CallPilot AI conversation intelligence platform.',
  'url': 'https://callpilot.ai/pricing',
  'mainEntity': {
    '@type': 'OfferCatalog',
    'name': 'CallPilot AI Service Plans',
    'itemListElement': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'SoftwareApplication',
          'name': 'CallPilot AI Starter'
        },
        'price': '49.00',
        'priceCurrency': 'USD'
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'SoftwareApplication',
          'name': 'CallPilot AI Professional'
        },
        'price': '199.00',
        'priceCurrency': 'USD'
      }
    ]
  }
}

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
    icon: <Zap className="w-5 h-5 text-indigo-400" />
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
    icon: <Sparkles className="w-5 h-5 text-cyan-400" />
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
    icon: <Building2 className="w-5 h-5 text-purple-400" />
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
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingStructuredData) }}
      />
      <GoogleNav activePage="pricing" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Pricing & Plans</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Simple, transparent <span className="gradient-text-bright">pricing</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Choose the plan that fits your team. All plans include a 14-day free trial — no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-6 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {PLANS.map((plan, idx) => (
            <div key={idx}
              className={`p-8 rounded-2xl border flex flex-col relative transition-all duration-300 ${
                plan.isPopular
                  ? 'border-indigo-500/50 shadow-2xl bg-[#0a1128]/90 scale-105 z-10'
                  : 'border-white/5 bg-slate-900/40 hover:border-white/10'
              }`}
              style={plan.isPopular ? { boxShadow: '0 0 40px rgba(79,70,229,0.15)' } : {}}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase bg-gradient-to-r from-indigo-500 to-violet-600 shadow-md">
                  Most popular
                </span>
              )}

              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{plan.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  {plan.icon}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{plan.unit}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2.5 text-xs">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                    <span style={{ color: 'var(--text-secondary)' }}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}
                className={`w-full text-center py-3.5 rounded-xl font-bold text-xs transition-all ${
                  plan.ctaStyle === 'primary'
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-500/20'
                    : 'border border-white/10 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature List Summary Note */}
        <div className="max-w-4xl mx-auto mt-16 text-center relative z-10">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            * All plans include: AI call transcription, compliance scoring, CRM summaries, integrations, and enterprise TLS encryption.
          </p>
        </div>
      </section>

      {/* FAQ Details Accordion */}
      <section className="py-24 px-6 border-t border-white/5" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-12 text-white">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group border border-white/5 rounded-xl bg-slate-900/40 p-5 overflow-hidden transition-all hover:border-indigo-500/30">
                <summary className="flex justify-between items-center font-bold text-sm text-white cursor-pointer select-none">
                  {faq.q}
                  <span className="text-indigo-400 group-open:rotate-180 transition-transform duration-200">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </span>
                </summary>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-950/40">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Start your free trial today</h2>
          <p className="max-w-md mx-auto mb-8 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            14 days free trial. No credit card required. Cancel anytime.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-8 py-3.5 rounded-xl text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-slate-950/80" style={{ color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

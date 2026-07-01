'use client'

import { useState, useEffect } from 'react'
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
  },
]

const FAQS = [
  { q: 'What counts as a "call hour"?', a: 'A call hour is measured by the exact duration of audio uploaded or integrated via telephony. We bill by the second, not rounded minutes.' },
  { q: 'Can I change my plan later?', a: 'Yes. Upgrade, downgrade, or cancel at any time directly through your admin settings — no lock-in contracts.' },
  { q: 'Do you offer custom SLA agreements?', a: 'Enterprise plans include guaranteed 99.9% processing uptime, dedicated infrastructure, and custom SOC2 compliance reporting.' },
  { q: 'Is there a free trial?', a: 'All plans include a 14-day free trial with full access. No credit card required to start.' },
]

export default function PricingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const isDark  = theme === 'dark'
  const bg      = isDark ? 'bg-[#1e1e1e]' : 'bg-white'
  const fg      = isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
  const muted   = isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
  const border  = isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'
  const cardBg  = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'
  const surface = isDark ? 'bg-[#252525]' : 'bg-[#f8f9fa]'
  const primary = isDark ? '#8ab4f8' : '#1a73e8'

  return (
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <GoogleNav activePage="pricing" theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <section className={`py-20 px-6 text-center ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Pricing</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${fg}`}>
            Simple, transparent pricing
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${muted}`}>
            Choose the plan that fits your team. All plans include a 14-day free trial — no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, idx) => (
            <div key={idx}
              className={`p-8 rounded-2xl border flex flex-col relative transition-all ${
                plan.isPopular
                  ? isDark
                    ? 'bg-[#1a3a5c] border-[#8ab4f8] shadow-xl'
                    : 'bg-white border-[#1a73e8] shadow-xl'
                  : `${cardBg} hover:shadow-md`
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold tracking-wider px-4 py-1 rounded-full uppercase"
                  style={{ background: primary }}>
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-1 ${fg}`}>{plan.name}</h3>
                <p className={`text-sm ${muted}`}>{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-4xl font-bold ${fg}`}>{plan.price}</span>
                <span className={`text-sm ${muted}`}>{plan.unit}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className={`flex items-start gap-2.5 text-sm ${muted}`}>
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#34a853' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}
                className={`w-full text-center py-3 rounded-full font-semibold text-sm transition-all ${
                  plan.isPopular
                    ? 'text-white shadow-md hover:shadow-lg'
                    : `border ${border} ${fg}`
                }`}
                style={plan.isPopular ? { background: primary } : {}}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison note */}
        <div className="max-w-5xl mx-auto mt-10 text-center">
          <p className={`text-sm ${muted}`}>
            All plans include: AI call transcription, compliance scoring, CRM export, and SSL encryption.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-20 px-6 ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${fg}`}>Frequently asked questions</h2>
          <div className="space-y-5">
            {FAQS.map((faq, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${cardBg}`}>
                <h3 className={`text-base font-semibold mb-2 ${fg}`}>{faq.q}</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14"
          style={{ background: isDark ? 'linear-gradient(135deg, #1a3a5c, #1e2d1e)' : 'linear-gradient(135deg, #1a73e8, #0d652d)' }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Start your free trial today</h2>
          <p className="text-white/80 max-w-md mx-auto mb-8">
            14 days free. No credit card required. Cancel anytime.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-8 py-3.5 rounded-full hover:shadow-lg transition-all"
            style={{ color: '#1a73e8' }}
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className={`border-t py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${muted} ${border}`}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

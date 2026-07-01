'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Check, Sun, Moon, ArrowRight } from 'lucide-react'

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$49',
    unit: '/mo',
    desc: 'Perfect for small outbound teams or quality assurance pilots.',
    features: ['Up to 500 call hours/mo', 'Standard QA Compliance scoring', 'Basic AI call summaries', 'CSV metadata export', 'Email support'],
    isPopular: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: '$199',
    unit: '/mo',
    desc: 'Ideal for scaling BPO departments requiring rich coaching hubs.',
    features: [
      'Up to 3,000 call hours/mo',
      'Custom QA compliance rubrics',
      'Advanced agent coaching tips',
      'Sentiment timeline analysis',
      'HubSpot & Salesforce integrations',
      'Priority support',
    ],
    isPopular: true,
    cta: 'Get Started Now',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    desc: 'Built for enterprise multi-site operations and call centers.',
    features: [
      'Unlimited call volume',
      'Dedicated LLM instance custom prompts',
      'SSO & role-based workspace partitions',
      'Custom security audits (SOC2)',
      'Dedicated account manager',
      '99.9% uptime SLA',
    ],
    isPopular: false,
    cta: 'Contact Sales',
  },
]

export default function PricingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const bgClass = theme === 'dark' ? 'bg-[#060813] text-slate-100' : 'bg-slate-50 text-slate-800'
  const headerClass = theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200/60 shadow-sm'
  const textTitleClass = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const textDescClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const textMutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const sectionBorderClass = theme === 'dark' ? 'border-white/5' : 'border-slate-200/60'

  const faqs = [
    { q: 'What counts as a "call hour"?', a: 'A call hour is measured by the duration of the audio uploaded or integrated via telephony streams. We charge by exact seconds, not rounded minutes.' },
    { q: 'Can I change my plan later?', a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time directly through your admin settings page.' },
    { q: 'Do you offer custom SLA agreements?', a: 'Yes. Enterprise plan agreements offer guaranteed 99.9% processing uptime, dedicated servers, and custom SOC2 compliance reporting.' }
  ]

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors duration-300 relative`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 glass border-b ${headerClass} py-4 px-6 md:px-12 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${textTitleClass}`}>
              CallPilot<span className="text-cyan-500">.AI</span>
            </span>
          </Link>
        </div>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${textDescClass}`}>
          <Link href="/features" className="hover:text-cyan-500 transition-colors">Features</Link>
          <Link href="/pricing" className="text-cyan-500 font-semibold">Pricing</Link>
          <Link href="/blog" className="hover:text-cyan-500 transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/10 hover:bg-white/5 text-cyan-400' 
                : 'border-slate-200 hover:bg-slate-100 text-cyan-600'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className={`text-sm font-medium hover:text-cyan-500 transition-colors ${textDescClass}`}>
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow z-10 relative py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase mb-3 block">Flexible Plans</span>
          <h1 className={`text-4xl md:text-5xl font-black ${textTitleClass} mb-4`}>
            Predictable Pricing for Call Centers
          </h1>
          <p className={`${textDescClass} text-lg max-w-xl mx-auto`}>
            Select the processing capacity that matches your seat count. All subscriptions include core CRM integrations.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-8 flex flex-col justify-between relative transition-all duration-300 border ${
                plan.isPopular
                  ? theme === 'dark'
                    ? 'bg-slate-900/90 border-cyan-500 shadow-xl shadow-cyan-950/30'
                    : 'bg-white border-cyan-500 shadow-xl shadow-cyan-100'
                  : theme === 'dark'
                    ? 'bg-slate-950/40 border-white/5 hover:border-white/10'
                    : 'bg-white border-slate-200/60 shadow-md shadow-slate-100'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  Most Popular
                </span>
              )}
              
              <div>
                <h3 className={`text-lg font-bold ${textTitleClass} mb-2`}>{plan.name}</h3>
                <p className={`${textMutedClass} text-xs mb-6 leading-relaxed`}>{plan.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-4xl font-black ${textTitleClass}`}>{plan.price}</span>
                  <span className={`${textMutedClass} text-sm font-semibold`}>{plan.unit}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className={`flex items-start gap-2.5 text-xs ${textDescClass}`}>
                      <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/signup"
                className={`w-full text-center py-3 rounded-lg font-bold text-xs transition-all ${
                  plan.isPopular
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/15 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section className={`mt-24 pt-16 border-t ${sectionBorderClass}`}>
          <h2 className={`text-3xl font-bold text-center ${textTitleClass} mb-12`}>Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className={`text-base font-bold ${textTitleClass}`}>{faq.q}</h3>
                <p className={`${textDescClass} text-xs leading-relaxed`}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t ${sectionBorderClass} py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${textMutedClass}`}>
        <p>&copy; {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-cyan-500">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-cyan-500">Terms of Service</Link>
        </div>
      </footer>

    </div>
  )
}

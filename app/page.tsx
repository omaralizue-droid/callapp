'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck, TrendingUp, Sparkles, FileSpreadsheet,
  ArrowRight, Play, Check, PhoneCall, BarChart3, Star, Zap
} from 'lucide-react'
import InteractiveDemo from '@/components/landing/InteractiveDemo'
import LandingHeroAnimation from '@/components/landing/LandingHeroAnimation'
import GoogleNav from '@/components/landing/GoogleNav'

const FEATURES = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'g-icon-blue',
    title: 'Automated QA Compliance',
    desc: 'Score 100% of calls against custom compliance rules — branded greetings, mandatory disclosures, and script adherence. Eliminate manual spot checks.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'g-icon-red',
    title: 'Sentiment & Speech Analytics',
    desc: 'Track agent tone, customer escalation signals, and emotional patterns second-by-second — across every conversation at scale.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    color: 'g-icon-yellow',
    title: 'AI Coaching & Feedback',
    desc: 'Generate individual coaching cards with specific transcript timestamps. Help agents improve tone, objections, and script compliance faster.',
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6" />,
    color: 'g-icon-green',
    title: 'One-Click CRM Structuring',
    desc: 'Automatically convert recordings into structured CRM data — complaints, resolutions, follow-up actions — synced to Salesforce or HubSpot.',
  },
]

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$49',
    unit: '/month',
    desc: 'Perfect for small teams or QA pilots.',
    features: ['Up to 500 call hours/mo', 'Standard QA Compliance scoring', 'Basic AI call summaries', 'CSV export', 'Email support'],
    isPopular: false,
    cta: 'Start free trial',
    ctaStyle: 'outlined',
  },
  {
    name: 'Professional',
    price: '$199',
    unit: '/month',
    desc: 'For scaling BPO departments needing advanced coaching.',
    features: [
      'Up to 3,000 call hours/mo',
      'Custom QA compliance rubrics',
      'Advanced AI coaching cards',
      'Sentiment timeline analysis',
      'HubSpot & Salesforce sync',
      'Priority support',
    ],
    isPopular: true,
    cta: 'Get started',
    ctaStyle: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    desc: 'Built for multi-site enterprise call centers.',
    features: [
      'Unlimited call volume',
      'Dedicated LLM instance',
      'SSO & role-based access',
      'SOC2 compliance reports',
      'Dedicated account manager',
      '99.9% uptime SLA',
    ],
    isPopular: false,
    cta: 'Contact sales',
    ctaStyle: 'outlined',
  },
]

const STATS = [
  { value: '3.5M+', label: 'Calls scored', color: '#1a73e8' },
  { value: '95%',   label: 'QA accuracy vs. human auditors', color: '#34a853' },
  { value: '24%',   label: 'Average compliance improvement', color: '#ea4335' },
  { value: '10x',   label: 'More calls audited vs. manual', color: '#f9ab00' },
]

const LOGOS = ['Salesforce', 'HubSpot', 'Zendesk', 'Genesys', 'Twilio']

const TESTIMONIALS = [
  {
    quote: "CallPilot has transformed how we audit agent performance. We went from sampling 2% of calls to reviewing 100%.",
    name: 'Sarah Kim',
    role: 'QA Manager, NovaBPO',
    avatar: 'SK',
    color: '#1a73e8',
  },
  {
    quote: "The coaching cards are incredible. Our agents improved compliance scores by 28% in just the first month.",
    name: 'Marcus Torres',
    role: 'Operations Director, ClearCall',
    avatar: 'MT',
    color: '#34a853',
  },
  {
    quote: "We've reduced call review time by 80%. The CRM sync alone saves our team hours every week.",
    name: 'Priya Nair',
    role: 'Contact Center Lead, Vertex360',
    avatar: 'PN',
    color: '#ea4335',
  },
]

export default function Home() {
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

  const isDark = theme === 'dark'
  const bg       = isDark ? 'bg-[#1e1e1e]' : 'bg-white'
  const fg       = isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
  const muted    = isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
  const border   = isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'
  const surface  = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
  const cardBg   = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'
  const primary  = isDark ? '#8ab4f8' : '#1a73e8'

  return (
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <GoogleNav theme={theme} toggleTheme={toggleTheme} />

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Three.js constellation background */}
        <div className="absolute inset-0 pointer-events-none">
          <LandingHeroAnimation theme={theme} />
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(138,180,248,0.06) 0%, transparent 70%)'
                : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,115,232,0.04) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{ background: isDark ? 'rgba(138,180,248,0.12)' : '#e8f0fe', color: primary }}
          >
            <Zap className="w-3.5 h-3.5" />
            AI-powered call quality platform for BPO teams
          </div>

          <h1 className={`text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 ${fg}`}>
            Score every call.{' '}
            <span style={{ color: primary }}>Coach every agent.</span>
            <br className="hidden md:block" />
            Automatically.
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${muted}`}>
            CallPilot uses AI to audit 100% of your support and sales calls — detecting compliance issues, scoring agent performance, and generating coaching notes without any manual effort.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup"
              className="inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-3.5 rounded-full text-white transition-all hover:shadow-lg"
              style={{ background: primary, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#demo"
              className={`inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-3.5 rounded-full border transition-all ${border} ${fg} hover:bg-[${isDark ? '#3c4043' : '#f1f3f4'}]`}
            >
              <Play className="w-4 h-4" style={{ color: primary }} />
              See it in action
            </a>
          </div>

          {/* Trust bar */}
          <div className={`mt-12 flex flex-wrap justify-center items-center gap-6 text-xs ${muted}`}>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" style={{ color: '#34a853' }} />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" style={{ color: '#34a853' }} />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" style={{ color: '#34a853' }} />
              SOC2 Type II compliant
            </span>
          </div>
        </div>
      </section>

      {/* ── LOGOS ── */}
      <section className={`border-y py-10 ${isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <p className={`text-center text-xs font-medium uppercase tracking-widest mb-8 ${muted}`}>
            Trusted by teams using
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {LOGOS.map(logo => (
              <span key={logo} className={`text-sm font-semibold ${muted} opacity-60`}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ── */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: primary }}>Platform demo</p>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${fg}`}>
              See CallPilot analyze a real call
            </h2>
            <p className={`max-w-xl mx-auto ${muted}`}>
              Upload any call recording and instantly get a compliance scorecard, sentiment timeline, coaching tips, and a structured CRM note.
            </p>
          </div>
          <div className={`rounded-2xl border overflow-hidden ${cardBg} shadow-lg`}>
            <InteractiveDemo />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={`py-20 px-6 ${isDark ? 'bg-[#252525]' : 'bg-[#f8f9fa]'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: primary }}>Product features</p>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${fg}`}>
              Everything your QA team needs
            </h2>
            <p className={`max-w-xl mx-auto ${muted}`}>
              Stop manually sampling 1% of calls. CallPilot automatically grades every conversation and gives agents actionable feedback instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, idx) => (
              <div key={idx}
                className={`p-7 rounded-2xl border flex gap-5 items-start transition-all ${cardBg} hover:shadow-md`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${fg}`}>{feat.title}</h3>
                  <p className={`text-sm leading-relaxed ${muted}`}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={`py-20 px-6 border-y ${border}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className={`text-sm ${muted}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: primary }}>How it works</p>
            <h2 className={`text-3xl md:text-4xl font-bold ${fg}`}>Three steps to full QA coverage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <PhoneCall className="w-6 h-6" />, color: '#1a73e8', bg: '#e8f0fe', title: 'Upload or stream calls', desc: 'Connect your telephony platform or upload recordings. We support MP3, WAV, and live stream integrations.' },
              { step: '02', icon: <BarChart3 className="w-6 h-6" />, color: '#34a853', bg: '#e6f4ea', title: 'AI scores & analyzes', desc: 'Our AI checks compliance, measures sentiment, detects script deviations, and generates structured notes in seconds.' },
              { step: '03', icon: <Star className="w-6 h-6" />, color: '#f9ab00', bg: '#fef7e0', title: 'Coach & improve', desc: 'Agents get coaching cards. Supervisors get dashboards. CRM gets structured notes. Everyone gets better.' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: step.bg, color: step.color }}>
                  {step.icon}
                </div>
                <div className="text-xs font-bold mb-2" style={{ color: step.color }}>{step.step}</div>
                <h3 className={`text-base font-semibold mb-3 ${fg}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={`py-20 px-6 ${isDark ? 'bg-[#252525]' : 'bg-[#f8f9fa]'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: primary }}>Customer stories</p>
            <h2 className={`text-3xl md:text-4xl font-bold ${fg}`}>Trusted by QA teams worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className={`p-7 rounded-2xl border ${cardBg} hover:shadow-md transition-all`}>
                <div className="flex mb-4 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#f9ab00' }} />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${muted}`}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${fg}`}>{t.name}</div>
                    <div className={`text-xs ${muted}`}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: primary }}>Pricing</p>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${fg}`}>Simple, transparent pricing</h2>
            <p className={`${muted}`}>Choose the plan that fits your team size. All plans include a 14-day free trial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, idx) => (
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

                <Link href="/signup"
                  className={`w-full text-center py-3 rounded-full font-semibold text-sm transition-all ${
                    plan.ctaStyle === 'primary'
                      ? 'text-white shadow-md hover:shadow-lg'
                      : `border ${border} ${fg} hover:bg-[${isDark ? '#3c4043' : '#f1f3f4'}]`
                  }`}
                  style={plan.ctaStyle === 'primary' ? { background: primary } : {}}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-14"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1a3a5c 0%, #1e2d1e 100%)'
              : 'linear-gradient(135deg, #1a73e8 0%, #0d652d 100%)',
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to automate your QA process?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Start auditing 100% of your calls in minutes. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-lg"
            style={{ color: '#1a73e8' }}
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t py-10 px-6 ${border}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)' }}>
              <span className="text-white text-[10px] font-bold">CP</span>
            </div>
            <span className={`text-sm font-semibold ${fg}`}>CallPilot.AI</span>
          </div>
          <p className={`text-xs ${muted}`}>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            {[
              { href: '/features', label: 'Features' },
              { href: '/pricing',  label: 'Pricing' },
              { href: '/blog',     label: 'Blog' },
              { href: '/privacy',  label: 'Privacy' },
              { href: '/terms',    label: 'Terms' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className={`${muted} transition-colors`}
                style={{ '--hover-color': primary } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.color = primary)}
                onMouseLeave={e => (e.currentTarget.style.color = '')}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

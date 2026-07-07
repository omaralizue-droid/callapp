'use client'

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
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'rgba(79,70,229,0.3)',
    title: 'Automated QA Compliance',
    desc: 'Score 100% of calls against custom compliance rules — branded greetings, mandatory disclosures, and script adherence. Eliminate manual spot checks.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(124,58,237,0.3)',
    title: 'Sentiment & Speech Analytics',
    desc: 'Track agent tone, customer escalation signals, and emotional patterns second-by-second — across every conversation at scale.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-cyan-500 to-indigo-600',
    glow: 'rgba(6,182,212,0.3)',
    title: 'AI Coaching & Feedback',
    desc: 'Generate individual coaching cards with specific transcript timestamps. Help agents improve tone, objections, and script compliance faster.',
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6" />,
    gradient: 'from-fuchsia-500 to-violet-600',
    glow: 'rgba(168,85,247,0.3)',
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
    isPrimary: false,
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
    isPrimary: true,
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
    isPrimary: false,
  },
]

const STATS = [
  { value: '3.5M+', label: 'Calls scored', color: '#818cf8' },
  { value: '95%',   label: 'QA accuracy',  color: '#67e8f9' },
  { value: '24%',   label: 'Avg improvement', color: '#c4b5fd' },
  { value: '10x',   label: 'More coverage',color: '#a78bfa' },
]

const LOGOS = ['Salesforce', 'HubSpot', 'Zendesk', 'Genesys', 'Twilio']

const TESTIMONIALS = [
  {
    quote: "CallPilot has transformed how we audit agent performance. We went from sampling 2% of calls to reviewing 100%.",
    name: 'Sarah Kim',
    role: 'QA Manager, NovaBPO',
    avatar: 'SK',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    quote: "The coaching cards are incredible. Our agents improved compliance scores by 28% in just the first month.",
    name: 'Marcus Torres',
    role: 'Operations Director, ClearCall',
    avatar: 'MT',
    gradient: 'from-violet-500 to-fuchsia-600',
  },
  {
    quote: "We've reduced call review time by 80%. The CRM sync alone saves our team hours every week.",
    name: 'Priya Nair',
    role: 'Contact Center Lead, Vertex360',
    avatar: 'PN',
    gradient: 'from-cyan-500 to-indigo-600',
  },
]

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Navigation */}
      <GoogleNav />

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden aurora-bg">
        {/* Three.js background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <LandingHeroAnimation theme="dark" />
        </div>

        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(6,10,26,0.1) 0%, rgba(6,10,26,0.65) 100%)',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Pill Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
            style={{
              background: 'rgba(79,70,229,0.15)',
              borderColor: 'rgba(99,102,241,0.35)',
              color: '#a5b4fc',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            AI-powered call quality platform for BPO teams
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Score every call.</span>
            <br />
            <span className="gradient-text-bright">Coach every agent.</span>
            <br />
            <span className="text-white/80 text-4xl md:text-5xl font-bold">Automatically.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            CallPilot uses AI to audit 100% of your support and sales calls — detecting compliance issues,
            scoring agent performance, and generating coaching notes without any manual effort.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl text-white transition-all group"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 20px rgba(79,70,229,0.45)',
              }}
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Play className="w-4 h-4" style={{ fill: '#818cf8', color: '#818cf8' }} />
              See it in action
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {['No credit card required', '14-day free trial', 'SOC2 Type II compliant'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" style={{ color: '#818cf8' }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[2]"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </section>

      {/* ── PARTNERS STRIP ────────────────────────────────────── */}
      <section className="py-10 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(13,21,53,0.4)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: 'var(--text-muted)' }}>
            Trusted by teams using
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {LOGOS.map(logo => (
              <span
                key={logo}
                className="text-sm font-bold tracking-wide transition-colors cursor-default"
                style={{ color: 'rgba(148,163,184,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.5)')}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ──────────────────────────────────────── */}
      <section id="demo" className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 gradient-text">Platform demo</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              See CallPilot analyze a real call
            </h2>
            <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Upload any call recording and instantly get a compliance scorecard, sentiment timeline,
              coaching tips, and a structured CRM note.
            </p>
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 0 60px rgba(79,70,229,0.15), 0 24px 80px rgba(0,0,0,0.5)',
              background: 'var(--bg-card)',
            }}
          >
            <InteractiveDemo />
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────── */}
      <section id="features" className="py-28 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 gradient-text">Product features</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Everything your QA team needs
            </h2>
            <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Stop manually sampling 1% of calls. CallPilot automatically grades every conversation
              and gives agents actionable feedback instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className="glass-card p-8 flex gap-5 items-start group cursor-default"
              >
                {/* Icon with gradient bg */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${feat.gradient} text-white`}
                  style={{ boxShadow: `0 4px 20px ${feat.glow}` }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:gradient-text transition-all">{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        {/* Radial glow backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(79,70,229,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className="text-5xl md:text-6xl font-black"
                style={{
                  color: stat.color,
                  textShadow: `0 0 30px ${stat.color}60`,
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 gradient-text">How it works</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Three steps to full QA coverage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <PhoneCall className="w-6 h-6" />, title: 'Upload or stream calls', desc: 'Connect your telephony platform or upload recordings. We support MP3, WAV, and live stream integrations.', gradient: 'from-indigo-500 to-violet-600', glow: 'rgba(79,70,229,0.35)' },
              { step: '02', icon: <BarChart3 className="w-6 h-6" />, title: 'AI scores & analyzes', desc: 'Our AI checks compliance, measures sentiment, detects script deviations, and generates structured notes in seconds.', gradient: 'from-violet-500 to-fuchsia-600', glow: 'rgba(124,58,237,0.35)' },
              { step: '03', icon: <Star className="w-6 h-6" />, title: 'Coach & improve', desc: 'Agents get coaching cards. Supervisors get dashboards. CRM gets structured notes. Everyone gets better.', gradient: 'from-cyan-500 to-indigo-600', glow: 'rgba(6,182,212,0.35)' },
            ].map((step, idx) => (
              <div key={idx} className="text-center space-y-5 group">
                {/* Step number */}
                <div className="text-xs font-black tracking-widest uppercase mb-2 gradient-text">{step.step}</div>
                {/* Icon orb */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-gradient-to-br ${step.gradient} text-white transition-all duration-300 group-hover:scale-110`}
                  style={{ boxShadow: `0 8px 30px ${step.glow}` }}
                >
                  {step.icon}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 gradient-text">Customer stories</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Trusted by QA teams worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="glass-card p-8 flex flex-col justify-between group">
                <div>
                  <div className="flex mb-5 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ fill: '#818cf8', color: '#818cf8' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed italic mb-6" style={{ color: 'var(--text-secondary)' }}>
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br ${t.gradient}`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-3 gradient-text">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Choose the plan that fits your team size. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-2xl flex flex-col transition-all duration-300"
                style={
                  plan.isPopular
                    ? {
                        background: 'linear-gradient(145deg, rgba(79,70,229,0.2), rgba(124,58,237,0.15))',
                        border: '1px solid rgba(99,102,241,0.45)',
                        boxShadow: '0 0 40px rgba(79,70,229,0.25), 0 20px 60px rgba(0,0,0,0.4)',
                      }
                    : {
                        background: 'var(--bg-card)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }
                }
              >
                {plan.isPopular && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full uppercase"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      boxShadow: '0 4px 15px rgba(79,70,229,0.5)',
                    }}
                  >
                    Most popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.unit}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.isPopular ? '#818cf8' : '#4f46e5' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all"
                  style={
                    plan.isPrimary
                      ? {
                          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.10)',
                          color: 'var(--text-primary)',
                        }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div
          className="max-w-4xl mx-auto text-center rounded-3xl p-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(124,58,237,0.20) 50%, rgba(6,182,212,0.15) 100%)',
            border: '1px solid rgba(99,102,241,0.30)',
            boxShadow: '0 0 80px rgba(79,70,229,0.20), 0 40px 120px rgba(0,0,0,0.5)',
          }}
        >
          {/* Glow orbs inside CTA */}
          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Ready to automate your QA process?
            </h2>
            <p className="max-w-xl mx-auto mb-8 text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.8)' }}>
              Start auditing 100% of your calls in minutes. No credit card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl text-white transition-all group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer
        className="py-12 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              <span className="text-white text-xs font-black">CP</span>
            </div>
            <span className="text-sm font-bold text-white">CallPilot<span className="gradient-text">.AI</span></span>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            {[
              { href: '/features', label: 'Features' },
              { href: '/pricing',  label: 'Pricing' },
              { href: '/blog',     label: 'Blog' },
              { href: '/privacy',  label: 'Privacy' },
              { href: '/terms',    label: 'Terms' },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-indigo-400"
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

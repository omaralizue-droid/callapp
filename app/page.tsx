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
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    color: 'bg-indigo-50',
    title: 'Automated QA Compliance',
    desc: 'Score 100% of calls against custom compliance rules — branded greetings, mandatory disclosures, and script adherence. Eliminate manual spot checks.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
    color: 'bg-indigo-50',
    title: 'Sentiment & Speech Analytics',
    desc: 'Track agent tone, customer escalation signals, and emotional patterns second-by-second — across every conversation at scale.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    color: 'bg-indigo-50',
    title: 'AI Coaching & Feedback',
    desc: 'Generate individual coaching cards with specific transcript timestamps. Help agents improve tone, objections, and script compliance faster.',
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6 text-indigo-600" />,
    color: 'bg-indigo-50',
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
    ctaStyle: 'secondary',
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
    ctaStyle: 'secondary',
  },
]

const STATS = [
  { value: '3.5M+', label: 'Calls scored' },
  { value: '95%',   label: 'QA accuracy' },
  { value: '24%',   label: 'Avg improvement' },
  { value: '10x',   label: 'More coverage' },
]

const LOGOS = ['Salesforce', 'HubSpot', 'Zendesk', 'Genesys', 'Twilio']

const TESTIMONIALS = [
  {
    quote: "CallPilot has transformed how we audit agent performance. We went from sampling 2% of calls to reviewing 100%.",
    name: 'Sarah Kim',
    role: 'QA Manager, NovaBPO',
    avatar: 'SK',
  },
  {
    quote: "The coaching cards are incredible. Our agents improved compliance scores by 28% in just the first month.",
    name: 'Marcus Torres',
    role: 'Operations Director, ClearCall',
    avatar: 'MT',
  },
  {
    quote: "We've reduced call review time by 80%. The CRM sync alone saves our team hours every week.",
    name: 'Priya Nair',
    role: 'Contact Center Lead, Vertex360',
    avatar: 'PN',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      
      {/* Navigation */}
      <GoogleNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Constellation background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <LandingHeroAnimation theme="light" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 mb-8 border border-indigo-100">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            AI-powered call quality platform for BPO teams
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 mb-6">
            Score every call.{' '}
            <span className="text-indigo-600">Coach every agent.</span>
            <br />
            Automatically.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            CallPilot uses AI to audit 100% of your support and sales calls — detecting compliance issues, scoring agent performance, and generating coaching notes without any manual effort.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-3.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#demo"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-3.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              See it in action
            </a>
          </div>

          {/* Trust features */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              SOC2 Type II compliant
            </span>
          </div>
        </div>
      </section>

      {/* Partners section */}
      <section className="border-y border-slate-100 py-10 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
            Trusted by teams using
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {LOGOS.map(logo => (
              <span key={logo} className="text-sm font-semibold text-slate-400/80 tracking-wide">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">Platform demo</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              See CallPilot analyze a real call
            </h2>
            <p className="max-w-xl mx-auto text-slate-600 text-sm">
              Upload any call recording and instantly get a compliance scorecard, sentiment timeline, coaching tips, and a structured CRM note.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <InteractiveDemo />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">Product features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Everything your QA team needs
            </h2>
            <p className="max-w-xl mx-auto text-slate-600 text-sm">
              Stop manually sampling 1% of calls. CallPilot automatically grades every conversation and gives agents actionable feedback instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, idx) => (
              <div key={idx}
                className="p-8 rounded-xl border border-slate-200 bg-white flex gap-5 items-start hover:border-slate-300 transition-all hover:shadow-sm"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${feat.color}`}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Callout */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-indigo-600">
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Step by Step */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Three steps to full QA coverage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <PhoneCall className="w-6 h-6" />, title: 'Upload or stream calls', desc: 'Connect your telephony platform or upload recordings. We support MP3, WAV, and live stream integrations.' },
              { step: '02', icon: <BarChart3 className="w-6 h-6" />, title: 'AI scores & analyzes', desc: 'Our AI checks compliance, measures sentiment, detects script deviations, and generates structured notes in seconds.' },
              { step: '03', icon: <Star className="w-6 h-6" />, title: 'Coach & improve', desc: 'Agents get coaching cards. Supervisors get dashboards. CRM gets structured notes. Everyone gets better.' },
            ].map((step, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-indigo-50 text-indigo-600">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{step.step}</div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">Customer stories</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Trusted by QA teams worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-8 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex mb-4 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 italic mb-6">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold bg-indigo-600 shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wide">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-600 text-sm">Choose the plan that fits your team size. All plans include a 14-day free trial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, idx) => (
              <div key={idx}
                className={`p-8 rounded-xl border flex flex-col relative transition-all ${
                  plan.isPopular
                    ? 'border-indigo-600 shadow-sm bg-white ring-1 ring-indigo-600/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold tracking-wider px-3.5 py-1 rounded-full uppercase bg-indigo-600 shadow-sm">
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

                <Link href="/signup"
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
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-14 bg-indigo-600 shadow-lg shadow-indigo-600/10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to automate your QA process?
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-sm">
            Start auditing 100% of your calls in minutes. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-600">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="text-sm font-bold text-slate-800">CallPilot.AI</span>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

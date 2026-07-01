'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ShieldCheck, TrendingUp, Cpu, FileSpreadsheet, ArrowRight, Play, Check, Sun, Moon } from 'lucide-react'
import InteractiveDemo from '@/components/landing/InteractiveDemo'
import LandingHeroAnimation from '@/components/landing/LandingHeroAnimation'

const FEATURES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    title: 'Automated QA Compliance',
    desc: 'Instantly score every call against custom guidelines, checking for branded greetings, mandatory disclosures, and script adherence.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
    title: 'Sentiment & Tone Analytics',
    desc: 'Track supervisor-level sentiment trends, customer escalation warnings, and agent emotional response patterns second-by-second.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
    title: 'AI Coaching & Feedback',
    desc: 'Generate individual agent coaching cards highlighting key strengths, compliant actions, and templates for soft-skill improvement.',
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6 text-cyan-400" />,
    title: 'One-Click CRM Export',
    desc: 'Structure long calls into dense CRM notes containing key complaints, resolutions, and action items ready to synchronize.',
  },
]

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

export default function Home() {
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
  const statsBgClass = theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-slate-100/60 border-slate-200/60'

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300 relative overflow-x-hidden`}>
      
      {/* Three.js Interactive Hero Constellation Background */}
      <div className="absolute top-0 left-0 w-full h-[760px] pointer-events-none overflow-hidden z-0">
        <LandingHeroAnimation theme={theme} />
        {/* Glow overlays */}
        {theme === 'dark' ? (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-200/10 rounded-full blur-[150px] pointer-events-none" />
          </>
        )}
      </div>

      {/* Header / Navbar */}
      <header className={`sticky top-0 z-50 glass border-b ${headerClass} py-4 px-6 md:px-12 flex items-center justify-between transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${textTitleClass}`}>
            CallPilot<span className="text-cyan-500">.AI</span>
          </span>
        </div>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${textDescClass}`}>
          <a href="#features" className="hover:text-cyan-500 transition-colors">Features</a>
          <a href="#demo" className="hover:text-cyan-500 transition-colors">Interactive Demo</a>
          <a href="#pricing" className="hover:text-cyan-500 transition-colors">Pricing</a>
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
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow z-10 relative">
        <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} text-xs font-semibold text-cyan-500 mb-8 animate-pulse`}>
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            Empowering BPO Call Intelligence
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight ${textTitleClass} max-w-4xl mx-auto leading-[1.1] mb-6`}>
            Scale QA Scoring and Coaching with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              Autonomous AI
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl ${textDescClass} max-w-2xl mx-auto leading-relaxed mb-10`}>
            Upload voice recordings or connect your CRM. CallPilot analyzes compliance, scores quality assurance, flags customer sentiment, and drafts coaching reviews instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 group transition-all shadow-xl shadow-cyan-500/20 hover:scale-[1.03]"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demo"
              className={`w-full sm:w-auto glass hover:bg-white/5 font-semibold px-8 py-4 rounded-lg border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} flex items-center justify-center gap-2 transition-all hover:scale-[1.03] ${textTitleClass}`}
            >
              <Play className="w-4 h-4 text-cyan-500 fill-cyan-500" />
              See Platform Demo
            </a>
          </div>

          {/* Large Mock Dashboard Wrapper */}
          <div id="demo" className="max-w-5xl mx-auto pt-4 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 rounded-2xl blur-3xl pointer-events-none" />
            <InteractiveDemo />
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className={`py-20 px-6 md:px-12 max-w-7xl mx-auto border-t ${sectionBorderClass}`}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${textTitleClass} mb-4`}>
              Everything you need to automate Call Audits
            </h2>
            <p className={`${textMutedClass} leading-relaxed`}>
              Stop manually sampling 1% of calls. Audit 100% of calls instantly, identify performance patterns, and increase agent performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-6 transition-all duration-300 relative group flex flex-col justify-between border ${
                  theme === 'dark' 
                    ? 'bg-slate-950/40 border-white/5' 
                    : 'bg-white border-slate-200/60 shadow-md shadow-slate-100/60 hover:shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border shadow-inner ${
                    theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {feat.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${textTitleClass} group-hover:text-cyan-500 transition-colors`}>
                    {feat.title}
                  </h3>
                  <p className={`${textMutedClass} text-xs leading-relaxed`}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics Callout */}
        <section className={`py-16 border-y ${statsBgClass} transition-colors duration-300`}>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <span className="block text-4xl md:text-5xl font-black text-cyan-500 mb-2">10x</span>
              <span className={`text-sm font-semibold uppercase tracking-wider ${textMutedClass}`}>Increase in Audited Call Volume</span>
            </div>
            <div>
              <span className="block text-4xl md:text-5xl font-black text-indigo-500 mb-2">24%</span>
              <span className={`text-sm font-semibold uppercase tracking-wider ${textMutedClass}`}>Average Compliance QA Score Gain</span>
            </div>
            <div>
              <span className="block text-4xl md:text-5xl font-black text-cyan-500 mb-2">3.5m</span>
              <span className={`text-sm font-semibold uppercase tracking-wider ${textMutedClass}`}>Hours of BPO Conversations Scored</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section id="pricing" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${textTitleClass} mb-4`}>
              Flexible Plans for Every Call Center
            </h2>
            <p className={`${textMutedClass} leading-relaxed`}>
              Choose the scope that matches your seat count. All plans feature unified user settings and API integrations.
            </p>
          </div>

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
        </section>

        {/* Call to Action Footer */}
        <section className={`relative py-24 px-6 text-center max-w-5xl mx-auto mb-12 border rounded-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-100'
        }`}>
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
          <h2 className={`text-3xl md:text-5xl font-black ${textTitleClass} tracking-tight mb-4`}>
            Ready to upgrade your call intelligence?
          </h2>
          <p className={`${textMutedClass} max-w-xl mx-auto leading-relaxed mb-8 text-sm`}>
            Sign up in less than 2 minutes. No credit card required to pilot our analysis dashboard and integrate call summaries.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-lg shadow-xl shadow-cyan-500/25 transition-transform hover:scale-105"
          >
            Start Auditing Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t ${sectionBorderClass} py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${textMutedClass} z-10 relative`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center">
            <Cpu className="w-3 h-3 text-slate-950" />
          </div>
          <span className={`font-semibold ${textDescClass}`}>CallPilot AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cyan-500">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-500">Terms of Service</a>
        </div>
      </footer>

    </div>
  )
}

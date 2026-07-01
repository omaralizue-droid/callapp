'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, ShieldCheck, TrendingUp, Sparkles, FileSpreadsheet, ArrowRight, Sun, Moon, Check } from 'lucide-react'

export default function FeaturesPage() {
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

  const featuresList = [
    {
      title: 'Automated QA Checklists',
      icon: <ShieldCheck className="w-6 h-6 text-cyan-500" />,
      desc: 'No more manual spot-checking. Audit 100% of outbound or inbound support calls against exact rules automatically. Verify call disclosures, brand compliance, and script guidelines instantly.',
      details: ['Keyword compliance verification', 'Disclosures & terms checks', 'Custom grading rubrics scoreboards', 'Multi-channel caller splitting']
    },
    {
      title: 'Sentiment & Speech Analytics',
      icon: <TrendingUp className="w-6 h-6 text-cyan-500" />,
      desc: 'Trace voice dynamics, speaker speed, silences, and interruptions. CallPilot maps customer satisfaction fluctuations and notifies supervisors of customer escalation triggers in real-time.',
      details: ['Interruptions count analytics', 'Silence & dead-air logs', 'Frustration pitch analysis', 'Overall sentiment averages']
    },
    {
      title: 'AI-Generated Coaching Cards',
      icon: <Sparkles className="w-6 h-6 text-cyan-500" />,
      desc: 'Empower agent learning loops with immediate, constructive AI feedback. Agents receive dynamic dashboard tips detailing exact transcript timings to adjust tone or objections.',
      details: ['Strengths & improvements flags', 'Actionable wording suggestions', 'Context-aware objection support', 'Direct review portal override']
    },
    {
      title: 'One-Click CRM Structuring',
      icon: <FileSpreadsheet className="w-6 h-6 text-cyan-500" />,
      desc: 'Turn long call recordings into structured data logs automatically. CallPilot exports structured summaries, customer resolutions, purposing, and follow-up items straight to Salesforce or HubSpot.',
      details: ['JSON & CSV schema models', 'Auto contact records updates', 'Wrap-up time reduction', 'Multi-platform integrations']
    }
  ]

  const faqs = [
    { q: 'How accurate is the compliance grading?', a: 'By utilizing multi-modal LLM evaluation pipelines, CallPilot scores call recordings with over 95% Word Error Rate alignment to human auditors.' },
    { q: 'Is customer call data secure?', a: 'Yes. CallPilot complies with SOC2 Type II guidelines. All audio records and transcripts are encrypted at rest, and credit card numbers are scrubbed automatically.' }
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
          <Link href="/features" className="text-cyan-500 font-semibold">Features</Link>
          <Link href="/pricing" className="hover:text-cyan-500 transition-colors">Pricing</Link>
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
            className="bg-gradient-to-tr from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.03]"
          >
            Connect Node
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow z-10 relative py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase mb-3 block">Product Features</span>
          <h1 className={`text-4xl md:text-5xl font-black ${textTitleClass} leading-tight mb-4`}>
            Next-Gen Conversation Intelligence
          </h1>
          <p className={`${textDescClass} text-lg max-w-2xl mx-auto`}>
            Audit 100% of support and sales calls. Automatically extract compliance scorecards, coaching cards, and structured notes.
          </p>
        </div>

        {/* Detailed features layout */}
        <div className="space-y-16">
          {featuresList.map((feat, idx) => (
            <div 
              key={idx}
              className={`p-8 rounded-xl border flex flex-col md:flex-row gap-8 items-start ${
                theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/60 shadow-lg'
              }`}
            >
              <div className={`w-14 h-14 rounded-lg shrink-0 flex items-center justify-center border ${
                theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                {feat.icon}
              </div>
              <div className="space-y-4 flex-grow">
                <h2 className={`text-2xl font-bold ${textTitleClass}`}>{feat.title}</h2>
                <p className={`${textDescClass} leading-relaxed text-sm`}>{feat.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {feat.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs">
                      <Check className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span className={textDescClass}>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
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

        {/* Action Banner */}
        <section className={`mt-24 text-center p-12 rounded-xl border ${
          theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200/60 shadow-lg'
        }`}>
          <h2 className={`text-3xl font-black ${textTitleClass} mb-4`}>Automate your call quality processes today</h2>
          <p className={`${textDescClass} text-sm max-w-md mx-auto mb-8`}>
            Start grading calls, tracking compliance metrics, and coaching agents with AI. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-lg"
          >
            Start Auditing Free
            <ArrowRight className="w-4 h-4" />
          </Link>
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

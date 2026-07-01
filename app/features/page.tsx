'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, TrendingUp, Sparkles, FileSpreadsheet, Check, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export default function FeaturesPage() {
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

  const featuresList = [
    {
      title: 'Automated QA Checklists',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'g-icon-blue',
      desc: 'No more manual spot-checking. Audit 100% of outbound or inbound support calls against exact rules automatically. Verify call disclosures, brand compliance, and script guidelines instantly.',
      details: ['Keyword compliance verification', 'Disclosures & terms checks', 'Custom grading rubrics', 'Multi-channel caller splitting'],
    },
    {
      title: 'Sentiment & Speech Analytics',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'g-icon-red',
      desc: 'Trace voice dynamics, speaker speed, silences, and interruptions. CallPilot maps customer satisfaction fluctuations and notifies supervisors of customer escalation triggers in real-time.',
      details: ['Interruption count analytics', 'Silence & dead-air logs', 'Frustration pitch analysis', 'Overall sentiment averages'],
    },
    {
      title: 'AI-Generated Coaching Cards',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'g-icon-yellow',
      desc: 'Empower agent learning loops with immediate, constructive AI feedback. Agents receive dynamic dashboard tips detailing exact transcript timings to adjust tone or objections.',
      details: ['Strengths & improvement flags', 'Actionable wording suggestions', 'Context-aware objection support', 'Direct review portal override'],
    },
    {
      title: 'One-Click CRM Structuring',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      color: 'g-icon-green',
      desc: 'Turn long call recordings into structured data logs automatically. CallPilot exports structured summaries, customer resolutions, and follow-up items straight to Salesforce or HubSpot.',
      details: ['JSON & CSV schema models', 'Auto contact record updates', 'Wrap-up time reduction', 'Multi-platform integrations'],
    },
  ]

  const faqs = [
    { q: 'How accurate is the compliance grading?', a: 'By utilizing multi-modal LLM evaluation pipelines, CallPilot scores call recordings with over 95% alignment to human auditors — verified across 3.5M+ scored calls.' },
    { q: 'Is customer call data secure?', a: 'Yes. CallPilot complies with SOC2 Type II. All audio records and transcripts are encrypted at rest, and credit card numbers are automatically scrubbed.' },
    { q: 'Can I customize the grading rubric?', a: 'Absolutely. Professional and Enterprise plans allow fully custom compliance rubrics tailored to your industry scripts, disclosure requirements, and brand guidelines.' },
    { q: 'Which CRM platforms do you support?', a: 'We natively support Salesforce and HubSpot. Additional integrations via Zapier and REST API are available on all plans.' },
  ]

  return (
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <GoogleNav activePage="features" theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <section className={`py-20 px-6 text-center ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Product Features</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${fg}`}>
            Next-gen conversation intelligence
          </h1>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${muted}`}>
            Audit 100% of support and sales calls. Automatically extract compliance scorecards, coaching cards, and structured CRM notes — without lifting a finger.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3 rounded-full transition-all hover:shadow-lg"
            style={{ background: primary }}
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature details */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {featuresList.map((feat, idx) => (
            <div key={idx}
              className={`p-8 rounded-2xl border flex flex-col md:flex-row gap-7 items-start hover:shadow-md transition-all ${cardBg}`}
            >
              <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${feat.color}`}>
                {feat.icon}
              </div>
              <div className="space-y-4 flex-grow">
                <h2 className={`text-xl font-semibold ${fg}`}>{feat.title}</h2>
                <p className={`text-sm leading-relaxed ${muted}`}>{feat.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {feat.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 shrink-0" style={{ color: '#34a853' }} />
                      <span className={muted}>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-20 px-6 ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${fg}`}>Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
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
          <h2 className="text-3xl font-bold text-white mb-4">Automate your call quality processes today</h2>
          <p className="text-white/80 max-w-md mx-auto mb-8">
            Start grading calls, tracking compliance, and coaching agents with AI. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-lg"
            style={{ color: '#1a73e8' }}
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${muted} ${border}`}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" onMouseEnter={e => (e.currentTarget.style.color = primary)} onMouseLeave={e => (e.currentTarget.style.color = '')} className="transition-colors">Privacy</Link>
          <Link href="/terms" onMouseEnter={e => (e.currentTarget.style.color = primary)} onMouseLeave={e => (e.currentTarget.style.color = '')} className="transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Code, Zap, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

const SECTIONS = [
  {
    icon: <Zap className="w-5 h-5" />, color: 'g-icon-blue',
    title: 'Getting started',
    desc: 'Set up CallPilot and upload your first call in under 5 minutes.',
    articles: ['Quick start guide', 'Uploading audio files', 'Connecting your telephony platform', 'Setting your first QA rubric'],
  },
  {
    icon: <BookOpen className="w-5 h-5" />, color: 'g-icon-green',
    title: 'Compliance & QA',
    desc: 'Build compliance scoring rubrics and automate your QA workflows.',
    articles: ['Creating custom rubrics', 'Keyword compliance rules', 'Scoring thresholds & grading', 'Exporting QA reports'],
  },
  {
    icon: <Code className="w-5 h-5" />, color: 'g-icon-red',
    title: 'API & integrations',
    desc: 'Integrate CallPilot into your existing telephony stack via REST API.',
    articles: ['REST API reference', 'Salesforce integration', 'HubSpot integration', 'Webhook events'],
  },
]

export default function DocsPage() {
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
      <GoogleNav theme={theme} toggleTheme={toggleTheme} />

      <section className={`py-20 px-6 text-center ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Documentation</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${fg}`}>Developer docs</h1>
          <p className={`text-lg ${muted}`}>
            Everything you need to integrate CallPilot into your call center workflows.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {SECTIONS.map((sec, idx) => (
            <div key={idx} className={`p-7 rounded-2xl border hover:shadow-md transition-all ${cardBg}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${sec.color}`}>
                {sec.icon}
              </div>
              <h2 className={`text-lg font-semibold mb-2 ${fg}`}>{sec.title}</h2>
              <p className={`text-sm mb-5 ${muted}`}>{sec.desc}</p>
              <ul className="space-y-2">
                {sec.articles.map((article, aIdx) => (
                  <li key={aIdx}>
                    <span className={`text-sm flex items-center gap-2 ${muted}`}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: primary }} />
                      {article}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14"
          style={{ background: isDark ? 'linear-gradient(135deg, #1a3a5c, #1e2d1e)' : 'linear-gradient(135deg, #1a73e8, #0d652d)' }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 text-sm mb-6">Create your account and upload your first call in minutes.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg transition-all"
            style={{ color: '#1a73e8' }}
          >
            Get started free <ArrowRight className="w-4 h-4" />
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

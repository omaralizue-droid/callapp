'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, BookOpen, Zap, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

const FAQS = [
  { q: 'How do I upload a call recording?',         a: 'Navigate to the Upload page, drag and drop your audio file (MP3 or WAV), select the agent, and click Analyze. Results appear within 30 seconds.' },
  { q: 'What audio formats are supported?',         a: 'We support MP3, WAV, M4A, and OGG. Maximum file size is 500MB per upload. For longer recordings, split them or use our streaming API.' },
  { q: 'How do I invite team members?',             a: 'Go to Settings → Team → Invite Members. Enter their email and select a role (Reviewer, Agent, or Admin). They\'ll receive an invite via email.' },
  { q: 'Can I export my data?',                     a: 'Yes. All call scores, transcripts, and coaching cards can be exported in CSV or JSON format from your Reports page.' },
  { q: 'How do I set up custom QA rubrics?',        a: 'Go to Settings → QA Rubrics → New Rubric. Define your compliance rules, keyword requirements, and scoring weights. Apply the rubric to any call upload.' },
  { q: 'What if I need to cancel my subscription?', a: 'You can cancel anytime from Settings → Billing → Cancel Plan. Your access continues until the end of your billing period.' },
]

const CATEGORIES = [
  { icon: <Zap className="w-5 h-5" />,           color: 'g-icon-blue',   label: 'Getting started' },
  { icon: <BookOpen className="w-5 h-5" />,       color: 'g-icon-green',  label: 'Billing & plans' },
  { icon: <MessageCircle className="w-5 h-5" />,  color: 'g-icon-red',    label: 'Technical issues' },
]

export default function HelpPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [open, setOpen] = useState<number | null>(null)

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
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Help Center</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${fg}`}>How can we help?</h1>
          <p className={`text-lg ${muted}`}>Find answers to common questions or contact our support team.</p>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border text-center hover:shadow-md transition-all cursor-pointer ${cardBg}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className={`text-sm font-semibold ${fg}`}>{cat.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className={`py-16 px-6 ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold mb-10 ${fg}`}>Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx}
                className={`rounded-2xl border overflow-hidden ${cardBg}`}
              >
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className={`w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-colors ${fg}`}
                >
                  <span className="text-sm font-semibold">{faq.q}</span>
                  <span className={`text-lg leading-none transition-transform ${open === idx ? 'rotate-45' : ''}`}
                    style={{ color: primary }}>+</span>
                </button>
                {open === idx && (
                  <div className={`px-6 pb-5 text-sm leading-relaxed ${muted}`}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-12"
          style={{ background: isDark ? 'linear-gradient(135deg, #1a3a5c, #1e2d1e)' : 'linear-gradient(135deg, #1a73e8, #0d652d)' }}
        >
          <h2 className="text-2xl font-bold text-white mb-3">Still need help?</h2>
          <p className="text-white/80 text-sm mb-6">Our support team responds within 1 business day.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg transition-all"
            style={{ color: '#1a73e8' }}
          >
            Contact support <ArrowRight className="w-4 h-4" />
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

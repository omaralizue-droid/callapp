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
  { icon: <Zap className="w-5 h-5 text-indigo-600" />,           color: 'bg-indigo-50',   label: 'Getting started' },
  { icon: <BookOpen className="w-5 h-5 text-indigo-600" />,       color: 'bg-indigo-50',  label: 'Billing & plans' },
  { icon: <MessageCircle className="w-5 h-5 text-indigo-600" />,  color: 'bg-indigo-50',    label: 'Technical issues' },
]

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav />

      <section className="py-20 px-6 text-center bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Help Center</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">How can we help?</h1>
          <p className="text-lg text-slate-600">Find answers to common questions or contact our support team.</p>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-white text-center hover:border-slate-300 transition-all hover:shadow-sm cursor-pointer">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800">{cat.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 bg-slate-50/50 border-t border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-10 text-slate-900 text-center">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 transition-all"
              >
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-colors text-slate-800"
                >
                  <span className="text-sm font-bold">{faq.q}</span>
                  <span className="text-lg leading-none transition-transform font-bold text-indigo-600"
                    style={{ transform: open === idx ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {open === idx && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600 border-t border-slate-50 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support footer block */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-12 bg-indigo-600 shadow-lg shadow-indigo-600/10">
          <h2 className="text-2xl font-extrabold text-white mb-3">Still need help?</h2>
          <p className="text-indigo-100 text-sm mb-6">Our support team responds within 1 business day.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Contact support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/50">
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

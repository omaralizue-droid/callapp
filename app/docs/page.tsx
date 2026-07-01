'use client'

import Link from 'next/link'
import { BookOpen, Code, Zap, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

const SECTIONS = [
  {
    icon: <Zap className="w-5 h-5 text-indigo-600" />, color: 'bg-indigo-50',
    title: 'Getting started',
    desc: 'Set up CallPilot and upload your first call in under 5 minutes.',
    articles: ['Quick start guide', 'Uploading audio files', 'Connecting your telephony platform', 'Setting your first QA rubric'],
  },
  {
    icon: <BookOpen className="w-5 h-5 text-indigo-600" />, color: 'bg-indigo-50',
    title: 'Compliance & QA',
    desc: 'Build compliance scoring rubrics and automate your QA workflows.',
    articles: ['Creating custom rubrics', 'Keyword compliance rules', 'Scoring thresholds & grading', 'Exporting QA reports'],
  },
  {
    icon: <Code className="w-5 h-5 text-indigo-600" />, color: 'bg-indigo-50',
    title: 'API & integrations',
    desc: 'Integrate CallPilot into your existing telephony stack via REST API.',
    articles: ['REST API reference', 'Salesforce integration', 'HubSpot integration', 'Webhook events'],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav />

      <section className="py-20 px-6 text-center bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Documentation</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">Developer docs</h1>
          <p className="text-lg text-slate-600">
            Everything you need to integrate CallPilot into your call center workflows.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {SECTIONS.map((sec, idx) => (
            <div key={idx} className="p-7 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${sec.color}`}>
                {sec.icon}
              </div>
              <h2 className="text-lg font-bold mb-2 text-slate-900">{sec.title}</h2>
              <p className="text-sm mb-5 text-slate-500 leading-relaxed">{sec.desc}</p>
              <ul className="space-y-2">
                {sec.articles.map((article, aIdx) => (
                  <li key={aIdx}>
                    <span className="text-sm flex items-center gap-2 text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      {article}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14 bg-indigo-600 shadow-lg shadow-indigo-600/10">
          <h2 className="text-2xl font-extrabold text-white mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 text-sm mb-6">Create your account and upload your first call in minutes.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
          >
            Get started free <ArrowRight className="w-4 h-4" />
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

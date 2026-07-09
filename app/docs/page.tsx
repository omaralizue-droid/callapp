import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Code, Zap, ArrowRight, Check } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'CallPilot AI Documentation | Developer Guides & API Reference',
  description: 'Learn how to set up CallPilot AI, configure custom QA rubrics, track speech analytics, and connect Salesforce or HubSpot integrations via REST API.',
  openGraph: {
    title: 'CallPilot AI Documentation | Developer Guides & API Reference',
    description: 'Learn how to set up CallPilot AI, configure custom QA rubrics, track speech analytics, and connect Salesforce or HubSpot integrations via REST API.',
    url: 'https://callpilot.ai/docs',
    type: 'website',
  }
}

const docsStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'CallPilot AI Documentation',
  'description': 'Developer guides, integration specs, and compliance rubrics for CallPilot AI.',
  'url': 'https://callpilot.ai/docs',
}

const SECTIONS = [
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />, glow: 'rgba(79,70,229,0.15)',
    title: 'Getting started',
    desc: 'Set up CallPilot and upload your first call in under 5 minutes.',
    articles: ['Quick start guide', 'Uploading audio files', 'Connecting your telephony platform', 'Setting your first QA rubric'],
  },
  {
    icon: <BookOpen className="w-5 h-5 text-cyan-400" />, glow: 'rgba(6,182,212,0.15)',
    title: 'Compliance & QA',
    desc: 'Build compliance scoring rubrics and automate your QA workflows.',
    articles: ['Creating custom rubrics', 'Keyword compliance rules', 'Scoring thresholds & grading', 'Exporting QA reports'],
  },
  {
    icon: <Code className="w-5 h-5 text-purple-400" />, glow: 'rgba(168,85,247,0.15)',
    title: 'API & integrations',
    desc: 'Integrate CallPilot into your existing telephony stack via REST API.',
    articles: ['REST API reference', 'Salesforce integration', 'HubSpot integration', 'Webhook events'],
  },
]

export default function DocsPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsStructuredData) }}
      />
      <GoogleNav activePage="docs" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Documentation</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Developer <span className="gradient-text-bright">docs</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to integrate CallPilot into your call center workflows.
          </p>
        </div>
      </section>

      {/* Docs Grid */}
      <section className="py-24 px-6 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {SECTIONS.map((sec, idx) => (
            <div key={idx} className="glass-card p-7 hover:scale-[1.01] transition-all">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/10"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: `0 0 15px ${sec.glow}`,
                }}
              >
                {sec.icon}
              </div>
              <h2 className="text-base font-bold mb-2 text-white">{sec.title}</h2>
              <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sec.desc}</p>
              <ul className="space-y-2">
                {sec.articles.map((article, aIdx) => (
                  <li key={aIdx}>
                    <span className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      {article}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-950/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="max-w-md mx-auto mb-6 text-xs" style={{ color: 'var(--text-secondary)' }}>Create your account and upload your first call in minutes.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-8 py-3.5 rounded-xl text-indigo-950 hover:bg-slate-100 transition-all shadow-lg"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-slate-950/80" style={{ color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

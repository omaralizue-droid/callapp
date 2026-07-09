import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, BookOpen, Zap, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'CallPilot AI Help Center | Support Articles & Guides',
  description: 'Search support guides and FAQs for CallPilot AI. Learn how to upload call recordings, manage team invites, export data, and configure QA rubrics.',
  openGraph: {
    title: 'CallPilot AI Help Center | Support Articles & Guides',
    description: 'Search support guides and FAQs for CallPilot AI. Learn how to upload call recordings, manage team invites, export data, and configure QA rubrics.',
    url: 'https://callpilot.ai/help',
    type: 'website',
  }
}

const FAQS = [
  { q: 'How do I upload a call recording?',         a: 'Navigate to the Upload page, drag and drop your audio file (MP3 or WAV), select the agent, and click Analyze. Results appear within 30 seconds.' },
  { q: 'What audio formats are supported?',         a: 'We support MP3, WAV, M4A, and OGG. Maximum file size is 500MB per upload. For longer recordings, split them or use our streaming API.' },
  { q: 'How do I invite team members?',             a: 'Go to Settings → Team → Invite Members. Enter their email and select a role (Reviewer, Agent, or Admin). They\'ll receive an invite via email.' },
  { q: 'Can I export my data?',                     a: 'Yes. All call scores, transcripts, and coaching cards can be exported in CSV or JSON format from your Reports page.' },
  { q: 'How do I set up custom QA rubrics?',        a: 'Go to Settings → QA Rubrics → New Rubric. Define your compliance rules, keyword requirements, and scoring weights. Apply the rubric to any call upload.' },
  { q: 'What if I need to cancel my subscription?', a: 'You can cancel anytime from Settings → Billing → Cancel Plan. Your access continues until the end of your billing period.' },
]

const CATEGORIES = [
  { icon: <Zap className="w-5 h-5 text-indigo-400" />,           glow: 'rgba(79,70,229,0.15)',   label: 'Getting started' },
  { icon: <BookOpen className="w-5 h-5 text-cyan-400" />,       glow: 'rgba(6,182,212,0.15)',  label: 'Billing & plans' },
  { icon: <MessageCircle className="w-5 h-5 text-purple-400" />,  glow: 'rgba(168,85,247,0.15)',    label: 'Technical issues' },
]

export default function HelpPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <GoogleNav />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Help Center</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            How can we <span className="gradient-text-bright">help?</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Find answers to common questions or contact our support team.
          </p>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-16 px-6 relative bg-slate-950/20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="glass-card p-6 text-center hover:scale-[1.01] transition-all cursor-pointer">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: `0 0 15px ${cat.glow}`,
                }}
              >
                {cat.icon}
              </div>
              <h3 className="text-xs font-bold text-white">{cat.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-24 px-6 border-t border-b border-white/5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-4xl font-black mb-10 text-white text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group border border-white/5 rounded-xl bg-slate-900/40 p-5 overflow-hidden transition-all hover:border-indigo-500/30">
                <summary className="flex justify-between items-center font-bold text-xs md:text-sm text-white cursor-pointer select-none">
                  {faq.q}
                  <span className="text-indigo-400 group-open:rotate-180 transition-transform duration-200">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </span>
                </summary>
                <p className="text-[11px] md:text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Support block */}
      <section className="py-20 px-6 bg-slate-950/40">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3">Still need help?</h2>
          <p className="max-w-md mx-auto mb-6 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Our support team responds within 1 business day.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-8 py-3.5 rounded-xl text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
          >
            Contact support <ArrowRight className="w-4 h-4" />
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

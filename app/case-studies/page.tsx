import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, TrendingUp, Sparkles, ArrowRight, Check, Star, Users, PhoneCall } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'CallPilot AI Case Studies | Real Call Center QA Results',
  description: 'Read how support centers and BPOs use CallPilot AI to increase QA call audit coverage to 100%, improve agent compliance scores, and reduce wrap-up times.',
  openGraph: {
    title: 'CallPilot AI Case Studies | Real Call Center QA Results',
    description: 'Read how support centers and BPOs use CallPilot AI to increase QA call audit coverage to 100%, improve agent compliance scores, and reduce wrap-up times.',
    url: 'https://callpilot.ai/case-studies',
    type: 'website',
  }
}

const caseStudiesStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'CallPilot AI Case Studies',
  'description': 'Real-world customer success stories from call centers and BPOs auditing call quality with CallPilot AI.',
  'url': 'https://callpilot.ai/case-studies',
}

const CASE_STUDIES = [
  {
    company: 'NovaBPO',
    logo: 'NB',
    logoGlow: 'rgba(79,70,229,0.2)',
    metrics: [
      { label: 'Auditing Coverage', value: '100%' },
      { label: 'Time Saved Auditing', value: '80%' }
    ],
    title: 'How NovaBPO scaled QA audit coverage from 2% to 100% using automated AI scoring',
    desc: 'NovaBPO operates multi-site support for global logistics brands. By automating the quality assurance scoring sheet audits, they eliminated reviewer bias and enabled agent coaching loops within minutes of call completion.',
    details: ['100% of incoming calls audited', 'Instant notifications on compliance breaches', 'Scrubbed transcripts stored securely in database'],
    testimonial: {
      quote: "CallPilot has transformed how we audit agent performance. We went from sampling 2% of calls to reviewing 100%.",
      author: 'Sarah Kim',
      role: 'QA Manager, NovaBPO'
    }
  },
  {
    company: 'ClearCall Solutions',
    logo: 'CC',
    logoGlow: 'rgba(6,182,212,0.2)',
    metrics: [
      { label: 'QA Compliance Score', value: '+28%' },
      { label: 'Agent Improvement', value: '2.5x' }
    ],
    title: 'Secret behind ClearCall Solutions elevating compliance and objections metrics',
    desc: 'ClearCall outbound tele-sales teams required strict script disclosure compliance. CallPilot AI coaching cards provided agent dashboard tips pointing to exact timestamps in conversation recordings to refine wording.',
    details: ['Instant dashboard coaching cards', 'Objection handling feedback timelines', 'Empowered self-correction coaching loops'],
    testimonial: {
      quote: "The coaching cards are incredible. Our agents improved compliance scores by 28% in just the first month.",
      author: 'Marcus Torres',
      role: 'Operations Director, ClearCall'
    }
  },
  {
    company: 'Vertex360',
    logo: 'V3',
    logoGlow: 'rgba(168,85,247,0.2)',
    metrics: [
      { label: 'Wrap-Up Time (ACW)', value: '-85%' },
      { label: 'Call Summary Sync', value: 'Instant' }
    ],
    title: 'Reducing after-call work wrap-up times by syncing AI summaries to Salesforce',
    desc: 'Vertex360 handles high-volume customer support calls. Using CallPilot CRM integration, call transcripts are structured into dense CRM contact history logs and follow-up action items with one click.',
    details: ['Structured CRM summary JSON exports', 'Salesforce contact history auto-sync', 'Agents save 1.5 hours per shift'],
    testimonial: {
      quote: "We've reduced call review time by 80%. The CRM sync alone saves our team hours every week.",
      author: 'Priya Nair',
      role: 'Contact Center Lead, Vertex360'
    }
  }
]

export default function CaseStudiesPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudiesStructuredData) }}
      />
      <GoogleNav activePage="case-studies" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Case Studies</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Proven results, <span className="gradient-text-bright">real success</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            See how scaling call centers and BPOs use CallPilot AI to unlock conversation intelligence, increase audit coverage, and coach agents to high performance.
          </p>
        </div>
      </section>

      {/* Case Studies Lists */}
      <section className="py-24 px-6 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          {CASE_STUDIES.map((cs, idx) => (
            <div key={idx} className="glass-card p-8 flex flex-col lg:flex-row gap-8 items-stretch">
              
              {/* Left Info Column */}
              <div className="flex-grow flex flex-col justify-between space-y-6 lg:max-w-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 text-white font-black text-xs bg-slate-900/60"
                      style={{ boxShadow: `0 0 15px ${cs.logoGlow}` }}
                    >
                      {cs.logo}
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{cs.company}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white leading-snug">{cs.title}</h2>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cs.desc}</p>
                  <div className="space-y-2 pt-2">
                    {cs.details.map((detail, didx) => (
                      <div key={didx} className="flex items-center gap-2 text-xs">
                        <Check className="w-4 h-4 shrink-0 text-indigo-400" />
                        <span style={{ color: 'var(--text-secondary)' }}>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 relative">
                  <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>"{cs.testimonial.quote}"</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white">{cs.testimonial.author}</span>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{cs.testimonial.role}</span>
                  </div>
                </div>
              </div>

              {/* Right Metrics Block */}
              <div className="w-full lg:w-72 flex flex-col gap-4 justify-center shrink-0">
                {cs.metrics.map((metric, midx) => (
                  <div key={midx} className="p-6 rounded-xl border border-white/5 bg-slate-950/60 text-center flex flex-col justify-center items-center">
                    <div className="text-3xl font-black text-white mb-1.5">{metric.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{metric.label}</div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-950/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Achieve similar results for your BPO</h2>
          <p className="max-w-md mx-auto mb-8 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Start grading calls, tracking compliance, and coaching agents with AI. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-8 py-3.5 rounded-xl text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
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

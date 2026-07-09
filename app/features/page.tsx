import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, TrendingUp, Sparkles, FileSpreadsheet, Check, ArrowRight, PhoneCall, Zap, Activity } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'CallPilot AI Features | Automated Compliance & QA Auditing',
  description: 'Explore the CallPilot AI platform features: Automated QA checklists, Sentiment & Speech analytics, AI agent coaching cards, and one-click CRM summary sync.',
  openGraph: {
    title: 'CallPilot AI Features | Automated Compliance & QA Auditing',
    description: 'Explore the CallPilot AI platform features: Automated QA checklists, Sentiment & Speech analytics, AI agent coaching cards, and one-click CRM summary sync.',
    url: 'https://callpilot.ai/features',
    type: 'website',
  }
}

const featuresStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'CallPilot AI Features',
  'description': 'Automated QA checklists, Sentiment & Speech analytics, AI agent coaching cards, and one-click CRM summary sync.',
  'url': 'https://callpilot.ai/features',
}

export default function FeaturesPage() {
  const featuresList = [
    {
      title: 'Automated QA Compliance',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      glow: 'rgba(79,70,229,0.2)',
      desc: 'No more manual spot-checking. Audit 100% of outbound or inbound support calls against exact rules automatically. Verify call disclosures, brand compliance, and script guidelines instantly.',
      details: ['Keyword compliance verification', 'Disclosures & terms checks', 'Custom grading rubrics', 'Multi-channel caller splitting'],
    },
    {
      title: 'Sentiment & Speech Analytics',
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      glow: 'rgba(6,182,212,0.2)',
      desc: 'Trace voice dynamics, speaker speed, silences, and interruptions. CallPilot maps customer satisfaction fluctuations and notifies supervisors of customer escalation triggers in real-time.',
      details: ['Interruption count analytics', 'Silence & dead-air logs', 'Frustration pitch analysis', 'Overall sentiment averages'],
    },
    {
      title: 'AI-Generated Coaching Cards',
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      glow: 'rgba(168,85,247,0.2)',
      desc: 'Empower agent learning loops with immediate, constructive AI feedback. Agents receive dynamic dashboard tips detailing exact transcript timings to adjust tone or objections.',
      details: ['Strengths & improvement flags', 'Actionable wording suggestions', 'Context-aware objection support', 'Direct review portal override'],
    },
    {
      title: 'One-Click CRM Structuring',
      icon: <FileSpreadsheet className="w-6 h-6 text-pink-400" />,
      glow: 'rgba(244,63,94,0.2)',
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
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresStructuredData) }}
      />
      <GoogleNav activePage="features" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              background: 'rgba(79,70,229,0.15)',
              borderColor: 'rgba(99,102,241,0.35)',
              color: '#a5b4fc',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Enterprise-Grade AI Call Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Next-gen conversation <span className="gradient-text-bright">intelligence</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Audit 100% of support and sales calls. Automatically extract compliance scorecards, coaching cards, and structured CRM notes — without lifting a finger.
          </p>
          <Link href="/signup"
            className="inline-flex items-center justify-center gap-2 font-semibold text-xs px-8 py-3.5 rounded-xl text-white transition-all group"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
            }}
          >
            Start free trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature details */}
      <section className="py-24 px-6 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          {featuresList.map((feat, idx) => (
            <div key={idx}
              className="glass-card p-8 flex flex-col md:flex-row gap-6 items-start transition-all"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: `0 0 20px ${feat.glow}`,
                }}
              >
                {feat.icon}
              </div>
              <div className="space-y-4 flex-grow">
                <h2 className="text-lg font-bold text-white">{feat.title}</h2>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {feat.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs">
                      <Check className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span style={{ color: 'var(--text-secondary)' }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion (Pure HTML <details> for SEO & performance) */}
      <section className="py-24 px-6 border-t border-white/5" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-12 text-white">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-white/5 rounded-xl bg-slate-900/40 p-5 overflow-hidden transition-all hover:border-indigo-500/30">
                <summary className="flex justify-between items-center font-bold text-sm text-white cursor-pointer select-none">
                  {faq.q}
                  <span className="text-indigo-400 group-open:rotate-180 transition-transform duration-200">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </span>
                </summary>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-950/40">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Automate your call quality processes today</h2>
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

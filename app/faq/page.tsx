import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, HelpCircle, ShieldAlert, Cpu, Settings2, Sparkles, MessageCircle } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'CallPilot AI FAQ | Frequently Asked Questions',
  description: 'Find answers to common questions about CallPilot AI conversation intelligence, automated QA scoring, SOC2 security compliance, CRM integrations, and pricing.',
  openGraph: {
    title: 'CallPilot AI FAQ | Frequently Asked Questions',
    description: 'Find answers to common questions about CallPilot AI conversation intelligence, automated QA scoring, SOC2 security compliance, CRM integrations, and pricing.',
    url: 'https://callpilot.ai/faq',
    type: 'website',
  }
}

const FAQ_SECTIONS = [
  {
    category: 'General & Platform',
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
    items: [
      { q: 'What is CallPilot AI?', a: 'CallPilot is an enterprise conversation intelligence platform that uses artificial intelligence to automatically audit 100% of support and sales calls, score agent compliance rubrics, analyze sentiments, and sync summaries directly to your CRM.' },
      { q: 'How does the automated QA grading work?', a: 'When call audio is uploaded or integrated, our AI processes the speaker-separated audio transcripts against custom compliance checklists. It checks for mandatory terms, script compliance, and disclosures, grading each call in under 60 seconds with 95%+ human alignment.' },
      { q: 'Does CallPilot replace human auditors?', a: 'No. CallPilot is built to elevate QA auditors into strategic coaches. Instead of spending hours manually listening to 1% of call recordings, auditors review automated scorecards, confirm compliance logs, and focus on high-impact agent coaching.' }
    ]
  },
  {
    category: 'Security & Compliance',
    icon: <ShieldAlert className="w-5 h-5 text-cyan-400" />,
    items: [
      { q: 'Is customer call data secure?', a: 'Yes. CallPilot complies with SOC2 Type II standards. All voice recordings and transcripts are encrypted at rest (AES-256) and in transit (TLS 1.3).' },
      { q: 'Do you redact sensitive PCI/PII data?', a: 'Absolutely. CallPilot automatically scrubs credit card numbers, social security numbers, and sensitive personal identifiers from transcripts and audio files before processing them.' },
      { q: 'Where is customer data stored?', a: 'Data is hosted in secure AWS facilities. Enterprise accounts can choose custom regional hosting parameters to satisfy local compliance requirements.' }
    ]
  },
  {
    category: 'Integrations & CRM',
    icon: <Settings2 className="w-5 h-5 text-purple-400" />,
    items: [
      { q: 'Which telephony platforms do you integrate with?', a: 'CallPilot integrates with major VoIP and call center software, including Twilio, Genesys, Zoom, and Zendesk Talk.' },
      { q: 'Can we sync call logs directly to HubSpot or Salesforce?', a: 'Yes. CallPilot features native Salesforce and HubSpot integration. Transcripts, QA scores, and AI summaries are synced to CRM contact accounts with one click.' },
      { q: 'Do you offer an API or webhooks?', a: 'Yes. We provide comprehensive REST APIs and Webhook dispatches for all integration flows on our Professional and Enterprise plans.' }
    ]
  }
]

// Generate FAQPage JSON-LD structured data dynamically
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': FAQ_SECTIONS.flatMap(sec => sec.items).map(item => ({
    '@type': 'Question',
    'name': item.q,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.a
    }
  }))
}

export default function FAQPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <GoogleNav activePage="faq" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">FAQ</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Frequently asked <span className="gradient-text-bright">questions</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Find answers to common questions about our platform features, pricing plans, security posture, and integrations.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-24 px-6 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          {FAQ_SECTIONS.map((sec, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {sec.icon}
                </span>
                {sec.category}
              </h2>

              <div className="space-y-4">
                {sec.items.map((item, itemIdx) => (
                  <details key={itemIdx} className="group border border-white/5 rounded-xl bg-slate-900/40 p-5 overflow-hidden transition-all hover:border-indigo-500/30">
                    <summary className="flex justify-between items-center font-bold text-xs md:text-sm text-white cursor-pointer select-none">
                      {item.q}
                      <span className="text-indigo-400 group-open:rotate-180 transition-transform duration-200">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </span>
                    </summary>
                    <p className="text-[11px] md:text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 border-t border-white/5 bg-slate-950/40">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Have more questions?</h2>
          <p className="max-w-md mx-auto mb-8 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Can't find the answer you are looking for? Reach out to our support team and we will get back to you shortly.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-8 py-3.5 rounded-xl text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
          >
            Contact support
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

'use client'

import Link from 'next/link'
import { ShieldCheck, TrendingUp, Sparkles, FileSpreadsheet, Check, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export default function FeaturesPage() {
  const featuresList = [
    {
      title: 'Automated QA Checklists',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50',
      desc: 'No more manual spot-checking. Audit 100% of outbound or inbound support calls against exact rules automatically. Verify call disclosures, brand compliance, and script guidelines instantly.',
      details: ['Keyword compliance verification', 'Disclosures & terms checks', 'Custom grading rubrics', 'Multi-channel caller splitting'],
    },
    {
      title: 'Sentiment & Speech Analytics',
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50',
      desc: 'Trace voice dynamics, speaker speed, silences, and interruptions. CallPilot maps customer satisfaction fluctuations and notifies supervisors of customer escalation triggers in real-time.',
      details: ['Interruption count analytics', 'Silence & dead-air logs', 'Frustration pitch analysis', 'Overall sentiment averages'],
    },
    {
      title: 'AI-Generated Coaching Cards',
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50',
      desc: 'Empower agent learning loops with immediate, constructive AI feedback. Agents receive dynamic dashboard tips detailing exact transcript timings to adjust tone or objections.',
      details: ['Strengths & improvement flags', 'Actionable wording suggestions', 'Context-aware objection support', 'Direct review portal override'],
    },
    {
      title: 'One-Click CRM Structuring',
      icon: <FileSpreadsheet className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50',
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav activePage="features" />

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Product Features</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">
            Next-gen conversation intelligence
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Audit 100% of support and sales calls. Automatically extract compliance scorecards, coaching cards, and structured CRM notes — without lifting a finger.
          </p>
          <Link href="/signup"
            className="inline-flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold px-7 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature details */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          {featuresList.map((feat, idx) => (
            <div key={idx}
              className="p-8 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row gap-7 items-start hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div className={`w-14 h-14 rounded-lg shrink-0 flex items-center justify-center ${feat.color}`}>
                {feat.icon}
              </div>
              <div className="space-y-4 flex-grow">
                <h2 className="text-xl font-bold text-slate-900">{feat.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600">{feat.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {feat.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 shrink-0 text-indigo-600" />
                      <span className="text-slate-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-900">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-base font-bold mb-2 text-slate-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14 bg-indigo-600 shadow-lg shadow-indigo-600/10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Automate your call quality processes today</h2>
          <p className="text-indigo-100 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Start grading calls, tracking compliance, and coaching agents with AI. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
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

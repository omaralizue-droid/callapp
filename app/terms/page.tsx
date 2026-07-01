'use client'

import Link from 'next/link'
import GoogleNav from '@/components/landing/GoogleNav'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using CallPilot AI ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the Service.',
  },
  {
    title: '2. Use of the Service',
    content: 'You may use CallPilot only for lawful business purposes. You are responsible for ensuring that all call recordings you upload comply with wiretapping, recording consent, and privacy laws in your jurisdiction. In many jurisdictions, you must obtain consent from all parties before recording a phone call.',
  },
  {
    title: '3. Account Responsibilities',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You are responsible for all activities that occur under your account.',
  },
  {
    title: '4. Subscription and Billing',
    content: 'Subscriptions are billed monthly or annually in advance. All fees are non-refundable except as required by law or as specified in our refund policy. We reserve the right to modify pricing with 30 days written notice.',
  },
  {
    title: '5. Intellectual Property',
    content: 'CallPilot retains all intellectual property rights to the platform, including AI models, software, and documentation. You retain ownership of all call recordings and data you upload. You grant us a limited license to process your data solely to provide the Service.',
  },
  {
    title: '6. Limitation of Liability',
    content: 'To the maximum extent permitted by law, CallPilot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the fees paid in the 3 months preceding the claim.',
  },
  {
    title: '7. Termination',
    content: 'Either party may terminate these Terms at any time. Upon termination, your right to use the Service immediately ceases. We will retain your data for 30 days following termination before permanent deletion, unless required by law to retain it longer.',
  },
  {
    title: '8. Governing Law',
    content: 'These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of San Francisco County, California.',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav />

      <section className="py-16 px-6 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Legal</p>
          <h1 className="text-4xl font-extrabold mb-3 text-slate-900">Terms of Service</h1>
          <p className="text-xs text-slate-500">Last updated: January 1, 2025</p>
        </div>
      </section>

      <main className="py-16 px-6 flex-grow bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-7 rounded-xl border border-slate-200 bg-white">
            <p className="text-sm leading-relaxed text-slate-600">
              Please read these Terms of Service carefully before using CallPilot AI. These terms constitute a legally binding agreement between you and CallPilot AI Inc. governing your access to and use of the CallPilot platform and services.
            </p>
          </div>

          {SECTIONS.map((section, idx) => (
            <div key={idx} className="p-7 rounded-xl border border-slate-200 bg-white">
              <h2 className="text-base font-bold mb-3 text-slate-900">{section.title}</h2>
              <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
            </div>
          ))}

          <div className="p-7 rounded-xl border border-slate-200 bg-white">
            <h2 className="text-base font-bold mb-3 text-slate-900">9. Contact Us</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Questions about these Terms? Contact us at:{' '}
              <a href="mailto:legal@callpilot.ai" className="font-semibold text-indigo-600 hover:underline">
                legal@callpilot.ai
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/50">
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="text-indigo-600 font-medium">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

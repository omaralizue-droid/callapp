'use client'

import Link from 'next/link'
import GoogleNav from '@/components/landing/GoogleNav'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly to us, including your name, email address, company name, and payment information when you register for an account. We also collect call recordings and transcripts you upload for processing, and usage data such as pages visited, features used, and browser type.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to provide, maintain, and improve CallPilot services. This includes processing call recordings to generate compliance scores, coaching cards, and CRM summaries. We may also use your information to send product updates and security notices, and to comply with legal obligations.',
  },
  {
    title: '3. Data Storage and Security',
    content: 'All call recordings and transcripts are encrypted at rest using AES-256. We are SOC2 Type II certified. Credit card numbers and PII detected in call audio are automatically scrubbed before storage. Data is stored on servers located in the United States.',
  },
  {
    title: '4. Data Sharing',
    content: 'We do not share your call data. We may share data with third-party service providers who help us operate our platform (e.g., cloud infrastructure, payment processors). All third parties are bound by data processing agreements.',
  },
  {
    title: '5. Your Rights',
    content: 'You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at privacy@callpilot.ai. We will respond to all requests within 30 days.',
  },
  {
    title: '6. Cookies',
    content: 'We use essential cookies to operate our platform and analytics cookies to understand how users interact with our product. You can disable analytics cookies in your browser settings without affecting platform functionality.',
  },
  {
    title: '7. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-product notification at least 30 days before they take effect.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav />

      <section className="py-16 px-6 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Legal</p>
          <h1 className="text-4xl font-extrabold mb-3 text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: January 1, 2025</p>
        </div>
      </section>

      <main className="py-16 px-6 flex-grow bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Introduction card */}
          <div className="p-7 rounded-xl border border-slate-200 bg-white">
            <p className="text-sm leading-relaxed text-slate-600">
              CallPilot AI Inc. ("CallPilot," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our AI call analytics platform. By using CallPilot, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Policy cards */}
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="p-7 rounded-xl border border-slate-200 bg-white">
              <h2 className="text-base font-bold mb-3 text-slate-900">{section.title}</h2>
              <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
            </div>
          ))}

          {/* Contact */}
          <div className="p-7 rounded-xl border border-slate-200 bg-white">
            <h2 className="text-base font-bold mb-3 text-slate-900">8. Contact Us</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              If you have questions about this Privacy Policy, contact us at:{' '}
              <a href="mailto:privacy@callpilot.ai" className="font-semibold text-indigo-600 hover:underline">
                privacy@callpilot.ai
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/50">
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-indigo-600 font-medium">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

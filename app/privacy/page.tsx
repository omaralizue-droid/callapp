import type { Metadata } from 'next'
import Link from 'next/link'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'Privacy Policy | CallPilot AI',
  description: 'Read the CallPilot AI Privacy Policy to learn how we encrypt, store, scrub, and secure your call audio recordings and customer conversation transcripts.',
  openGraph: {
    title: 'Privacy Policy | CallPilot AI',
    description: 'Read the CallPilot AI Privacy Policy to learn how we encrypt, store, scrub, and secure your call audio recordings and customer conversation transcripts.',
    url: 'https://callpilot.ai/privacy',
    type: 'website',
  }
}

const privacyStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'CallPilot AI Privacy Policy',
  'url': 'https://callpilot.ai/privacy',
}

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
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyStructuredData) }}
      />
      <GoogleNav />

      {/* Hero */}
      <section className="relative py-20 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Legal</p>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Last updated: January 1, 2025</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-6 flex-grow" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          
          {/* Introduction card */}
          <div className="glass-card p-6 border border-white/5">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              CallPilot AI Inc. ("CallPilot," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our AI call analytics platform. By using CallPilot, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Policy sections */}
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="glass-card p-6 border border-white/5">
              <h2 className="text-sm font-bold mb-3 text-white">{section.title}</h2>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{section.content}</p>
            </div>
          ))}

          {/* Contact */}
          <div className="glass-card p-6 border border-white/5">
            <h2 className="text-sm font-bold mb-3 text-white">8. Contact Us</h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              If you have questions about this Privacy Policy, contact us at:{' '}
              <a href="mailto:privacy@callpilot.ai" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                privacy@callpilot.ai
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-slate-950/80" style={{ color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

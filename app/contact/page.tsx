import type { Metadata } from 'next'
import Link from 'next/link'
import GoogleNav from '@/components/landing/GoogleNav'
import ContactFormClient from '@/components/landing/ContactFormClient'

export const metadata: Metadata = {
  title: 'Contact CallPilot AI | Sales & Support Inquiries',
  description: 'Get in touch with the CallPilot AI team. Contact our sales department for enterprise pricing or reach customer support for platform help.',
  openGraph: {
    title: 'Contact CallPilot AI | Sales & Support Inquiries',
    description: 'Get in touch with the CallPilot AI team. Contact our sales department for enterprise pricing or reach customer support for platform help.',
    url: 'https://callpilot.ai/contact',
    type: 'website',
  }
}

const contactStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  'name': 'Contact CallPilot AI',
  'description': 'Contact information for CallPilot AI sales and customer support.',
  'url': 'https://callpilot.ai/contact',
  'mainEntity': {
    '@type': 'ContactPoint',
    'telephone': '+1-888-555-0142',
    'contactType': 'sales',
    'email': 'hello@callpilot.ai',
    'areaServed': 'US',
    'availableLanguage': 'English'
  }
}

export default function ContactPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactStructuredData) }}
      />
      <GoogleNav activePage="contact" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Contact us</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Get in <span className="gradient-text-bright">touch</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Have a question about CallPilot? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <ContactFormClient />
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

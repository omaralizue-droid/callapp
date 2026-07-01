'use client'

import { useState, useEffect } from 'react'
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
    content: 'We do not sell your data. We may share data with third-party service providers who help us operate our platform (e.g., cloud infrastructure, payment processors). All third parties are bound by contractual data processing agreements.',
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
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const isDark  = theme === 'dark'
  const bg      = isDark ? 'bg-[#1e1e1e]' : 'bg-white'
  const fg      = isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
  const muted   = isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
  const border  = isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'
  const cardBg  = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'
  const surface = isDark ? 'bg-[#252525]' : 'bg-[#f8f9fa]'
  const primary = isDark ? '#8ab4f8' : '#1a73e8'

  return (
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <GoogleNav theme={theme} toggleTheme={toggleTheme} />

      <section className={`py-16 px-6 ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Legal</p>
          <h1 className={`text-4xl font-bold mb-3 ${fg}`}>Privacy Policy</h1>
          <p className={`text-sm ${muted}`}>Last updated: January 1, 2025</p>
        </div>
      </section>

      <main className="py-16 px-6 flex-grow">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Intro */}
          <div className={`p-7 rounded-2xl border ${cardBg}`}>
            <p className={`text-sm leading-relaxed ${muted}`}>
              CallPilot AI Inc. ("CallPilot," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our AI call analytics platform. By using CallPilot, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((section, idx) => (
            <div key={idx} className={`p-7 rounded-2xl border ${cardBg}`}>
              <h2 className={`text-base font-semibold mb-3 ${fg}`}>{section.title}</h2>
              <p className={`text-sm leading-relaxed ${muted}`}>{section.content}</p>
            </div>
          ))}

          {/* Contact */}
          <div className={`p-7 rounded-2xl border ${cardBg}`}>
            <h2 className={`text-base font-semibold mb-3 ${fg}`}>8. Contact Us</h2>
            <p className={`text-sm leading-relaxed ${muted}`}>
              If you have questions about this Privacy Policy, contact us at:{' '}
              <a href="mailto:privacy@callpilot.ai" style={{ color: primary }} className="font-medium">
                privacy@callpilot.ai
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className={`border-t py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${muted} ${border}`}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" style={{ color: primary }}>Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

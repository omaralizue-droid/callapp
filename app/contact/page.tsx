'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export default function ContactPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })

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
  const inputBg = isDark ? 'bg-[#3c4043] border-[#5f6368] text-[#e8eaed]' : 'bg-white border-[#dadce0] text-[#202124]'
  const primary = isDark ? '#8ab4f8' : '#1a73e8'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <GoogleNav theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <section className={`py-20 px-6 text-center ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Contact us</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${fg}`}>Get in touch</h1>
          <p className={`text-lg ${muted}`}>Have a question about CallPilot? We'd love to hear from you.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${fg}`}>Contact information</h2>
              <p className={`text-sm leading-relaxed ${muted}`}>
                Our team typically responds within 1 business day. For urgent enterprise inquiries, use the phone number below.
              </p>
            </div>

            {[
              { icon: <Mail className="w-5 h-5" />, color: '#1a73e8', label: 'Email', value: 'hello@callpilot.ai' },
              { icon: <Phone className="w-5 h-5" />, color: '#34a853', label: 'Phone', value: '+1 (888) 555-0142' },
              { icon: <MapPin className="w-5 h-5" />, color: '#ea4335', label: 'Address', value: '340 Pine St, Suite 800, San Francisco, CA 94104' },
            ].map((item, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 ${cardBg}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.color + '18', color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${muted}`}>{item.label}</div>
                  <div className={`text-sm font-medium ${fg}`}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className={`p-8 rounded-2xl border ${cardBg}`}>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: '#e6f4ea', color: '#34a853' }}>
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${fg}`}>Message sent!</h3>
                <p className={`text-sm ${muted}`}>Thanks for reaching out. We'll be in touch within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className={`text-lg font-semibold mb-5 ${fg}`}>Send us a message</h2>
                {[
                  { field: 'name',    label: 'Full name',      type: 'text',  placeholder: 'Your name' },
                  { field: 'email',   label: 'Work email',     type: 'email', placeholder: 'you@company.com' },
                  { field: 'company', label: 'Company',        type: 'text',  placeholder: 'Company name' },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all ${inputBg}`}
                      style={{ focusRingColor: primary } as React.CSSProperties}
                    />
                  </div>
                ))}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all resize-none ${inputBg}`}
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all hover:shadow-lg"
                  style={{ background: primary }}
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className={`border-t py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${muted} ${border}`}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav />

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Contact us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">Get in touch</h1>
          <p className="text-lg text-slate-600">Have a question about CallPilot? We'd love to hear from you.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Contact details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact information</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Our team typically responds within 1 business day. For urgent enterprise inquiries, use the phone number below.
              </p>
            </div>

            {[
              { icon: <Mail className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600', label: 'Email', value: 'hello@callpilot.ai' },
              { icon: <Phone className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600', label: 'Phone', value: '+1 (888) 555-0142' },
              { icon: <MapPin className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600', label: 'Address', value: '340 Pine St, Suite 800, San Francisco, CA 94104' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-white flex items-start gap-4 hover:border-slate-300 transition-all hover:shadow-sm">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="p-8 rounded-xl border border-slate-200 bg-white">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-emerald-50 text-emerald-600">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Message sent!</h3>
                <p className="text-sm text-slate-500">Thanks for reaching out. We'll be in touch within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Send us a message</h2>
                {[
                  { field: 'name',    label: 'Full name',      type: 'text',  placeholder: 'Your name' },
                  { field: 'email',   label: 'Work email',     type: 'email', placeholder: 'you@company.com' },
                  { field: 'company', label: 'Company',        type: 'text',  placeholder: 'Company name' },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 text-slate-800 transition-all placeholder:text-slate-400"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className="Saas-input w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 text-slate-800 transition-all resize-none placeholder:text-slate-400"
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

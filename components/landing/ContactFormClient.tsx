'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Check, ArrowRight, Loader2 } from 'lucide-react'

export default function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Contact details */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Contact information</h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Our team typically responds within 1 business day. For urgent enterprise inquiries, use the phone number below.
          </p>
        </div>

        {[
          { icon: <Mail className="w-5 h-5 text-indigo-400" />, glow: 'rgba(79,70,229,0.15)', label: 'Email', value: 'hello@callpilot.ai' },
          { icon: <Phone className="w-5 h-5 text-cyan-400" />, glow: 'rgba(6,182,212,0.15)', label: 'Phone', value: '+1 (888) 555-0142' },
          { icon: <MapPin className="w-5 h-5 text-purple-400" />, glow: 'rgba(168,85,247,0.15)', label: 'Address', value: '340 Pine St, Suite 800, San Francisco, CA 94104' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-5 flex items-start gap-4 hover:scale-[1.01] transition-all">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
              style={{
                background: 'rgba(255,255,255,0.04)',
                boxShadow: `0 0 15px ${item.glow}`,
              }}
            >
              {item.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              <div className="text-xs font-semibold text-white">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="glass-card p-8 relative overflow-hidden">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Message sent!</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Thanks for reaching out. We'll be in touch within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-base font-bold text-white mb-5">Send us a message</h2>
            {[
              { field: 'name',    label: 'Full name',      type: 'text',  placeholder: 'Your name' },
              { field: 'email',   label: 'Work email',     type: 'email', placeholder: 'you@company.com' },
              { field: 'company', label: 'Company',        type: 'text',  placeholder: 'Company name' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field} className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Message</label>
              <textarea
                required
                rows={4}
                placeholder="How can we help you?"
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-lg transition-opacity cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
              }}
            >
              {loading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
              ) : (
                <><ArrowRight className="w-3.5 h-3.5" /> Send Message</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

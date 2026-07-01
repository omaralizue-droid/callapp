'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Sun, Moon, Check, Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const bgClass = theme === 'dark' ? 'bg-[#060813] text-slate-100' : 'bg-slate-50 text-slate-800'
  const headerClass = theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200/60 shadow-sm'
  const textTitleClass = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const textDescClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const textMutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const sectionBorderClass = theme === 'dark' ? 'border-white/5' : 'border-slate-200/60'
  const cardBgClass = theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/60 shadow-lg'

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setSubmitted(true)
  }

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors duration-300 relative`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 glass border-b ${headerClass} py-4 px-6 md:px-12 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${textTitleClass}`}>
              CallPilot<span className="text-cyan-500">.AI</span>
            </span>
          </Link>
        </div>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${textDescClass}`}>
          <Link href="/features" className="hover:text-cyan-500 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-cyan-500 transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-cyan-500 transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/10 hover:bg-white/5 text-cyan-400' 
                : 'border-slate-200 hover:bg-slate-100 text-cyan-600'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className={`text-sm font-medium hover:text-cyan-500 transition-colors ${textDescClass}`}>
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow z-10 relative py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Form */}
        <div className={`p-8 rounded-xl border ${cardBgClass} space-y-6`}>
          <div className="space-y-2">
            <h1 className={`text-3xl font-black ${textTitleClass}`}>Get in Touch</h1>
            <p className={`${textMutedClass} text-xs`}>Reach our outbound BPO solutions team or submit a customer support ticket.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className={`text-lg font-bold ${textTitleClass}`}>Message Received!</h3>
              <p className={`${textDescClass} text-xs`}>Thank you for contacting CallPilot. Our integration managers will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className={`font-semibold ${textDescClass}`} htmlFor="name">Your Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className={`w-full border rounded-lg px-3.5 py-2.5 outline-none focus:border-cyan-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`font-semibold ${textDescClass}`} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@bpo.com"
                  className={`w-full border rounded-lg px-3.5 py-2.5 outline-none focus:border-cyan-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`font-semibold ${textDescClass}`} htmlFor="msg">Message / Inquiry</label>
                <textarea
                  id="msg"
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="How can we help your team automate call scoring?"
                  className={`w-full border rounded-lg px-3.5 py-2.5 outline-none focus:border-cyan-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg text-xs"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Info */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className={`text-2xl font-bold ${textTitleClass}`}>Our Office Location</h2>
            <p className={`${textDescClass} text-sm leading-relaxed`}>
              CallPilot is located in Silicon Valley, helping global customer service centers and BPOs optimize training loops with conversational data insights.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200'
              }`}>
                <Mail className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <span className={`block text-xs font-bold ${textTitleClass}`}>Email Support</span>
                <span className={`${textMutedClass} text-xs`}>support@callpilot.ai</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200'
              }`}>
                <Phone className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <span className={`block text-xs font-bold ${textTitleClass}`}>Outbound Sales</span>
                <span className={`${textMutedClass} text-xs`}>+1 (555) 723-2891</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200'
              }`}>
                <MapPin className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <span className={`block text-xs font-bold ${textTitleClass}`}>Headquarters</span>
                <span className={`${textMutedClass} text-xs`}>428 University Ave, Palo Alto, CA 94301</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t ${sectionBorderClass} py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${textMutedClass}`}>
        <p>&copy; {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-cyan-500">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-cyan-500">Terms of Service</Link>
        </div>
      </footer>

    </div>
  )
}

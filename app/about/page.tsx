'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Sun, Moon, Check } from 'lucide-react'

export default function AboutPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

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
      <main className="flex-grow z-10 relative py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase mb-3 block">Our Vision</span>
          <h1 className={`text-4xl md:text-5xl font-black ${textTitleClass} mb-4`}>
            About CallPilot AI
          </h1>
          <p className={`${textDescClass} text-lg max-w-2xl mx-auto`}>
            Bridging the gap between conversation data and automated quality assurance metrics for BPO and call centers.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className={`text-2xl font-bold ${textTitleClass}`}>Transforming Call Center Audits</h2>
          <p className={`${textDescClass} leading-relaxed text-sm`}>
            At CallPilot, we believe manual call audits are outdated. Auditing just 1% of recordings leaves call centers blind to compliance vulnerabilities and limits constructive feedback for agents. By building enterprise-grade multi-modal audio evaluation models, we enable operations to grade 100% of calls instantly.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className={`text-2xl font-bold ${textTitleClass}`}>Our Commitment to Security</h2>
          <p className={`${textDescClass} leading-relaxed text-sm`}>
            As caretakers of your customer conversation data, call privacy is our top focus. CallPilot redact sensitive PII (credit cards, names, security PINs) automatically at the stream level and processes all transcript scoring using SOC2 compliant pipelines.
          </p>
        </section>

        <section className={`p-8 rounded-xl border ${
          theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/60 shadow-lg'
        } space-y-4`}>
          <h3 className={`text-lg font-bold ${textTitleClass}`}>Leadership & Values</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Honest, non-subjective agent evaluations',
              'Consistent compliance risk tracking',
              'Transparent scoring criteria',
              'Collaborative feedback channels'
            ].map((val, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs">
                <Check className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className={textDescClass}>{val}</span>
              </li>
            ))}
          </ul>
        </section>
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

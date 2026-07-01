'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Sun, Moon } from 'lucide-react'

export default function DocsPage() {
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

  const docChapters = [
    {
      title: '1. Getting Started',
      items: [
        { name: 'Introduction to CallPilot AI', desc: 'Overview of automated QA compliance, speech sentiment tracking, and LLM-powered grading.' },
        { name: 'Workspace Configuration', desc: 'How to setup organizations, create teams, invite agents, and assign reviewer permissions.' }
      ]
    },
    {
      title: '2. Telephony & API Integrations',
      items: [
        { name: 'Webhook Triggers Setup', desc: 'Configuring SIP recording streams to automatically pass call recordings via HTTP webhooks.' },
        { name: 'Salesforce & HubSpot Mapping', desc: 'Mapping generated CRM summaries, complaints, resolutions, and follow-up data to standard deal fields.' }
      ]
    },
    {
      title: '3. QA Rubrics & Checklists',
      items: [
        { name: 'Designing Scorecard Rules', desc: 'Creating custom criteria for branded greetings, mandatory disclosures, and agent empathy checks.' }
      ]
    }
  ]

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
            className="bg-gradient-to-tr from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.03]"
          >
            Connect Node
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow z-10 relative py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase mb-3 block">Developer Portal</span>
          <h1 className={`text-4xl md:text-5xl font-black ${textTitleClass} mb-4`}>
            Documentation & Guides
          </h1>
          <p className={`${textDescClass} text-lg max-w-2xl mx-auto`}>
            Quickstarts, code setups, sitemaps, and custom compliance API references to deploy automated call grading.
          </p>
        </div>

        {/* Documentation catalog lists */}
        <div className="space-y-12">
          {docChapters.map((chapter, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className={`text-xl font-bold ${textTitleClass} border-b ${sectionBorderClass} pb-2`}>
                {chapter.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {chapter.items.map((item, iIdx) => (
                  <div 
                    key={iIdx} 
                    className={`p-6 rounded-xl border ${
                      theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/60 shadow-md'
                    } space-y-2`}
                  >
                    <h3 className={`text-sm font-bold ${textTitleClass}`}>{item.name}</h3>
                    <p className={`${textMutedClass} text-[11px] leading-relaxed`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

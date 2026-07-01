'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Globe, Award, Zap } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

const TEAM = [
  { name: 'Amir Siddiqui', role: 'CEO & Co-founder', avatar: 'AS', color: '#1a73e8' },
  { name: 'Priya Mehta',   role: 'CTO & Co-founder', avatar: 'PM', color: '#34a853' },
  { name: 'James Okafor',  role: 'VP of Product',    avatar: 'JO', color: '#ea4335' },
  { name: 'Lucy Chen',     role: 'Head of AI',        avatar: 'LC', color: '#f9ab00' },
]

const VALUES = [
  { icon: <Users className="w-6 h-6" />, color: 'g-icon-blue',   title: 'Customer first', desc: "Every product decision starts with a real QA problem. We ship features because they make our customers' work measurably better." },
  { icon: <Globe className="w-6 h-6" />, color: 'g-icon-green',  title: 'Transparency',   desc: 'Our pricing is public. Our uptime data is public. We believe trust is built through radical transparency, not marketing.' },
  { icon: <Award className="w-6 h-6" />, color: 'g-icon-yellow', title: 'Quality',         desc: "We hold our AI to human auditor standards — 95%+ accuracy. We'd rather be accurate than fast." },
  { icon: <Zap className="w-6 h-6" />,   color: 'g-icon-red',    title: 'Speed',           desc: 'Results in seconds, not hours. We know that fast feedback loops are what actually drive agent improvement.' },
]

export default function AboutPage() {
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
      <GoogleNav activePage="about" theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <section className={`py-20 px-6 text-center ${surface}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>About CallPilot</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${fg}`}>
            Built for the people who make call centers work
          </h1>
          <p className={`text-lg leading-relaxed ${muted}`}>
            We started CallPilot because we worked in BPO operations and watched QA teams struggle to review more than 2% of calls manually. We knew AI could do better — faster, more consistently, at 100% coverage.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`p-10 rounded-2xl border ${cardBg}`}>
            <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Our mission</p>
            <h2 className={`text-2xl md:text-3xl font-bold mb-5 ${fg}`}>
              Make every customer conversation count
            </h2>
            <p className={`leading-relaxed ${muted}`}>
              Millions of customer calls happen every day in contact centers around the world. Most of that intelligence — compliance failures, coaching moments, customer frustrations — gets lost. CallPilot exists to capture that intelligence automatically, at scale, and turn it into actions that make agents better and customers happier.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`py-20 px-6 ${surface}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Our values</p>
            <h2 className={`text-3xl font-bold ${fg}`}>What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((val, idx) => (
              <div key={idx} className={`p-7 rounded-2xl border flex gap-5 items-start hover:shadow-md transition-all ${cardBg}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${val.color}`}>
                  {val.icon}
                </div>
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${fg}`}>{val.title}</h3>
                  <p className={`text-sm leading-relaxed ${muted}`}>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Our team</p>
            <h2 className={`text-3xl font-bold ${fg}`}>The people behind CallPilot</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border text-center hover:shadow-md transition-all ${cardBg}`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold"
                  style={{ background: member.color }}>
                  {member.avatar}
                </div>
                <h3 className={`text-sm font-semibold ${fg}`}>{member.name}</h3>
                <p className={`text-xs mt-1 ${muted}`}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14"
          style={{ background: isDark ? 'linear-gradient(135deg, #1a3a5c, #1e2d1e)' : 'linear-gradient(135deg, #1a73e8, #0d652d)' }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join us?</h2>
          <p className="text-white/80 max-w-md mx-auto mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-8 py-3.5 rounded-full hover:shadow-lg transition-all"
            style={{ color: '#1a73e8' }}
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
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

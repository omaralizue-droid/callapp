import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, Globe, Award, Zap } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

export const metadata: Metadata = {
  title: 'About CallPilot AI | The Conversation Intelligence Platform',
  description: 'Learn about the CallPilot AI mission, our values, and the team building modern conversation intelligence for call centers and BPOs.',
  openGraph: {
    title: 'About CallPilot AI | The Conversation Intelligence Platform',
    description: 'Learn about the CallPilot AI mission, our values, and the team building modern conversation intelligence for call centers and BPOs.',
    url: 'https://callpilot.ai/about',
    type: 'website',
  }
}

const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  'name': 'About CallPilot AI',
  'description': 'Our mission is to help teams evaluate 100% of calls automatically using speech analytics and conversation intelligence.',
  'url': 'https://callpilot.ai/about',
}

const TEAM = [
  { name: 'Amir Siddiqui', role: 'CEO & Co-founder', avatar: 'AS' },
  { name: 'Priya Mehta',   role: 'CTO & Co-founder', avatar: 'PM' },
  { name: 'James Okafor',  role: 'VP of Product',    avatar: 'JO' },
  { name: 'Lucy Chen',     role: 'Head of AI',        avatar: 'LC' },
]

const VALUES = [
  { icon: <Users className="w-6 h-6 text-indigo-400" />, glow: 'rgba(79,70,229,0.15)', title: 'Customer first', desc: "Every product decision starts with a real QA problem. We ship features because they make our customers' work measurably better." },
  { icon: <Globe className="w-6 h-6 text-cyan-400" />, glow: 'rgba(6,182,212,0.15)',  title: 'Transparency',   desc: 'Our pricing is public. Our uptime data is public. We believe trust is built through radical transparency, not marketing.' },
  { icon: <Award className="w-6 h-6 text-purple-400" />, glow: 'rgba(168,85,247,0.15)', title: 'Quality',         desc: "We hold our AI to human auditor standards — 95%+ accuracy. We'd rather be accurate than fast." },
  { icon: <Zap className="w-6 h-6 text-rose-400" />,   glow: 'rgba(244,63,94,0.15)',    title: 'Speed',           desc: 'Results in seconds, not hours. We know that fast feedback loops are what actually drive agent improvement.' },
]

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
      />
      <GoogleNav activePage="about" />

      {/* Hero */}
      <section className="relative py-28 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">About CallPilot</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Built for the people who <span className="gradient-text-bright">make call centers work</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We started CallPilot because we worked in BPO operations and watched QA teams struggle to review more than 2% of calls manually. We knew AI could do better — faster, more consistently, at 100% coverage.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 relative bg-slate-950/20">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
            <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-2">Our mission</p>
            <h2 className="text-xl md:text-3xl font-black mb-5 text-white">
              Make every customer conversation count
            </h2>
            <p className="leading-relaxed text-xs" style={{ color: 'var(--text-secondary)' }}>
              Millions of customer calls happen every day in contact centers around the world. Most of that intelligence — compliance failures, coaching moments, customer frustrations — gets lost. CallPilot exists to capture that intelligence automatically, at scale, and turn it into actions that make agents better and customers happier.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 border-t border-b border-white/5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Our values</p>
            <h2 className="text-2xl md:text-4xl font-black text-white">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((val, idx) => (
              <div key={idx} className="glass-card p-7 flex gap-5 items-start hover:scale-[1.01] transition-all">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    boxShadow: `0 0 20px ${val.glow}`,
                  }}
                >
                  {val.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-slate-950/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Our team</p>
            <h2 className="text-2xl md:text-4xl font-black text-white">The people behind CallPilot</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, idx) => (
              <div key={idx} className="glass-card p-6 text-center hover:scale-[1.02] transition-all">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-sm font-bold shrink-0 border border-white/15"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 0 15px rgba(79,70,229,0.4)',
                  }}
                >
                  {member.avatar}
                </div>
                <h3 className="text-xs font-bold text-white">{member.name}</h3>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-950/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-12 border border-white/5 bg-slate-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Start auditing your calls with AI</h2>
          <p className="max-w-md mx-auto mb-8 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Join call centers that use CallPilot to evaluate agent compliance and sentiment at scale.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-8 py-3.5 rounded-xl text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
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

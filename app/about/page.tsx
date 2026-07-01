'use client'

import Link from 'next/link'
import { ArrowRight, Users, Globe, Award, Zap } from 'lucide-react'
import GoogleNav from '@/components/landing/GoogleNav'

const TEAM = [
  { name: 'Amir Siddiqui', role: 'CEO & Co-founder', avatar: 'AS' },
  { name: 'Priya Mehta',   role: 'CTO & Co-founder', avatar: 'PM' },
  { name: 'James Okafor',  role: 'VP of Product',    avatar: 'JO' },
  { name: 'Lucy Chen',     role: 'Head of AI',        avatar: 'LC' },
]

const VALUES = [
  { icon: <Users className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50',   title: 'Customer first', desc: "Every product decision starts with a real QA problem. We ship features because they make our customers' work measurably better." },
  { icon: <Globe className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50',  title: 'Transparency',   desc: 'Our pricing is public. Our uptime data is public. We believe trust is built through radical transparency, not marketing.' },
  { icon: <Award className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50', title: 'Quality',         desc: "We hold our AI to human auditor standards — 95%+ accuracy. We'd rather be accurate than fast." },
  { icon: <Zap className="w-6 h-6 text-indigo-600" />,   color: 'bg-indigo-50',    title: 'Speed',           desc: 'Results in seconds, not hours. We know that fast feedback loops are what actually drive agent improvement.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav activePage="about" />

      {/* Hero */}
      <section className="py-20 px-6 text-center bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">About CallPilot</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
            Built for the people who make call centers work
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We started CallPilot because we worked in BPO operations and watched QA teams struggle to review more than 2% of calls manually. We knew AI could do better — faster, more consistently, at 100% coverage.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 rounded-xl border border-slate-200 bg-white">
            <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Our mission</p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-5 text-slate-900">
              Make every customer conversation count
            </h2>
            <p className="leading-relaxed text-slate-600 text-sm">
              Millions of customer calls happen every day in contact centers around the world. Most of that intelligence — compliance failures, coaching moments, customer frustrations — gets lost. CallPilot exists to capture that intelligence automatically, at scale, and turn it into actions that make agents better and customers happier.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-slate-50/50 border-t border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Our values</p>
            <h2 className="text-3xl font-extrabold text-slate-900">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((val, idx) => (
              <div key={idx} className="p-7 rounded-xl border border-slate-200 bg-white flex gap-5 items-start hover:border-slate-300 transition-all hover:shadow-sm">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${val.color}`}>
                  {val.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Our team</p>
            <h2 className="text-3xl font-extrabold text-slate-900">The people behind CallPilot</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-white text-center hover:border-slate-300 transition-all hover:shadow-sm">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-base font-bold bg-indigo-600 shrink-0">
                  {member.avatar}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs mt-1 text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-14 bg-indigo-600 shadow-lg shadow-indigo-600/10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to join us?</h2>
          <p className="text-indigo-100 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Start your free trial today. No credit card required.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
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

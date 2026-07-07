'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Menu, X } from 'lucide-react'

interface GoogleNavProps {
  activePage?: string
  theme?: 'dark' | 'light'
  toggleTheme?: () => void
}

export default function GoogleNav({ activePage }: GoogleNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '/features', label: 'Features', key: 'features' },
    { href: '/pricing',  label: 'Pricing',  key: 'pricing'  },
    { href: '/blog',     label: 'Blog',     key: 'blog'     },
    { href: '/about',    label: 'About',    key: 'about'    },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-nav shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 0 20px rgba(79,70,229,0.5)',
              }}
            >
              <Cpu className="w-4.5 h-4.5 text-white" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CallPilot<span className="gradient-text">.AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  activePage === link.key
                    ? 'text-indigo-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
                {activePage === link.key && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-indigo-400" />
                )}
                <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="relative inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
              }}
            >
              <span className="relative z-10">Get started</span>
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed top-16 left-0 right-0 z-40 border-b animate-fade-in"
          style={{
            background: 'rgba(6, 10, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activePage === link.key
                    ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-center py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
              }}
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}

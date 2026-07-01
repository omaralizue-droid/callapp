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
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navBg = scrolled ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-transparent border-transparent'

  const navLinks = [
    { href: '/features', label: 'Features', key: 'features' },
    { href: '/pricing',  label: 'Pricing',  key: 'pricing'  },
    { href: '/blog',     label: 'Blog',     key: 'blog'     },
    { href: '/about',    label: 'About',    key: 'about'    },
  ]

  return (
    <>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-200 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CallPilot<span className="text-indigo-600">.AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  activePage === link.key ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-all shadow-sm shadow-indigo-600/10 hover:shadow-md"
            >
              Get started
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 border-b border-slate-200 bg-white shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activePage === link.key
                    ? 'bg-indigo-50/70 text-indigo-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-slate-100" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold text-center py-2.5 rounded-lg transition-all"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}

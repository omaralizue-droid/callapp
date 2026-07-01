'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Sun, Moon, Menu, X } from 'lucide-react'

interface GoogleNavProps {
  activePage?: string
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export default function GoogleNav({ activePage, theme, toggleTheme }: GoogleNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isDark = theme === 'dark'

  const navBg = isDark
    ? scrolled ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-[#1e1e1e] border-[#3c4043]'
    : scrolled ? 'bg-white border-[#dadce0] shadow-sm' : 'bg-white/95 border-transparent'

  const logoText  = isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
  const linkBase  = isDark ? 'text-[#9aa0a6] hover:text-[#8ab4f8]' : 'text-[#5f6368] hover:text-[#1a73e8]'
  const linkActive = isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8] font-semibold'
  const signInCls = isDark ? 'text-[#8ab4f8] hover:bg-[#8ab4f820] px-4 py-2 rounded-full' : 'text-[#1a73e8] hover:bg-[#e8f0fe] px-4 py-2 rounded-full'
  const ctaCls    = isDark
    ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#a8c7fa] shadow-md'
    : 'bg-[#1a73e8] text-white hover:bg-[#1557b0] shadow-md'
  const toggleCls = isDark
    ? 'text-[#9aa0a6] hover:bg-[#3c4043] border-[#3c4043]'
    : 'text-[#5f6368] hover:bg-[#f1f3f4] border-[#dadce0]'
  const mobileBg  = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'
  const mobileLink = isDark ? 'text-[#e8eaed] hover:bg-[#3c4043]' : 'text-[#202124] hover:bg-[#f1f3f4]'

  const navLinks = [
    { href: '/features', label: 'Features', key: 'features' },
    { href: '/pricing',  label: 'Pricing',  key: 'pricing'  },
    { href: '/blog',     label: 'Blog',     key: 'blog'     },
    { href: '/about',    label: 'About',    key: 'about'    },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {/* Google 4-dot logo */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #4285F4 0%, #4285F4 50%, #34A853 50%)' }}
            >
              <div className="absolute top-0 right-0 w-4 h-4" style={{ background: '#EA4335', borderRadius: '0 12px 0 0' }} />
              <div className="absolute bottom-0 right-0 w-4 h-4" style={{ background: '#FBBC04', borderRadius: '0 0 12px 0' }} />
              <Cpu className="w-4 h-4 text-white z-10 relative" />
            </div>
            <span className={`text-lg font-semibold tracking-tight ${logoText}`}>
              CallPilot<span style={{ color: '#1a73e8' }}>.AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  activePage === link.key ? linkActive : linkBase
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer ${toggleCls}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/login"
              className={`hidden md:inline-flex items-center text-sm font-medium transition-all ${signInCls}`}
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className={`hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full transition-all ${ctaCls}`}
            >
              Get started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-full border transition-all ${toggleCls}`}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden fixed top-16 left-0 right-0 z-40 border-b ${mobileBg} shadow-lg`}>
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activePage === link.key
                    ? (isDark ? 'bg-[#8ab4f820] text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]')
                    : mobileLink
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className={`my-2 h-px ${isDark ? 'bg-[#3c4043]' : 'bg-[#dadce0]'}`} />
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${mobileLink}`}>
              Sign in
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold text-center transition-all ${ctaCls}`}>
              Get started
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}

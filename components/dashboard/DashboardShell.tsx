'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UploadCloud,
  PhoneCall,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  User,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react'
import { signoutAction } from '@/actions/auth'

interface DashboardShellProps {
  children: React.ReactNode
  profile: {
    firstName: string | null
    lastName: string | null
    email: string
    role: string
    organization: {
      name: string
    } | null
  } | null
}

// Google brand colors
const G_BLUE   = '#1a73e8'
const G_GREEN  = '#34a853'
const G_RED    = '#ea4335'
const G_YELLOW = '#f9ab00'

export default function DashboardShell({ children, profile }: DashboardShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('landing-theme') !== 'light'
    }
    return true
  })

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('landing-theme', next ? 'dark' : 'light')
    }
  }

  const navItems = [
    { name: 'Overview',         href: '/dashboard/overview', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'Upload Calls',     href: '/dashboard/upload',   icon: <UploadCloud className="w-4 h-4" />,    roles: ['ADMIN', 'MANAGER'] },
    { name: 'Call History',     href: '/dashboard/calls',    icon: <PhoneCall className="w-4 h-4" />,      roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'AI Coach',         href: '/dashboard/coach',    icon: <Sparkles className="w-4 h-4" />,       roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'QA Grading',       href: '/dashboard/qa',       icon: <ShieldCheck className="w-4 h-4" />,    roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Reports',          href: '/dashboard/reports',  icon: <BarChart3 className="w-4 h-4" />,      roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Analytics',        href: '/dashboard/analytics',icon: <TrendingUp className="w-4 h-4" />,     roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Agents',           href: '/dashboard/agents',   icon: <Users className="w-4 h-4" />,          roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'My Profile',       href: '/dashboard/profile',  icon: <User className="w-4 h-4" />,           roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'Admin Settings',   href: '/dashboard/settings', icon: <Settings className="w-4 h-4" />,       roles: ['ADMIN', 'MANAGER'] },
  ].filter((item) => item.roles.includes(profile?.role || 'AGENT'))

  const handleLogout = async () => {
    await signoutAction()
    window.location.href = '/login'
  }

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    if (paths.length <= 1) return 'Dashboard'
    return paths.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')
  }

  const userInitials = profile
    ? `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
    : 'U'

  // Theme tokens
  const bg         = isDark ? '#1e1e1e' : '#f8f9fa'
  const sidebarBg  = isDark ? '#2d2d2d' : '#ffffff'
  const sidebarBdr = isDark ? '#3c4043' : '#dadce0'
  const headerBg   = isDark ? '#2d2d2d' : '#ffffff'
  const headerBdr  = isDark ? '#3c4043' : '#dadce0'
  const textPrimary = isDark ? '#e8eaed' : '#202124'
  const textMuted  = isDark ? '#9aa0a6' : '#5f6368'
  const hoverBg    = isDark ? '#3c4043' : '#f1f3f4'
  const searchBg   = isDark ? '#3c4043' : '#f1f3f4'
  const inputTxt   = isDark ? '#e8eaed' : '#202124'

  const SidebarContent = () => (
    <>
      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        {/* Logo */}
        <Link href="/dashboard/overview" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0"
            style={{ background: 'linear-gradient(135deg, #4285F4 0%, #4285F4 50%, #34A853 50%)' }}
          >
            <div className="absolute top-0 right-0 w-4 h-4" style={{ background: '#EA4335', borderRadius: '0 8px 0 0' }} />
            <div className="absolute bottom-0 right-0 w-4 h-4" style={{ background: '#FBBC04', borderRadius: '0 0 8px 0' }} />
            <span className="text-white text-[9px] font-black z-10 relative">CP</span>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: textPrimary }}>
              CallPilot<span style={{ color: G_BLUE }}>.AI</span>
            </div>
          </div>
        </Link>

        {/* Org chip */}
        <div className="mx-2 px-3 py-2.5 rounded-xl text-xs" style={{ background: isDark ? '#3c4043' : '#f1f3f4' }}>
          <div className="font-medium mb-0.5" style={{ color: textMuted, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Workspace</div>
          <div className="font-semibold truncate" style={{ color: textPrimary }}>{profile?.organization?.name || 'My Organization'}</div>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? G_BLUE + '18' : 'transparent',
                  color: isActive ? G_BLUE : textMuted,
                  fontWeight: isActive ? 600 : 500,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: isActive ? G_BLUE : textMuted }}>{item.icon}</span>
                {item.name}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: G_BLUE }} />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t" style={{ borderColor: sidebarBdr }}>
        {profile && (
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: G_BLUE }}>
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                {profile.firstName} {profile.lastName}
              </div>
              <div className="text-xs uppercase" style={{ color: textMuted, fontSize: '10px', letterSpacing: '0.05em' }}>
                {profile.role}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
          style={{ color: G_RED }}
          onMouseEnter={e => (e.currentTarget.style.background = G_RED + '12')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex font-sans overflow-x-hidden"
      style={{ background: bg, color: textPrimary }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r shrink-0"
        style={{ background: sidebarBg, borderColor: sidebarBdr }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 border-r flex flex-col z-50 transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: sidebarBg, borderColor: sidebarBdr }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: sidebarBdr }}>
          <span className="text-sm font-semibold" style={{ color: textPrimary }}>Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: textMuted }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 shrink-0"
          style={{ background: headerBg, borderColor: headerBdr }}>

          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg md:hidden transition-colors"
              style={{ color: textMuted }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: textMuted }}>Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: textMuted }} />
              <span className="font-semibold" style={{ color: textPrimary }}>{getBreadcrumbs()}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-sm"
              style={{ background: searchBg }}>
              <Search className="w-3.5 h-3.5" style={{ color: textMuted }} />
              <input
                placeholder="Search calls..."
                className="bg-transparent border-none outline-none text-xs w-44"
                style={{ color: inputTxt }}
              />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all"
              style={{ borderColor: sidebarBdr, color: textMuted }}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification bell */}
            <button className="p-2 rounded-full border relative transition-all"
              style={{ borderColor: sidebarBdr, color: textMuted }}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: G_RED }} />
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
              style={{ background: G_BLUE }}>
              {userInitials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto max-h-[calc(100vh-64px)] p-6"
          style={{ background: bg }}>
          {children}
        </main>
      </div>
    </div>
  )
}

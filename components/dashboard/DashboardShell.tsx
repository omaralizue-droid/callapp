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

export default function DashboardShell({ children, profile }: DashboardShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const SidebarContent = () => (
    <>
      <div className="flex-grow overflow-y-auto space-y-6 p-4">
        {/* Logo */}
        <Link href="/dashboard/overview" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-600">
            <span className="text-white text-[11px] font-black">CP</span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              CallPilot<span className="text-indigo-600">.AI</span>
            </div>
          </div>
        </Link>

        {/* Org workspace label */}
        <div className="mx-2 px-3.5 py-2.5 rounded-lg text-xs bg-slate-50 border border-slate-100">
          <div className="font-semibold text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Workspace</div>
          <div className="font-bold text-slate-700 truncate">{profile?.organization?.name || 'My Organization'}</div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? '#4f46e5' : '#4b5563',
                }}
              >
                <span style={{ color: isActive ? '#4f46e5' : '#64748b' }}>{item.icon}</span>
                {item.name}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-600" />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Profile Card Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {profile && (
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-indigo-600">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-800 truncate">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
                {profile.role}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile menu drawer wrapper */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-slate-900/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 md:hidden bg-white ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Menu Navigation</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider">Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-indigo-600 uppercase tracking-wider">{getBreadcrumbs()}</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-3">
            {/* Search mock */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 w-60">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                placeholder="Search call logs..."
                className="bg-transparent border-none text-[11px] placeholder-slate-400 outline-none text-slate-800 w-full"
              />
            </div>

            {/* Notification bell */}
            <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 relative hover:shadow-sm transition-all">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-indigo-600 shadow-sm shrink-0">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-6 overflow-y-auto max-h-[calc(100vh-64px)] bg-slate-50">
          {children}
        </main>
      </div>

    </div>
  )
}

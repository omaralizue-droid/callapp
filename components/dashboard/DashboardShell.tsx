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
  Cpu,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  User,
  Sparkles,
} from 'lucide-react'
import { signoutAction } from '@/actions/auth'
import HeaderAnimation from './HeaderAnimation'

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
    { name: 'Overview', href: '/dashboard/overview', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'Upload Calls', href: '/dashboard/upload', icon: <UploadCloud className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Call History', href: '/dashboard/calls', icon: <PhoneCall className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'AI Coach', href: '/dashboard/coach', icon: <Sparkles className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'QA grading', href: '/dashboard/qa', icon: <ShieldCheck className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Reports', href: '/dashboard/reports', icon: <BarChart3 className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <TrendingUp className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Agents Directory', href: '/dashboard/agents', icon: <Users className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'My Profile', href: '/dashboard/profile', icon: <User className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'Admin Panel', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER'] },
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

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex font-sans select-none overflow-x-hidden">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950/80 border-r border-white/5 p-5 justify-between shrink-0 glass relative z-30">
        <div className="space-y-8">
          
          {/* Logo */}
          <Link href="/dashboard/overview" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CallPilot<span className="text-cyan-400">.AI</span>
            </span>
          </Link>

          {/* Org Display */}
          <div className="bg-slate-900/60 rounded-lg p-3 border border-white/5">
            <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">Active Workspace</span>
            <span className="text-xs font-bold text-white block truncate">{profile?.organization?.name || 'My Organization'}</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Settings & Logout */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          {profile && (
            <div className="flex items-center gap-3 px-1.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                {userInitials}
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-white truncate">
                  {profile.firstName} {profile.lastName}
                </span>
                <span className="block text-[9px] text-slate-500 uppercase tracking-wide">
                  {profile.role}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-950/95 border-r border-white/5 p-5 flex flex-col justify-between z-50 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          
          {/* Logo & Close Button */}
          <div className="flex justify-between items-center">
            <Link href="/dashboard/overview" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">CallPilot</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Org Display */}
          <div className="bg-slate-900/60 rounded-lg p-3 border border-white/5">
            <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">Active Workspace</span>
            <span className="text-xs font-bold text-white block truncate">{profile?.organization?.name || 'My Organization'}</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" onClick={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          {profile && (
            <div className="flex items-center gap-3 px-1.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                {userInitials}
              </div>
              <div>
                <span className="block text-xs font-bold text-white">
                  {profile.firstName} {profile.lastName}
                </span>
                <span className="block text-[9px] text-slate-500 uppercase tracking-wide">
                  {profile.role}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 3. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 glass relative z-20">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-slate-400 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 tracking-wide">
              {getBreadcrumbs()}
            </span>
          </div>

          <HeaderAnimation />

          {/* Right: Search, Notifications, Avatar */}
          <div className="flex items-center gap-4">
            
            {/* Search Mock */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 w-60">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                placeholder="Quick search call history..."
                className="bg-transparent border-none text-[11px] placeholder-slate-500 outline-none text-white w-full"
              />
            </div>

            {/* Notification Bell */}
            <button className="p-1.5 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white relative hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
            </button>

            {/* User Dropdown */}
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
              {userInitials}
            </div>

          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-grow p-6 overflow-y-auto max-h-[calc(100vh-64px)] relative">
          {children}
        </main>
      </div>

    </div>
  )
}

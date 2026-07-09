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
  Plug,
} from 'lucide-react'
import { signoutAction } from '@/actions/auth'
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
  generateDemoNotificationsAction,
} from '@/actions/notifications'
import DashboardParticles from './DashboardParticles'
import { BrandingProvider } from './BrandingProvider'
import type { OrgBranding } from '@/lib/branding'
import { effectiveBrandColor, effectiveBrandName, darkenHexColor, sanitizeHex, DEFAULT_BRAND_COLOR, DEFAULT_BRAND_COLOR_DARK } from '@/lib/branding'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date | string
}

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
  initialNotifications?: NotificationItem[]
  branding?: OrgBranding
}

export default function DashboardShell({ children, profile, initialNotifications, branding }: DashboardShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications || [])
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  // Brand color values (fall back to default indigo if no custom branding)
  const primaryColor = effectiveBrandColor(branding ?? { brandColor: null, brandName: null, brandLogoUrl: null, brandColorDark: null, emailFromName: null, emailFooterText: null, customDomain: null, customDomainVerified: false })
  const darkColor    = sanitizeHex(branding?.brandColorDark ?? null) ?? darkenHexColor(primaryColor, 20)
  const displayName  = effectiveBrandName(branding ?? { brandColor: null, brandName: null, brandLogoUrl: null, brandColorDark: null, emailFromName: null, emailFooterText: null, customDomain: null, customDomainVerified: false })

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationReadAction(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadAction()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const handleGenerateDemo = async () => {
    try {
      const res = await generateDemoNotificationsAction()
      if (res.success && res.notifications) {
        setNotifications([...res.notifications, ...notifications])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const navItems = [
    { name: 'Overview',       href: '/dashboard/overview',      icon: <LayoutDashboard className="w-4 h-4" />, roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'Upload Calls',   href: '/dashboard/upload',         icon: <UploadCloud className="w-4 h-4" />,    roles: ['ADMIN', 'MANAGER'] },
    { name: 'Call History',   href: '/dashboard/calls',          icon: <PhoneCall className="w-4 h-4" />,      roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'AI Coach',       href: '/dashboard/coach',          icon: <Sparkles className="w-4 h-4" />,       roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'QA Grading',     href: '/dashboard/qa',             icon: <ShieldCheck className="w-4 h-4" />,    roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Reports',        href: '/dashboard/reports',        icon: <BarChart3 className="w-4 h-4" />,      roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Analytics',      href: '/dashboard/analytics',      icon: <TrendingUp className="w-4 h-4" />,     roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Agents',         href: '/dashboard/agents',         icon: <Users className="w-4 h-4" />,          roles: ['ADMIN', 'MANAGER', 'QA'] },
    { name: 'Integrations',   href: '/dashboard/integrations',   icon: <Plug className="w-4 h-4" />,           roles: ['ADMIN', 'MANAGER'] },
    { name: 'My Profile',     href: '/dashboard/profile',        icon: <User className="w-4 h-4" />,           roles: ['ADMIN', 'MANAGER', 'QA', 'AGENT'] },
    { name: 'Admin Settings', href: '/dashboard/settings',       icon: <Settings className="w-4 h-4" />,       roles: ['ADMIN', 'MANAGER'] },
  ].filter((item) => item.roles.includes(profile?.role || 'AGENT'))

  const handleLogout = async () => {
    try {
      await signoutAction()
    } catch (err) {
      console.warn('Signout failed, forcing redirect:', err)
    }
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
      <div className="flex-grow overflow-y-auto space-y-5 p-4">
        {/* Logo */}
        <Link
          href="/dashboard/overview"
          className="flex items-center gap-2.5 px-2 py-1 group"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${darkColor})`,
              boxShadow: `0 0 16px ${primaryColor}80`,
            }}
          >
            {branding?.brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={branding.brandLogoUrl}
                alt="Logo"
                className="w-6 h-6 object-contain relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span className="text-white text-[11px] font-black relative z-10">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {branding?.brandName ? (
                branding.brandName
              ) : (
                <>CallPilot<span style={{ color: `${primaryColor}` }}>.AI</span></>
              )}
            </div>
          </div>
        </Link>

        {/* Org workspace label */}
        <div
          className="mx-2 px-3.5 py-2.5 rounded-xl"
          style={{
            background: `${primaryColor}14`,
            border: `1px solid ${primaryColor}26`,
          }}
        >
          <div className="font-semibold text-[9px] uppercase tracking-wider mb-0.5" style={{ color: '#475569' }}>
            Workspace
          </div>
          <div className="font-bold truncate text-sm" style={{ color: '#cbd5e1' }}>
            {profile?.organization?.name || 'My Organization'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative group"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${primaryColor}40, ${darkColor}26)`
                    : 'transparent',
                  color: isActive ? '#a5b4fc' : '#64748b',
                  border: isActive ? `1px solid ${primaryColor}4d` : '1px solid transparent',
                  boxShadow: isActive ? `0 0 12px ${primaryColor}26` : 'none',
                }}
              >
                {/* Hover background */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.04] transition-colors" />
                )}
                <span style={{ color: isActive ? primaryColor : '#475569' }} className="relative z-10">
                  {item.icon}
                </span>
                <span className="relative z-10" style={{ color: isActive ? '#c4b5fd' : '#64748b' }}>
                  {item.name}
                </span>
                {isActive && (
                  <ChevronRight
                    className="w-3.5 h-3.5 ml-auto relative z-10"
                    style={{ color: primaryColor }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div
        className="p-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {profile && (
          <div className="flex items-center gap-3 px-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${darkColor})`,
                boxShadow: `0 0 10px ${primaryColor}66`,
              }}
            >
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate" style={{ color: '#e2e8f0' }}>
                {profile.firstName} {profile.lastName}
              </div>
              <div className="text-[10px] uppercase tracking-wide font-medium" style={{ color: '#475569' }}>
                {profile.role}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group relative overflow-hidden"
          style={{ color: '#f43f5e' }}
        >
          <span className="absolute inset-0 rounded-xl bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors pointer-events-none" />
          <LogOut className="w-4 h-4 relative z-10" style={{ color: '#f43f5e' }} />
          <span className="relative z-10">Sign out</span>
        </button>
      </div>
    </>
  )

  return (
    <BrandingProvider branding={branding ?? { brandName: null, brandLogoUrl: null, brandColor: null, brandColorDark: null, emailFromName: null, emailFooterText: null, customDomain: null, customDomainVerified: false }}>
      <div
        className="min-h-screen flex font-sans overflow-x-hidden"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 relative"
        style={{
          background: 'rgba(10, 17, 40, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Three.js ambient particles behind sidebar content */}
        <div className="absolute inset-0 overflow-hidden">
          <DashboardParticles />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(6,10,26,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 flex flex-col z-50 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(10, 17, 40, 0.98)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#475569' }}>
            Navigation
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg transition-colors"
            style={{ color: '#475569' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 shrink-0 z-20"
          style={{
            background: 'rgba(10, 17, 40, 0.90)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border md:hidden transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.10)', color: '#64748b' }}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="uppercase tracking-wider" style={{ color: '#334155' }}>Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: '#334155' }} />
              <span className="uppercase tracking-wider" style={{ color: '#818cf8' }}>
                {getBreadcrumbs()}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-full px-3.5 py-1.5 w-60"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: '#334155' }} />
              <input
                placeholder="Search call logs..."
                className="bg-transparent border-none text-[11px] placeholder-slate-600 outline-none w-full"
                style={{ color: '#e2e8f0' }}
              />
            </div>

            {/* Bell Icon & Notification Center */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full relative transition-all cursor-pointer hover:bg-white/5 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: isNotifOpen ? '#818cf8' : '#475569',
                }}
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#f43f5e', boxShadow: '0 0 6px rgba(244,63,94,0.6)' }}
                  />
                )}
              </button>

              {/* Notification Center Popover */}
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />
                  <div
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-40 p-4 space-y-3 animate-fade-in text-xs"
                    style={{
                      background: 'rgba(10,17,40,0.98)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="font-bold text-white uppercase tracking-wider text-[10px]">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[9px] font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-slate-500 italic text-[10px]">
                          No notifications found.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => !n.isRead && handleMarkRead(n.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden group ${
                              n.isRead 
                                ? 'bg-transparent border-white/5 opacity-60' 
                                : 'bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className={`font-bold truncate max-w-[180px] ${n.isRead ? 'text-slate-400' : 'text-indigo-300'}`}>
                                {n.title}
                              </span>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{n.message}</p>
                            <span className="text-[8px] text-slate-600 self-end font-mono">
                              {new Date(n.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[8px] text-slate-500">Unread Alert Count: {unreadCount}</span>
                      <button
                        onClick={handleGenerateDemo}
                        className="text-[9px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Generate Test Alerts
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${darkColor})`,
                boxShadow: `0 0 12px ${primaryColor}66`,
              }}
            >
              {userInitials}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="flex-grow p-6 overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 64px)',
            background: 'var(--bg-primary)',
          }}
        >
          {children}
        </main>
      </div>
      </div>
    </BrandingProvider>
  )
}

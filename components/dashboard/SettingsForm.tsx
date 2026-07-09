'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  Shield,
  Key,
  Loader2,
  Plus,
  Trash2,
  Users,
  ShieldCheck,
  BarChart3,
  HardDrive,
  Wrench,
  CreditCard,
  PlusCircle,
  Globe,
  Settings2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  Clock,
  Palette,
} from 'lucide-react'
import { createCheckoutSessionAction, createPortalSessionAction } from '@/actions/stripe'
import {
  createInvitationAction,
  revokeInvitationAction,
  resendInvitationAction,
} from '@/actions/invitations'
import {
  generateApiKeyAction,
  revokeApiKeyAction,
  regenerateApiKeyAction,
  getApiKeyAuditLogsAction,
  API_SCOPES,
} from '@/actions/apikeys'
import BrandingPanel from './BrandingPanel'
import type { OrgBranding } from '@/lib/branding'

type ApiKeyRow = {
  id: string
  name: string
  keyPrefix: string
  scopes: string[]
  rateLimitRpm: number
  isRevoked: boolean
  lastUsedAt: string | null
  expiresAt: string | null
  createdAt: string
  auditLogCount: number
}

type AuditLogRow = {
  id: string
  action: string
  performedById: string | null
  ipAddress: string | null
  details: string | null
  createdAt: string
}

interface SettingsFormProps {
  initialBilling?: {
    planName: string
    planStatus: string
    stripeCurrentPeriodEnd: string | null
    stripeCancelAtPeriodEnd: boolean
    callLimit: number
    usedCalls: number
    storageLimit: number
    storageUsedBytes: number
    aiRequestsLimit: number
    aiRequestsUsed: number
    agentsLimit: number
    agentsUsed: number
    reportsLimit: number
    reportsUsed: number
    paymentHistories: Array<{
      invoice: string
      date: string
      amount: string
      status: string
    }>
  }
  currentUserRole: string
  initialUsers: Array<{
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: string
    team: string
  }>
  initialInvitations: Array<{
    id: string
    email: string
    role: string
    isAccepted: boolean
    isRevoked: boolean
    expiresAt: string
    createdAt: string
  }>
  initialTeams: Array<{
    id: string
    name: string
    description: string | null
    membersCount: number
  }>
  initialApiKeys?: ApiKeyRow[]
  initialBranding?: OrgBranding
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  if (bytes >= 999999999999) return 'Unlimited'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function SettingsForm({
  initialBilling,
  currentUserRole,
  initialUsers,
  initialInvitations,
  initialTeams,
  initialApiKeys = [],
  initialBranding,
}: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'rubric' | 'crm' | 'users' | 'permissions' | 'diagnostics' | 'analytics' | 'calls' | 'billing' | 'developer' | 'branding'
  >('profile')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'billing') {
        setActiveSubTab('billing')
      }
    }
  }, [])

  // Existing states
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Rodriguez')
  const email = 'alex.r@company.com'
  const [orgName, setOrgName] = useState('Apex Global BPO')

  const [complianceItems, setComplianceItems] = useState([
    'Branded greeting used within first 5 seconds',
    'Recording disclosure stated explicitly',
    'Verify caller account identity and security tokens',
    'Refund policy guideline adherence',
  ])
  const [newItem, setNewItem] = useState('')

  const [hubspotKey, setHubspotKey] = useState('pat-na1-xxxx-xxxx-xxxx')
  const [salesforceUrl, setSalesforceUrl] = useState('https://apex-bpo.my.salesforce.com')

  // Enterprise Admin panel states
  // User states
  const [users, setUsers] = useState(initialUsers)
  const [invitations, setInvitations] = useState(initialInvitations)
  const [teams, setTeams] = useState(initialTeams)

  // Invitation Form States
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('AGENT')
  const [isInviting, setIsInviting] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDesc, setNewTeamDesc] = useState('')

  // Storage and diagnostics states
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash')
  const [geminiTemp, setGeminiTemp] = useState(0.2)
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.salesforce.com/services/xxxx/xxxx')
  const apiKey = 'cp_live_pk_xxxxxxxxxxxxxx'
  const [showApiKey, setShowApiKey] = useState(false)

  // ─── API Key Management State ───────────────────────────────────────────────
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>(initialApiKeys)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([])
  const [newKeyRpm, setNewKeyRpm] = useState(60)
  const [newKeyExpiry, setNewKeyExpiry] = useState('')
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  // One-time reveal modal
  const [revealedKey, setRevealedKey] = useState<{ raw: string; name: string } | null>(null)
  const [keyCopied, setKeyCopied] = useState(false)

  // Per-key audit log drawer (keyed by API key id)
  const [auditLogs, setAuditLogs] = useState<Record<string, AuditLogRow[]>>({})
  const [expandedKeyId, setExpandedKeyId] = useState<string | null>(null)
  const [loadingAudit, setLoadingAudit] = useState<string | null>(null)

  // Call database states
  const [adminCalls, setAdminCalls] = useState([
    { id: 'call-1', title: 'Subscription Cancel Dispute', filename: 'cancel_dispute_cust_928.wav', duration: '3m 02s', size: '4.5 MB', qaScore: 94 },
    { id: 'call-2', title: 'Payment Processing Failure', filename: 'billing_failure_988.wav', duration: '2m 04s', size: '3.1 MB', qaScore: 82 },
    { id: 'call-3', title: 'Billing Address Change request', filename: 'addr_change_718.wav', duration: '1m 45s', size: '2.4 MB', qaScore: 88 },
  ])

  // Billing states
  const billing = initialBilling || {
    planName: 'Starter',
    planStatus: 'TRIAL',
    stripeCurrentPeriodEnd: null,
    stripeCancelAtPeriodEnd: false,
    callLimit: 100,
    usedCalls: 0,
    storageLimit: 5368709120,
    storageUsedBytes: 0,
    aiRequestsLimit: 100,
    aiRequestsUsed: 0,
    agentsLimit: 5,
    agentsUsed: 0,
    reportsLimit: 50,
    reportsUsed: 0,
    paymentHistories: [
      { invoice: 'INV-mock-01', date: 'Jun 1, 2026', amount: '$49.00', status: 'PAID' }
    ]
  }

  const [selectedPlan, setSelectedPlan] = useState(billing.planName.toLowerCase())
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleUpgradeOrCheckout = async () => {
    setIsRedirecting(true)
    try {
      const res = await createCheckoutSessionAction(selectedPlan)
      if (res.error) {
        alert(res.error)
      } else if (res.url) {
        window.location.href = res.url
      }
    } catch (err) {
      alert('Failed to initialize billing session: ' + String(err))
    } finally {
      setIsRedirecting(false)
    }
  }

  const handleManageBilling = async () => {
    setIsRedirecting(true)
    try {
      const res = await createPortalSessionAction()
      if (res.error) {
        alert(res.error)
      } else if (res.url) {
        window.location.href = res.url
      }
    } catch (err) {
      alert('Failed to open billing portal: ' + String(err))
    } finally {
      setIsRedirecting(false)
    }
  }

  // Handlers
  const handleAddRubricItem = () => {
    if (newItem.trim()) {
      setComplianceItems([...complianceItems, newItem.trim()])
      setNewItem('')
    }
  }

  const handleRemoveRubricItem = (index: number) => {
    setComplianceItems(complianceItems.filter((_, i) => i !== index))
  }

  const isOwnerOrAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'OWNER'

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOwnerOrAdmin) {
      alert('Only owners and administrators can manage invitations.')
      return
    }
    if (!inviteEmail.trim()) {
      alert('Email address is required.')
      return
    }

    setIsInviting(true)
    try {
      const res = await createInvitationAction(inviteEmail, inviteRole)
      if (res.error) {
        alert(res.error)
      } else {
        alert('Invitation sent successfully!')
        const newInvite = {
          id: res.invitation!.id,
          email: res.invitation!.email,
          role: res.invitation!.role,
          isAccepted: res.invitation!.isAccepted,
          isRevoked: res.invitation!.isRevoked,
          expiresAt: res.invitation!.expiresAt.toISOString(),
          createdAt: res.invitation!.createdAt.toISOString(),
        }
        setInvitations([newInvite, ...invitations])
        setInviteEmail('')
      }
    } catch (err) {
      alert('Failed to send invitation: ' + String(err))
    } finally {
      setIsInviting(false)
    }
  }

  const handleResendInvite = async (id: string) => {
    if (!isOwnerOrAdmin) return
    try {
      const res = await resendInvitationAction(id)
      if (res.error) {
        alert(res.error)
      } else {
        alert('Invitation resent successfully!')
        setInvitations(invitations.map(i => {
          if (i.id === id) {
            const nextExp = new Date()
            nextExp.setDate(nextExp.getDate() + 7)
            return { ...i, expiresAt: nextExp.toISOString() }
          }
          return i
        }))
      }
    } catch (err) {
      alert('Failed to resend: ' + String(err))
    }
  }

  const handleRevokeInvite = async (id: string) => {
    if (!isOwnerOrAdmin) return
    if (!confirm('Are you sure you want to revoke this invitation?')) return

    try {
      const res = await revokeInvitationAction(id)
      if (res.error) {
        alert(res.error)
      } else {
        alert('Invitation revoked successfully!')
        setInvitations(invitations.map(i => i.id === id ? { ...i, isRevoked: true } : i))
      }
    } catch (err) {
      alert('Failed to revoke: ' + String(err))
    }
  }

  const getInviteStatus = (invite: typeof invitations[0]) => {
    if (invite.isAccepted) return { label: 'Accepted', color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' }
    if (invite.isRevoked) return { label: 'Revoked', color: '#fca5a5', bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)' }
    const isExpired = new Date(invite.expiresAt) < new Date()
    if (isExpired) return { label: 'Expired', color: '#94a3b8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }
    return { label: 'Pending', color: '#fcd34d', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' }
  }

  const handleDeleteUser = (id: string) => {
    alert('User deletions must be processed via Supabase Auth admin panels.')
  }

  const handleUpdateUserRole = (id: string, newRole: string) => {
    alert('To change a member\'s role, please revoke and re-invite them with the new role.')
  }

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTeamName) {
      setTeams([
        ...teams,
        {
          id: `team-${Date.now()}`,
          name: newTeamName,
          description: newTeamDesc || 'No description provided.',
          membersCount: 0,
        },
      ])
      setNewTeamName('')
      setNewTeamDesc('')
      alert('Team created successfully!')
    }
  }

  const handleDeleteTeam = (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(t => t.id !== id))
    }
  }

  const handleDeleteCall = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this call record and all its associated QA analysis files?')) {
      setAdminCalls(adminCalls.filter(c => c.id !== id))
      alert('Call record deleted successfully.')
    }
  }

  // ─── API Key Handlers ───────────────────────────────────────────────────────
  const handleScopeToggle = (scope: string) => {
    setNewKeyScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    )
  }

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) { alert('Key name is required.'); return }
    if (newKeyScopes.length === 0) { alert('Select at least one scope.'); return }

    setIsGeneratingKey(true)
    try {
      const res = await generateApiKeyAction({
        name: newKeyName,
        scopes: newKeyScopes,
        rateLimitRpm: newKeyRpm,
        expiresAt: newKeyExpiry || null,
      })
      if (res.error) {
        alert(res.error)
      } else if (res.apiKey && res.rawKey) {
        setApiKeys(prev => [{ ...res.apiKey!, auditLogCount: 0 }, ...prev])
        setNewKeyName('')
        setNewKeyScopes([])
        setNewKeyRpm(60)
        setNewKeyExpiry('')
        setRevealedKey({ raw: res.rawKey, name: res.apiKey.name })
        setKeyCopied(false)
      }
    } catch (err) {
      alert('Failed to generate key: ' + String(err))
    } finally {
      setIsGeneratingKey(false)
    }
  }

  const handleRevokeKey = async (id: string, name: string) => {
    if (!confirm(`Revoke API key "${name}"? Any integrations using this key will stop working immediately.`)) return
    try {
      const res = await revokeApiKeyAction(id)
      if (res.error) {
        alert(res.error)
      } else {
        setApiKeys(prev => prev.map(k => k.id === id ? { ...k, isRevoked: true } : k))
      }
    } catch (err) {
      alert('Failed to revoke key: ' + String(err))
    }
  }

  const handleRegenerateKey = async (id: string, name: string) => {
    if (!confirm(`Regenerate API key "${name}"? The current key will be invalidated immediately.`)) return
    try {
      const res = await regenerateApiKeyAction(id)
      if (res.error) {
        alert(res.error)
      } else if (res.apiKey && res.rawKey) {
        setApiKeys(prev => prev.map(k => k.id === id ? { ...res.apiKey!, auditLogCount: k.auditLogCount + 1 } : k))
        setRevealedKey({ raw: res.rawKey, name: res.apiKey.name })
        setKeyCopied(false)
      }
    } catch (err) {
      alert('Failed to regenerate key: ' + String(err))
    }
  }

  const handleToggleAuditLog = async (id: string) => {
    if (expandedKeyId === id) {
      setExpandedKeyId(null)
      return
    }
    setExpandedKeyId(id)
    if (auditLogs[id]) return // already loaded

    setLoadingAudit(id)
    try {
      const res = await getApiKeyAuditLogsAction(id)
      if (!res.error) {
        setAuditLogs(prev => ({ ...prev, [id]: res.logs }))
      }
    } catch { /* silent */ } finally {
      setLoadingAudit(null)
    }
  }

  const handleCopyKey = async (raw: string) => {
    try {
      await navigator.clipboard.writeText(raw)
      setKeyCopied(true)
      setTimeout(() => setKeyCopied(false), 3000)
    } catch {
      alert('Copy failed — please select and copy the key manually.')
    }
  }

  const getKeyStatus = (k: ApiKeyRow) => {
    if (k.isRevoked) return { label: 'Revoked', color: '#fca5a5', bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)' }
    if (k.expiresAt && new Date(k.expiresAt) < new Date()) return { label: 'Expired', color: '#94a3b8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }
    return { label: 'Active', color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' }
  }

  const getAuditActionStyle = (action: string) => {
    switch (action) {
      case 'CREATED': return { color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' }
      case 'REVOKED': return { color: '#fca5a5', bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)' }
      case 'REGENERATED': return { color: '#a78bfa', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)' }
      case 'RATE_LIMITED': return { color: '#fcd34d', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' }
      case 'USED': return { color: '#7dd3fc', bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.3)' }
      default: return { color: '#94a3b8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Enterprise preferences updated successfully!')
    }, 1500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-xs select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Enterprise Settings</h2>
        <p className="text-[10px] text-slate-500 mt-1">Configure user structures, compliance rubrics, AI models, and billing credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Side Tab Selector Navigation */}
        <div className="md:col-span-1 flex flex-col gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">General</span>
          <button
            onClick={() => setActiveSubTab('profile')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'profile' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Profile & Org
          </button>
          <button
            onClick={() => setActiveSubTab('rubric')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'rubric' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            QA Eval Rubrics
          </button>
          <button
            onClick={() => setActiveSubTab('crm')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'crm' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            CRM Connection
          </button>

          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-3 pb-1">Enterprise Admin</span>
          <button
            onClick={() => setActiveSubTab('users')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'users' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Users & Teams
          </button>
          <button
            onClick={() => setActiveSubTab('permissions')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'permissions' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Role Permissions
          </button>
          <button
            onClick={() => setActiveSubTab('diagnostics')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'diagnostics' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Diagnostics & AI
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Admin Analytics
          </button>
          <button
            onClick={() => setActiveSubTab('calls')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'calls' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Manage Call Data
          </button>
          <button
            onClick={() => setActiveSubTab('billing')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'billing' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Billing & Plans
          </button>
          <button
            onClick={() => setActiveSubTab('developer')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'developer' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            API Keys
          </button>

          {/* White Label — ADMIN only */}
          {isOwnerOrAdmin && (
            <>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-3 pb-1">White Label</span>
              <button
                onClick={() => setActiveSubTab('branding')}
                type="button"
                className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'branding' ? 'bg-violet-500 text-white font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Branding
              </button>
            </>
          )}
        </div>

        {/* Right Side Content Form Container */}
        <div className="md:col-span-3">
          {/* White Label Branding panel — rendered outside the main form */}
          {activeSubTab === 'branding' && (
            <div className="glass rounded-xl p-6 border border-white/5">
              <BrandingPanel
                initialBranding={initialBranding ?? {
                  brandName: null,
                  brandLogoUrl: null,
                  brandColor: null,
                  brandColorDark: null,
                  emailFromName: null,
                  emailFooterText: null,
                  customDomain: null,
                  customDomainVerified: false,
                }}
                currentUserRole={currentUserRole}
              />
            </div>
          )}

          {activeSubTab !== 'branding' && (
          <form onSubmit={handleSaveSettings} className="glass rounded-xl p-6 border border-white/5 space-y-6">
            
            {/* Tab 1: Profile & Org Settings */}
            {activeSubTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Workspace</h3>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Organization Name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: QA Rubrics Configuration */}
            {activeSubTab === 'rubric' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    AI Compliance Directives
                  </h3>
                  <span className="bg-cyan-500/10 text-cyan-400 text-[9px] px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-bold tracking-wider">
                    Prompt Config
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Customize the criteria CallPilot AI utilizes to audit and score compliance. Adding or removing lines here immediately alters scorecard configurations for future call analyses.
                </p>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {complianceItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center justify-between p-2.5 bg-slate-900 border border-white/5 rounded-lg text-slate-300">
                      <span className="leading-relaxed">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRubricItem(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="E.g., Explicitly confirm caller agreed to terms..."
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRubricItem}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: CRM Connections */}
            {activeSubTab === 'crm' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyan-400" />
                  CRM Integration Settings
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Enter API keys to enable direct sync buttons in Call Detail screens. Call summaries and action tasks will be pushed automatically into caller contact logs.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">HubSpot Private App Token</label>
                    <input
                      type="password"
                      value={hubspotKey}
                      onChange={(e) => setHubspotKey(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Salesforce Instance URL</label>
                    <input
                      type="text"
                      value={salesforceUrl}
                      onChange={(e) => setSalesforceUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Manage Users & Teams */}
            {activeSubTab === 'users' && (
              <div className="space-y-6">
                
                {/* 4.1 Users Management */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Manage Users ({users.length})
                  </h3>
                  <div className="glass rounded-lg border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5">
                          <th className="px-4 py-2 font-semibold">User</th>
                          <th className="px-4 py-2 font-semibold">Email</th>
                          <th className="px-4 py-2 font-semibold">Team</th>
                          <th className="px-4 py-2 font-semibold">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-white/[0.01]">
                            <td className="px-4 py-2.5 font-bold text-white">
                              {u.firstName || 'New'} {u.lastName || 'Member'}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-slate-400">{u.email}</td>
                            <td className="px-4 py-2.5">{u.team}</td>
                            <td className="px-4 py-2.5">
                              <span className="bg-white/5 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 4.1.2 Pending & Past Invitations */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider pl-1">
                      Organization Invitations ({invitations.length})
                    </h4>
                    
                    <div className="glass rounded-lg border border-white/5 overflow-hidden">
                      {invitations.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 italic text-[10px]">No invitations sent yet.</div>
                      ) : (
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5">
                              <th className="px-4 py-2 font-semibold">Invitee Email</th>
                              <th className="px-4 py-2 font-semibold">Role</th>
                              <th className="px-4 py-2 font-semibold">Sent Date</th>
                              <th className="px-4 py-2 font-semibold">Status</th>
                              {isOwnerOrAdmin && <th className="px-4 py-2"></th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            {invitations.map(invite => {
                              const status = getInviteStatus(invite)
                              const isPending = status.label === 'Pending'
                              
                              return (
                                <tr key={invite.id} className="hover:bg-white/[0.01]">
                                  <td className="px-4 py-2.5 font-semibold text-white">{invite.email}</td>
                                  <td className="px-4 py-2.5 font-mono text-slate-400 text-[10px]">{invite.role}</td>
                                  <td className="px-4 py-2.5 text-slate-400">{new Date(invite.createdAt).toLocaleDateString()}</td>
                                  <td className="px-4 py-2.5">
                                    <span
                                      className="px-2 py-0.5 rounded text-[9px] font-bold border"
                                      style={{
                                        background: status.bg,
                                        borderColor: status.border,
                                        color: status.color,
                                      }}
                                    >
                                      {status.label}
                                    </span>
                                  </td>
                                  {isOwnerOrAdmin && (
                                    <td className="px-4 py-2.5 text-right space-x-2">
                                      {isPending && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleResendInvite(invite.id)}
                                            title="Resend Invite"
                                            className="text-amber-400 hover:text-amber-300 text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                                          >
                                            Resend
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleRevokeInvite(invite.id)}
                                            title="Revoke Invite"
                                            className="text-rose-400 hover:text-rose-300 text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                                          >
                                            Revoke
                                          </button>
                                        </>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Invite User Form */}
                  {isOwnerOrAdmin ? (
                    <form onSubmit={handleInviteUser} className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <span className="font-bold text-slate-400 block">Invite New User</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <input
                            type="email"
                            required
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="Email Address (e.g. name@company.com)"
                            className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <select
                            value={inviteRole}
                            onChange={e => setInviteRole(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-cyan-500"
                          >
                            <option value="AGENT">AGENT</option>
                            <option value="QA">QA</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={isInviting}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          {isInviting ? 'Inviting...' : 'Send Invitation'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-slate-500 text-[10px] text-center italic">
                      Only organization owners and administrators can manage invites.
                    </div>
                  )}
                </div>

                {/* 4.2 Teams Management */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Manage Teams
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teams.map(t => (
                      <div key={t.id} className="glass p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white">{t.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTeam(t.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-t border-white/5 pt-2">
                          <span>MEMBERS: {t.membersCount}</span>
                          <span className="text-cyan-400 uppercase">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Create Team Form */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <span className="font-bold text-slate-400 block">Create New Team</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={e => setNewTeamName(e.target.value)}
                        placeholder="Team Name (e.g. Inbound Support)"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        value={newTeamDesc}
                        onChange={e => setNewTeamDesc(e.target.value)}
                        placeholder="Team Description"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddTeam}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create Team
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 5: Role Permissions Matrix */}
            {activeSubTab === 'permissions' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Role Permissions Matrix
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Enterprise Role-Based Access Control (RBAC) rules. Permissions map to database queries and UI components.
                </p>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px]">
                        <th className="px-4 py-3 font-bold uppercase">Permission Feature</th>
                        <th className="px-4 py-3 text-center">ADMIN</th>
                        <th className="px-4 py-3 text-center">MANAGER</th>
                        <th className="px-4 py-3 text-center">QA</th>
                        <th className="px-4 py-3 text-center">AGENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Upload / Process Audio logs</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Conduct QA checklists & Scorecards</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">View team-wide AI Coach dashboard</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-amber-500">Self Only</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Modify compliance prompts & rubrics</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Invite / Delete users and teams</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Export call analysis payloads to CRM</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: System Diagnostics & Gemini Settings */}
            {activeSubTab === 'diagnostics' && (
              <div className="space-y-6">
                
                {/* 6.1 Storage Usage */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Storage Allocation Usage
                  </h3>
                  <div className="glass p-5 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-300">Workspace Audio Files Storage</span>
                      <span className="font-mono text-slate-400">24.8 GB / 100.0 GB (24.8%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '24.8%' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 text-[10px] text-slate-500">
                      <div>
                        <span className="block font-bold text-slate-400">Total Audio Logs</span>
                        <span>1,832 recordings</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400">Average File Size</span>
                        <span>13.5 MB</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400">Storage Plan Limit</span>
                        <span>100 GB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6.2 API & Webhooks Settings */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    Webhooks & API Keys
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-400">Global Webhook URL Endpoint</label>
                      <div className="flex gap-2.5">
                        <input
                          type="text"
                          value={webhookUrl}
                          onChange={e => setWebhookUrl(e.target.value)}
                          className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block">Triggered automatically when a call audit or QA review is finalized.</span>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="font-semibold text-slate-400">CallPilot Developer API Key</label>
                      <div className="flex gap-2">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          disabled
                          className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-500 outline-none cursor-not-allowed font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 rounded-lg border border-white/5 cursor-pointer"
                        >
                          {showApiKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6.3 Gemini Settings */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-cyan-400" />
                    Gemini AI Model Configurations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-400">Default Audit LLM Model</label>
                      <select
                        value={geminiModel}
                        onChange={e => setGeminiModel(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended & Active)</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Quota Dependent)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-400">LLM Prompt Temperature</label>
                        <span className="font-mono text-cyan-400">{geminiTemp}</span>
                      </div>
                      <div className="pt-2">
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.1"
                          value={geminiTemp}
                          onChange={e => setGeminiTemp(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 7: Enterprise Admin Analytics */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Enterprise Usage Analytics
                </h3>

                {/* API Token Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Gemini API Cost (MTD)</span>
                    <span className="block text-lg font-bold text-white font-mono">$184.23</span>
                    <span className="text-[8px] text-green-400 font-semibold">12% decrease vs last month</span>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Total API Queries</span>
                    <span className="block text-lg font-bold text-white font-mono">14,832 calls</span>
                    <span className="text-[8px] text-cyan-400 font-semibold">99.98% success rate</span>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">User Active Sessions</span>
                    <span className="block text-lg font-bold text-white font-mono">94 sessions</span>
                    <span className="text-[8px] text-green-400 font-semibold">+8% increase this week</span>
                  </div>
                </div>

                {/* Team QA Statistics */}
                <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
                  <span className="font-bold text-slate-300 block">Team QA Score Performance</span>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Retention Team</span>
                        <span className="font-mono font-bold text-green-400">89.4% average</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '89.4%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>General Support</span>
                        <span className="font-mono font-bold text-amber-400">83.1% average</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '83.1%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Technical Assistance</span>
                        <span className="font-mono font-bold text-rose-400">77.5% average</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '77.5%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Delete Calls and Manage Data */}
            {activeSubTab === 'calls' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-cyan-400" />
                  Manage Call Recordings Data
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Permanently delete analyzed recordings to free up organization storage or fulfill customer data privacy requests. This deletes metadata, transcripts, and QA reports.
                </p>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px]">
                        <th className="px-4 py-3 font-semibold">Recording</th>
                        <th className="px-4 py-3 font-semibold">Duration</th>
                        <th className="px-4 py-3 font-semibold">File Size</th>
                        <th className="px-4 py-3 font-semibold text-center">QA Score</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {adminCalls.map(c => (
                        <tr key={c.id} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-2.5">
                            <span className="font-bold text-white block">{c.title}</span>
                            <span className="text-[9px] text-slate-500 font-mono">{c.filename}</span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-slate-400">{c.duration}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-400">{c.size}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                              {c.qaScore}%
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCall(c.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 9: Billing Settings & Plans */}
            {activeSubTab === 'billing' && (
              <div className="space-y-6">
                
                {/* Current Subscription Status & Usage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Status Card */}
                  <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Subscription Status
                    </span>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-black text-white block capitalize">
                          {billing.planName} Plan
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {billing.stripeCurrentPeriodEnd
                            ? `Renews on ${new Date(billing.stripeCurrentPeriodEnd).toLocaleDateString()}`
                            : 'Trial period active'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                        billing.planStatus === 'ACTIVE' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {billing.planStatus}
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isRedirecting}
                        onClick={handleManageBilling}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 font-bold py-2 rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isRedirecting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Manage Billing & Cancel
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Usage Card */}
                  <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Usage Limits & Quotas
                    </span>
                    
                    <div className="space-y-4">
                      {/* Metric 1: Call Volume */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                            Calls Volume
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {billing.usedCalls} / {billing.callLimit >= 999999 ? 'Unlimited' : `${billing.callLimit} calls`}
                            <span className="ml-1 text-[9px] text-slate-500 font-bold">
                              ({billing.callLimit >= 999999 ? '0' : Math.min(100, Math.round((billing.usedCalls / billing.callLimit) * 100))}% Used)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${billing.callLimit >= 999999 ? 0 : Math.min(100, Math.round((billing.usedCalls / billing.callLimit) * 100))}%`,
                              boxShadow: '0 0 6px rgba(6,182,212,0.5)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Metric 2: Storage */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5">
                            <HardDrive className="w-3.5 h-3.5 text-violet-400" />
                            Cloud Storage
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatBytes(billing.storageUsedBytes)} / {formatBytes(billing.storageLimit)}
                            <span className="ml-1 text-[9px] text-slate-500 font-bold">
                              ({Math.min(100, Math.round((billing.storageUsedBytes / billing.storageLimit) * 100))}% Used)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-violet-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.round((billing.storageUsedBytes / billing.storageLimit) * 100))}%`,
                              boxShadow: '0 0 6px rgba(139,92,246,0.5)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Metric 3: AI Requests */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Gemini AI Requests
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {billing.aiRequestsUsed} / {billing.aiRequestsLimit >= 999999 ? 'Unlimited' : `${billing.aiRequestsLimit} reqs`}
                            <span className="ml-1 text-[9px] text-slate-500 font-bold">
                              ({billing.aiRequestsLimit >= 999999 ? '0' : Math.min(100, Math.round((billing.aiRequestsUsed / billing.aiRequestsLimit) * 100))}% Used)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${billing.aiRequestsLimit >= 999999 ? 0 : Math.min(100, Math.round((billing.aiRequestsUsed / billing.aiRequestsLimit) * 100))}%`,
                              boxShadow: '0 0 6px rgba(245,158,11,0.5)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Metric 4: QA Agents */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            QA Agent Seats
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {billing.agentsUsed} / {billing.agentsLimit >= 999999 ? 'Unlimited' : `${billing.agentsLimit} seats`}
                            <span className="ml-1 text-[9px] text-slate-500 font-bold">
                              ({billing.agentsLimit >= 999999 ? '0' : Math.min(100, Math.round((billing.agentsUsed / billing.agentsLimit) * 100))}% Used)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${billing.agentsLimit >= 999999 ? 0 : Math.min(100, Math.round((billing.agentsUsed / billing.agentsLimit) * 100))}%`,
                              boxShadow: '0 0 6px rgba(16,185,129,0.5)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Metric 5: QA Reports */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                            QA Reports Generated
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {billing.reportsUsed} / {billing.reportsLimit >= 999999 ? 'Unlimited' : `${billing.reportsLimit} reports`}
                            <span className="ml-1 text-[9px] text-slate-500 font-bold">
                              ({billing.reportsLimit >= 999999 ? '0' : Math.min(100, Math.round((billing.reportsUsed / billing.reportsLimit) * 100))}% Used)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${billing.reportsLimit >= 999999 ? 0 : Math.min(100, Math.round((billing.reportsUsed / billing.reportsLimit) * 100))}%`,
                              boxShadow: '0 0 6px rgba(244,63,94,0.5)',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <span className="block text-[9px] text-slate-500 leading-normal border-t border-white/5 pt-2">
                      Usage resets monthly. Upgrade plan to expand limits immediately.
                    </span>
                  </div>

                </div>

                {/* Plans Selection Grid */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Available Subscription Plans
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Starter */}
                    <div
                      onClick={() => setSelectedPlan('starter')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                        selectedPlan === 'starter' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {billing.planName.toLowerCase() === 'starter' && (
                        <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-bl uppercase tracking-wider">Current</div>
                      )}
                      <div>
                        <span className="block font-bold text-white text-sm">Starter</span>
                        <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$49<span className="text-[10px] font-normal">/mo</span></span>
                      </div>
                      <span className="block text-[9px] text-slate-500 mt-4 leading-relaxed">Up to 100 calls/mo • Basic QA Auditing • Standard AI Reports</span>
                    </div>

                    {/* Growth */}
                    <div
                      onClick={() => setSelectedPlan('growth')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                        selectedPlan === 'growth' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {billing.planName.toLowerCase() === 'growth' && (
                        <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-bl uppercase tracking-wider">Current</div>
                      )}
                      <div>
                        <span className="block font-bold text-white text-sm">Growth</span>
                        <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$129<span className="text-[10px] font-normal">/mo</span></span>
                      </div>
                      <span className="block text-[9px] text-slate-500 mt-4 leading-relaxed">Up to 500 calls/mo • CRM Integration • Soft Skills Coaching</span>
                    </div>

                    {/* Business */}
                    <div
                      onClick={() => setSelectedPlan('business')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                        selectedPlan === 'business' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {billing.planName.toLowerCase() === 'business' && (
                        <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-bl uppercase tracking-wider">Current</div>
                      )}
                      <div>
                        <span className="block font-bold text-white text-sm">Business</span>
                        <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$299<span className="text-[10px] font-normal">/mo</span></span>
                      </div>
                      <span className="block text-[9px] text-slate-500 mt-4 leading-relaxed">Up to 2,500 calls/mo • Custom QA Rubrics • Premium Analytics</span>
                    </div>

                    {/* Enterprise */}
                    <div
                      onClick={() => setSelectedPlan('enterprise')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                        selectedPlan === 'enterprise' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {billing.planName.toLowerCase() === 'enterprise' && (
                        <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-bl uppercase tracking-wider">Current</div>
                      )}
                      <div>
                        <span className="block font-bold text-white text-sm">Enterprise</span>
                        <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$999<span className="text-[10px] font-normal">/mo</span></span>
                      </div>
                      <span className="block text-[9px] text-slate-500 mt-4 leading-relaxed">Unlimited calls • Dedicated BPO Support • Full AI Models Control</span>
                    </div>

                  </div>

                  {/* Pricing Actions */}
                  {selectedPlan !== billing.planName.toLowerCase() && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        disabled={isRedirecting}
                        onClick={handleUpgradeOrCheckout}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
                      >
                        {isRedirecting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <ArrowRight className="w-3.5 h-3.5" />
                            Upgrade to {selectedPlan.toUpperCase()} Plan
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Billing History */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <span className="font-bold text-slate-300 block">Billing Invoice History</span>
                  <div className="glass rounded-xl border border-white/5 overflow-hidden">
                    {billing.paymentHistories.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-[10px]">
                        No payment history logs registered.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px]">
                            <th className="px-4 py-2.5">Invoice ID</th>
                            <th className="px-4 py-2.5">Billing Date</th>
                            <th className="px-4 py-2.5">Amount</th>
                            <th className="px-4 py-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[10px]">
                          {billing.paymentHistories.map(b => (
                            <tr key={b.invoice}>
                              <td className="px-4 py-2.5 font-bold text-white truncate max-w-[120px]">{b.invoice}</td>
                              <td className="px-4 py-2.5 text-slate-400">{b.date}</td>
                              <td className="px-4 py-2.5 text-slate-400">{b.amount}</td>
                              <td className="px-4 py-2.5 text-center">
                                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-[8px] font-bold">
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ── Developer: API Keys Tab ────────────────────────── */}
            {activeSubTab === 'developer' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-cyan-400" />
                    API Key Management
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Generate API keys for external integrations. Keys are stored as secure hashes — the full key is shown only once upon creation.
                  </p>
                </div>

                {/* Usage Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Keys', value: apiKeys.length, icon: Key, color: 'text-slate-400' },
                    { label: 'Active', value: apiKeys.filter(k => !k.isRevoked && (!k.expiresAt || new Date(k.expiresAt) > new Date())).length, icon: Zap, color: 'text-emerald-400' },
                    { label: 'Revoked', value: apiKeys.filter(k => k.isRevoked).length, icon: Shield, color: 'text-rose-400' },
                    { label: 'Expired', value: apiKeys.filter(k => !k.isRevoked && k.expiresAt && new Date(k.expiresAt) < new Date()).length, icon: Clock, color: 'text-amber-400' },
                  ].map(stat => (
                    <div key={stat.label} className="glass rounded-xl border border-white/5 p-3 flex flex-col gap-1">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      <span className="text-lg font-black text-white">{stat.value}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Active Keys Table */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keys ({apiKeys.length})</h4>
                  {apiKeys.length === 0 ? (
                    <div className="glass rounded-xl border border-white/5 p-8 text-center">
                      <Key className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-500 text-[10px]">No API keys yet. Generate your first key below.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {apiKeys.map(k => {
                        const status = getKeyStatus(k)
                        const isExpanded = expandedKeyId === k.id
                        const logs = auditLogs[k.id] ?? []

                        return (
                          <div key={k.id} className="glass rounded-xl border border-white/5 overflow-hidden">
                            {/* Key Row */}
                            <div className="flex items-center gap-3 px-4 py-3">
                              {/* Name + prefix */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white">{k.name}</span>
                                  <span
                                    className="px-1.5 py-0.5 rounded text-[9px] font-bold border"
                                    style={{ background: status.bg, borderColor: status.border, color: status.color }}
                                  >
                                    {status.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                  <code className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                                    {k.keyPrefix}••••••••••••••••
                                  </code>
                                  <span className="text-[9px] text-slate-500">{k.rateLimitRpm} req/min</span>
                                  {k.lastUsedAt && (
                                    <span className="text-[9px] text-slate-500">
                                      Last used {new Date(k.lastUsedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                  {k.expiresAt && (
                                    <span className="text-[9px] text-slate-500">
                                      Expires {new Date(k.expiresAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {/* Scopes */}
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {k.scopes.map(scope => (
                                    <span key={scope} className="text-[8px] font-bold bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-1.5 py-0.5 rounded">
                                      {scope}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleAuditLog(k.id)}
                                  className="text-[9px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  {loadingAudit === k.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : isExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                  Logs ({k.auditLogCount})
                                </button>
                                {!k.isRevoked && (
                                  <button
                                    type="button"
                                    onClick={() => handleRegenerateKey(k.id, k.name)}
                                    title="Regenerate"
                                    className="text-[9px] font-bold text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Regen
                                  </button>
                                )}
                                {!k.isRevoked && (
                                  <button
                                    type="button"
                                    onClick={() => handleRevokeKey(k.id, k.name)}
                                    title="Revoke Key"
                                    className="text-[9px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Audit Log Drawer */}
                            {isExpanded && (
                              <div className="border-t border-white/5 bg-slate-950/40 px-4 py-3">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Audit Log</p>
                                {loadingAudit === k.id ? (
                                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                                  </div>
                                ) : logs.length === 0 ? (
                                  <p className="text-slate-600 text-[10px] italic">No audit entries yet.</p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {logs.map(log => {
                                      const ls = getAuditActionStyle(log.action)
                                      return (
                                        <div key={log.id} className="flex items-start gap-2.5">
                                          <span
                                            className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold border"
                                            style={{ background: ls.bg, borderColor: ls.border, color: ls.color }}
                                          >
                                            {log.action}
                                          </span>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-slate-300 truncate">{log.details ?? '—'}</p>
                                            <div className="flex items-center gap-2 text-[9px] text-slate-500 mt-0.5">
                                              <Clock className="w-2.5 h-2.5" />
                                              {new Date(log.createdAt).toLocaleString()}
                                              {log.ipAddress && <span>· {log.ipAddress}</span>}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Generate New API Key Form */}
                {isOwnerOrAdmin ? (
                  <form onSubmit={handleGenerateKey} className="bg-slate-950/40 border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                      Generate New API Key
                    </h4>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Name</label>
                      <input
                        type="text"
                        required
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                        placeholder="e.g. Production Integration, Staging Bot"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs"
                      />
                    </div>

                    {/* Scopes */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Permission Scopes</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {API_SCOPES.map(scope => {
                          const isSelected = newKeyScopes.includes(scope.id)
                          return (
                            <button
                              key={scope.id}
                              type="button"
                              onClick={() => handleScopeToggle(scope.id)}
                              className={`flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                                  : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/5'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 text-slate-950" />}
                              </div>
                              <div>
                                <p className="text-[10px] font-bold leading-none">{scope.label}</p>
                                <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">{scope.description}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Rate Limit + Expiry */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rate Limit (req/min)</label>
                        <select
                          value={newKeyRpm}
                          onChange={e => setNewKeyRpm(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs"
                        >
                          <option value={60}>60 req/min</option>
                          <option value={120}>120 req/min</option>
                          <option value={300}>300 req/min</option>
                          <option value={600}>600 req/min</option>
                          <option value={1200}>1200 req/min</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date (optional)</label>
                        <input
                          type="date"
                          value={newKeyExpiry}
                          onChange={e => setNewKeyExpiry(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-300/80 leading-relaxed">
                        The full API key will be shown <strong>once only</strong> after generation. Store it in a secure vault — it cannot be retrieved later.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isGeneratingKey || newKeyScopes.length === 0}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        {isGeneratingKey ? (
                          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                        ) : (
                          <><Key className="w-3.5 h-3.5" /> Generate Key</>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-xl text-slate-500 text-[10px] text-center italic">
                    Only organization administrators can manage API keys.
                  </div>
                )}
              </div>
            )}

            {/* ── One-Time Key Reveal Modal ──────────────────────── */}
            {revealedKey && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Key className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm">Your API Key — "{revealedKey.name}"</h3>
                      <p className="text-[10px] text-slate-500">Copy this key now. It will never be shown again.</p>
                    </div>
                  </div>

                  {/* Key display */}
                  <div className="bg-slate-950 border border-white/10 rounded-xl p-4 space-y-3">
                    <code className="block break-all font-mono text-xs text-cyan-300 leading-relaxed select-all">
                      {revealedKey.raw}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(revealedKey.raw)}
                      className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        keyCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      }`}
                    >
                      {keyCopied ? (
                        <><Check className="w-3.5 h-3.5" /> Copied to Clipboard!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy API Key</>
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-300/80 leading-relaxed">
                      This key will not be retrievable once you dismiss this dialog. Store it in a password manager or secrets vault immediately.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRevealedKey(null)}
                    className="w-full py-2.5 rounded-lg font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    I've saved the key — Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

          </form>
          )} {/* end activeSubTab !== 'branding' conditional */}
        </div>

      </div>

    </div>
  )
}

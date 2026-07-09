'use client'

import { useState } from 'react'
import {
  Plug,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Settings,
  Zap,
  RefreshCw,
  X,
  ChevronRight,
  Activity,
  ArrowRight,
  Save,
  Eye,
  EyeOff,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import {
  INTEGRATION_REGISTRY,
  TRIGGER_LABELS,
  type IntegrationDefinition,
  type TriggerEvent,
} from '@/lib/integrations/registry'
import {
  createIntegrationAction,
  updateIntegrationAction,
  deleteIntegrationAction,
  toggleIntegrationAction,
  testIntegrationAction,
  type IntegrationRow,
} from '@/actions/integrations'

// ─── Provider Icon Components ────────────────────────────────────────────────

function ProviderIcon({ provider, size = 28 }: { provider: string; size?: number }) {
  const s = size
  switch (provider) {
    case 'HUBSPOT':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M14.936 7.623V5.461a1.682 1.682 0 0 0 .972-1.525V3.87a1.685 1.685 0 0 0-3.37 0v.066a1.682 1.682 0 0 0 .972 1.525v2.162c-.924.143-1.766.537-2.455 1.11L4.89 5.12a1.872 1.872 0 1 0-.918 1.472l5.998 3.99a5.61 5.61 0 0 0-.627 2.586 5.63 5.63 0 0 0 .873 3.026l-1.822 1.822a1.514 1.514 0 1 0 1.06 1.06l1.82-1.82a5.641 5.641 0 1 0 3.662-9.633z" fill="#FF7A59"/>
        </svg>
      )
    case 'SALESFORCE':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M10.003 4.5C11.2 4.5 12.31 5 13.13 5.8a4.002 4.002 0 0 1 5.57 3.7 3.5 3.5 0 0 1-.5 6.97H5.5A3.5 3.5 0 0 1 5.5 10a3.498 3.498 0 0 1 1.47-2.83A4.001 4.001 0 0 1 10.003 4.5z" fill="#00A1E0"/>
        </svg>
      )
    case 'SLACK':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
          <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
          <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#36C5F0"/>
          <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
          <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
          <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
          <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#ECB22E"/>
          <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
        </svg>
      )
    case 'TEAMS':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M15.75 0a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5z" fill="#5059C9"/>
          <path d="M11 8h10a1 1 0 0 1 1 1v6.5A5.5 5.5 0 0 1 16.5 21a5.5 5.5 0 0 1-5.5-5.5V9a1 1 0 0 1 1-1z" fill="#5059C9"/>
          <path d="M9.25 2a4.25 4.25 0 1 1 0 8.5 4.25 4.25 0 0 1 0-8.5z" fill="#7B83EB"/>
          <path d="M3 10.5h12.5a1 1 0 0 1 1 1V18A6.5 6.5 0 0 1 10 24.5 6.5 6.5 0 0 1 3.5 18v-7a1 1 0 0 1 1-1H3z" fill="#7B83EB"/>
          <path opacity=".1" d="M9.75 10.5v9.25a.75.75 0 0 1-.75.75H4.1A6.5 6.5 0 0 1 3.5 18v-6.5a1 1 0 0 1 1-1h5.25z" fill="#000"/>
          <path opacity=".2" d="M9.25 10.5v9.75a.75.75 0 0 1-.75.75H4.56A6.5 6.5 0 0 1 3.5 18v-6.5a1 1 0 0 1 1-1h4.75z" fill="#000"/>
          <path d="M3.5 10.5h12a.5.5 0 0 1 .5.5v7A6.5 6.5 0 0 1 9.5 24.5 6.5 6.5 0 0 1 3 18v-7a.5.5 0 0 1 .5-.5z" fill="url(#teams_a)"/>
          <defs>
            <linearGradient id="teams_a" x1="5" y1="10" x2="16" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5961C3"/>
              <stop offset="1" stopColor="#4040B5"/>
            </linearGradient>
          </defs>
        </svg>
      )
    case 'ZAPIER':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4l2.5 5H17l-4 3 1.5 5L12 14.5 7.5 17l1.5-5L5 9h2.5L12 4z" fill="#FF4A00"/>
        </svg>
      )
    case 'WEBHOOK':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" fill="#06B6D4"/>
        </svg>
      )
    default:
      return <Plug width={s} height={s} className="text-slate-400" />
  }
}

// ─── Status helpers ──────────────────────────────────────────────────────────

function getStatusStyle(status: string) {
  switch (status) {
    case 'CONNECTED':    return { color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' }
    case 'ERROR':        return { color: '#fca5a5', bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)' }
    case 'PENDING':      return { color: '#fcd34d', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' }
    default:             return { color: '#94a3b8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }
  }
}

function StatusDot({ status }: { status: string }) {
  const s = getStatusStyle(status)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {status}
    </span>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface IntegrationsPageProps {
  initialIntegrations: IntegrationRow[]
  currentUserRole: string
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function IntegrationsPage({ initialIntegrations, currentUserRole }: IntegrationsPageProps) {
  const [integrations, setIntegrations] = useState<IntegrationRow[]>(initialIntegrations)
  const [selectedDef, setSelectedDef] = useState<IntegrationDefinition | null>(null)
  const [drawerMode, setDrawerMode] = useState<'configure' | 'create'>('create')

  // Config drawer state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [configValues, setConfigValues] = useState<Record<string, string>>({})
  const [keyName, setKeyName] = useState('')
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isAdmin = ['ADMIN', 'OWNER'].includes(currentUserRole)

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getExistingForProvider = (provider: string) =>
    integrations.filter(i => i.provider === provider)

  const openCreateDrawer = (def: IntegrationDefinition) => {
    setSelectedDef(def)
    setDrawerMode('create')
    setEditingId(null)
    setKeyName(`My ${def.name}`)
    setConfigValues({})
    setTestResult(null)
    setShowSecrets({})
  }

  const openConfigDrawer = (integration: IntegrationRow) => {
    const def = INTEGRATION_REGISTRY.find(d => d.provider === integration.provider)
    if (!def) return
    setSelectedDef(def)
    setDrawerMode('configure')
    setEditingId(integration.id)
    setKeyName(integration.name)
    setConfigValues(integration.config)
    setTestResult(null)
    setShowSecrets({})
  }

  const closeDrawer = () => {
    setSelectedDef(null)
    setEditingId(null)
    setTestResult(null)
  }

  const handleSave = async () => {
    if (!selectedDef) return
    setIsSaving(true)
    try {
      if (drawerMode === 'create') {
        const res = await createIntegrationAction({
          provider: selectedDef.provider,
          name: keyName,
          config: configValues,
        })
        if (res.error) { alert(res.error); return }
        if (res.integration) setIntegrations(prev => [...prev, res.integration!])
        closeDrawer()
      } else if (editingId) {
        const res = await updateIntegrationAction(editingId, {
          name: keyName,
          config: configValues,
        })
        if (res.error) { alert(res.error); return }
        if (res.integration) {
          setIntegrations(prev => prev.map(i => i.id === editingId ? res.integration! : i))
        }
        closeDrawer()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    if (!editingId) return
    setIsTesting(true)
    setTestResult(null)
    try {
      const res = await testIntegrationAction(editingId)
      setTestResult({ success: res.success, message: res.message })
      if (res.success) {
        setIntegrations(prev => prev.map(i => i.id === editingId ? { ...i, status: 'CONNECTED' } : i))
      } else {
        setIntegrations(prev => prev.map(i => i.id === editingId ? { ...i, status: 'ERROR', errorMessage: res.message } : i))
      }
    } finally {
      setIsTesting(false)
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    try {
      const res = await toggleIntegrationAction(id, !current)
      if (!res.error && res.integration) {
        setIntegrations(prev => prev.map(i => i.id === id ? res.integration! : i))
      }
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove integration "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await deleteIntegrationAction(id)
      if (res.success) {
        setIntegrations(prev => prev.filter(i => i.id !== id))
        if (editingId === id) closeDrawer()
      } else {
        alert(res.error)
      }
    } finally {
      setDeletingId(null)
    }
  }

  // ── Simulated activity log ───────────────────────────────────────────────
  const activityLog = integrations.slice(0, 5).map(i => ({
    id: i.id,
    provider: i.provider,
    name: i.name,
    event: i.status === 'CONNECTED' ? 'Connection established' : 'Disconnected',
    time: i.updatedAt,
    status: i.status,
  }))

  // ─── Category sections ───────────────────────────────────────────────────
  const categories: { label: string; defs: IntegrationDefinition[] }[] = [
    { label: 'CRM', defs: INTEGRATION_REGISTRY.filter(d => d.category === 'CRM') },
    { label: 'Messaging', defs: INTEGRATION_REGISTRY.filter(d => d.category === 'MESSAGING') },
    { label: 'Automation & Webhooks', defs: INTEGRATION_REGISTRY.filter(d => d.category === 'AUTOMATION' || d.category === 'WEBHOOK') },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Plug className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Integrations</h1>
            <p className="text-[10px] text-slate-500 mt-0.5">Connect CallPilot to your existing tools and workflows</p>
          </div>
        </div>

        {/* Summary badges */}
        <div className="hidden sm:flex items-center gap-2">
          {[
            { label: 'Connected', count: integrations.filter(i => i.status === 'CONNECTED').length, color: '#6ee7b7' },
            { label: 'Installed', count: integrations.length, color: '#818cf8' },
          ].map(b => (
            <div key={b.label} className="glass px-3 py-1.5 rounded-xl border border-white/5 text-center">
              <div className="text-base font-black" style={{ color: b.color }}>{b.count}</div>
              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Categories */}
      {categories.map(cat => (
        <div key={cat.label} className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-0.5">{cat.label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.defs.map(def => {
              const existing = getExistingForProvider(def.provider)
              const isInstalled = existing.length > 0
              const primaryIntegration = existing[0]

              return (
                <div
                  key={def.provider}
                  className="glass rounded-2xl border border-white/5 p-5 flex flex-col gap-4 transition-all duration-200 hover:border-white/10 group"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def.iconBg} flex items-center justify-center shadow-lg`}>
                        <ProviderIcon provider={def.provider} size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{def.name}</span>
                          {def.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-500/15 border border-cyan-500/25 text-cyan-400">
                              {def.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{def.category}</span>
                      </div>
                    </div>

                    {isInstalled && primaryIntegration && (
                      <StatusDot status={primaryIntegration.status} />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-slate-400 leading-relaxed flex-1">{def.description}</p>

                  {/* Trigger chips */}
                  <div className="flex flex-wrap gap-1">
                    {def.supportedTriggers.slice(0, 3).map(t => (
                      <span key={t} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/15 text-indigo-300">
                        {TRIGGER_LABELS[t]}
                      </span>
                    ))}
                    {def.supportedTriggers.length > 3 && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500">
                        +{def.supportedTriggers.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Installed instances */}
                  {existing.length > 0 && (
                    <div className="space-y-1.5">
                      {existing.map(inst => (
                        <div key={inst.id} className="flex items-center gap-2 bg-slate-950/40 border border-white/5 rounded-lg px-2.5 py-1.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-white truncate">{inst.name}</p>
                            {inst.lastSyncAt && (
                              <p className="text-[9px] text-slate-500 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                Synced {new Date(inst.lastSyncAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggle(inst.id, inst.isEnabled)}
                              disabled={togglingId === inst.id || !isAdmin}
                              className="cursor-pointer text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                              title={inst.isEnabled ? 'Disable' : 'Enable'}
                            >
                              {togglingId === inst.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : inst.isEnabled ? (
                                <ToggleRight className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-slate-500" />
                              )}
                            </button>
                            {/* Configure */}
                            <button
                              type="button"
                              onClick={() => openConfigDrawer(inst)}
                              className="cursor-pointer text-slate-400 hover:text-white transition-colors"
                              title="Configure"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDelete(inst.id, inst.name)}
                                disabled={deletingId === inst.id}
                                className="cursor-pointer text-slate-600 hover:text-rose-400 transition-colors disabled:opacity-50"
                                title="Remove"
                              >
                                {deletingId === inst.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => openCreateDrawer(def)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isInstalled
                            ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white'
                            : `bg-gradient-to-r ${def.iconBg} text-white shadow hover:opacity-90`
                        }`}
                      >
                        {isInstalled ? (
                          <><Plug className="w-3 h-3" /> Add Another</>
                        ) : (
                          <><Zap className="w-3 h-3" /> Connect</>
                        )}
                      </button>
                    )}
                    <a
                      href={def.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-500 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> Docs
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Event Routing Reference Panel */}
      <div className="glass rounded-2xl border border-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Event Routing
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Events that can trigger your connected integrations</p>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            Configuration coming soon
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(Object.entries(TRIGGER_LABELS) as [TriggerEvent, string][]).map(([event, label]) => (
              <div
                key={event}
                className="flex items-center gap-2.5 bg-slate-950/40 border border-white/5 rounded-xl px-3 py-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-white">{label}</p>
                  <p className="text-[9px] text-slate-600 font-mono">{event}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
              </div>
            ))}
        </div>
      </div>

      {/* Activity Log */}
      {activityLog.length > 0 && (
        <div className="glass rounded-2xl border border-white/5 p-6 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Activity
          </h2>
          <div className="space-y-1.5">
            {activityLog.map(entry => {
              const s = getStatusStyle(entry.status)
              return (
                <div key={entry.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-950/30 border border-white/[0.03]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <ProviderIcon provider={entry.provider} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white">{entry.name}</p>
                    <p className="text-[9px] text-slate-500">{entry.event}</p>
                  </div>
                  <span className="text-[9px] text-slate-600 shrink-0">
                    {new Date(entry.time).toLocaleDateString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Config / Create Drawer ────────────────────────────────── */}
      {selectedDef && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-white/10 flex flex-col shadow-2xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedDef.iconBg} flex items-center justify-center shadow`}>
                  <ProviderIcon provider={selectedDef.provider} size={20} />
                </div>
                <div>
                  <h2 className="font-black text-white text-sm">{selectedDef.name}</h2>
                  <p className="text-[9px] text-slate-500">{drawerMode === 'create' ? 'New Connection' : 'Configure'}</p>
                </div>
              </div>
              <button type="button" onClick={closeDrawer} className="text-slate-500 hover:text-white cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Description */}
              <p className="text-[11px] text-slate-400 leading-relaxed">{selectedDef.longDescription}</p>

              {/* Name field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  placeholder={`My ${selectedDef.name}`}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Config fields from registry */}
              {selectedDef.configFields.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">Configuration</h3>
                  {selectedDef.configFields.map(field => {
                    const isSecret = field.type === 'password'
                    const isShown = showSecrets[field.key]

                    return (
                      <div key={field.key} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-rose-400">*</span>}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            value={configValues[field.key] ?? ''}
                            onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors"
                          >
                            <option value="">Select…</option>
                            {field.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <input
                              type={isSecret && !isShown ? 'password' : 'text'}
                              value={configValues[field.key] ?? ''}
                              onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors pr-8"
                            />
                            {isSecret && (
                              <button
                                type="button"
                                onClick={() => setShowSecrets(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                              >
                                {isShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        )}

                        {field.hint && (
                          <p className="text-[9px] text-slate-600 leading-relaxed">{field.hint}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Supported triggers */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">Supported Triggers</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDef.supportedTriggers.map(t => (
                    <span key={t} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-300">
                      {TRIGGER_LABELS[t]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Test result */}
              {testResult && (
                <div className={`flex items-start gap-2 p-3 rounded-xl border ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-500/20'
                }`}>
                  {testResult.success
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className="text-[10px] font-bold" style={{ color: testResult.success ? '#6ee7b7' : '#fca5a5' }}>
                      {testResult.success ? 'Connection successful (simulated)' : 'Connection failed'}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{testResult.message}</p>
                  </div>
                </div>
              )}

              {/* Docs link */}
              <a
                href={selectedDef.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View {selectedDef.name} Documentation
              </a>
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-white/5 space-y-2">
              {drawerMode === 'configure' && editingId && (
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing…</>
                  ) : (
                    <><RefreshCw className="w-3.5 h-3.5" /> Test Connection</>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isAdmin}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 bg-gradient-to-r ${selectedDef.iconBg} text-white shadow hover:opacity-90`}
              >
                {isSaving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> {drawerMode === 'create' ? 'Save Integration' : 'Update Configuration'}</>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import {
  Palette,
  Globe,
  Mail,
  ImageIcon,
  Save,
  Loader2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Eye,
  Sparkles,
  Building2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import {
  updateOrgBrandingAction,
  resetOrgBrandingAction,
} from '@/actions/branding'
import type { OrgBranding } from '@/lib/branding'
import {
  isValidHexColor,
  effectiveBrandColor,
  effectiveBrandName,
  darkenHexColor,
  DEFAULT_BRAND_COLOR,
  DEFAULT_BRAND_COLOR_DARK,
} from '@/lib/branding'
import { isValidDomain } from '@/lib/custom-domain'

// ─── Props ────────────────────────────────────────────────────────────────────

interface BrandingPanelProps {
  initialBranding: OrgBranding
  currentUserRole: string
}

// ─── Mini Sidebar Preview ─────────────────────────────────────────────────────

function SidebarPreview({
  brandName,
  brandColor,
  brandColorDark,
  brandLogoUrl,
}: {
  brandName: string
  brandColor: string
  brandColorDark: string
  brandLogoUrl: string
}) {
  const initials = brandName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase() || 'CP'

  const navItems = ['Overview', 'Call History', 'AI Coach', 'QA Grading', 'Reports']

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none"
      style={{ background: 'rgba(10,17,40,0.95)', width: 200 }}
    >
      {/* Sidebar header */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {brandLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brandLogoUrl}
              alt="Logo"
              className="w-7 h-7 rounded-lg object-contain"
              style={{ background: brandColor }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[9px] font-black"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
                boxShadow: `0 0 10px ${brandColor}60`,
              }}
            >
              {initials}
            </div>
          )}
          <div>
            <div className="text-[10px] font-bold text-white leading-none">{brandName}</div>
          </div>
        </div>
      </div>

      {/* Workspace badge */}
      <div className="px-2 py-1.5">
        <div
          className="px-2.5 py-1.5 rounded-lg"
          style={{ background: `${brandColor}14`, border: `1px solid ${brandColor}26` }}
        >
          <div className="text-[7px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#475569' }}>
            Workspace
          </div>
          <div className="text-[9px] font-bold text-slate-300 truncate">My Organization</div>
        </div>
      </div>

      {/* Nav items */}
      <div className="px-2 pb-2 space-y-0.5">
        {navItems.map((item, i) => {
          const isActive = i === 0
          return (
            <div
              key={item}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-semibold"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${brandColor}40, ${brandColorDark}26)`
                  : 'transparent',
                color: isActive ? '#c4b5fd' : '#64748b',
                border: isActive ? `1px solid ${brandColor}4d` : '1px solid transparent',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: isActive ? brandColor : '#334155' }}
              />
              {item}
            </div>
          )
        })}
      </div>

      {/* User chip */}
      <div className="p-2 border-t border-white/5">
        <div className="flex items-center gap-2 px-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold shrink-0"
            style={{
              background: `linear-gradient(135deg, ${brandColor}, ${brandColorDark})`,
              boxShadow: `0 0 8px ${brandColor}66`,
            }}
          >
            AD
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-300">Admin User</div>
            <div className="text-[7px] text-slate-600 uppercase tracking-wide">ADMIN</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BrandingPanel({ initialBranding, currentUserRole }: BrandingPanelProps) {
  const isAdmin = ['ADMIN', 'OWNER'].includes(currentUserRole)

  // ── Form State ────────────────────────────────────────────────────────────
  const [brandName,       setBrandName]       = useState(initialBranding.brandName       ?? '')
  const [brandLogoUrl,    setBrandLogoUrl]    = useState(initialBranding.brandLogoUrl    ?? '')
  const [brandColor,      setBrandColor]      = useState(initialBranding.brandColor      ?? DEFAULT_BRAND_COLOR)
  const [brandColorDark,  setBrandColorDark]  = useState(initialBranding.brandColorDark  ?? '')
  const [emailFromName,   setEmailFromName]   = useState(initialBranding.emailFromName   ?? '')
  const [emailFooterText, setEmailFooterText] = useState(initialBranding.emailFooterText ?? '')
  const [customDomain,    setCustomDomain]    = useState(initialBranding.customDomain    ?? '')

  // ── UI State ──────────────────────────────────────────────────────────────
  const [isSaving,   setIsSaving]   = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [savedOk,    setSavedOk]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [copied,     setCopied]     = useState(false)

  // ── Derived preview values ────────────────────────────────────────────────
  const previewColor     = isValidHexColor(brandColor) ? brandColor : DEFAULT_BRAND_COLOR
  const previewColorDark = (brandColorDark && isValidHexColor(brandColorDark))
    ? brandColorDark
    : darkenHexColor(previewColor, 20)
  const previewName  = brandName.trim() || 'CallPilot.AI'

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!isAdmin) return
    setError(null)
    setSavedOk(false)
    setIsSaving(true)
    try {
      const res = await updateOrgBrandingAction({
        brandName:       brandName.trim()       || null,
        brandLogoUrl:    brandLogoUrl.trim()    || null,
        brandColor:      isValidHexColor(brandColor) ? brandColor : null,
        brandColorDark:  (brandColorDark && isValidHexColor(brandColorDark)) ? brandColorDark : null,
        emailFromName:   emailFromName.trim()   || null,
        emailFooterText: emailFooterText.trim() || null,
        customDomain:    customDomain.trim()    || null,
      })
      if (res.error) { setError(res.error); return }
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3000)
      // Reload to apply new CSS vars injected by layout
      setTimeout(() => window.location.reload(), 600)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!isAdmin) return
    if (!confirm('Reset all branding to CallPilot defaults? This cannot be undone.')) return
    setIsResetting(true)
    try {
      const res = await resetOrgBrandingAction()
      if (res.error) { setError(res.error); return }
      setBrandName('')
      setBrandLogoUrl('')
      setBrandColor(DEFAULT_BRAND_COLOR)
      setBrandColorDark('')
      setEmailFromName('')
      setEmailFooterText('')
      setCustomDomain('')
      setTimeout(() => window.location.reload(), 400)
    } finally {
      setIsResetting(false)
    }
  }

  const handleColorPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandColor(e.target.value)
  }, [])

  const copyDnsTxt = useCallback(() => {
    const txt = `_callpilot-verify.${customDomain || 'yourdomain.com'}`
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [customDomain])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-black text-white tracking-tight">White Label Branding</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Customize your organization's look, feel, and email communications
          </p>
        </div>
      </div>

      {/* Error / Success banners */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-rose-300">{error}</p>
        </div>
      )}
      {savedOk && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-300">Branding saved successfully. Reloading dashboard…</p>
        </div>
      )}

      {/* Two-column layout: form + live preview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">

        {/* ── Form ── */}
        <div className="space-y-5">

          {/* ─ Identity ─ */}
          <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Identity
            </h3>

            {/* Brand Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">
                Brand Name
                <span className="text-slate-600 font-normal ml-2">Replaces "CallPilot.AI" in the sidebar</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="CallPilot.AI"
                maxLength={80}
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Logo URL */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Logo URL
                <span className="text-slate-600 font-normal">Public image URL (PNG/SVG, ≤ 80×80px recommended)</span>
              </label>
              <input
                type="url"
                value={brandLogoUrl}
                onChange={(e) => setBrandLogoUrl(e.target.value)}
                placeholder="https://cdn.yourcompany.com/logo.png"
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              />
              {brandLogoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brandLogoUrl}
                  alt="Logo preview"
                  className="mt-2 h-10 w-auto rounded-lg border border-white/10 object-contain p-1"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
            </div>
          </div>

          {/* ─ Colors ─ */}
          <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Brand Color
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary color */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">
                  Primary Color
                  <span className="text-rose-400 ml-1">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewColor}
                    onChange={handleColorPick}
                    disabled={!isAdmin}
                    className="w-9 h-9 rounded-lg border border-white/10 cursor-pointer bg-transparent disabled:opacity-50"
                    title="Pick brand color"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    placeholder="#4f46e5"
                    maxLength={7}
                    disabled={!isAdmin}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 font-mono"
                  />
                </div>
                {brandColor && !isValidHexColor(brandColor) && (
                  <p className="text-[9px] text-rose-400">Must be a valid hex color (e.g. #4f46e5)</p>
                )}
              </div>

              {/* Dark variant */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">
                  Dark Variant
                  <span className="text-slate-600 font-normal ml-2">Auto-derived if empty</span>
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg border border-white/10 shrink-0"
                    style={{ background: previewColorDark }}
                  />
                  <input
                    type="text"
                    value={brandColorDark}
                    onChange={(e) => setBrandColorDark(e.target.value)}
                    placeholder={previewColorDark}
                    maxLength={7}
                    disabled={!isAdmin}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Color preview swatch */}
            <div
              className="h-8 rounded-xl w-full"
              style={{
                background: `linear-gradient(135deg, ${previewColor}, ${previewColorDark})`,
                boxShadow: `0 0 20px ${previewColor}50`,
              }}
            />

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[9px] text-slate-500 leading-relaxed">
                The primary color replaces the default indigo palette across the sidebar, active navigation indicators, avatar gradients, and glow effects. Changes apply dashboard-wide after save.
              </p>
            </div>
          </div>

          {/* ─ Email ─ */}
          <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Branding
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">
                From Name
                <span className="text-slate-600 font-normal ml-2">Shown in the email "From" field</span>
              </label>
              <input
                type="text"
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                placeholder="CallPilot Support"
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">
                Email Footer Text
                <span className="text-slate-600 font-normal ml-2">Appended to all notification emails</span>
              </label>
              <textarea
                value={emailFooterText}
                onChange={(e) => setEmailFooterText(e.target.value)}
                placeholder="© 2026 Acme Corp. All rights reserved."
                rows={3}
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          {/* ─ Custom Domain ─ */}
          <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Custom Domain
              </h3>
              <span className="text-[8px] font-bold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Architecture Only
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">Domain</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="app.yourcompany.com"
                disabled={!isAdmin}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              />
              {customDomain && !isValidDomain(customDomain) && (
                <p className="text-[9px] text-rose-400">Must be a valid domain (e.g. app.yourcompany.com)</p>
              )}
            </div>

            {/* Verification status */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-white/5">
              {initialBranding.customDomainVerified ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <p className="text-[9px] text-emerald-400 font-bold">Domain verified</p>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <p className="text-[9px] text-slate-500">Not yet verified</p>
                </>
              )}
            </div>

            {/* DNS record box */}
            {customDomain && isValidDomain(customDomain) && (
              <div className="space-y-2">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Required DNS Record</p>
                <div className="bg-slate-950 border border-white/10 rounded-xl p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">TXT</span>
                        <span className="text-[9px] text-slate-400 font-mono">_callpilot-verify.{customDomain}</span>
                      </div>
                      <p className="text-[9px] text-slate-600 font-mono pl-8">
                        callpilot-verify-dns-challenge
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyDnsTxt}
                      className="text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Copy host"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[9px] text-slate-600 leading-relaxed">
                  Add this TXT record to your DNS provider. Verification is not yet active (architecture stub) — full implementation requires Vercel Domains API or Cloudflare for SaaS.
                </p>
              </div>
            )}

            <a
              href="https://vercel.com/docs/projects/domains/add-a-domain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Custom domain setup guide
            </a>
          </div>

          {/* ─ Action Buttons ─ */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isResetting}
                className="flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 text-white shadow"
                style={{
                  background: `linear-gradient(135deg, ${previewColor}, ${previewColorDark})`,
                  boxShadow: `0 4px 15px ${previewColor}50`,
                }}
              >
                {isSaving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                ) : savedOk ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> Save Branding</>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving || isResetting}
                className="px-4 py-3 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                Reset
              </button>
            </div>
          )}
        </div>

        {/* ── Live Preview ── */}
        <div className="hidden lg:flex flex-col items-center gap-3 sticky top-6 self-start">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-wider">
            <Eye className="w-3 h-3" /> Live Preview
          </div>
          <SidebarPreview
            brandName={previewName}
            brandColor={previewColor}
            brandColorDark={previewColorDark}
            brandLogoUrl={brandLogoUrl}
          />
          <p className="text-[8px] text-slate-700 text-center max-w-[200px]">
            Updates as you type — save to apply across the dashboard
          </p>
        </div>
      </div>
    </div>
  )
}

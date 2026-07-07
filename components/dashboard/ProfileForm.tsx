'use client'

import { useState } from 'react'
import { Save, User, Bell, Key, Loader2, ShieldCheck } from 'lucide-react'

interface ProfileFormProps {
  initialProfile: {
    firstName: string | null
    lastName: string | null
    email: string
    role: string
  }
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [firstName, setFirstName] = useState(initialProfile.firstName || '')
  const [lastName, setLastName] = useState(initialProfile.lastName || '')
  const [emailNotify, setEmailNotify] = useState(true)
  const [inAppNotify, setInAppNotify] = useState(true)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Profile configurations updated successfully!')
    }, 1200)
  }

  const userInitials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U'

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">

      {/* Profile Header Card */}
      <div
        className="p-6 rounded-2xl flex items-center gap-5"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-black shrink-0"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            boxShadow: '0 0 20px rgba(79,70,229,0.5)',
          }}
        >
          {userInitials}
        </div>
        <div>
          <h2 className="text-base font-black text-white">
            {firstName || initialProfile.firstName} {lastName || initialProfile.lastName}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{initialProfile.email}</p>
          <span
            className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
            style={{
              background: 'rgba(79,70,229,0.15)',
              borderColor: 'rgba(99,102,241,0.3)',
              color: '#818cf8',
            }}
          >
            {initialProfile.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Section Description */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <User className="w-4 h-4" style={{ color: '#818cf8' }} />
            Personal Profile
          </h3>
          <p className="text-[10px] leading-relaxed" style={{ color: '#475569' }}>
            Update your account details and select what types of notification triggers you receive in your business email.
          </p>
        </div>

        {/* Right: Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl p-6 space-y-6"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[10px] uppercase tracking-wider block" style={{ color: '#475569' }}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none transition-all"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-[10px] uppercase tracking-wider block" style={{ color: '#475569' }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none transition-all"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>
            </div>

            {/* Email & Role (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[10px] uppercase tracking-wider block" style={{ color: '#475569' }}>Email Address</label>
                <input
                  type="email"
                  value={initialProfile.email}
                  disabled
                  className="w-full rounded-xl px-3.5 py-2.5 outline-none cursor-not-allowed"
                  style={{
                    background: 'rgba(10,17,40,0.4)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: '#334155',
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-[10px] uppercase tracking-wider block" style={{ color: '#475569' }}>Workspace Role</label>
                <input
                  type="text"
                  value={initialProfile.role}
                  disabled
                  className="w-full rounded-xl px-3.5 py-2.5 outline-none cursor-not-allowed font-mono uppercase"
                  style={{
                    background: 'rgba(10,17,40,0.4)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: '#334155',
                  }}
                />
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
                <Bell className="w-4 h-4" style={{ color: '#818cf8' }} />
                Notification Preferences
              </h4>
              <div className="space-y-3 pl-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="w-4 h-4 mt-0.5 border rounded accent-indigo-600"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <span className="font-bold text-white block group-hover:text-indigo-400 transition-colors">Email updates</span>
                    <span className="text-[10px]" style={{ color: '#475569' }}>Send summaries when evaluations on your calls are grading complete.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inAppNotify}
                    onChange={(e) => setInAppNotify(e.target.checked)}
                    className="w-4 h-4 mt-0.5 border rounded accent-indigo-600"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <span className="font-bold text-white block group-hover:text-indigo-400 transition-colors">In-app notifications</span>
                    <span className="text-[10px]" style={{ color: '#475569' }}>Display popup alerts inside active dashboard dashboards.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="pt-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
                <Key className="w-4 h-4" style={{ color: '#818cf8' }} />
                Security Credentials
              </h4>
              <p className="text-[10px] leading-relaxed" style={{ color: '#475569' }}>
                If you logged in with Google OAuth, your password is managed through your Google identity provider. If email based, click below to dispatch a reset email.
              </p>
              <button
                type="button"
                className="font-bold px-4 py-2.5 rounded-xl transition-all text-xs"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                Trigger Password Reset
              </button>
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 4px 15px rgba(79,70,229,0.35)',
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Security Status Card */}
      <div
        className="p-5 rounded-2xl flex items-center gap-4"
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.15)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 0 10px rgba(16,185,129,0.4)',
          }}
        >
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-xs">Your account is secured</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#6ee7b7' }}>Authentication is managed via Supabase with industry-standard encryption.</p>
        </div>
      </div>

    </div>
  )
}

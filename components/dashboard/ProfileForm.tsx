'use client'

import { useState } from 'react'
import { Save, User, Bell, Key, Loader2 } from 'lucide-react'

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
  
  // Notification States
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Description */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <User className="w-4 h-4 text-cyan-400" />
            Personal Profile
          </h3>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Update your account details and select what types of notification triggers you receive in your business email.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSaveProfile} className="glass rounded-xl p-6 border border-white/5 space-y-6">
            
            {/* Row 1: Name fields */}
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

            {/* Row 2: Email & Role displays */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={initialProfile.email}
                  disabled
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Workspace Role</label>
                <input
                  type="text"
                  value={initialProfile.role}
                  disabled
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-500 outline-none cursor-not-allowed font-mono uppercase"
                />
              </div>
            </div>

            {/* Row 3: Notifications preference checks */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-cyan-400" />
                Notification Preferences
              </h4>
              
              <div className="space-y-3 pl-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="w-4 h-4 bg-slate-900 border border-white/10 rounded accent-cyan-500"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block">Email updates</span>
                    <span className="text-[10px] text-slate-500">Send summaries when evaluations on your calls are grading complete.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inAppNotify}
                    onChange={(e) => setInAppNotify(e.target.checked)}
                    className="w-4 h-4 bg-slate-900 border border-white/10 rounded accent-cyan-500"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block">In-app notifications</span>
                    <span className="text-[10px] text-slate-500">Display popup alerts inside active dashboard dashboards.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Row 4: Account Security info */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-cyan-400" />
                Security Credentials
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                If you logged in with Google OAuth, your password is managed through your Google identity provider. If email based, click below to dispatch a reset email.
              </p>
              <button
                type="button"
                className="bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 font-bold px-4 py-2 rounded-lg"
              >
                Trigger Password Reset
              </button>
            </div>

            {/* Submit Bar */}
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
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  )
}

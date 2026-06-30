import { assertRole } from '@/lib/rbac'
import ProfileForm from '@/components/dashboard/ProfileForm'
import { User, Shield } from 'lucide-react'

export default async function ProfilePage() {
  // Protect route - all authenticated roles can access their profile settings
  const profile = await assertRole(['ADMIN', 'MANAGER', 'QA', 'AGENT'])

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header section */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            My Profile Account
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">Configure your personal contact fields and workspace notifications</p>
        </div>

        {/* Display role badge */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 border border-white/5 rounded-lg text-slate-400 font-mono">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span className="uppercase text-[9px] font-bold tracking-wider text-slate-300">{profile.role}</span>
        </div>
      </div>

      {/* Render the Client ProfileForm with initial credentials */}
      <ProfileForm initialProfile={profile} />

    </div>
  )
}

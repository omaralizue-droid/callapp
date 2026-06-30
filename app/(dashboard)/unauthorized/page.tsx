import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      
      {/* Decorative Blur */}
      <div className="absolute w-72 h-72 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Warning Card */}
      <div className="glass max-w-md rounded-2xl p-8 border border-rose-500/10 bg-rose-500/[0.01] relative z-10 space-y-4">
        
        <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5">
          <ShieldAlert className="w-6 h-6" />
        </div>
        
        <h2 className="text-lg font-black text-white tracking-tight">Access Denied</h2>
        
        <p className="text-xs text-slate-400 leading-relaxed">
          Your current workspace role does not have the administrative privileges required to view this segment. Please contact your manager to request access extensions.
        </p>

        <div className="pt-4">
          <Link
            href="/dashboard/overview"
            className="inline-flex items-center gap-2 bg-slate-900 border border-white/10 hover:border-white/15 text-slate-200 hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-102"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Link>
        </div>

      </div>

    </div>
  )
}

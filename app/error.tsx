'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error details securely to tracking services
    console.error('Unhandled runtime application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex items-center justify-center p-6 select-none font-sans text-xs">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#070913] to-[#070913] pointer-events-none" />

      <div className="relative z-10 glass max-w-md w-full p-8 border border-white/5 rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-6">
        
        {/* Error icon badge */}
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6 animate-pulse" />
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-white tracking-tight">Something Went Wrong</h2>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            An unexpected error occurred during page rendering. We have logged the trace and will inspect the core ledger.
          </p>
        </div>

        {/* Error Message Trace */}
        <div className="w-full bg-slate-950/80 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-left text-slate-400 overflow-x-auto max-h-[120px] select-text">
          <span className="text-rose-400 font-bold block mb-1">Error digest:</span>
          {error.message || 'Unknown compilation error'}
          {error.digest && <span className="block mt-1 text-[9px] text-slate-500">Digest: {error.digest}</span>}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3 flex-wrap">
          <button
            onClick={() => reset()}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Execution
          </button>
          
          <Link
            href="/dashboard/overview"
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl border border-white/5 flex items-center justify-center gap-1.5 transition-all"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            Home
          </Link>
        </div>

      </div>
    </div>
  )
}

'use client'

import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="space-y-6 text-xs animate-pulse select-none max-w-7xl mx-auto">
      
      {/* 1. Header Skeleton */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="h-3.5 w-64 bg-slate-900 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-slate-800 rounded-lg" />
      </div>

      {/* 2. Top Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="glass p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-900 rounded" />
              <div className="w-6 h-6 rounded-full bg-slate-900" />
            </div>
            <div className="h-7 w-20 bg-slate-800 rounded-lg" />
            <div className="h-3.5 w-36 bg-slate-900 rounded" />
          </div>
        ))}
      </div>

      {/* 3. Main Split Dashboard Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double Card Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-36 bg-slate-800 rounded" />
              <div className="h-4 w-12 bg-slate-900 rounded" />
            </div>
            <div className="h-64 bg-slate-950/40 rounded-lg border border-white/5 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
            </div>
          </div>
        </div>

        {/* Right Sidebar Card Skeleton */}
        <div className="lg:col-span-1">
          <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="p-3 bg-slate-950/30 rounded-lg border border-white/5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-900 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-3/4 bg-slate-800 rounded" />
                    <div className="h-2.5 w-1/2 bg-slate-900 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

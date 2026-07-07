'use client'

import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse select-none max-w-7xl mx-auto">

      {/* Header Skeleton */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-3.5 w-64 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="h-9 w-32 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl space-y-3"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="w-9 h-9 rounded-xl" style={{ background: 'rgba(79,70,229,0.2)' }} />
            </div>
            <div className="h-7 w-20 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="h-3 w-36 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-36 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <div className="h-4 w-12 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div
              className="h-60 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#4f46e5' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="h-4 w-48 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="px-6 py-4 flex items-center gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-40 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="h-2.5 w-28 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
              <div className="h-3 w-20 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-3 w-16 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-6 w-16 rounded-full" style={{ background: 'rgba(79,70,229,0.15)' }} />
              <div className="h-6 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-3 w-24 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-7 w-24 rounded-lg" style={{ background: 'rgba(79,70,229,0.1)' }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

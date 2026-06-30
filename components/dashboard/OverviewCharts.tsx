'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface OverviewChartsProps {
  qaTrend: { week: string; qa: number }[]
  volumeTrend: { name: string; count: number }[]
}

export default function OverviewCharts({ qaTrend, volumeTrend }: OverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. QA Score Trend Over Time */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">QA Score Trend</h3>
          <p className="text-[10px] text-slate-500">Average compliance scores over the last 4 weeks</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[60, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Area type="monotone" dataKey="qa" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorQa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Call Volume distribution */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Call Volume</h3>
          <p className="text-[10px] text-slate-500">Total number of voice recordings uploaded daily</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

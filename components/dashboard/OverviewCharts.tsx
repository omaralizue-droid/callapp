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

const lightTooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  color: '#1e293b',
  fontSize: '11px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
}

export default function OverviewCharts({ qaTrend, volumeTrend }: OverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* QA Score Trend */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">QA Score Trend</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Average compliance scores over the last 4 weeks</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" fontSize={10} domain={[60, 100]} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={lightTooltipStyle} />
              <Area type="monotone" dataKey="qa" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorQa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Call Volume */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Weekly Call Volume</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Total number of voice recordings uploaded daily</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip
                cursor={{ fill: 'rgba(79, 70, 229, 0.04)' }}
                contentStyle={lightTooltipStyle}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

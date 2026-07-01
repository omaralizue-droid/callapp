'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'

interface ReportsChartsProps {
  agentStats: { name: string; score: number }[]
  complianceStats: { category: string; rate: number }[]
}

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']

const lightTooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  color: '#1e293b',
  fontSize: '11px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
}

export default function ReportsCharts({ agentStats, complianceStats }: ReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Agent QA Averages */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Agent Performance Averages</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Average compliance QA scores by agent seat</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" fontSize={10} domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={lightTooltipStyle} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={35}>
                {agentStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Category Rates */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Compliance Pass Rates</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Percentage success rates by scorecard criteria</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={complianceStats}
              margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={lightTooltipStyle} />
              <Bar dataKey="rate" fill="#4f46e5" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

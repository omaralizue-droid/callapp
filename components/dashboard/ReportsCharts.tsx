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

const COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ec4899']

export default function ReportsCharts({ agentStats, complianceStats }: ReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Agent QA Averages (QA Leaderboard) */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Performance Averages</h3>
          <p className="text-[10px] text-slate-500">Average compliance QA scores by agent seat</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[50, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={35}>
                {agentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Compliance Category Success Rates (Horizontal) */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Pass Rates</h3>
          <p className="text-[10px] text-slate-500">Percentage success rates by scorecard criteria</p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={complianceStats}
              margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
              <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="rate" fill="#06b6d4" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

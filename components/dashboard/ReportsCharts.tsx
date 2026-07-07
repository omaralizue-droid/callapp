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

const COLORS = ['#818cf8', '#a78bfa', '#67e8f9', '#c4b5fd', '#6ee7b7']

const darkTooltipStyle = {
  backgroundColor: 'rgba(13,21,53,0.95)',
  border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '11px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
}

export default function ReportsCharts({ agentStats, complianceStats }: ReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Agent QA Averages */}
      <div
        className="p-5 rounded-2xl space-y-4"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <h3 className="text-sm font-bold text-white">Agent Performance Averages</h3>
          <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
            Average compliance QA scores by agent seat
          </p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" stroke="#1e293b" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#334155' }} />
              <YAxis stroke="#1e293b" fontSize={10} domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fill: '#334155' }} />
              <Tooltip contentStyle={darkTooltipStyle} cursor={{ fill: 'rgba(79,70,229,0.08)' }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={35}>
                {agentStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance Category Rates */}
      <div
        className="p-5 rounded-2xl space-y-4"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <h3 className="text-sm font-bold text-white">Compliance Pass Rates</h3>
          <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
            Percentage success rates by scorecard criteria
          </p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={complianceStats}
              margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="complianceGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#4f46e5" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" stroke="#1e293b" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#334155' }} />
              <YAxis type="category" dataKey="category" stroke="#1e293b" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
              <Tooltip contentStyle={darkTooltipStyle} cursor={{ fill: 'rgba(79,70,229,0.08)' }} />
              <Bar dataKey="rate" fill="url(#complianceGrad)" radius={[0, 6, 6, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

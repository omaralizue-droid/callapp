'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Smile, TrendingUp, Activity } from 'lucide-react'

const QA_TREND_DATA = [
  { day: 'Jun 15', score: 84 },
  { day: 'Jun 16', score: 85 },
  { day: 'Jun 17', score: 84.5 },
  { day: 'Jun 18', score: 86 },
  { day: 'Jun 19', score: 87.2 },
  { day: 'Jun 20', score: 86.8 },
  { day: 'Jun 21', score: 88.5 },
  { day: 'Jun 22', score: 89 },
  { day: 'Jun 23', score: 89.4 },
  { day: 'Jun 24', score: 90.1 },
  { day: 'Jun 25', score: 91.2 },
  { day: 'Jun 26', score: 90.8 },
  { day: 'Jun 27', score: 92 },
  { day: 'Jun 28', score: 92.4 },
]

const SENTIMENT_PIE_DATA = [
  { name: 'Positive', value: 58, color: '#4f46e5' },
  { name: 'Neutral', value: 28, color: '#6366f1' },
  { name: 'Negative', value: 14, color: '#f43f5e' },
]

const VOLUME_DATA = [
  { name: 'Technical Support', volume: 64 },
  { name: 'Refund Disputes', volume: 38 },
  { name: 'General Inquiries', volume: 45 },
  { name: 'Sales Outbound', volume: 27 },
  { name: 'Account Changes', volume: 18 },
]

const CHART_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']

const lightTooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  color: '#1e293b',
  fontSize: '11px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
}

export default function AnalyticsDashboardCharts() {
  return (
    <div className="space-y-6 text-xs">

      {/* QA Trend Line */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              BPO Team Compliance Average (15-Day Trend)
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Average QA score mapped across BPO outbound divisions</p>
          </div>
          <span className="text-sm font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">Current: 92.4%</span>
        </div>

        <div className="h-[220px] w-full font-mono text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={QA_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis stroke="#94a3b8" domain={[80, 95]} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={lightTooltipStyle} />
              <defs>
                <linearGradient id="indigoBlueGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#indigoBlueGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, stroke: '#4f46e5', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Sentiment Pie */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <Smile className="w-4 h-4 text-indigo-600" />
              Dialogue Sentiment Division
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Customer feedback metrics compiled by AI analysis</p>
          </div>

          <div className="grid grid-cols-5 gap-4 items-center">
            <div className="col-span-3 h-[150px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SENTIMENT_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SENTIMENT_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-800 font-mono">58%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Positive</span>
              </div>
            </div>

            <div className="col-span-2 space-y-3 font-mono">
              {SENTIMENT_PIE_DATA.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-semibold">{item.name}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] pl-4 block">{item.value}% of conversations</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Volume Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <Activity className="w-4 h-4 text-indigo-600" />
              Inbound Call Topic Volume
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Distribution of graded calls across BPO support cues</p>
          </div>

          <div className="h-[150px] w-full font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => val.split(' ')[0]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Tooltip contentStyle={lightTooltipStyle} />
                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                  {VOLUME_DATA.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

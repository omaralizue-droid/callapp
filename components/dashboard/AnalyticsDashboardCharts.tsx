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
  { name: 'Positive', value: 58, color: '#818cf8' },
  { name: 'Neutral',  value: 28, color: '#475569' },
  { name: 'Negative', value: 14, color: '#f43f5e' },
]

const VOLUME_DATA = [
  { name: 'Technical Support', volume: 64 },
  { name: 'Refund Disputes',   volume: 38 },
  { name: 'General Inquiries', volume: 45 },
  { name: 'Sales Outbound',    volume: 27 },
  { name: 'Account Changes',   volume: 18 },
]

const CHART_COLORS = ['#818cf8', '#a78bfa', '#67e8f9', '#c4b5fd', '#6ee7b7']

const darkTooltipStyle = {
  backgroundColor: 'rgba(13,21,53,0.95)',
  border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '11px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
}

const cardStyle = {
  background: 'rgba(13,21,53,0.7)',
  border: '1px solid rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
}

export default function AnalyticsDashboardCharts() {
  return (
    <div className="space-y-6 text-xs">

      {/* QA Trend Line */}
      <div className="p-5 rounded-2xl space-y-4" style={cardStyle}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4" style={{ color: '#818cf8' }} />
              BPO Team Compliance Average (15-Day Trend)
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
              Average QA score mapped across BPO outbound divisions
            </p>
          </div>
          <span
            className="text-sm font-black font-mono px-3 py-1 rounded-xl"
            style={{
              background: 'rgba(79,70,229,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#818cf8',
            }}
          >
            Current: 92.4%
          </span>
        </div>

        <div className="h-[220px] w-full font-mono text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={QA_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradDark" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" stroke="#1e293b" tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 10 }} />
              <YAxis stroke="#1e293b" domain={[80, 95]} tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 10 }} />
              <Tooltip contentStyle={darkTooltipStyle} cursor={{ stroke: 'rgba(129,140,248,0.2)' }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#lineGradDark)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, stroke: '#818cf8', strokeWidth: 2, fill: '#0d1535' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Sentiment Pie */}
        <div className="p-5 rounded-2xl space-y-4 flex flex-col justify-between" style={cardStyle}>
          <div>
            <h3 className="font-bold text-white flex items-center gap-1.5 text-sm">
              <Smile className="w-4 h-4" style={{ color: '#818cf8' }} />
              Dialogue Sentiment Division
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
              Customer feedback metrics compiled by AI analysis
            </p>
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
                    strokeWidth={0}
                  >
                    {SENTIMENT_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black font-mono text-white">58%</span>
                <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#475569' }}>Positive</span>
              </div>
            </div>

            <div className="col-span-2 space-y-3 font-mono">
              {SENTIMENT_PIE_DATA.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold" style={{ color: '#94a3b8' }}>{item.name}</span>
                  </div>
                  <span className="text-[10px] pl-4 block" style={{ color: '#334155' }}>
                    {item.value}% of conversations
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Volume Bar */}
        <div className="p-5 rounded-2xl space-y-4" style={cardStyle}>
          <div>
            <h3 className="font-bold text-white flex items-center gap-1.5 text-sm">
              <Activity className="w-4 h-4" style={{ color: '#818cf8' }} />
              Inbound Call Topic Volume
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
              Distribution of graded calls across BPO support cues
            </p>
          </div>

          <div className="h-[150px] w-full font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#1e293b"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.split(' ')[0]}
                  tick={{ fill: '#334155', fontSize: 9 }}
                />
                <YAxis stroke="#1e293b" tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 9 }} />
                <Tooltip contentStyle={darkTooltipStyle} cursor={{ fill: 'rgba(79,70,229,0.08)' }} />
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

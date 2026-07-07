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

const darkTooltipStyle = {
  backgroundColor: 'rgba(13, 21, 53, 0.95)',
  border: '1px solid rgba(99,102,241,0.3)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '11px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
}

export default function OverviewCharts({ qaTrend, volumeTrend }: OverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* QA Score Trend */}
      <div
        className="p-5 rounded-2xl space-y-4"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <h3 className="text-sm font-bold text-white">QA Score Trend</h3>
          <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
            Average compliance scores over the last 4 weeks
          </p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQaDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#1e293b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#334155' }}
              />
              <YAxis
                stroke="#1e293b"
                fontSize={10}
                domain={[60, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#334155' }}
              />
              <Tooltip contentStyle={darkTooltipStyle} cursor={{ stroke: 'rgba(129,140,248,0.2)' }} />
              <Area
                type="monotone"
                dataKey="qa"
                stroke="#818cf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorQaDark)"
                dot={{ fill: '#818cf8', r: 3, strokeWidth: 0 }}
                activeDot={{ fill: '#c4b5fd', r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Call Volume */}
      <div
        className="p-5 rounded-2xl space-y-4"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <h3 className="text-sm font-bold text-white">Weekly Call Volume</h3>
          <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
            Total number of voice recordings uploaded daily
          </p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#818cf8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#1e293b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#334155' }}
              />
              <YAxis
                stroke="#1e293b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#334155' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(79,70,229,0.08)' }}
                contentStyle={darkTooltipStyle}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

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
import {
  Smile,
  TrendingUp,
  Activity,
} from 'lucide-react'

// QA trend line dataset
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

// Sentiment divisions dataset
const SENTIMENT_PIE_DATA = [
  { name: 'Positive', value: 58, color: '#06b6d4' }, // Cyan
  { name: 'Neutral', value: 28, color: '#4f46e5' },  // Indigo
  { name: 'Negative', value: 14, color: '#f43f5e' },  // Rose
]

// Call volume breakdown dataset
const VOLUME_DATA = [
  { name: 'Technical Support', volume: 64 },
  { name: 'Refund Disputes', volume: 38 },
  { name: 'General Inquiries', volume: 45 },
  { name: 'Sales Outbound', volume: 27 },
  { name: 'Account Changes', volume: 18 },
]

export default function AnalyticsDashboardCharts() {
  return (
    <div className="space-y-6 text-xs">
      
      {/* 1. Core Score trend line */}
      <div className="glass rounded-xl p-5 border border-white/5 bg-slate-900/10 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              BPO Team Compliance Average (15-Day Trend)
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Average QA score mapped across BPO outbound divisions</p>
          </div>
          <span className="text-sm font-bold text-cyan-400 font-mono">Current: 92.4%</span>
        </div>

        <div className="h-[220px] w-full font-mono text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={QA_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" domain={[80, 95]} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#cyanIndigoGrad)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, stroke: '#06b6d4', strokeWidth: 2, fill: '#090d16' }}
              />
              <defs>
                <linearGradient id="cyanIndigoGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. Sentiment distribution */}
        <div className="glass rounded-xl p-5 border border-white/5 bg-slate-900/10 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-cyan-400" />
              Dialogue Sentiment division
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Customer feedback metrics compiled by AI analysis</p>
          </div>

          <div className="grid grid-cols-5 gap-4 items-center">
            
            {/* Pie chart graphic */}
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
              
              {/* Overlay center metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-white font-mono">58%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Positive</span>
              </div>
            </div>

            {/* Labels and legends */}
            <div className="col-span-2 space-y-3 font-mono">
              {SENTIMENT_PIE_DATA.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-semibold">{item.name}</span>
                  </div>
                  <span className="text-slate-500 text-[10px] pl-4 block">{item.value}% of conversations</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 3. Call volumes per category */}
        <div className="glass rounded-xl p-5 border border-white/5 bg-slate-900/10 space-y-4">
          <div>
            <h3 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Inbound Call Topic Volume
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Distribution of graded calls across BPO support cues</p>
          </div>

          <div className="h-[150px] w-full font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" tickLine={false} axisLine={false} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis stroke="#475569" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="volume" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                  {VOLUME_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#06b6d4' : '#4f46e5'} // Highlight technical support
                    />
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

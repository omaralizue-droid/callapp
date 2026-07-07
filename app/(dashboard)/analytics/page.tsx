import { assertRole } from '@/lib/rbac'
import AnalyticsDashboardCharts from '@/components/dashboard/AnalyticsDashboardCharts'
import { AreaChart, Calendar, TrendingUp, Users, Award, PhoneCall } from 'lucide-react'

export default async function AnalyticsPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  const quickStats = [
    { label: 'Avg QA Score', value: '87.4%', change: '+2.1%', icon: <Award className="w-4 h-4" />, gradient: 'from-indigo-500 to-violet-600', glow: 'rgba(79,70,229,0.3)', textColor: '#818cf8' },
    { label: 'Call Volume', value: '1,284', change: '+12% this month', icon: <PhoneCall className="w-4 h-4" />, gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)', textColor: '#67e8f9' },
    { label: 'Active Agents', value: '5', change: 'Steady team', icon: <Users className="w-4 h-4" />, gradient: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.3)', textColor: '#6ee7b7' },
    { label: 'Score Growth', value: '+3.2%', change: 'vs last month', icon: <TrendingUp className="w-4 h-4" />, gradient: 'from-purple-500 to-fuchsia-600', glow: 'rgba(168,85,247,0.3)', textColor: '#c4b5fd' },
  ]

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <AreaChart className="w-5 h-5" style={{ color: '#818cf8' }} />
          <div>
            <h1 className="text-xl font-bold text-white">Performance Analytics</h1>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
              Review team averages, volume metrics, and sentiment trends
            </p>
          </div>
        </div>

        {/* Date Filter */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold"
          style={{
            background: 'rgba(13,21,53,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
          }}
        >
          <Calendar className="w-3.5 h-3.5" style={{ color: '#818cf8' }} />
          <span>Last 15 Days</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>
                {s.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${s.gradient} text-white shrink-0`}
                style={{ boxShadow: `0 4px 15px ${s.glow}` }}
              >
                {s.icon}
              </div>
            </div>
            <div>
              <div
                className="text-2xl font-black"
                style={{ color: s.textColor, textShadow: `0 0 20px ${s.glow}` }}
              >
                {s.value}
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: '#334155' }}>
                {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsDashboardCharts />

    </div>
  )
}

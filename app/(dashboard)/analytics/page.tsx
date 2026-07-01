import { assertRole } from '@/lib/rbac'
import AnalyticsDashboardCharts from '@/components/dashboard/AnalyticsDashboardCharts'
import { AreaChart, Calendar, TrendingUp, Users, Award, PhoneCall } from 'lucide-react'

export default async function AnalyticsPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  const quickStats = [
    { label: 'Avg QA Score', value: '87.4%', change: '+2.1%', icon: <Award className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Call Volume', value: '1,284', change: '+12% this month', icon: <PhoneCall className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50 border-blue-100' },
    { label: 'Active Agents', value: '5', change: 'Steady team', icon: <Users className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Score Growth', value: '+3.2%', change: 'vs last month', icon: <TrendingUp className="w-4 h-4 text-violet-600" />, bg: 'bg-violet-50 border-violet-100' },
  ]

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AreaChart className="w-5 h-5 text-indigo-600" />
            Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review team averages, volume metrics, and sentiment trends</p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-semibold shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>Last 15 Days</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s, i) => (
          <div key={i} className={`rounded-xl border p-5 bg-white shadow-sm flex flex-col gap-3 hover:shadow-md transition-all ${s.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg}`}>{s.icon}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">{s.value}</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsDashboardCharts />

    </div>
  )
}

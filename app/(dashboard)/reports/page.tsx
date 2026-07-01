import { assertRole } from '@/lib/rbac'
import ReportsCharts from '@/components/dashboard/ReportsCharts'
import { Award, CheckCircle, BarChart3, TrendingUp } from 'lucide-react'

export default async function ReportsPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  const agentStats = [
    { name: 'Alex Rodriguez', score: 94, calls: 42, complianceRate: 98 },
    { name: 'Lisa Miller', score: 82, calls: 38, complianceRate: 88 },
    { name: 'David Kim', score: 88, calls: 45, complianceRate: 92 },
    { name: 'Sarah Connor', score: 91, calls: 35, complianceRate: 95 },
  ]

  const complianceStats = [
    { category: 'Branded Greeting', rate: 96 },
    { category: 'Recording Disclosure', rate: 98 },
    { category: 'Identity Verification', rate: 84 },
    { category: 'Refund Guidelines', rate: 91 },
    { category: 'Polite Sign-off', rate: 94 },
  ]

  const topStats = [
    { title: 'Global Compliance Rate', value: '92.4%', icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100', textColor: 'text-emerald-700' },
    { title: 'Peak QA Agent', value: 'Alex R. (94%)', icon: <Award className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100', textColor: 'text-indigo-700' },
    { title: 'Total Graded Rubrics', value: '160 checklists', icon: <BarChart3 className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50 border-blue-100', textColor: 'text-blue-700' },
    { title: 'Score Growth', value: '+3.2%', icon: <TrendingUp className="w-4 h-4 text-violet-600" />, bg: 'bg-violet-50 border-violet-100', textColor: 'text-violet-700' },
  ]

  const getScoreStyle = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Reports & QA Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review team averages, compliance checklists, and high-performing agents</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat, idx) => (
          <div key={idx} className={`rounded-xl border p-5 bg-white shadow-sm flex flex-col gap-3 hover:shadow-md transition-all ${stat.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.title}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>{stat.icon}</div>
            </div>
            <span className={`text-xl font-black ${stat.textColor}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ReportsCharts agentStats={agentStats} complianceStats={complianceStats} />

      {/* Agent Scoreboard */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="text-sm font-bold text-slate-800">Agent Scoreboard Breakdown</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Individual metrics for BPO agent quality auditing</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="px-6 py-3 font-semibold uppercase tracking-wide text-[11px]">Agent Name</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wide text-[11px]">Audited Calls</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wide text-[11px]">Avg QA Score</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wide text-[11px]">Compliance</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wide text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentStats.map((agent, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{agent.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{agent.calls} calls</td>
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">{agent.score}%</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{agent.complianceRate}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getScoreStyle(agent.score)}`}>
                      {agent.score >= 90 ? 'High Performer' : 'On Track'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

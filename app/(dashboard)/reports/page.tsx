import { assertRole } from '@/lib/rbac'
import ReportsCharts from '@/components/dashboard/ReportsCharts'
import { Award, CheckCircle, BarChart3, TrendingUp } from 'lucide-react'

export default async function ReportsPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])
  
  // Scaffolding mock aggregates for BPO report sheets
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
    { title: 'Global Compliance Rate', value: '92.4%', icon: <CheckCircle className="w-4 h-4 text-cyan-400" /> },
    { title: 'Peak QA Agent', value: 'Alex R. (94%)', icon: <Award className="w-4 h-4 text-indigo-400" /> },
    { title: 'Total Graded Rubrics', value: '160 checklists', icon: <BarChart3 className="w-4 h-4 text-emerald-400" /> },
    { title: 'Score Growth', value: '+3.2%', icon: <TrendingUp className="w-4 h-4 text-cyan-400" /> },
  ]

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Reports & QA Analytics</h2>
        <p className="text-[10px] text-slate-500 mt-1">Review team averages, compliance checklists, and high-performing agents</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat, idx) => (
          <div key={idx} className="glass rounded-xl p-5 border border-white/5 bg-slate-900/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {stat.title}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-white block tracking-tight">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reports Chart component */}
      <ReportsCharts agentStats={agentStats} complianceStats={complianceStats} />

      {/* Leaderboard Table Grid */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Scoreboard Breakdown</h3>
          <p className="text-[10px] text-slate-500">Individual metrics for BPO agent quality auditing</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5">
                <th className="px-6 py-3 font-semibold">Agent Name</th>
                <th className="px-6 py-3 font-semibold">Audited Calls</th>
                <th className="px-6 py-3 font-semibold">Average QA Score</th>
                <th className="px-6 py-3 font-semibold">Compliance Pass Rate</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {agentStats.map((agent, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{agent.name}</td>
                  <td className="px-6 py-4 font-mono">{agent.calls} calls</td>
                  <td className="px-6 py-4 font-mono font-bold text-cyan-400">{agent.score}%</td>
                  <td className="px-6 py-4 font-mono">{agent.complianceRate}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      agent.score >= 90
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
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

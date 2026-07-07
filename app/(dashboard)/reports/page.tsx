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
    { title: 'Global Compliance Rate', value: '92.4%', icon: <CheckCircle className="w-4 h-4" />, gradient: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.3)', textColor: '#6ee7b7' },
    { title: 'Peak QA Agent', value: 'Alex R. (94%)', icon: <Award className="w-4 h-4" />, gradient: 'from-indigo-500 to-violet-600', glow: 'rgba(79,70,229,0.3)', textColor: '#818cf8' },
    { title: 'Total Graded Rubrics', value: '160 checklists', icon: <BarChart3 className="w-4 h-4" />, gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)', textColor: '#67e8f9' },
    { title: 'Score Growth', value: '+3.2%', icon: <TrendingUp className="w-4 h-4" />, gradient: 'from-purple-500 to-fuchsia-600', glow: 'rgba(168,85,247,0.3)', textColor: '#c4b5fd' },
  ]

  const getScoreStyle = (score: number) => {
    if (score >= 90) return { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }
    return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#fcd34d' }
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5" style={{ color: '#818cf8' }} />
        <div>
          <h1 className="text-xl font-bold text-white">Reports & QA Analytics</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
            Review team averages, compliance checklists, and high-performing agents
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>
                {stat.title}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${stat.gradient} text-white shrink-0`}
                style={{ boxShadow: `0 4px 15px ${stat.glow}` }}
              >
                {stat.icon}
              </div>
            </div>
            <span
              className="text-xl font-black"
              style={{ color: stat.textColor, textShadow: `0 0 20px ${stat.glow}` }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ReportsCharts agentStats={agentStats} complianceStats={complianceStats} />

      {/* Agent Scoreboard */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">Agent Scoreboard Breakdown</h3>
          <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
            Individual metrics for BPO agent quality auditing
          </p>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Agent Name', 'Audited Calls', 'Avg QA Score', 'Compliance', 'Status'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]"
                    style={{ color: '#334155' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agentStats.map((agent, idx) => {
                const badge = getScoreStyle(agent.score)
                return (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-6 py-4 font-bold text-white">{agent.name}</td>
                    <td className="px-6 py-4 font-mono" style={{ color: '#94a3b8' }}>{agent.calls} calls</td>
                    <td className="px-6 py-4 font-mono font-bold" style={{ color: '#818cf8' }}>{agent.score}%</td>
                    <td className="px-6 py-4 font-mono" style={{ color: '#94a3b8' }}>{agent.complianceRate}%</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full border text-[10px] font-bold"
                        style={{
                          background: badge.bg,
                          borderColor: badge.border,
                          color: badge.color,
                        }}
                      >
                        {agent.score >= 90 ? 'High Performer' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

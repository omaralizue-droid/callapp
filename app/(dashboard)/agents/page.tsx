import { assertRole } from '@/lib/rbac'
import { Users, Award, Shield, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const AGENTS_LIST = [
  {
    id: 'agent-1',
    name: 'Alex Rodriguez',
    initials: 'AR',
    score: 94.2,
    callsGraded: 42,
    rating: 'Exceptional',
    primaryStrength: 'Adherence to Greeting script & Politeness',
    coachingArea: 'Reducing Average Handle Time slightly',
  },
  {
    id: 'agent-2',
    name: 'Lisa Miller',
    initials: 'LM',
    score: 82.5,
    callsGraded: 38,
    rating: 'On Track',
    primaryStrength: 'High empathy scores and active listening',
    coachingArea: 'Identity validation process adherence',
  },
  {
    id: 'agent-3',
    name: 'David Kim',
    initials: 'DK',
    score: 88.0,
    callsGraded: 45,
    rating: 'On Track',
    primaryStrength: 'Excellent technical debugging assistance',
    coachingArea: 'Recording disclosure statement timeliness',
  },
  {
    id: 'agent-4',
    name: 'Sarah Connor',
    initials: 'SC',
    score: 91.8,
    callsGraded: 35,
    rating: 'Exceptional',
    primaryStrength: 'Rapid ticket resolution, concise call wraps',
    coachingArea: 'Adhering to product refund terms details',
  },
  {
    id: 'agent-5',
    name: 'Marcus Vance',
    initials: 'MV',
    score: 74.5,
    callsGraded: 18,
    rating: 'Requires Coaching',
    primaryStrength: 'Pleasant and polite demeanor',
    coachingArea: 'Accurate caller verification protocols',
  },
]

const getRatingStyle = (rating: string) => {
  if (rating === 'Exceptional') return { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }
  if (rating === 'On Track') return { bg: 'rgba(79,70,229,0.15)', border: 'rgba(79,70,229,0.3)', color: '#818cf8' }
  return { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', color: '#fca5a5' }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-400'
  if (score >= 80) return 'text-indigo-400'
  return 'text-rose-400'
}

export default async function AgentsPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  const summaryStats = [
    { label: 'Total Agents', value: '5', gradient: 'from-indigo-500 to-violet-600', glow: 'rgba(79,70,229,0.3)', textColor: '#818cf8' },
    { label: 'Exceptional', value: '2', gradient: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.3)', textColor: '#6ee7b7' },
    { label: 'On Track', value: '2', gradient: 'from-blue-500 to-indigo-600', glow: 'rgba(6,182,212,0.3)', textColor: '#67e8f9' },
    { label: 'Need Coaching', value: '1', gradient: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.3)', textColor: '#fca5a5' },
  ]

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5" style={{ color: '#818cf8' }} />
          <div>
            <h1 className="text-xl font-bold text-white">Agent Directory</h1>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
              Audit individual agent performance averages, graded calls, and compliance tracking
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold"
          style={{
            background: 'rgba(79,70,229,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#818cf8',
          }}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {AGENTS_LIST.length} Active Agents
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl flex flex-col gap-1 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>
              {s.label}
            </span>
            <span
              className="text-2xl font-black"
              style={{ color: s.textColor, textShadow: `0 0 20px ${s.glow}` }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Agent Table */}
        <div className="md:col-span-2">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-bold text-white">Agent Performance Logs</h3>
              <span className="text-[10px]" style={{ color: '#475569' }}>Last 30 days</span>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {AGENTS_LIST.map((agent) => (
                <div
                  key={agent.id}
                  className="px-6 py-4 transition-colors flex items-center gap-4 justify-between group hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        boxShadow: '0 0 10px rgba(79,70,229,0.4)',
                      }}
                    >
                      {agent.initials}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{agent.name}</span>
                      <div className="flex items-center gap-2 text-[10px] mt-0.5" style={{ color: '#475569' }}>
                        <span>{agent.callsGraded} graded audits</span>
                        <span>•</span>
                        <span className={`font-bold font-mono ${getScoreColor(agent.score)}`}>Avg: {agent.score}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {(() => {
                      const badge = getRatingStyle(agent.rating)
                      return (
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold border hidden sm:inline-block"
                          style={{
                            background: badge.bg,
                            borderColor: badge.border,
                            color: badge.color,
                          }}
                        >
                          {agent.rating}
                        </span>
                      )
                    })()}
                    <Link
                      href="/dashboard/calls"
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: '#818cf8' }} />
              Active Coaching Focus
            </h3>
            <p className="text-[10px] leading-relaxed" style={{ color: '#475569' }}>
              Based on the lowest scoring compliance rubrics in the last 15 days, coaching sessions should focus on:
            </p>
            <div className="space-y-3">
              <div
                className="flex gap-3 items-start p-3 rounded-xl"
                style={{
                  background: 'rgba(79,70,229,0.08)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}
              >
                <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#818cf8' }} />
                <div>
                  <span className="font-bold text-white text-xs block">Caller verification protocols</span>
                  <span className="text-[10px]" style={{ color: '#475569' }}>Affects average scores for 2 agents</span>
                </div>
              </div>
              <div
                className="flex gap-3 items-start p-3 rounded-xl"
                style={{
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.15)',
                }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
                <div>
                  <span className="font-bold text-white text-xs block">Recording disclosure timing</span>
                  <span className="text-[10px]" style={{ color: '#475569' }}>Missed on 4 outbound calls this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performer spotlight */}
          <div
            className="p-5 rounded-2xl border"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(4,120,87,0.15))',
              borderColor: 'rgba(16,185,129,0.3)',
              boxShadow: '0 0 20px rgba(16,185,129,0.1)',
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6ee7b7' }}>⭐ Top Performer</h3>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  boxShadow: '0 0 10px rgba(16,185,129,0.4)',
                }}
              >
                AR
              </div>
              <div>
                <span className="font-bold text-white block text-sm">Alex Rodriguez</span>
                <span className="text-[10px] font-semibold" style={{ color: '#6ee7b7' }}>94.2% • 42 audits</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

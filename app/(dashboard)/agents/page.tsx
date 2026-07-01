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
  if (rating === 'Exceptional') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (rating === 'On Track') return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600'
  if (score >= 80) return 'text-indigo-600'
  return 'text-rose-600'
}

export default async function AgentsPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Agent Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Audit individual agent performance averages, graded calls, and compliance tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <TrendingUp className="w-3.5 h-3.5" />
          {AGENTS_LIST.length} Active Agents
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: '5', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
          { label: 'Exceptional', value: '2', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'On Track', value: '2', color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Need Coaching', value: '1', color: 'bg-rose-50 text-rose-700 border-rose-100' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border p-4 flex flex-col gap-1 ${s.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{s.label}</span>
            <span className="text-2xl font-black">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Agent Table */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Agent Performance Logs</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Last 30 days</span>
            </div>

            <div className="divide-y divide-slate-100">
              {AGENTS_LIST.map((agent) => (
                <div key={agent.id} className="px-6 py-4 hover:bg-slate-50/70 transition-colors flex items-center gap-4 justify-between group">

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 shrink-0">
                      {agent.initials}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">{agent.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{agent.callsGraded} graded audits</span>
                        <span>•</span>
                        <span className={`font-bold font-mono ${getScoreColor(agent.score)}`}>Avg: {agent.score}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border hidden sm:inline-block ${getRatingStyle(agent.rating)}`}>
                      {agent.rating}
                    </span>
                    <Link
                      href="/dashboard/calls"
                      className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all"
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

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Active Coaching Focus
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Based on the lowest scoring compliance rubrics in the last 15 days, coaching sessions should focus on:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Caller verification protocols</span>
                  <span className="text-slate-500 text-[10px]">Affects average scores for 2 agents</span>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Recording disclosure timing</span>
                  <span className="text-slate-500 text-[10px]">Missed on 4 outbound calls this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performer spotlight */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-3">⭐ Top Performer</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-200 border border-emerald-300 flex items-center justify-center text-sm font-black text-emerald-800">AR</div>
              <div>
                <span className="font-bold text-emerald-900 block text-sm">Alex Rodriguez</span>
                <span className="text-emerald-700 text-[10px] font-semibold">94.2% • 42 audits</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

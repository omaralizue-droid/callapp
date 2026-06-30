import { assertRole } from '@/lib/rbac'
import { Users, Award, Shield, AlertTriangle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

// Realistic BPO Agents Stats
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

export default async function AgentsPage() {
  // Protect route - Admin, Manager, and QA can view the agents list
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Agent Directory
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">Audit individual agent performance averages, graded calls, and compliance tracking</p>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Leaderboard Table List (col-span-2) */}
        <div className="md:col-span-2 space-y-4">
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-slate-900/10">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider">Agent Performance Logs</h3>
            </div>

            <div className="divide-y divide-white/5">
              {AGENTS_LIST.map((agent) => (
                <div key={agent.id} className="p-5 hover:bg-white/[0.01] transition-all flex items-start gap-4 justify-between group">
                  
                  {/* Left Side: Avatar & Name details */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-cyan-400 shrink-0">
                      {agent.initials}
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white text-sm block">{agent.name}</span>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                        <span>{agent.callsGraded} graded audits</span>
                        <span>•</span>
                        <span className="font-mono">Avg Score: {agent.score}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Compliance badge & Action links */}
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                        agent.rating === 'Exceptional'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : agent.rating === 'On Track'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {agent.rating}
                      </span>
                    </div>

                    <Link
                      href="/dashboard/calls"
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Sidebar panels (col-span-1) */}
        <div className="md:col-span-1 space-y-4">
          
          <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              Active Coaching Focus
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Based on the lowest scoring compliance rubrics in the last 15 days, coaching sessions should focus on:
            </p>
            <div className="space-y-3 pt-1">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Caller verification protocols</span>
                  <span className="text-slate-500 text-[10px]">Affects average scores for 2 agents</span>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Recording disclosure timing</span>
                  <span className="text-slate-500 text-[10px]">Missed on 4 outbound calls this week</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

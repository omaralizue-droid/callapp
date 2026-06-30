import { assertRole } from '@/lib/rbac'
import Link from 'next/link'
import {
  ClipboardList,
  Play,
  CheckCircle,
  HelpCircle,
  FileAudio,
  User2,
  Calendar,
} from 'lucide-react'

// Realistic pending BPO calls queue
const PENDING_AUDITS = [
  {
    id: 'call-1',
    title: 'Outbound refund dispute negotiation',
    agent: 'Lisa Miller',
    duration: '04:12',
    date: 'Jun 28, 2026',
    status: 'Awaiting Review',
    priority: 'High',
  },
  {
    id: 'call-2',
    title: 'Inbound verification failure dispute',
    agent: 'David Kim',
    duration: '02:58',
    date: 'Jun 27, 2026',
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    id: 'call-3',
    title: 'Billing compliance check',
    agent: 'Sarah Connor',
    duration: '06:45',
    date: 'Jun 25, 2026',
    status: 'Awaiting Review',
    priority: 'Low',
  },
]

export default async function QABoardPage() {
  // Protect route - Admin, Manager, and QA can access the evaluation dashboard
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  return (
    <div className="space-y-6 text-xs relative">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            QA Grading Console
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">Grade agent conversations against corporate compliance guidelines</p>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 border border-white/5 rounded-lg text-slate-400 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Queue Status: 3 Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Pending Table List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-slate-900/10 flex justify-between items-center">
              <h3 className="font-bold text-slate-400 uppercase tracking-wider">Evaluation Worklist</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>Select row to open audio player</span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-white/10 font-bold">Enter</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px] uppercase tracking-wider">
                    <th className="px-6 py-3">Recording Detail</th>
                    <th className="px-6 py-3">Assigned Agent</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {PENDING_AUDITS.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-all group">
                      
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-cyan-400 transition-colors" />
                          <span className="font-bold text-white block truncate max-w-xs">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Uploaded {item.date}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] text-slate-400">
                            <User2 className="w-3 h-3" />
                          </div>
                          <span>{item.agent}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-400">{item.duration}</td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : item.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-white/5'
                        }`}>
                          {item.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/calls/${item.id}`}
                          className="inline-flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded font-bold transition-all text-[11px]"
                        >
                          <Play className="w-3 h-3 fill-slate-950" />
                          Audit
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: QA Quick Stats & Rubric Metrics */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider">Evaluation Rubric</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Standard corporate evaluation metrics. Call audits are graded across 3 core sectors:
            </p>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-300">Greeting & Disclosure</span>
                <span className="text-cyan-400">Mandatory</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-300">Identity Security Checks</span>
                <span className="text-cyan-400">Critical Failure</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-300">Professional Etiquette</span>
                <span className="text-slate-500">Graded (0-5)</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Grading Guidelines
            </h3>
            <ul className="space-y-2 text-[10px] text-slate-400 leading-relaxed list-disc list-inside pl-1">
              <li>Open transcript and listen alongside audio.</li>
              <li>Toggle rubric checks as agent reads scripts.</li>
              <li>Add constructive coaching details.</li>
              <li>Sync notes to integrated CRM contacts.</li>
            </ul>
            <div className="pt-2 border-t border-white/5 flex justify-between text-[9px] text-slate-500">
              <span>Help Center</span>
              <HelpCircle className="w-3.5 h-3.5 hover:text-slate-300 cursor-pointer" />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

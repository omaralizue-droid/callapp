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
  Clock,
} from 'lucide-react'

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

const getPriorityStyle = (priority: string) => {
  if (priority === 'High') return 'bg-rose-50 text-rose-700 border-rose-200'
  if (priority === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

export default async function QABoardPage() {
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            QA Grading Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">Grade agent conversations against corporate compliance guidelines</p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
          </span>
          Queue Status: 3 Pending
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Evaluation Worklist */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Evaluation Worklist</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>Select row to open audio player</span>
                <span className="bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300 font-bold text-slate-600">Enter</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold">Recording Detail</th>
                    <th className="px-6 py-3 font-semibold">Assigned Agent</th>
                    <th className="px-6 py-3 font-semibold">Duration</th>
                    <th className="px-6 py-3 font-semibold">Priority</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {PENDING_AUDITS.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">

                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-indigo-600 transition-colors" />
                          <span className="font-bold text-slate-800 block truncate max-w-xs">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pl-6">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Uploaded {item.date}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <User2 className="w-3 h-3 text-indigo-600" />
                          </div>
                          <span className="text-slate-700">{item.agent}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.duration}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getPriorityStyle(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/calls/${item.id}`}
                          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg font-bold transition-all text-[11px]"
                        >
                          <Play className="w-3 h-3 fill-white" />
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

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Evaluation Rubric</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Standard corporate evaluation metrics. Call audits are graded across 3 core sectors:
            </p>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Greeting & Disclosure', tag: 'Mandatory', tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                { label: 'Identity Security Checks', tag: 'Critical', tagColor: 'bg-rose-50 text-rose-700 border-rose-200' },
                { label: 'Professional Etiquette', tag: 'Graded (0–5)', tagColor: 'bg-slate-100 text-slate-600 border-slate-200' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 font-medium">{r.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${r.tagColor}`}>{r.tag}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Grading Guidelines
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
              {[
                'Open transcript and listen alongside audio.',
                'Toggle rubric checks as agent reads scripts.',
                'Add constructive coaching details.',
                'Sync notes to integrated CRM contacts.',
              ].map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {g}
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
              <span>Help Center</span>
              <HelpCircle className="w-3.5 h-3.5 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

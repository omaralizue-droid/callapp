'use client'

import { useState } from 'react'
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
  Settings,
} from 'lucide-react'
import ScorecardManager from './ScorecardManager'

interface Agent {
  firstName: string | null
  lastName: string | null
}

interface Call {
  id: string
  title: string | null
  filename: string
  duration: number
  createdAt: Date | string
  status: string
  agent?: Agent | null
}

interface Team {
  id: string
  name: string
  qaScorecardId: string | null
}

interface Scorecard {
  id: string
  name: string
  description: string | null
  version: number
  isArchived: boolean
  complianceItems: any
  softSkillItems: any
  parentId: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

interface QAGradingConsoleProps {
  pendingCalls: Call[]
  scorecards: Scorecard[]
  teams: Team[]
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function QAGradingConsole({ pendingCalls, scorecards, teams }: QAGradingConsoleProps) {
  const [activeTab, setActiveTab] = useState<'worklist' | 'templates'>('worklist')

  // Fallback demo audits if no database calls are pending
  const demoAudits = [
    {
      id: 'call-1',
      title: 'Outbound refund dispute negotiation',
      agent: 'Lisa Miller',
      duration: '04:12',
      date: 'Jun 28, 2026',
      priority: 'High',
    },
    {
      id: 'call-2',
      title: 'Inbound verification failure dispute',
      agent: 'David Kim',
      duration: '02:58',
      date: 'Jun 27, 2026',
      priority: 'Medium',
    },
    {
      id: 'call-3',
      title: 'Billing compliance check',
      agent: 'Sarah Connor',
      duration: '06:45',
      date: 'Jun 25, 2026',
      priority: 'Low',
    },
  ]

  const mappedCalls = pendingCalls.map((c) => ({
    id: c.id,
    title: c.title || c.filename,
    agent: c.agent ? `${c.agent.firstName} ${c.agent.lastName}` : 'Unassigned',
    duration: formatDuration(c.duration),
    date: new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    priority: c.status === 'PROCESSING' ? 'High' : 'Medium',
  }))

  const displayCalls = mappedCalls.length > 0 ? mappedCalls : demoAudits

  const getPriorityStyle = (priority: string) => {
    if (priority === 'High') return { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', color: '#fca5a5' }
    if (priority === 'Medium') return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#fcd34d' }
    return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#94a3b8' }
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-5 h-5" style={{ color: '#818cf8' }} />
          <div>
            <h1 className="text-xl font-bold text-white">QA Grading Console</h1>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
              Grade agent conversations against corporate compliance guidelines
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('worklist')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'worklist' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Grading Worklist
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'templates' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Scorecard Templates
          </button>
        </div>
      </div>

      {activeTab === 'worklist' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          
          {/* Evaluation Worklist */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(13,21,53,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-bold text-white">Evaluation Worklist</h3>
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#475569' }}>
                  <span>Select row to open audio player</span>
                  <span className="px-1.5 py-0.5 rounded border font-bold" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>Enter</span>
                </div>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {['Recording Detail', 'Assigned Agent', 'Duration', 'Priority', 'Action'].map(h => (
                        <th
                          key={h}
                          className={`px-6 py-3 font-semibold uppercase tracking-wider text-[10px] ${h === 'Action' ? 'text-right' : ''}`}
                          style={{ color: '#334155' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayCalls.map((item) => {
                      const priorityBadge = getPriorityStyle(item.priority)
                      return (
                        <tr
                          key={item.id}
                          className="transition-colors group hover:bg-white/[0.02]"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <td className="px-6 py-4 space-y-1">
                            <div className="flex items-center gap-2">
                              <FileAudio className="w-4 h-4 shrink-0 transition-colors" style={{ color: '#64748b' }} />
                              <span className="font-bold text-white block truncate max-w-xs">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono pl-6" style={{ color: '#475569' }}>
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Uploaded {item.date}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                  boxShadow: '0 0 8px rgba(79,70,229,0.4)',
                                }}
                              >
                                <User2 className="w-3 h-3 text-white" />
                              </div>
                              <span style={{ color: '#94a3b8' }}>{item.agent}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 font-mono" style={{ color: '#94a3b8' }}>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" style={{ color: '#334155' }} />
                              {item.duration}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                              style={{
                                  background: priorityBadge.bg,
                                  borderColor: priorityBadge.border,
                                  color: priorityBadge.color,
                              }}
                            >
                              {item.priority}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/dashboard/calls/${item.id}`}
                              className="inline-flex items-center gap-1.5 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all text-[11px] hover:scale-[1.02]"
                              style={{
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
                              }}
                            >
                              <Play className="w-3 h-3 fill-white" />
                              Audit
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'rgba(13,21,53,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h3 className="text-sm font-bold text-white">Evaluation Rubric</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: '#475569' }}>
                Standard corporate evaluation metrics. Call audits are graded across 3 core sectors:
              </p>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Greeting & Disclosure', tag: 'Mandatory', bg: 'rgba(79,70,229,0.15)', border: 'rgba(79,70,229,0.3)', color: '#818cf8' },
                  { label: 'Identity Security Checks', tag: 'Critical', bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', color: '#fca5a5' },
                  { label: 'Professional Etiquette', tag: 'Graded (0–5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#94a3b8' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <span className="font-medium text-white">{r.label}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{
                        background: r.bg,
                        borderColor: r.border,
                        color: r.color,
                      }}
                    >
                      {r.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'rgba(13,21,53,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#6ee7b7' }} />
                Grading Guidelines
              </h3>
              <ul className="space-y-2 text-[11px] leading-relaxed" style={{ color: '#475569' }}>
                {[
                  'Open transcript and listen alongside audio.',
                  'Toggle rubric checks as agent reads scripts.',
                  'Add constructive coaching details.',
                  'Sync notes to integrated CRM contacts.',
                ].map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        color: '#6ee7b7',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: '#94a3b8' }}>{g}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 flex justify-between items-center text-[10px]" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#334155' }}>
                <span>Help Center</span>
                <HelpCircle className="w-3.5 h-3.5 hover:text-indigo-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <ScorecardManager scorecards={scorecards} teams={teams} />
        </div>
      )}
    </div>
  )
}

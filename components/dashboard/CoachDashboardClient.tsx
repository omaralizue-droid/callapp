'use client'

import { useState } from 'react'
import {
  MessageSquare,
  VolumeX,
  Smile,
  FileText,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Search,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { AICoachReport, AICoachInsight } from '@/types/calls'

interface ParsedCoachCall {
  id: string
  title: string
  agentName: string
  createdAt: string
  aiCoachReport: AICoachReport | null
}

const MOCK_COACH_CALLS = [
  {
    id: 'call-1',
    title: 'Subscription Cancel Dispute',
    agentName: 'Alex Rodriguez',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    aiCoachReport: {
      detections: {
        interruptionsCount: 1,
        longSilencesCount: 1,
        wrongToneCount: 0,
        missedScriptCount: 0,
        missedComplianceCount: 0,
        details: [
          { type: 'interruption', timestamp: '0:16', seconds: 16, description: 'Agent Alex Rodriguez began speaking while customer Marcus was detailing credit card charge details.' },
          { type: 'silence', timestamp: '0:33', seconds: 33, description: 'Silent pause of 4.8 seconds during database contract lookups without status narration.' }
        ]
      },
      insights: [
        {
          id: 'ins-1',
          timestamp: '0:16',
          seconds: 16,
          originalTurn: 'I understand how unexpected charges can be alarming, Marcus. Let me look into this subscription renewal right away. Do not worry, we will resolve this.',
          coachingAdvice: 'Wait for the caller to finish speaking their request before offering technical reassurances. Talking over frustrated callers can heighten irritation.',
          betterResponse: 'I understand that an unexpected renewal charge of $499 can be surprising. Let me pull up your account contract terms immediately so we can review the renewal date.',
          rationale: 'Active listening requires giving the customer full speaking space, creating trust and calming compliance dispute dialogue.'
        }
      ]
    }
  },
  {
    id: 'call-2',
    title: 'Portal Card Rejected Inquiry',
    agentName: 'Lisa Miller',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    aiCoachReport: {
      detections: {
        interruptionsCount: 0,
        longSilencesCount: 2,
        wrongToneCount: 1,
        missedScriptCount: 1,
        missedComplianceCount: 1,
        details: [
          { type: 'silence', timestamp: '0:42', seconds: 42, description: 'Long silence of 6.5 seconds while manual billing gateway authorization was processing.' },
          { type: 'tone', timestamp: '0:13', seconds: 13, description: 'Agent Lisa used slightly monotone, scripted tone during security questions verification.' },
          { type: 'script', timestamp: '1:02', seconds: 62, description: 'Failed to mention key loyalty plan benefits renewal option explicitly.' },
          { type: 'compliance', timestamp: '0:03', seconds: 3, description: 'Missed standard outbound recording policy disclosure statement.' }
        ]
      },
      insights: [
        {
          id: 'ins-2',
          timestamp: '0:13',
          seconds: 13,
          originalTurn: 'Yes, I can process that manually. Can you confirm your invoice number and the last four digits of the billing card?',
          coachingAdvice: 'Verify sensitive caller credentials with a warm, supportive tone. Avoid sound patterns that feel robotic or checklist-driven, as they can cause defensive reactions.',
          betterResponse: 'I can definitely process that transaction manually for you. For security, would you mind verifying the invoice number and the last four digits of your credit card?',
          rationale: 'A warm and supportive tone during identification steps helps put the customer at ease and reduces verification friction.'
        },
        {
          id: 'ins-3',
          timestamp: '0:03',
          seconds: 3,
          originalTurn: 'Hello, thank you for calling. My name is Lisa. How may I assist?',
          coachingAdvice: 'Ensure you state the call monitoring and recording disclosure explicitly in the branded greeting to maintain regulatory compliance.',
          betterResponse: 'Hello, thank you for calling support. My name is Lisa. This call is monitored and recorded for quality. How may I assist you today?',
          rationale: 'Regulatory compliance mandates that callers are informed about call recording guidelines in the initial greeting.'
        }
      ]
    }
  },
  {
    id: 'call-3',
    title: 'Refund Request Escalation',
    agentName: 'David Kim',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    aiCoachReport: {
      detections: {
        interruptionsCount: 2,
        longSilencesCount: 0,
        wrongToneCount: 1,
        missedScriptCount: 0,
        missedComplianceCount: 0,
        details: [
          { type: 'interruption', timestamp: '0:28', seconds: 28, description: 'Agent David interrupted customer mid-sentence while they were discussing cancellation reasons.' },
          { type: 'tone', timestamp: '1:15', seconds: 75, description: 'Agent used slightly defensive tone when customer challenged the contract cancellation fee.' }
        ]
      },
      insights: [
        {
          id: 'ins-4',
          timestamp: '1:15',
          seconds: 75,
          originalTurn: 'Well, that cancellation fee is standard policy. You signed the annual agreement, so we have to apply the charge.',
          coachingAdvice: 'De-escalate fee disputes using policy alignment combined with empathy. Never use defensive or bureaucratic phrasing such as "you signed it" or "we have to apply it".',
          betterResponse: 'I understand cancellation fees are frustrating. This fee is part of our annual contract discount agreement, but let me check if we can adjust the final month or offer utility credits.',
          rationale: 'Validating frustration rather than reciting policy rules preserves rapport and leaves the customer open to negotiation.'
        }
      ]
    }
  }
]

interface CoachDashboardClientProps {
  initialCalls: ParsedCoachCall[]
  userRole: string
}

export default function CoachDashboardClient({ initialCalls, userRole }: CoachDashboardClientProps) {
  const [filter, setFilter] = useState<'all' | 'interruption' | 'silence' | 'tone' | 'script' | 'compliance'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const dbHasReports = initialCalls && initialCalls.length > 0 && initialCalls.some(c => (c.aiCoachReport?.insights?.length ?? 0) > 0)
  const calls = dbHasReports
    ? initialCalls.filter(c => c.aiCoachReport)
    : userRole === 'AGENT'
      ? MOCK_COACH_CALLS.filter(c => c.agentName === 'Alex Rodriguez')
      : MOCK_COACH_CALLS

  const totals = calls.reduce(
    (acc, call) => {
      const dets = call.aiCoachReport?.detections
      if (dets) {
        acc.interruptions += dets.interruptionsCount || 0
        acc.silences += dets.longSilencesCount || 0
        acc.tones += dets.wrongToneCount || 0
        acc.scripts += dets.missedScriptCount || 0
        acc.compliances += dets.missedComplianceCount || 0
      }
      acc.alerts += (call.aiCoachReport?.insights?.length || 0)
      return acc
    },
    { alerts: 0, interruptions: 0, silences: 0, tones: 0, scripts: 0, compliances: 0 }
  )

  const allInsights = calls.flatMap((call) => {
    const insights = call.aiCoachReport?.insights || []
    return insights.map((ins: AICoachInsight) => {
      let type: 'interruption' | 'silence' | 'tone' | 'script' | 'compliance' = 'tone'
      const advice = ins.coachingAdvice.toLowerCase()
      const original = ins.originalTurn.toLowerCase()
      if (advice.includes('interrupt') || original.includes('interrupt')) type = 'interruption'
      else if (advice.includes('silence') || advice.includes('pause')) type = 'silence'
      else if (advice.includes('compliance') || advice.includes('recording') || advice.includes('monitoring') || advice.includes('disclosure')) type = 'compliance'
      else if (advice.includes('script') || advice.includes('greeting') || advice.includes('standard')) type = 'script'
      return { ...ins, type, callId: call.id, callTitle: call.title, agentName: call.agentName, createdAt: call.createdAt }
    })
  })

  const filteredInsights = allInsights.filter((ins) => {
    const matchesTab = filter === 'all' || ins.type === filter
    const matchesSearch =
      ins.coachingAdvice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.betterResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.originalTurn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.callTitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const getFocusArea = () => {
    const counts = [
      { key: 'compliance', name: 'Compliance Policy Disclosure', count: totals.compliances },
      { key: 'interruption', name: 'Active Listening & Conversational Overlaps', count: totals.interruptions },
      { key: 'silence', name: 'Handling Dead Air & System Lookups', count: totals.silences },
      { key: 'tone', name: 'Empathetic Soft Skills & Tone Mismatch', count: totals.tones },
      { key: 'script', name: 'Dialogue Script Flow Adherence', count: totals.scripts },
    ]
    const highest = counts.sort((a, b) => b.count - a.count)[0]
    if (highest.count > 0) {
      return {
        title: `Priority Coaching: ${highest.name}`,
        description: `Your team has logged ${highest.count} coaching alerts related to this category. We recommend running an alignment session to review soft skills training.`,
        action: `Review details inside the ${highest.key === 'compliance' ? 'Compliance Gaps' : highest.key === 'interruption' ? 'Interruptions' : highest.key === 'silence' ? 'Long Silences' : highest.key === 'tone' ? 'Tone Gaps' : 'Missed Scripts'} tab below.`
      }
    }
    return {
      title: 'AI Coaching Target: Exceptional Grade Maintain',
      description: 'Zero high-priority soft skill gaps or script omissions have been logged. Keep up the high standard!',
      action: 'Monitor daily uploads for continuous QA audit compliance.'
    }
  }

  const focusArea = getFocusArea()

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const tabItems = [
    { key: 'all', name: 'Coaching Alerts', count: totals.alerts, icon: <Sparkles className="w-4 h-4 text-indigo-400" />, activeBg: 'rgba(79,70,229,0.15)', border: 'rgba(99,102,241,0.3)', glow: 'rgba(79,70,229,0.35)', textColor: '#818cf8' },
    { key: 'interruption', name: 'Interruptions', count: totals.interruptions, icon: <MessageSquare className="w-4 h-4 text-rose-400" />, activeBg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', glow: 'rgba(244,63,94,0.35)', textColor: '#fca5a5' },
    { key: 'silence', name: 'Long Silences', count: totals.silences, icon: <VolumeX className="w-4 h-4 text-amber-400" />, activeBg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', glow: 'rgba(245,158,11,0.35)', textColor: '#fcd34d' },
    { key: 'tone', name: 'Tone Gaps', count: totals.tones, icon: <Smile className="w-4 h-4 text-purple-400" />, activeBg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', glow: 'rgba(168,85,247,0.35)', textColor: '#c4b5fd' },
    { key: 'script', name: 'Missed Script', count: totals.scripts, icon: <FileText className="w-4 h-4 text-indigo-400" />, activeBg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', glow: 'rgba(99,102,241,0.35)', textColor: '#a5b4fc' },
    { key: 'compliance', name: 'Compliance Gaps', count: totals.compliances, icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />, activeBg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', glow: 'rgba(16,185,129,0.35)', textColor: '#6ee7b7' },
  ]

  return (
    <div className="space-y-6 text-xs select-none">

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#818cf8' }} />
            AI Coach & Speech Analytics
          </h2>
          <p className="text-[10px] mt-1" style={{ color: '#475569' }}>
            {userRole === 'AGENT'
              ? 'Review your personalized speech corrections, soft skill tips, and dialogue suggestions'
              : 'Audit workspace coaching alerts, conversation corrections, and soft skill improvements'}
          </p>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {tabItems.map((item) => {
          const isActive = filter === item.key
          return (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as typeof filter)}
              className="rounded-2xl p-4 text-left space-y-3 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: isActive ? item.activeBg : 'rgba(13,21,53,0.7)',
                borderColor: isActive ? item.border : 'rgba(255,255,255,0.07)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: isActive ? `0 0 20px ${item.glow}` : 'none',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-widest truncate" style={{ color: isActive ? '#94a3b8' : '#334155' }}>
                  {item.name.split(' ')[0]}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {item.icon}
                </div>
              </div>
              <span className="text-xl font-black block tracking-tight" style={{ color: isActive ? item.textColor : 'white' }}>
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 3. Priority Focus Block */}
      <div
        className="rounded-2xl p-5 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center border"
        style={{
          background: 'rgba(79,70,229,0.1)',
          borderColor: 'rgba(99,102,241,0.25)',
          boxShadow: '0 0 25px rgba(79,70,229,0.1)',
        }}
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 text-white text-[9px] font-black uppercase tracking-wider rounded-lg"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              Active Focus
            </span>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{focusArea.title}</h4>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: '#94a3b8' }}>{focusArea.description}</p>
        </div>
        <div
          className="text-[10px] font-bold italic font-mono shrink-0 select-none px-3.5 py-2 rounded-xl border"
          style={{
            background: 'rgba(79,70,229,0.15)',
            borderColor: 'rgba(99,102,241,0.3)',
            color: '#818cf8',
          }}
        >
          {focusArea.action}
        </div>
      </div>

      {/* 4. Tab Menu & Search */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
        <div className="flex border-b gap-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className="pb-2.5 text-xs font-bold transition-all relative cursor-pointer"
              style={{
                color: filter === tab.key ? '#818cf8' : '#475569',
              }}
            >
              {tab.name}
              {filter === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 w-full sm:w-64"
          style={{
            background: 'rgba(10,17,40,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: '#334155' }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coaching directives..."
            className="bg-transparent border-none text-[10px] placeholder-slate-600 outline-none text-white w-full"
          />
        </div>
      </div>

      {/* 5. Insight Cards */}
      <div className="space-y-4">
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => {
            let categoryLabel = 'Speech Audit Alert'
            let categoryBg = 'rgba(255,255,255,0.05)'
            let categoryBorder = 'rgba(255,255,255,0.1)'
            let categoryColor = '#94a3b8'

            if (insight.type === 'interruption') {
              categoryLabel = 'Interruption Detected'
              categoryBg = 'rgba(244,63,94,0.15)'
              categoryBorder = 'rgba(244,63,94,0.3)'
              categoryColor = '#fca5a5'
            } else if (insight.type === 'silence') {
              categoryLabel = 'Dead Air Silence'
              categoryBg = 'rgba(245,158,11,0.15)'
              categoryBorder = 'rgba(245,158,11,0.3)'
              categoryColor = '#fcd34d'
            } else if (insight.type === 'tone') {
              categoryLabel = 'Empathy / Tone Mismatch'
              categoryBg = 'rgba(168,85,247,0.15)'
              categoryBorder = 'rgba(168,85,247,0.3)'
              categoryColor = '#c4b5fd'
            } else if (insight.type === 'script') {
              categoryLabel = 'Script Directive Mismatch'
              categoryBg = 'rgba(99,102,241,0.15)'
              categoryBorder = 'rgba(99,102,241,0.3)'
              categoryColor = '#a5b4fc'
            } else if (insight.type === 'compliance') {
              categoryLabel = 'Monitored Compliance Gap'
              categoryBg = 'rgba(16,185,129,0.15)'
              categoryBorder = 'rgba(16,185,129,0.3)'
              categoryColor = '#6ee7b7'
            }

            return (
              <div
                key={insight.id}
                className="rounded-2xl p-5 space-y-4 transition-all duration-200"
                style={{
                  background: 'rgba(13,21,53,0.7)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4 flex-wrap pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border"
                        style={{
                          background: categoryBg,
                          borderColor: categoryBorder,
                          color: categoryColor,
                        }}
                      >
                        {categoryLabel}
                      </span>
                      <span
                        className="font-mono text-[9px] px-2 py-0.5 rounded border"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          borderColor: 'rgba(255,255,255,0.06)',
                          color: '#475569',
                        }}
                      >
                        Time offset: {insight.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <PhoneCall className="w-3.5 h-3.5" style={{ color: '#334155' }} />
                      <span className="font-bold text-white">Call: {insight.callTitle}</span>
                      <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
                      <span className="text-[10px]" style={{ color: '#475569' }}>{formatTime(insight.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {userRole !== 'AGENT' && (
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold block" style={{ color: '#334155' }}>Assigned Agent</span>
                        <span className="text-xs font-bold text-white block">{insight.agentName}</span>
                      </div>
                    )}
                    <Link
                      href={`/dashboard/calls/${insight.callId}`}
                      className="px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all text-[10px]"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(79,70,229,0.2)'
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                        e.currentTarget.style.color = '#818cf8'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" /> View Graded Call
                    </Link>
                  </div>
                </div>

                {/* Coaching grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest" style={{ color: '#334155' }}>Coaching Directive</span>
                      <p
                        className="leading-relaxed font-semibold text-[11px] p-3 rounded-xl border"
                        style={{
                          background: 'rgba(10,17,40,0.8)',
                          borderColor: 'rgba(255,255,255,0.06)',
                          color: '#cbd5e1',
                        }}
                      >
                        {insight.coachingAdvice}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest" style={{ color: '#334155' }}>Coaching Rationale</span>
                      <p className="leading-relaxed" style={{ color: '#94a3b8' }}>{insight.rationale}</p>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {/* Original Turn */}
                    <div
                      className="space-y-1 rounded-xl p-3.5 relative overflow-hidden border"
                      style={{
                        background: 'rgba(244,63,94,0.05)',
                        borderColor: 'rgba(244,63,94,0.15)',
                      }}
                    >
                      <div
                        className="absolute top-0 right-0 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-bl-lg border-b border-l"
                        style={{
                          background: 'rgba(244,63,94,0.1)',
                          borderColor: 'rgba(244,63,94,0.15)',
                          color: '#fca5a5',
                        }}
                      >
                        Original Turn
                      </div>
                      <span className="font-black uppercase tracking-wider text-[8px] block mb-1" style={{ color: '#f43f5e' }}>Agent Dialect</span>
                      <p className="italic line-through text-[11px] leading-relaxed select-none" style={{ color: '#fca5a5' }}>
                        &ldquo;{insight.originalTurn}&rdquo;
                      </p>
                    </div>
                    {/* Better Response */}
                    <div
                      className="space-y-1 rounded-xl p-3.5 relative overflow-hidden border"
                      style={{
                        background: 'rgba(16,185,129,0.05)',
                        borderColor: 'rgba(16,185,129,0.15)',
                      }}
                    >
                      <div
                        className="absolute top-0 right-0 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-bl-lg border-b border-l"
                        style={{
                          background: 'rgba(16,185,129,0.1)',
                          borderColor: 'rgba(16,185,129,0.15)',
                          color: '#6ee7b7',
                        }}
                      >
                        AI Recommended Response
                      </div>
                      <span className="font-black uppercase tracking-wider text-[8px] block mb-1" style={{ color: '#10b981' }}>Optimal Turn Suggestion</span>
                      <p className="font-semibold text-[11px] leading-relaxed" style={{ color: '#6ee7b7' }}>
                        &ldquo;{insight.betterResponse}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div
            className="p-10 rounded-2xl text-center border"
            style={{
              background: 'rgba(13,21,53,0.7)',
              borderColor: 'rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: '#475569' }} />
            </div>
            <p className="font-bold text-white">No coaching insights found.</p>
            <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Try adjusting the filter selection or search query.</p>
          </div>
        )}
      </div>

    </div>
  )
}

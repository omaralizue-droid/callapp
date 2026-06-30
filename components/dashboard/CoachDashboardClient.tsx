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

// High-fidelity fallback seed data for demonstration
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

  // Determine if database contains populated reports; if not, merge or fall back to high-fidelity mocks
  const dbHasReports = initialCalls && initialCalls.length > 0 && initialCalls.some(c => (c.aiCoachReport?.insights?.length ?? 0) > 0)
  
  const calls = dbHasReports 
    ? initialCalls.filter(c => c.aiCoachReport)
    : userRole === 'AGENT' 
      ? MOCK_COACH_CALLS.filter(c => c.agentName === 'Alex Rodriguez')
      : MOCK_COACH_CALLS

  // Aggregate metrics from all calls
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

  // Compile all insights into a single chronological array
  const allInsights = calls.flatMap((call) => {
    const insights = call.aiCoachReport?.insights || []
    return insights.map((ins: AICoachInsight) => {
      // Determine type of insight based on category keyword matching
      let type: 'interruption' | 'silence' | 'tone' | 'script' | 'compliance' = 'tone'
      const advice = ins.coachingAdvice.toLowerCase()
      const original = ins.originalTurn.toLowerCase()

      if (advice.includes('interrupt') || original.includes('interrupt')) {
        type = 'interruption'
      } else if (advice.includes('silence') || advice.includes('pause')) {
        type = 'silence'
      } else if (advice.includes('compliance') || advice.includes('recording') || advice.includes('monitoring') || advice.includes('disclosure')) {
        type = 'compliance'
      } else if (advice.includes('script') || advice.includes('greeting') || advice.includes('standard')) {
        type = 'script'
      }

      return {
        ...ins,
        type,
        callId: call.id,
        callTitle: call.title,
        agentName: call.agentName,
        createdAt: call.createdAt
      }
    })
  })

  // Filter insights by tab and search query
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

  // Determine focus directive
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

  // Format time
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* 1. Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            AI Coach & Speech Analytics
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">
            {userRole === 'AGENT'
              ? 'Review your personalized speech corrections, soft skill tips, and dialogue suggestions'
              : 'Audit workspace coaching alerts, conversation corrections, and soft skill improvements'}
          </p>
        </div>
      </div>

      {/* 2. Aggregate Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { key: 'all', name: 'Coaching Alerts', count: totals.alerts, icon: <Sparkles className="w-4 h-4 text-cyan-400" />, color: 'border-cyan-500/10 hover:border-cyan-500/30' },
          { key: 'interruption', name: 'Interruptions', count: totals.interruptions, icon: <MessageSquare className="w-4 h-4 text-rose-400" />, color: 'border-rose-500/10 hover:border-rose-500/30' },
          { key: 'silence', name: 'Long Silences', count: totals.silences, icon: <VolumeX className="w-4 h-4 text-amber-400" />, color: 'border-amber-500/10 hover:border-amber-500/30' },
          { key: 'tone', name: 'Tone Gaps', count: totals.tones, icon: <Smile className="w-4 h-4 text-purple-400" />, color: 'border-purple-500/10 hover:border-purple-500/30' },
          { key: 'script', name: 'Missed Script', count: totals.scripts, icon: <FileText className="w-4 h-4 text-indigo-400" />, color: 'border-indigo-500/10 hover:border-indigo-500/30' },
          { key: 'compliance', name: 'Compliance Gaps', count: totals.compliances, icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />, color: 'border-emerald-500/10 hover:border-emerald-500/30' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as typeof filter)}
            className={`glass rounded-xl p-4 border text-left space-y-3 cursor-pointer transition-all duration-300 ${
              filter === item.key
                ? 'bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-950/20 scale-[1.02]'
                : `bg-slate-900/10 ${item.color}`
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider truncate">{item.name}</span>
              <div className="w-6 h-6 bg-slate-950/50 rounded-lg flex items-center justify-center border border-white/5">
                {item.icon}
              </div>
            </div>
            <span className="text-xl font-black text-white block tracking-tight">{item.count}</span>
          </button>
        ))}
      </div>

      {/* 3. Priority Recommendation Block */}
      <div className="glass rounded-xl p-5 border border-cyan-500/10 bg-cyan-950/[0.01] flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-cyan-500 text-slate-950 text-[9px] font-black uppercase tracking-wider rounded">
              Active Focus
            </span>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{focusArea.title}</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">{focusArea.description}</p>
        </div>
        <div className="text-[10px] font-bold text-cyan-400 italic font-mono shrink-0 select-none bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/5">
          {focusArea.action}
        </div>
      </div>

      {/* 4. Insight Search & Tab Menu */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
        
        {/* Navigation Tab links */}
        <div className="flex border-b border-white/5 gap-5">
          {[
            { id: 'all', name: 'All Alerts' },
            { id: 'interruption', name: 'Interruptions' },
            { id: 'silence', name: 'Long Silences' },
            { id: 'tone', name: 'Tone Gaps' },
            { id: 'script', name: 'Missed Script' },
            { id: 'compliance', name: 'Compliance Gaps' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                filter === tab.id
                  ? 'text-cyan-400 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.name}
              {filter === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 animate-fade-in" />
              )}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coaching directives..."
            className="bg-transparent border-none text-[10px] placeholder-slate-500 outline-none text-white w-full"
          />
        </div>

      </div>

      {/* 5. Insight Corrections List */}
      <div className="space-y-4">
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => {
            
            // Format tag colors
            let categoryLabel = 'Speech Audit Alert'
            let categoryBg = 'bg-slate-800 text-slate-300 border-white/5'
            if (insight.type === 'interruption') {
              categoryLabel = 'Interruption Detected'
              categoryBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            } else if (insight.type === 'silence') {
              categoryLabel = 'Dead Air Silence'
              categoryBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            } else if (insight.type === 'tone') {
              categoryLabel = 'Empathy / Tone Mismatch'
              categoryBg = 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            } else if (insight.type === 'script') {
              categoryLabel = 'Script Directive Mismatch'
              categoryBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            } else if (insight.type === 'compliance') {
              categoryLabel = 'Monitored Compliance Gap'
              categoryBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }

            return (
              <div key={insight.id} className="glass rounded-xl p-5 border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                
                {/* Header info */}
                <div className="flex justify-between items-start gap-4 flex-wrap border-b border-white/5 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${categoryBg}`}>
                        {categoryLabel}
                      </span>
                      <span className="bg-slate-900 text-slate-400 font-mono text-[9px] px-2 py-0.5 rounded border border-white/5">
                        Time offset: {insight.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-1">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold text-slate-300">Call: {insight.callTitle}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{formatTime(insight.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {userRole !== 'AGENT' && (
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Assigned Agent</span>
                        <span className="text-xs font-bold text-white block">{insight.agentName}</span>
                      </div>
                    )}

                    <Link
                      href={`/dashboard/calls/${insight.callId}`}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/5 font-bold flex items-center gap-1.5 transition-all text-[10px]"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Graded Call
                    </Link>
                  </div>
                </div>

                {/* Coaching content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  
                  {/* Left Column: Directive & Rationale */}
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Coaching Directive</span>
                      <p className="text-slate-200 leading-relaxed font-bold text-[11px] bg-slate-950/40 p-3 rounded-xl border border-white/5">
                        {insight.coachingAdvice}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Coaching Rationale (Why it matters)</span>
                      <p className="text-slate-400 leading-relaxed">
                        {insight.rationale}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Comparative dialogue corrections */}
                  <div className="space-y-3.5">
                    
                    {/* Original Response */}
                    <div className="space-y-1 bg-rose-500/[0.01] border border-rose-500/10 rounded-xl p-3.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-rose-500/10 border-b border-l border-rose-500/20 text-rose-400 text-[8px] font-black uppercase tracking-wider rounded-bl-lg">
                        Original Turn
                      </div>
                      <span className="text-rose-500/80 font-black uppercase tracking-wider text-[8px] block mb-1">
                        Agent Dialect
                      </span>
                      <p className="text-slate-400 italic line-through text-[11px] leading-relaxed select-none">
                        &ldquo;{insight.originalTurn}&rdquo;
                      </p>
                    </div>

                    {/* Better Suggested Response */}
                    <div className="space-y-1 bg-green-500/[0.01] border border-green-500/10 rounded-xl p-3.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-green-500/10 border-b border-l border-green-500/20 text-green-400 text-[8px] font-black uppercase tracking-wider rounded-bl-lg">
                        AI Recommended Response
                      </div>
                      <span className="text-green-400 font-black uppercase tracking-wider text-[8px] block mb-1">
                        Optimal Turn Suggestion
                      </span>
                      <p className="text-slate-200 font-semibold text-[11px] leading-relaxed">
                        &ldquo;{insight.betterResponse}&rdquo;
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )
          })
        ) : (
          <div className="glass rounded-xl p-8 border border-white/5 text-center text-slate-500">
            No coaching insights found matching the filter selection or search query.
          </div>
        )}
      </div>

    </div>
  )
}

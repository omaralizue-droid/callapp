'use client'

import { useState } from 'react'
import {
  Clock,
  User2,
  ArrowUpDown,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FilterX,
} from 'lucide-react'
import Link from 'next/link'
import { CallRecord } from '@/types/calls'

interface CallsHistoryClientProps {
  calls: CallRecord[]
}

export default function CallsHistoryClient({ calls: initialCalls }: CallsHistoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [qaFilter, setQaFilter] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'score' | 'sentiment' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const agents = Array.from(
    new Map(
      initialCalls
        .filter(c => c.agent)
        .map(c => [c.agent!.id, c.agent!])
    ).values()
  )

  const handleQuickQuery = (queryText: string) => setSearchQuery(queryText)

  const clearAllFilters = () => {
    setSearchQuery('')
    setQaFilter('')
    setSentimentFilter('')
    setAgentFilter('')
    setStartDate('')
    setEndDate('')
  }

  const filteredCalls = initialCalls.filter(call => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      if (q.includes('angry') || q.includes('mad') || q.includes('frustrated') || q.includes('upset')) {
        const overallNegative = call.analysis?.sentimentOverall === 'NEGATIVE'
        const hasAngryEmotion = call.analysis?.transcript?.some(
          s => s.speaker === 'Customer' && (s.emotion === 'Angry' || s.emotion === 'Frustrated')
        )
        if (!overallNegative && !hasAngryEmotion) return false
      } else if (q.includes('refund') || q.includes('money') || q.includes('chargeback') || q.includes('billing')) {
        const inPurpose = call.crmNote?.callPurpose?.toLowerCase().includes('refund') || call.crmNote?.callPurpose?.toLowerCase().includes('billing') || false
        const inIssue = call.crmNote?.issue?.toLowerCase().includes('refund') || call.crmNote?.issue?.toLowerCase().includes('billing') || false
        const inSummary = call.analysis?.summary?.toLowerCase().includes('refund') || call.analysis?.summary?.toLowerCase().includes('billing') || false
        const inTitle = (call.title || call.filename).toLowerCase().includes('refund') || (call.title || call.filename).toLowerCase().includes('billing')
        const inTranscript = call.analysis?.transcript?.some(s => s.text.toLowerCase().includes('refund') || s.text.toLowerCase().includes('billing')) || false
        if (!inPurpose && !inIssue && !inSummary && !inTitle && !inTranscript) return false
      } else if (q.includes('low qa') || q.includes('failed qa') || q.includes('needs coaching')) {
        const score = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
        if (score === null || score >= 80) return false
      } else if (q.includes('compliance failure') || q.includes('missed compliance') || q.includes('non-compliant')) {
        const qaReport = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0] : null
        if (!qaReport) return false
        const greetingScore = qaReport.checklist?.greeting?.score ?? 100
        const verificationScore = qaReport.checklist?.verification?.score ?? 100
        const complianceScore = qaReport.checklist?.compliance?.score ?? 100
        if (greetingScore >= 80 && verificationScore >= 80 && complianceScore >= 80) return false
      } else {
        const inTitle = (call.title || call.filename).toLowerCase().includes(q)
        const inAgent = call.agent ? `${call.agent.firstName} ${call.agent.lastName}`.toLowerCase().includes(q) : false
        const inCustomer = (call.customerName || '').toLowerCase().includes(q)
        const inCustomerId = (call.customerId || '').toLowerCase().includes(q)
        const inSummary = call.analysis?.summary?.toLowerCase().includes(q) || false
        const inPurpose = call.crmNote?.callPurpose?.toLowerCase().includes(q) || false
        const inTranscript = call.analysis?.transcript?.some(s => s.text.toLowerCase().includes(q)) || false
        if (!inTitle && !inAgent && !inCustomer && !inCustomerId && !inSummary && !inPurpose && !inTranscript) return false
      }
    }

    const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
    if (qaFilter === '90' && (qaScore === null || qaScore < 90)) return false
    if (qaFilter === '80' && (qaScore === null || qaScore < 80)) return false
    if (qaFilter === 'fail' && (qaScore === null || qaScore >= 80)) return false

    const sentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'
    if (sentimentFilter && sentiment !== sentimentFilter) return false
    if (agentFilter && call.agentId !== agentFilter) return false

    const callDate = new Date(call.createdAt)
    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      if (callDate < start) return false
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      if (callDate > end) return false
    }
    return true
  })

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    let aVal: string | number = ''
    let bVal: string | number = ''
    if (sortBy === 'title') { aVal = a.title || a.filename; bVal = b.title || b.filename }
    else if (sortBy === 'duration') { aVal = a.duration; bVal = b.duration }
    else if (sortBy === 'score') {
      aVal = a.qaReports && a.qaReports.length > 0 ? a.qaReports[0].score : -1
      bVal = b.qaReports && b.qaReports.length > 0 ? b.qaReports[0].score : -1
    } else if (sortBy === 'sentiment') {
      aVal = a.analysis?.sentimentOverall || 'NEUTRAL'
      bVal = b.analysis?.sentimentOverall || 'NEUTRAL'
    } else {
      aVal = new Date(a.createdAt).getTime()
      bVal = new Date(b.createdAt).getTime()
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: 'title' | 'duration' | 'score' | 'sentiment' | 'date') => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortOrder('desc') }
  }

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60)
    const remaining = Math.round(sec % 60)
    return `${min}m ${remaining.toString().padStart(2, '0')}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }
    if (score >= 80) return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#fcd34d' }
    return { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', color: '#fca5a5' }
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }
      case 'NEGATIVE': return { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', color: '#fca5a5' }
      default:         return { bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)', color: '#94a3b8' }
    }
  }

  return (
    <div className="space-y-6 text-xs select-none">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Call History Logs</h2>
          <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Browse, filter, and review analyzed call records</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
          }}
        >
          Process New Call
        </Link>
      </div>

      {/* AI Search & Filters Block */}
      <div className="space-y-4">
        <div
          className="p-5 rounded-2xl space-y-4"
          style={{
            background: 'rgba(13,21,53,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* AI Search Bar */}
            <div
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 flex-grow"
              style={{
                background: 'rgba(10,17,40,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ask AI (e.g. 'Show angry customers', 'Show refund calls', 'Needs coaching')..."
                className="bg-transparent border-none text-[11px] placeholder-slate-600 outline-none text-white w-full font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white transition-colors font-semibold">
                  Clear
                </button>
              )}
            </div>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-primary)',
              }}
            >
              Filters
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            {/* Clear All Button */}
            {(searchQuery || qaFilter || sentimentFilter || agentFilter || startDate || endDate) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                style={{
                  background: 'rgba(244,63,94,0.15)',
                  border: '1px solid rgba(244,63,94,0.3)',
                  color: '#fca5a5',
                }}
              >
                <FilterX className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* AI Quick Query Pills */}
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">AI Quick Queries</span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                onClick={() => handleQuickQuery('Show angry customers')}
                className="bg-rose-950/20 border border-rose-500/20 hover:bg-rose-950/40 text-rose-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] text-[10px]"
              >
                <span>🔴</span> Angry Customers
              </button>
              <button
                onClick={() => handleQuickQuery('Show refund calls')}
                className="bg-amber-950/20 border border-amber-500/20 hover:bg-amber-950/40 text-amber-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] text-[10px]"
              >
                <span>💰</span> Refund Disputes
              </button>
              <button
                onClick={() => handleQuickQuery('Show low QA')}
                className="bg-indigo-950/20 border border-indigo-500/20 hover:bg-indigo-950/40 text-indigo-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] text-[10px]"
              >
                <span>⚠️</span> Low QA Scores (&lt;80%)
              </button>
              <button
                onClick={() => handleQuickQuery('Show compliance failures')}
                className="bg-purple-950/20 border border-purple-500/20 hover:bg-purple-950/40 text-purple-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] text-[10px]"
              >
                <span>❌</span> Compliance Failures
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvanced && (
          <div
            className="p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#475569' }}>Agent</label>
              <select
                value={agentFilter}
                onChange={e => setAgentFilter(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-white outline-none text-xs"
                style={{
                  background: 'rgba(10,17,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <option value="" style={{ background: '#0a1128', color: '#64748b' }}>All Agents</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id} style={{ background: '#0a1128', color: 'white' }}>{agent.firstName} {agent.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#475569' }}>QA Score Threshold</label>
              <select
                value={qaFilter}
                onChange={e => setQaFilter(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-white outline-none text-xs"
                style={{
                  background: 'rgba(10,17,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <option value="" style={{ background: '#0a1128', color: '#64748b' }}>All QA Scores</option>
                <option value="90" style={{ background: '#0a1128', color: 'white' }}>Excellent (≥ 90%)</option>
                <option value="80" style={{ background: '#0a1128', color: 'white' }}>Satisfactory (≥ 80%)</option>
                <option value="fail" style={{ background: '#0a1128', color: 'white' }}>Needs Coaching (&lt; 80%)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#475569' }}>Overall Sentiment</label>
              <select
                value={sentimentFilter}
                onChange={e => setSentimentFilter(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-white outline-none text-xs"
                style={{
                  background: 'rgba(10,17,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <option value="" style={{ background: '#0a1128', color: '#64748b' }}>All Sentiments</option>
                <option value="POSITIVE" style={{ background: '#0a1128', color: 'white' }}>Positive</option>
                <option value="NEUTRAL" style={{ background: '#0a1128', color: 'white' }}>Neutral</option>
                <option value="NEGATIVE" style={{ background: '#0a1128', color: 'white' }}>Negative</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#475569' }}>Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl px-2 py-2 text-white outline-none select-text text-xs"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
                <span className="text-slate-400 font-bold">•</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full rounded-xl px-2 py-2 text-white outline-none select-text text-xs"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="overflow-x-auto text-xs">
          {sortedCalls.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th className="px-6 py-3 font-semibold">
                    <span onClick={() => handleSort('title')} className="flex items-center gap-1 cursor-pointer hover:text-white" style={{ color: '#334155' }}>
                      Recording Title <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold" style={{ color: '#334155' }}>Agent</th>
                  <th className="px-6 py-3 font-semibold">
                    <span onClick={() => handleSort('duration')} className="flex items-center gap-1 cursor-pointer hover:text-white" style={{ color: '#334155' }}>
                      Duration <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    <span onClick={() => handleSort('score')} className="flex items-center gap-1 cursor-pointer hover:text-white" style={{ color: '#334155' }}>
                      QA Score <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    <span onClick={() => handleSort('sentiment')} className="flex items-center gap-1 cursor-pointer hover:text-white" style={{ color: '#334155' }}>
                      Sentiment <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    <span onClick={() => handleSort('date')} className="flex items-center gap-1 cursor-pointer hover:text-white" style={{ color: '#334155' }}>
                      Processed Date <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sortedCalls.map(call => {
                  const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
                  const overallSentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'
                  const scoreBadge = qaScore !== null ? getScoreColor(qaScore) : null
                  const sentBadge = getSentimentBadge(overallSentiment)
                  return (
                    <tr
                      key={call.id}
                      className="transition-colors group animate-fade-in"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79,70,229,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-[220px] truncate">
                          <span className="font-bold text-white block truncate group-hover:text-indigo-400 transition-colors">
                            {call.title || call.filename}
                          </span>
                          <span className="text-[10px] block mt-0.5" style={{ color: '#475569' }}>
                            CRM ID: {call.customerId || 'N/A'} • {call.customerName || 'Anonymous'}
                          </span>
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
                          <span className="font-medium" style={{ color: '#94a3b8' }}>
                            {call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono" style={{ color: '#475569' }}>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" style={{ color: '#334155' }} />
                          <span>{formatDuration(call.duration)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {scoreBadge ? (
                          <span
                            className="px-2.5 py-1 rounded-full border font-bold"
                            style={{
                              background: scoreBadge.bg,
                              borderColor: scoreBadge.border,
                              color: scoreBadge.color,
                            }}
                          >
                            {qaScore}%
                          </span>
                        ) : (
                          <span style={{ color: '#334155' }}>Unscored</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full border font-bold"
                          style={{
                            background: sentBadge.bg,
                            borderColor: sentBadge.border,
                            color: sentBadge.color,
                          }}
                        >
                          {overallSentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px]" style={{ color: '#475569' }}>
                        {new Date(call.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="inline-block px-3 py-1.5 rounded-xl font-bold transition-all text-[11px]"
                          style={{
                            background: 'rgba(79,70,229,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            color: '#818cf8',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.3)'
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.15)'
                          }}
                        >
                          Audit Details
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center" style={{ color: '#334155' }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#475569' }} />
              </div>
              <p className="font-bold text-white">No matching call logs found.</p>
              <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Try adjusting your query or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

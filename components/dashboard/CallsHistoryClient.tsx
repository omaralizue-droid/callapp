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
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('')
  const [qaFilter, setQaFilter] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Advanced Filters toggle
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Sort state
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'score' | 'sentiment' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Derive unique agents list from initialCalls
  const agents = Array.from(
    new Map(
      initialCalls
        .filter(c => c.agent)
        .map(c => [c.agent!.id, c.agent!])
    ).values()
  )

  // AI Quick Queries Handler
  const handleQuickQuery = (queryText: string) => {
    setSearchQuery(queryText)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setQaFilter('')
    setSentimentFilter('')
    setAgentFilter('')
    setStartDate('')
    setEndDate('')
  }

  // Filter Compilation
  const filteredCalls = initialCalls.filter(call => {
    // 1. Text Search & Semantic Compiler
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()

      // Semantic compiler: "Show angry customers."
      if (q.includes('angry') || q.includes('mad') || q.includes('frustrated') || q.includes('upset')) {
        const overallNegative = call.analysis?.sentimentOverall === 'NEGATIVE'
        const hasAngryEmotion = call.analysis?.transcript?.some(
          s => s.speaker === 'Customer' && (s.emotion === 'Angry' || s.emotion === 'Frustrated')
        )
        if (!overallNegative && !hasAngryEmotion) return false
      }
      
      // Semantic compiler: "Show refund calls."
      else if (q.includes('refund') || q.includes('money') || q.includes('chargeback') || q.includes('billing')) {
        const inPurpose = call.crmNote?.callPurpose?.toLowerCase().includes('refund') || call.crmNote?.callPurpose?.toLowerCase().includes('billing') || false
        const inIssue = call.crmNote?.issue?.toLowerCase().includes('refund') || call.crmNote?.issue?.toLowerCase().includes('billing') || false
        const inSummary = call.analysis?.summary?.toLowerCase().includes('refund') || call.analysis?.summary?.toLowerCase().includes('billing') || false
        const inTitle = (call.title || call.filename).toLowerCase().includes('refund') || (call.title || call.filename).toLowerCase().includes('billing')
        const inTranscript = call.analysis?.transcript?.some(s => s.text.toLowerCase().includes('refund') || s.text.toLowerCase().includes('billing')) || false
        if (!inPurpose && !inIssue && !inSummary && !inTitle && !inTranscript) return false
      }
      
      // Semantic compiler: "Show low QA."
      else if (q.includes('low qa') || q.includes('failed qa') || q.includes('needs coaching')) {
        const score = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
        if (score === null || score >= 80) return false
      }
      
      // Semantic compiler: "Show compliance failures."
      else if (q.includes('compliance failure') || q.includes('missed compliance') || q.includes('non-compliant')) {
        const qaReport = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0] : null
        if (!qaReport) return false
        const greetingScore = qaReport.checklist?.greeting?.score ?? 100
        const verificationScore = qaReport.checklist?.verification?.score ?? 100
        const complianceScore = qaReport.checklist?.compliance?.score ?? 100
        if (greetingScore >= 80 && verificationScore >= 80 && complianceScore >= 80) return false
      }

      // Fuzzy Multi-Field Search fallback
      else {
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

    // 2. QA Threshold filter
    const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
    if (qaFilter === '90' && (qaScore === null || qaScore < 90)) return false
    if (qaFilter === '80' && (qaScore === null || qaScore < 80)) return false
    if (qaFilter === 'fail' && (qaScore === null || qaScore >= 80)) return false

    // 3. Sentiment filter
    const sentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'
    if (sentimentFilter && sentiment !== sentimentFilter) return false

    // 4. Agent filter
    if (agentFilter && call.agentId !== agentFilter) return false

    // 5. Date range filter
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

  // Sort Compilation
  const sortedCalls = [...filteredCalls].sort((a, b) => {
    let aVal: string | number = ''
    let bVal: string | number = ''

    if (sortBy === 'title') {
      aVal = a.title || a.filename
      bVal = b.title || b.filename
    } else if (sortBy === 'duration') {
      aVal = a.duration
      bVal = b.duration
    } else if (sortBy === 'score') {
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
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60)
    const remaining = Math.round(sec % 60)
    return `${min}m ${remaining.toString().padStart(2, '0')}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/10 text-green-400 border-green-500/20'
    if (score >= 80) return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'NEGATIVE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  return (
    <div className="space-y-6 text-xs select-none">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Call History Logs</h2>
          <p className="text-[10px] text-slate-500 mt-1">Browse, filter, and review analyzed call records</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-transform hover:scale-105"
        >
          Process New Call
        </Link>
      </div>

      {/* AI Search & Filters Block */}
      <div className="space-y-4">
        {/* Main Search Input & Quick Pills */}
        <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* AI Search Bar */}
            <div className="flex items-center gap-2.5 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 flex-grow shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ask AI (e.g. 'Show angry customers', 'Show refund calls', 'Needs coaching')..."
                className="bg-transparent border-none text-[11px] placeholder-slate-500 outline-none text-white w-full font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-slate-900 border border-white/10 text-slate-300 hover:text-white px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer hover:bg-slate-800"
            >
              Filters
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Clear All Button */}
            {(searchQuery || qaFilter || sentimentFilter || agentFilter || startDate || endDate) && (
              <button
                onClick={clearAllFilters}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* AI Quick Query Recommendations */}
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">AI Quick Queries</span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                onClick={() => handleQuickQuery('Show angry customers')}
                className="bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:scale-[1.02] text-rose-400 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>🔴</span> Angry Customers
              </button>
              <button
                onClick={() => handleQuickQuery('Show refund calls')}
                className="bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:scale-[1.02] text-amber-400 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>💰</span> Refund Disputes
              </button>
              <button
                onClick={() => handleQuickQuery('Show low QA')}
                className="bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:scale-[1.02] text-indigo-400 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>⚠️</span> Low QA Scores (&lt;80%)
              </button>
              <button
                onClick={() => handleQuickQuery('Show compliance failures')}
                className="bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:scale-[1.02] text-purple-400 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>❌</span> Compliance Failures
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showAdvanced && (
          <div className="glass rounded-xl p-5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-3 duration-250">
            {/* Agent Filter */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Agent</label>
              <select
                value={agentFilter}
                onChange={e => setAgentFilter(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500"
              >
                <option value="">All Agents</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.firstName} {agent.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* QA Rating Threshold */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">QA score threshold</label>
              <select
                value={qaFilter}
                onChange={e => setQaFilter(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500"
              >
                <option value="">All QA Scores</option>
                <option value="90">Excellent (&ge; 90%)</option>
                <option value="80">Satisfactory (&ge; 80%)</option>
                <option value="fail">Needs Coaching (&lt; 80%)</option>
              </select>
            </div>

            {/* Sentiment */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Overall Sentiment</label>
              <select
                value={sentimentFilter}
                onChange={e => setSentimentFilter(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500"
              >
                <option value="">All Sentiments</option>
                <option value="POSITIVE">Positive</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="NEGATIVE">Negative</option>
              </select>
            </div>

            {/* Date range picker */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-2 py-2 outline-none focus:border-cyan-500 select-text"
                />
                <span className="text-slate-600 font-bold">•</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-2 py-2 outline-none focus:border-cyan-500 select-text"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          {sortedCalls.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5">
                  <th className="px-6 py-3 font-semibold">
                    <span
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Recording Title <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">Agent</th>
                  <th className="px-6 py-3 font-semibold">
                    <span
                      onClick={() => handleSort('duration')}
                      className="flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Duration <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    <span
                      onClick={() => handleSort('score')}
                      className="flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      QA Score <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    <span
                      onClick={() => handleSort('sentiment')}
                      className="flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Sentiment <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    <span
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Processed Date <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                    </span>
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedCalls.map(call => {
                  const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
                  const overallSentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'

                  return (
                    <tr key={call.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-[220px] truncate">
                          <span className="font-bold text-white block truncate hover:text-cyan-400 transition-colors">
                            {call.title || call.filename}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            CRM ID: {call.customerId || 'N/A'} • {call.customerName || 'Anonymous'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-[10px]">
                            <User2 className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="font-medium text-slate-300">
                            {call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDuration(call.duration)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {qaScore !== null ? (
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getScoreColor(qaScore)}`}>
                            {qaScore}%
                          </span>
                        ) : (
                          <span className="text-slate-500">Unscored</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSentimentBadge(overallSentiment)}`}>
                          {overallSentiment}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                        {new Date(call.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded border border-white/5 transition-all text-[11px] font-bold inline-block"
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
            <div className="p-8 text-center text-slate-500">
              No matching call logs found. Try adjusting your query or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

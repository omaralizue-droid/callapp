import Link from 'next/link'
import { PhoneCall, Award, Smile, AlertTriangle, ChevronRight, Clock, User2 } from 'lucide-react'
import { CallsService } from '@/services/calls'
import OverviewCharts from '@/components/dashboard/OverviewCharts'

export const revalidate = 0 // Disable cache for live updates

export default async function OverviewPage() {
  const analytics = await CallsService.getAnalytics()
  const recentCalls = await CallsService.getCalls(5)

  // Calculations for display
  const totalCalls = analytics.totalAnalyzed.toLocaleString()
  const averageQa = `${analytics.averageQa}%`
  const positiveSentiment = `${analytics.sentimentStats.positive}%`

  const stats = [
    {
      title: 'Calls Scored',
      value: totalCalls,
      change: '+12% this week',
      icon: <PhoneCall className="w-4 h-4 text-cyan-400" />,
      bg: 'bg-cyan-500/5',
      border: 'border-cyan-500/10',
    },
    {
      title: 'Average QA Score',
      value: averageQa,
      change: '+1.4% vs last week',
      icon: <Award className="w-4 h-4 text-indigo-400" />,
      bg: 'bg-indigo-500/5',
      border: 'border-indigo-500/10',
    },
    {
      title: 'Positive Sentiment',
      value: positiveSentiment,
      change: 'Steady brand health',
      icon: <Smile className="w-4 h-4 text-emerald-400" />,
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/10',
    },
    {
      title: 'Compliance Alerts',
      value: '2 Urgent',
      change: 'Requires agent coaching',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/10',
    },
  ]

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
    <div className="space-y-6">
      
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`glass rounded-xl p-5 border ${stat.border} ${stat.bg} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {stat.title}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white block tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Component */}
      <OverviewCharts qaTrend={analytics.qaTrend} volumeTrend={analytics.volumeTrend} />

      {/* Recent call records table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Audited Calls</h3>
            <p className="text-[10px] text-slate-500">Showing the latest voice recordings processed by CallPilot AI</p>
          </div>
          <Link
            href="/dashboard/calls"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group transition-all"
          >
            View History
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5">
                <th className="px-6 py-3 font-semibold">Call Recording</th>
                <th className="px-6 py-3 font-semibold">Agent</th>
                <th className="px-6 py-3 font-semibold">Duration</th>
                <th className="px-6 py-3 font-semibold">QA Score</th>
                <th className="px-6 py-3 font-semibold">Sentiment</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentCalls.map((call) => {
                const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
                const overallSentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'
                
                return (
                  <tr key={call.id} className="hover:bg-white/[0.01] transition-colors">
                    
                    {/* Filename & customer */}
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate">
                        <span className="font-bold text-white block truncate hover:text-cyan-400 transition-colors">
                          {call.title || call.filename}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          Customer: {call.customerName || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Agent details */}
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

                    {/* Duration */}
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDuration(call.duration)}</span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4">
                      {qaScore !== null ? (
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getScoreColor(qaScore)}`}>
                          {qaScore}%
                        </span>
                      ) : (
                        <span className="text-slate-500">Unscored</span>
                      )}
                    </td>

                    {/* Sentiment */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSentimentBadge(overallSentiment)}`}>
                        {overallSentiment}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                      {new Date(call.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Action link */}
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
        </div>

      </div>

    </div>
  )
}

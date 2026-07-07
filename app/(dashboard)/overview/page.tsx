// Dark-themed stat cards, table, and full dark overview page
import Link from 'next/link'
import { PhoneCall, Award, Smile, AlertTriangle, ChevronRight, Clock, User2, TrendingUp } from 'lucide-react'
import { CallsService } from '@/services/calls'
import OverviewCharts from '@/components/dashboard/OverviewCharts'

export const revalidate = 0

export default async function OverviewPage() {
  const analytics = await CallsService.getAnalytics()
  const recentCalls = await CallsService.getCalls(5)

  const totalCalls        = analytics.totalAnalyzed.toLocaleString()
  const averageQa         = `${analytics.averageQa}%`
  const positiveSentiment = `${analytics.sentimentStats.positive}%`

  const stats = [
    {
      title: 'Calls Scored',
      value: totalCalls,
      change: '+12% this week',
      icon: <PhoneCall className="w-5 h-5" />,
      gradient: 'from-indigo-500 to-violet-600',
      glow: 'rgba(79,70,229,0.3)',
      textColor: '#818cf8',
    },
    {
      title: 'Average QA Score',
      value: averageQa,
      change: '+1.4% vs last week',
      icon: <Award className="w-5 h-5" />,
      gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(124,58,237,0.3)',
      textColor: '#c4b5fd',
    },
    {
      title: 'Positive Sentiment',
      value: positiveSentiment,
      change: 'Steady brand health',
      icon: <Smile className="w-5 h-5" />,
      gradient: 'from-cyan-500 to-indigo-600',
      glow: 'rgba(6,182,212,0.3)',
      textColor: '#67e8f9',
    },
    {
      title: 'Compliance Alerts',
      value: '2 Urgent',
      change: 'Requires agent coaching',
      icon: <AlertTriangle className="w-5 h-5" />,
      gradient: 'from-rose-500 to-red-600',
      glow: 'rgba(244,63,94,0.3)',
      textColor: '#fca5a5',
    },
  ]

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60)
    const remaining = Math.round(sec % 60)
    return `${min}m ${remaining.toString().padStart(2, '0')}s`
  }

  const getScoreBadge = (score: number) => {
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
    <div className="space-y-6">

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <TrendingUp className="w-5 h-5" style={{ color: '#818cf8' }} />
        <div>
          <h1 className="text-xl font-bold text-white">Overview</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
            Your call center quality assurance metrics at a glance.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#334155' }}
              >
                {stat.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} text-white shrink-0`}
                style={{ boxShadow: `0 4px 15px ${stat.glow}` }}
              >
                {stat.icon}
              </div>
            </div>
            <div>
              <div
                className="text-2xl font-black"
                style={{ color: stat.textColor, textShadow: `0 0 20px ${stat.glow}` }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: '#334155' }}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <OverviewCharts qaTrend={analytics.qaTrend} volumeTrend={analytics.volumeTrend} />

      {/* Recent Calls Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(13,21,53,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Table Header */}
        <div
          className="px-6 py-4 flex justify-between items-center gap-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h3 className="text-sm font-bold text-white">Recent Audited Calls</h3>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
              Latest recordings processed by CallPilot AI
            </p>
          </div>
          <Link
            href="/dashboard/calls"
            className="text-xs font-bold flex items-center gap-1 transition-colors"
            style={{ color: '#818cf8' }}
          >
            View History <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Call Recording', 'Agent', 'Duration', 'QA Score', 'Sentiment', 'Date', ''].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3 font-semibold text-[10px] uppercase tracking-wider"
                    style={{ color: '#334155' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => {
                const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
                const overallSentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'
                const scoreBadge = qaScore !== null ? getScoreBadge(qaScore) : null
                const sentBadge = getSentimentBadge(overallSentiment)

                return (
                  <tr
                    key={call.id}
                    className="transition-colors group hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-5 py-4">
                      <div className="max-w-[200px]">
                        <div className="font-bold text-white truncate">
                          {call.title || call.filename}
                        </div>
                        <div className="text-[10px] truncate mt-0.5" style={{ color: '#475569' }}>
                          Customer: {call.customerName || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 font-mono" style={{ color: '#475569' }}>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: '#334155' }} />
                        <span>{formatDuration(call.duration)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: '#334155' }}>
                      {new Date(call.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/calls/${call.id}`}
                        className="inline-block px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 animate-fade-in"
                      >
                        Audit Details
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {recentCalls.length === 0 && (
            <div className="text-center py-16" style={{ color: '#334155' }}>
              <PhoneCall className="w-10 h-10 mx-auto mb-3" style={{ color: '#1e293b' }} />
              <p className="text-sm font-bold text-white">No calls yet</p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>
                Upload your first call recording to get started.
              </p>
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 4px 15px rgba(79,70,229,0.35)',
                }}
              >
                Upload Call
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { PhoneCall, Award, Smile, AlertTriangle, ChevronRight, Clock, User2 } from 'lucide-react'
import { CallsService } from '@/services/calls'
import OverviewCharts from '@/components/dashboard/OverviewCharts'

export const revalidate = 0

export default async function OverviewPage() {
  const analytics = await CallsService.getAnalytics()
  const recentCalls = await CallsService.getCalls(5)

  const totalCalls       = analytics.totalAnalyzed.toLocaleString()
  const averageQa        = `${analytics.averageQa}%`
  const positiveSentiment = `${analytics.sentimentStats.positive}%`

  const stats = [
    {
      title: 'Calls Scored',
      value: totalCalls,
      change: '+12% this week',
      icon: <PhoneCall className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Average QA Score',
      value: averageQa,
      change: '+1.4% vs last week',
      icon: <Award className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Positive Sentiment',
      value: positiveSentiment,
      change: 'Steady brand health',
      icon: <Smile className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Compliance Alerts',
      value: '2 Urgent',
      change: 'Requires agent coaching',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-50 border-rose-100',
    },
  ]

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60)
    const remaining = Math.round(sec % 60)
    return `${min}m ${remaining.toString().padStart(2, '0')}s`
  }

  const getScoreStyle = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (score >= 80) return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-rose-50 text-rose-700 border-rose-100'
  }

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'NEGATIVE': return 'bg-rose-50 text-rose-700 border-rose-100'
      default:         return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Your call center quality assurance metrics at a glance.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx}
            className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">{stat.value}</div>
              <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <OverviewCharts qaTrend={analytics.qaTrend} volumeTrend={analytics.volumeTrend} />

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Audited Calls</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest recordings processed by CallPilot AI</p>
          </div>
          <Link href="/dashboard/calls"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all"
          >
            View History <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                {['Call Recording', 'Agent', 'Duration', 'QA Score', 'Sentiment', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold text-[11px] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCalls.map((call) => {
                const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
                const overallSentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'

                return (
                  <tr key={call.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="max-w-[200px]">
                        <div className="font-bold text-slate-800 block truncate">
                          {call.title || call.filename}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate block mt-0.5">
                          Customer: {call.customerName || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <User2 className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDuration(call.duration)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {qaScore !== null ? (
                        <span className={`px-2.5 py-1 rounded-full border font-bold ${getScoreStyle(qaScore)}`}>
                          {qaScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400">Unscored</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full border font-bold ${getSentimentStyle(overallSentiment)}`}>
                        {overallSentiment}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-400">
                      {new Date(call.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/dashboard/calls/${call.id}`}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-1.5 rounded-lg border border-indigo-100/50 transition-all font-semibold inline-block"
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
            <div className="text-center py-16 text-slate-400 bg-white">
              <PhoneCall className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold">No calls yet</p>
              <p className="text-xs mt-1 text-slate-400">Upload your first call recording to get started.</p>
              <Link href="/dashboard/upload"
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
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

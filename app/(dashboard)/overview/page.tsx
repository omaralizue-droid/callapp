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

  // Google brand stat cards
  const stats = [
    {
      title: 'Calls Scored',
      value: totalCalls,
      change: '+12% this week',
      icon: <PhoneCall className="w-5 h-5" />,
      iconColor: '#1a73e8',
      iconBg: '#e8f0fe',
    },
    {
      title: 'Average QA Score',
      value: averageQa,
      change: '+1.4% vs last week',
      icon: <Award className="w-5 h-5" />,
      iconColor: '#34a853',
      iconBg: '#e6f4ea',
    },
    {
      title: 'Positive Sentiment',
      value: positiveSentiment,
      change: 'Steady brand health',
      icon: <Smile className="w-5 h-5" />,
      iconColor: '#f9ab00',
      iconBg: '#fef7e0',
    },
    {
      title: 'Compliance Alerts',
      value: '2 Urgent',
      change: 'Requires agent coaching',
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: '#ea4335',
      iconBg: '#fce8e6',
    },
  ]

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60)
    const remaining = Math.round(sec % 60)
    return `${min}m ${remaining.toString().padStart(2, '0')}s`
  }

  const getScoreStyle = (score: number) => {
    if (score >= 90) return { color: '#34a853', background: '#e6f4ea', border: '1px solid #34a85330' }
    if (score >= 80) return { color: '#f9ab00', background: '#fef7e0', border: '1px solid #f9ab0030' }
    return { color: '#ea4335', background: '#fce8e6', border: '1px solid #ea433530' }
  }

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return { color: '#34a853', background: '#e6f4ea', border: '1px solid #34a85330' }
      case 'NEGATIVE': return { color: '#ea4335', background: '#fce8e6', border: '1px solid #ea433530' }
      default:         return { color: '#5f6368', background: '#f1f3f4', border: '1px solid #dadce0' }
    }
  }

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--g-text, #202124)' }}>Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#5f6368' }}>Your call center performance at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx}
            className="rounded-2xl border p-5 flex flex-col gap-4 hover:shadow-md transition-all"
            style={{ background: 'var(--g-card, #ffffff)', borderColor: 'var(--g-border, #dadce0)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#5f6368' }}>
                {stat.title}
              </span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: stat.iconBg, color: stat.iconColor }}>
                {stat.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: stat.iconColor }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#5f6368' }}>{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <OverviewCharts qaTrend={analytics.qaTrend} volumeTrend={analytics.volumeTrend} />

      {/* Recent Calls Table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--g-card, #ffffff)', borderColor: 'var(--g-border, #dadce0)' }}
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center gap-4"
          style={{ borderColor: 'var(--g-border, #dadce0)', background: 'var(--g-surface, #f8f9fa)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#202124' }}>Recent Audited Calls</h3>
            <p className="text-xs mt-0.5" style={{ color: '#5f6368' }}>Latest recordings processed by CallPilot AI</p>
          </div>
          <Link href="/dashboard/calls"
            className="text-sm font-semibold flex items-center gap-1 transition-colors"
            style={{ color: '#1a73e8' }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: 'var(--g-surface, #f8f9fa)', borderBottom: '1px solid var(--g-border, #dadce0)' }}>
                {['Call Recording', 'Agent', 'Duration', 'QA Score', 'Sentiment', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold" style={{ color: '#5f6368' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => {
                const qaScore = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0].score : null
                const overallSentiment = call.analysis ? call.analysis.sentimentOverall : 'NEUTRAL'

                return (
                  <tr key={call.id} className="border-b transition-colors"
                    style={{ borderColor: 'var(--g-border, #dadce0)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--g-hover, #f8f9fa)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-5 py-4">
                      <div className="max-w-[200px]">
                        <div className="font-medium text-sm truncate" style={{ color: '#202124' }}>
                          {call.title || call.filename}
                        </div>
                        <div className="text-xs truncate mt-0.5" style={{ color: '#5f6368' }}>
                          {call.customerName || 'Unknown customer'}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: '#e8f0fe', color: '#1a73e8' }}>
                          <User2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm" style={{ color: '#202124' }}>
                          {call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-mono" style={{ color: '#5f6368' }}>
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(call.duration)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {qaScore !== null ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={getScoreStyle(qaScore)}>
                          {qaScore}%
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: '#9aa0a6' }}>Unscored</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={getSentimentStyle(overallSentiment)}>
                        {overallSentiment}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono" style={{ color: '#5f6368' }}>
                      {new Date(call.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/dashboard/calls/${call.id}`}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                        style={{ background: '#e8f0fe', color: '#1a73e8' }}
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {recentCalls.length === 0 && (
            <div className="text-center py-16">
              <PhoneCall className="w-10 h-10 mx-auto mb-3" style={{ color: '#dadce0' }} />
              <p className="text-sm font-medium" style={{ color: '#5f6368' }}>No calls yet</p>
              <p className="text-xs mt-1" style={{ color: '#9aa0a6' }}>Upload your first call recording to get started.</p>
              <Link href="/dashboard/upload"
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
                style={{ background: '#1a73e8' }}>
                Upload a call
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

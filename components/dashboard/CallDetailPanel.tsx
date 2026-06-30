'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  FileSpreadsheet,
  CheckCircle,
  Smile,
  Frown,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import { CallRecord, TranscriptSegment } from '@/types/calls'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'

interface CallDetailPanelProps {
  call: CallRecord
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { timestamp: string; speaker: string; emotion: string; text: string } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass bg-slate-950/90 rounded-xl p-3 border border-white/10 shadow-2xl text-[10px] space-y-1.5 max-w-[200px] text-left">
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <span className="font-bold text-slate-400">{data.timestamp}</span>
          <span className={`px-2 py-0.5 rounded-[4px] font-extrabold tracking-wide text-[9px] ${
            data.speaker === 'Customer' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-300'
          }`}>
            {data.speaker.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="font-medium text-slate-300">Emotion:</span>
          <span className={`font-black uppercase tracking-wider text-[9px] ${
            data.emotion === 'Happy' ? 'text-green-400' :
            data.emotion === 'Angry' ? 'text-rose-500' :
            data.emotion === 'Frustrated' ? 'text-amber-500 font-extrabold' :
            data.emotion === 'Confused' ? 'text-indigo-400' : 'text-slate-400'
          }`}>
            {data.emotion}
          </span>
        </div>
        <p className="text-slate-400 italic leading-normal border-t border-white/5 pt-1">&ldquo;{data.text}&rdquo;</p>
      </div>
    )
  }
}

interface CustomDotProps {
  cx?: number
  cy?: number
  payload?: {
    emotion: string
  }
}

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, payload } = props
  if (!cx || !cy || !payload) return null
  
  const emotion = payload.emotion
  let color = '#94a3b8' // Neutral
  if (emotion === 'Happy') color = '#22c55e'
  if (emotion === 'Angry') color = '#f43f5e'
  if (emotion === 'Frustrated') color = '#f59e0b'
  if (emotion === 'Confused') color = '#6366f1'
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={color}
      stroke="#0f172a"
      strokeWidth={1.5}
    />
  )
}


export default function CallDetailPanel({ call }: CallDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'coaching' | 'crm'>('overview')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isExported, setIsExported] = useState(call.crmNote?.exported || false)
  const [isExporting, setIsExporting] = useState(false)
  const [timelineFilter, setTimelineFilter] = useState<'customer' | 'both'>('customer')
  const [isCopied, setIsCopied] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [peaks, setPeaks] = useState<number[]>([])

  const generateFallbackPeaks = useCallback(() => {
    const mockPeaks = Array.from({ length: 60 }, (_, i) => {
      return 0.15 + Math.abs(Math.sin(i * 0.12)) * 0.6 + Math.random() * 0.15
    })
    setPeaks(mockPeaks)
  }, [])

  useEffect(() => {
    if (!call.fileUrl) {
      Promise.resolve().then(() => {
        generateFallbackPeaks()
      })
      return
    }

    fetch(call.fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Network error')
        return res.arrayBuffer()
      })
      .then(async (arrayBuffer) => {
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          if (!AudioContextClass) {
            Promise.resolve().then(() => generateFallbackPeaks())
            return
          }
          const audioCtx = new AudioContextClass()
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
          const channelData = audioBuffer.getChannelData(0)
          
          const segmentsCount = 60
          const segmentSize = Math.floor(channelData.length / segmentsCount)
          const extractedPeaks: number[] = []

          for (let i = 0; i < segmentsCount; i++) {
            let max = 0
            const start = i * segmentSize
            for (let j = 0; j < segmentSize; j++) {
              const val = Math.abs(channelData[start + j])
              if (val > max) max = val
            }
            extractedPeaks.push(max)
          }
          setPeaks(extractedPeaks)
          audioCtx.close()
        } catch {
          Promise.resolve().then(() => generateFallbackPeaks())
        }
      })
      .catch(() => {
        Promise.resolve().then(() => generateFallbackPeaks())
      })
  }, [call.fileUrl, generateFallbackPeaks])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || peaks.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    const duration = call.duration || 182
    const progressPercent = duration > 0 ? currentTime / duration : 0
    const activeIndex = Math.floor(peaks.length * progressPercent)

    const barWidth = 3
    const gap = 2
    const totalBarWidth = barWidth + gap
    const maxVal = Math.max(...peaks) || 1

    peaks.forEach((peak, index) => {
      const scaledHeight = (peak / maxVal) * (height - 8) || 2
      const x = index * totalBarWidth
      const y = (height - scaledHeight) / 2
      const isActive = index <= activeIndex

      ctx.fillStyle = isActive ? '#06b6d4' : '#1e293b'
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, scaledHeight, 1.5)
      ctx.fill()
    })
  }, [peaks, currentTime, call.duration])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const targetTime = percentage * (call.duration || 182)
    handleSeek(targetTime)
  }

  // Compliance items from QA checklist
  const qaReport = call.qaReports && call.qaReports.length > 0 ? call.qaReports[0] : null

  // Calculate raw transcript segments
  const rawTranscript = (call.analysis?.transcript as unknown as TranscriptSegment[] || [])

  // Calculate emotion stats for Customer turns
  const customerTurns = rawTranscript.filter(seg => seg.speaker === 'Customer')
  const totalCustomerTurns = customerTurns.length
  const emotionCounts = {
    Happy: 0,
    Neutral: 0,
    Confused: 0,
    Frustrated: 0,
    Angry: 0
  }
  customerTurns.forEach(seg => {
    const emotion = seg.emotion || 'Neutral'
    if (emotion in emotionCounts) {
      emotionCounts[emotion as keyof typeof emotionCounts]++
    } else {
      emotionCounts.Neutral++
    }
  })

  // Format sentiment progression chart data based on speaker filter
  const filteredTranscript = timelineFilter === 'customer' 
    ? rawTranscript.filter(seg => seg.speaker === 'Customer')
    : rawTranscript

  const chartData = filteredTranscript.map((seg, idx) => {
    let score = 0
    const emotion = seg.emotion || 'Neutral'
    if (emotion === 'Happy') score = 1.0
    if (emotion === 'Neutral') score = 0.0
    if (emotion === 'Confused') score = -0.2
    if (emotion === 'Frustrated') score = -0.7
    if (emotion === 'Angry') score = -1.0

    return {
      name: `Seg ${idx + 1}`,
      timestamp: `${Math.floor(seg.start / 60)}:${String(Math.floor(seg.start % 60)).padStart(2, '0')}`,
      speaker: seg.speaker,
      emotion: emotion,
      score: score,
      text: seg.text.length > 35 ? `${seg.text.substring(0, 35)}...` : seg.text
    }
  })

  // Find turning point segment in transcript
  const turningPointSegment = rawTranscript.find((seg) => seg.turningPoint)
  const turningPointIndex = rawTranscript.findIndex((seg) => seg.turningPoint)
  
  const turningPointTimestamp = turningPointSegment 
    ? `${Math.floor(turningPointSegment.start / 60)}:${String(Math.floor(turningPointSegment.start % 60)).padStart(2, '0')}`
    : null

  // Find customer's segment where emotion changed (first customer segment after the turning point)
  const customerChangeSegment = turningPointIndex !== -1
    ? rawTranscript.slice(turningPointIndex + 1).find(seg => seg.speaker === 'Customer')
    : null

  const customerChangeTimestamp = customerChangeSegment
    ? `${Math.floor(customerChangeSegment.start / 60)}:${String(Math.floor(customerChangeSegment.start % 60)).padStart(2, '0')}`
    : null

  // Dialogue turning point comparison
  let turningPointSummary = null
  if (turningPointIndex !== -1 && turningPointSegment) {
    const prevCustomer = rawTranscript.slice(0, turningPointIndex).reverse().find(s => s.speaker === 'Customer')
    const nextCustomer = rawTranscript.slice(turningPointIndex + 1).find(s => s.speaker === 'Customer')
    
    if (prevCustomer && nextCustomer) {
      turningPointSummary = {
        beforeEmotion: prevCustomer.emotion || 'Neutral',
        beforeText: prevCustomer.text,
        beforeTime: `${Math.floor(prevCustomer.start / 60)}:${String(Math.floor(prevCustomer.start % 60)).padStart(2, '0')}`,
        agentText: turningPointSegment.text,
        agentTime: `${Math.floor(turningPointSegment.start / 60)}:${String(Math.floor(turningPointSegment.start % 60)).padStart(2, '0')}`,
        agentStart: turningPointSegment.start,
        afterEmotion: nextCustomer.emotion || 'Neutral',
        afterText: nextCustomer.text,
        afterTime: `${Math.floor(nextCustomer.start / 60)}:${String(Math.floor(nextCustomer.start % 60)).padStart(2, '0')}`,
      }
    }
  }

  // CRM Ticket generation logic
  const issueType = (() => {
    const purpose = (call.crmNote?.callPurpose || '').toLowerCase()
    const issue = (call.crmNote?.issue || '').toLowerCase()
    const text = `${purpose} ${issue}`
    if (text.includes('refund') || text.includes('billing') || text.includes('charge') || text.includes('invoice') || text.includes('pay')) {
      return 'Billing & Invoicing'
    }
    if (text.includes('portal') || text.includes('error') || text.includes('port') || text.includes('tech') || text.includes('online')) {
      return 'Technical Support'
    }
    if (text.includes('cancel') || text.includes('close')) {
      return 'Account Retention'
    }
    return 'General Customer Service'
  })()

  const priority = (() => {
    const hasAngry = rawTranscript.some(s => s.emotion === 'Angry')
    const hasFrustrated = rawTranscript.some(s => s.emotion === 'Frustrated')
    if (hasAngry) return 'URGENT'
    if (hasFrustrated) return 'HIGH'
    if (call.analysis?.sentimentOverall === 'NEGATIVE') return 'HIGH'
    if (call.analysis?.sentimentOverall === 'NEUTRAL') return 'MEDIUM'
    return 'LOW'
  })()

  const tags = [
    issueType,
    priority,
    ...(call.crmNote?.productsMentioned as string[] || []),
    call.analysis?.sentimentOverall || 'NEUTRAL'
  ].filter(Boolean)

  const ticketTitle = `[${issueType.toUpperCase()}] - ${call.title || call.filename}`

  const crmJsonData = call.crmNote ? {
    ticketTitle,
    priority,
    issueType,
    customerName: call.crmNote.customerName || 'Unknown',
    agentName: call.crmNote.agentName || 'Unassigned',
    callPurpose: call.crmNote.callPurpose || 'N/A',
    issue: call.crmNote.issue || 'N/A',
    resolution: call.crmNote.resolution || 'N/A',
    followUp: call.crmNote.followUp || 'N/A',
    internalNotes: call.crmNote.importantNotes || call.crmNote.summary || 'N/A',
    tags,
    callDurationSeconds: call.crmNote.callDuration || call.duration,
    processedDate: new Date(call.createdAt).toISOString()
  } : null

  const handleCopyJson = () => {
    if (!crmJsonData) return
    navigator.clipboard.writeText(JSON.stringify(crmJsonData, null, 2))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDownloadJson = () => {
    if (!crmJsonData) return
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(crmJsonData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `crm_ticket_${call.id}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Sync state with HTML5 audio element
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      // Set duration if not already in DB
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.warn('Audio playback blocked (user interaction required):', e))
      }
    }
  }

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds
      setCurrentTime(seconds)
      if (!isPlaying) {
        audioRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    }
  }

  const handleExportCRM = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExported(true)
      setIsExporting(false)
    }, 1500)
  }

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 border-green-500/20 bg-green-500/5'
    if (score >= 80) return 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5'
  }

  return (
    <div className="space-y-6 text-xs select-none">
      
      {/* 1. HTML5 Audio tag hidden or controller managed */}
      <audio
        ref={audioRef}
        src={call.fileUrl || '/mock-audio/dummy.mp3'}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* 2. Header and Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/calls"
            className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Audit Dashboard</span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {call.title || call.filename}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                call.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {call.status}
              </span>
            </h2>
          </div>
        </div>

        {/* Export Button */}
        {call.crmNote && (
          <button
            onClick={handleExportCRM}
            disabled={isExported || isExporting}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExporting ? 'Exporting...' : isExported ? 'Synced to CRM' : 'Export to CRM'}
          </button>
        )}
      </div>

      {/* 3. Overview Panel & Player Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Audio Player and Metadata */}
        <div className="glass rounded-xl p-5 border border-white/5 space-y-5 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audio playback</h3>
          
          {/* Custom audio controller interface */}
          <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span className="font-medium">Playback time</span>
              <span className="font-mono">{formatTime(currentTime)} / {formatTime(call.duration || 182)}</span>
            </div>

            {/* Interactive Canvas Waveform Player */}
            <div className="bg-slate-950/80 rounded-xl p-3 flex items-center justify-center border border-white/5 cursor-pointer">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                width={300}
                height={48}
                className="w-full h-12 opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="flex justify-center items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Metadata Lists */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-500 font-medium">Customer</span>
              <span className="text-white font-bold">{call.customerName || 'Anonymous'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-500 font-medium">Customer CRM ID</span>
              <span className="text-white font-bold">{call.customerId || 'None'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-500 font-medium">Agent Assigned</span>
              <span className="text-white font-bold">
                {call.agent ? `${call.agent.firstName} ${call.agent.lastName}` : 'Unassigned'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-500 font-medium">Processed Date</span>
              <span className="text-white font-mono">
                {new Date(call.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Tab Panel Views */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tab Selector Links */}
          <div className="flex border-b border-white/5 gap-6">
            {(['overview', 'transcript', 'coaching', 'crm'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === tab
                    ? 'text-cyan-400 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.toUpperCase()}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview & QA Scoring */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* QA Rating Header Card */}
              {qaReport ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`glass rounded-xl p-5 border flex flex-col justify-between text-center ${getScoreColor(qaReport.score)}`}>
                    <span className="text-[9px] uppercase font-bold tracking-wider block">Audited Score</span>
                    <span className="text-4xl font-black block my-2">{qaReport.score}%</span>
                    <span className="text-[10px] font-semibold">{qaReport.score >= 90 ? 'EXCELLENT' : qaReport.score >= 80 ? 'SATISFACTORY' : 'NEEDS IMPROVEMENT'}</span>
                  </div>
                  
                  <div className="glass rounded-xl p-5 border border-white/5 sm:col-span-2 space-y-2">
                    <span className="text-[9px] uppercase font-bold tracking-wider block text-slate-400">Reviewer Feedback</span>
                    <p className="text-slate-300 leading-relaxed">{qaReport.feedback || 'No written reviewer summary.'}</p>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-5 border border-white/5 text-center text-slate-500">
                  No QA Scorecard has been created for this call record.
                </div>
              )}

              {/* Sentiment Timeline progression */}
              {chartData.length > 0 && (
                <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Smile className="w-4 h-4 text-cyan-400" />
                        Customer Emotion & Sentiment Timeline
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Segment-by-segment customer emotion shifts during the interaction.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Speaker Filter Toggle */}
                      <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 border border-white/5 rounded-lg text-[9px]">
                        <button
                          type="button"
                          onClick={() => setTimelineFilter('customer')}
                          className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                            timelineFilter === 'customer'
                              ? 'bg-cyan-500 text-slate-950 shadow shadow-cyan-500/10'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Customer Only
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimelineFilter('both')}
                          className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                            timelineFilter === 'both'
                              ? 'bg-cyan-500 text-slate-950 shadow shadow-cyan-500/10'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          All Speakers
                        </button>
                      </div>

                      {turningPointTimestamp && (
                        <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] px-2.5 py-1 rounded-full font-bold animate-pulse">
                          💡 Turning Point: {turningPointTimestamp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer Emotions Summary Badges */}
                  <div className="grid grid-cols-5 gap-2.5 pt-2">
                    {[
                      { emotion: 'Happy', emoji: '😊', count: emotionCounts.Happy, color: 'text-green-400 border-green-500/10 bg-green-500/[0.02]' },
                      { emotion: 'Neutral', emoji: '😐', count: emotionCounts.Neutral, color: 'text-slate-300 border-white/5 bg-slate-950/20' },
                      { emotion: 'Confused', emoji: '😕', count: emotionCounts.Confused, color: 'text-indigo-400 border-indigo-500/10 bg-indigo-500/[0.02]' },
                      { emotion: 'Frustrated', emoji: '😤', count: emotionCounts.Frustrated, color: 'text-amber-500 border-amber-500/10 bg-amber-500/[0.02]' },
                      { emotion: 'Angry', emoji: '😡', count: emotionCounts.Angry, color: 'text-rose-500 border-rose-500/10 bg-rose-500/[0.02]' },
                    ].map(({ emotion, emoji, count, color }) => {
                      const percent = totalCustomerTurns > 0 ? Math.round((count / totalCustomerTurns) * 100) : 0
                      return (
                        <div key={emotion} className={`glass border rounded-xl p-2.5 text-center flex flex-col justify-between ${color}`}>
                          <div className="text-base select-none">{emoji}</div>
                          <div className="mt-1">
                            <span className="font-extrabold block text-[10px] leading-tight text-white">{percent}%</span>
                            <span className="text-[8px] text-slate-500 font-semibold uppercase block tracking-wider mt-0.5">{emotion} ({count})</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Sentiment Timeline AreaChart */}
                  <div className="w-full h-44 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                          dataKey="timestamp"
                          stroke="#64748b"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                          domain={[-1.2, 1.2]}
                          ticks={[-1.0, -0.7, -0.2, 0.0, 1.0]}
                          tickFormatter={(val) => {
                            if (val === 1.0) return 'Happy'
                            if (val === 0.0) return 'Neutral'
                            if (val === -0.2) return 'Confused'
                            if (val === -0.7) return 'Frustrated'
                            if (val === -1.0) return 'Angry'
                            return ''
                          }}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#06b6d4"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorSentiment)"
                          dot={<CustomDot />}
                        />
                        {turningPointTimestamp && (
                          <ReferenceLine
                            x={timelineFilter === 'customer' ? (customerChangeTimestamp || '') : turningPointTimestamp}
                            stroke="#06b6d4"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                            label={{
                              value: 'Pivot Point',
                              position: 'top',
                              fill: '#06b6d4',
                              fontSize: 9,
                              fontWeight: 'black',
                            }}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Dialogue Turning Point Comparison Card */}
                  {turningPointSummary && (
                    <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 mt-4 space-y-3.5">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 text-xs">💡</span>
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                            Dialogue Inflection Analysis (Turning Point)
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">
                          Trigger Turn: {turningPointSummary.agentTime}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch text-xs">
                        {/* Before Turn */}
                        <div className="bg-slate-900/30 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 px-2 py-0.5 bg-rose-500/10 border-b border-l border-rose-500/20 text-rose-400 text-[8px] font-black uppercase tracking-wider rounded-bl-lg">
                            Before
                          </div>
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">
                                {turningPointSummary.beforeEmotion === 'Happy' ? '😊' :
                                 turningPointSummary.beforeEmotion === 'Angry' ? '😡' :
                                 turningPointSummary.beforeEmotion === 'Frustrated' ? '😤' :
                                 turningPointSummary.beforeEmotion === 'Confused' ? '😕' : '😐'}
                              </span>
                              <span className={`font-black uppercase tracking-wider text-[8px] ${
                                turningPointSummary.beforeEmotion === 'Happy' ? 'text-green-400' :
                                turningPointSummary.beforeEmotion === 'Angry' ? 'text-rose-500' :
                                turningPointSummary.beforeEmotion === 'Frustrated' ? 'text-amber-500' :
                                turningPointSummary.beforeEmotion === 'Confused' ? 'text-indigo-400' : 'text-slate-400'
                              }`}>
                                Customer: {turningPointSummary.beforeEmotion}
                              </span>
                            </div>
                            <p className="text-slate-400 italic text-[10px] leading-relaxed">
                              &ldquo;{turningPointSummary.beforeText}&rdquo;
                            </p>
                          </div>
                          <span className="text-[8px] text-slate-600 font-mono mt-3">{turningPointSummary.beforeTime}</span>
                        </div>

                        {/* Pivot Turn */}
                        <div className="bg-cyan-500/[0.01] border border-cyan-500/20 rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyan-500/10 border-b border-l border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-wider rounded-bl-lg">
                            Agent Pivot Action
                          </div>
                          <div className="space-y-1.5 pt-2">
                            <span className="text-cyan-400 font-black uppercase tracking-wider text-[8px]">
                              Agent Response
                            </span>
                            <p className="text-slate-300 font-medium text-[10px] leading-relaxed">
                              &ldquo;{turningPointSummary.agentText}&rdquo;
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                            <span className="text-[8px] text-cyan-500 font-mono">{turningPointSummary.agentTime}</span>
                            <button
                              onClick={() => handleSeek(turningPointSummary.agentStart)}
                              className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                            >
                              <Play className="w-3 h-3 fill-cyan-400/20 shrink-0" /> Seek to Pivot
                            </button>
                          </div>
                        </div>

                        {/* After Turn */}
                        <div className="bg-slate-900/30 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 px-2 py-0.5 bg-green-500/10 border-b border-l border-green-500/20 text-green-400 text-[8px] font-black uppercase tracking-wider rounded-bl-lg">
                            After
                          </div>
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">
                                {turningPointSummary.afterEmotion === 'Happy' ? '😊' :
                                 turningPointSummary.afterEmotion === 'Angry' ? '😡' :
                                 turningPointSummary.afterEmotion === 'Frustrated' ? '😤' :
                                 turningPointSummary.afterEmotion === 'Confused' ? '😕' : '😐'}
                              </span>
                              <span className={`font-black uppercase tracking-wider text-[8px] ${
                                turningPointSummary.afterEmotion === 'Happy' ? 'text-green-400' :
                                turningPointSummary.afterEmotion === 'Angry' ? 'text-rose-500' :
                                turningPointSummary.afterEmotion === 'Frustrated' ? 'text-amber-500' :
                                turningPointSummary.afterEmotion === 'Confused' ? 'text-indigo-400' : 'text-slate-400'
                              }`}>
                                Customer: {turningPointSummary.afterEmotion}
                              </span>
                            </div>
                            <p className="text-slate-400 italic text-[10px] leading-relaxed">
                              &ldquo;{turningPointSummary.afterText}&rdquo;
                            </p>
                          </div>
                          <span className="text-[8px] text-slate-600 font-mono mt-3">{turningPointSummary.afterTime}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed QA Scorecard Breakdown */}
              {qaReport && (
                <div className="space-y-6">
                  
                  {/* 8 Categories Rubric Scores Grid */}
                  <div className="glass rounded-xl p-5 border border-white/5 space-y-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Detailed QA Audit Categories Scorecard
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-xs">
                      {/* 1. Greeting */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Greeting Compliance</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.greeting.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.greeting.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.greeting.explanation}</p>
                      </div>

                      {/* 2. Verification */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Identity Verification Adherence</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.verification.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.verification.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.verification.explanation}</p>
                      </div>

                      {/* 3. Compliance */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Regulatory Compliance</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.compliance.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.compliance.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.compliance.explanation}</p>
                      </div>

                      {/* 4. Empathy */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Empathy & Rapport</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.empathy.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.empathy.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.empathy.explanation}</p>
                      </div>

                      {/* 5. Listening */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Active Listening</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.listening.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.listening.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.listening.explanation}</p>
                      </div>

                      {/* 6. Problem Solving */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Problem Solving & Retentions</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.problemSolving.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.problemSolving.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.problemSolving.explanation}</p>
                      </div>

                      {/* 7. Closing */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Wrap Up & Closing Protocols</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.closing.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.closing.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.closing.explanation}</p>
                      </div>

                      {/* 8. Professionalism */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center font-semibold text-slate-200">
                          <span>Professionalism & Tone</span>
                          <span className="text-cyan-400 font-bold">{qaReport.checklist.professionalism.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${qaReport.checklist.professionalism.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{qaReport.checklist.professionalism.explanation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mistakes & Improvements breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Mistakes card */}
                    <div className="glass rounded-xl p-5 border border-rose-500/10 bg-rose-500/[0.01] space-y-4">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Frown className="w-4 h-4 text-rose-500" />
                        Identified Mistakes
                      </h4>
                      <ul className="space-y-2.5">
                        {qaReport.checklist.mistakes && qaReport.checklist.mistakes.length > 0 ? (
                          qaReport.checklist.mistakes.map((m: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-slate-300 leading-relaxed text-xs">
                              <span className="text-rose-500 font-bold shrink-0 select-none">✕</span>
                              <span>{m}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500 text-xs italic">No specific errors or policy omissions identified.</li>
                        )}
                      </ul>
                    </div>

                    {/* Improvements card */}
                    <div className="glass rounded-xl p-5 border border-green-500/10 bg-green-500/[0.01] space-y-4">
                      <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Suggested Improvements
                      </h4>
                      <ul className="space-y-2.5">
                        {qaReport.checklist.improvements && qaReport.checklist.improvements.length > 0 ? (
                          qaReport.checklist.improvements.map((imp: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-slate-300 leading-relaxed text-xs">
                              <span className="text-green-500 font-bold shrink-0 select-none">✓</span>
                              <span>{imp}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500 text-xs italic">Standard parameters followed; no explicit actions needed.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Tab 2: Interactive Transcript Scrolling */}
          {activeTab === 'transcript' && (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {call.analysis?.transcript && call.analysis.transcript.length > 0 ? (
                call.analysis.transcript.map((seg, idx) => {
                  const isCurrent = currentTime >= seg.start && currentTime < seg.end
                  const isTurningPoint = seg.turningPoint === true
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSeek(seg.start)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all duration-300 relative overflow-hidden ${
                        isCurrent
                          ? 'bg-slate-900 border-cyan-500/40 shadow shadow-cyan-950/20 scale-[1.01]'
                          : isTurningPoint
                          ? 'bg-cyan-950/10 border-cyan-500/25 hover:bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.06)]'
                          : 'bg-transparent border-transparent hover:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${seg.speaker === 'Agent' ? 'text-cyan-400' : 'text-indigo-400'}`}>
                            {seg.speaker}
                          </span>
                          
                          {/* Segment Emotion Badge */}
                          {seg.emotion && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase scale-90 ${
                              seg.emotion === 'Happy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              seg.emotion === 'Angry' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              seg.emotion === 'Frustrated' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              seg.emotion === 'Confused' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              'bg-slate-800 text-slate-400 border border-white/5'
                            }`}>
                              {seg.emotion}
                            </span>
                          )}

                          {/* Turning Point Badge */}
                          {isTurningPoint && (
                            <span className="bg-cyan-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.4)] tracking-wider uppercase flex items-center gap-0.5 animate-pulse scale-90">
                              💡 Sentiment Shift
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">{formatTime(seg.start)}</span>
                          {seg.sentiment === 'positive' && <Smile className="w-3.5 h-3.5 text-green-400" />}
                          {seg.sentiment === 'negative' && <Frown className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{seg.text}</p>
                    </div>
                  )
                })
              ) : (
                <div className="glass rounded-xl p-5 border border-white/5 text-center text-slate-500">
                  No transcript matches found for this recording.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Coaching & Feedback */}
          {activeTab === 'coaching' && (
            <div className="space-y-6 text-xs">
              {call.analysis ? (
                <div className="space-y-6">
                  
                  {/* AI Coach Behavioral Detections Grid */}
                  {call.analysis.aiCoachReport && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        AI Coach Behavioral Auditing Dashboard
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="glass rounded-xl p-3 border border-white/5 text-center space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Interruptions</span>
                          <span className={`text-xl font-black block ${call.analysis.aiCoachReport.detections.interruptionsCount > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                            {call.analysis.aiCoachReport.detections.interruptionsCount}
                          </span>
                        </div>
                        
                        <div className="glass rounded-xl p-3 border border-white/5 text-center space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Long Silences</span>
                          <span className={`text-xl font-black block ${call.analysis.aiCoachReport.detections.longSilencesCount > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                            {call.analysis.aiCoachReport.detections.longSilencesCount}
                          </span>
                        </div>

                        <div className="glass rounded-xl p-3 border border-white/5 text-center space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Tone Gaps</span>
                          <span className={`text-xl font-black block ${call.analysis.aiCoachReport.detections.wrongToneCount > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                            {call.analysis.aiCoachReport.detections.wrongToneCount}
                          </span>
                        </div>

                        <div className="glass rounded-xl p-3 border border-white/5 text-center space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Missed Script</span>
                          <span className={`text-xl font-black block ${call.analysis.aiCoachReport.detections.missedScriptCount > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                            {call.analysis.aiCoachReport.detections.missedScriptCount}
                          </span>
                        </div>

                        <div className="glass rounded-xl p-3 border border-white/5 text-center space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Compliance Gaps</span>
                          <span className={`text-xl font-black block ${call.analysis.aiCoachReport.detections.missedComplianceCount > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                            {call.analysis.aiCoachReport.detections.missedComplianceCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Coach play-by-play simulator */}
                  {call.analysis.aiCoachReport && call.analysis.aiCoachReport.insights.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
                        <Smile className="w-4 h-4 text-cyan-400" />
                        Conversational Corrections & Coaching Timeline
                      </h4>
                      
                      <div className="space-y-4">
                        {call.analysis.aiCoachReport.insights.map((insight) => (
                          <div key={insight.id} className="glass rounded-xl p-4 border border-white/5 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-900 border border-white/10 text-slate-300 font-mono text-[9px] px-2 py-0.5 rounded">
                                  {insight.timestamp}
                                </span>
                                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                  Speech Coaching Alert
                                </span>
                              </div>
                              <button
                                onClick={() => handleSeek(insight.seconds)}
                                className="text-cyan-400 hover:text-cyan-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <Play className="w-3 h-3 fill-cyan-400/20" /> Seek to turn
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Agent&apos;s Original Turn</span>
                                <p className="bg-slate-950/40 p-2.5 rounded border border-white/5 text-slate-400 italic leading-relaxed">
                                  &ldquo;{insight.originalTurn}&rdquo;
                                </p>
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block pt-1">Coaching Recommendation</span>
                                <p className="text-slate-300 leading-relaxed font-medium">
                                  {insight.coachingAdvice}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <span className="text-[9px] uppercase font-bold text-cyan-400/80 tracking-wider">Better Response Suggestion</span>
                                <p className="bg-cyan-950/10 p-2.5 rounded border border-cyan-500/20 text-cyan-400 font-semibold leading-relaxed">
                                  &ldquo;{insight.betterResponse}&rdquo;
                                </p>
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block pt-1">Rationale (Why it matters)</span>
                                <p className="text-slate-400 leading-relaxed">
                                  {insight.rationale}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard tips list & strengths */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                    <div className="glass rounded-xl p-5 border border-white/5 sm:col-span-2 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Agent Action Plan
                      </h4>
                      <ul className="space-y-3">
                        {call.analysis.coachingTips.map((tip, idx) => (
                          <li key={idx} className="flex gap-2.5 text-slate-300 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="glass rounded-xl p-4 border border-green-500/10 bg-green-500/[0.02] space-y-2">
                        <span className="text-[9px] uppercase font-bold text-green-400 tracking-wider">Identified Strengths</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {call.analysis.strengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass rounded-xl p-4 border border-rose-500/10 bg-rose-500/[0.02] space-y-2">
                        <span className="text-[9px] uppercase font-bold text-rose-400 tracking-wider">Areas to Coach</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {call.analysis.improvements.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="glass rounded-xl p-5 border border-white/5 text-center text-slate-500">
                  No AI Coaching cards have been analyzed for this record.
                </div>
              )}
            </div>
          )}

          {/* Tab 4: CRM Notes & Export */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              {call.crmNote ? (
                <div className="space-y-6 text-xs">
                  
                  {/* Executive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Customer Name</span>
                      <span className="block text-sm font-bold text-white">{call.crmNote.customerName || 'N/A'}</span>
                    </div>
                    <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Agent Name</span>
                      <span className="block text-sm font-bold text-white">{call.crmNote.agentName || 'N/A'}</span>
                    </div>
                    <div className="glass rounded-xl p-4 border border-white/5 space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Call Duration</span>
                      <span className="block text-sm font-mono font-bold text-cyan-400">
                        {call.crmNote.callDuration ? `${Math.floor(call.crmNote.callDuration / 60)}m ${Math.floor(call.crmNote.callDuration % 60)}s` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Summary & Details Card */}
                  <div className="glass rounded-xl p-5 border border-white/5 space-y-5">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Call Purpose</span>
                      <p className="text-white mt-1 text-xs font-semibold leading-relaxed">{call.crmNote.callPurpose || 'N/A'}</p>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Summary Description</span>
                      <p className="text-slate-300 mt-1 leading-relaxed">{call.crmNote.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Core Customer Issue</span>
                        <p className="text-slate-300 leading-relaxed mt-1">{call.crmNote.issue || 'N/A'}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Resolution Status</span>
                        <p className="text-slate-300 leading-relaxed mt-1">{call.crmNote.resolution || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Key Conversation Points</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {call.crmNote.keyPoints.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Follow-up Summary</span>
                        <p className="text-slate-300 leading-relaxed mb-2 mt-1">{call.crmNote.followUp || 'N/A'}</p>
                        
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block pt-1">Next Actions</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {call.crmNote.actionItems.map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Products Mentioned</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {call.crmNote.productsMentioned && (call.crmNote.productsMentioned as string[]).length > 0 ? (
                            (call.crmNote.productsMentioned as string[]).map((product, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-900 border border-white/10 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                              >
                                {product}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-xs italic">No specific products identified.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-extrabold">Important Notes</span>
                        <p className="text-amber-400/90 leading-relaxed mt-1.5 font-bold">{call.crmNote.importantNotes || 'N/A'}</p>
                      </div>
                    </div>

                  </div>

                  {/* Generated CRM Ticket Metadata Section */}
                  <div className="glass rounded-xl p-5 border border-cyan-500/15 bg-cyan-950/[0.01] space-y-5">
                    <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/5 pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                          Generated CRM Ticket Metadata
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Automated ticket parameters compiled from speech analytics.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy Button */}
                        <button
                          onClick={handleCopyJson}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/5 font-bold flex items-center gap-1.5 transition-all text-[10px] cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopied ? 'Copied!' : 'Copy JSON'}
                        </button>

                        {/* Download Button */}
                        <button
                          onClick={handleDownloadJson}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/5 font-bold flex items-center gap-1.5 transition-all text-[10px] cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          Download JSON
                        </button>
                      </div>
                    </div>

                    {/* Metadata Checklist Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      
                      {/* Ticket parameters */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Ticket Title</span>
                          <span className="block text-slate-200 font-bold text-[11px] bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                            {ticketTitle}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Priority</span>
                            <div className="pt-1">
                              <span className={`px-2.5 py-1 rounded font-black tracking-wider text-[9px] border ${
                                priority === 'URGENT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                priority === 'MEDIUM' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                'bg-green-500/10 text-green-400 border-green-500/20'
                              }`}>
                                {priority}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Issue Type</span>
                            <div className="pt-1">
                              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-[4px] font-bold text-[9px] border border-white/5 uppercase tracking-wide">
                                {issueType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-400" /> Tags
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-900 border border-white/10 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notes and exports */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-extrabold">Internal Notes</span>
                          <p className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-slate-300 italic leading-relaxed text-[10px] font-semibold">
                            {call.crmNote.importantNotes || call.crmNote.summary}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Collapsible raw JSON block */}
                    <div className="border-t border-white/5 pt-4 space-y-2">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Raw CRM Sync Payload (JSON)</span>
                      <pre className="bg-slate-950/80 p-3 rounded-lg border border-white/5 text-[10px] text-cyan-400 font-mono overflow-x-auto max-h-36 leading-relaxed select-text">
                        {JSON.stringify(crmJsonData, null, 2)}
                      </pre>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-5 border border-white/5 text-center text-slate-500">
                  No CRM summary files have been generated for this recording.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, CheckCircle, Smile, Frown, Sparkles, Volume2 } from 'lucide-react'

interface Segment {
  id: number
  speaker: 'Agent' | 'Customer'
  time: string
  seconds: number
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
  compliance?: boolean
}

const DEMO_SEGMENTS: Segment[] = [
  {
    id: 1,
    speaker: 'Agent',
    time: '00:01',
    seconds: 1,
    text: 'Thank you for calling CallPilot Support. My name is Alex. This call is being recorded for quality assurance. How can I help you today?',
    sentiment: 'neutral',
    compliance: true,
  },
  {
    id: 2,
    speaker: 'Customer',
    time: '00:07',
    seconds: 7,
    text: "Hi Alex, I'm calling because my account shows a double charge for my enterprise BPO subscription this month. This is very urgent for us.",
    sentiment: 'negative',
  },
  {
    id: 3,
    speaker: 'Agent',
    time: '00:13',
    seconds: 13,
    text: 'I completely understand the urgency, and I sincerely apologize for the inconvenience. Let me access your billing records immediately and process the refund for that duplicate charge.',
    sentiment: 'positive',
    compliance: true,
  },
  {
    id: 4,
    speaker: 'Customer',
    time: '00:22',
    seconds: 22,
    text: 'Oh, that would be wonderful. I appreciate you taking care of this so quickly without putting me on a long hold.',
    sentiment: 'positive',
  },
  {
    id: 5,
    speaker: 'Agent',
    time: '00:28',
    seconds: 28,
    text: 'It is my absolute pleasure! The refund has been submitted and should reflect in your account in 2-3 business days. Is there anything else I can assist you with?',
    sentiment: 'positive',
    compliance: true,
  },
]

export default function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1
          if (next > 34) {
            return 0 // Loop back
          }
          return next
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  // Dynamically compute active segment ID during rendering
  const matchedSegment = [...DEMO_SEGMENTS]
    .reverse()
    .find((seg) => currentTime >= seg.seconds)
  const activeSegmentId = matchedSegment ? matchedSegment.id : 1

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const selectSegment = (seg: Segment) => {
    setCurrentTime(seg.seconds)
  }

  return (
    <div className="glass rounded-xl overflow-hidden shadow-2xl border border-white/10 glow-cyan">
      {/* Platform Header Mock */}
      <div className="bg-slate-900/80 px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase">Live AI Intelligence</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Call_Ref_9821_Refund.wav
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium border border-green-500/30">
              Analyzed
            </span>
          </h3>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-800/80 rounded-lg px-4 py-2 border border-white/5 text-center">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">QA Score</span>
            <span className="text-xl font-extrabold text-cyan-400">96%</span>
          </div>
          <div className="bg-slate-800/80 rounded-lg px-4 py-2 border border-white/5 text-center">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Sentiment</span>
            <span className="text-xl font-extrabold text-indigo-400">Positive</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 h-[420px] bg-slate-950/60">
        
        {/* Left Panel: AI Coaching & Compliance Summary */}
        <div className="p-5 flex flex-col justify-between overflow-y-auto col-span-1 bg-slate-950/40">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Coaching Insight
            </h4>
            <div className="space-y-3">
              <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-3 text-xs leading-relaxed text-cyan-300">
                <span className="font-semibold text-cyan-400 block mb-1">Strength: Active Empathy</span>
                Agent Alex resolved duplicate charges immediately. Displayed strong reassurance and apology statements.
              </div>
              <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-3 text-xs leading-relaxed text-indigo-300">
                <span className="font-semibold text-indigo-400 block mb-1">Compliance Checklist</span>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    <span>Branded Greeting verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    <span>Recording Disclosure stated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    <span>Refund policy compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Agent: Alex R.</span>
            <span>Duration: 00:34</span>
          </div>
        </div>

        {/* Right Panel: Interactive Transcript Scrolling */}
        <div className="p-5 col-span-2 overflow-y-auto space-y-4 flex flex-col h-full justify-between">
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-[300px]">
            {DEMO_SEGMENTS.map((seg) => {
              const isActive = activeSegmentId === seg.id
              return (
                <div
                  key={seg.id}
                  onClick={() => selectSegment(seg)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900 border-cyan-500/40 shadow-md shadow-cyan-950/20 scale-[1.01]'
                      : 'bg-transparent border-transparent hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold ${seg.speaker === 'Agent' ? 'text-cyan-400' : 'text-indigo-400'}`}>
                      {seg.speaker}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{seg.time}</span>
                      {seg.compliance && (
                        <span className="bg-green-500/10 text-green-400 text-[9px] px-1.5 py-0.5 rounded border border-green-500/20 uppercase tracking-wide">
                          Compliant
                        </span>
                      )}
                      {seg.sentiment === 'positive' && <Smile className="w-3 h-3 text-green-400" />}
                      {seg.sentiment === 'negative' && <Frown className="w-3 h-3 text-rose-400" />}
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{seg.text}</p>
                </div>
              )
            })}
          </div>

          {/* Audio Player Controls */}
          <div className="bg-slate-900/90 rounded-lg p-3 border border-white/5 flex items-center gap-4 mt-2">
            <button
              onClick={togglePlayback}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-full transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>00:{currentTime.toString().padStart(2, '0')}</span>
                <span>00:34</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / 34) * 100}%` }}
                />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Volume2 className="w-4 h-4" />
              <div className="w-12 bg-slate-800 rounded-full h-1">
                <div className="bg-slate-400 h-1 rounded-full w-2/3" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

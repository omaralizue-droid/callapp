'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, FileAudio, CheckCircle, AlertCircle, Loader2, Lock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createCallAction } from '@/actions/calls'
import WaveformGenerator from '@/components/dashboard/WaveformGenerator'
import { UsageStatus } from '@/services/usage'
import Link from 'next/link'

const AGENTS = [
  { id: 'agent-1', name: 'Alex Rodriguez' },
  { id: 'agent-2', name: 'Lisa Miller' },
  { id: 'agent-3', name: 'David Kim' },
]

export default function UploadForm({ usage }: { usage?: UsageStatus }) {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState(0)

  const exceededMetric = usage
    ? [
        usage.calls.exceeded ? 'Calls Volume' : null,
        usage.storage.exceeded ? 'Cloud Storage' : null,
        usage.aiRequests.exceeded ? 'Gemini AI Requests' : null,
        usage.reports.exceeded ? 'QA Reports' : null,
      ].filter(Boolean) as string[]
    : []

  const isLimitExceeded = exceededMetric.length > 0

  // Metadata Form States
  const [title, setTitle] = useState('')
  const [agentId, setAgentId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerId, setCustomerId] = useState('')

  // Upload progress states
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success'>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMsg(null)
    
    // Support WAV, MP3, M4A, AAC
    const validExtensions = ['.wav', '.mp3', '.m4a', '.aac']
    const hasValidExtension = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    )
    
    const maxSize = 500 * 1024 * 1024 // 500MB

    if (!hasValidExtension) {
      setErrorMsg('Invalid file format. Please upload a WAV, MP3, M4A, or AAC recording.')
      return
    }

    if (selectedFile.size > maxSize) {
      setErrorMsg('File is too large. Maximum size allowed is 500MB.')
      return
    }

    setFile(selectedFile)
    
    // Parse duration dynamically
    const audioUrl = URL.createObjectURL(selectedFile)
    const audio = new Audio(audioUrl)
    audio.onloadedmetadata = () => {
      setDuration(audio.duration)
      URL.revokeObjectURL(audioUrl)
    }
    audio.onerror = () => {
      setDuration(252)
      URL.revokeObjectURL(audioUrl)
    }

    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setStatus('uploading')
    setProgress(0)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const isBypass = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
      let publicUrl = ''

      if (isBypass) {
        // Simulate upload natively
        await new Promise<void>((resolve) => {
          let currentProgress = 0
          const interval = setInterval(() => {
            currentProgress += 20
            setProgress(currentProgress)
            if (currentProgress >= 100) {
              clearInterval(interval)
              resolve()
            }
          }, 100)
        })
        publicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      } else {
        const fileExt = file.name.split('.').pop()
        const cleanFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `recordings/${cleanFileName}`

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const uploadUrl = `${supabaseUrl}/storage/v1/object/calls/${filePath}`

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', uploadUrl, true)
          xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`)
          xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = (event.loaded / event.total) * 100
              setProgress(Math.round(percent))
            }
          }

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) {
              resolve()
            } else {
              try {
                const res = JSON.parse(xhr.responseText)
                reject(new Error(res.message || `Upload failed with status ${xhr.status}`))
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }
          }

          xhr.onerror = () => reject(new Error('Network upload error'))
          xhr.send(file)
        })

        const { data } = supabase.storage
          .from('calls')
          .getPublicUrl(filePath)
        publicUrl = data?.publicUrl || filePath
      }

      setStatus('analyzing')

      const dbRes = await createCallAction({
        title,
        filename: file.name,
        fileUrl: publicUrl,
        fileSize: file.size,
        duration: duration || 252,
        customerName,
        customerId,
        agentId,
      })

      if (dbRes.error) {
        throw new Error(dbRes.error)
      }

      setStatus('success')
      
      setTimeout(() => {
        router.push(`/dashboard/calls/${dbRes.callId}?message=Call uploaded and scored successfully.`)
        router.refresh()
      }, 1500)

    } catch (err) {
      console.error('Audio upload failed:', err)
      setErrorMsg((err as Error).message || 'Failed to complete audio recording upload.')
      setStatus('idle')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Upload Call Recording</h2>
        <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Audit customer conversations for QA compliance metrics</p>
      </div>

      {isLimitExceeded && (
        <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex gap-2.5 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <span className="font-bold text-white text-sm block">Plan Quota Limit Exceeded</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Your organization has exceeded the plan allocation for: <span className="text-rose-400 font-bold">{exceededMetric.join(', ')}</span>. 
                Uploads are currently locked. Upgrade your subscription plan or contact your manager to expand your monthly limits.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              href="/dashboard/settings?tab=billing"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-[10px] flex items-center gap-1.5 transition-all"
            >
              Upgrade Subscription Plan
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {status !== 'idle' ? (
        // Progress States Card
        <div
          className="p-8 rounded-2xl text-center space-y-6"
          style={{
            background: 'rgba(13,21,53,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex flex-col items-center">
            {status === 'uploading' && (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-4" />
                <h3 className="text-sm font-bold text-white">Uploading audio recording...</h3>
                <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Transferring raw audio bits to storage vault</p>
              </>
            )}

            {status === 'analyzing' && (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Analyzing call with Gemini...</h3>
                <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Transcribing dialogue, scoring compliance rubrics, and generating coaching tags</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-sm font-bold text-white">Analysis Complete!</h3>
                <p className="text-[10px] mt-1" style={{ color: '#475569' }}>Redirecting you to dashboard feed...</p>
              </>
            )}
          </div>

          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-[10px]" style={{ color: '#475569' }}>
              <span>{status === 'uploading' ? 'Upload Status' : 'Gemini scoring'}</span>
              <span>{status === 'uploading' ? `${progress}%` : 'Processing...'}</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  status === 'uploading' ? 'bg-indigo-500' : 'bg-indigo-500 animate-pulse'
                }`}
                style={{ width: status === 'uploading' ? `${progress}%` : '100%' }}
              />
            </div>
          </div>
        </div>
      ) : (
        // Input Form Area
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left panel: Metadata Form */}
          <div
            className="p-5 rounded-2xl space-y-4 md:col-span-1"
            style={{
              background: 'rgba(13,21,53,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Call Metadata</h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wide text-[9px]" style={{ color: '#334155' }}>Call Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Subscription billing dispute"
                  className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none placeholder:text-slate-600 transition-all text-xs"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wide text-[9px]" style={{ color: '#334155' }}>Assigned Agent</label>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none transition-all text-xs"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <option value="" style={{ background: '#0a1128', color: '#64748b' }}>Select agent...</option>
                  {AGENTS.map((a) => (
                    <option key={a.id} value={a.id} style={{ background: '#0a1128', color: 'white' }}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wide text-[9px]" style={{ color: '#334155' }}>Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none placeholder:text-slate-600 transition-all text-xs"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wide text-[9px]" style={{ color: '#334155' }}>Customer Identifier / CRM ID</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="CUST-9821"
                  className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none placeholder:text-slate-600 transition-all text-xs"
                  style={{
                    background: 'rgba(10,17,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right panel: File Drag Area */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Drag Zone container */}
            {isLimitExceeded ? (
              <div
                className="rounded-2xl border border-dashed border-rose-500/20 bg-rose-950/5 p-10 flex flex-col items-center justify-center min-h-[250px] text-center"
                style={{
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-rose-400"
                  style={{
                    background: 'rgba(244,63,94,0.08)',
                    border: '1px solid rgba(244,63,94,0.15)',
                  }}
                >
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <span className="block font-bold text-white text-sm mb-1">
                  Audio Uploads Locked
                </span>
                <span className="block text-[10px] leading-relaxed max-w-xs text-slate-500">
                  Please upgrade your subscription status under billing settings to resume QA audits and voice processing.
                </span>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`rounded-2xl border border-dashed p-10 flex flex-col items-center justify-center min-h-[250px] relative transition-all duration-300 ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : file
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-white/10 hover:border-indigo-500 hover:bg-white/[0.02]'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(13,21,53,0.4)',
                }}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple={false}
                  accept="audio/wav,audio/mp3,audio/mpeg,audio/m4a,audio/x-m4a,audio/aac,audio/x-aac"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  // Selected File Preview
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 15px rgba(16,185,129,0.4)',
                      }}
                    >
                      <FileAudio className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="block font-bold text-white text-sm truncate max-w-md">{file.name}</span>
                      <span className="block text-[10px] font-mono mt-1" style={{ color: '#475569' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer underline"
                    >
                      Replace recording
                    </label>
                  </div>
                ) : (
                  // Drag active or idle states
                  <label htmlFor="file-upload" className="flex flex-col items-center text-center cursor-pointer group">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#475569',
                      }}
                    >
                      <UploadCloud className="w-6 h-6 group-hover:text-indigo-400" />
                    </div>
                    <span className="block font-bold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                      Drag and drop call recording
                    </span>
                    <span className="block text-[10px] leading-relaxed max-w-xs" style={{ color: '#475569' }}>
                      Accepts voice files in WAV, MP3, M4A, or AAC formats up to 500MB
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* Canvas Waveform local preview */}
            {file && <WaveformGenerator file={file} />}

            {errorMsg && (
              <div className="bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-xl p-3 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer text-xs"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || isLimitExceeded}
                className="text-white font-bold px-8 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
                }}
              >
                Process & Score Call
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, FileAudio, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createCallAction } from '@/actions/calls'
import WaveformGenerator from '@/components/dashboard/WaveformGenerator'

// Mock workspace agents
const AGENTS = [
  { id: 'agent-1', name: 'Alex Rodriguez' },
  { id: 'agent-2', name: 'Lisa Miller' },
  { id: 'agent-3', name: 'David Kim' },
]

export default function UploadForm() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState(0)

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
    
    // Parse actual audio duration dynamically
    const audioUrl = URL.createObjectURL(selectedFile)
    const audio = new Audio(audioUrl)
    audio.onloadedmetadata = () => {
      setDuration(audio.duration)
      URL.revokeObjectURL(audioUrl)
    }
    audio.onerror = () => {
      // Set a fallback default duration if metadata decoding fails
      setDuration(252)
      URL.revokeObjectURL(audioUrl)
    }

    if (!title) {
      // Auto-populate title with file name minus extension
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
        // Simulate upload progress natively
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
        // 1. Generate clean path name in storage calls bucket
        const fileExt = file.name.split('.').pop()
        const cleanFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `recordings/${cleanFileName}`

        // 2. Perform actual upload via XMLHttpRequest to track progress natively
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

        // 3. Retrieve public URL for database storage mapping
        const { data } = supabase.storage
          .from('calls')
          .getPublicUrl(filePath)
        publicUrl = data?.publicUrl || filePath
      }

      setStatus('analyzing')

      // 4. Save call and fallback metrics details to PostgreSQL
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
        <h2 className="text-xl font-black text-white tracking-tight">Upload Call Recording</h2>
        <p className="text-[10px] text-slate-500 mt-1">Audit customer conversations for QA compliance metrics</p>
      </div>

      {status !== 'idle' ? (
        // Progress States Card
        <div className="glass rounded-xl p-8 border border-white/5 text-center space-y-6">
          <div className="flex flex-col items-center">
            {status === 'uploading' && (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
                <h3 className="text-sm font-bold text-white">Uploading audio recording...</h3>
                <p className="text-[10px] text-slate-500 mt-1">Transferring raw audio bits to storage vault</p>
              </>
            )}

            {status === 'analyzing' && (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-4" />
                <h3 className="text-sm font-bold text-white">Analyzing call with Gemini...</h3>
                <p className="text-[10px] text-slate-500 mt-1">Transcribing dialogue, scoring compliance rubrics, and generating coaching tags</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-sm font-bold text-white">Analysis Complete!</h3>
                <p className="text-[10px] text-slate-500 mt-1">Redirecting you to dashboard feed...</p>
              </>
            )}
          </div>

          {/* Progress Bar indicator */}
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{status === 'uploading' ? 'Upload Status' : 'Gemini scoring'}</span>
              <span>{status === 'uploading' ? `${progress}%` : 'Processing...'}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  status === 'uploading' ? 'bg-cyan-500' : 'bg-indigo-500 animate-pulse'
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
          <div className="glass rounded-xl p-5 border border-white/5 space-y-4 md:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call Metadata</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Call Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Subscription billing dispute"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Assigned Agent</label>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">Select agent...</option>
                  {AGENTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Customer Identifier / CRM ID</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="CUST-9821"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right panel: File Drag Area */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Drag Zone container */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`glass rounded-xl border border-dashed p-10 flex flex-col items-center justify-center min-h-[250px] relative transition-all duration-300 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/10'
                  : file
                  ? 'border-emerald-500/40 bg-emerald-950/5'
                  : 'border-white/10 hover:border-cyan-500/35 hover:bg-slate-950/20'
              }`}
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
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <FileAudio className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-bold text-white text-sm truncate max-w-md">{file.name}</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer underline"
                  >
                    Replace recording
                  </label>
                </div>
              ) : (
                // Drag active or idle states
                <label htmlFor="file-upload" className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-900 border border-white/5 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 rounded-xl flex items-center justify-center shadow-inner mb-4 transition-all duration-300">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="block font-bold text-white text-sm mb-1">
                    Drag and drop call recording
                  </span>
                  <span className="block text-slate-500 text-[10px] leading-relaxed max-w-xs">
                    Accepts voice files in **WAV**, **MP3**, **M4A**, or **AAC** formats up to 500MB
                  </span>
                </label>
              )}
            </div>

            {/* Canvas Waveform local preview */}
            {file && <WaveformGenerator file={file} />}

            {errorMsg && (
              <div className="bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-lg p-3 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-transparent hover:bg-white/5 border border-white/10 font-bold px-5 py-2.5 rounded-lg text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
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

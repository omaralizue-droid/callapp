import Link from 'next/link'
import { Cpu } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Ambient glow orbs */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 py-6 px-6 md:px-12 flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 0 20px rgba(79,70,229,0.5)',
            }}
          >
            <Cpu className="w-4.5 h-4.5 text-white stroke-[2.5]" />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            CallPilot<span style={{ color: '#818cf8' }}>.AI</span>
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: 'rgba(13,21,53,0.80)',
            border: '1px solid rgba(99,102,241,0.20)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(79,70,229,0.15), 0 24px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Inner glow top-right */}
          <div
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          {/* Inner glow bottom-left */}
          <div
            className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

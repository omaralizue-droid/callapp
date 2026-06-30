import Link from 'next/link'
import { Cpu } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="py-6 px-6 md:px-12 flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            CallPilot<span className="text-cyan-400">.AI</span>
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md glass rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

    </div>
  )
}

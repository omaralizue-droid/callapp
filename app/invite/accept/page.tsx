import prisma from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { acceptInvitationAction } from '@/actions/invitations'
import { CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-xs" style={{ background: '#030712' }}>
        <div className="max-w-md w-full bg-slate-900/50 border border-rose-500/20 p-8 rounded-3xl space-y-4 shadow-2xl">
          <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Invalid Invitation URL</h2>
          <p className="text-slate-400 leading-relaxed text-[11px]">No invitation token was provided. Please check the invitation link sent to your email.</p>
          <Link href="/login" className="inline-block bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-5 py-2.5 rounded-xl transition-all">
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  // Find invitation
  const invitation = await prisma.organizationInvitation.findUnique({
    where: { token },
    include: { organization: true },
  })

  const isExpired = invitation ? invitation.expiresAt < new Date() : false
  const isInvalid = !invitation || invitation.isAccepted || invitation.isRevoked || isExpired

  if (isInvalid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-xs" style={{ background: '#030712' }}>
        <div className="max-w-md w-full bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-4 shadow-2xl">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Invitation Invalid or Expired</h2>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            This organization invitation link is no longer valid, has expired, or was already accepted/revoked. Please request a new invitation.
          </p>
          <Link href="/login" className="inline-block bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-5 py-2.5 rounded-xl transition-all">
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  // Check login session
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-xs" style={{ background: '#030712' }}>
        <div className="max-w-md w-full bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2">
            <span className="bg-indigo-500/10 text-indigo-400 text-[9px] px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest font-black inline-block">
              Workspace Invite
            </span>
            <h2 className="text-base font-bold text-white">Join {invitation.organization.name}</h2>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              You have been invited to join the organization as an <strong className="text-indigo-300 font-bold">{invitation.role}</strong>. Please sign in or create an account to accept.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={`/login?redirectTo=/invite/accept?token=${token}`}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              Sign In to Accept
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/signup"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Handle server-action call client-side
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-xs" style={{ background: '#030712' }}>
      <div className="max-w-md w-full bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3">
          <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
            <CheckCircle2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest pl-0.5">Workspace Invitation</span>
            <h2 className="text-base font-bold text-white mt-1">Accept Workspace Invitation</h2>
            <p className="text-slate-400 leading-relaxed text-[11px] mt-1.5">
              You are signed in as <strong className="text-slate-200">{user.email}</strong>. Accept this invitation to join <strong className="text-indigo-400">{invitation.organization.name}</strong> as an <strong className="text-indigo-300 font-bold">{invitation.role}</strong>.
            </p>
          </div>
        </div>

        <form
          action={async () => {
            'use server'
            const res = await acceptInvitationAction(token)
            if (res.error) {
              // Redirect to error message or render local error (we can redirect back with error param)
              throw new Error(res.error)
            }
            // Success: redirect to dashboard overview
            const { redirect } = await import('next/navigation')
            redirect('/dashboard/overview')
          }}
          className="space-y-2 pt-2"
        >
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Accept Invitation & Join
          </button>
          <p className="text-[10px] text-slate-500 mt-2">
            Accepting will update your current organization workspace to {invitation.organization.name}.
          </p>
        </form>
      </div>
    </div>
  )
}

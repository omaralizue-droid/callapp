'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { signupSchema, SignupInput } from '@/lib/validations/auth'
import { signupAction } from '@/actions/auth'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoogleLogin = async () => {
    setIsSubmitting(true)
    setErrorMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setIsSubmitting(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      organizationName: '',
    },
  })

  const onSubmit = async (data: SignupInput) => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await signupAction(data)
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login?message=Registration successful. Please log in.')
        }, 3000)
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center py-6">
        <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Account Created!</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Your workspace and profile have been successfully initialized. Redirecting you to the sign-in page...
        </p>
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-400 mt-4" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white tracking-tight">Create Workspace</h2>
        <p className="text-xs text-slate-400 mt-1">Get started with automated call intelligence</p>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-lg p-3 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google OAuth Login Button */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleGoogleLogin}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg border border-white/10 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.01]"
      >
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Sign Up with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-grow border-t border-white/5" />
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">or sign up with email</span>
        <div className="flex-grow border-t border-white/5" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300" htmlFor="firstName">
              First Name
            </label>
            <input
              {...register('firstName')}
              id="firstName"
              placeholder="Jane"
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
            {errors.firstName && <span className="text-[10px] text-rose-400 font-medium">{errors.firstName.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300" htmlFor="lastName">
              Last Name
            </label>
            <input
              {...register('lastName')}
              id="lastName"
              placeholder="Doe"
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
            {errors.lastName && <span className="text-[10px] text-rose-400 font-medium">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300" htmlFor="organizationName">
            Company / BPO Organization
          </label>
          <input
            {...register('organizationName')}
            id="organizationName"
            placeholder="Apex Global BPO"
            disabled={isSubmitting}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.organizationName && <span className="text-[10px] text-rose-400 font-medium">{errors.organizationName.message}</span>}
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300" htmlFor="email">
            Business Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="jane@company.com"
            disabled={isSubmitting}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.email && <span className="text-[10px] text-rose-400 font-medium">{errors.email.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
            {errors.password && <span className="text-[10px] text-rose-400 font-medium">{errors.password.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
            />
            {errors.confirmPassword && <span className="text-[10px] text-rose-400 font-medium">{errors.confirmPassword.message}</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Workspace...
            </>
          ) : (
            'Create Workspace'
          )}
        </button>
      </form>

      <div className="text-center text-[10px] text-slate-400 pt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

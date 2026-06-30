'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import { resetPasswordAction } from '@/actions/auth'

const resetSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Password confirmation must match.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
})

type ResetInput = z.infer<typeof resetSchema>

function ResetForm() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetInput) => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await resetPasswordAction(data.password)
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login?message=Password updated successfully.')
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
        <h2 className="text-xl font-bold text-white">Password Updated!</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Your credentials have been successfully updated. Redirecting you to sign in...
        </p>
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-400 mt-4" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-400 mt-1">Please enter your new BPO workspace password</p>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-lg p-3 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300" htmlFor="password">
            New Password
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.password && <span className="text-[10px] text-rose-400 font-medium">{errors.password.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.confirmPassword && <span className="text-[10px] text-rose-400 font-medium">{errors.confirmPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating Password...
            </>
          ) : (
            'Set New Password'
          )}
        </button>
      </form>

      <div className="text-center text-[10px] text-slate-400 pt-2">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs text-slate-400">Loading reset panel...</span>
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  )
}

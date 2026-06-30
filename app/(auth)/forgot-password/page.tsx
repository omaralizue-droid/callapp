'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import { forgotPasswordAction } from '@/actions/auth'

const forgotSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

type ForgotInput = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotInput) => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await forgotPasswordAction(data.email)
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setSuccess(true)
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
        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Reset Link Sent</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          If that email is registered in our database, we have sent a secure recovery link to reset your account credentials.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline mt-4 text-[11px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white tracking-tight">Recover Password</h2>
        <p className="text-xs text-slate-400 mt-1">We will email you a password recovery reset link</p>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-lg p-3 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300" htmlFor="email">
            Business Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="jane@company.com"
            disabled={isSubmitting}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
          />
          {errors.email && <span className="text-[10px] text-rose-400 font-medium">{errors.email.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending Recovery Link...
            </>
          ) : (
            'Send Reset Link'
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

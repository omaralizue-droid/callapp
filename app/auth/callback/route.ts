import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/overview'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Fallback profile sync for first-time Google OAuth signups
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
          })
          if (!dbUser) {
            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email!,
                supabaseId: user.id,
                role: 'AGENT',
              },
            })
          }
        }
      } catch (dbErr) {
        console.error('Failed database sync on OAuth callback:', dbErr)
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not exchange auth code for session`)
}

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isDummy = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id') || process.env.DEV_AUTH_BYPASS === 'true'
  const token = request.cookies.get('sb-mock-token')?.value
  const user = isDummy
    ? (token ? { id: token, email: 'omaralizue@gmail.com', name: 'Developer' } : { id: 'dev-user', email: 'omaralizue@gmail.com', name: 'Developer' })
    : await (async () => {
        try {
          const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                getAll() {
                  return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                  cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                  supabaseResponse = NextResponse.next({
                    request,
                  })
                  cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                  )
                },
              },
            }
          )
          const { data: { user } } = await supabase.auth.getUser()
          return user
        } catch {
          return null
        }
      })()

  const url = request.nextUrl.clone()

  // Guard dashboard routes (since they reside under root /calls, /coach, etc.)
  const protectedRoutes = ['/calls', '/coach', '/qa', '/overview', '/agents', '/analytics', '/reports', '/settings', '/upload', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route))
  
  if (isProtectedRoute) {
    if (!user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (url.pathname === '/login' || url.pathname === '/signup') {
    if (user) {
      url.pathname = '/overview'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - svg, png, jpg, webp, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'

export async function createClient() {
  const isDummy = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id') || process.env.DEV_AUTH_BYPASS === 'true'

  if (isDummy) {
    const cookieStore = await cookies()
    return {
      auth: {
        async getUser() {
          if (process.env.DEV_AUTH_BYPASS === 'true') {
            return {
              data: {
                user: {
                  id: 'dev-user',
                  email: 'omaralizue@gmail.com',
                  user_metadata: { name: 'Developer' }
                }
              },
              error: null
            }
          }
          const token = cookieStore.get('sb-mock-token')?.value
          if (!token) return { data: { user: null }, error: null }
          try {
            const user = await prisma.user.findUnique({
              where: { id: token }
            })
            if (user) {
              return { data: { user: { id: user.id, email: user.email } }, error: null }
            }
          } catch (e) {
            console.error('Mock auth database check failed:', e)
          }
          return { data: { user: null }, error: null }
        },
        async signInWithPassword({ email, password }: { email: string; password?: string }) {
          try {
            if (process.env.DEV_AUTH_BYPASS === 'true') {
              cookieStore.set('sb-mock-token', 'dev-user', { path: '/' })
              return { data: { user: { id: 'dev-user', email: email || 'omaralizue@gmail.com' } }, error: null }
            }
            const user = await prisma.user.findUnique({
              where: { email }
            })
            if (user) {
              cookieStore.set('sb-mock-token', user.id, { path: '/' })
              return { data: { user: { id: user.id, email: user.email } }, error: null }
            }
            return { data: { user: null }, error: { message: 'User not found in local mock sandbox.' } }
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Database error'
            return { data: { user: null }, error: { message: msg } }
          }
        },
        async signUp({ email }: { email: string }) {
          const mockId = 'mock-' + Math.random().toString(36).substring(2, 11)
          cookieStore.set('sb-mock-token', mockId, { path: '/' })
          return { data: { user: { id: mockId, email } }, error: null }
        },
        async signOut() {
          cookieStore.delete('sb-mock-token')
          return { error: null }
        },
        async resetPasswordForEmail() {
          return { error: null }
        },
        async updateUser() {
          return { error: null }
        }
      },
      storage: {
        from() {
          return {
            getPublicUrl(path: string) {
              return { data: { publicUrl: path } }
            }
          }
        }
      }
    } as unknown as Awaited<ReturnType<typeof createServerClient>>
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const isDummy = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id')

  if (isDummy) {
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return undefined
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return undefined
    }

    return {
      auth: {
        async getUser() {
          const token = getCookie('sb-mock-token')
          if (!token) return { data: { user: null }, error: null }
          return { data: { user: { id: token, email: 'mock@example.com' } }, error: null }
        },
        async signInWithPassword({ email }: { email: string }) {
          return { data: { user: { id: 'mock-user-id', email } }, error: null }
        },
        async signUp({ email }: { email: string }) {
          return { data: { user: { id: 'mock-user-id', email } }, error: null }
        },
        async signOut() {
          if (typeof document !== 'undefined') {
            document.cookie = 'sb-mock-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
          }
          return { error: null }
        },
        async signInWithOAuth() {
          if (typeof window !== 'undefined') {
            const redirectUrl = `${window.location.origin}/auth/callback?code=mock-code`
            window.location.href = redirectUrl
          }
          return { data: {}, error: null }
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
    } as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

import { serve } from 'inngest/next'
import { inngest, callUploadedFunction } from '@/lib/inngest'

// Expose Inngest webhook endpoint matching Vercel/Next.js App Router conventions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    callUploadedFunction,
  ],
})

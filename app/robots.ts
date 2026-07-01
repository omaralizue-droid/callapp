import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callpilot.ai'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/auth/callback',
        '/login',
        '/signup',
        '/reset-password',
        '/forgot-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

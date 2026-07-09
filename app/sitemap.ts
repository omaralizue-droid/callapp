import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blogData'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callpilot.ai'

  // 1. Static marketing pages
  const staticRoutes = [
    '',
    '/about',
    '/features',
    '/pricing',
    '/docs',
    '/help',
    '/blog',
    '/case-studies',
    '/faq',
    '/contact',
    '/terms',
    '/privacy',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Dynamic Blog Articles
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}

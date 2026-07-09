import type { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/blogData'
import BlogHubClient from '@/components/landing/BlogHubClient'

export const metadata: Metadata = {
  title: 'CallPilot AI Blog | Call Center & BPO Artificial Intelligence Guides',
  description: 'Guides, research, and best practices for automated quality assurance audits, speech analytics, and AI agent coaching in modern call centers and BPOs.',
  openGraph: {
    title: 'CallPilot AI Blog | Call Center & BPO Artificial Intelligence Guides',
    description: 'Guides, research, and best practices for automated quality assurance audits, speech analytics, and AI agent coaching in modern call centers and BPOs.',
    url: 'https://callpilot.ai/blog',
    type: 'website',
  }
}

const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  'name': 'CallPilot AI Blog',
  'description': 'Guides, research, and best practices for QA teams, BPO managers, and contact center leaders.',
  'publisher': {
    '@type': 'Organization',
    'name': 'CallPilot AI',
    'logo': 'https://callpilot.ai/favicon.ico'
  },
  'blogPost': BLOG_POSTS.map(post => ({
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'datePublished': post.publishedAt,
    'url': `https://callpilot.ai/blog/${post.slug}`
  }))
}

export default function BlogHubPage() {
  const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category)))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <BlogHubClient posts={BLOG_POSTS} categories={categories} />
    </>
  )
}

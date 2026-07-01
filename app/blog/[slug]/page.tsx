'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blogData'
import GoogleNav from '@/components/landing/GoogleNav'

const CATEGORY_COLORS: Record<string, string> = {
  'AI Call Center':           '#1a73e8',
  'Call Summary AI':          '#34a853',
  'QA Automation':            '#ea4335',
  'Contact Center Software':  '#f9ab00',
  'Customer Support AI':      '#1a73e8',
  'Speech Analytics':         '#34a853',
  'Conversation Intelligence':'#ea4335',
  'AI Coaching':              '#f9ab00',
  'Call Scoring':             '#1a73e8',
  'Agent Performance':        '#34a853',
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const post = BLOG_POSTS.find((p) => p.slug === slug)

  const isDark  = theme === 'dark'
  const bg      = isDark ? 'bg-[#1e1e1e]' : 'bg-white'
  const fg      = isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
  const muted   = isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
  const border  = isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'
  const cardBg  = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
  const primary = isDark ? '#8ab4f8' : '#1a73e8'

  if (!post) {
    return (
      <div className={`min-h-screen ${bg} ${fg} flex flex-col items-center justify-center gap-4`}>
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/blog" className="text-sm font-medium" style={{ color: primary }}>
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const catColor = CATEGORY_COLORS[post.category] || primary
  const relatedPosts = BLOG_POSTS.filter((p) => post.related.includes(p.slug))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.description,
    'image': `https://callpilot.ai${post.featuredImage}`,
    'datePublished': post.publishedAt,
    'author': { '@type': 'Organization', 'name': 'CallPilot AI', 'url': 'https://callpilot.ai' },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://callpilot.ai/blog/${post.slug}` },
  }

  return (
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <GoogleNav activePage="blog" theme={theme} toggleTheme={toggleTheme} />

      {/* Article header */}
      <section className="py-14 px-6" style={{ background: catColor + '10' }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
            style={{ color: catColor }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: catColor }}>
              {post.category}
            </span>
            <span className={`flex items-center gap-1 text-xs ${muted}`}>
              <Clock className="w-3.5 h-3.5" /> {post.readTime || '5 min read'}
            </span>
            <span className={`text-xs ${muted}`}>{post.publishedAt}</span>
          </div>

          <h1 className={`text-3xl md:text-4xl font-bold leading-tight mb-5 ${fg}`}>
            {post.title}
          </h1>
          <p className={`text-lg leading-relaxed ${muted}`}>{post.description}</p>
        </div>
      </section>

      {/* Featured image placeholder */}
      <div className="max-w-3xl mx-auto w-full px-6 mt-8">
        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${catColor}cc 0%, ${catColor}55 100%)` }}
        >
          <span className="text-white/70 text-sm font-medium">{post.title}</span>
        </div>
      </div>

      {/* Article body */}
      <main className="py-14 px-6 max-w-3xl mx-auto w-full flex-grow">
        <article
          className={`prose prose-base max-w-none leading-relaxed ${
            isDark ? 'prose-invert text-[#bdc1c6]' : 'text-[#3c4043]'
          }`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQs */}
        {post.faqs.length > 0 && (
          <div className={`mt-14 p-8 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-xl font-bold mb-6 ${fg}`}>Frequently asked questions</h3>
            <div className="space-y-5">
              {post.faqs.map((faq, fidx) => (
                <div key={fidx} className={`p-5 rounded-xl border ${isDark ? 'bg-[#1e1e1e] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
                  <p className={`text-sm font-semibold mb-1.5 ${fg}`}>{faq.q}</p>
                  <p className={`text-sm leading-relaxed ${muted}`}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className={`mt-14 pt-10 border-t ${border}`}>
            <h3 className={`text-xl font-bold mb-6 ${fg}`}>Related articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedPosts.map((related, rIdx) => {
                const relColor = CATEGORY_COLORS[related.category] || primary
                return (
                  <Link key={rIdx} href={`/blog/${related.slug}`}
                    className={`group p-5 rounded-2xl border hover:shadow-md transition-all flex flex-col gap-3 ${isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}
                  >
                    <span className="text-xs font-semibold" style={{ color: relColor }}>{related.category}</span>
                    <h4 className={`text-sm font-semibold leading-snug group-hover:underline ${fg}`}>{related.title}</h4>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${muted}`}>{related.description}</p>
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: relColor }}>
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-14 p-10 rounded-2xl text-center"
          style={{ background: isDark ? 'linear-gradient(135deg, #1a3a5c, #1e2d1e)' : `linear-gradient(135deg, ${catColor}, #0d652d)` }}
        >
          <h3 className="text-xl font-bold text-white mb-3">Start auditing your calls with AI</h3>
          <p className="text-white/80 text-sm mb-6">No credit card required. 14-day free trial.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-6 py-3 rounded-full hover:shadow-lg transition-all"
            style={{ color: '#1a73e8' }}
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className={`border-t py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${muted} ${border}`}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

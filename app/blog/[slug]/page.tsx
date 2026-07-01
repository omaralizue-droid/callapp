'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blogData'
import GoogleNav from '@/components/landing/GoogleNav'

const CATEGORY_COLORS: Record<string, string> = {
  'AI Call Center':           '#4f46e5',
  'Call Summary AI':          '#10b981',
  'QA Automation':            '#ef4444',
  'Contact Center Software':  '#f59e0b',
  'Customer Support AI':      '#4f46e5',
  'Speech Analytics':         '#10b981',
  'Conversation Intelligence':'#ef4444',
  'AI Coaching':              '#f59e0b',
  'Call Scoring':             '#4f46e5',
  'Agent Performance':        '#10b981',
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/blog" className="text-sm font-semibold text-indigo-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const catColor = CATEGORY_COLORS[post.category] || '#4f46e5'
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <GoogleNav activePage="blog" />

      {/* Header section */}
      <section className="py-14 px-6 border-b border-slate-100" style={{ background: catColor + '08' }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors"
            style={{ color: catColor }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: catColor }}>
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" /> {post.readTime || '5 min read'}
            </span>
            <span className="text-xs text-slate-500 font-medium">{post.publishedAt}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">{post.description}</p>
        </div>
      </section>

      {/* Hero Image */}
      <div className="max-w-3xl mx-auto w-full px-6 mt-8">
        <div className="w-full aspect-[21/9] rounded-xl overflow-hidden flex items-center justify-center shadow-sm"
          style={{ background: `linear-gradient(135deg, ${catColor}cc 0%, ${catColor}44 100%)` }}
        >
          <span className="text-white/80 text-sm font-bold">{post.title}</span>
        </div>
      </div>

      {/* Body */}
      <main className="py-14 px-6 max-w-3xl mx-auto w-full flex-grow bg-white">
        <article
          className="prose prose-base max-w-none leading-relaxed text-slate-700 prose-headings:text-slate-900 prose-a:text-indigo-600 prose-strong:text-slate-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQs */}
        {post.faqs.length > 0 && (
          <div className="mt-14 p-8 rounded-xl border border-slate-200 bg-white">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Frequently asked questions</h3>
            <div className="space-y-5">
              {post.faqs.map((faq, fidx) => (
                <div key={fidx} className="p-5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-800 mb-1.5">{faq.q}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Related articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedPosts.map((related, rIdx) => {
                const relColor = CATEGORY_COLORS[related.category] || '#4f46e5'
                return (
                  <Link key={rIdx} href={`/blog/${related.slug}`}
                    className="group p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm transition-all flex flex-col gap-3"
                  >
                    <span className="text-xs font-semibold" style={{ color: relColor }}>{related.category}</span>
                    <h4 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors">{related.title}</h4>
                    <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">{related.description}</p>
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-600" style={{ color: relColor }}>
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Action Banner */}
        <div className="mt-14 p-10 rounded-2xl text-center bg-indigo-600 shadow-md">
          <h3 className="text-xl font-bold text-white mb-3">Start auditing your calls with AI</h3>
          <p className="text-indigo-100 text-sm mb-6">No credit card required. 14-day free trial.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-6 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/50">
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}

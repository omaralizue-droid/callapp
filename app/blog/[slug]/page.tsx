import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blogData'
import GoogleNav from '@/components/landing/GoogleNav'

const CATEGORY_COLORS: Record<string, string> = {
  'QA Automation':            '#6366f1', // Indigo
  'Speech Analytics':         '#06b6d4', // Cyan
  'AI Coaching':              '#a855f7', // Purple
  'Call Summary AI':          '#f43f5e', // Rose
  'Customer Support AI':      '#10b981', // Emerald
  'Conversation Intelligence':'#ec4899', // Pink
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) {
    return {
      title: 'Article Not Found | CallPilot AI Blog',
      description: 'The requested call center AI article could not be found.',
    }
  }
  return {
    title: `${post.title} | CallPilot AI Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | CallPilot AI Blog`,
      description: post.description,
      images: [{ url: `https://callpilot.ai${post.featuredImage}` }],
      url: `https://callpilot.ai/blog/${post.slug}`,
      type: 'article',
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 font-sans"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <h1 className="text-xl font-bold">Article not found</h1>
        <Link href="/blog" className="text-xs font-semibold text-indigo-400 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const catColor = CATEGORY_COLORS[post.category] || '#6366f1'
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
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <GoogleNav activePage="blog" />

      {/* Header section */}
      <section className="py-20 px-6 border-b border-white/5 relative overflow-hidden" style={{ background: catColor + '08' }}>
        <div className="max-w-3xl mx-auto relative z-10">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold mb-8 hover:text-white transition-colors"
            style={{ color: catColor }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white"
              style={{ background: catColor }}>
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="w-3.5 h-3.5" /> {post.readTime || '5 min read'}
            </span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{post.publishedAt}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight text-white mb-5">
            {post.title}
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{post.description}</p>
        </div>
      </section>

      {/* Hero Image Swatch */}
      <div className="max-w-3xl mx-auto w-full px-6 mt-8">
        <div className="w-full aspect-[21/9] rounded-xl overflow-hidden flex items-center justify-center border border-white/5"
          style={{ background: `linear-gradient(135deg, ${catColor}cc 0%, ${catColor}22 100%)` }}
        >
          <span className="text-white/40 text-xs font-mono select-none">{post.slug}.jpg</span>
        </div>
      </div>

      {/* Body Content */}
      <main className="py-14 px-6 max-w-3xl mx-auto w-full flex-grow relative" style={{ background: 'var(--bg-primary)' }}>
        <article
          className="prose prose-sm prose-invert max-w-none leading-relaxed text-slate-300 prose-headings:text-white prose-a:text-indigo-400 prose-strong:text-white prose-code:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQs */}
        {post.faqs.length > 0 && (
          <div className="mt-14 p-8 rounded-2xl border border-white/5 bg-slate-900/40">
            <h3 className="text-base font-bold mb-6 text-white">Frequently asked questions</h3>
            <div className="space-y-4">
              {post.faqs.map((faq, fidx) => (
                <div key={fidx} className="p-4 rounded-xl border border-white/5 bg-slate-950/60">
                  <p className="text-xs font-bold text-slate-200 mb-1.5">{faq.q}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-white/5">
            <h3 className="text-base font-bold mb-6 text-white">Related articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedPosts.map((related, rIdx) => {
                const relColor = CATEGORY_COLORS[related.category] || '#6366f1'
                return (
                  <Link key={rIdx} href={`/blog/${related.slug}`}
                    className="group p-5 rounded-2xl border border-white/5 hover:border-white/10 bg-slate-900/20 transition-all flex flex-col gap-3"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: relColor }}>{related.category}</span>
                    <h4 className="text-xs font-bold leading-snug text-white group-hover:text-indigo-400 transition-colors">{related.title}</h4>
                    <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{related.description}</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold transition-transform group-hover:translate-x-1" style={{ color: relColor }}>
                      Read article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Action Banner */}
        <div className="mt-14 p-10 rounded-2xl text-center border border-white/5 relative overflow-hidden bg-slate-900/50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <h3 className="text-lg font-bold text-white mb-2">Start auditing your calls with AI</h3>
          <p className="text-[11px] mb-6" style={{ color: 'var(--text-secondary)' }}>No credit card required. 14-day free trial.</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-white font-bold text-xs px-6 py-3 rounded-xl text-indigo-950 hover:bg-slate-100 transition-colors shadow-lg"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs bg-slate-950/80" style={{ color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

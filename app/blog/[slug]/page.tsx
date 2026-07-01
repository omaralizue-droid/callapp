'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Sun, Moon, ArrowLeft } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blogData'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

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

  if (!post) {
    return (
      <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <Link href="/blog" className="text-cyan-500 hover:underline">
          Return to Blog Hub
        </Link>
      </div>
    )
  }

  const bgClass = theme === 'dark' ? 'bg-[#060813] text-slate-100' : 'bg-slate-50 text-slate-800'
  const headerClass = theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200/60 shadow-sm'
  const textTitleClass = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const textDescClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const textMutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const sectionBorderClass = theme === 'dark' ? 'border-white/5' : 'border-slate-200/60'
  const cardBgClass = theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/60 shadow-md'

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.description,
    'image': `https://callpilot.ai${post.featuredImage}`,
    'datePublished': post.publishedAt,
    'author': {
      '@type': 'Organization',
      'name': 'CallPilot AI',
      'url': 'https://callpilot.ai'
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://callpilot.ai/blog/${post.slug}`
    }
  }

  // Related articles lookup
  const relatedPosts = BLOG_POSTS.filter((p) => post.related.includes(p.slug))

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors duration-300 relative`}>
      
      {/* Dynamic JSON-LD Structured Data Schema Insertion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className={`sticky top-0 z-50 glass border-b ${headerClass} py-4 px-6 md:px-12 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${textTitleClass}`}>
              CallPilot<span className="text-cyan-500">.AI</span>
            </span>
          </Link>
        </div>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${textDescClass}`}>
          <Link href="/features" className="hover:text-cyan-500 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-cyan-500 transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-cyan-500 transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/10 hover:bg-white/5 text-cyan-400' 
                : 'border-slate-200 hover:bg-slate-100 text-cyan-600'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className={`text-sm font-medium hover:text-cyan-500 transition-colors ${textDescClass}`}>
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-gradient-to-tr from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.03]"
          >
            Connect Node
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow z-10 relative py-16 px-6 max-w-3xl mx-auto w-full">
        <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 text-xs font-bold mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Hub
        </Link>

        {/* Heading */}
        <article className="space-y-6">
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-cyan-500 uppercase tracking-widest">{post.category}</span>
            <span className={textMutedClass}>&bull;</span>
            <span className={textMutedClass}>{post.publishedAt}</span>
            <span className={textMutedClass}>&bull;</span>
            <span className={textMutedClass}>{post.readTime}</span>
          </div>

          <h1 className={`text-3xl md:text-5xl font-black ${textTitleClass} leading-tight`}>
            {post.title}
          </h1>

          {/* Featured Image Placeholder */}
          <div className={`w-full aspect-[21/9] rounded-xl overflow-hidden flex items-center justify-center border relative ${
            theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 opacity-60" />
            <span className={`text-[10px] font-bold uppercase tracking-widest relative z-10 ${textMutedClass}`}>
              Featured Image Placeholder: {post.featuredImage}
            </span>
          </div>

          {/* Article main body */}
          <div 
            className={`prose prose-sm max-w-none text-xs leading-relaxed space-y-6 pt-6 ${
              theme === 'dark' ? 'prose-invert text-slate-300' : 'text-slate-700'
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* FAQ schema inside article */}
          {post.faqs.length > 0 && (
            <div className={`p-8 rounded-xl border mt-12 space-y-6 ${cardBgClass}`}>
              <h3 className={`text-base font-bold ${textTitleClass}`}>Frequently Asked Questions</h3>
              <div className="space-y-4">
                {post.faqs.map((faq, fidx) => (
                  <div key={fidx} className="space-y-1.5 text-xs">
                    <span className={`block font-bold ${textTitleClass}`}>{faq.q}</span>
                    <span className={`block ${textDescClass}`}>{faq.a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className={`mt-16 pt-12 border-t ${sectionBorderClass} space-y-6`}>
            <h3 className={`text-lg font-bold ${textTitleClass}`}>Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related, rIdx) => (
                <div key={rIdx} className={`p-6 rounded-xl border ${cardBgClass} space-y-3`}>
                  <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{related.category}</span>
                  <h4 className={`text-sm font-bold ${textTitleClass} hover:text-cyan-500 transition-colors`}>
                    <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                  </h4>
                  <p className={`${textMutedClass} text-[11px] leading-relaxed line-clamp-2`}>{related.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t ${sectionBorderClass} py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${textMutedClass}`}>
        <p>&copy; {new Date().getFullYear()} CallPilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-cyan-500">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-cyan-500">Terms of Service</Link>
        </div>
      </footer>

    </div>
  )
}

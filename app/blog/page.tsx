'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Clock } from 'lucide-react'
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

export default function BlogHubPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category)))

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchSearch = search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = !activeCategory || post.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors duration-200">
      <GoogleNav activePage="blog" />

      {/* Hero */}
      <section className="py-16 px-6 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Blog</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">
            Call center AI insights
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Guides, research, and best practices for QA teams, BPO managers, and contact center leaders.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm outline-none bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 text-slate-800 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="px-6 py-5 border-b border-slate-100 bg-white sticky top-16 z-30">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              !activeCategory
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All articles
          </button>
          {categories.map(cat => {
            const color = CATEGORY_COLORS[cat] || '#4f46e5'
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                style={isActive
                  ? { background: color, color: '#fff', borderColor: color }
                  : { borderColor: '#e2e8f0', color: '#4b5563' }
                }
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 px-6 bg-white flex-grow">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg font-bold mb-2">No articles found</p>
              <p className="text-sm">Try a different search term or category.</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-8 text-slate-500 font-medium">{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const color = CATEGORY_COLORS[post.category] || '#4f46e5'
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 transition-all hover:shadow-sm"
                    >
                      {/* Placeholder Image */}
                      <div className="h-36 flex items-center justify-center text-3xl font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
                      >
                        {post.category.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start"
                          style={{ background: color + '12', color }}>
                          {post.category}
                        </span>
                        <h2 className="text-base font-bold leading-snug mb-3 group-hover:text-indigo-600 transition-colors flex-grow text-slate-900">
                          {post.title}
                        </h2>
                        <p className="text-xs leading-relaxed mb-4 text-slate-500 line-clamp-2">{post.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {post.readTime || '5 min read'}</span>
                          <span className="flex items-center gap-1 font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform" style={{ color }}>
                            Read more <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

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

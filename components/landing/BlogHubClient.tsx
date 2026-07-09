'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Clock } from 'lucide-react'
import type { BlogPost } from '@/lib/blogData'
import GoogleNav from '@/components/landing/GoogleNav'

interface BlogHubClientProps {
  posts: BlogPost[]
  categories: string[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'QA Automation':            '#6366f1', // Indigo
  'Speech Analytics':         '#06b6d4', // Cyan
  'AI Coaching':              '#a855f7', // Purple
  'Call Summary AI':          '#f43f5e', // Rose
  'Customer Support AI':      '#10b981', // Emerald
  'Conversation Intelligence':'#ec4899', // Pink
}

export default function BlogHubClient({ posts, categories }: BlogHubClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredPosts = posts.filter(post => {
    const matchSearch = search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = !activeCategory || post.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <GoogleNav activePage="blog" />

      {/* Hero */}
      <section className="relative py-20 px-6 text-center border-b border-white/5 overflow-hidden aurora-bg">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 gradient-text">Blog</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Call center AI <span className="gradient-text-bright">insights</span>
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Guides, research, and best practices for QA teams, BPO managers, and contact center leaders.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-white/10 text-xs outline-none bg-slate-900/50 focus:border-indigo-500 text-white transition-all placeholder:text-slate-500 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="px-6 py-4 border-b border-white/5 sticky top-16 z-30" style={{ background: 'rgba(6, 10, 26, 0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
              !activeCategory
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
            }`}
          >
            All articles
          </button>
          {categories.map(cat => {
            const color = CATEGORY_COLORS[cat] || '#6366f1'
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className="px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer"
                style={isActive
                  ? { background: color, color: '#fff', borderColor: color }
                  : { borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }
                }
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 flex-grow" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-base font-bold mb-2">No articles found</p>
              <p className="text-xs">Try a different search term or category.</p>
            </div>
          ) : (
            <>
              <p className="text-xs mb-8 font-medium" style={{ color: 'var(--text-secondary)' }}>
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const color = CATEGORY_COLORS[post.category] || '#6366f1'
                  const initials = post.category.slice(0, 2).toUpperCase()
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl border border-white/5 overflow-hidden bg-slate-900/40 hover:border-white/10 transition-all duration-300"
                    >
                      {/* Image Block */}
                      <div className="h-40 flex items-center justify-center text-3xl font-black text-white relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}33)` }}
                      >
                        {initials}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                      </div>

                      <div className="p-6 flex flex-col flex-grow space-y-4">
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full self-start"
                          style={{ background: color + '18', color }}>
                          {post.category}
                        </span>
                        <h2 className="text-sm font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors flex-grow">
                          {post.title}
                        </h2>
                        <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {post.readTime || '5 min read'}</span>
                          <span className="flex items-center gap-1 font-bold transition-transform group-hover:translate-x-1" style={{ color }}>
                            Read article <ArrowRight className="w-3.5 h-3.5" />
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

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, Clock } from 'lucide-react'
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

export default function BlogHubPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const isDark  = theme === 'dark'
  const bg      = isDark ? 'bg-[#1e1e1e]' : 'bg-white'
  const fg      = isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
  const muted   = isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
  const border  = isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'
  const cardBg  = isDark ? 'bg-[#2d2d2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'
  const surface = isDark ? 'bg-[#252525]' : 'bg-[#f8f9fa]'
  const inputBg = isDark ? 'bg-[#2d2d2d] border-[#3c4043] text-[#e8eaed] placeholder-[#9aa0a6]' : 'bg-white border-[#dadce0] text-[#202124] placeholder-[#9aa0a6]'
  const primary = isDark ? '#8ab4f8' : '#1a73e8'

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
    <div className={`min-h-screen ${bg} ${fg} flex flex-col font-sans transition-colors duration-200`}
      data-theme={isDark ? 'dark' : undefined}
    >
      <GoogleNav activePage="blog" theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <section className={`py-16 px-6 ${surface}`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold mb-3" style={{ color: primary }}>Blog</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${fg}`}>
            Call center AI insights
          </h1>
          <p className={`text-lg mb-8 ${muted}`}>
            Guides, research, and best practices for QA teams, BPO managers, and contact center leaders.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-full border text-sm outline-none focus:ring-2 transition-all ${inputBg}`}
              style={{ '--tw-ring-color': primary } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      {/* Category filter chips */}
      <section className={`px-6 py-5 border-b ${border} sticky top-16 z-30 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !activeCategory
                ? 'text-white border-transparent'
                : `${border} ${muted}`
            }`}
            style={!activeCategory ? { background: primary, borderColor: primary } : {}}
          >
            All articles
          </button>
          {categories.map(cat => {
            const color = CATEGORY_COLORS[cat] || primary
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all`}
                style={isActive
                  ? { background: color, color: '#fff', borderColor: color }
                  : { borderColor: isDark ? '#3c4043' : '#dadce0', color: isDark ? '#9aa0a6' : '#5f6368' }
                }
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-14 px-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className={`text-center py-20 ${muted}`}>
              <p className="text-lg font-semibold mb-2">No articles found</p>
              <p className="text-sm">Try a different search term or category.</p>
            </div>
          ) : (
            <>
              <p className={`text-sm mb-8 ${muted}`}>{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const color = CATEGORY_COLORS[post.category] || primary
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className={`group flex flex-col rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${cardBg}`}
                    >
                      {/* Card image area */}
                      <div className="h-36 flex items-center justify-center text-4xl font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
                      >
                        {post.category.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                          style={{ background: color + '18', color }}>
                          {post.category}
                        </span>
                        <h2 className={`text-base font-semibold leading-snug mb-3 group-hover:underline flex-grow ${fg}`}>
                          {post.title}
                        </h2>
                        <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${muted}`}>{post.description}</p>
                        <div className={`flex items-center justify-between text-xs ${muted}`}>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime || '5 min read'}</span>
                          <span className="flex items-center gap-1 font-semibold" style={{ color }}>
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

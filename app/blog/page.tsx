'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, Sun, Moon, Search } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blogData'

export default function BlogHubPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme') as 'dark' | 'light'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('landing-theme', next)
  }

  const bgClass = theme === 'dark' ? 'bg-[#060813] text-slate-100' : 'bg-slate-50 text-slate-800'
  const headerClass = theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200/60 shadow-sm'
  const textTitleClass = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const textDescClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const textMutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const sectionBorderClass = theme === 'dark' ? 'border-white/5' : 'border-slate-200/60'
  const cardBgClass = theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/60 shadow-md hover:shadow-lg'

  // Filter based on search criteria
  const filteredPosts = BLOG_POSTS.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.description.toLowerCase().includes(search.toLowerCase()) ||
    post.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors duration-300 relative`}>
      
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
          <Link href="/blog" className="text-cyan-500 font-semibold">Blog</Link>
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
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow z-10 relative py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase block">Resources & Insights</span>
          <h1 className={`text-4xl md:text-5xl font-black ${textTitleClass}`}>
            CallPilot AI Blog
          </h1>
          <p className={`${textDescClass} text-base max-w-xl mx-auto`}>
            Obtain speech analytics strategies, BPO compliance frameworks, and conversation intelligence checklists.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-6">
            <div className={`flex items-center gap-2 border rounded-lg px-3.5 py-2.5 w-full ${
              theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                placeholder="Search articles by keywords, topics, or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`bg-transparent border-none text-xs placeholder-slate-500 outline-none w-full ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-6 border flex flex-col justify-between transition-all duration-300 ${cardBgClass}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-cyan-500 uppercase tracking-widest">{post.category}</span>
                  <span className={textMutedClass}>{post.publishedAt}</span>
                </div>
                <h2 className={`text-lg font-bold leading-snug ${textTitleClass} hover:text-cyan-500 transition-colors`}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={`${textDescClass} text-xs leading-relaxed line-clamp-3`}>{post.description}</p>
              </div>

              <div className="pt-6 flex justify-between items-center text-[11px] border-t border-white/5 mt-6">
                <span className={textMutedClass}>{post.readTime}</span>
                <Link href={`/blog/${post.slug}`} className="text-cyan-500 hover:text-cyan-400 font-bold flex items-center gap-1">
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <span className={`${textMutedClass} text-sm`}>No articles matching your search query. Try another keyword!</span>
          </div>
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

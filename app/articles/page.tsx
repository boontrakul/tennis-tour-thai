'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, ChevronDown, Clock, ChevronRight, Loader2, Star } from 'lucide-react'

// --- Types ---
interface Article {
  id: number
  title: string
  content: string
  category: string
  image_url: string
  created_at: string
  is_featured: boolean
}

// --- Helper Functions ---
const timeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(9)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // หมวดหมู่บทความ (อิงตาม Category ใน Database ของคุณ)
  const categories = ['All', 'Training', 'Gear', 'News', 'Health']

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('is_featured', { ascending: false }) // ปักหมุดขึ้นก่อน
        .order('created_at', { ascending: false })  // ใหม่ล่าสุดขึ้นก่อน
      
      if (error) {
        console.error('Error fetching articles:', error)
      }
      if (data) setArticles(data)
      setLoading(false)
    }
    fetchArticles()
  }, [])

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.parentElement?.querySelector('.emoji-fallback');
    if (fallback) fallback.classList.remove('hidden');
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const displayedArticles = filteredArticles.slice(0, visibleCount)

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-32 pb-20 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 container mx-auto px-4">
          <span className="bg-[#CCFF00] text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg mb-6 inline-block">
            The Blog
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-4">
            Tennis <span className="text-[#CCFF00]">Tour Thai</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] max-w-xl mx-auto">
            Updates, training tips, and gear reviews from the community.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
        
        {/* --- CONTROLS BAR --- */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mb-16 border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm outline-none focus:border-[#CCFF00] transition-all placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-[#CCFF00] shadow-lg scale-105'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-[#CCFF00]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-slate-300">
             <Loader2 size={40} className="animate-spin text-[#CCFF00] mb-4" />
             <span className="text-xs font-black uppercase tracking-widest">Loading Content...</span>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {displayedArticles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id} className="group flex flex-col h-full">
                <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#CCFF00]/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                  
                  {/* Image Area */}
                  <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-100">
                    <div className={`emoji-fallback ${article.image_url ? 'hidden' : ''} absolute inset-0 flex flex-col items-center justify-center gap-2`}>
                      <div className="w-12 h-12 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-md rotate-12 group-hover:rotate-0 transition-transform">
                        <span className="text-2xl">🎾</span>
                      </div>
                    </div>

                    {article.image_url && (
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImgError} />
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-slate-900/90 backdrop-blur-sm text-[#CCFF00] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                        {article.category || 'Article'}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {article.is_featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col flex-grow px-2 pb-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                       <Clock size={12} className="text-[#CCFF00]" /> 
                       <span>{timeAgo(article.created_at)}</span>
                    </div>
                    
                    <h2 className="text-xl font-black text-slate-900 group-hover:text-[#84cc16] transition-colors leading-tight mb-3 uppercase italic line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
                      {article.content?.replace(/<[^>]*>/g, '')}...
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                      <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest group-hover:text-slate-900 transition-colors">
                        Read Full Story
                      </span>
                      <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:scale-110 transition-all">
                        <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
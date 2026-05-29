'use client'

// ✅ บังคับล้างแคชฝั่งเซิร์ฟเวอร์ ดึงข้อมูลสดใหม่จาก Supabase ทุกครั้งที่เปิดหน้าเว็บ
export const revalidate = 0
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, BookOpen, Clock, ChevronRight, Loader2 } from 'lucide-react'

const categories = [
  'All',
  'General',
  'Lifestyle',
  'Training',
  'Gear',
  'News',
  'Health',
  'Mental Game',
  'Pro Tour',
  'Nutrition'
]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        // ✅ เรียงลำดับตัวเลขควบคุมเอง และปัดค่าว่าง (NULL) ไปไว้ท้ายสุด
        .order('is_featured', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching articles:', error)
      }
      if (data) {
        setArticles(data)
      }
      setLoading(false)
    }
    fetchArticles()
  }, [])

  // ระบบกรองข้อมูล (Search & Filter Category)
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-32 font-sans text-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* --- HEADER BAR --- */}
        <div className="mb-12 flex flex-col lg:flex-row gap-6 justify-between items-center max-w-4xl mx-auto">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900">
              Tennis <span className="text-[#84cc16]">Insights</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Knowledge, Techniques, and Gear Reviews</p>
          </div>

          {/* Search Box */}
          <div className="relative group w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#84cc16] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-[#84cc16]/20 focus:border-[#84cc16] transition-all text-sm font-bold placeholder:text-slate-300"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- CATEGORIES FILTER --- */}
        <div className="flex flex-wrap gap-2 justify-center mb-12 max-w-4xl mx-auto p-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-[#CCFF00] shadow-md'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- ARTICLES GRID --- */}
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-4 text-slate-300 font-bold uppercase animate-pulse">
            <Loader2 className="animate-spin text-[#84cc16]" size={40} />
            <span className="text-xs tracking-widest text-slate-400">Loading Insights...</span>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <Link 
                href={`/articles/${art.id}`} 
                key={art.id} 
                className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <span className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {art.category}
                  </span>
                  
                  {art.image_url ? (
                    <img 
                      src={art.image_url} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎾</div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(art.created_at).toLocaleDateString('en-GB')}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 text-[9px]">Lng: {art.lang || 'TH'}</span>
                  </div>

                  <h3 className="text-base md:text-lg font-black text-slate-900 leading-snug mb-4 uppercase italic group-hover:text-[#84cc16] transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                    <span>Read Article</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#CCFF00] transition-all">
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-900" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 font-black text-slate-200 uppercase tracking-widest italic text-xl">
            No Articles Found
          </div>
        )}

      </div>
    </main>
  )
}
'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, Pin, MessageSquare, Clock, Plus, User, Loader2 } from 'lucide-react'

// ✅ ข้อมูลหมวดหมู่และสี
const categoriesData = [
  { name: 'All', bg: '#f1f5f9', text: '#475569' },
  { name: 'หาเพื่อนตีเทนนิส', bg: '#eff6ff', text: '#2563eb' },
  { name: 'รีวิวอุปกรณ์เทนนิส', bg: '#faf5ff', text: '#9333ea' },
  { name: 'รีวิวสนามเทนนิส', bg: '#ecfdf5', text: '#059669' },
  { name: 'เทคนิคและการฝึกซ้อม', bg: '#fff7ed', text: '#ea580c' }
]

function ForumContent() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`*, comments:forum_comments(count)`)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (data) setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Tennis <span className="text-[#CCFF00]">Forum</span></h1>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-5xl -mt-10 relative z-20">
        {/* --- CONTROLS BAR --- */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-xl border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-5">
                <div className="relative flex-grow">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search discussions..." 
                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-bold text-sm outline-none focus:border-[#CCFF00] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link href="/forum/new" className="bg-[#CCFF00] text-slate-900 px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-[#CCFF00] transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#CCFF00]/20">
                    <Plus size={16} strokeWidth={3} /> New Topic
                </Link>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-5 border-t border-slate-100">
              {categoriesData.map((cat) => (
                <button 
                  key={cat.name} 
                  onClick={() => setSelectedCategory(cat.name)} 
                  style={{ 
                    backgroundColor: selectedCategory === cat.name ? '#0f172a' : cat.bg,
                    color: selectedCategory === cat.name ? '#CCFF00' : cat.text,
                    borderColor: selectedCategory === cat.name ? '#0f172a' : 'transparent'
                  }}
                  className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border shadow-sm"
                >
                  {cat.name}
                </button>
              ))}
            </div>
        </div>

        {/* --- THREADS LIST: รายการกระทู้ที่ปรับปรุงใหม่ --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-[#CCFF00]" size={40} />
               <p className="font-black text-slate-300 uppercase text-xs tracking-widest">Loading...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredPosts.map((post) => {
                const catInfo = categoriesData.find(c => c.name === post.category) || categoriesData[0];
                const commentCount = post.comments?.[0]?.count || 0;

                return (
                  <Link href={`/forum/${post.id}`} key={post.id} className="group block px-6 py-4 hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="flex-grow min-w-0">
                        
                        {/* ✅ บรรทัดบน: รวมหมวดหมู่ + ผู้เขียน + วันที่ เพื่อประหยัดพื้นที่ */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                          <span 
                            style={{ backgroundColor: catInfo.bg, color: catInfo.text }}
                            className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded border border-slate-100/50"
                          >
                            {post.category}
                          </span>
                          
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                              <User size={12} className="text-slate-300" /> {post.author_name}
                            </span>
                            <span className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                              <Clock size={12} className="text-slate-300" /> {new Date(post.created_at).toLocaleDateString('en-GB')}
                            </span>
                          </div>

                          {post.is_pinned && (
                            <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 ml-auto md:ml-0">
                              Pinned
                            </span>
                          )}
                        </div>
                        
                        {/* ✅ ชื่อกระทู้ขนาดกะทัดรัด (Compact Style) */}
                        <h3 className="!text-[15px] md:!text-[17px] font-bold text-slate-900 group-hover:text-[#84cc16] transition-colors leading-tight truncate">
                          {post.title}
                        </h3>
                        
                      </div>
                      
                      {/* ส่วนแสดงจำนวน Replies */}
                      <div className="flex-shrink-0 bg-slate-50 px-4 py-2 rounded-2xl text-center min-w-[75px] border border-slate-100 group-hover:border-[#CCFF00] group-hover:bg-white transition-all">
                        <div className="text-[18px] font-black text-slate-900 leading-none">{commentCount}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase mt-1">Replies</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-40 font-black text-slate-200 uppercase tracking-widest italic">No Content Found</div>
          )}
        </div>
      </section>
    </main>
  )
}

export default function ForumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-[#CCFF00]" size={40} /></div>}>
      <ForumContent />
    </Suspense>
  )
}
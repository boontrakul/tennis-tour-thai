'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Plus, Loader2, User, Heading, AlignLeft, Shield, Tag } from 'lucide-react'

// ✅ อัปเดตผังหมวดหมู่ชุดใหม่สำหรับให้ผู้ใช้กดเลือกตอนสร้างกระทู้ใหม่ครับพี่บุ๊ค
const forumCategories = [
  'หาเพื่อน/โค้ชตีเทนนิส',
  'รีวิวสนามและอุปกรณ์เทนนิส',
  'ซื้อขายอุปกรณ์เทนนิส',
  'พูดคุยทั่วไป'
]

export default function AddForumPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(forumCategories[0])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert([{
          title: formData.get('title'),
          content: formData.get('content'),
          category: category,
          author_name: formData.get('author_name') || 'Anonymous',
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      router.push('/forum')
      setTimeout(() => alert('🎉 สร้างกระทู้ใหม่เรียบร้อยแล้ว!'), 500)
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = "block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 ml-3 flex items-center gap-2"
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none"
  const inputIconStyle = "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CCFF00] transition-colors"

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-50 pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        <Link href="/forum" className="inline-flex items-center gap-2 text-white/70 font-bold uppercase text-[11px] tracking-widest mb-10 hover:text-[#CCFF00] transition-all">
          <ArrowLeft size={16} strokeWidth={3} /> Back to Forum
        </Link>

        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] p-8 md:p-16 relative overflow-hidden">
          
          <header className="mb-14 text-center">
             <div className="inline-flex items-center gap-2 bg-slate-900 text-[#CCFF00] px-4 py-1.5 rounded-full mb-4 shadow-md">
                <Shield size={12} className="text-[#CCFF00]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Community Hub</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight">
               Create New <span className="text-[#CCFF00]" style={{ WebkitTextStroke: '1.5px #0f172a' }}>Topic</span>
             </h1>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Start a new discussion or ask the community.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Category Selection */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><Tag size={16} /> Select Category</label>
              <div className="flex flex-wrap gap-2">
                {forumCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-tight transition-all ${
                      category === cat 
                        ? 'bg-slate-900 border-slate-900 text-[#CCFF00] shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Author Name */}
            <div className="relative group">
              <label className={labelStyle}>Your Name (ชื่อของคุณ)</label>
              <User size={18} className={inputIconStyle} />
              <input 
                name="author_name" 
                placeholder="e.g. นนท์ เทนนิส, Coach Top" 
                className={inputStyle} 
                required
              />
            </div>

            {/* 3. Title */}
            <div className="relative group">
              <label className={labelStyle}>Topic Title (หัวข้อกระทู้)</label>
              <Heading size={18} className={inputIconStyle} />
              <input 
                name="title" 
                required 
                placeholder="e.g. หาเพื่อนตีเทนนิสแถวรามคำแหงเย็นวันเสาร์นี้ครับ" 
                className={inputStyle} 
              />
            </div>

            {/* 4. Content */}
            <div className="relative group">
              <label className={labelStyle}><AlignLeft size={16} /> Content Detail (เนื้อหา)</label>
              <textarea 
                name="content" 
                required 
                rows={10} 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none resize-none leading-relaxed placeholder:text-slate-300" 
                placeholder="พิมพ์รายละเอียดกระทู้ของคุณที่นี่..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#84cc16] text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(132,204,22,0.4)] hover:bg-slate-900 hover:text-[#CCFF00] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Create Topic <MessageSquare size={16} />
                </>
              )}
            </button>
            
          </form>
        </div>
      </div>
    </main>
  )
}
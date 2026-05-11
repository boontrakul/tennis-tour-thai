'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Send, Loader2, MessageSquare, Tag, 
  User, AlignLeft, AlertCircle, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'

// รายการหมวดหมู่กระทู้ (Category) ให้ตรงกับที่เราทำสี Tag ไว้
const forumCategories = [
  'หาเพื่อนตีเทนนิส',
  'รีวิวอุปกรณ์เทนนิส',
  'รีวิวสนามเทนนิส',
  'เทคนิคและการฝึกซ้อม',
  'พูดคุยทั่วไป'
]

export default function AddForumPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(forumCategories[0])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          author_name: formData.get('author_name') || 'Anonymous Member',
          // status: 'approved' // ถ้าอยากให้แอดมินตรวจก่อนค่อยเปิดบรรทัดนี้แล้วเปลี่ยนเป็น 'pending'
        }])

      if (error) throw error

      router.push('/forum')
      setTimeout(() => alert('🎉 กระทู้ของคุณถูกสร้างเรียบร้อยแล้ว!'), 500)
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
          <ArrowLeft size={16} strokeWidth={3} /> Back to Community
        </Link>

        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] p-8 md:p-16 relative overflow-hidden">
          
          <header className="mb-14 text-center">
             <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full mb-4">
                <MessageSquare size={14} className="text-[#84cc16]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Topic</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight">
               Start a <span className="text-[#CCFF00]" style={{ WebkitTextStroke: '1.5px #0f172a' }}>Conversation</span>
             </h1>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Connect with tennis players across Thailand.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Category Selection */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><Tag size={16} /> Choose Category</label>
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

            {/* 2. Topic Details */}
            <div className="space-y-6">
              <div className="relative group">
                <label className={labelStyle}>Topic Title (หัวข้อ)</label>
                <Tag size={18} className={inputIconStyle} />
                <input 
                  name="title" 
                  required 
                  placeholder="e.g. แนะนำไม้เทนนิสสำหรับมือใหม่หน่อยครับ" 
                  className={inputStyle} 
                />
              </div>

              <div className="relative group">
                <label className={labelStyle}>Your Name</label>
                <User size={18} className={inputIconStyle} />
                <input 
                  name="author_name" 
                  placeholder="ใส่ชื่อหรือนามแฝงของคุณ" 
                  className={inputStyle} 
                />
              </div>

              <div className="relative group">
                <label className={labelStyle}><AlignLeft size={16} /> Content (เนื้อหา)</label>
                <textarea 
                  name="content" 
                  required 
                  rows={8} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none resize-none" 
                  placeholder="เขียนรายละเอียดสิ่งที่คุณต้องการพูดคุยหรือสอบถาม..."
                ></textarea>
              </div>
            </div>

            {/* 3. Guidelines Note */}
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start">
               <AlertCircle className="text-[#84cc16] shrink-0" size={20} />
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                 <strong className="text-slate-900 uppercase">Community Guidelines:</strong> <br />
                 โปรดใช้คำสุภาพในการตั้งกระทู้ และไม่โพสต์ข้อความที่เป็นการโฆษณาชวนเชื่อหรือเนื้อหาที่ไม่เหมาะสม เพื่อสังคมเทนนิสที่ดีของเราครับ
               </p>
            </div>

            {/* Submit Button - สีส้มโดดเด่นตามสไตล์ Add Action */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ff6b00] text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(255,107,0,0.4)] hover:bg-[#e66000] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Publish Topic <Send size={16} />
                </>
              )}
            </button>
            
          </form>
        </div>
      </div>
    </main>
  )
}
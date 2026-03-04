import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Tag, Share2 } from 'lucide-react'

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 1. ดึงข้อมูลบทความจาก Database
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-20 text-center">
        <div className="font-black text-slate-300 uppercase italic tracking-widest">
           Article Not Found (ID: {id})
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      
      {/* --- HERO HEADER: เน้นหัวข้อที่ชัดเจน --- */}
      <section className="bg-slate-900 pt-36 pb-20 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/articles" className="inline-flex items-center gap-2 text-[#CCFF00] text-[11px] font-black uppercase tracking-widest mb-10 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Insights
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase italic shadow-lg shadow-[#CCFF00]/20">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[1.1] mb-8 drop-shadow-2xl">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-t border-white/10 pt-8">
            <span className="flex items-center gap-2 text-white"><User size={14} className="text-[#CCFF00]" /> By Tennis Thailand Team</span>
            <span className="flex items-center gap-2"><Clock size={14} /> {new Date(article.created_at).toLocaleDateString()}</span>
            <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
              <Share2 size={14} /> Share Article
            </button>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT SECTION --- */}
      <section className="container mx-auto px-4 max-w-4xl -mt-12 relative z-10">
        
        {/* ✅ Featured Image with Icon Fallback */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl flex items-center justify-center mb-16">
          <div className="emoji-fallback flex flex-col items-center gap-4">
             <div className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-xl rotate-12">
                <span className="text-4xl">🎾</span>
             </div>
             <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">Tennis Thailand Official</p>
          </div>
          
          {article.image_url && (
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="absolute inset-0 w-full h-full object-cover"
              // ใน Server Component แท็ก img จะแสดงผลทันทีและถูกทับ emoji-fallback โดยธรรมชาติ
            />
          )}
        </div>

        {/* --- ARTICLE BODY: เน้นความกระชับและอ่านง่าย --- */}
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-slate-50">
          <article className="prose prose-slate prose-lg max-w-none">
            {/* ปรับแต่งการแสดงผลเนื้อหา (รองรับ HTML เบื้องต้น) */}
            <div 
              className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </article>

          {/* Tags / Footer */}
          <div className="mt-16 pt-10 border-t border-slate-50 flex flex-wrap gap-3">
             <span className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mr-4">
               <Tag size={14} /> Tagged in:
             </span>
             {['Training', 'Technique', 'Professional'].map((t) => (
               <span key={t} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-[#CCFF00] hover:text-slate-900 transition-all cursor-pointer">
                 #{t}
               </span>
             ))}
          </div>
        </div>

        {/* --- RELATED CTA: นำทางกลับไปอ่านบทความอื่น --- */}
        <div className="mt-20 text-center">
           <Link 
              href="/articles" 
              className="inline-flex flex-col items-center gap-4 group"
           >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">
                 Back to Insights
              </span>
              <div className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all shadow-sm">
                 <ArrowLeft size={24} className="text-slate-300 group-hover:text-slate-900" />
              </div>
           </Link>
        </div>

      </section>
    </main>
  )
}
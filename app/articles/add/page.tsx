'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Upload, Loader2, Tag, ImagePlus, X, 
  FileText, Heading, AlignLeft, Star, Shield, Languages, User
} from 'lucide-react'
import Link from 'next/link'

// หมวดหมู่บทความอิงตามข้อมูลจริงในตารางด้านหลังบ้านของพี่บุ๊ค
const articleCategories = [
  'Training',
  'Gear',
  'News',
  'Health',
  'Mental Game',
  'Pro Tour',
  'Nutrition'
]

export default function AdminAddArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(articleCategories[0])
  const [isFeatured, setIsFeatured] = useState(false)
  const [lang, setLang] = useState('TH') 
  
  const [imageFile, setImageFile] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setPreviewUrl('')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    let uploadedImageUrl = null
    
    try {
      // 1. อัปโหลดรูปภาพไปยัง Supabase Storage ใน Bucket 'Court_image' ที่ใช้งานได้จริง
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `article-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('Court_image') 
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('Court_image')
          .getPublicUrl(fileName)
        
        uploadedImageUrl = publicUrl
      }

      // 2. บันทึกข้อมูลลงฐานข้อมูลตาราง articles ตรงตามคอลัมน์ของพี่บุ๊ค
      const { error } = await supabase
        .from('articles')
        .insert([{
          title: formData.get('title'),
          content: formData.get('content'),
          category: category,
          image_url: uploadedImageUrl,
          is_featured: isFeatured,
          lang: lang, 
          author: formData.get('author') || 'Admin Hub', 
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      router.push('/articles')
      setTimeout(() => alert('🎉 บันทึกบทความใหม่เข้าสู่ระบบเรียบร้อยแล้ว!'), 500)
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
        
        <Link href="/articles" className="inline-flex items-center gap-2 text-white/70 font-bold uppercase text-[11px] tracking-widest mb-10 hover:text-[#CCFF00] transition-all">
          <ArrowLeft size={16} strokeWidth={3} /> Back to Articles
        </Link>

        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] p-8 md:p-16 relative overflow-hidden">
          
          <header className="mb-14 text-center">
             <div className="inline-flex items-center gap-2 bg-slate-900 text-[#CCFF00] px-4 py-1.5 rounded-full mb-4 shadow-md">
                <Shield size={12} className="text-[#CCFF00]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin Hub</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight">
               Create New <span className="text-[#CCFF00]" style={{ WebkitTextStroke: '1.5px #0f172a' }}>Article</span>
             </h1>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Publish official tennis content, news, and gear reviews.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Category Selection */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><Tag size={16} /> Select Category</label>
              <div className="flex flex-wrap gap-2">
                {articleCategories.map((cat) => (
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

            {/* 2. Article Cover Image */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><ImagePlus size={16} /> Article Cover Image</label>
              <div className="max-w-md">
                {previewUrl ? (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-white shadow-md group">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button" 
                      onClick={removeImage} 
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <label className="aspect-[16/9] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#CCFF00] bg-white flex flex-col items-center justify-center cursor-pointer text-slate-300 hover:text-[#CCFF00] transition-all">
                    <Upload size={28} />
                    <span className="text-[10px] font-black uppercase mt-3 tracking-widest">Upload Cover</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
                  </label>
                )}
              </div>
            </div>

            {/* 3. Language & Featured Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div>
                  <label className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1 flex items-center gap-2">
                    <Languages size={16} className="text-slate-500" /> Article Language
                  </label>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ภาษาปัจจุบัน: {lang}</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-200/60 rounded-xl">
                  <button type="button" onClick={() => setLang('TH')} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'TH' ? 'bg-slate-900 text-[#CCFF00]' : 'text-slate-500 hover:text-slate-900'}`}>TH</button>
                  <button type="button" onClick={() => setLang('EN')} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'EN' ? 'bg-slate-900 text-[#CCFF00]' : 'text-slate-500 hover:text-slate-900'}`}>EN</button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div>
                  <label className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1 flex items-center gap-2">
                    <Star size={16} className={isFeatured ? "text-yellow-500 fill-yellow-500" : "text-slate-400"} /> Featured Article
                  </label>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ปักหมุดกระทู้เด่น</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${isFeatured ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                  <div className={`bg-[#CCFF00] w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* 4. Author Name */}
            <div className="relative group">
              <label className={labelStyle}>Author (ผู้เขียน)</label>
              <User size={18} className={inputIconStyle} />
              <input 
                name="author" 
                placeholder="e.g. Admin Hub, Coach Dan" 
                defaultValue="BOONTRAKUL"
                className={inputStyle} 
              />
            </div>

            {/* 5. Article Title & Content */}
            <div className="space-y-6">
              <div className="relative group">
                <label className={labelStyle}>Article Title (หัวข้อบทความ)</label>
                <Heading size={18} className={inputIconStyle} />
                <input 
                  name="title" 
                  required 
                  placeholder="e.g. 5 เทคนิคการเสิร์ฟลูกเทนนิสให้มีความรุนแรงและแม่นยำ" 
                  className={inputStyle} 
                />
              </div>

              <div className="relative group">
                <label className={labelStyle}><AlignLeft size={16} /> Main Content (เนื้อหาบทความ)</label>
                <textarea 
                  name="content" 
                  required 
                  rows={15} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none resize-none leading-relaxed" 
                  placeholder="พิมพ์หรือวางเนื้อหาบทความแบบเต็มที่นี่..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ff6b00] text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(255,107,0,0.4)] hover:bg-[#e66000] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Publish Article <FileText size={16} />
                </>
              )}
            </button>
            
          </form>
        </div>
      </div>
    </main>
  )
}
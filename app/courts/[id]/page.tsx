'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
// ✅ เพิ่ม MessageSquare, Send, UserCircle สำหรับระบบคอมเมนต์
import { ArrowLeft, MapPin, DollarSign, Phone, Tag, Navigation, Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight, Shield, User, MessageSquare, Send, UserCircle } from 'lucide-react'

export default function CourtDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [court, setCourt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // ✅ 1. เพิ่ม State สำหรับเก็บข้อมูลคอมเมนต์
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [username, setUsername] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!params?.id) return
      try {
        // ดึงข้อมูลสนาม
        const { data: courtData, error: courtError } = await supabase
          .from('courts')
          .select('*')
          .eq('id', params.id)
          .single()

        if (courtError) throw courtError
        if (courtData) setCourt(courtData)

        // ✅ 2. ดึงข้อมูลคอมเมนต์ของสนามนี้ เรียงจากใหม่ไปเก่า
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('court_id', params.id)
          .order('created_at', { ascending: false })

        if (!commentsError && commentsData) {
          setComments(commentsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params])

  // ✅ 3. ฟังก์ชันสำหรับกดส่งคอมเมนต์เข้าฐานข้อมูล
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    setSubmittingComment(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          court_id: params?.id,
          user_name: username.trim() || 'Anonymous',
          content: newComment.trim()
        }])

      if (error) throw error
      
      // ดึงคอมเมนต์มาอัปเดตหน้าจอใหม่หลังจากกดส่ง
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('court_id', params?.id)
        .order('created_at', { ascending: false })
      
      if (data) setComments(data)
      
      // ล้างช่องกรอกข้อความ
      setNewComment('')
      setUsername('')
    } catch (error: any) {
      alert('Error posting review: ' + error.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-black text-[#CCFF00] uppercase tracking-widest animate-pulse">
        Loading Court Details...
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-black text-white uppercase tracking-widest">
        <p className="mb-6 text-2xl">Court Not Found</p>
        <Link href="/courts" className="bg-[#CCFF00] text-slate-900 px-8 py-3 rounded-full text-sm hover:scale-105 transition-transform font-bold">
          Back to Courts
        </Link>
      </div>
    )
  }

  let galleryImages: string[] = []
  if (Array.isArray(court.images)) {
    galleryImages = court.images
  } else if (typeof court.images === 'string') {
    try {
      galleryImages = JSON.parse(court.images)
      if (!Array.isArray(galleryImages)) galleryImages = []
    } catch (e) {
      galleryImages = []
    }
  }
  galleryImages = galleryImages.filter(img => typeof img === 'string' && img.trim() !== '')

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation() 
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* --- HERO IMAGE SECTION --- */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-slate-900 overflow-hidden">
        {court.image_url ? (
          <img 
            src={court.image_url} 
            alt={court.name} 
            className="w-full h-full object-cover opacity-60 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => {
              const idx = galleryImages.indexOf(court.image_url)
              setSelectedIndex(idx !== -1 ? idx : 0)
            }} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🎾</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pointer-events-none">
          <div className="container mx-auto max-w-5xl">
            <Link href="/courts" className="inline-flex items-center gap-2 text-white/60 font-black uppercase text-[10px] tracking-widest mb-6 hover:text-[#CCFF00] transition-colors hover:-translate-x-1 duration-300 pointer-events-auto">
              <ArrowLeft size={14} strokeWidth={3} /> Back to All Courts
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {court.surface || 'Tennis Court'}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Shield size={12} /> {court.court_type || 'Public'}
              </span>
            </div>

            <h1 
  className="font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-lg" 
  style={{ fontSize: '28px', lineHeight: '1.2' }}
>
  {court.name}
</h1>
            <p className="text-slate-300 mt-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-[#CCFF00]" /> {court.location}
            </p>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        
        {/* ✅ ใช้ Grid พื้นฐาน และเรียงโค้ดใหม่เลย (แก้ปัญหาเรียงผิด 100%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. About Facility (ลำดับ 1 บนมือถือ / กินพื้นที่ 2 คอลัมน์ซ้ายบนคอม) */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 
  className="font-black text-slate-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3" 
  style={{ fontSize: '22px' }}
>
  {/* ส่วนไอคอนและชื่อหัวข้อ ปล่อยไว้เหมือนเดิม */}
  <Tag className="text-[#CCFF00]" size={24} /> About Facility
</h2>
            <div className="text-slate-600 font-medium text-base md:text-lg leading-relaxed whitespace-pre-line">
              {court.description || "No description provided for this court."}
            </div>
          </div>

          {/* 2. Court Info & Map (ลำดับ 2 ดันขึ้นมาตรงนี้เลย! / อยู่ฝั่งขวาและกินพื้นที่ยาว 3 แถวบนคอม) */}
          <div className="lg:col-span-1 lg:row-span-3 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 text-white">
              <h3 className="!text-xl font-black uppercase italic tracking-widest text-[#CCFF00] mb-8">Court Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Rate / Hour</p>
                    <p className="text-lg font-bold">฿ {court.price_per_hour || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                    <p className="text-lg font-bold">{court.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Access</p>
                    <p className="text-lg font-bold">{court.court_type || 'Public'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Navigation size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Surface Type</p>
                    <p className="text-lg font-bold">{court.surface || 'Hard Court'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-white/10 mt-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Submitted By</p>
                    <p className="text-sm font-bold text-slate-300">{court.submitted_by || 'Anonymous'}</p>
                  </div>
                </div>

              </div>

              {court.map_url && (
                <a 
                  href={court.map_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-[#CCFF00] hover:bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#CCFF00]/10 hover:shadow-xl"
                >
                  <MapPin size={16} /> Open in Maps <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>

          {/* 3. Court Gallery (ลำดับ 3 บนมือถือ / กินพื้นที่ 2 คอลัมน์ซ้ายบนคอม) */}
          {galleryImages.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 
  className="font-black text-slate-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3" 
  style={{ fontSize: '22px' }}
>
  {/* ส่วนไอคอนและชื่อหัวข้อ ปล่อยไว้เหมือนเดิม */}
  <Tag className="text-[#CCFF00]" size={24} /> Court Gallery
</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img: string, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedIndex(index)} 
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-100"
                  >
                    <img src={img} alt={`${court.name} - Photo ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Community Reviews (ลำดับ 4 บนมือถือ / กินพื้นที่ 2 คอลัมน์ซ้ายบนคอม) */}
          <h2 
  className="font-black text-slate-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3" 
  style={{ fontSize: '22px' }}
>
  {/* ส่วนไอคอนและชื่อหัวข้อ ปล่อยไว้เหมือนเดิม */}
  <Tag className="text-[#CCFF00]" size={24} /> Community Reviews
</h2>

            {/* ฟอร์มกรอกคอมเมนต์ */}
            <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <UserCircle className="text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Your Name (Optional)" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="bg-transparent border-b-2 border-slate-200 focus:border-[#CCFF00] outline-none text-sm font-bold pb-1 w-full md:w-64 transition-colors"
                 />
              </div>
              <textarea 
                placeholder="Share your experience or ask a question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={3}
                className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:border-[#CCFF00] outline-none resize-none transition-colors shadow-inner"
              ></textarea>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={submittingComment}
                  className="bg-slate-900 text-[#CCFF00] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>

            {/* รายการคอมเมนต์ */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-slate-400 font-medium text-sm py-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  No reviews yet. Be the first to share your experience!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-slate-900 flex items-center gap-2">
                        <UserCircle size={18} className="text-[#CCFF00]" /> {comment.user_name || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ✅✅✅ IMAGE MODAL WITH NAVIGATION ✅✅✅ */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            onClick={() => setSelectedIndex(null)} 
            className="absolute top-6 right-6 text-white/70 hover:text-[#CCFF00] transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full z-50"
          >
            <X size={32} strokeWidth={2} />
          </button>

          <div className="absolute top-8 left-8 text-white/50 font-black tracking-widest text-sm z-50">
            {selectedIndex + 1} / {galleryImages.length}
          </div>

          {galleryImages.length > 1 && (
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#CCFF00] bg-black/20 hover:bg-black/50 p-4 rounded-full transition-all z-50 backdrop-blur-sm"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {galleryImages.length > 1 && (
            <button 
              onClick={handleNextImage}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#CCFF00] bg-black/20 hover:bg-black/50 p-4 rounded-full transition-all z-50 backdrop-blur-sm"
            >
              <ChevronRight size={40} />
            </button>
          )}

          <div 
            className="relative max-w-6xl w-full h-full flex items-center justify-center pointer-events-none" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              key={selectedIndex}
              src={galleryImages[selectedIndex]} 
              alt="Large view" 
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-300" 
            />
          </div>
        </div>
      )}

    </main>
  )
}
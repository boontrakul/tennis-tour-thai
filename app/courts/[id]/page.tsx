'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, DollarSign, Phone, Tag, 
  Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight, 
  Shield, MessageSquare, Send, UserCircle, Clock, CheckCircle2,
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead,
  Sun, Moon, Home // ✅ เพิ่มไอคอนสำหรับราคาและสภาพสนาม
} from 'lucide-react'
import Link from 'next/link'

// ฟังก์ชันช่วยเลือกไอคอนสำหรับ Facilities
const getFacilityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('parking')) return <Car size={20} />;
  if (n.includes('restaurant') || n.includes('food')) return <Utensils size={20} />;
  if (n.includes('shop') || n.includes('store')) return <Store size={20} />;
  if (n.includes('coach') || n.includes('train')) return <GraduationCap size={20} />;
  if (n.includes('changing')) return <PersonStanding size={20} />;
  if (n.includes('locker')) return <Lock size={20} />;
  if (n.includes('pool') || n.includes('swim')) return <Waves size={20} />;
  if (n.includes('wifi') || n.includes('internet')) return <Wifi size={20} />;
  if (n.includes('shower')) return <ShowerHead size={20} />;
  return <CheckCircle2 size={20} />;
};

export default function CourtDetailPage() {
  const params = useParams() as { id: string }; 
  const [court, setCourt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [activeImgIdx, setActiveImgIdx] = useState(0) 

  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [username, setUsername] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!params?.id) return
      try {
        const { data: courtData, error: courtError } = await supabase
          .from('courts')
          .select('*')
          .eq('id', params.id)
          .single()

        if (courtError) throw courtError
        if (courtData) setCourt(courtData)

        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('court_id', params.id)
          .order('created_at', { ascending: false })

        if (commentsData) setComments(commentsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmittingComment(true)
    try {
      await supabase.from('comments').insert([{
        court_id: params?.id,
        user_name: username.trim() || 'Anonymous',
        content: newComment.trim()
      }])
      const { data } = await supabase.from('comments').select('*').eq('court_id', params?.id).order('created_at', { ascending: false })
      if (data) setComments(data)
      setNewComment(''); setUsername('')
    } catch (error: any) {
      alert('Error posting review: ' + error.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading || !court) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400 uppercase animate-pulse">
        Loading...
      </div>
    )
  }

  // จัดการรูปภาพ Gallery
  let galleryImages: string[] = []
  if (Array.isArray(court.images)) {
    galleryImages = [...court.images]
  } else if (typeof court.images === 'string') {
    try {
      const parsed = JSON.parse(court.images)
      if (Array.isArray(parsed)) galleryImages = parsed
    } catch (e) { galleryImages = [] }
  }
  galleryImages = galleryImages.filter((img: any) => typeof img === 'string' && img.trim() !== '')
  if (court.image_url && !galleryImages.includes(court.image_url)) {
    galleryImages.unshift(court.image_url)
  }

  const facilitiesList = court.facilities && typeof court.facilities === 'string' 
    ? court.facilities.split(',').map((f: string) => f.trim()) 
    : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans pt-24 md:pt-32 text-slate-900">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* --- Header Section --- */}
        <div className="mb-8">
          <Link href="/courts" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] mb-6 hover:text-[#ff6b00] transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Directory
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* ✅ แสดง Environment (Indoor/Outdoor) */}
            <span className="bg-slate-900 text-[#CCFF00] text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Home size={10} /> {court.environment || 'Outdoor'}
            </span>
            <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
              {court.surface || 'Hard Court'}
            </span>
            <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Shield size={10} /> {court.court_type || 'Public'}
            </span>
          </div>

          <h1 className="font-black text-slate-900 uppercase tracking-tighter leading-tight text-3xl md:text-5xl mb-4 italic">
            {court.name}
          </h1>
          <p className="text-slate-500 text-[13px] font-bold uppercase flex items-center gap-2">
            <MapPin size={16} className="text-[#84cc16]" /> {court.location}
          </p>
        </div>

        {/* --- Photo Slider --- */}
        <div className="mb-12">
          <div className="relative w-full aspect-[16/9] md:h-[550px] bg-slate-200 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white mb-6 group">
            <img 
              src={galleryImages[activeImgIdx]} 
              className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105" 
              alt={court.name}
              onClick={() => setSelectedIndex(activeImgIdx)}
            />
            <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              {activeImgIdx + 1} / {galleryImages.length} Photos
            </div>
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 md:w-36 md:h-24 rounded-2xl overflow-hidden border-4 transition-all shadow-md ${activeImgIdx === idx ? 'border-[#CCFF00] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {/* About Facility */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase mb-8 flex items-center gap-3 tracking-tight">
                <Tag className="text-[#CCFF00]" size={24} strokeWidth={3} /> Facility Details
              </h2>
              <div className="text-slate-600 font-medium leading-relaxed text-base md:text-lg whitespace-pre-line">
                {court.description || "Welcome to our premium tennis facility. Open for all levels."}
              </div>
            </div>

            {/* Facilities Chips */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase mb-8 flex items-center gap-3 tracking-tight">
                <CheckCircle2 className="text-[#CCFF00]" size={24} strokeWidth={3} /> Amenities & Services
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {facilitiesList.length > 0 ? facilitiesList.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-900 transition-all">
                    <div className="text-[#84cc16] group-hover:text-[#CCFF00] transition-colors">
                      {getFacilityIcon(f)}
                    </div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover:text-white transition-colors">{f}</span>
                  </div>
                )) : (
                   <p className="text-slate-400 text-sm italic">No facilities listed.</p>
                )}
              </div>
            </div>

            {/* Community Reviews */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase mb-8 flex items-center gap-3 tracking-tight">
                <MessageSquare className="text-[#CCFF00]" size={24} strokeWidth={3} /> Member Reviews
              </h2>
              
              <form onSubmit={handleCommentSubmit} className="mb-10 space-y-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4 mb-2">
                   <UserCircle className="text-slate-400" size={24} />
                   <input 
                     type="text" placeholder="Your Name" 
                     value={username} onChange={(e) => setUsername(e.target.value)}
                     className="bg-transparent border-b-2 border-slate-200 focus:border-[#CCFF00] outline-none text-sm font-black uppercase pb-1 w-full transition-colors"
                   />
                </div>
                <textarea 
                  placeholder="Tell us about the court quality, lighting, or atmosphere..." value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} required rows={3}
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:border-[#CCFF00] outline-none resize-none transition-all shadow-sm"
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    type="submit" disabled={submittingComment}
                    className="bg-slate-900 text-[#CCFF00] px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#CCFF00] hover:text-slate-900 transition-all disabled:opacity-50 shadow-lg"
                  >
                    <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Review'}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm">
                        <UserCircle size={20} className="text-[#CCFF00]" /> {comment.user_name || 'Anonymous Member'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- Sidebar (Court Info - v2.0 Update) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl text-white sticky top-32">
              <h3 className="font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-10 text-sm border-b border-white/10 pb-4">Essential Info</h3>
              
              <div className="space-y-8">
                {/* ✅ แสดงเวลาเปิด-ปิด แบบแยกฟิลด์ */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <Clock size={24} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Business Hours</p>
                    <p className="text-xl font-bold italic tracking-tight">
                      {court.open_time?.slice(0, 5) || '07:00'} - {court.close_time?.slice(0, 5) || '22:00'}
                    </p>
                  </div>
                </div>

                {/* ✅ แสดงราคาแยก Day / Night */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <DollarSign size={24} className="text-[#CCFF00]" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Rental Rates / Hour</p>
                    <div className="flex items-center gap-3">
                      <Sun size={14} className="text-[#CCFF00]" />
                      <p className="text-lg font-bold tracking-tight">฿ {court.price_day || court.price_per_hour || 'N/A'} <span className="text-[10px] text-slate-500 font-medium normal-case">(Day)</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Moon size={14} className="text-blue-400" />
                      <p className="text-lg font-bold tracking-tight">฿ {court.price_night || 'N/A'} <span className="text-[10px] text-slate-500 font-medium normal-case">(Night)</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <Phone size={24} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Contact for Booking</p>
                    <p className="text-xl font-bold tracking-tight">{court.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {court.map_url && (
                <a 
                  href={court.map_url} target="_blank" rel="noopener noreferrer"
                  className="mt-12 w-full bg-[#CCFF00] hover:bg-white text-slate-900 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-2 group shadow-xl"
                >
                  <MapPin size={16} strokeWidth={3} /> Open in Maps <ExternalLink size={14} className="opacity-50" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- Fullscreen Modal Image --- */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-md transition-all" onClick={() => setSelectedIndex(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-[#CCFF00] bg-white/5 p-3 rounded-full z-50 transition-all border border-white/10">
            <X size={32} />
          </button>
          
          {galleryImages.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1); }}
                className="absolute left-4 md:left-12 text-white/30 hover:text-[#CCFF00] p-4 rounded-full z-50 transition-all"
              >
                <ChevronLeft size={60} strokeWidth={1} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1); }}
                className="absolute right-4 md:right-12 text-white/30 hover:text-[#CCFF00] p-4 rounded-full z-50 transition-all"
              >
                <ChevronRight size={60} strokeWidth={1} />
              </button>
            </>
          )}

          <div className="relative max-w-7xl w-full h-full flex items-center justify-center pointer-events-none">
            <img src={galleryImages[selectedIndex]} alt="Large view" className="max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-500" />
          </div>
        </div>
      )}
    </main>
  )
}
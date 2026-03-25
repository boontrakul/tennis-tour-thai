'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, MapPin, DollarSign, Phone, Tag, 
  Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight, 
  Shield, MessageSquare, Send, UserCircle, Clock, CheckCircle2,
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead
} from 'lucide-react'

// ฟังก์ชันช่วยเลือกไอคอนให้ตรงกับคำศัพท์ (Icon Mapping) - ปรับขนาดไอคอนเป็น 20
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
        
        {/* --- Header Section (ชื่อสนาม ปรับให้เล็กลง) --- */}
        <div className="mb-8">
          <Link href="/courts" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] mb-6 hover:text-[#84cc16] transition-colors">
            <ArrowLeft size={14} /> Back to Courts
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {court.surface || 'Hard Court'}
            </span>
            <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={10} /> {court.court_type || 'Public'}
            </span>
          </div>
          {/* ✅ ชื่อสนาม: ปรับลดขนาดเหลือ text-2xl md:text-3xl */}
          <h1 className="font-bold text-slate-900 uppercase tracking-tight leading-tight text-2xl md:text-3xl mb-3 italic">
            {court.name}
          </h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase flex items-center gap-2">
            <MapPin size={14} className="text-[#84cc16]" /> {court.location}
          </p>
        </div>

        {/* --- 📸 Photo Slider --- */}
        <div className="mb-12">
          <div className="relative w-full aspect-[16/9] md:h-[500px] bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-4">
            <img 
              src={galleryImages[activeImgIdx]} 
              className="w-full h-full object-cover cursor-pointer transition-all duration-500 animate-in fade-in" 
              alt={court.name}
              onClick={() => setSelectedIndex(activeImgIdx)}
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-2xl overflow-hidden border-4 transition-all ${activeImgIdx === idx ? 'border-[#CCFF00] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* About Facility - ปรับหัวข้อเหลือ text-lg md:text-xl */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase mb-6 flex items-center gap-3 italic">
                <Tag className="text-[#CCFF00]" size={20} /> About Facility
              </h2>
              <div className="text-slate-600 font-medium leading-relaxed text-sm md:text-base whitespace-pre-line">
                {court.description || "No description provided."}
              </div>
            </div>

            {/* Facilities - ปรับหัวข้อเหลือ text-lg md:text-xl */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase mb-8 flex items-center gap-3 italic">
                <CheckCircle2 className="text-[#CCFF00]" size={20} /> Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {facilitiesList.length > 0 ? facilitiesList.map((f: string, i: number) => (
                  <div key={i} className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-[#CCFF00] hover:bg-white transition-all group">
                    <div className="text-[#84cc16] mb-3 group-hover:scale-110 transition-transform">
                      {getFacilityIcon(f)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest text-center leading-tight">{f}</span>
                  </div>
                )) : (
                   <p className="text-slate-400 text-sm italic">No facilities listed.</p>
                )}
              </div>
            </div>

            {/* Community Reviews - ปรับหัวข้อเหลือ text-lg md:text-xl */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 uppercase mb-8 flex items-center gap-3 italic">
                <MessageSquare className="text-[#CCFF00]" size={20} /> Community Reviews
              </h2>
              
              <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                   <UserCircle className="text-slate-400" size={20} />
                   <input 
                     type="text" placeholder="Your Name (Optional)" 
                     value={username} onChange={(e) => setUsername(e.target.value)}
                     className="bg-transparent border-b-2 border-slate-200 focus:border-[#CCFF00] outline-none text-sm font-bold pb-1 w-full md:w-64 transition-colors shadow-none"
                   />
                </div>
                <textarea 
                  placeholder="Share your experience..." value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} required rows={3}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:border-[#CCFF00] outline-none resize-none transition-colors"
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    type="submit" disabled={submittingComment}
                    className="bg-slate-900 text-[#CCFF00] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md"
                  >
                    <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Review'}
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
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
                ))}
              </div>
            </div>
          </div>

          {/* --- Sidebar (Court Info - ขนาดอ้างอิง) --- */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white">
              <h3 className="font-bold uppercase tracking-widest text-[#CCFF00] mb-8 text-lg italic">Court Info</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Opening Hours</p>
                    <p className="text-lg font-bold">{court.opening_hours || '06:00 - 22:00'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Rate / Hour</p>
                    <p className="text-lg font-bold">฿ {court.price_per_hour || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                    <p className="text-lg font-bold">{court.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {court.map_url && (
                <a 
                  href={court.map_url} target="_blank" rel="noopener noreferrer"
                  className="mt-10 w-full bg-[#CCFF00] hover:bg-white text-slate-900 py-4 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-lg"
                >
                  <MapPin size={16} /> Open in Maps <ExternalLink size={14} className="opacity-50" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- Fullscreen Modal Image --- */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-[#CCFF00] bg-white/10 p-2 rounded-full z-50 transition-colors">
            <X size={32} />
          </button>
          
          {galleryImages.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1); }}
                className="absolute left-4 md:left-10 text-white/50 hover:text-[#CCFF00] p-4 rounded-full z-50 transition-all"
              >
                <ChevronLeft size={40} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1); }}
                className="absolute right-4 md:right-10 text-white/50 hover:text-[#CCFF00] p-4 rounded-full z-50 transition-all"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <div className="relative max-w-6xl w-full h-full flex items-center justify-center pointer-events-none">
            <img src={galleryImages[selectedIndex]} alt="Large view" className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300" />
          </div>
        </div>
      )}
    </main>
  )
}
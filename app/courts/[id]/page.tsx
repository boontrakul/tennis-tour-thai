'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, MapPin, DollarSign, Phone, Tag, Navigation, 
  Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight, 
  Shield, MessageSquare, Send, UserCircle, Clock, CheckCircle2,
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead
} from 'lucide-react'

// ฟังก์ชันสำหรับเลือกไอคอนตามคำค้นหา (Facilities Icon Mapping)
const getFacilityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('parking')) return <Car size={24} />;
  if (n.includes('restaurant') || n.includes('food')) return <Utensils size={24} />;
  if (n.includes('shop') || n.includes('store')) return <Store size={24} />;
  if (n.includes('coach') || n.includes('train')) return <GraduationCap size={24} />;
  if (n.includes('changing')) return <PersonStanding size={24} />;
  if (n.includes('locker')) return <Lock size={24} />;
  if (n.includes('pool') || n.includes('swim')) return <Waves size={24} />;
  if (n.includes('wifi') || n.includes('internet')) return <Wifi size={24} />;
  if (n.includes('shower')) return <ShowerHead size={24} />;
  return <CheckCircle2 size={24} />;
};

export default function CourtDetailPage() {
  const params = useParams() as { id: string }; 
  const [court, setCourt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [heroIdx, setHeroIdx] = useState(0) 

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
      alert('Error: ' + error.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading || !court) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-900 animate-pulse uppercase tracking-widest">Loading Details...</div>
  }

  // จัดการรูปภาพ Gallery
  let galleryImages: string[] = []
  if (Array.isArray(court.images)) galleryImages = [...court.images]
  else if (typeof court.images === 'string') {
    try { const parsed = JSON.parse(court.images); if (Array.isArray(parsed)) galleryImages = parsed } catch (e) { galleryImages = [] }
  }
  galleryImages = galleryImages.filter((img: any) => typeof img === 'string' && img.trim() !== '')
  if (court.image_url && !galleryImages.includes(court.image_url)) galleryImages.unshift(court.image_url)

  // จัดการรายชื่อ Facilities
  const facilitiesList = court.facilities && typeof court.facilities === 'string' 
    ? court.facilities.split(',').map((f: string) => f.trim()) 
    : (Array.isArray(court.facilities) ? court.facilities : []);

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans pt-24 md:pt-32">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <Link href="/courts" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase text-xs mb-6 hover:text-[#84cc16] transition-colors">
            <ArrowLeft size={16} /> Back to Courts
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{court.surface || 'Tennis Court'}</span>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5"><Shield size={12} /> {court.court_type || 'Public'}</span>
          </div>

          <h1 className="font-bold text-slate-900 uppercase tracking-tight leading-tight text-3xl md:text-5xl mb-4 italic">{court.name}</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2"><MapPin size={16} className="text-[#84cc16]" /> {court.location}</p>
        </div>

        {/* Hero Slider */}
        <div className="relative w-full aspect-[16/9] md:h-[500px] bg-slate-200 rounded-[2rem] overflow-hidden group shadow-lg mb-10 border-4 border-white">
          {galleryImages.length > 0 ? (
            <img src={galleryImages[heroIdx]} alt={court.name} className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-[1.02]" onClick={() => setSelectedIndex(heroIdx)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🎾</div>
          )}
          {galleryImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setHeroIdx(heroIdx === 0 ? galleryImages.length - 1 : heroIdx - 1) }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
              <button onClick={(e) => { e.stopPropagation(); setHeroIdx(heroIdx === galleryImages.length - 1 ? 0 : heroIdx + 1) }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
            </>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="font-bold text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3 text-xl md:text-2xl italic">
                <Tag className="text-[#CCFF00]" size={24} /> About Facility
              </h2>
              <div className="text-slate-600 font-medium text-base leading-relaxed whitespace-pre-line">
                {court.description || "No description provided for this court."}
              </div>
            </div>

            {/* Facilities Section (ตามรูปตัวอย่าง) */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="font-bold text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3 text-xl md:text-2xl italic">
                <CheckCircle2 className="text-[#CCFF00]" size={24} /> Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {facilitiesList.length > 0 ? facilitiesList.map((f: string, i: number) => (
                  <div key={i} className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#CCFF00] hover:bg-white transition-all group">
                    <div className="text-[#84cc16] mb-3 group-hover:scale-110 transition-transform">
                      {getFacilityIcon(f)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest text-center leading-tight">{f}</span>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm italic col-span-full">No facilities listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white">
              <h3 className="font-bold uppercase tracking-widest text-[#CCFF00] mb-8 text-xl italic">Court Info</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Clock size={20} className="text-[#CCFF00]" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Opening Hours</p>
                    <p className="text-lg font-bold">{court.opening_hours || '06:00 - 22:00'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><DollarSign size={20} className="text-[#CCFF00]" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Rate / Hour</p>
                    <p className="text-lg font-bold">฿ {court.price_per_hour || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Phone size={20} className="text-[#CCFF00]" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                    <p className="text-lg font-bold">{court.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {court.map_url && (
                <a href={court.map_url} target="_blank" rel="noopener noreferrer" className="mt-10 w-full bg-[#CCFF00] hover:bg-white text-slate-900 py-4 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#CCFF00]/10">
                  <MapPin size={16} /> Open in Maps <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                </a>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
            <h2 className="font-bold text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3 text-xl md:text-2xl italic">
              <MessageSquare className="text-[#CCFF00]" size={24} /> Community Reviews
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <UserCircle className="text-slate-400" size={20} />
                 <input type="text" placeholder="Your Name (Optional)" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-[#CCFF00] outline-none text-sm font-bold pb-1 w-full md:w-64 transition-colors" />
              </div>
              <textarea placeholder="Share your experience..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required rows={3} className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:border-[#CCFF00] outline-none resize-none transition-colors"></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={submittingComment} className="bg-slate-900 text-[#CCFF00] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md">
                  <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {comments.length === 0 ? <p className="text-center text-slate-400 py-8 italic">No reviews yet.</p> : comments.map((comment) => (
                <div key={comment.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-slate-900 flex items-center gap-2"><UserCircle size={18} className="text-[#CCFF00]" /> {comment.user_name || 'Anonymous'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>
          <button onClick={() => setSelectedIndex(null)} className="absolute top-6 right-6 text-white/70 hover:text-[#CCFF00] transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full z-50"><X size={32} /></button>
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[selectedIndex as number]} alt="Large view" className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </main>
  )
}
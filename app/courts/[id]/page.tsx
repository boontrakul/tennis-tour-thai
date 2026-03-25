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
  
  // ✅ State สำหรับรูปที่โชว์อยู่หน้าหลัก
  const [activeImgIdx, setActiveImgIdx] = useState(0) 

  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [username, setUsername] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!params?.id) return
      try {
        const { data: courtData } = await supabase.from('courts').select('*').eq('id', params.id).single()
        if (courtData) setCourt(courtData)
        const { data: commentsData } = await supabase.from('comments').select('*').eq('court_id', params.id).order('created_at', { ascending: false })
        if (commentsData) setComments(commentsData)
      } catch (error) { console.error(error) } finally { setLoading(false) }
    }
    fetchData()
  }, [params])

  if (loading || !court) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900 animate-pulse">Loading Details...</div>

  // จัดการรูปภาพ Gallery
  let galleryImages: string[] = []
  if (Array.isArray(court.images)) galleryImages = [...court.images]
  else if (typeof court.images === 'string') {
    try { const parsed = JSON.parse(court.images); if (Array.isArray(parsed)) galleryImages = parsed } catch (e) { galleryImages = [] }
  }
  galleryImages = galleryImages.filter((img: any) => typeof img === 'string' && img.trim() !== '')
  if (court.image_url && !galleryImages.includes(court.image_url)) galleryImages.unshift(court.image_url)

  const facilitiesList = court.facilities && typeof court.facilities === 'string' 
    ? court.facilities.split(',').map((f: string) => f.trim()) : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans pt-24 md:pt-32">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/courts" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase text-xs mb-6 hover:text-[#84cc16] transition-colors">
            <ArrowLeft size={16} /> Back to Courts
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">{court.surface || 'Tennis Court'}</span>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5"><Shield size={12} /> {court.court_type || 'Public'}</span>
          </div>
          <h1 className="font-bold text-slate-900 uppercase tracking-tight text-3xl md:text-5xl mb-4 italic">{court.name}</h1>
          <p className="text-slate-500 text-sm font-bold uppercase flex items-center gap-2"><MapPin size={16} className="text-[#84cc16]" /> {court.location}</p>
        </div>

        {/* --- MAIN PHOTO & THUMBNAILS --- */}
        <div className="mb-12">
          {/* Big Image */}
          <div className="relative w-full aspect-[16/9] md:h-[500px] bg-slate-200 rounded-[2rem] overflow-hidden group shadow-lg border-4 border-white mb-4">
            {galleryImages.length > 0 ? (
              <img 
                key={activeImgIdx}
                src={galleryImages[activeImgIdx]} 
                alt={court.name} 
                className="w-full h-full object-cover cursor-pointer animate-in fade-in duration-500" 
                onClick={() => setSelectedIndex(activeImgIdx)} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎾</div>
            )}
            
            {/* Nav Arrows on main image */}
            {galleryImages.length > 1 && (
              <>
                <button onClick={() => setActiveImgIdx(activeImgIdx === 0 ? galleryImages.length - 1 : activeImgIdx - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
                <button onClick={() => setActiveImgIdx(activeImgIdx === galleryImages.length - 1 ? 0 : activeImgIdx + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
              </>
            )}
          </div>

          {/* ✅ Thumbnails List */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border-4 transition-all ${activeImgIdx === idx ? 'border-[#CCFF00] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="font-bold text-slate-900 uppercase mb-6 flex items-center gap-3 text-xl md:text-2xl italic"><Tag className="text-[#CCFF00]" /> About Facility</h2>
              <div className="text-slate-600 font-medium text-base leading-relaxed whitespace-pre-line">{court.description || "No description provided."}</div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="font-bold text-slate-900 uppercase mb-8 flex items-center gap-3 text-xl md:text-2xl italic"><CheckCircle2 className="text-[#CCFF00]" /> Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {facilitiesList.map((f: string, i: number) => (
                  <div key={i} className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#CCFF00] transition-all group">
                    <div className="text-[#84cc16] mb-3 group-hover:scale-110 transition-transform">{getFacilityIcon(f)}</div>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest text-center">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white">
              <h3 className="font-bold uppercase tracking-widest text-[#CCFF00] mb-8 text-xl italic">Court Info</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="text-[#CCFF00]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Opening Hours</p>
                    <p className="text-lg font-bold">{court.opening_hours || '06:00 - 22:00'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <DollarSign className="text-[#CCFF00]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rate / Hour</p>
                    <p className="text-lg font-bold">฿ {court.price_per_hour || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-[#CCFF00]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contact</p>
                    <p className="text-lg font-bold">{court.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
              {court.map_url && (
                <a href={court.map_url} target="_blank" rel="noopener noreferrer" className="mt-10 w-full bg-[#CCFF00] hover:bg-white text-slate-900 py-4 rounded-2xl font-bold uppercase text-xs transition-all flex items-center justify-center gap-2 group shadow-lg">
                  <MapPin size={16} /> Open in Maps <ExternalLink size={14} className="opacity-50" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal (คลิกที่รูปใหญ่เพื่อดู) */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-[#CCFF00] bg-white/10 p-2 rounded-full"><X size={32} /></button>
          <img src={galleryImages[selectedIndex]} className="max-h-[90vh] max-w-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  )
}
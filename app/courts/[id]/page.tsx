'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
// ✅ เพิ่ม Shield (ความปลอดภัย/ประเภท) และ User (คนเพิ่มข้อมูล)
import { ArrowLeft, MapPin, DollarSign, Phone, Tag, Navigation, Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight, Shield, User } from 'lucide-react'

export default function CourtDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [court, setCourt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCourt() {
      if (!params?.id) return
      try {
        const { data, error } = await supabase
          .from('courts')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        if (data) setCourt(data)
      } catch (error) {
        console.error('Error fetching court:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourt()
  }, [params])

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
            
            {/* ✅ เพิ่ม Tag แสดง Public/Private Court แบบโปร่งแสง */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {court.surface || 'Tennis Court'}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Shield size={12} /> {court.court_type || 'Public'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-lg">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ซ้าย: รายละเอียดสนามและแกลลอรี่ */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                <Tag className="text-[#CCFF00]" size={24} /> About Facility
              </h2>
              <div className="text-slate-600 font-medium text-base md:text-lg leading-relaxed whitespace-pre-line">
                {court.description || "No description provided for this court."}
              </div>
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                  <ImageIcon className="text-[#CCFF00]" size={24} /> Court Gallery
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
          </div>

          {/* ขวา: แผงข้อมูลการติดต่อ */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 text-white">
              <h3 className="text-xl font-black uppercase italic tracking-widest text-[#CCFF00] mb-8">Court Info</h3>
              
              <div className="space-y-6">
                
                {/* 1. Rate */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Rate / Hour</p>
                    <p className="text-lg font-bold">฿ {court.price_per_hour || 'N/A'}</p>
                  </div>
                </div>

                {/* 2. Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                    <p className="text-lg font-bold">{court.phone || 'N/A'}</p>
                  </div>
                </div>

                {/* ✅ 3. Court Access (Public / Private) */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Access</p>
                    <p className="text-lg font-bold">{court.court_type || 'Public'}</p>
                  </div>
                </div>

                {/* 4. Surface */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Navigation size={20} className="text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Surface Type</p>
                    <p className="text-lg font-bold">{court.surface || 'Hard Court'}</p>
                  </div>
                </div>

                {/* ✅ 5. Added By */}
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
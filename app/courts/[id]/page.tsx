'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation' // ลบ useRouter ออกเพราะไม่ได้ใช้
import Link from 'next/link'
// ลบไอคอน User ออกเพราะเราใช้ UserCircle แทน
import { ArrowLeft, MapPin, DollarSign, Phone, Tag, Navigation, Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight, Shield, MessageSquare, Send, UserCircle, Clock, CheckCircle2 } from 'lucide-react'

export default function CourtDetailPage() {
  const params = useParams()
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
      
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('court_id', params?.id)
        .order('created_at', { ascending: false })
      
      if (data) setComments(data)
      
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
      <div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-900 uppercase tracking-widest animate-pulse">
        Loading Court Details...
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-bold text-slate-900 uppercase tracking-widest">
        <p className="mb-6 text-2xl">Court Not Found</p>
        <Link href="/courts" className="bg-[#CCFF00] text-slate-900 px-8 py-3 rounded-full text-sm hover:scale-105 transition-transform font-bold">
          Back to Courts
        </Link>
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
    } catch (e) {
      galleryImages = []
    }
  }
  galleryImages = galleryImages.filter(img => typeof img === 'string' && img.trim() !== '')
  if (court.image_url && !galleryImages.includes(court.image_url)) {
    galleryImages.unshift(court.image_url)
  }

  const defaultFacilities = [
    'Parking', 'Restaurant', 'Pro Shop', 'Coaching', 
    'Changing Rooms', 'Lockers', 'Swimming Pool', 
    'Lighting (ไฟส่องสว่าง)', 'Showers', 'Wi-Fi'
  ];

  let facilitiesList = [];
  if (court.facilities && typeof court.facilities === 'string') {
    facilitiesList = court.facilities.split(',').map((f: string) => f.trim());
  } else if (Array.isArray(court.facilities)) {
    facilitiesList = court.facilities;
  } else {
    facilitiesList = defaultFacilities; 
  }

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
  const prevHeroImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHeroIdx(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)
  }
  const nextHeroImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHeroIdx(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      <div className="container mx-auto px-4 max-w-5xl pt-24 md:pt-32">
        
        <div className="mb-8">
          <Link href="/courts" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest mb-6 hover:text-[#84cc16] transition-colors">
            <ArrowLeft size={16} /> Back to Courts
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {court.surface || 'Tennis Court'}
            </span>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Shield size={12} /> {court.court_type || 'Public'}
            </span>
          </div>

          <h1 className="font-bold text-slate-900 uppercase tracking-tight leading-tight text-3xl md:text-5xl mb-4">
            {court.name}
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <MapPin size={16} className="text-[#84cc16]" /> {court.location}
          </p>
        </div>

        <div className="relative w-full aspect-[16/9] md:h-[500px] bg-slate-200 rounded-[2rem] overflow-hidden group shadow-lg mb-10 border-4 border-white">
          {galleryImages.length > 0 ? (
            <img 
              src={galleryImages[heroIdx]} 
              alt={court.name} 
              className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-[1.02]" 
              onClick={() => setSelectedIndex(heroIdx)} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🎾</div>
          )}

          {galleryImages.length > 1 && (
            <>
              <button onClick={prevHeroImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"><ChevronLeft size={24} /></button>
              <button onClick={nextHeroImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"><ChevronRight size={24} /></button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                {galleryImages.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === heroIdx ? 'bg-[#CCFF00] w-6' : 'bg-white/60 w-2'}`}></div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-200/40 border border-slate-100">
            <h2 className="font-bold text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3 text-xl md:text-2xl">
              <Tag className="text-[#CCFF00]" size={24} /> About Facility
            </h2>
            <div className="text-slate-600 font-medium text-base md:text-lg leading-relaxed whitespace-pre-line">
              {court.description || "No description provided for this court."}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-5 text-lg">
                Facilities
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {facilitiesList.map((facility, idx) => (
                  <span 
                    key={idx} 
                    className="bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-2 border border-slate-200 shadow-sm"
                  >
                    <CheckCircle2 size={14} className="text-[#84cc16]" strokeWidth={3} /> {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 lg:row-span-3 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl text-white">
              <h3 className="font-bold uppercase tracking-widest text-[#CCFF00] mb-8 text-xl">
                Court Info
              </h3>
              
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

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Shield size={20} className="text-[#CCFF00]" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Access</p>
                    <p className="text-lg font-bold">{court.court_type || 'Public'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Navigation size={20} className="text-[#CCFF00]" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Surface Type</p>
                    <p className="text-lg font-bold">{court.surface || 'Hard Court'}</p>
                  </div>
                </div>
              </div>

              {court.map_url && (
                <a href={court.map_url} target="_blank" rel="noopener noreferrer" className="mt-8 w-full bg-[#CCFF00] hover:bg-white text-slate-900 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 group">
                  <MapPin size={16} /> Open in Maps <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                </a>
              )}
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-200/40 border border-slate-100">
              <h2 className="font-bold text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3 text-xl md:text-2xl">
                <ImageIcon className="text-[#CCFF00]" size={24} /> Court Gallery
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {galleryImages.map((img: string, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedIndex(index)} 
                    className="min-w-[240px] md:min-w-[280px] aspect-[4/3] flex-shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer group border border-slate-100 relative"
                  >
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-200/40 border border-slate-100">
            <h2 className="font-bold text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3 text-xl md:text-2xl">
              <MessageSquare className="text-[#CCFF00]" size={24} /> Community Reviews
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <UserCircle className="text-slate-400" size={20} />
                 <input type="text" placeholder="Your Name (Optional)" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-transparent border-b-2 border-slate-200 focus:border-[#CCFF00] outline-none text-sm font-bold pb-1 w-full md:w-64 transition-colors" />
              </div>
              <textarea placeholder="Share your experience or ask a question..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required rows={3} className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:border-[#CCFF00] outline-none resize-none transition-colors shadow-sm"></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={submittingComment} className="bg-slate-900 text-[#CCFF00] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50">
                  <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-slate-400 font-medium text-sm py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">No reviews yet. Be the first to share your experience!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-slate-900 flex items-center gap-2"><UserCircle size={18} className="text-[#CCFF00]" /> {comment.user_name || 'Anonymous'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedIndex(null)}>
          <button onClick={() => setSelectedIndex(null)} className="absolute top-6 right-6 text-white/70 hover:text-[#CCFF00] transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full z-50">
            <X size={32} strokeWidth={2} />
          </button>
          <div className="absolute top-8 left-8 text-white/50 font-bold tracking-widest text-sm z-50">{selectedIndex + 1} / {galleryImages.length}</div>
          
          {galleryImages.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#CCFF00] bg-black/20 hover:bg-black/50 p-4 rounded-full transition-all z-50 backdrop-blur-sm"><ChevronLeft size={40} /></button>
              <button onClick={handleNextImage} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#CCFF00] bg-black/20 hover:bg-black/50 p-4 rounded-full transition-all z-50 backdrop-blur-sm"><ChevronRight size={40} /></button>
            </>
          )}

          <div className="relative max-w-6xl w-full h-full flex items-center justify-center pointer-events-none" onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[selectedIndex]} alt="Large view" className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto" />
          </div>
        </div>
      )}

    </main>
  )
}
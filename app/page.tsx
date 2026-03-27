'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Search, MapPin, Star, ChevronRight, Navigation, Shield, ArrowRight, MessageCircle } from 'lucide-react'

// --- Map Configuration ---
const libraries: any = ['places']
const mapOptions = {
  // นำ Styles ออกชั่วคราวเพื่อให้เห็นสีถนนมาตรฐานของ Google ที่ชัดเจนที่สุด
  disableDefaultUI: false,
  zoomControl: true,
}
const mapContainerStyle = { width: '100%', height: '450px', borderRadius: '2rem' }
const center = { lat: 13.7563, lng: 100.5018 }

// --- Helpers ---
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  return diffInDays === 0 ? 'Today' : `${diffInDays} d ago`;
}

const getTagColor = (category: string) => {
  const cat = category?.trim();
  switch (cat) {
    case 'หาเพื่อนตีเทนนิส': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'รีวิวอุปกรณ์เทนนิส': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'รีวิวสนามเทนนิส': return 'bg-green-50 text-green-600 border-green-100';
    case 'เทคนิคและการฝึกซ้อม': return 'bg-orange-50 text-orange-600 border-orange-100';
    default: return 'bg-slate-50 text-slate-500 border-slate-100';
  }
};

export default function HomePage() {
  const [allCourts, setAllCourts] = useState<any[]>([]) 
  const [featuredCourts, setFeaturedCourts] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [forumPosts, setForumPosts] = useState<any[]>([])
  const [selectedCourt, setSelectedCourt] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string || '',
    libraries
  })

  useEffect(() => {
    async function fetchData() {
      const { data: all } = await supabase.from('courts').select('*').eq('status', 'approved')
      if (all) setAllCourts(all)
      const { data: featured } = await supabase.from('courts').select('*').eq('status', 'approved').order('is_featured', { ascending: false }).limit(6)
      if (featured) setFeaturedCourts(featured)
      const { data: a } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(3)
      if (a) setArticles(a);
      const { data: f } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(5)
      if (f) setForumPosts(f);
    }
    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-white pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-20 bg-[#1a2b41] text-center px-4 relative overflow-hidden text-white">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em]">Thailand's Tennis Community</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-tight">
            Find the Perfect <br />
            <span className="text-[#CCFF00]">Tennis Court for You</span>
          </h1>
          <form onSubmit={(e) => { e.preventDefault(); if(searchQuery) router.push(`/courts?search=${searchQuery}`) }} className="max-w-md mx-auto bg-white p-2 rounded-2xl flex shadow-2xl">
             <Search className="ml-3 text-slate-400 self-center" size={18} />
             <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search courts..." className="flex-grow px-3 outline-none text-sm font-bold bg-transparent text-slate-900" />
             <button type="submit" className="bg-[#CCFF00] text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all active:scale-95">Search</button>
          </form>
        </div>
      </section>

      {/* 2. EXPLORE MAP */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Explore Map</h2>
          </div>
          <Link href="/courts" className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            Full Map <Navigation size={12} />
          </Link>
        </div>
        <div className="border-4 border-slate-50 shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-100">
          {isLoaded ? (
            <GoogleMap 
              mapContainerStyle={mapContainerStyle} 
              zoom={12} 
              center={center} 
              options={mapOptions}
              // ✅ บังคับโหมด HYBRID เพื่อให้เห็นเส้นถนนและชื่อสถานที่บนภาพดาวเทียม
              mapTypeId="hybrid"
            >
              {allCourts.map((court) => court.latitude && (
                <MarkerF key={court.id} position={{ lat: Number(court.latitude), lng: Number(court.longitude) }} onClick={() => setSelectedCourt(court)} />
              ))}
              {selectedCourt && (
                <InfoWindowF position={{ lat: Number(selectedCourt.latitude), lng: Number(selectedCourt.longitude) }} onCloseClick={() => setSelectedCourt(null)}>
                  <div className="p-1 max-w-[180px]">
                    {selectedCourt.image_url && <img src={selectedCourt.image_url} className="w-full h-20 object-cover rounded-lg mb-2" alt={selectedCourt.name} />}
                    <h4 className="font-bold text-slate-900 text-[11px] mb-1 uppercase whitespace-normal break-words">{selectedCourt.name}</h4>
                    <Link href={`/courts/${selectedCourt.id}`} className="block w-full bg-slate-900 text-[#CCFF00] text-center py-1.5 rounded-md text-[9px] font-black uppercase mt-2">Details</Link>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : <div className="h-[450px] bg-slate-50 flex items-center justify-center animate-pulse rounded-[2.5rem]">Loading...</div>}
        </div>
      </section>

      {/* 3. FEATURED COURTS SECTION */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Featured Courts</h2>
          <Link href="/courts" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16] flex items-center gap-1.5 transition-colors">
            View All Courts <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className="group flex flex-col h-full bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 relative">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <div className="absolute top-5 left-5 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase flex items-center gap-2 shadow-lg">
                  <Shield size={10} className="text-[#CCFF00]" /> {court.court_type || 'Public'}
                </div>
                {court.image_url && <img src={court.image_url} alt={court.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-900 text-lg mb-2 uppercase tracking-tight group-hover:text-[#84cc16] transition-colors leading-tight whitespace-normal break-words">
                  {court.name}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-2 mb-6"><MapPin size={12} /> {court.location}</p>
                <div className="mt-auto w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all shadow-md">
                  View Details
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
             <Link href="/courts" className="inline-flex items-center gap-3 bg-slate-900 text-[#CCFF00] px-10 py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-[#CCFF00] hover:text-slate-900 hover:scale-105 transition-all shadow-2xl">
                Explore Full Directory <ArrowRight size={18} />
             </Link>
        </div>
      </section>

      {/* 4. ARTICLES & COMPACT COMMUNITY SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-4 space-y-8">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Articles</h2>
                <Link href="/articles" className="text-[10px] font-black text-[#84cc16] uppercase tracking-widest">View All</Link>
              </div>
              <div className="space-y-4">
                {articles.map(art => (
                  <Link href={`/articles/${art.id}`} key={art.id} className="group flex gap-4 p-3 bg-white rounded-[1.5rem] border border-transparent hover:border-[#CCFF00] hover:shadow-lg transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <span className="text-[#84cc16] text-[9px] font-black uppercase mb-1">{art.category}</span>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight uppercase group-hover:text-[#84cc16] line-clamp-2">{art.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Community</h2>
                <Link href="/forum" className="text-[10px] font-black text-[#84cc16] uppercase tracking-widest flex items-center gap-1 group">
                  All Topics <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                {forumPosts.map((post, idx) => (
                  <Link 
                    href={`/forum/${post.id}`} 
                    key={post.id} 
                    className={`group flex items-center justify-between p-5 hover:bg-slate-50 transition-all ${idx !== forumPosts.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    <div className="flex flex-col gap-1.5 flex-grow pr-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${getTagColor(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">by {post.author_name}</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-[#84cc16] leading-snug transition-colors uppercase whitespace-normal break-words">
                        {post.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{timeAgo(post.created_at)}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex flex-col items-center justify-center group-hover:bg-[#CCFF00] transition-colors border border-slate-100">
                         <MessageCircle size={14} className="text-slate-400 group-hover:text-slate-900" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
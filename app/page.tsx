'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Search, MapPin, Star, ChevronRight, MessageSquare, BookOpen, Navigation, Clock, Shield } from 'lucide-react'

// --- Map Configuration ---
const libraries: any = ['places']
const mapOptions = {
  styles: [{ "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }],
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

// ✅ ฟังก์ชันสี Tag ตามหมวดหมู่ (ตรงตามหน้า Webboard)
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
      const { data: f } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(4)
      if (a) setArticles(a); if (f) setForumPosts(f);
    }
    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-16 bg-[#1a2b41] text-center px-4">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em]">Thailand's Tennis Community</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
            Find the Perfect <br />
            <span className="text-[#CCFF00]">Tennis Court for You</span>
          </h1>
          <form onSubmit={(e) => { e.preventDefault(); if(searchQuery) router.push(`/courts?search=${searchQuery}`) }} className="max-w-md mx-auto bg-white p-2 rounded-2xl flex shadow-2xl">
             <Search className="ml-3 text-slate-400 self-center" size={18} />
             <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search courts..." className="flex-grow px-3 outline-none text-sm font-bold bg-transparent" />
             <button type="submit" className="bg-[#CCFF00] text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase">Search</button>
          </form>
        </div>
      </section>

      {/* 2. EXPLORE MAP */}
      <section className="py-12 container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#84cc16] rounded-full"></span> Explore Map
          </h2>
          <Link href="/courts" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            Full Map Mode <Navigation size={12} />
          </Link>
        </div>
        <div className="border-4 border-slate-50 shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-100">
          {isLoaded ? (
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center} options={mapOptions}>
              {allCourts.map((court) => court.latitude && (
                <MarkerF key={court.id} position={{ lat: Number(court.latitude), lng: Number(court.longitude) }} onClick={() => setSelectedCourt(court)} />
              ))}
              {selectedCourt && (
                <InfoWindowF position={{ lat: Number(selectedCourt.latitude), lng: Number(selectedCourt.longitude) }} onCloseClick={() => setSelectedCourt(null)}>
                  <div className="p-1 max-w-[180px]">
                    {selectedCourt.image_url && <img src={selectedCourt.image_url} className="w-full h-20 object-cover rounded-lg mb-2" />}
                    <h4 className="font-bold text-slate-900 text-[11px] mb-1 uppercase">{selectedCourt.name}</h4>
                    <Link href={`/courts/${selectedCourt.id}`} className="block w-full bg-slate-900 text-[#CCFF00] text-center py-1.5 rounded-md text-[9px] font-black uppercase">Details</Link>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : <div className="h-[450px] bg-slate-100 animate-pulse rounded-[2.5rem]" />}
        </div>
      </section>

      {/* 3. RECOMMENDED COURTS */}
      <section className="py-12 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Recommended</h2>
          <Link href="/courts" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#84cc16]">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {court.image_url && <img src={court.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
                {court.is_featured && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase shadow-lg flex items-center gap-1.5">
                      <Star size={10} fill="currentColor" /> Recommended
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-base md:text-[1.1rem] mb-1 uppercase tracking-tight group-hover:text-[#84cc16] transition-colors line-clamp-1">{court.name}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1.5 mb-4"><MapPin size={12} /> {court.location}</p>
                <div className="w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all">Details</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ARTICLES & WEBBOARD */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest Articles */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Latest Articles</h2>
            <div className="space-y-4">
              {articles.map(art => (
                <Link href={`/articles/${art.id}`} key={art.id} className="group flex gap-4 p-3 bg-white rounded-2xl border border-slate-100 hover:border-[#CCFF00] transition-all">
                  <img src={art.image_url} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[#84cc16] text-[9px] font-bold uppercase mb-1">{art.category}</span>
                    <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 leading-tight uppercase">{art.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Webboard - พร้อมระบบสี Tag ใหม่ */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Popular Topics</h2>
            <div className="space-y-4">
              {forumPosts.map(post => (
                <Link href={`/forum/${post.id}`} key={post.id} className="group block p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-[#CCFF00] hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-md border shadow-sm ${getTagColor(post.category)}`}>
                      {post.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">by {post.author_name}</span>
                  </div>
                  <h4 className="text-[15px] md:text-[16px] font-bold text-slate-800 group-hover:text-[#84cc16] leading-snug transition-colors uppercase">{post.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
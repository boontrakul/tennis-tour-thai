'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Search, MapPin, Star, ChevronRight, MessageSquare, BookOpen, Navigation, Filter, Shield, Clock } from 'lucide-react'

const libraries: any = ['places']
const mapOptions = {
  styles: [{ "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }],
  disableDefaultUI: false,
  zoomControl: true,
}
const mapContainerStyle = { width: '100%', height: '500px', borderRadius: '2rem' }
const center = { lat: 13.7563, lng: 100.5018 }

export default function HomePage() {
  const [allCourts, setAllCourts] = useState<any[]>([]) 
  const [featuredCourts, setFeaturedCourts] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [forumPosts, setForumPosts] = useState<any[]>([])
  const [selectedCourt, setSelectedCourt] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string || '',
    libraries
  })

  useEffect(() => {
    async function fetchData() {
      // 1. ดึงข้อมูลสนามทั้งหมดเพื่อนำมาปักหมุด
      const { data: all } = await supabase.from('courts').select('*').eq('status', 'approved')
      if (all) setAllCourts(all)

      // 2. ดึงสนามแนะนำ (Featured)
      const { data: featured } = await supabase.from('courts').select('*').eq('status', 'approved').order('is_featured', { ascending: false }).limit(6)
      if (featured) setFeaturedCourts(featured)

      // 3. ดึงบทความและกระทู้
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
        <h1 className="text-white font-black uppercase tracking-tighter mb-8 leading-tight">
          Find the Perfect <br />
          <span className="text-[#CCFF00]">Tennis Court for You</span>
        </h1>
        <form onSubmit={(e) => { e.preventDefault(); if(searchQuery) router.push(`/courts?search=${searchQuery}`) }} className="max-w-md mx-auto bg-white p-2 rounded-2xl flex shadow-2xl">
           <Search className="ml-3 text-slate-400 self-center" size={20} />
           <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search courts..." className="flex-grow px-3 outline-none text-sm font-bold bg-transparent" />
           <button type="submit" className="bg-[#CCFF00] px-6 py-2.5 rounded-xl font-black text-[10px] uppercase transition-transform active:scale-95">Search</button>
        </form>
      </section>

      {/* 2. EXPLORE MAP - กลับมาปักหมุดได้เหมือนเดิม */}
      <section className="py-12 container mx-auto px-4 max-w-6xl">
        <h2 className="font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-[#84cc16] rounded-full"></span> Explore <span className="text-[#84cc16]">Tennis Map</span>
        </h2>
        <div className="border-4 border-slate-50 shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-100 relative">
          {isLoaded ? (
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center} options={mapOptions}>
              {allCourts.map((court) => (
                court.latitude && court.longitude && (
                  <MarkerF
                    key={court.id}
                    position={{ lat: Number(court.latitude), lng: Number(court.longitude) }}
                    onClick={() => setSelectedCourt(court)}
                  />
                )
              ))}

              {selectedCourt && (
                <InfoWindowF position={{ lat: Number(selectedCourt.latitude), lng: Number(selectedCourt.longitude) }} onCloseClick={() => setSelectedCourt(null)}>
                  <div className="p-1 max-w-[180px] font-sans">
                    {selectedCourt.image_url && <img src={selectedCourt.image_url} className="w-full h-24 object-cover rounded-lg mb-2" />}
                    <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase">{selectedCourt.name}</h4>
                    <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1"><MapPin size={10} /> {selectedCourt.location}</p>
                    <Link href={`/courts/${selectedCourt.id}`} className="block w-full bg-slate-900 text-[#CCFF00] text-center py-1.5 rounded-md text-[9px] font-black uppercase">View Details</Link>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : <div className="h-[500px] flex items-center justify-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Map Loading...</div>}
        </div>
      </section>

      {/* 3. RECOMMENDED COURTS - รายละเอียดสนามปัดฝุ่นใหม่ให้อ่านง่าย */}
      <section className="py-12 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="font-black text-slate-900 uppercase tracking-tight">Recommended</h2>
          <Link href="/courts" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16] transition-colors">View All Courts</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-[#CCFF00]/50 transition-all duration-500">
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                {court.image_url && <img src={court.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                   <Shield size={10} className="text-[#CCFF00]" /> {court.court_type || 'Public'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-1 uppercase group-hover:text-[#84cc16] transition-colors line-clamp-1">{court.name}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1.5 mb-4"><MapPin size={12} /> {court.location}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider"><Clock size={12} /> {court.opening_hours || '06:00 - 22:00'}</div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#CCFF00] transition-colors"><ChevronRight size={14} /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ARTICLES & WEBBOARD */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-black text-slate-900 uppercase tracking-tight mb-8">Latest Articles</h2>
            <div className="space-y-4">
              {articles.map(art => (
                <Link href={`/articles/${art.id}`} key={art.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-slate-100 hover:border-[#CCFF00] transition-all group">
                  <img src={art.image_url} className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[#84cc16] text-[9px] font-black uppercase mb-1">{art.category}</span>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug uppercase">{art.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-black text-slate-900 uppercase tracking-tight mb-8">Webboard</h2>
            <div className="space-y-3">
              {forumPosts.map(post => (
                <Link href={`/forum/${post.id}`} key={post.id} className="block p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-[#CCFF00]">{post.category}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">by {post.author_name}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase group-hover:text-[#84cc16] transition-colors">{post.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
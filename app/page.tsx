'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Search, MapPin, Star, ChevronRight, Navigation, Shield, ArrowRight } from 'lucide-react'

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
      const { data: f } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(4)
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
             <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search by name or location..." className="flex-grow px-3 outline-none text-sm font-bold bg-transparent text-slate-900" />
             <button type="submit" className="bg-[#CCFF00] text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-white transition-colors">Search</button>
          </form>
        </div>
      </section>

      {/* 2. EXPLORE MAP */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Explore Map</h2>
            <p className="text-slate-400 text-xs font-bold uppercase mt-1">Find courts near you</p>
          </div>
          <Link href="/courts" className="group flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
            All Courts Map <Navigation size={12} className="group-hover:translate-x-1 transition-transform" />
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
                    {selectedCourt.image_url && <img src={selectedCourt.image_url} className="w-full h-20 object-cover rounded-lg mb-2" alt={selectedCourt.name} />}
                    <h4 className="font-bold text-slate-900 text-[11px] mb-1 uppercase whitespace-normal break-words">{selectedCourt.name}</h4>
                    <Link href={`/courts/${selectedCourt.id}`} className="block w-full bg-slate-900 text-[#CCFF00] text-center py-1.5 rounded-md text-[9px] font-black uppercase mt-2">View details</Link>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : <div className="h-[450px] bg-slate-50 flex items-center justify-center text-slate-300 font-bold uppercase animate-pulse">Loading Map...</div>}
        </div>
      </section>

      {/* 3. RECOMMENDED COURTS */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Featured Courts</h2>
            <p className="text-[#84cc16] text-xs font-bold uppercase mt-1 tracking-widest">Hand-picked for you</p>
          </div>
          <Link href="/courts" className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] hover:text-[#84cc16] transition-colors border-b-2 border-transparent hover:border-[#84cc16] pb-1">
            View All Courts <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className="group flex flex-col h-full bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 relative">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <div className="absolute top-5 left-5 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase flex items-center gap-2 shadow-lg">
                  <Shield size={10} className="text-[#CCFF00]" /> {court.court_type || 'Public'}
                </div>
                {court.image_url && <img src={court.image_url} alt={court.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                {court.is_featured && (
                  <div className="absolute top-5 right-5 z-20">
                    <span className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-4 py-2 rounded-full uppercase shadow-xl flex items-center gap-2 border border-white/20">
                      <Star size={10} fill="currentColor" /> Top Pick
                    </span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-900 text-lg mb-2 uppercase tracking-tight group-hover:text-[#84cc16] transition-colors leading-tight">
                  {court.name}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-2 mb-6"><MapPin size={12} /> {court.location}</p>
                <div className="mt-auto w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all shadow-md">
                  View Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ARTICLES & WEBBOARD */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Articles Column */}
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Articles</h2>
                <Link href="/articles" className="text-[10px] font-black text-[#84cc16] uppercase tracking-widest flex items-center gap-1 group">
                  All Articles <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-5">
                {articles.map(art => (
                  <Link href={`/articles/${art.id}`} key={art.id} className="group flex gap-5 p-4 bg-white rounded-[2rem] border border-transparent hover:border-[#CCFF00] hover:shadow-xl transition-all duration-300">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[#84cc16] text-[10px] font-black uppercase mb-1.5 tracking-wider">{art.category}</span>
                      <h3 className="text-base font-bold text-slate-800 leading-snug uppercase group-hover:text-[#84cc16] transition-colors line-clamp-2">
                        {art.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Topics Column */}
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Community</h2>
                <Link href="/forum" className="text-[10px] font-black text-[#84cc16] uppercase tracking-widest flex items-center gap-1 group">
                  All Topics <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-5">
                {forumPosts.map(post => (
                  <Link href={`/forum/${post.id}`} key={post.id} className="group block p-6 bg-white border border-transparent rounded-[2rem] hover:border-[#CCFF00] hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border shadow-sm ${getTagColor(post.category)}`}>
                        {post.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-auto">{timeAgo(post.created_at)}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-[#84cc16] transition-colors uppercase leading-tight line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {post.author_name?.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">by {post.author_name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Call to Action */}
          <div className="mt-20 text-center">
             <Link href="/courts" className="inline-flex items-center gap-3 bg-slate-900 text-[#CCFF00] px-10 py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-[#CCFF00] hover:text-slate-900 hover:scale-105 transition-all shadow-2xl">
                Explore Full Directory <ArrowRight size={18} />
             </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Search, ArrowRight, Clock, Star, ChevronRight, MessageSquare, BookOpen, MapPin, Navigation, Filter, Shield } from 'lucide-react'

const libraries: any = ['places']

const mapOptions = {
  styles: [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
  ],
  disableDefaultUI: false,
  zoomControl: true,
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '2rem'
}

const center = { lat: 13.7563, lng: 100.5018 }

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  return diffInDays === 0 ? 'Today' : `${diffInDays} d ago`;
}

export default function HomePage() {
  const [allCourts, setAllCourts] = useState<any[]>([]) 
  const [featuredCourts, setFeaturedCourts] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [forumPosts, setForumPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourt, setSelectedCourt] = useState<any>(null)
  const router = useRouter()

  const [filterAccess, setFilterAccess] = useState('All')
  const [filterSurface, setFilterSurface] = useState('All')

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string || '',
    libraries: libraries
  })

  useEffect(() => {
    async function fetchData() {
      const { data: all } = await supabase
        .from('courts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      
      if (all) setAllCourts(all)

      const { data: featured } = await supabase
        .from('courts')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6)
        
      if (featured) setFeaturedCourts(featured)

      const { data: a } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(3)
      const { data: f } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(4)
      
      if (a) setArticles(a)
      if (f) setForumPosts(f)
    }
    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courts?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.parentElement?.querySelector('.emoji-fallback');
    if (fallback) fallback.classList.remove('hidden');
  };

  const filteredCourts = allCourts.filter(court => {
    const accessType = court.court_type || 'Public'
    const matchAccess = filterAccess === 'All' || accessType === filterAccess
    const matchSurface = filterSurface === 'All' || court.surface === filterSurface
    return matchAccess && matchSurface
  })

  const getTagColor = (tag: string) => {
    if (!tag) return 'bg-slate-50 text-slate-600 border-slate-100';
    const cleanTag = tag.trim();
    if (cleanTag.includes('หาเพื่อน')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (cleanTag.includes('อุปกรณ์')) return 'bg-purple-50 text-purple-600 border-purple-100';
    if (cleanTag.includes('สนาม')) return 'bg-green-50 text-green-600 border-green-100';
    if (cleanTag.includes('เทคนิค') || cleanTag.includes('Training')) return 'bg-orange-50 text-orange-600 border-orange-100';
    if (cleanTag.includes('Nutrition')) return 'bg-lime-50 text-lime-600 border-lime-100';
    if (cleanTag.includes('Pro Tour')) return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };
  
  return (
    <main className="min-h-screen bg-white pb-10">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#243c5a] via-[#1a2b41] to-white text-center">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#243c5a]/60 border border-[#CCFF00]/40 backdrop-blur-md mb-6">
            <span className="text-sm">🎾</span>
            <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em]">Thailand's #1 Tennis Community</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase leading-[1.2] tracking-tighter">
            Find the Perfect <br />
            <span className="text-[#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.2)]">Tennis Court for You</span>
          </h1>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="bg-white p-1.5 rounded-2xl flex items-center shadow-xl border border-white/10 focus-within:border-[#CCFF00] transition-all">
              <div className="flex items-center gap-2 px-3 flex-grow text-slate-900">
                <Search className="text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search courts..." 
                  className="w-full py-2 bg-transparent border-none focus:ring-0 font-bold text-sm outline-none placeholder:text-slate-400" 
                />
              </div>
              <button type="submit" className="bg-[#CCFF00] text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 hover:text-[#CCFF00] transition-all">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MAP DISCOVERY SECTION */}
      <section className="py-20 bg-slate-50 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="w-1.5 h-6 bg-[#CCFF00] rounded-full"></span>
                 <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Interactive Discovery</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Explore <span className="text-[#84cc16]">Tennis Map</span>
              </h2>
            </div>
            <Link href="/courts" className="bg-white border-2 border-slate-100 hover:border-[#CCFF00] px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2">
              Open Full Map Mode <Navigation size={14} />
            </Link>
          </div>

          <div className="bg-white p-4 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wider text-sm">
                <Filter size={18} className="text-[#84cc16]" /> Map Filters
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-[#CCFF00] transition-colors">
                  <Shield size={14} className="text-slate-400 mr-2" />
                  <select 
                    value={filterAccess} 
                    onChange={(e) => { setFilterAccess(e.target.value); setSelectedCourt(null); }}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none min-w-[120px]"
                  >
                    <option value="All">All Access</option>
                    <option value="Public">Public Courts</option>
                    <option value="Private">Private Courts</option>
                  </select>
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-[#CCFF00] transition-colors">
                  <Navigation size={14} className="text-slate-400 mr-2" />
                  <select 
                    value={filterSurface} 
                    onChange={(e) => { setFilterSurface(e.target.value); setSelectedCourt(null); }}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none min-w-[120px]"
                  >
                    <option value="All">All Surfaces</option>
                    <option value="Hard Court">Hard Court</option>
                    <option value="Clay Court">Clay Court</option>
                    <option value="Grass Court">Grass Court</option>
                    <option value="Indoor">Indoor</option>
                  </select>
                </div>
              </div>
            </div>

            {loadError ? (
              <div className="h-[500px] flex items-center justify-center text-red-500 font-bold bg-red-50 rounded-[2.5rem]">Map loading failed.</div>
            ) : !isLoaded ? (
              <div className="h-[500px] flex items-center justify-center text-slate-300 animate-pulse bg-slate-50 rounded-[2.5rem]">Tennis Courts Loading...</div>
            ) : (
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center} options={mapOptions}>
                {filteredCourts.map((court) => (
                  court.latitude && court.longitude && (
                    <MarkerF
                      key={`map-${court.id}`}
                      position={{ lat: Number(court.latitude), lng: Number(court.longitude) }}
                      onClick={() => setSelectedCourt(court)}
                    />
                  )
                ))}
                {selectedCourt && (
                  <InfoWindowF position={{ lat: Number(selectedCourt.latitude), lng: Number(selectedCourt.longitude) }} onCloseClick={() => setSelectedCourt(null)}>
                    <div className="p-2 max-w-[200px] font-sans">
                      <div className="rounded-lg overflow-hidden h-24 mb-3 border border-slate-100 bg-slate-50 flex items-center justify-center relative">
                         <div className="absolute top-1 right-1 bg-white/90 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                           {selectedCourt.court_type || 'Public'}
                         </div>
                         {selectedCourt.image_url ? (
                           <img src={selectedCourt.image_url} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-2xl">🎾</span>
                         )}
                      </div>
                      <h4 className="font-bold text-slate-900 uppercase text-sm leading-tight mb-1">{selectedCourt.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mb-3"><MapPin size={10} className="inline mr-1" /> {selectedCourt.location}</p>
                      <Link href={`/courts/${selectedCourt.id}`} className="block w-full bg-[#CCFF00] text-slate-900 text-center py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-[#CCFF00] transition-all">
                        View Details
                      </Link>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDED COURTS */}
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#CCFF00] rounded-full"></span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase">Recommended Courts</h2>
          </div>
          <Link href="/courts" className="group flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16] transition-colors">
            View All Courts <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className={`group rounded-[2rem] overflow-hidden transition-all duration-300 bg-white flex flex-col shadow-sm relative ${court.is_featured ? 'border-2 border-[#CCFF00] shadow-xl shadow-[#CCFF00]/15' : 'border border-slate-100 hover:border-[#CCFF00] hover:shadow-xl'}`}>
              {court.is_featured && (
                <div className="absolute top-0 right-0 z-20">
                  <div className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase flex items-center gap-1"><Star size={10} fill="currentColor" /> Recommended</div>
                </div>
              )}
              <div className="relative h-52 overflow-hidden bg-slate-50 flex items-center justify-center">
                <div className={`emoji-fallback ${court.image_url ? 'hidden' : ''} flex flex-col items-center gap-2`}><span className="text-4xl">🎾</span></div>
                {court.image_url && <img src={court.image_url} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={handleImgError} />}
              </div>
              <div className="p-6 flex flex-grow flex-col">
                <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-[#CCFF00] leading-tight mb-2 uppercase">{court.name}</h3>
                <p className="text-slate-500 text-xs mb-6 line-clamp-1">{court.location}</p>
                <div className="mt-auto text-center bg-slate-900 text-white py-4 rounded-xl font-black text-[12px] group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all uppercase tracking-widest">View Details</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ARTICLES & FORUM */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-xl font-bold text-slate-900 uppercase">Latest Articles</h2>
                <Link href="/articles" className="group flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16]">View All Articles <BookOpen size={12} /></Link>
              </div>
              <div className="space-y-4">
                {articles.map((article) => (
                  <Link href={`/articles/${article.id}`} key={article.id} className="group flex gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:border-[#CCFF00] shadow-sm transition-all">
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                      {article.image_url ? <img src={article.image_url} className="w-full h-full object-cover" /> : <span className="text-2xl">🎾</span>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase text-slate-400">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getTagColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span>{timeAgo(article.created_at)}</span>
                      </div>
                      <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-[#CCFF00] line-clamp-2 leading-tight">{article.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-xl font-bold text-slate-900 uppercase">Popular Topics</h2>
                <Link href="/forum" className="group flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">View All Topics <MessageSquare size={12} /></Link>
              </div>
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <Link href={`/forum/${post.id}`} key={post.id} className="group block p-5 bg-white border border-slate-100 rounded-3xl hover:border-[#CCFF00] shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm border ${getTagColor(post.category)}`}>
                        {post.category}
                      </span>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        <span>by {post.author_name}</span>
                        <span className="ml-2">{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                    <h4 className="text-[18px] font-bold text-slate-900 group-hover:text-[#CCFF00] leading-snug">{post.title}</h4>
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
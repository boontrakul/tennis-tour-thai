'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Search, ArrowRight, Star, ChevronRight, MessageSquare, BookOpen, MapPin, Navigation, Filter, Shield } from 'lucide-react'

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

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'หาเพื่อนตีเทนนิส': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'รีวิวอุปกรณ์เทนนิส': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'รีวิวสนามเทนนิส': return 'bg-green-50 text-green-600 border-green-100';
      case 'เทคนิคและการฝึกซ้อม': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredCourts = allCourts.filter(court => {
    const accessType = court.court_type || 'Public'
    const matchAccess = filterAccess === 'All' || accessType === filterAccess
    const matchSurface = filterSurface === 'All' || court.surface === filterSurface
    return matchAccess && matchSurface
  })

  return (
    <main className="min-h-screen bg-white pb-10">
      
      {/* 1. HERO SECTION - ปรับฟอนต์เล็กลงและไม่เอียง */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#1a2b41] text-center">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-[0.2em]">Thailand's Tennis Community</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
            Find the Perfect <br />
            <span className="text-[#CCFF00]">Tennis Court for You</span>
          </h1>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="bg-white p-2 rounded-2xl flex items-center shadow-2xl transition-all">
              <div className="flex items-center gap-3 px-3 flex-grow text-slate-900">
                <Search className="text-slate-400" size={18} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search courts..." className="w-full py-2 bg-transparent border-none focus:ring-0 font-bold text-sm md:text-base outline-none" />
              </div>
              <button type="submit" className="bg-[#CCFF00] text-slate-900 px-6 md:px-8 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase shadow-md hover:scale-105 transition-all">Search</button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. MAP DISCOVERY - หัวข้อเล็กลง สบายตา */}
      <section className="py-16 bg-slate-50 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="w-1 h-4 bg-[#CCFF00] rounded-full"></span>
                 <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Discovery</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Explore <span className="text-[#84cc16]">Tennis Map</span>
              </h2>
            </div>
            <Link href="/courts" className="bg-white border border-slate-200 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              Full Map Mode <Navigation size={12} />
            </Link>
          </div>

          <div className="bg-white p-2 md:p-3 rounded-[2.5rem] shadow-xl border border-white">
            {isLoaded ? (
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center} options={mapOptions}>
                {filteredCourts.map((court) => court.latitude && (
                  <MarkerF key={court.id} position={{ lat: Number(court.latitude), lng: Number(court.longitude) }} onClick={() => setSelectedCourt(court)} />
                ))}
              </GoogleMap>
            ) : <div className="h-[500px] bg-slate-100 animate-pulse rounded-[2.5rem]" />}
          </div>
        </div>
      </section>

      {/* 3. RECOMMENDED COURTS - แก้ชื่อสนามให้เล็กลง */}
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Recommended</h2>
          <Link href="/courts" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#84cc16] flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className="group rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48 bg-slate-100">
                {court.image_url && <img src={court.image_url} alt={court.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#84cc16] mb-1 uppercase tracking-tight">
                  {court.name}
                </h3>
                <p className="text-slate-400 text-[11px] font-medium uppercase mb-4 flex items-center gap-1"><MapPin size={12} /> {court.location}</p>
                <div className="w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all">
                  Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ARTICLES & FORUM - ขนาดกระทู้เล็กลงอ่านง่าย */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Articles */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Latest Articles</h2>
              <div className="space-y-4">
                {articles.map((article) => (
                  <Link href={`/articles/${article.id}`} key={article.id} className="group flex gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:border-[#CCFF00] transition-all">
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50">
                      {article.image_url ? <img src={article.image_url} className="w-full h-full object-cover" /> : <span className="text-xl">🎾</span>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[#84cc16] text-[9px] font-bold uppercase mb-1">{article.category}</span>
                      <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-[#84cc16] line-clamp-2 leading-tight uppercase">{article.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Forum */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Webboard</h2>
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <Link href={`/forum/${post.id}`} key={post.id} className="group block p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#CCFF00] transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${getTagColor(post.category)}`}>{post.category}</span>
                      <span className="text-[9px] font-medium text-slate-400 uppercase">by {post.author_name}</span>
                    </div>
                    <h4 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-[#84cc16] leading-snug uppercase">{post.title}</h4>
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
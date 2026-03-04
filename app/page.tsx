'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
// ✅ เพิ่มไอคอน Filter และ Shield
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
  borderRadius: '2rem' // ปรับให้โค้งมนรับกับกรอบ
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

  // ✅ 1. เพิ่ม State สำหรับเก็บค่า Filter
  const [filterAccess, setFilterAccess] = useState('All')
  const [filterSurface, setFilterSurface] = useState('All')

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string || '',
    libraries: libraries
  })

  useEffect(() => {
    async function fetchData() {
      // 1. ดึงข้อมูลสนามทั้งหมด (เอาเฉพาะที่อนุมัติแล้ว และเรียงจากใหม่สุดไปเก่าสุด)
      const { data: all } = await supabase
        .from('courts')
        .select('*')
        .eq('status', 'approved') // ✅ ซ่อนสนามที่กำลัง pending
        .order('created_at', { ascending: false }) // ✅ เรียงเอาสนามใหม่ขึ้นก่อน
        
      if (all) setAllCourts(all)

      // 2. ดึงข้อมูลสนามแนะนำ (เอาเฉพาะที่อนุมัติแล้วเช่นกัน)
      const { data: featured } = await supabase
        .from('courts')
        .select('*')
        .eq('status', 'approved') // ✅ ป้องกันสนาม pending หลุดมาโชว์ในช่องแนะนำ
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false }) // ✅ ถ้าไม่ใช่สนามแนะนำ ให้เรียงตามความใหม่
        .limit(6)
        
      if (featured) setFeaturedCourts(featured)

      // 3. ดึงข้อมูลบทความและกระทู้ (อันนี้คุณทำไว้เรียงตามใหม่ล่าสุดอยู่แล้ว เยี่ยมเลยครับ)
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

  // ✅ 2. สร้าง Logic คัดกรองข้อมูลสนาม (Filtered Courts)
  const filteredCourts = allCourts.filter(court => {
    const accessType = court.court_type || 'Public' // ถ้าไม่มีข้อมูลให้มองว่าเป็น Public
    const matchAccess = filterAccess === 'All' || accessType === filterAccess
    const matchSurface = filterSurface === 'All' || court.surface === filterSurface
    
    return matchAccess && matchSurface
  })

  return (
    <main className="min-h-screen bg-white pb-10">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-[#243c5a] via-[#1a2b41] to-white text-center">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#243c5a]/60 border border-[#CCFF00]/40 backdrop-blur-md mb-8">
            <span className="text-sm">🎾</span>
            <span className="text-[11px] font-black text-[#CCFF00] uppercase tracking-widest">Thailand's #1 Tennis Community</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 uppercase italic leading-[1.1] tracking-tighter">
            Find the Perfect <br />
            <span className="text-[#CCFF00] drop-shadow-[0_0_30px_rgba(204,255,0,0.3)]">Tennis Court for You</span>
          </h1>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="bg-white p-2 rounded-2xl flex items-center shadow-2xl border-2 border-white/5 focus-within:border-[#CCFF00] transition-all">
              <div className="flex items-center gap-3 px-3 flex-grow text-slate-900">
                <Search className="text-slate-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search courts by name or location..." className="w-full py-2 bg-transparent border-none focus:ring-0 font-bold text-base outline-none" />
              </div>
              <button type="submit" className="bg-[#CCFF00] text-slate-900 px-8 py-3 rounded-xl font-black text-xs uppercase shadow-md hover:scale-105 transition-all">Search</button>
            </div>
          </form>
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#CCFF00]/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>
      </section>

      {/* --- MAP DISCOVERY SECTION --- */}
      <section className="py-20 bg-slate-50 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="w-1.5 h-6 bg-[#CCFF00] rounded-full"></span>
                 <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Interactive Discovery</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Explore <span className="text-[#84cc16]">Tennis Map</span>
              </h2>
            </div>
            <Link href="/courts" className="bg-white border-2 border-slate-100 hover:border-[#CCFF00] px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2">
              Open Full Map Mode <Navigation size={14} />
            </Link>
          </div>

          <div className="bg-white p-4 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white relative overflow-hidden group">
            
            {/* ✅ 3. แถบควบคุม Filter ก่อนถึงตัวแผนที่ */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase italic tracking-wider text-sm">
                <Filter size={18} className="text-[#84cc16]" /> Map Filters
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                {/* Dropdown: Public / Private */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-[#CCFF00] transition-colors">
                  <Shield size={14} className="text-slate-400 mr-2" />
                  <select 
                    value={filterAccess} 
                    onChange={(e) => {
                      setFilterAccess(e.target.value)
                      setSelectedCourt(null) // ปิดหน้าต่าง InfoWindow เวลากดฟิลเตอร์
                    }}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none min-w-[120px]"
                  >
                    <option value="All">All Access</option>
                    <option value="Public">Public Courts</option>
                    <option value="Private">Private Courts</option>
                  </select>
                </div>

                {/* Dropdown: Surface Type */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-[#CCFF00] transition-colors">
                  <Navigation size={14} className="text-slate-400 mr-2" />
                  <select 
                    value={filterSurface} 
                    onChange={(e) => {
                      setFilterSurface(e.target.value)
                      setSelectedCourt(null)
                    }}
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

            {/* แผนที่ */}
            {loadError ? (
              <div className="h-[500px] flex items-center justify-center text-red-500 font-bold uppercase tracking-widest bg-red-50 rounded-[2.5rem]">Map loading failed. Check your API Key.</div>
            ) : !isLoaded ? (
              <div className="h-[500px] flex items-center justify-center text-slate-300 font-black uppercase tracking-[0.2em] animate-pulse bg-slate-50 rounded-[2.5rem]">Tennis Courts Loading...</div>
            ) : (
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center} options={mapOptions}>
                {/* ✅ 4. นำ filteredCourts มาวาดหมุดแทน allCourts */}
                {filteredCourts.map((court) => {
                  if (!court.latitude || !court.longitude) return null;
                  return (
                    <MarkerF
                      key={`map-${court.id}`}
                      position={{ lat: Number(court.latitude), lng: Number(court.longitude) }}
                      onClick={() => setSelectedCourt(court)}
                    />
                  )
                })}

                {selectedCourt && (
                  <InfoWindowF position={{ lat: Number(selectedCourt.latitude), lng: Number(selectedCourt.longitude) }} onCloseClick={() => setSelectedCourt(null)}>
                    <div className="p-2 max-w-[200px] font-sans">
                      <div className="rounded-lg overflow-hidden h-24 mb-3 border border-slate-100 bg-slate-50 flex items-center justify-center relative">
                         {/* ป้ายบอกประเภทสนามมุมขวาบนของรูป */}
                         <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                           {selectedCourt.court_type || 'Public'}
                         </div>
                         {selectedCourt.image_url ? (
                           <img src={selectedCourt.image_url} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-2xl">🎾</span>
                         )}
                      </div>
                      <h4 className="font-black text-slate-900 uppercase italic text-sm leading-tight mb-1">{selectedCourt.name}</h4>
                      <div className="flex flex-col gap-1 mb-3">
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1"><MapPin size={10} /> {selectedCourt.location}</p>
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1"><Navigation size={10} /> {selectedCourt.surface || 'Hard Court'}</p>
                      </div>
                      <Link href={`/courts/${selectedCourt.id}`} className="block w-full bg-[#CCFF00] text-slate-900 text-center py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-[#CCFF00] transition-all">
                        View Details
                      </Link>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            )}
            
            {/* โชว์จำนวนสนามที่กรองได้ */}
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-slate-100 z-10 pointer-events-none">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showing</span>
              <span className="ml-2 text-sm font-black text-slate-900">{filteredCourts.length} Courts</span>
            </div>

          </div>
        </div>
      </section>

      {/* --- RECOMMENDED COURTS --- */}
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#CCFF00] rounded-full"></span>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic">Recommended Courts</h2>
          </div>
          <Link href="/courts" className="group flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16] transition-colors">
            View All Courts <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className={`group rounded-[2rem] overflow-hidden transition-all duration-300 bg-white flex flex-col shadow-sm cursor-pointer relative ${court.is_featured ? 'border-2 border-[#CCFF00] shadow-xl shadow-[#CCFF00]/15 ring-4 ring-[#CCFF00]/5 z-10' : 'border border-slate-100 hover:border-[#CCFF00] hover:shadow-xl'}`}>
              {court.is_featured && (
                <div className="absolute top-0 right-0 z-20">
                  <div className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-sm flex items-center gap-1"><Star size={10} fill="currentColor" /> Recommended</div>
                </div>
              )}
              <div className="relative h-52 overflow-hidden bg-slate-50 flex items-center justify-center">
                <div className={`emoji-fallback ${court.image_url ? 'hidden' : ''} flex flex-col items-center gap-2`}><span className="text-4xl">🎾</span><span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Tennis Tour Thai</span></div>
                {court.image_url && <img src={court.image_url} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={handleImgError} />}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-[20px] font-black text-slate-900 group-hover:text-[#CCFF00] leading-tight mb-2 uppercase italic transition-colors">{court.name}</h3>
                <p className="text-slate-500 text-xs mb-6 line-clamp-1 flex items-center gap-1">{court.location}</p>
                <div className="mt-auto block w-full text-center bg-slate-900 text-white py-4 rounded-xl font-black text-[12px] group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all uppercase tracking-widest">View Details</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/courts" className="group flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-slate-900 text-slate-500 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-sm">View All Courts <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
      </section>

      {/* --- ARTICLES & FORUM --- */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                   <div className="flex justify-between items-end mb-8">
                      <h2 className="text-xl font-black text-slate-900 italic uppercase">Latest Articles</h2>
                      <Link href="/articles" className="group flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16] transition-colors">View All Articles <BookOpen size={12} className="group-hover:translate-x-1 transition-transform" /></Link>
                   </div>
                   <div className="space-y-4">
                      {articles.map((article) => (
                        <Link href={`/articles/${article.id}`} key={article.id} className="group flex gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:border-[#CCFF00] transition-all shadow-sm">
                           <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center shadow-sm">
                              {article.image_url ? <img src={article.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all" onError={handleImgError} /> : <span className="text-2xl">🎾</span>}
                           </div>
                           <div className="flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-1.5 text-[10px] font-black uppercase text-slate-400">
                                <span className="text-[#84cc16]">{article.category}</span>
                                <span className="italic flex items-center gap-1"><Clock size={10} /> {timeAgo(article.created_at)}</span>
                              </div>
                              <h3 className="text-[18px] font-black text-slate-900 group-hover:text-[#CCFF00] line-clamp-2 leading-tight transition-colors">{article.title}</h3>
                           </div>
                        </Link>
                      ))}
                   </div>
                </div>
                <div>
                   <div className="flex justify-between items-end mb-8">
                      <h2 className="text-xl font-black text-slate-900 italic uppercase">Popular Topics</h2>
                      <Link href="/forum" className="group flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#84cc16] transition-colors">View All Topics <MessageSquare size={12} className="group-hover:translate-x-1 transition-transform" /></Link>
                   </div>
                   <div className="space-y-4">
                      {forumPosts.map((post) => (
                        <Link href={`/forum/${post.id}`} key={post.id} className="group block p-5 bg-white border border-slate-100 rounded-3xl hover:border-[#CCFF00] transition-all shadow-sm">
                           <div className="flex items-center gap-3 mb-2">
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm bg-slate-100 text-slate-900">{post.category}</span>
                              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>by {post.author_name}</span>
                                <span className="flex items-center gap-1.5 ml-1"><Clock size={10} /> {timeAgo(post.created_at)}</span>
                              </div>
                           </div>
                           <h4 className="text-[18px] font-black text-slate-900 group-hover:text-[#CCFF00] leading-snug transition-colors">{post.title}</h4>
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
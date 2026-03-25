'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, MapPin, Map as MapIcon, List, Plus, Star, Loader2, ChevronDown, Shield, Navigation, ArrowRight,
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead, CheckCircle2, Clock 
} from 'lucide-react'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'

// ฟังก์ชันช่วยเลือกไอคอนสำหรับ Facilities ขนาดเล็ก
const getFacilityIconSmall = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('parking')) return <Car size={14} />;
  if (n.includes('restaurant') || n.includes('food')) return <Utensils size={14} />;
  if (n.includes('shop')) return <Store size={14} />;
  if (n.includes('coach')) return <GraduationCap size={14} />;
  if (n.includes('changing')) return <PersonStanding size={14} />;
  if (n.includes('locker')) return <Lock size={14} />;
  if (n.includes('pool')) return <Waves size={14} />;
  if (n.includes('wifi')) return <Wifi size={14} />;
  if (n.includes('shower')) return <ShowerHead size={14} />;
  return <CheckCircle2 size={14} />;
};

// --- การตั้งค่าแผนที่ ---
const mapContainerStyle = { width: '100%', height: '600px', borderRadius: '2.5rem' }
const defaultCenter = { lat: 13.7563, lng: 100.5018 } 
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

function CourtsContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [courts, setCourts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(9)
  
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedSurface, setSelectedSurface] = useState('All') 
  const [filterAccess, setFilterAccess] = useState('All') 
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedMarker, setSelectedMarker] = useState<any>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string || '',
    libraries: libraries
  })

  useEffect(() => {
    async function fetchCourts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (data) setCourts(data)
      setLoading(false)
    }
    fetchCourts()
  }, [])

  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          court.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSurface = selectedSurface === 'All' || court.surface === selectedSurface
    const accessType = court.court_type || 'Public'
    const matchesAccess = filterAccess === 'All' || accessType === filterAccess
    return matchesSearch && matchesSurface && matchesAccess
  })

  const displayedCourts = filteredCourts.slice(0, visibleCount)

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.parentElement?.querySelector('.emoji-fallback');
    if (fallback) fallback.classList.remove('hidden');
  };

  if (loadError) return <div className="p-10 text-center font-bold text-red-500 uppercase tracking-widest">Error loading Google Maps</div>

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      <section className="bg-slate-900 pt-32 pb-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#CCFF00]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-4">
            Tennis <span className="text-[#CCFF00]">Courts</span>
          </h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
            Discover the best places to play in Thailand
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
        
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col xl:flex-row gap-6 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            <div className="relative flex-grow md:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#CCFF00] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold outline-none focus:border-[#CCFF00] focus:ring-4 focus:ring-[#CCFF00]/10 transition-all text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative group">
               <Shield size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#CCFF00] transition-colors pointer-events-none" />
               <select 
                 value={filterAccess} 
                 onChange={(e) => setFilterAccess(e.target.value)}
                 className="w-full md:w-auto pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-full outline-none cursor-pointer focus:border-[#CCFF00] hover:border-[#CCFF00] transition-all appearance-none"
               >
                 <option value="All">All Access</option>
                 <option value="Public">Public Courts</option>
                 <option value="Private">Private Courts</option>
               </select>
               <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative group">
               <Navigation size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#CCFF00] transition-colors pointer-events-none" />
               <select 
                 value={selectedSurface} 
                 onChange={(e) => setSelectedSurface(e.target.value)}
                 className="w-full md:w-auto pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-full outline-none cursor-pointer focus:border-[#CCFF00] hover:border-[#CCFF00] transition-all appearance-none"
               >
                 <option value="All">All Surfaces</option>
                 <option value="Hard Court">Hard Court</option>
                 <option value="Clay Court">Clay Court</option>
                 <option value="Grass Court">Grass Court</option>
                 <option value="Indoor">Indoor</option>
               </select>
               <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            <div className="bg-slate-100 p-2 rounded-full flex border-2 border-slate-200/50 shadow-inner w-full sm:w-auto relative">
              <button onClick={() => setViewMode('list')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 z-10 ${viewMode === 'list' ? 'bg-slate-900 text-[#CCFF00] shadow-xl scale-105 ring-4 ring-slate-900/10' : 'text-slate-400 hover:text-slate-900'}`}><List size={16} strokeWidth={3} /> List</button>
              <button onClick={() => setViewMode('map')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 z-10 ${viewMode === 'map' ? 'bg-[#CCFF00] text-slate-900 shadow-[0_8px_30px_rgba(204,255,0,0.4)] scale-105 ring-4 ring-[#CCFF00]/20' : 'text-slate-400 hover:text-slate-900'}`}><MapIcon size={16} strokeWidth={3} /> Map</button>
            </div>
            <Link href="/courts/add" className="group bg-[#E35205] text-white px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#C84402] hover:shadow-[0_8px_20px_rgba(227,82,5,0.4)] transition-all duration-300 flex items-center gap-2 shadow-md"><Plus size={14} strokeWidth={4} /><span className="hidden sm:inline">Add Court</span></Link>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center gap-4"><Loader2 className="animate-spin text-[#CCFF00]" size={40} /><p className="font-black text-slate-400 uppercase text-xs tracking-widest">Finding Courts...</p></div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm"><span className="text-6xl mb-4 block">🎾</span><h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2">No Courts Found</h3></div>
        ) : viewMode === 'map' ? (
          <div className="w-full bg-white border border-slate-100 p-4 rounded-[3rem] shadow-2xl relative z-0 animate-in fade-in zoom-in-95 duration-300">
            {!isLoaded ? (<div className="h-[600px] flex items-center justify-center font-black text-slate-300 uppercase tracking-widest bg-slate-50 animate-pulse">Loading...</div>) : (
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={defaultCenter} options={mapOptions}>
                {filteredCourts.map(court => court.latitude && court.longitude && <MarkerF key={court.id} position={{ lat: Number(court.latitude), lng: Number(court.longitude) }} onClick={() => setSelectedMarker(court)} />)}
                {selectedMarker && (
                  <InfoWindowF position={{ lat: Number(selectedMarker.latitude), lng: Number(selectedMarker.longitude) }} onCloseClick={() => setSelectedMarker(null)}>
                    <div className="p-2 max-w-[200px]">
                      <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">{selectedMarker.image_url ? <img src={selectedMarker.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎾</div>}</div>
                      <h4 className="font-black text-slate-900 uppercase italic text-sm leading-tight mb-1">{selectedMarker.name}</h4>
                      <Link href={`/courts/${selectedMarker.id}`} className="block text-center bg-[#CCFF00] text-slate-900 text-[10px] font-black py-2 rounded-lg uppercase mt-2">View Details</Link>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            )}
          </div>
        ) : (
          /* 📋 LIST VIEW (GRID) */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              {displayedCourts.map((court) => {
                const facilitiesArray = court.facilities ? court.facilities.split(',').map((f: string) => f.trim()) : [];
                return (
                  <Link href={`/courts/${court.id}`} key={court.id} className="group flex flex-col h-full relative">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-[#CCFF00]/50 transition-all duration-500 flex flex-col h-full">
                      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                        <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm"><Shield size={10} className="text-[#CCFF00]" /> {court.court_type || 'Public'}</div>
                        <div className={`emoji-fallback ${court.image_url ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}><span className="text-4xl">🎾</span></div>
                        {court.image_url && <img src={court.image_url} alt={court.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImgError} />}
                      </div>

                      <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <div className="mb-3"><span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest flex inline-flex items-center gap-1.5 border border-slate-200"><Navigation size={10} className="text-[#84cc16]" /> {court.surface || 'Hard Court'}</span></div>
                        
                        {/* 1. ชื่อสนามเล็กลง (text-lg) */}
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-[#84cc16] transition-colors leading-tight mb-3 uppercase italic line-clamp-2">{court.name}</h3>
                        <p className="text-slate-500 text-[11px] font-bold uppercase flex items-center gap-1.5 mb-6 line-clamp-1"><MapPin size={14} className="text-slate-400" /> {court.location}</p>

                        {/* 3. แสดง facilities ทั้งหมดด้วยไอคอนขนาดเล็ก */}
                        {facilitiesArray.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6 border-t border-slate-50 pt-4">
                            {facilitiesArray.map((f: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100" title={f}>
                                <div className="text-[#84cc16]">{getFacilityIconSmall(f)}</div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* 2. นำราคาออก และโชว์เวลาเปิดปิดแทนที่ด้านล่าง */}
                        <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Clock size={14} className="text-[#84cc16]" />
                             <span className="text-[10px] font-black uppercase tracking-widest">{court.opening_hours || '06:00 - 22:00'}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#CCFF00] transition-colors"><ArrowRight size={16} className="text-slate-400 group-hover:text-slate-900 group-hover:-rotate-45 transition-all" /></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {filteredCourts.length > visibleCount && (
              <div className="mt-16 flex justify-center"><button onClick={() => setVisibleCount(prev => prev + 6)} className="flex flex-col items-center gap-3 group"><span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Load More</span><div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-[#CCFF00] transition-all shadow-sm"><ChevronDown size={20} className="text-slate-400 group-hover:text-slate-900 transition-all" /></div></button></div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default function CourtsPage() {
  return (<Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-[#CCFF00]" size={40} /></div>}><CourtsContent /></Suspense>)
}
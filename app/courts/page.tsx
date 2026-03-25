'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, MapPin, Map as MapIcon, List, Plus, Star, Loader2, 
  ChevronDown, Shield, Navigation, ArrowRight, Clock,
  Car, PersonStanding, ShowerHead, Lock 
} from 'lucide-react'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'

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
      const { data } = await supabase
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
    const matchesAccess = filterAccess === 'All' || (court.court_type || 'Public') === filterAccess
    return matchesSearch && matchesSurface && matchesAccess
  })

  const displayedCourts = filteredCourts.slice(0, visibleCount)

  // ฟังก์ชันเช็ค Facility เพื่อโชว์ไอคอนเล็กในการ์ด
  const hasFacility = (facilityStr: string, target: string) => {
    if (!facilityStr) return false;
    return facilityStr.toLowerCase().includes(target.toLowerCase());
  }

  if (loadError) return <div className="p-10 text-center font-bold text-red-500 uppercase">Error loading Google Maps</div>

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-slate-900 pt-32 pb-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#CCFF00]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-none mb-4">
            Tennis <span className="text-[#CCFF00]">Courts</span>
          </h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Discover the best places to play in Thailand</p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
        
        {/* CONTROLS BAR */}
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col xl:flex-row gap-6 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            <div className="relative flex-grow md:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#CCFF00]" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold outline-none focus:border-[#CCFF00] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filters */}
            <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)} className="pl-6 pr-10 py-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-full outline-none appearance-none cursor-pointer">
              <option value="All">All Access</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <select value={selectedSurface} onChange={(e) => setSelectedSurface(e.target.value)} className="pl-6 pr-10 py-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-full outline-none appearance-none cursor-pointer">
              <option value="All">All Surfaces</option>
              <option value="Hard Court">Hard Court</option>
              <option value="Clay Court">Clay Court</option>
              <option value="Grass Court">Grass Court</option>
              <option value="Indoor">Indoor</option>
            </select>
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto justify-between">
            <div className="bg-slate-100 p-2 rounded-full flex border-2 border-slate-200/50">
              <button onClick={() => setViewMode('list')} className={`px-8 py-3 rounded-full text-xs font-black uppercase transition-all ${viewMode === 'list' ? 'bg-slate-900 text-[#CCFF00] shadow-lg' : 'text-slate-400'}`}>List</button>
              <button onClick={() => setViewMode('map')} className={`px-8 py-3 rounded-full text-xs font-black uppercase transition-all ${viewMode === 'map' ? 'bg-[#CCFF00] text-slate-900 shadow-lg' : 'text-slate-400'}`}>Map</button>
            </div>
            <Link href="/courts/add" className="bg-[#E35205] text-white px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-md">
              <Plus size={14} strokeWidth={4} /> Add Court
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center gap-4"><Loader2 className="animate-spin text-[#CCFF00]" size={40} /><p className="font-black text-slate-400 uppercase text-xs">Finding Courts...</p></div>
        ) : viewMode === 'map' ? (
          /* MAP VIEW */
          <div className="w-full bg-white p-4 rounded-[3rem] shadow-2xl h-[600px]">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={defaultCenter} options={mapOptions}>
              {filteredCourts.map(court => (court.latitude && court.longitude) && <MarkerF key={court.id} position={{ lat: Number(court.latitude), lng: Number(court.longitude) }} onClick={() => setSelectedMarker(court)} />)}
              {selectedMarker && (
                <InfoWindowF position={{ lat: Number(selectedMarker.latitude), lng: Number(selectedMarker.longitude) }} onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2 max-w-[200px]">
                    <h4 className="font-black text-slate-900 uppercase text-sm mb-1">{selectedMarker.name}</h4>
                    <Link href={`/courts/${selectedMarker.id}`} className="block text-center bg-[#CCFF00] text-slate-900 text-[10px] font-black py-2 rounded-lg uppercase mt-2">View Details</Link>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          </div>
        ) : (
          /* LIST VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourts.map((court) => (
              <Link href={`/courts/${court.id}`} key={court.id} className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-[#CCFF00]/50 transition-all duration-500">
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                    <Shield size={10} className="text-[#CCFF00]" /> {court.court_type || 'Public'}
                  </div>
                  {court.image_url ? (
                    <img src={court.image_url} alt={court.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎾</div>
                  )}
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="mb-3 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1.5">
                      <Navigation size={10} className="text-[#84cc16]" /> {court.surface || 'Hard Court'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#84cc16] transition-colors uppercase italic mb-2 line-clamp-1">{court.name}</h3>
                  <p className="text-slate-500 text-[11px] font-bold uppercase flex items-center gap-1.5 mb-4"><MapPin size={14} className="text-slate-400" /> {court.location}</p>

                  {/* ✅ COMPACT FACILITIES SECTION */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 border-t border-slate-50 pt-4">
                    {hasFacility(court.facilities, 'Parking') && (
                      <div className="flex items-center gap-1.5 text-slate-400"><Car size={14} className="text-[#84cc16]" /><span className="text-[9px] font-black uppercase">Parking</span></div>
                    )}
                    {hasFacility(court.facilities, 'Changing') && (
                      <div className="flex items-center gap-1.5 text-slate-400"><PersonStanding size={14} className="text-[#84cc16]" /><span className="text-[9px] font-black uppercase">Changing</span></div>
                    )}
                    {hasFacility(court.facilities, 'Shower') && (
                      <div className="flex items-center gap-1.5 text-slate-400"><ShowerHead size={14} className="text-[#84cc16]" /><span className="text-[9px] font-black uppercase">Shower</span></div>
                    )}
                    {hasFacility(court.facilities, 'Locker') && (
                      <div className="flex items-center gap-1.5 text-slate-400"><Lock size={14} className="text-[#84cc16]" /><span className="text-[9px] font-black uppercase">Locker</span></div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{court.opening_hours || '06:00 - 22:00'}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#CCFF00] transition-colors">
                      <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-900 group-hover:-rotate-45 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default function CourtsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-[#CCFF00]" size={40} /></div>}>
      <CourtsContent />
    </Suspense>
  )
}
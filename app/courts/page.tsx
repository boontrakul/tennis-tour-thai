'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, MapPin, List, Plus, Star, Loader2, Shield, Navigation, Clock,
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead, CheckCircle2, ChevronDown 
} from 'lucide-react'

// ฟังก์ชันดึง Icon สำหรับ Facilities
const getFacilityIconSmall = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('parking')) return <Car size={12} />;
  if (n.includes('restaurant') || n.includes('food')) return <Utensils size={12} />;
  if (n.includes('shop')) return <Store size={12} />;
  if (n.includes('coach')) return <GraduationCap size={12} />;
  if (n.includes('changing')) return <PersonStanding size={12} />;
  if (n.includes('locker')) return <Lock size={12} />;
  if (n.includes('pool')) return <Waves size={12} />;
  if (n.includes('wifi')) return <Wifi size={12} />;
  if (n.includes('shower')) return <ShowerHead size={12} />;
  return <CheckCircle2 size={12} />;
};

function CourtsContent() {
  const searchParams = useSearchParams()
  const [courts, setCourts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  
  // ระบบ Pagination: เริ่มต้นแสดง 9 รายการ
  const [visibleCount, setVisibleCount] = useState(9)

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

  // ระบบกรองข้อมูลจาก Search Query
  const filteredCourts = courts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // แบ่งข้อมูลมาแสดงตามจำนวน visibleCount (ทีละ 9)
  const displayedCourts = filteredCourts.slice(0, visibleCount)

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-32 font-sans text-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Bar: Search, Full Map & Add Court */}
        <div className="mb-12 flex flex-col lg:flex-row gap-4 justify-between items-center max-w-5xl mx-auto">
          {/* Search Box */}
          <div className="relative group flex-grow w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="Search court name or location..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-[#CCFF00] transition-all text-sm font-medium"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ✅ ส่วนที่เพิ่ม: กลุ่มปุ่มทางขวา */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* ปุ่ม Full Map View */}
            <Link 
              href="/map" 
              className="flex-grow lg:flex-none flex items-center justify-center gap-2 bg-slate-900 text-[#CCFF00] px-6 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#CCFF00] hover:text-slate-900 transition-all shadow-xl border border-slate-800"
            >
              <Navigation size={16} /> Full Map
            </Link>

            {/* ปุ่ม Add Court สีส้มโดดเด่น */}
<Link 
  href="/courts/add" 
  className="flex-grow lg:flex-none flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 active:scale-95 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] border border-orange-400/20"
>
  <Plus size={16} strokeWidth={4} /> Add Court
</Link>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center gap-4 text-slate-300 font-bold uppercase animate-pulse">
            <Loader2 className="animate-spin" size={40} />
            <span className="text-xs tracking-widest text-slate-400">Loading Courts...</span>
          </div>
        ) : (
          <>
            {/* Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedCourts.map((court) => {
                const facilitiesArray = court.facilities ? court.facilities.split(',').map((f: string) => f.trim()) : [];
                const displayFacilities = facilitiesArray.slice(0, 5); 
                
                return (
                  <div key={court.id} className="group flex flex-col h-full bg-white rounded-[2.2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative">
                    
                    {/* Image Section */}
                    <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                      <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-sm">
                        <Shield size={10} className="text-[#CCFF00]" /> {court.court_type || 'Public'}
                      </div>

                      {court.is_featured && (
                        <div className="absolute top-4 right-4 z-20">
                          <span className="bg-[#CCFF00] text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase shadow-lg flex items-center gap-1.5 border border-white/10">
                            <Star size={10} fill="currentColor" /> Recommended
                          </span>
                        </div>
                      )}

                      {court.image_url ? (
                        <img src={court.image_url} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100">🎾</div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <div className="mb-3">
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase flex inline-flex items-center gap-1">
                          <Navigation size={10} className="text-[#84cc16]" /> {court.surface || 'Hard Court'}
                        </span>
                      </div>
                      
                      <h3 className="text-[1.1rem] font-extrabold text-slate-900 leading-snug mb-2 uppercase break-words whitespace-normal">
                        {court.name}
                      </h3>
                      
                      {/* Location & Opening Hours Row */}
                      <div className="flex justify-between items-center mb-5 gap-2">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[13px] font-bold uppercase truncate flex-grow">
                          <MapPin size={14} className="text-[#84cc16] shrink-0" />
                          <span className="truncate">{court.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 text-[13px] font-black uppercase shrink-0">
                          <Clock size={14} className="text-[#84cc16]" />
                          <span>{court.opening_hours || '06:00 - 22:00'}</span>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex flex-wrap gap-2 mb-6 border-t border-slate-50 pt-5">
                        {displayFacilities.map((f: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-100">
                            <div className="text-[#84cc16]">{getFacilityIconSmall(f)}</div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{f}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Link href={`/courts/${court.id}`} className="mt-auto">
                        <div className="w-full text-center bg-slate-900 text-white py-4 rounded-xl font-black text-[12px] group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all uppercase tracking-widest shadow-md">
                          More detail...
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load More Button */}
            {filteredCourts.length > visibleCount && (
              <div className="mt-16 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Load More Courts</span>
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all shadow-sm">
                    <ChevronDown size={20} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-y-0.5 transition-all" />
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function CourtsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest">Loading...</div>}>
      <CourtsContent />
    </Suspense>
  )
}
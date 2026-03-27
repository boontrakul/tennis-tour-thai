'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { ArrowLeft, MapPin, Navigation } from 'lucide-react'

// --- Map Configuration ---
const libraries: any = ['places']
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: false,
}

// ปรับให้เต็มจอหักลบ Navbar และ Bottom Nav (ในมือถือ)
const mapContainerStyle = { 
  width: '100%', 
  height: 'calc(100vh - 80px)', // สำหรับ Desktop (ลบความสูง Navbar)
}

const center = { lat: 13.7563, lng: 100.5018 }

export default function FullMapPage() {
  const [allCourts, setAllCourts] = useState<any[]>([])
  const [selectedCourt, setSelectedCourt] = useState<any>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string || '',
    libraries
  })

  useEffect(() => {
    async function fetchCourts() {
      const { data } = await supabase.from('courts').select('*').eq('status', 'approved')
      if (data) setAllCourts(data)
    }
    fetchCourts()
  }, [])

  if (!isLoaded) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 font-black uppercase text-slate-400 animate-pulse">
      Loading Tennis Map...
    </div>
  )

  return (
    <main className="relative min-h-screen bg-white pt-20">
      
      {/* 1. แถบหัวข้อด้านบนแผนที่ (Floating Header) */}
      <div className="absolute top-24 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <Link 
          href="/" 
          className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-900 hover:bg-[#CCFF00] transition-all"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        
        <div className="bg-slate-900/90 backdrop-blur-md text-[#CCFF00] px-5 py-2.5 rounded-2xl shadow-xl text-[11px] font-black uppercase tracking-[0.2em] border border-white/10 hidden md:block">
          Tennis Court Directory
        </div>
      </div>

      {/* 2. ตัวแผนที่เต็มจอ */}
      <div className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={12}
          center={center}
          options={mapOptions}
          mapTypeId="hybrid" // ✅ บังคับเป็นโหมดดาวเทียม + เส้นถนน
        >
          {allCourts.map((court) => court.latitude && (
            <MarkerF 
              key={court.id} 
              position={{ lat: Number(court.latitude), lng: Number(court.longitude) }} 
              onClick={() => setSelectedCourt(court)}
              // สามารถเปลี่ยน Icon เป็นรูปลูกเทนนิสได้ที่นี่
            />
          ))}

          {selectedCourt && (
            <InfoWindowF 
              position={{ lat: Number(selectedCourt.latitude), lng: Number(selectedCourt.longitude) }} 
              onCloseClick={() => setSelectedCourt(null)}
            >
              <div className="p-1 max-w-[220px] font-sans">
                {selectedCourt.image_url && (
                  <img src={selectedCourt.image_url} className="w-full h-24 object-cover rounded-xl mb-3" alt={selectedCourt.name} />
                )}
                <h4 className="font-black text-slate-900 text-sm uppercase mb-1 leading-tight">
                  {selectedCourt.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-3 flex items-center gap-1">
                  <MapPin size={10} /> {selectedCourt.location}
                </p>
                <div className="flex gap-2">
                    <Link 
                      href={`/courts/${selectedCourt.id}`} 
                      className="flex-grow bg-slate-900 text-[#CCFF00] text-center py-2 rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      Details
                    </Link>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.latitude},${selectedCourt.longitude}`}
                      target="_blank"
                      className="bg-[#CCFF00] text-slate-900 p-2 rounded-lg"
                    >
                      <Navigation size={14} />
                    </a>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>

      {/* 3. ปุ่มกดขอตำแหน่งปัจจุบัน (Floating Action Button) */}
      <button 
        onClick={() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    // Logic สำหรับเลื่อนแผนที่ไปที่ตำแหน่งปัจจุบัน
                });
            }
        }}
        className="absolute bottom-28 right-4 md:bottom-10 md:right-10 z-20 bg-white p-4 rounded-full shadow-2xl border border-slate-100 text-slate-900 hover:bg-[#CCFF00] transition-all"
      >
        <Navigation size={24} />
      </button>

    </main>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, MapPin, DollarSign, Phone, Tag, Clock, 
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead,
  CheckCircle2, Shield, ExternalLink, MessageSquare, Send, UserCircle, X
} from 'lucide-react'

const getFacilityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('parking')) return <Car size={24} />;
  if (n.includes('restaurant')) return <Utensils size={24} />;
  if (n.includes('shop')) return <Store size={24} />;
  if (n.includes('coach')) return <GraduationCap size={24} />;
  if (n.includes('changing')) return <PersonStanding size={24} />;
  if (n.includes('locker')) return <Lock size={24} />;
  if (n.includes('pool')) return <Waves size={24} />;
  if (n.includes('wifi')) return <Wifi size={24} />;
  if (n.includes('shower')) return <ShowerHead size={24} />;
  return <CheckCircle2 size={24} />;
};

export default function CourtDetailPage() {
  const params = useParams() as { id: string }; 
  const [court, setCourt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('courts').select('*').eq('id', params.id).single()
      if (data) setCourt(data)
      setLoading(false)
    }
    fetchData()
  }, [params])

  if (loading || !court) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse">LOADING...</div>

  let gallery = Array.isArray(court.images) ? [...court.images] : [];
  if (court.image_url && !gallery.includes(court.image_url)) gallery.unshift(court.image_url);
  const facilities = court.facilities ? court.facilities.split(',').map((f: string) => f.trim()) : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-32 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/courts" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase text-xs mb-8 hover:text-[#84cc16] transition-colors"><ArrowLeft size={16} /> Back to Courts</Link>

        {/* --- Photo Slider --- */}
        <div className="mb-12">
          <div className="relative w-full aspect-[16/9] md:h-[500px] bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-4">
            <img src={gallery[activeImgIdx]} className="w-full h-full object-cover animate-in fade-in duration-500" alt={court.name} />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImgIdx(i)} className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-2xl overflow-hidden border-4 transition-all ${activeImgIdx === i ? 'border-[#CCFF00] scale-105' : 'border-transparent opacity-60'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic mb-4">{court.name}</h1>
              <p className="flex items-center gap-2 text-slate-500 font-bold mb-6 uppercase tracking-widest text-xs"><MapPin size={16} className="text-[#84cc16]" /> {court.location}</p>
              <div className="text-slate-600 leading-relaxed font-medium">{court.description || "No description provided."}</div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-8 flex items-center gap-3"><Tag className="text-[#CCFF00]" /> Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {facilities.map((f: string, i: number) => (
                  <div key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#CCFF00] transition-all group">
                    <div className="text-[#84cc16] mb-3 group-hover:scale-110 transition-transform">{getFacilityIcon(f)}</div>
                    <span className="text-[10px] font-black text-slate-800 uppercase text-center tracking-widest leading-tight">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-xl text-white">
              <h3 className="text-[#CCFF00] font-black uppercase italic tracking-widest mb-8 text-xl">Court Info</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Clock className="text-[#CCFF00]" />
                  <div><p className="text-[10px] text-slate-400 uppercase font-black">Opening Hours</p><p className="font-bold">{court.opening_hours || '06:00 - 22:00'}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <DollarSign className="text-[#CCFF00]" />
                  <div><p className="text-[10px] text-slate-400 uppercase font-black">Rate / Hour</p><p className="font-bold">฿ {court.price_per_hour || 'N/A'}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-[#CCFF00]" />
                  <div><p className="text-[10px] text-slate-400 uppercase font-black">Contact</p><p className="font-bold">{court.phone || 'N/A'}</p></div>
                </div>
              </div>
              {court.map_url && (
                <a href={court.map_url} target="_blank" className="mt-10 w-full bg-[#CCFF00] text-slate-900 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg">
                  <MapPin size={16} /> Open in Maps <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
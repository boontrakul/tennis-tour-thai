'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import { Search, ArrowRight, Star, ChevronRight, MessageSquare, BookOpen, MapPin, Navigation } from 'lucide-react'

const mapOptions = {
  styles: [{ "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }],
  disableDefaultUI: true,
}

const mapContainerStyle = { width: '100%', height: '400px', borderRadius: '1.5rem' }
const center = { lat: 13.7563, lng: 100.5018 }

export default function HomePage() {
  const [courts, setCourts] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [forumPosts, setForumPosts] = useState<any[]>([])
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  useEffect(() => {
    async function fetchData() {
      const { data: c } = await supabase.from('courts').select('*').eq('status', 'approved').limit(6)
      const { data: a } = await supabase.from('articles').select('*').limit(3)
      const { data: f } = await supabase.from('forum_posts').select('*').limit(4)
      if (c) setCourts(c); if (a) setArticles(a); if (f) setForumPosts(f);
    }
    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* 1. HERO SECTION - ปรับขนาดพาดหัวให้ดูแพงขึ้น */}
      <section className="pt-32 pb-16 bg-[#1a2b41] text-center px-4">
        <h1 className="text-white font-black uppercase tracking-tighter mb-6 leading-tight">
          Find the Perfect <br />
          <span className="text-[#CCFF00]">Tennis Court for You</span>
        </h1>
        <div className="max-w-md mx-auto bg-white p-1.5 rounded-xl flex shadow-xl">
           <input type="text" placeholder="Search courts..." className="flex-grow px-4 outline-none text-sm font-bold" />
           <button className="bg-[#CCFF00] px-6 py-2 rounded-lg font-black text-[10px] uppercase">Search</button>
        </div>
      </section>

      {/* 2. MAP - ลดระยะห่างและขนาดหัวข้อ */}
      <section className="py-12 container mx-auto px-4 max-w-6xl">
        <h2 className="font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#84cc16] rounded-full"></span> Explore Map
        </h2>
        <div className="border-4 border-slate-50 shadow-lg rounded-[2rem] overflow-hidden">
          {isLoaded && <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center} options={mapOptions} />}
        </div>
      </section>

      {/* 3. RECOMMENDED - แก้จุดที่วงกลมไว้ให้เล็กลง (text-lg) */}
      <section className="py-12 container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-black text-slate-900 uppercase tracking-tight">Recommended</h2>
          <Link href="/courts" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#84cc16]">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Link href={`/courts/${court.id}`} key={court.id} className="group border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
              <img src={court.image_url} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-1 uppercase group-hover:text-[#84cc16] transition-colors">
                  {court.name}
                </h3>
                <p className="text-slate-400 text-[10px] font-medium uppercase">{court.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ARTICLES & WEBBOARD - ปรับขนาดหัวข้อรอง */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-black text-slate-900 uppercase tracking-tight mb-6">Latest Articles</h2>
            <div className="space-y-4">
              {articles.map(art => (
                <Link href={`/articles/${art.id}`} key={art.id} className="flex gap-4 p-3 bg-white rounded-xl border border-slate-100 hover:border-[#CCFF00] transition-all">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={art.image_url} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{art.title}</h4>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-black text-slate-900 uppercase tracking-tight mb-6">Webboard</h2>
            <div className="space-y-3">
              {forumPosts.map(post => (
                <Link href={`/forum/${post.id}`} key={post.id} className="block p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-all">
                  <h4 className="text-sm font-bold text-slate-800 leading-tight uppercase">{post.title}</h4>
                  <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">by {post.author_name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
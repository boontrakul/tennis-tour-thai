'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Search, MapPin, Star, Shield, ChevronRight, 
  BookOpen, MessageSquare, TrendingUp, Clock, ArrowRight 
} from 'lucide-react'
// ✅ ถ้าคุณใช้ Google Map อย่าลืม import ตัวเดิมของคุณมาด้วยนะครับ
// import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'

export default function HomePage() {
  const [featuredCourts, setFeaturedCourts] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHomeData() {
      // ✅ ใช้ Logic เดิมที่คุณเคยเขียนดึงข้อมูลได้เลยครับ
      const { data: courts } = await supabase.from('courts').select('*').limit(6)
      const { data: arts } = await supabase.from('articles').select('*').limit(3)
      const { data: tops } = await supabase.from('topics').select('*').limit(4)

      if (courts) setFeaturedCourts(courts)
      if (arts) setArticles(arts)
      if (tops) setTopics(tops)
      setLoading(false)
    }
    fetchHomeData()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      
      {/* 1. ส่วนของแผนที่ (เอาโค้ดเดิมมาใส่ตรงนี้ได้เลย) */}
      <section className="bg-white py-10 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-black uppercase italic mb-6">Tennis Map</h2>
          <div className="h-[400px] bg-slate-200 rounded-[2.5rem] flex items-center justify-center">
             {/* 🚩 ก๊อปปี้ <GoogleMap> ชุดเดิมของคุณมาวางตรงนี้ครับ */}
             <p className="font-bold text-slate-400">Map Area (ใช้โค้ดเดิมของคุณวางได้เลย)</p>
          </div>
        </div>
      </section>

      {/* 2. ส่วนของสนามแนะนำ (ใช้ Loop เดิม) */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-black uppercase italic mb-10 flex items-center gap-2">
            <Star className="text-[#CCFF00]" fill="currentColor" /> Recommended
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourts.map((court) => (
              <Link href={`/courts/${court.id}`} key={court.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <img src={court.image_url} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 uppercase">{court.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{court.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ส่วนของ Article & Webboard (ใช้ Logic เดิม) */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Articles */}
          <div>
            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2"><BookOpen /> Articles</h3>
            <div className="space-y-4">
              {articles.map(art => (
                <Link href={`/articles/${art.id}`} key={art.id} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                    <img src={art.image_url} className="w-full h-full object-cover" />
                  </div>
                  <h5 className="font-bold text-sm leading-tight">{art.title}</h5>
                </Link>
              ))}
            </div>
          </div>

          {/* Webboard */}
          <div>
            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2"><MessageSquare /> Webboard</h3>
            <div className="bg-slate-50 rounded-[2rem] overflow-hidden">
              {topics.map(topic => (
                <div key={topic.id} className="p-5 border-b border-white flex justify-between items-center">
                  <span className="font-bold text-sm">{topic.title}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
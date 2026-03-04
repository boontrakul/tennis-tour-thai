'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function CourtsGrid() {
  const [courts, setCourts] = useState<any[]>([])
  const [filteredCourts, setFilteredCourts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const surfaceTypes = ['All', 'Hard Court', 'Clay Court', 'Grass Court']

  useEffect(() => {
    async function fetchCourts() {
      try {
        const { data, error } = await supabase
          .from('courts')
          .select('*')
          .order('id', { ascending: true })

        if (error) throw error
        if (data) {
          setCourts(data)
          setFilteredCourts(data)
        }
      } catch (err) {
        console.error('Error fetching courts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourts()
  }, [])

  useEffect(() => {
    let result = courts
    if (activeFilter !== 'All') {
      result = result.filter(court => court.surface === activeFilter)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(court => 
        court.name?.toLowerCase().includes(query) || 
        court.location?.toLowerCase().includes(query)
      )
    }
    setFilteredCourts(result)
  }, [searchQuery, activeFilter, courts])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading directory...</div>

  const displayedCourts = isHomePage ? filteredCourts.slice(0, 6) : filteredCourts

  const getFilterStyle = (type: string) => {
    if (activeFilter !== type) return "bg-gray-100 text-gray-600 hover:bg-gray-200"
    switch(type) {
      case 'Hard Court': return "bg-blue-600 text-white shadow-lg"
      case 'Clay Court': return "bg-orange-600 text-white shadow-lg"
      case 'Grass Court': return "bg-green-600 text-white shadow-lg"
      default: return "bg-black text-white shadow-lg"
    }
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* --- Search & Filter --- */}
        <div className="mb-12 space-y-6">
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search court name or location..."
              className="w-full p-4 pl-12 rounded-2xl border border-gray-200 focus:border-green-500 outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40">🔍</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {surfaceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${getFilterStyle(type)}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* --- Grid --- */}
        {filteredCourts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourts.map((court) => (
              <Link href={`/courts/${court.id}`} key={court.id} className="group">
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative h-60 w-full">
                    <Image 
                      src={court.image_url || 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0'} 
                      alt={court.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-black uppercase text-gray-800">
                      {court.surface}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">{court.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">📍 {court.location}</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                      <span className="text-green-600 font-black text-lg">฿{court.price_per_hour}/hr</span>
                      <span className="text-sm font-bold text-gray-900">Details →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
            <p className="text-gray-400 font-medium">No results found.</p>
          </div>
        )}

        {/* --- ปุ่มไปหน้า All Courts (โชว์เฉพาะหน้า Home) --- */}
        {isHomePage && (
          <div className="mt-16 text-center border-t pt-12">
            <Link 
              href="/courts" 
              className="inline-flex items-center justify-center bg-black text-white px-12 py-4 rounded-full font-bold hover:bg-green-600 transition-all shadow-xl text-lg"
            >
              Explore All {courts.length} Courts
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
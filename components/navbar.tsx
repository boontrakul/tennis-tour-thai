'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
// ✅ เพิ่ม Icon 'X' เข้ามาสำหรับปุ่มปิด
import { Home, MapPin, FileText, MessageSquare, User, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // ✅ State สำหรับเมนูมือถือ
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setUser(null)
    setIsMobileMenuOpen(false) // ปิดเมนูเมื่อ Sign out
  }

  // ฟังก์ชันปิดเมนูเมื่อกดลิ้งค์ (UX ที่ดี)
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg border-b border-slate-100 px-4 md:px-6 py-4 shadow-sm transition-all">
      <div className="container mx-auto flex justify-between items-center relative">
        
        {/* --- LEFT: LOGO --- */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-all duration-300">
            <span className="text-sm md:text-xl leading-none pt-0.5">🎾</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-black text-sm md:text-2xl italic uppercase tracking-tighter text-slate-900 leading-none">
              Tennis Tour Thai
            </span>
            <span className="hidden md:block text-[10px] text-slate-400 font-bold tracking-widest -mt-1">
              (เทนนิสทั่วไทย)
            </span>
          </div>
        </Link>

        {/* --- CENTER: DESKTOP MENU --- */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          <Link href="/" className={`flex items-center gap-2 text-[12px] xl:text-[13px] font-black uppercase tracking-[0.1em] transition-all hover:scale-105 ${pathname === '/' ? 'text-[#84cc16]' : 'text-slate-400 hover:text-slate-900'}`}>
            <Home size={18} strokeWidth={2.5} /> Home
          </Link>
          <Link href="/courts" className={`flex items-center gap-2 text-[12px] xl:text-[13px] font-black uppercase tracking-[0.1em] transition-all hover:scale-105 ${pathname.startsWith('/courts') ? 'text-[#84cc16]' : 'text-slate-400 hover:text-slate-900'}`}>
            <MapPin size={18} strokeWidth={2.5} /> Courts
          </Link>
          <Link href="/articles" className={`flex items-center gap-2 text-[12px] xl:text-[13px] font-black uppercase tracking-[0.1em] transition-all hover:scale-105 ${pathname.startsWith('/articles') ? 'text-[#84cc16]' : 'text-slate-400 hover:text-slate-900'}`}>
            <FileText size={18} strokeWidth={2.5} /> Articles
          </Link>
          <Link href="/forum" className={`flex items-center gap-2 text-[12px] xl:text-[13px] font-black uppercase tracking-[0.1em] transition-all hover:scale-105 ${pathname.startsWith('/forum') ? 'text-[#84cc16]' : 'text-slate-400 hover:text-slate-900'}`}>
            <MessageSquare size={18} strokeWidth={2.5} /> Forum
          </Link>
        </div>

        {/* --- RIGHT: AUTH & HAMBURGER --- */}
        <div className="flex items-center gap-3 md:gap-8">
          {user ? (
            <div className="flex items-center gap-2 md:gap-6">
              <div className="hidden md:flex items-center gap-2 text-[12px] font-black text-slate-600 uppercase italic bg-slate-100 px-4 py-1.5 rounded-full shadow-inner">
                <User size={14} strokeWidth={3} /> {user.email?.split('@')[0]}
              </div>
              <button onClick={handleSignOut} className="flex items-center gap-1.5 text-[10px] md:text-[12px] font-black text-red-500 uppercase hover:text-red-700 transition-colors bg-red-50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full md:rounded-none">
                <LogOut size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Sign Out</span><span className="md:hidden">Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-6">
              <Link href="/signin" className="hidden md:block text-[12px] xl:text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
                Sign In
              </Link>
              <Link href="/signup" className="bg-[#CCFF00] text-slate-900 px-4 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-[13px] font-black uppercase shadow-lg shadow-[#CCFF00]/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                Join Tour
              </Link>
            </div>
          )}

          {/* ✅ ปุ่ม Hamburger (ทำงานจริงแล้ว) */}
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ MOBILE MENU OVERLAY (ส่วนที่เพิ่มมาใหม่) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={closeMenu} className={`flex items-center gap-3 p-3 rounded-xl font-black uppercase tracking-widest transition-colors ${pathname === '/' ? 'bg-[#CCFF00]/20 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Home size={20} /> Home
          </Link>
          <Link href="/courts" onClick={closeMenu} className={`flex items-center gap-3 p-3 rounded-xl font-black uppercase tracking-widest transition-colors ${pathname.startsWith('/courts') ? 'bg-[#CCFF00]/20 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
            <MapPin size={20} /> Courts
          </Link>
          <Link href="/articles" onClick={closeMenu} className={`flex items-center gap-3 p-3 rounded-xl font-black uppercase tracking-widest transition-colors ${pathname.startsWith('/articles') ? 'bg-[#CCFF00]/20 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
            <FileText size={20} /> Articles
          </Link>
          <Link href="/forum" onClick={closeMenu} className={`flex items-center gap-3 p-3 rounded-xl font-black uppercase tracking-widest transition-colors ${pathname.startsWith('/forum') ? 'bg-[#CCFF00]/20 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
            <MessageSquare size={20} /> Forum
          </Link>
          
          {/* ปุ่ม Sign In สำหรับ Mobile (เพราะข้างบนเราซ่อนไว้) */}
          {!user && (
            <Link href="/signin" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 mt-2 border-t border-slate-100">
              <User size={20} /> Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
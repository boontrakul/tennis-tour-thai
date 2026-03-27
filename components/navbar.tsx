'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, MapPin, FileText, MessageSquare, User, LogOut, UserCircle } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
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
  }

  // รายการเมนูสำหรับใช้ทั้ง Desktop และ Mobile
  const navLinks = [
    { name: 'HOME', href: '/', icon: <Home size={20} strokeWidth={2.5} /> },
    { name: 'COURTS', href: '/courts', icon: <MapPin size={20} strokeWidth={2.5} /> },
    { name: 'ARTICLES', href: '/articles', icon: <FileText size={20} strokeWidth={2.5} /> },
    { name: 'FORUM', href: '/forum', icon: <MessageSquare size={20} strokeWidth={2.5} /> },
  ]

  return (
    <>
      {/* --- TOP NAVBAR (แสดงผลทั้ง Desktop และ Mobile แต่ซ่อนเมนูใน Mobile) --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all overflow-hidden">
                <img src="https://img5.pic.in.th/file/secure-sv1/tennis-ball-logo.png" className="w-6 h-6 md:w-7 md:h-7 object-contain" alt="logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg md:text-2xl italic uppercase tracking-tighter text-slate-900 leading-none">
                Tennis Tour Thai
              </span>
              <span className="hidden md:block text-[10px] text-slate-400 font-bold tracking-widest -mt-1 uppercase">
                Thailand Community
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (ซ่อนใน Mobile เพราะเรามีแถบล่าง) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[12px] font-black uppercase tracking-widest transition-all hover:scale-105 ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'text-[#84cc16]' 
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section (Desktop) / Join Button (Mobile) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:flex items-center gap-2 text-[11px] font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full">
                  <User size={14} strokeWidth={3} /> {user.email?.split('@')[0].toUpperCase()}
                </div>
                <button onClick={handleSignOut} className="flex items-center gap-1.5 text-[11px] font-black text-red-500 uppercase hover:text-red-700">
                  <LogOut size={16} /> <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 md:gap-6">
                <Link href="/signin" className="hidden md:block text-[12px] font-black uppercase text-slate-400 hover:text-slate-900">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-[#CCFF00] text-slate-900 px-5 py-2.5 md:px-8 md:py-3 rounded-full text-[11px] md:text-[13px] font-black uppercase shadow-lg shadow-[#CCFF00]/20 hover:scale-105 transition-all">
                  Join Tour
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ BOTTOM NAVIGATION (แสดงผลเฉพาะใน Mobile ตลอดเวลาที่ด้านล่างจอ) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-100 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex flex-col items-center gap-1 w-full transition-all ${
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-[#84cc16]' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) 
                ? 'bg-[#CCFF00]/20' 
                : ''
              }`}>
                {link.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {link.name === 'HOME' ? 'Home' : link.name.charAt(0) + link.name.slice(1).toLowerCase()}
              </span>
            </Link>
          ))}
          
          {/* ปุ่ม Profile/Me สำหรับ Mobile */}
          <Link href={user ? "/profile" : "/signin"} className={`flex flex-col items-center gap-1 w-full ${pathname === '/profile' || pathname === '/signin' ? 'text-[#84cc16]' : 'text-slate-400'}`}>
            <div className={`p-1.5 rounded-xl ${pathname === '/profile' || pathname === '/signin' ? 'bg-[#CCFF00]/20' : ''}`}>
              <UserCircle size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Me</span>
          </Link>
        </div>
      </div>
    </>
  )
}
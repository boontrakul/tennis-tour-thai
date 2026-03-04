'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* 1. Brand & Description */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg leading-none pt-0.5">🎾</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                <span className="text-[#CCFF00]">Tennis</span> Tour Thai
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Thailand's #1 community for tennis lovers. Find courts, read expert advice, and meet new hitting partners.
            </p>
          </div>

          {/* 2. Explore */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wider italic">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/courts" className="text-slate-400 hover:text-[#CCFF00] transition-colors text-xs font-medium">Find Courts</Link></li>
              <li><Link href="/articles" className="text-slate-400 hover:text-[#CCFF00] transition-colors text-xs font-medium">Expert Articles</Link></li>
              <li><Link href="/forum" className="text-slate-400 hover:text-[#CCFF00] transition-colors text-xs font-medium">Player Forum</Link></li>
            </ul>
          </div>

          {/* 3. Categories */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wider italic">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-slate-400 hover:text-[#CCFF00] transition-colors text-xs font-medium">Training Tips</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#CCFF00] transition-colors text-xs font-medium">Gear Reviews</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#CCFF00] transition-colors text-xs font-medium">Find Partners</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wider italic">Contact Us</h4>
            <div className="space-y-2">
              
              {/* Phone */}
              <div className="flex items-center gap-2 text-slate-400 text-xs group">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center group-hover:bg-[#CCFF00]/20 transition-all">
                  <Phone size={14} className="text-[#CCFF00]" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">+66 86 650 6659</span>
              </div>

              {/* Line & WhatsApp */}
              <div className="flex items-center gap-2 text-slate-400 text-xs group">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center group-hover:bg-[#CCFF00]/20 transition-all">
                  <MessageCircle size={14} className="text-[#CCFF00]" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">
                  Line & WhatsApp: +66 86 650 6659
                </span>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-2 text-slate-400 text-xs group">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center group-hover:bg-[#CCFF00]/20 transition-all">
                  <Mail size={14} className="text-[#CCFF00]" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">boontrakul@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © 2026 TENNIS TOUR THAI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
import Link from 'next/link'
import { Phone, Mail, MessageSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900 w-full">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* Main Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Section 1: Logo & Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#CCFF00] flex items-center justify-center text-slate-900 text-lg font-black">
                🎾
              </div>
              <span className="text-white text-lg font-black uppercase tracking-tight">
                Tennis <span className="text-[#CCFF00]">Tour Thai</span>
              </span>
            </Link>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm uppercase">
              Thailand's #1 community for tennis lovers. Find courts, read expert advice, and meet new hitting partners.
            </p>
          </div>

          {/* Section 2: Explore Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em]">Explore</h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase">
              <li>
                <Link href="/courts" className="hover:text-[#CCFF00] transition-colors">Find Courts</Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-[#CCFF00] transition-colors">Full Map View</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-[#CCFF00] transition-colors">Expert Insights</Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-[#CCFF00] transition-colors">Community Forum</Link>
              </li>
              {/* ✅ เพิ่มเมนู Our Story เข้ามาตรงนี้ครับ */}
              <li>
                <Link href="/about" className="hover:text-[#CCFF00] transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/courts/add" className="text-orange-400 hover:text-orange-300 transition-colors">Add New Court</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Us */}
          <div className="md:col-span-4 space-y-4 w-full">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em]">Contact Us</h4>
            
            <div className="bg-slate-900/40 border border-slate-900 rounded-[1.5rem] p-5 space-y-3.5 shadow-inner">
              <a 
                href="tel:+66866506659" 
                className="flex items-center gap-3.5 text-xs font-black text-slate-300 hover:text-[#CCFF00] transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all flex-shrink-0">
                  <Phone size={13} />
                </div>
                <span>+66 86 650 6659</span>
              </a>

              <a 
                href="https://line.me" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3.5 text-xs font-black text-slate-300 hover:text-[#CCFF00] transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all flex-shrink-0">
                  <MessageSquare size={13} />
                </div>
                <span>Line & WhatsApp</span>
              </a>

              <a 
                href="mailto:boontrakul@gmail.com" 
                className="flex items-center gap-3.5 text-xs font-black text-slate-300 hover:text-[#CCFF00] transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-[#CCFF00] group-hover:text-slate-900 transition-all flex-shrink-0">
                  <Mail size={13} />
                </div>
                <span className="truncate">boontrakul@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          <div>
            © {new Date().getFullYear()} TENNIS TOUR THAI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
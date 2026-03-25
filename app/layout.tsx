import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Target, MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookit TENNIS | ค้นหาและจองสนามเทนนิสทั่วไทย",
  description: "แพลตฟอร์มจองสนามเทนนิสออนไลน์ที่ดีที่สุด พร้อมแผนที่และสิ่งอำนวยความสะดวกครบครัน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        
        {/* --- 1. NAVBAR (HEADER) --- */}
        <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-[#84cc16] transition-colors">
                <Target size={24} className="text-[#CCFF00] group-hover:text-slate-900" />
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter">
                B<span className="text-[#84cc16]">oo</span>kit <span className="text-[#84cc16]">TENNIS</span>
              </span>
            </Link>

            {/* Menus */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/courts" className="text-xs font-black uppercase tracking-widest hover:text-[#84cc16] transition-colors">Courts</Link>
              <Link href="/articles" className="text-xs font-black uppercase tracking-widest hover:text-[#84cc16] transition-colors">Articles</Link>
              <Link href="/forum" className="text-xs font-black uppercase tracking-widest hover:text-[#84cc16] transition-colors">Webboard</Link>
              <Link href="/about" className="text-xs font-black uppercase tracking-widest hover:text-[#84cc16] transition-colors">About</Link>
            </div>

            {/* Auth / Profile */}
            <div className="flex items-center gap-4">
              <Link href="/courts/add" className="hidden sm:block bg-slate-100 text-slate-900 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#CCFF00] transition-all">
                Add Court
              </Link>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[#CCFF00] font-black text-xs border-2 border-white shadow-lg">
                PS
              </div>
            </div>
          </div>
        </nav>

        {/* --- 2. MAIN CONTENT (Each page will render here) --- */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* --- 3. FOOTER --- */}
        <footer className="bg-slate-900 text-white pt-20 pb-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              
              {/* Brand Info */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <Target size={24} className="text-[#CCFF00]" />
                  <span className="text-xl font-black uppercase italic tracking-tighter">Bookit TENNIS</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  แพลตฟอร์มจองสนามเทนนิสที่ทันสมัยที่สุด รวบรวมสนามคุณภาพทั่วประเทศไทย พร้อมข้อมูลที่ครบถ้วนที่สุด
                </p>
                <div className="flex gap-4">
                  <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#CCFF00] hover:text-slate-900 transition-all"><Facebook size={18} /></Link>
                  <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#CCFF00] hover:text-slate-900 transition-all"><Instagram size={18} /></Link>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-black uppercase tracking-widest text-[#CCFF00] mb-6 text-sm">Quick Links</h4>
                <ul className="space-y-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <li><Link href="/courts" className="hover:text-white">Find a Court</Link></li>
                  <li><Link href="/articles" className="hover:text-white">Read Articles</Link></li>
                  <li><Link href="/forum" className="hover:text-white">Join Webboard</Link></li>
                  <li><Link href="/courts/add" className="hover:text-white">Partner with us</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-black uppercase tracking-widest text-[#CCFF00] mb-6 text-sm">Contact</h4>
                <ul className="space-y-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <li className="flex items-center gap-3"><MapPin size={16} className="text-[#84cc16]" /> Bangkok, Thailand</li>
                  <li className="flex items-center gap-3"><Phone size={16} className="text-[#84cc16]" /> +66 2 123 4567</li>
                  <li className="flex items-center gap-3"><Mail size={16} className="text-[#84cc16]" /> hello@bookit-tennis.com</li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="font-black uppercase tracking-widest text-[#CCFF00] mb-6 text-sm">Stay Updated</h4>
                <div className="relative">
                  <input type="email" placeholder="Your email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#CCFF00] text-sm transition-all" />
                  <button className="absolute right-2 top-2 bg-[#CCFF00] text-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Join</button>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <p>© 2026 Bookit TENNIS. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <Link href="#" className="hover:text-white">Privacy Policy</Link>
                <Link href="#" className="hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
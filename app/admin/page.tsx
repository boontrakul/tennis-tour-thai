'use client'
import Link from 'next/link'
import { FileText, Plus, Shield } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 pt-32 pb-20 text-white font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-[#CCFF00] px-4 py-1.5 rounded-full w-fit mb-6">
          <Shield size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Master Admin</span>
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tight mb-12">Tennis Tour Thai <span className="text-[#CCFF00]">Backoffice</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* เมนูจัดการบทความ */}
          <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex flex-col justify-between gap-6">
            <div>
              <FileText size={32} className="text-[#ff6b00] mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-tight mb-2">Article Management</h3>
              <p className="text-slate-400 text-xs">จัดการบทความ ข่าวสาร และรีวิวอุปกรณ์เทนนิสทั้งหมดบนเว็บไซต์</p>
            </div>
            <Link href="/articles/add" className="w-fit bg-[#ff6b00] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-white hover:text-slate-950 transition-all">
              <Plus size={14} strokeWidth={3} /> Add New Article
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
import Link from 'next/link'
import { Map, Users, BookOpen, HeartHandshake, ArrowRight, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Our Story | Tennis Tour Thai',
  description: "Thailand's Ultimate Tennis Community Hub",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-4 max-w-5xl mb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-900 text-[#CCFF00] px-4 py-1.5 rounded-full mb-6 shadow-md">
           <HeartHandshake size={14} className="text-[#CCFF00]" />
           <span className="text-[10px] font-black uppercase tracking-widest">Our Story</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight mb-4 text-slate-900">
          Thailand's Ultimate <br className="hidden md:block" />
          <span className="text-[#84cc16]">Tennis Community Hub</span>
        </h1>
        <p className="text-slate-500 font-bold text-sm md:text-base max-w-2xl mx-auto uppercase tracking-wider">
          ศูนย์รวมคอมมูนิตี้เทนนิสที่ครบที่สุดของไทย
        </p>
      </section>

      {/* 2. CONTENT SECTIONS (Bilingual Grid) */}
      <section className="container mx-auto px-4 max-w-5xl space-y-8">
        
        {/* Block 1: The Interactive Map */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-10 items-center hover:-translate-y-1 transition-transform duration-500">
          <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-full flex items-center justify-center border-2 border-slate-100">
            <Map size={32} className="text-[#84cc16]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div>
              <h3 className="text-lg font-black uppercase text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span> The Interactive Map
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                <strong>Tennis Tour Thai</strong> was born from the classic player's dilemma: <em>'Where should we play today?'</em> To solve this, we created our unique Interactive Court Map—a comprehensive directory that pins tennis courts across Thailand. Finding your nearest court has never been easier.
              </p>
            </div>
            <div className="border-t-2 md:border-t-0 md:border-l-2 border-slate-50 pt-6 md:pt-0 md:pl-8">
              <h3 className="text-sm font-black uppercase text-slate-400 mb-3">จุดเด่นของเรา</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-bold">
                เราเริ่มต้นจากคำถามคลาสสิกที่ว่า <em>'วันนี้จะไปตีสนามไหนดี?'</em> เราจึงสร้างจุดเด่นที่ไม่เหมือนใครด้วยระบบ <strong>แผนที่ปักหมุดสนามเทนนิสทั่วไทย</strong> ให้คุณค้นหาสนามใกล้ตัว เช็กรายละเอียด และเดินทางไปตีเทนนิสได้ง่ายที่สุดเพียงแค่ปลายนิ้ว
              </p>
            </div>
          </div>
        </div>

        {/* Block 2: Community Driven */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-center relative overflow-hidden hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00]/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="w-20 h-20 shrink-0 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 relative z-10">
            <Users size={32} className="text-[#CCFF00]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10">
            <div>
              <h3 className="text-lg font-black uppercase text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00]"></span> Community Driven
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                This platform isn't complete without <strong>'YOU'</strong>. This is a 100% community-driven space. We invite everyone to help shape this home for tennis lovers. Whether it's adding a hidden local court or finding a hitting partner... <strong>Let's build the strongest community together!</strong>
              </p>
            </div>
            <div className="border-t-2 md:border-t-0 md:border-l-2 border-slate-800 pt-6 md:pt-0 md:pl-8">
              <h3 className="text-sm font-black uppercase text-[#CCFF00] mb-3">พื้นที่ของพวกเรา</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-bold">
                แพลตฟอร์มนี้จะสมบูรณ์ไม่ได้เลย หากขาด <strong>'พวกเราทุกคน'</strong> เว็บไซต์นี้ขับเคลื่อนด้วยคอมมูนิตี้ เราชวนทุกคนมาช่วยกันปั้นที่นี่ให้เป็นบ้านของคนรักเทนนิส มาช่วยกันเพิ่มพิกัดสนามลับๆ รีวิวโค้ช หรือหาเพื่อนตี... <strong>มาสร้างสังคมเทนนิสที่แข็งแกร่งไปด้วยกันครับ!</strong>
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 3. CORE FEATURES */}
      <section className="container mx-auto px-4 max-w-5xl mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">What You Can Do Here</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">สิ่งที่คุณทำได้บนเว็บไซต์นี้</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <MapPin size={24} />, titleEN: "Explore Map", titleTH: "ค้นหาสนามเทนนิส", desc: "Find and contribute tennis courts nationwide." },
            { icon: <Users size={24} />, titleEN: "Community Forum", titleTH: "คอมมูนิตี้คนรักเทนนิส", desc: "Connect, find partners, and trade gear." },
            { icon: <BookOpen size={24} />, titleEN: "Expert Articles", titleTH: "คลังความรู้ & รีวิว", desc: "Discover insights, tips, and in-depth reviews." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center flex flex-col items-center hover:border-[#84cc16] transition-colors">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6">
                {feature.icon}
              </div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight">{feature.titleEN}</h4>
              <p className="text-[10px] font-bold text-[#84cc16] uppercase tracking-widest mt-1 mb-4">{feature.titleTH}</p>
              <p className="text-sm font-medium text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="container mx-auto px-4 max-w-3xl mt-20 text-center">
        <div className="bg-[#CCFF00] rounded-[3rem] p-12 shadow-2xl flex flex-col items-center">
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Ready to hit the court?</h2>
          <p className="text-slate-800 font-bold mb-8">มาร่วมเป็นส่วนหนึ่งของการปักหมุดสนามเทนนิสทั่วประเทศไทยกันครับ</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/courts/add" className="bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Add a Court <ArrowRight size={16} />
            </Link>
            <Link href="/forum" className="bg-white text-slate-900 px-8 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Join Forum
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
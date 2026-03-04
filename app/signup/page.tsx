'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      alert('Check your email for the confirmation link!')
      router.push('/signin')
    }
  }

  return (
    <main className="min-h-screen bg-white relative font-sans overflow-hidden">
      
      {/* --- BACKGROUND: ธีมสีน้ำเงินเข้มไล่เฉดแบบหน้า Home --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#1a2b41] via-[#243c5a] to-white/0"></div>
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-28 pb-10">
        <div className="max-w-[440px] mx-auto">
          
          {/* --- SIGN UP CARD: กรอบเด่นชัดพรีเมียม --- */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#CCFF00]/20 via-transparent to-[#CCFF00]/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative bg-white/95 backdrop-blur-2xl border-2 border-slate-100 p-10 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.07)] overflow-hidden transition-all duration-500 hover:border-[#CCFF00]/30">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent"></div>

              {/* ✅ Header Section: ใช้คำว่า Join the Community พร้อมดีไซน์เงาคมชัด */}
              <div className="flex flex-col items-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9] text-center">
                  JOIN THE <br />
                  <span className="text-[#CCFF00] drop-shadow-[3px_3px_0px_rgba(30,41,59,1)] [-webkit-text-stroke:1.5px_#1e293b] text-3xl md:text-4xl block mt-2">
                    COMMUNITY
                  </span>
                </h1>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] text-center mt-6">
                  Tennis Thailand Community
                </p>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-3">
                  <div className="group/input relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-[#CCFF00] transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS"
                      className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-[11px] outline-none focus:border-[#CCFF00] focus:bg-white transition-all placeholder:text-slate-300 tracking-widest"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="group/input relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-[#CCFF00] transition-colors" size={18} />
                    <input 
                      type="password" 
                      placeholder="PASSWORD"
                      className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-[11px] outline-none focus:border-[#CCFF00] focus:bg-white transition-all placeholder:text-slate-300 tracking-widest"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#CCFF00] text-slate-900 py-4.5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#CCFF00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Create Account <ArrowRight size={16} strokeWidth={3} /></>
                  )}
                </button>
              </form>

              {/* Footer: ไม่มีเส้นคั่นกลาง */}
              <div className="mt-8 text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Already a member? 
                  <Link href="/signin" className="text-[#84cc16] ml-2 hover:underline font-black transition-colors">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-slate-200 text-[8px] font-black uppercase tracking-[0.5em] mt-10 opacity-60">
            © 2026 Tennis Thailand
          </p>
        </div>
      </div>
    </main>
  )
}
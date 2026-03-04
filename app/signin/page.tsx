'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.04-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ✅ Login ด้วย Email (ใช้งานได้จริง)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      window.location.href = '/'
    }
  }

  // ✅ Login ด้วย Google (Mockup ไว้ก่อน)
  const handleGoogleLogin = () => {
    // ยังไม่เชื่อมต่อระบบ ใส่ Alert ไว้แจ้งผู้ใช้
    alert("Coming Soon! ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนาครับ 🎾")
  }

  return (
    <main className="min-h-screen bg-white relative font-sans overflow-hidden">
      {/* Background Theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#1a2b41] via-[#243c5a] to-white/0"></div>
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-28 pb-10">
        <div className="max-w-[440px] mx-auto">
          
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#CCFF00]/20 via-transparent to-[#CCFF00]/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative bg-white/95 backdrop-blur-2xl border-2 border-slate-100 p-10 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.07)] overflow-hidden hover:border-[#CCFF00]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent"></div>

              {/* Branding */}
              <div className="flex flex-col items-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9] text-center">
                  READY TO <br />
                  <span className="text-[#CCFF00] drop-shadow-[3px_3px_0px_rgba(30,41,59,1)] text-4xl md:text-5xl block mt-2" style={{ WebkitTextStroke: '1.5px #1e293b' }}>
                    TOUR
                  </span>
                </h1>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] text-center mt-6">
                  Tennis Tour Thai Community
                </p>
              </div>

              {/* Form Email */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="group/input relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-[#CCFF00] transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS"
                    className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-[11px] outline-none focus:border-[#CCFF00] focus:bg-white transition-all placeholder:text-slate-300 tracking-widest"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="group/input relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-[#CCFF00] transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="PASSWORD"
                    className="w-full pl-16 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-[11px] outline-none focus:border-[#CCFF00] focus:bg-white transition-all placeholder:text-slate-300 tracking-widest"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex justify-end pr-1">
                  <button type="button" className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#CCFF00] text-slate-900 py-4.5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#CCFF00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Sign In Now <ArrowRight size={16} strokeWidth={3} /></>
                  )}
                </button>
              </form>

              {/* Social Login Section */}
              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* ✅ ปุ่ม Google (โชว์สวยๆ แต่ยังไม่ต่อระบบ) */}
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-slate-100 py-4 rounded-2xl font-bold text-slate-600 text-[11px] tracking-wide shadow-sm hover:bg-slate-50 hover:border-slate-200 hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>

              <div className="mt-8 text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  New here? 
                  <Link href="/signup" className="text-[#84cc16] ml-2 hover:underline font-black transition-colors">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-slate-200 text-[8px] font-black uppercase tracking-[0.5em] mt-10 opacity-60">
            © 2026 Tennis Tour Thai
          </p>
        </div>
      </div>
    </main>
  )
}
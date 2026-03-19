'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
// ✅ ตรวจสอบว่ามี Lock, Mail, ArrowLeft, Send ครบถ้วน
import { Mail, ArrowLeft, Send, Lock } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      alert(error.message)
    } else {
      setMessage('Check your email for the reset link!')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen pt-32 flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md text-center">
        {/* ไอคอนกุญแจส่วนหัว */}
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#CCFF00] shadow-lg">
          <Lock size={28} />
        </div>
        
        <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-2">
          Forgot <span className="text-[#84cc16]">Password?</span>
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
          Enter your email to receive a reset link
        </p>

        {message ? (
          <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold mb-6">
            {message}
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative group text-left">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#84cc16]">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#CCFF00] outline-none font-bold text-slate-900 transition-all"
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#CCFF00] text-slate-900 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : <><Send size={16} /> Send Reset Link</>}
            </button>
          </form>
        )}

        <Link href="/signin" className="inline-flex items-center gap-2 mt-8 text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </main>
  )
}
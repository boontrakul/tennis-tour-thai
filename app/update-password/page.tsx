'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle } from 'lucide-react'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      alert('Password updated successfully!')
      router.push('/signin')
    }
  }

  return (
    <main className="min-h-screen pt-32 flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md text-center">
        <h1 className="text-xl md:text-2xl font-black uppercase italic mb-8">Set New <span className="text-[#CCFF00]">Password</span></h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="relative group text-left">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#84cc16]">
              <Lock size={20} />
            </div>
            <input 
              type="password" placeholder="New Password" required minLength={6}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#CCFF00] outline-none font-bold"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button className="w-full bg-[#CCFF00] py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-all">
            Update Password
          </button>
        </form>
      </div>
    </main>
  )
}
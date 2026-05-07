'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Upload, Loader2, MapPin, Tag, ImagePlus, Link as LinkIcon, 
  Navigation, GripHorizontal, X, User, Shield, DollarSign, Phone, 
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'

// รายการ Facilities สำหรับให้เลือก
const facilityOptions = [
  { id: 'parking', name: 'Parking', icon: <Car size={16} /> },
  { id: 'restaurant', name: 'Restaurant', icon: <Utensils size={16} /> },
  { id: 'pro_shop', name: 'Pro Shop', icon: <Store size={16} /> },
  { id: 'coach', name: 'Coach', icon: <GraduationCap size={16} /> },
  { id: 'changing_rooms', name: 'Changing Rooms', icon: <PersonStanding size={16} /> },
  { id: 'locker', name: 'Locker', icon: <Lock size={16} /> },
  { id: 'pool', name: 'Pool', icon: <Waves size={16} /> },
  { id: 'wifi', name: 'Wifi', icon: <Wifi size={16} /> },
  { id: 'shower', name: 'Shower', icon: <ShowerHead size={16} /> },
]

export default function AddCourtPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  
  // ✅ State สำหรับเก็บ Facilities ที่เลือก
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  const handleFacilityChange = (name: string) => {
    setSelectedFacilities(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const combinedFiles = [...images, ...filesArray].slice(0, 6)
      setImages(combinedFiles)
      const newPreviewUrls = combinedFiles.map(file => URL.createObjectURL(file))
      setPreview(newPreviewUrls)
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
    setPreview(preview.filter((_, index) => index !== indexToRemove))
  }

  const handleDragStart = (index: number) => { setDraggedIdx(index) }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault() }
  const handleDrop = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return
    const newPreview = [...preview]; const draggedPreviewItem = newPreview[draggedIdx]
    newPreview.splice(draggedIdx, 1); newPreview.splice(targetIdx, 0, draggedPreviewItem)
    setPreview(newPreview)
    const newImages = [...images]; const draggedImageItem = newImages[draggedIdx]
    newImages.splice(draggedIdx, 1); newImages.splice(targetIdx, 0, draggedImageItem)
    setImages(newImages)
    setDraggedIdx(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (images.length === 0) { alert("Please upload at least 1 image."); return }
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const uploadedUrls: string[] = []

    try {
      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `court-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('Court_image').upload(fileName, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('Court_image').getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }

      const { error: insertError } = await supabase.from('courts').insert([{
        name: formData.get('name'),
        location: formData.get('location'),
        price_per_hour: parseInt(formData.get('price') as string),
        surface: formData.get('surface'), 
        description: formData.get('description'),
        phone: formData.get('phone'),
        image_url: uploadedUrls[0] || null, 
        images: uploadedUrls,
        is_featured: false,
        map_url: formData.get('map_url'),
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
        court_type: formData.get('court_type') || 'Public',
        submitted_by: formData.get('submitted_by') || 'Anonymous',
        // ✅ ส่งข้อมูล Facilities ที่เลือกรวมเป็น String เดียว (คั่นด้วยคอมม่า)
        facilities: selectedFacilities.join(', '), 
        status: 'pending' 
      }])

      if (insertError) throw insertError
      router.push('/courts')
      setTimeout(() => alert('🎉 Court submitted for review!'), 500)
    } catch (error: any) { alert(error.message) } finally { setLoading(false) }
  }

  const labelStyle = "block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3 ml-3 flex items-center gap-2"
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none"
  const inputIconStyle = "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CCFF00] transition-colors"

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-600 to-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <Link href="/courts" className="inline-flex items-center gap-2 text-white/60 font-black uppercase text-[10px] tracking-widest mb-10 hover:text-[#CCFF00] transition-colors">
          <ArrowLeft size={14} strokeWidth={3} /> Cancel and Back
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 relative overflow-hidden">
          <header className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
               Showcase Your <span className="text-[#CCFF00]" style={{ WebkitTextStroke: '1px #0f172a' }}>Court</span>
             </h1>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Build Thailand's Tennis Community Together.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. Photo Gallery */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><ImagePlus size={14} /> Court Gallery (Max 6)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {preview.map((url, i) => (
                  <div key={url} draggable onDragStart={() => handleDragStart(i)} onDragOver={handleDragOver} onDrop={() => handleDrop(i)} className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 relative group cursor-move transition-all ${draggedIdx === i ? 'opacity-50 scale-95 border-[#CCFF00]' : 'border-white hover:border-[#CCFF00]'}`}>
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </div>
                ))}
                {preview.length < 6 && (
                  <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#CCFF00] bg-white flex flex-col items-center justify-center cursor-pointer text-slate-300 hover:text-[#CCFF00]">
                    <Upload size={24} />
                    <span className="text-[10px] font-black uppercase mt-2">Add Photo</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* 2. Basic Info & Facilities */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className={labelStyle}>Court Name</label>
                  <Tag size={18} className={inputIconStyle} />
                  <input name="name" required placeholder="Name of your club" className={inputStyle} />
                </div>
                <div className="relative group">
                  <label className={labelStyle}>Surface Type</label>
                  <MapPin size={18} className={inputIconStyle} />
                  <select name="surface" className={inputStyle + " appearance-none"}>
                    <option value="Hard Court">Hard Court</option>
                    <option value="Clay Court">Clay Court</option>
                    <option value="Grass Court">Grass Court</option>
                    <option value="Indoor">Indoor</option>
                  </select>
                </div>
              </div>

              {/* ✅ ส่วนที่เพิ่ม: Facilities Selection */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <label className={labelStyle}><CheckCircle2 size={14} /> Facilities (สิ่งอำนวยความสะดวก)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facilityOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleFacilityChange(f.name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedFacilities.includes(f.name)
                          ? 'bg-[#CCFF00] border-[#CCFF00] text-slate-900 shadow-md'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <div className={selectedFacilities.includes(f.name) ? 'text-slate-900' : 'text-[#84cc16]'}>
                        {f.icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Court Type & Submitter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className={labelStyle}><Shield size={14} /> Court Access</label>
                  <div className="flex gap-6 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl h-[56px] items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                      <input type="radio" name="court_type" value="Public" defaultChecked className="w-4 h-4" /> Public
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                      <input type="radio" name="court_type" value="Private" className="w-4 h-4" /> Private
                    </label>
                  </div>
                </div>
                <div className="relative group">
                  <label className={labelStyle}><User size={14} /> Added By</label>
                  <User size={18} className={inputIconStyle} />
                  <input name="submitted_by" placeholder="e.g. BOONTRAKUL" className={inputStyle} />
                </div>
              </div>

              {/* Location, Pricing & Contact */}
              <div className="p-6 border-2 border-slate-100 rounded-[2rem] space-y-6">
                <div className="relative group">
                  <label className={labelStyle}>Location / District</label>
                  <MapPin size={18} className={inputIconStyle} />
                  <input name="location" required placeholder="e.g. Sukhumvit, Bangkok" className={inputStyle} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className={labelStyle}>Rate per Hour (฿)</label>
                    <DollarSign size={18} className={inputIconStyle} />
                    <input name="price" type="number" required placeholder="e.g. 500" className={inputStyle} />
                  </div>
                  <div className="relative group">
                    <label className={labelStyle}>Contact Phone</label>
                    <Phone size={18} className={inputIconStyle} />
                    <input name="phone" required placeholder="Contact for booking" className={inputStyle} />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label className={labelStyle}>Description</label>
                <textarea name="description" rows={4} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none resize-none" placeholder="More details..."></textarea>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#CCFF00] text-slate-900 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.25em] shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Submit Court Application'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
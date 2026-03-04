'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
// ✅ เพิ่ม User และ Shield เข้ามาสำหรับไอคอนช่องใหม่
import { ArrowLeft, Upload, Loader2, CheckCircle2, MapPin, Tag, FileText, DollarSign, Phone, ImagePlus, Link as LinkIcon, Navigation, GripHorizontal, X, User, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AddCourtPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

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

  const handleDragStart = (index: number) => {
    setDraggedIdx(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return

    const newPreview = [...preview]
    const draggedPreviewItem = newPreview[draggedIdx]
    newPreview.splice(draggedIdx, 1)
    newPreview.splice(targetIdx, 0, draggedPreviewItem)
    setPreview(newPreview)

    const newImages = [...images]
    const draggedImageItem = newImages[draggedIdx]
    newImages.splice(draggedIdx, 1)
    newImages.splice(targetIdx, 0, draggedImageItem)
    setImages(newImages)

    setDraggedIdx(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (images.length === 0) {
        alert("Please upload at least 1 image of the court.")
        return
    }
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const uploadedUrls: string[] = []

    try {
      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `court-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('Court_image')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('Court_image')
          .getPublicUrl(fileName)
        
        uploadedUrls.push(publicUrl)
      }

      const latStr = formData.get('latitude') as string
      const lngStr = formData.get('longitude') as string
      const lat = latStr ? parseFloat(latStr) : null
      const lng = lngStr ? parseFloat(lngStr) : null

      const { error: insertError } = await supabase
        .from('courts')
        .insert([{
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
          latitude: lat,
          longitude: lng,
          // ✅ ดึงข้อมูล Court Type และ Submitted By
          court_type: formData.get('court_type') || 'Public',
          submitted_by: formData.get('submitted_by') || 'Anonymous',
          // ✅ เพิ่มบรรทัดนี้ลงไป เพื่อบอกว่าสนามนี้เพิ่งเพิ่ม ต้องรอแอดมินตรวจก่อน!
          status: 'pending' 
        }])

      if (insertError) throw insertError
      
      router.push('/courts')
      setTimeout(() => alert('🎉 Court submitted successfully!'), 500)

    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3 ml-3 flex items-center gap-2"
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none"
  const inputIconStyle = "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CCFF00] transition-colors"

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-600 to-slate-50 relative overflow-hidden pt-32 pb-20">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#CCFF00]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <Link href="/courts" className="inline-flex items-center gap-2 text-white/60 font-black uppercase text-[10px] tracking-widest mb-10 hover:text-[#CCFF00] transition-colors hover:-translate-x-1 duration-300 shadow-sm">
          <ArrowLeft size={14} strokeWidth={3} /> Cancel and Back
        </Link>

        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-80"></div>
          
          <header className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight">
                Showcase Your <span className="text-[#CCFF00] drop-shadow-sm" style={{ WebkitTextStroke: '1px #0f172a' }}>Court</span>
             </h1>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] max-w-md mx-auto">
                Bring your facility to the forefront of Thailand's tennis community.
             </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. Photo Gallery Upload */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}>
                <ImagePlus size={14} /> Court Gallery (Max 6) <span className="text-slate-400 normal-case tracking-normal font-medium ml-2">- Drag to reorder. The first image will be the cover.</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {preview.map((url, i) => (
                  <div 
                    key={url} 
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(i)}
                    className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 shadow-sm relative group cursor-move transition-transform ${draggedIdx === i ? 'opacity-50 scale-95 border-[#CCFF00]' : 'border-white hover:border-[#CCFF00]'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <GripHorizontal size={14} />
                    </div>
                    {i === 0 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#CCFF00] text-slate-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm pointer-events-none">
                        Cover
                      </div>
                    )}
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:scale-110">
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                {preview.length < 6 && (
                  <label className="aspect-[4/3] rounded-2xl border-3 border-dashed border-slate-200 hover:border-[#CCFF00] bg-white flex flex-col items-center justify-center cursor-pointer transition-all text-slate-300 hover:text-[#CCFF00]">
                    <Upload size={24} />
                    <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Add Photo</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* 2. Facility Details */}
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

              {/* ✅ ส่วนที่เพิ่มใหม่: Court Type และ Added By */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Public / Private Court */}
                <div className="relative group">
                  <label className={labelStyle}><Shield size={14} /> Court Access</label>
                  <div className="flex gap-6 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl h-[56px] items-center">
                    <label className="flex items-center gap-2 cursor-pointer group/radio">
                      <input type="radio" name="court_type" value="Public" defaultChecked className="w-4 h-4 text-[#CCFF00] focus:ring-[#CCFF00]" />
                      <span className="text-sm font-bold text-slate-600 group-hover/radio:text-slate-900 transition-colors">Public Court</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group/radio">
                      <input type="radio" name="court_type" value="Private" className="w-4 h-4 text-[#CCFF00] focus:ring-[#CCFF00]" />
                      <span className="text-sm font-bold text-slate-600 group-hover/radio:text-slate-900 transition-colors">Private Court</span>
                    </label>
                  </div>
                </div>

                {/* 2. Added By */}
                <div className="relative group">
                  <label className={labelStyle}><User size={14} /> Added By</label>
                  <User size={18} className={inputIconStyle} />
                  <input name="submitted_by" placeholder="e.g. BOONTRAKUL" className={inputStyle} />
                  <p className="text-[10px] text-slate-400 font-bold ml-3 mt-2">* สามารถระบุชื่อจริง หรือนามแฝงได้</p>
                </div>
              </div>

              {/* 3. Location & Map Details */}
              <div className="p-6 border-2 border-slate-100 rounded-[2rem] space-y-6">
                <div className="relative group">
                  <label className={labelStyle}>Location / District</label>
                  <MapPin size={18} className={inputIconStyle} />
                  <input name="location" required placeholder="e.g. Sukhumvit, Bangkok" className={inputStyle} />
                </div>

                <div className="relative group">
                  <label className={labelStyle}>Google Maps Link (Optional)</label>
                  <LinkIcon size={18} className={inputIconStyle} />
                  <input name="map_url" placeholder="Paste Google Maps URL here..." className={inputStyle} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className={labelStyle}>Latitude (ละติจูด)</label>
                    <Navigation size={18} className={inputIconStyle} />
                    <input name="latitude" type="number" step="any" placeholder="e.g. 13.7563" className={inputStyle} />
                  </div>
                  <div className="relative group">
                    <label className={labelStyle}>Longitude (ลองจิจูด)</label>
                    <Navigation size={18} className={inputIconStyle} />
                    <input name="longitude" type="number" step="any" placeholder="e.g. 100.5018" className={inputStyle} />
                  </div>
                </div>
              </div>

              {/* 4. Pricing & Contact */}
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

              <div className="relative group">
                <label className={labelStyle}>Description & Facility Details</label>
                <textarea name="description" rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none resize-none" placeholder="Tell us more about parking, lighting, etc."></textarea>
              </div>
            </div>

            {/* 5. Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#CCFF00] text-slate-900 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.25em] shadow-xl shadow-[#CCFF00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Submit Court Application'}
            </button>

            {/* ✅ ส่วนที่เพิ่มใหม่: โฆษณาแบบเนียนๆ */}
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-400 font-bold tracking-wide">
                For court advertising inquiries, please email <a href="mailto:boontrakul@gmail.com" className="text-slate-900 hover:text-[#84cc16] underline decoration-slate-200 underline-offset-4 transition-colors">boontrakul@gmail.com</a>
              </p>
            </div>
            
          </form>
        </div>
      </div>
    </main>
  )
}
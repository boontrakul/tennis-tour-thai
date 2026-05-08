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

// รายการ Facilities สำหรับให้เลือก (สไตล์ Modern Chips)
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
  
  // ✅ State สำหรับระบบพิกัดและสิ่งอำนวยความสะดวก
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  // ฟังก์ชันดึงพิกัดจาก Google Maps URL อัตโนมัติ
  const handleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = url.match(regex);
    if (match) {
      setLat(match[1]);
      setLng(match[2]);
    }
  };

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
      // 1. อัปโหลดรูปภาพไปยัง Supabase Storage
      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `court-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('Court_image').upload(fileName, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('Court_image').getPublicUrl(fileName)
        uploadedUrls.push(publicUrl)
      }

      // 2. บันทึกข้อมูลลงฐานข้อมูลตาราง courts
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
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        court_type: formData.get('court_type') || 'Public',
        submitted_by: formData.get('submitted_by') || 'Anonymous',
        facilities: selectedFacilities.join(', '), 
        status: 'pending' // ต้องรอแอดมินตรวจสอบ
      }])

      if (insertError) throw insertError
      router.push('/courts')
      setTimeout(() => alert('🎉 สนามของคุณถูกส่งให้แอดมินตรวจสอบเรียบร้อยแล้ว!'), 500)
    } catch (error: any) { alert(error.message) } finally { setLoading(false) }
  }

  const labelStyle = "block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 ml-3 flex items-center gap-2"
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none"
  const inputIconStyle = "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CCFF00] transition-colors"

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-700 to-slate-50 pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        <Link href="/courts" className="inline-flex items-center gap-2 text-white/70 font-bold uppercase text-[11px] tracking-widest mb-10 hover:text-[#CCFF00] transition-all">
          <ArrowLeft size={16} strokeWidth={3} /> Back to Directory
        </Link>

        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] p-8 md:p-16 relative overflow-hidden">
          
          <header className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
               Showcase Your <span className="text-[#CCFF00]" style={{ WebkitTextStroke: '1.5px #0f172a' }}>Court</span>
             </h1>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Help us build the ultimate tennis network.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* ส่วนที่ 1: การอัปโหลดรูปภาพ */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><ImagePlus size={16} /> Court Photo Gallery (Max 6)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {preview.map((url, i) => (
                  <div key={url} draggable onDragStart={() => handleDragStart(i)} onDragOver={handleDragOver} onDrop={() => handleDrop(i)} className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 relative group cursor-move transition-all ${draggedIdx === i ? 'opacity-50 scale-95 border-[#CCFF00]' : 'border-white hover:border-[#CCFF00]'}`}>
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    {i === 0 && <div className="absolute bottom-2 left-2 bg-[#CCFF00] text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Cover</div>}
                  </div>
                ))}
                {preview.length < 6 && (
                  <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#CCFF00] hover:bg-white flex flex-col items-center justify-center cursor-pointer text-slate-300 hover:text-[#CCFF00] transition-all">
                    <Upload size={28} />
                    <span className="text-[10px] font-black uppercase mt-3 tracking-widest">Upload</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* ส่วนที่ 2: ข้อมูลพื้นฐาน */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}>Court Name</label>
                  <Tag size={18} className={inputIconStyle} />
                  <input name="name" required placeholder="Club or Arena Name" className={inputStyle} />
                </div>
                <div className="relative group">
                  <label className={labelStyle}>Surface Type</label>
                  <MapPin size={18} className={inputIconStyle} />
                  <select name="surface" className={inputStyle + " appearance-none cursor-pointer"}>
                    <option value="Hard Court">Hard Court</option>
                    <option value="Clay Court">Clay Court</option>
                    <option value="Grass Court">Grass Court</option>
                    <option value="Indoor">Indoor / Carpet</option>
                  </select>
                </div>
              </div>

              {/* ส่วนที่ 3: สิ่งอำนวยความสะดวก (Facilities) */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <label className={labelStyle}><CheckCircle2 size={16} /> Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facilityOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleFacilityChange(f.name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedFacilities.includes(f.name)
                          ? 'bg-slate-900 border-slate-900 text-[#CCFF00] shadow-lg'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <div className="shrink-0">{f.icon}</div>
                      <span className="text-[11px] font-bold uppercase tracking-tight">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ส่วนที่ 4: การเข้าถึงและชื่อผู้ส่ง */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}><Shield size={14} /> Access Type</label>
                  <div className="flex gap-4 p-2 bg-slate-50 border-2 border-slate-100 rounded-2xl h-[60px] items-center">
                    <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer h-full rounded-xl hover:bg-white transition-all font-bold text-xs text-slate-600 has-[:checked]:bg-slate-900 has-[:checked]:text-[#CCFF00]">
                      <input type="radio" name="court_type" value="Public" defaultChecked className="hidden" /> Public
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer h-full rounded-xl hover:bg-white transition-all font-bold text-xs text-slate-600 has-[:checked]:bg-slate-900 has-[:checked]:text-[#CCFF00]">
                      <input type="radio" name="court_type" value="Private" className="hidden" /> Private
                    </label>
                  </div>
                </div>
                <div className="relative group">
                  <label className={labelStyle}><User size={14} /> Added By</label>
                  <User size={18} className={inputIconStyle} />
                  <input name="submitted_by" placeholder="Your Name / Nickname" className={inputStyle} />
                </div>
              </div>

              {/* ส่วนที่ 5: สถานที่และพิกัด (ดึงอัตโนมัติ) */}
              <div className="p-8 bg-slate-50/50 border-2 border-slate-100 rounded-[2.5rem] space-y-8">
                <div className="relative group">
                  <label className={labelStyle}>Location / District</label>
                  <MapPin size={18} className={inputIconStyle} />
                  <input name="location" required placeholder="e.g. Bang Na, Bangkok" className={inputStyle} />
                </div>
                
                <div className="relative group">
                  <label className={labelStyle}>Google Maps Link</label>
                  <LinkIcon size={18} className={inputIconStyle} />
                  <input 
                    name="map_url" 
                    placeholder="วางลิงก์ที่นี่เพื่อดึงพิกัด..." 
                    className={inputStyle} 
                    onChange={handleMapUrlChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className={labelStyle}>Latitude</label>
                    <Navigation size={18} className={inputIconStyle} />
                    <input 
                      name="latitude" type="number" step="any" required 
                      className={inputStyle} value={lat} onChange={(e) => setLat(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <label className={labelStyle}>Longitude</label>
                    <Navigation size={18} className={inputIconStyle} />
                    <input 
                      name="longitude" type="number" step="any" required 
                      className={inputStyle} value={lng} onChange={(e) => setLng(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 6: ราคาและติดต่อ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}>Rate per Hour (฿)</label>
                  <DollarSign size={18} className={inputIconStyle} />
                  <input name="price" type="number" required placeholder="e.g. 450" className={inputStyle} />
                </div>
                <div className="relative group">
                  <label className={labelStyle}>Contact / Booking</label>
                  <Phone size={18} className={inputIconStyle} />
                  <input name="phone" required placeholder="Phone or Line ID" className={inputStyle} />
                </div>
              </div>

              <div className="relative group">
                <label className={labelStyle}>Description & Details</label>
                <textarea name="description" rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none resize-none" placeholder="บอกรายละเอียดเพิ่มเติม เช่น จำนวนสนาม, ที่จอดรถกี่คัน, หรือโปรโมชั่น..."></textarea>
              </div>
            </div>

            {/* ✅ ปุ่ม Submit สีส้มสด โดดเด่นตามสั่ง! */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ff6b00] text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(255,107,0,0.4)] hover:bg-[#e66000] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Submit Court Application'}
            </button>
            
          </form>
        </div>
      </div>
    </main>
  )
}
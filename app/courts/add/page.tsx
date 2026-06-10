'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Upload, Loader2, MapPin, Tag, ImagePlus, Link as LinkIcon, 
  Navigation, X, User, Shield, DollarSign, Phone, 
  Car, Utensils, Store, GraduationCap, PersonStanding, Lock, Waves, Wifi, ShowerHead, CheckCircle2,
  Clock, Sun, Moon, Home, FileText, CheckSquare, Square, Info
} from 'lucide-react'
import Link from 'next/link'

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

// รายการตัวเลือกพื้นผิวสนามทั้งหมดของ Tennis Tour Thai
const surfaceOptions = [
  'Hard Court',
  'Clay Court',
  'Grass Court',
  'Artificial Grass',
  'Acrylic'
]

export default function AddCourtPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  
  // สร้าง State ในการจำค่าพื้นผิวสนามที่เลือก (เริ่มต้นให้เลือกเป็น Hard Court ไว้เป็นค่าหลัก)
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>(['Hard Court'])

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

  // ฟังก์ชันสลับการติ๊กปุ่มเลือกพื้นผิวสนาม (สับเปลี่ยนค่าใน Array)
  const handleSurfaceToggle = (surfName: string) => {
    setSelectedSurfaces(prev => {
      if (prev.includes(surfName)) {
        // ดักเงื่อนไขให้เหลือขั้นต่ำ 1 ชนิด ห้ามว่างเปล่า
        return prev.length > 1 ? prev.filter(s => s !== surfName) : prev
      } else {
        return [...prev, surfName]
      }
    })
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

      // ดักค่าราคา หากปล่อยว่างมาให้ใช้เป็น 0 แทน (เนื่องจากปลด required ออกแล้ว)
      const priceDay = formData.get('price_day') ? parseInt(formData.get('price_day') as string) : 0
      const priceNight = formData.get('price_night') ? parseInt(formData.get('price_night') as string) : 0

      const { error: insertError } = await supabase.from('courts').insert([{
        name: formData.get('name'),
        location: formData.get('location'),
        price_day: priceDay,
        price_night: priceNight,
        open_time: formData.get('open_time'),
        close_time: formData.get('close_time'),
        environment: formData.get('environment'),
        surface: selectedSurfaces.join(', '), 
        description: formData.get('description'),
        phone: formData.get('phone'),
        image_url: uploadedUrls[0] || null, 
        images: uploadedUrls,
        is_featured: null, 
        map_url: formData.get('map_url'),
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        court_type: formData.get('court_type') || 'Public',
        submitted_by: formData.get('submitted_by') || 'Anonymous',
        facilities: selectedFacilities.join(', '), 
        status: 'pending' 
      }])

      if (insertError) throw insertError
      router.push('/courts')
      setTimeout(() => alert('🎉 สนามของคุณถูกส่งให้แอดมินตรวจสอบแล้ว!'), 500)
    } catch (error: any) { alert(error.message) } finally { setLoading(false) }
  }

  const labelStyle = "block text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2 ml-3 flex items-center gap-2"
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 focus:border-[#CCFF00] focus:bg-white transition-all outline-none mt-2"
  const inputIconStyle = "absolute left-5 top-1/2 -translate-y-1/2 mt-1 text-slate-400 group-focus-within:text-[#CCFF00] transition-colors"

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
            
            {/* 1. Photo Gallery */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <label className={labelStyle}><ImagePlus size={16} /> Court Photo Gallery (Max 6)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {preview.map((url, i) => (
                  <div key={url} draggable onDragStart={() => handleDragStart(i)} onDragOver={handleDragOver} onDrop={() => handleDrop(i)} className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 relative group cursor-move transition-all ${draggedIdx === i ? 'opacity-50 scale-95 border-[#CCFF00]' : 'border-white hover:border-[#CCFF00]'}`}>
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
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

            <div className="space-y-8">
              {/* 2. Basic Court Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}>Court Name</label>
                  <Tag size={18} className={inputIconStyle} />
                  <input name="name" required placeholder="Club or Arena Name" className={inputStyle} />
                </div>
                <div className="relative group">
                  <label className={labelStyle}>Contact / Booking</label>
                  <Phone size={18} className={inputIconStyle} />
                  <input name="phone" required placeholder="Phone or Line ID" className={inputStyle} />
                </div>
              </div>

              {/* 3. Environment & Surface Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}><Home size={16} /> Environment</label>
                  <Navigation size={18} className={inputIconStyle} />
                  <select name="environment" className={inputStyle + " appearance-none cursor-pointer"}>
                    <option value="Outdoor">Outdoor (กลางแจ้ง)</option>
                    <option value="Indoor">Indoor (ในร่ม)</option>
                    <option value="Both">Both (มีทั้ง 2 แบบ)</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 col-span-1 md:col-span-2">
                  <label className={labelStyle}><MapPin size={16} /> Surface Type (ประเภทพื้นผิวสนาม - เลือกได้มากกว่า 1)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {surfaceOptions.map((surf) => {
                      const isChecked = selectedSurfaces.includes(surf);
                      return (
                        <button
                          key={surf}
                          type="button"
                          onClick={() => handleSurfaceToggle(surf)}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-tight transition-all ${
                            isChecked 
                              ? 'bg-slate-900 border-slate-900 text-[#CCFF00] shadow-md' 
                              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          {isChecked ? <CheckSquare size={14} className="text-[#CCFF00]" /> : <Square size={14} />}
                          <span>{surf}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Opening Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}><Clock size={16} /> Opening Time</label>
                  <Clock size={18} className={inputIconStyle} />
                  <input name="open_time" type="time" defaultValue="07:00" className={inputStyle} />
                </div>
                <div className="relative group">
                  <label className={labelStyle}><Clock size={16} /> Closing Time</label>
                  <Clock size={18} className={inputIconStyle} />
                  <input name="close_time" type="time" defaultValue="22:00" className={inputStyle} />
                </div>
              </div>

              {/* 5. Hourly Rates (✅ ปรับให้เว้นว่างได้ และเพิ่มคำแนะนำ) */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <label className={labelStyle}><DollarSign size={16} /> Hourly Rates (฿)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  <div className="relative group">
                    <div className="ml-3 mb-2">
                      <label className="text-[10px] font-bold text-slate-900 uppercase flex items-center gap-2">
                        <Sun size={12} /> Daytime (ไม่เปิดไฟ)
                      </label>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">หากไม่ทราบให้เว้นว่างได้</p>
                    </div>
                    <DollarSign size={18} className="absolute left-5 top-[52px] text-slate-400 group-focus-within:text-[#CCFF00]" />
                    <input name="price_day" type="number" placeholder="e.g. 400" className={inputStyle} />
                  </div>
                  <div className="relative group">
                    <div className="ml-3 mb-2">
                      <label className="text-[10px] font-bold text-slate-900 uppercase flex items-center gap-2">
                        <Moon size={12} /> Nighttime (เปิดไฟ)
                      </label>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">หากไม่ทราบให้เว้นว่างได้</p>
                    </div>
                    <DollarSign size={18} className="absolute left-5 top-[52px] text-slate-400 group-focus-within:text-[#CCFF00]" />
                    <input name="price_night" type="number" placeholder="e.g. 600" className={inputStyle} />
                  </div>
                </div>
              </div>

              {/* 6. Facilities Chips */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <label className={labelStyle}><CheckCircle2 size={16} /> Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
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

              {/* 7. Description & Facility Details */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative group">
                <label className={labelStyle}><FileText size={16} /> Facility Details & Description</label>
                <textarea 
                  name="description" 
                  rows={5} 
                  className="w-full bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-[#CCFF00] transition-all outline-none resize-none placeholder:text-slate-300 mt-2" 
                  placeholder="บอกรายละเอียดเพิ่มเติม เช่น จำนวนสนาม, ที่จอดรถกี่คัน, การจองล่วงหน้า หรือโปรโมชั่นต่างๆ..."
                ></textarea>
              </div>

              {/* 8. Access & Submitter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className={labelStyle}><Shield size={14} /> Access Type</label>
                  <div className="flex gap-4 p-2 bg-slate-50 border-2 border-slate-100 rounded-2xl h-[60px] items-center mt-2">
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
                  <input name="submitted_by" placeholder="Your Name" className={inputStyle} />
                </div>
              </div>

              {/* 9. Location & Map (✅ เพิ่มตัวอย่างและปลด required จุดที่ไม่บังคับ) */}
              <div className="p-8 bg-slate-50/50 border-2 border-slate-100 rounded-[2.5rem] space-y-8">
                <div className="relative group">
                  <div className="ml-3 mb-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">District / Location</label>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">ตัวอย่าง: บางนา, สุขุมวิท, กทม. (หากมีหลายพื้นที่ให้คั่นด้วย ,)</p>
                  </div>
                  <MapPin size={18} className="absolute left-5 top-[52px] text-slate-400 group-focus-within:text-[#CCFF00] transition-colors" />
                  <input name="location" required placeholder="e.g. บางนา, กรุงเทพฯ" className={inputStyle} />
                </div>
                
                <div className="relative group">
                  <div className="ml-3 mb-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Google Maps Link</label>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">วางลิงก์จาก Google Maps (หากไม่ทราบให้เว้นว่างได้)</p>
                  </div>
                  <LinkIcon size={18} className="absolute left-5 top-[52px] text-slate-400 group-focus-within:text-[#CCFF00] transition-colors" />
                  <input 
                    name="map_url" 
                    placeholder="วางลิงก์ที่นี่เพื่อดึงพิกัดอัตโนมัติ..." 
                    className={inputStyle} 
                    onChange={handleMapUrlChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <div className="ml-3 mb-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Latitude</label>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">ละติจูด (หากไม่ทราบให้เว้นว่างได้)</p>
                    </div>
                    <Navigation size={18} className="absolute left-5 top-[52px] text-slate-400 group-focus-within:text-[#CCFF00] transition-colors" />
                    <input 
                      name="latitude" type="number" step="any"
                      className={inputStyle} value={lat} onChange={(e) => setLat(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <div className="ml-3 mb-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Longitude</label>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">ลองจิจูด (หากไม่ทราบให้เว้นว่างได้)</p>
                    </div>
                    <Navigation size={18} className="absolute left-5 top-[52px] text-slate-400 group-focus-within:text-[#CCFF00] transition-colors" />
                    <input 
                      name="longitude" type="number" step="any"
                      className={inputStyle} value={lng} onChange={(e) => setLng(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ กล่องแจ้งเตือนสถานะการตรวจสอบโดย Admin ก่อนกดส่ง */}
            <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl flex items-start gap-4">
              <Info size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-orange-700 uppercase">Information Check</h4>
                <p className="text-xs font-bold text-orange-600/80 mt-1">
                  ข้อมูลสนามทั้งหมดที่คุณกรอก จะถูกส่งเข้าสู่ระบบหลังบ้านเพื่อให้ทีมงาน Admin ตรวจสอบความถูกต้องก่อนนำขึ้นแสดงผลบนเว็บไซต์จริงครับ
                </p>
              </div>
            </div>

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
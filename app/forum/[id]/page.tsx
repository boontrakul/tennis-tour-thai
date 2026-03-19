'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { MessageCircle, User, Clock, ArrowLeft, Image as ImageIcon, Send, Loader2, X } from 'lucide-react'

const timeAgo = (dateString: string) => {
  if (!dateString) return 'Just now'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffInSeconds < 60) return 'Just now'
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
}

export default function ForumDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // ✅ เพิ่ม State สำหรับจัดการรูปภาพในคอมเมนต์
  const [commentImage, setCommentImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const fetchComments = async () => {
    const { data: commentData } = await supabase
      .from('forum_comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (commentData) setComments(commentData)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: postData } = await supabase.from('forum_posts').select('*').eq('id', id).single()
      if (postData) setPost(postData)
      await fetchComments()
      setLoading(false)
    }
    fetchData()
  }, [id])

  // ✅ ฟังก์ชันจัดการรูปภาพ
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCommentImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // ✅ ฟังก์ชันส่งคอมเมนต์ (พร้อมอัปโหลดรูป)
  const handlePostComment = async () => {
    if (!newComment.trim() && !commentImage) return

    setSubmitting(true)
    let uploadedImageUrl = null

    try {
      // 1. อัปโหลดรูปภาพถ้ามีการเลือก
      if (commentImage) {
        const fileExt = commentImage.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('forum_images') // ✅ ตรวจสอบว่าคุณมี Bucket ชื่อนี้ใน Supabase แล้ว
          .upload(fileName, commentImage)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('forum_images')
          .getPublicUrl(fileName)
        
        uploadedImageUrl = publicUrl
      }

      // 2. บันทึกคอมเมนต์ลง Database
      const { error } = await supabase
        .from('forum_comments')
        .insert([
          {
            post_id: id,
            content: newComment,
            author_name: 'BOONTRAKUL', 
            image_url: uploadedImageUrl // ✅ เพิ่ม URL รูปภาพลงในคอมเมนต์
          }
        ])

      if (error) throw error

      setNewComment('') 
      setCommentImage(null)
      setImagePreview(null)
      await fetchComments()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white italic font-black text-slate-300 uppercase tracking-widest">
      <Loader2 className="animate-spin text-[#CCFF00] mr-3" size={30} /> Loading Discussion
    </div>
  )

  if (!post) return <div className="pt-40 text-center font-black text-slate-400 uppercase tracking-widest">Post Not Found</div>

  return (
    <main className="min-h-screen bg-slate-50/30 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-32 pb-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link href="/forum" className="inline-flex items-center gap-2 text-[#CCFF00] text-[11px] font-black uppercase tracking-[0.2em] mb-8 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Forum
          </Link>
          <span className="bg-[#CCFF00] text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase italic inline-block mb-6 shadow-lg">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[1.1] mb-8">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2 text-white"><User size={14} className="text-[#CCFF00]" /> {post.author_name}</span>
            <span className="flex items-center gap-2"><Clock size={14} /> {timeAgo(post.created_at)}</span>
            <span className="flex items-center gap-2"><MessageCircle size={14} /> {comments.length} Replies</span>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="container mx-auto px-4 max-w-4xl -mt-10 relative z-20">
        <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 mb-12">
          {/* ✅ ฟอนต์เนื้อหากระทู้อ่านง่าย (text-lg md:text-xl) */}
          <p className="text-slate-700 text-lg md:text-xl leading-relaxed mb-12 whitespace-pre-wrap font-medium">
            {post.content}
          </p>
          
          {post.image_url && (
            <div className="rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
              <img src={post.image_url} alt="" className="w-full h-auto max-h-[600px] object-cover block" />
            </div>
          )}
        </div>

        {/* --- REPLIES SECTION --- */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 ml-4">
            <div className="w-2 h-6 bg-[#CCFF00] rounded-full shadow-[0_0_15px_rgba(204,255,0,0.5)]"></div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Replies</h2>
          </div>
          
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-7 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic">{comment.author_name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{timeAgo(comment.created_at)}</p>
                  </div>
                </div>
                {/* ✅ ฟอนต์คอมเมนต์ (text-base md:text-lg) */}
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium mb-4">
                  {comment.content}
                </p>
                {/* แสดงรูปภาพในคอมเมนต์ (ถ้ามี) */}
                {comment.image_url && (
                  <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 max-w-md">
                    <img src={comment.image_url} alt="comment photo" className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- INPUT AREA: ส่งข้อความ + รูปภาพ --- */}
        <div className="pt-10 border-t-2 border-slate-100">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 overflow-hidden focus-within:border-[#CCFF00] transition-all">
            
            {/* แสดง Preview รูปที่จะอัปโหลด */}
            {imagePreview && (
              <div className="p-4 bg-slate-50 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <button onClick={() => {setCommentImage(null); setImagePreview(null)}} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                    <X size={12} />
                  </button>
                </div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Image Selected</p>
              </div>
            )}

            <textarea 
              placeholder="Join the discussion..."
              className="w-full p-8 bg-transparent font-bold text-slate-900 text-base md:text-lg outline-none min-h-[150px] resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
            />
            
            <div className="flex items-center justify-between p-4 bg-slate-50/80 border-t border-slate-100">
              <label className="flex items-center gap-2 px-6 py-2 text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest cursor-pointer transition-colors">
                <ImageIcon size={18} /> Add Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
              
              <button 
                onClick={handlePostComment}
                disabled={submitting || (!newComment.trim() && !commentImage)}
                className="px-8 py-4 rounded-2xl bg-[#CCFF00] text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#CCFF00]/20 hover:bg-slate-900 hover:text-[#CCFF00] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Post Reply</>}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
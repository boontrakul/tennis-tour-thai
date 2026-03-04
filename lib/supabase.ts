import { createClient } from '@supabase/supabase-js'

// ดึงค่ากุญแจจากไฟล์ .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// สร้างตัวเชื่อมต่อและส่งออกไปให้ไฟล์อื่นใช้
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

// ✅ ตั้งค่า Inter ให้รองรับทั้ง Latin และ Thai
// display: 'swap' ช่วยให้ฟอนต์โหลดขึ้นมาแทนที่ฟอนต์ระบบได้ทันทีโดยไม่กระพริบ
const inter = Inter({ 
  subsets: ['latin', 'thai'],
  display: 'swap',
  variable: '--font-inter', // สร้าง CSS Variable เพื่อไปเรียกใช้ใน globals.css
})

export const metadata: Metadata = {
  title: 'Tennis Tour Thai - Community',
  description: "Thailand's #1 Tennis Community",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* ส่วน Header / Menu */}
        <Navbar />
        
        {/* ส่วนเนื้อหาหลัก */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* ส่วนท้ายเว็บไซต์ */}
        <Footer />
      </body>
    </html>
  )
}
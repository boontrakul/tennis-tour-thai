import './globals.css'
import type { Metadata } from 'next'
import { Inter, Prompt } from 'next/font/google' // ✅ นำเข้าฟอนต์สมัยใหม่
import Navbar from '../components/navbar'
import Footer from '../components/footer'

// ✅ ตั้งค่าฟอนต์ Inter (Modern Sans)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

// ✅ ตั้งค่าฟอนต์ Prompt (Minimalist Thai Sans-serif)
const prompt = Prompt({ 
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-prompt',
})

export const metadata: Metadata = {
  title: 'Tennis Tour Thai - Community',
  description: "Thailand's #1 Tennis Community",
  // ✅ เปลี่ยนมาใช้โลโก้จากโฟลเดอร์ public/logo.png เพื่อความชัวร์ 100%
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${inter.variable} ${prompt.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      {/* ✅ ใช้ font-prompt เป็นหลักทั้งเว็บไซต์ */}
      <body className={`${prompt.className} bg-white antialiased text-slate-900`}>
        <Navbar />
        
        {/* การจัดการ Layout */}
        <div className="min-h-screen flex flex-col pb-20 md:pb-0">
          <main className="flex-grow">
            {children}
          </main>
        </div>

        {/* Footer: ซ่อนในหน้ามือถือเพื่อความเป็น Application */}
        <div className="hidden md:block">
          <Footer />
        </div>
      </body>
    </html>
  )
}
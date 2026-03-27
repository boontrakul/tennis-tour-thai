import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tennis Tour Thai - Community',
  description: "Thailand's #1 Tennis Community",
  // ✅ ตั้งค่าโลโก้บน Browser Tab (Favicon)
  icons: {
    icon: [
      {
        url: 'https://img5.pic.in.th/file/secure-sv1/tennis-ball-logo.png',
        href: 'https://img5.pic.in.th/file/secure-sv1/tennis-ball-logo.png',
      },
    ],
    apple: [
      {
        url: 'https://img5.pic.in.th/file/secure-sv1/tennis-ball-logo.png',
        href: 'https://img5.pic.in.th/file/secure-sv1/tennis-ball-logo.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* บังคับ viewport ให้เหมาะสมกับมือถือ และรองรับพื้นที่รอยบาก (Safe Area) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} bg-white`}>
        <Navbar />
        
        {/* ✅ การจัดการ Layout:
          - ในมือถือใส่ pb-20 (Padding Bottom) เพื่อเว้นพื้นที่ให้ Bottom Navigation
          - ในคอมพิวเตอร์ (md ขึ้นไป) pb-0 ปกติ
        */}
        <div className="min-h-screen flex flex-col pb-20 md:pb-0">
          <main className="flex-grow">
            {children}
          </main>
        </div>

        {/* ✅ Footer:
          - มักจะซ่อนในหน้ามือถือเพื่อให้ดูเหมือน Application 
          - หากต้องการให้โชว์ในมือถือด้วย ให้ลบ class hidden md:block ออกครับ
        */}
        <div className="hidden md:block">
          <Footer />
        </div>
      </body>
    </html>
  )
}
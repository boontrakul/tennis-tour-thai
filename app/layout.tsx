import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// ✅ ใช้การ import ตามที่คุณระบุ
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
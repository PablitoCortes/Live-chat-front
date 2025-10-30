import './globals.css'
import type { Metadata } from 'next'

import { outfit } from './fonts.ts'
import { AuthProvider } from '@/context/authContext'


export const metadata: Metadata = {
  title: 'Live Chat',
  description: 'Live Chat App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`font-outfit bg-dark-900 text-gray-100`}>
        <AuthProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

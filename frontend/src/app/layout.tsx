import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/authContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Live Chat App',
  description: 'Aplicación de chat en tiempo real',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} h-screen`}>
        <AuthProvider>
        <main className="min-h-screen">{children}</main>
        </AuthProvider>
           
      </body>
    </html>
  );
}

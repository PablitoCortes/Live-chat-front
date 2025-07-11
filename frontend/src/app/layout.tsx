import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConversationProvider } from '@/context/ConversationContext';
import { UserProvider } from '@/context/UserContext';
import { ContactProvider } from '@/context/ContactContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Live Chat App',
  description: 'Aplicación de chat en tiempo real',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <UserProvider>
          <ConversationProvider>
            <ContactProvider>
            <main className="min-h-screen">{children}</main>
            </ContactProvider>
          </ConversationProvider>
        </UserProvider>
      </body>
    </html>
  );
}

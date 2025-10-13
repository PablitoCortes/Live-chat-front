'use client';
import { useState } from 'react';
import { UserIcon, LogOut, ArrowLeft, MessageCircleMore, Contact, MenuIcon } from 'lucide-react';
import Aside from '@/components/Aside/Aside';
import Chat from '@/components/Chat/Chat';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { AsideVariant } from '@/components/Aside/Aside.types';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [asideMode,setAsideMode] = useState<AsideVariant>('conversation')

  const handleAsideChange = (variant: AsideVariant) => { 
    setAsideMode(variant); 
    setIsMenuOpen(!isMenuOpen)
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen text-white bg-primary">
      <button className="md:hidden p-4" onClick={() => setIsMenuOpen(true)}>
        <MenuIcon size={28} />
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-[70%] bg-secondary z-50 p-6 flex flex-col gap-6 md:hidden">
            <button
              onClick={() => handleAsideChange('conversation')}
              className="flex items-center gap-2"
            >
              <MessageCircleMore size={24} />
              <span>Conversaciones</span>
            </button>
            <button
              onClick={() => handleAsideChange('contact')}
              className="flex items-center gap-2"
            >
              <Contact size={24} />
              <span>Contactos</span>
            </button>
            <button onClick={logout} className="flex items-center gap-2 mt-auto">
              <LogOut size={24} />
              <span>Salir</span>
            </button>
          </div>
        </>
      )}

      <section className="hidden md:flex md:flex-col md:w-[5%] h-full py-10 items-center gap-4 bg-secondary">
        <div className="flex md:flex-col gap-4">
          <button onClick={() => handleAsideChange('conversation')}>
            <MessageCircleMore size={29} />
          </button>
          <button onClick={() => handleAsideChange('contact')}>
            <Contact size={29} />
          </button>
        </div>
        <div className="flex md:flex-col mt-auto items-center gap-4">
          <button onClick={() => router.push('/home/profile')}>
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={29}
                height={29}
                className="rounded-full"
              />
            ) : (
              <UserIcon size={29} />
            )}
          </button>
          <button onClick={logout}>
            <LogOut size={29} />
          </button>
        </div>
      </section>

      <div
        className={`
          ${isChatOpen ? 'hidden' : 'flex'}
          flex-col md:flex md:w-[30%] border-r border-border
          h-full bg-primary
        `}
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-border">
          <span className="font-bold text-2xl">Live-Chat</span>
          <button onClick={() => router.push('/home/profile')}>
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <UserIcon size={28} />
            )}
          </button>
        </header>

        <div className="px-4 my-3">
          <input
            type="text"
            placeholder={`${asideMode==='contact'? 'Find a contact': "Search of start a new chat"}`}
            className="w-full p-2 rounded-lg bg-input text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex justify-around mb-3 text-sm text-gray-400">
          <button className="text-white font-medium border-b-2 border-accent">All</button>
          <button>Unread</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Aside
          variant={asideMode}
          />
        </div>
      </div>

      {/* === CHAT === */}
      <div
        className={`
          ${isChatOpen ? 'flex' : 'hidden'}
          md:flex flex-col flex-1 h-full
        `}
      >
        {/* Header (solo en móvil) */}
        <div className="md:hidden flex items-center gap-3 p-3 border-b border-border bg-secondary">
          <button onClick={() => setIsChatOpen(false)}>
            <ArrowLeft size={28} />
          </button>
          <h2 className="font-semibold text-lg">Chat</h2>
        </div>

        <Chat />
      </div>
    </div>
  );
};

export default Home;

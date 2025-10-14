// 🟢 Cambios: mantuve todo tu código y solo marqué las partes modificadas
'use client';
import { useState } from 'react';
import {
  UserIcon,
  LogOut,
  MessageCircleMore,
  Contact,
  MenuIcon,
} from 'lucide-react';
import Aside from '@/components/Aside/Aside';
import Chat from '@/components/Chat/Chat';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { AsideVariant } from '@/components/Aside/Aside.types';
import { useConversation } from '@/context/ConversationContext';
import { useContacts } from '@/context/ContactContext';
import ContactCard from '@/components/Cards/ContactCard';
import ChatCard from '@/components/Cards/ChatCard';

const Home = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const { isChatOpen, userConversations } = useConversation();
  const { allContacts } = useContacts();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [asideMode, setAsideMode] = useState<AsideVariant>('conversation');
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAsideInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // 🔵 Cambiado: solo mostrar el dropMenu si hay texto
    if (value.trim() !== '') {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const filteredConversationResults = userConversations.filter(conv =>
    conv.participants.some(
      p =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.email?.toLowerCase().includes(query.toLowerCase())
    )
  );

  const filteredContactsResults = allContacts.filter(contact =>
    contact.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleAsideChange = (variant: AsideVariant) => {
    setAsideMode(variant);
    setIsMenuOpen(false);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen text-white bg-primary relative">
      <button
        className={`${isChatOpen ? 'hidden' : 'flex'} md:hidden p-4`}
        onClick={() => setIsMenuOpen(true)}
      >
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
        className={`${
          isChatOpen ? 'hidden' : 'flex'
        } flex-col md:flex md:w-[30%] border-r border-border h-full bg-primary relative`}
      >
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

        {/* 🔵 Cambiado: el overlay solo se muestra si hay texto en el input */}
        {query.trim() !== '' && showDropdown && (
          <div
            className="fixed inset-0 bg-black/40 z-10 transition-opacity"
            onMouseDown={() => setShowDropdown(false)} // 🔵 Cambiado: onMouseDown evita conflicto con blur
          />
        )}

        <div className="px-4 my-3 relative z-20">
          <input
            type="text"
            value={query}
            placeholder={
              asideMode === 'contact'
                ? 'Find a contact by email'
                : 'Search or start a new chat'
            }
            onFocus={() => {
              // 🟢 Cambiado: no mostrar nada hasta escribir
              if (query.trim() !== '') setShowDropdown(true);
            }}
            onChange={handleAsideInputChange}
            onBlur={() => {
              // Solo cerrar el dropdown si no hay modales abiertos
              setTimeout(() => {
                const hasOpenModal = document.querySelector('[class*="fixed inset-0"]');
                if (!hasOpenModal) {
                  setShowDropdown(false);
                }
              }, 150);
            }}
            className="w-full p-2 rounded-lg bg-input text-white placeholder-gray-400 focus:outline-none focus:border"
          />

          {showDropdown && query.trim() !== '' && (
            <ul className="absolute z-30 w-[93%] bg-secondary border border-border rounded mt-1 max-h-48 overflow-y-auto shadow">
              {asideMode === 'contact' ? (
                filteredContactsResults.length > 0 ? (
                  filteredContactsResults.map((item, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        setQuery(item.email);
                      }}
                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                    >
                      <ContactCard 
                        contact={item} 
                        onContactClick={() => setShowDropdown(true)}
                      />
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-400 text-sm text-center">
                    No contacts found
                  </li>
                )
              ) : filteredConversationResults.length > 0 ? (
                filteredConversationResults.map((item, index) => {
                  const otherUser = item.participants.find(
                    p => p._id !== user?._id
                  );
                  return (
                    <li
                      key={index}
                      onMouseDown={() => {
                        setQuery(otherUser?.name || '');
                      }}
                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                    >
                      <ChatCard conversation={item} />
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-2 text-gray-400 text-sm text-center">
                  No chats found
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <Aside variant={asideMode} />
        </div>
      </div>

      <div
        className={`${
          isChatOpen ? 'flex' : 'hidden'
        } md:flex flex-col flex-1 h-full`}
      >
        <Chat />
      </div>
    </div>
  );
};

export default Home;

'use client';
import { MessageCirclePlus, Search } from 'lucide-react';
import { useState } from 'react';
import { useConversation } from '@/context/ConversationContext';
import ChatCard from '../Cards/ChatCard';
import NewConversationModal from '../NewConversationModal/NewConversationModal';
import Skeleton from '../Skeleton/Skeleton';

const ConversationsAsideSection = () => {
  const { conversations, isConversationLoading } = useConversation();
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);

  const handleContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNewContactModalOpen(!isNewContactModalOpen);
  };

  if (isConversationLoading) {
    return (
      <div className="p-4 min-h-[8%] ">
      <header className="flex justify-between items-center ">
        <span className="font-bold text-2xl">Live-Chat</span>
        <div className="relative inline-block">
          <Skeleton className="w-8 h-8 rounded-full"/>
          {isNewContactModalOpen && <NewConversationModal />}
        </div>
      </header>
    </div>
    );
  }

  if (!isConversationLoading && conversations.length === 0) {
    return (
      <>
        <div className="p-4 min-h-[8%] ">
          <header className="flex justify-between items-center ">
            <span className="font-bold text-2xl">Live-Chat</span>
            <div className="relative inline-block">
              <button className="flex justify-center items-center" onClick={handleContactModal}>
                <MessageCirclePlus size={29} />
              </button>
              {isNewContactModalOpen && <NewConversationModal />}
            </div>
          </header>
        </div>

        <div className="px-4">
          <div className="flex items-center bg-input rounded-lg">
            <div className="pl-3">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="search"
              placeholder="find conversation"
              className="w-full p-2 rounded-lg focus:outline-none bg-input"
            />
          </div>
        </div>

        <div className="px-4 my-4">
          <ul className="flex gap-4">
            <button className="border min-w-[50px] rounded-xl border-border px-2 text-plain">
              All
            </button>
            <button className="border min-w-[50px] rounded-xl border-border px-2 text-plain">
              Unread
            </button>
          </ul>
        </div>
        <div className='flex justify-center items-center h-full text-2xl text-plain text-center mt-[-100px]'>
        You don´t have any active conversations
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-4 min-h-[8%] ">
        <header className="flex justify-between items-center ">
          <span className="font-bold text-2xl">Live-Chat</span>
          <div className="relative inline-block">
            <button className="flex justify-center items-center" onClick={handleContactModal}>
              <MessageCirclePlus size={29} />
            </button>
            {isNewContactModalOpen && <NewConversationModal />}
          </div>
        </header>
      </div>

      <div className="px-4">
        <div className="flex items-center bg-input rounded-lg">
          <div className="pl-3">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="search"
            placeholder="find conversation"
            className="w-full p-2 rounded-lg focus:outline-none bg-input"
          />
        </div>
      </div>

      <div className="px-4 my-4">
        <ul className="flex gap-4">
          <button className="border min-w-[50px] rounded-xl border-border px-2 text-plain">
            All
          </button>
          <button className="border min-w-[50px] rounded-xl border-border px-2 text-plain">
            Unread
          </button>
        </ul>
      </div>

      <div className="overflow-y-auto px-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2 p-4">
          {conversations.map(conv => (
            <ChatCard key={conv._id} conversation={conv} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ConversationsAsideSection;

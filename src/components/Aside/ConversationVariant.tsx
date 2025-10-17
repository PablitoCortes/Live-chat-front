'use client';
import { useConversation } from '@/context/ConversationContext';
import ChatCard from '../Cards/ChatCard';

const ConversationsAsideSection = () => {
  const { userConversations, isConversationLoading } = useConversation();
  if (!isConversationLoading && userConversations.length === 0) {
    return (

        <div className="flex flex-col items-center justify-center h-full text-2xl text-plain text-center">
        You don’t have any active conversations
        </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="flex flex-col gap-2 p-4">
          {userConversations.map(conv => (
            <ChatCard key={conv._id} conversation={conv} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ConversationsAsideSection;

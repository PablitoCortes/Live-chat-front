'use client';
import { useConversation } from '@/context/ConversationContext';
import ChatCard from '../Cards/ChatCard';
import { DateFormater } from '@/lib/utils/DateFormater';

const ConversationsAsideSection = () => {
  const { userConversations, isConversationLoading, messageCounters } = useConversation();

  if (!isConversationLoading && userConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-2xl text-plain text-center">
        You don’t have any active conversations
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      <div className="flex flex-col gap-2 p-4">
        {userConversations.map(conv => {
          const counterData = messageCounters.find(c => c.conversationId === conv._id);

          const ts =
            counterData?.timestamp ||
            (conv.lastMessage?.timestamp ? DateFormater(conv.lastMessage.timestamp) : '');

          return (
            <ChatCard
              key={conv._id}
              conversation={conv}
              messageCounter={counterData?.counter || 0}
              lastMessage={counterData?.message || conv.lastMessage?.content || ''}
              lastMessageTimeStamp={ts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsAsideSection;

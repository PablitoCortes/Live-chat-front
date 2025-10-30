import { useConversation } from '@/context/ConversationContext';
import { useUser } from '@/context/UserContext';
import { Conversation } from '@/interfaces/Conversation';
import ChatCardSkeleton from '@/ux/components/ChatCardSkeleton';
import { MessageSquare } from 'lucide-react';

interface ChatCardProps {
  conversation: Conversation;
  messageCounter?: number;
  lastMessage?: string;
  lastMessageTimeStamp?: string;
}

const ChatCard: React.FC<ChatCardProps> = ({
  conversation,
  messageCounter,
  lastMessage,
  lastMessageTimeStamp,
}) => {
  const { setSelectedConversation, openChat } = useConversation();
  const { user, isProfileLoading } = useUser();

  const handleActiveConversation = async (conversation: Conversation) => {
    try {
      await setSelectedConversation(conversation);
    } catch (err) {
      console.error('Error al seleccionar la conversación:', err);
    }
  };

  if (isProfileLoading) {
    return <ChatCardSkeleton />;
  }

  const otherParticipant = conversation.participants.find(
    participant => participant._id?.toString() !== user?._id?.toString()
  );

  return (
    <div
      onClick={() => {
        handleActiveConversation(conversation);
        openChat();
      }}
      className="flex h-[72px] mt-auto transition-colors rounded-lg hover:bg-gray-800"
    >
      <div className="flex items-center px-4">
        <MessageSquare size={48} className="text-gray-600" />
      </div>
      <div className="flex w-[85%] flex-col">
        <div className="flex flex-col w-[100%] justify-between p-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-important">{otherParticipant?.name}</h2>
            {messageCounter && messageCounter > 0 ? (
              <span className="relative top-0 right-0 inline-block px-2 text-xs font-bold text-white bg-message rounded-full">
                {messageCounter}
              </span>
            ) : null}
          </div>
          <div className="flex justify-between items-center gap-2">
            <small className="text-plain truncate flex-1 overflow-hidden whitespace-nowrap">
              {lastMessage}
            </small>
            <small className="text-xs text-muted shrink-0">{lastMessageTimeStamp || ''}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;

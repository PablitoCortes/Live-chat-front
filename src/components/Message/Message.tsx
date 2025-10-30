import { Message } from '@/interfaces/Message';
import { FC, ReactNode } from 'react';

type Variant = 'sender' | 'receiver';

interface MessageBubbleProps {
  message: Message;
  variant: Variant;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message, variant }) => {
  if (variant === 'sender') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-message max-w-[70%] rounded-2xl rounded-tr-none p-3 animate-fadeIn">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-message-secondary max-w-[70%] rounded-2xl rounded-tl-none p-3  animate-fadeIn">
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
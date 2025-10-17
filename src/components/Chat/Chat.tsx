import { ArrowLeft, Laugh, Plus, Send } from 'lucide-react';
import { useConversation } from '@/context/ConversationContext';
import { ChangeEvent, useState, KeyboardEvent, MouseEvent, useEffect } from 'react';
import { Message } from '@/interfaces/Message';
import { useUser } from '@/context/UserContext';
import ChatSkeleton from '@/ux/components/ChatSkeleton';
import MessageBubble from '../Message/Message';
import { socket } from '@/socket/socket';

export const Chat = () => {
  const {
    selectedConversation,
    selectedConversationMessages,
    isSelectedConversationLoading,
    isMessagesLoading,
    setSelectedConversationMessages,
  } = useConversation();

  const { user } = useUser();
  const { closeChat } = useConversation();
  const [message, setMessage] = useState<Message>({
    sender: '',
    receiver: '',
    content: '',
    timestamp: new Date(),
    conversationId: '',
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMessage(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const messagesContainer = document.getElementById("messages");
  
    const adjustScroll = () => {
      if (messagesContainer) {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    };
  
    // Scroll inicial
    adjustScroll();
  
    return () => {
      // Cleanup si es necesario
    };
  }, [selectedConversationMessages]);

  
  const submitMessage = async (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (
      !selectedConversation ||
      !user?._id ||
      !selectedConversation._id ||
      message.content.trim() === ''
    ) {
      return;
    }

    const otherParticipant = selectedConversation.participants.find(
      participant => participant._id?.toString() !== user._id?.toString()
    );
    if (!otherParticipant?._id) return;

    const newMessage: Message = {
      receiver: otherParticipant._id,
      content: message.content,
      timestamp: new Date(),
      conversationId: selectedConversation._id,
    };
    socket.emit('new message', newMessage);
    setMessage(prev => ({
      ...prev,
      content: '',
    }));
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.conversationId === selectedConversation?._id) {
        setSelectedConversationMessages(prevMessages => [newMessage, ...prevMessages]);
      }
    };
    socket.on('message created', handleNewMessage);
    return () => {
      socket.off('message created', handleNewMessage);
    };
  }, [selectedConversation?._id, setSelectedConversationMessages]);

  useEffect(() => {
    console.log(selectedConversationMessages);
  }, [selectedConversationMessages]);

  if (!selectedConversation) {
    return (
      <main className="w-full flex flex-col bg-secondary h-screen">
        <div className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-white text-lg font-semibold">
          Selecciona una conversación Para empezar
        </div>
        <section className="w-full h-[100%] px-5 bg-[url('/images/darkbackground.svg')] bg-cover bg-center pt-8"></section>
      </main>
    );
  }

  if (isSelectedConversationLoading || isMessagesLoading) {
    return <ChatSkeleton />;
  }

  const otherParticipant = selectedConversation.participants.find(
    participant => participant._id?.toString() !== user?._id?.toString()
  );

  return (
    <main className="w-full flex flex-col bg-secondary h-full min-h-0">
      {/* HEADER */}
      <header className="w-full h-14 bg-primary flex items-center px-4 font-semibold text-lg gap-2 text-white flex-shrink-0">
        <button onClick={closeChat}>
          <ArrowLeft />
        </button>
        {otherParticipant?.name}
      </header>
  
      {/* MENSAJES */}
      <section
        id="messages"
        className="flex-1 px-5 bg-[url('/images/darkbackground.svg')] bg-cover bg-center pt-8 flex flex-col-reverse gap-2 overflow-y-auto overflow-x-hidden min-h-0"
      >
        {selectedConversationMessages.map((message) => {
          if (message.sender === user?._id) {
            return (
              <MessageBubble key={message._id} variant="sender">
                <div className="flex gap-6 justify-center items-center">
                  <span>{message.content}</span>
                  <small className="self-end mt-1 text-[10px] text-dark">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </MessageBubble>
            );
          }
          return (
            <MessageBubble key={message._id} variant="receiver">
              <div className="flex gap-6 justify-center items-center">
                <span>{message.content}</span>
                <small className="self-end mt-1 text-[10px] text-dark">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </MessageBubble>
          );
        })}
      </section>
  
      {/* INPUT (barra inferior) */}
      <footer className="w-full flex justify-between items-center px-4 py-3 bg-secondary gap-4 border-t border-border flex-shrink-0 pb-safe">
        <button className="w-8 h-8 flex justify-center items-center">
          <Plus size={20} />
        </button>
        <button className="w-8 h-8 flex justify-center items-center">
          <Laugh size={20} />
        </button>
        <input
          type="text"
          name="content"
          value={message.content}
          placeholder="Start typing"
          autoComplete="off"
          className="flex-1 bg-input rounded-3xl px-4 py-2 focus:outline-none focus:ring-0 text-white placeholder-gray-400"
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && submitMessage(e)}
        />
        <button
          type="submit"
          onClick={submitMessage}
          className="w-10 h-10 flex justify-center items-center bg-message rounded-full hover:bg-message/80 transition-colors"
        >
          <Send size={18} className="text-white" />
        </button>
      </footer>
    </main>
  );
  
};

export default Chat;

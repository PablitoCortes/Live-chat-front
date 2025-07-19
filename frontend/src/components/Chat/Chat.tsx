import { Laugh, Plus, Send } from "lucide-react";
import { useConversation } from "@/context/ConversationContext";
import { ChangeEvent, useState, KeyboardEvent, MouseEvent, useEffect } from "react";
import { Message } from "@/interfaces/Message";
import { useUser } from "@/context/UserContext";
import ChatSkeleton from "@/ux/components/ChatSkeleton";
import MessageBubble from "../Message/Message";
import { socket } from "@/socket/socket";

export const Chat = () => {

  const { 
    selectedConversation, 
    selectedConversationMessages,
    isSelectedConversationLoading,
    isMessagesLoading,
    setSelectedConversationMessages
  } = useConversation();

  const { user } = useUser();
  const [message, setMessage] = useState<Message>({
    sender: "",
    receiver: "",
    content: "",
    timestamp: new Date(),
    conversationId: "",
  });


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitMessage = async (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (
      !selectedConversation ||
      !user?._id ||
      !selectedConversation._id ||
      message.content.trim() === ""
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
    socket.emit("new message", newMessage);
    console.log(selectedConversationMessages)
    setMessage((prev) => ({
      ...prev,
      content: "",
    }));
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.conversationId === selectedConversation?._id) {
        setSelectedConversationMessages([...selectedConversationMessages, newMessage]);
      }
    };
    socket.on("message created", handleNewMessage);
    return () => {
      socket.off("message created", handleNewMessage);
    };
  }, [selectedConversation?._id, setSelectedConversationMessages]);

  if (!selectedConversation) {
    return (
      <main className="w-[70%] flex flex-col bg-secondary h-screen">
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
    <main className="w-[70%] flex flex-col bg-secondary h-screen">
      
      <header className="w-full border-1 h-[8%] bg-primary flex items-center px-4 font-semibold text-lg text-white">
        {otherParticipant?.name}
      </header>
      
      <section className="w-full h-[86%] px-5 bg-[url('/images/darkbackground.svg')] bg-cover bg-center pt-8 flex flex-col-reverse gap-2 overflow-y-auto overflow-x-hidden">
        {selectedConversationMessages.map((message) => {
          if (message.sender === user?._id) {
            return <MessageBubble key={message._id}  variant="sender"> {message.content} </MessageBubble>
          }
          return <MessageBubble key={message._id} variant="receiver" > {message.content} </MessageBubble>
        })}
      </section>

      <div className="w-full h-[6%] flex justify-between items-center px-4 py-2  mb-2 gap-4">
        <button className="w-[5%] flex justify-center">
          <Plus />
        </button>
        <button className="w-[5%] flex justify-center">
          <Laugh />
        </button>
        <input
          type="text"
          name="content"
          value={message.content}
          placeholder="Start typing"
          autoComplete="off"
          className="w-[80%] bg-input rounded-3xl px-4 py-2 focus:outline-none focus:ring-0 flex justify-center"
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && submitMessage(e)}
        />
        <div className="w-[5%] flex justify-center items-center">
          <button
            type="submit"
            onClick={submitMessage}
            className="w-10 h-10 rounded-full bg-message flex items-center justify-center hover:bg-message/80 transition-colors"
          >
            <Send size={18} className="text-white -ml-0.5" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Chat;

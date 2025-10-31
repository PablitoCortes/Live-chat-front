"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Conversation } from "@/interfaces/Conversation";
import { conversationService } from "@/services/conversationService";
import { Message } from "@/interfaces/Message";
import { messageService } from "@/services/messageService";
import { useUser } from "./UserContext";
import { socket } from "@/socket/socket";
import {DateFormater} from "@/lib/utils/DateFormater"

interface ConversationContextType {
  userConversations: Conversation[];
  selectedConversation: Conversation | null;
  selectedConversationMessages: Message[];
  messageCounters: {conversationId: string, counter: number, message:string, timestamp: string}[];
  setSelectedConversation: (conversation: Conversation | null) => void;
  setSelectedConversationMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setUserConversations: (messages: Conversation[]) => void;
  createConversation:(contactId:string)=>void;

  isChatOpen: boolean; 
  openChat: () => void; 
  closeChat: () => void; 
  isConversationLoading: boolean;
  isSelectedConversationLoading: boolean;
  isMessagesLoading: boolean;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [selectedConversation, setSelectedConversationState] = useState<Conversation | null>(null);
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const [selectedConversationMessages, setSelectedConversationMessages] = useState<Message[]>([]);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isSelectedConversationLoading, setIsSelectedConversationLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const { user, isProfileLoading } = useUser();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageCounters, setMessageCounters] = useState<{conversationId: string, counter: number, message:string, timestamp: string}[]>([]);



  const setSelectedConversation = useCallback(async (conversation: Conversation | null) => {

    if (!conversation) {
      setSelectedConversationState(null);
      setSelectedConversationMessages([]);
      return;
    }
    if (!conversation._id) {
      setIsSelectedConversationLoading(true);
      return;
    }
    
    setIsSelectedConversationLoading(true);
    setIsMessagesLoading(true);
    
    try {
      const conversationId = conversation._id.toString();
      const conv = await conversationService.getConversation(conversationId);
      setSelectedConversationState(conv.data);
      
      const messages = await messageService.getConversationMessages(conversationId);
      setSelectedConversationMessages(messages.data.messages);
    } catch (err) {
      console.error("Error Loading chat", err);
      setSelectedConversationState(conversation);
      setSelectedConversationMessages([]);
    } finally {
      setIsSelectedConversationLoading(false);
      setIsMessagesLoading(false);
    }
  }, []);
  
  useEffect(() => {
      const getConversations = async () => {
      setIsConversationLoading(true);
      try {
        if(isProfileLoading===false && user){
          const res = await conversationService.getUserConversations();
          if (res.data) {
            setUserConversations(res.data);
          } else {
            setUserConversations([]);
          }
        }
      } catch (err) {
        console.error("Error al cargar conversaciones:", err);
      }finally{
        setIsConversationLoading(false)
      } 
    };
  
    getConversations();
  }, [user, isProfileLoading]);

const selectedConversationRef = useRef(selectedConversation);

useEffect(() => {
  selectedConversationRef.current = selectedConversation;
}, [selectedConversation]);

useEffect(() => {
  if (selectedConversation?._id) {
    setMessageCounters(prev => 
      prev.map(counter => 
        counter.conversationId === selectedConversation._id 
          ? { ...counter, counter: 0 } 
          : counter
      )
    );
  }
}, [selectedConversation]);

useEffect(() => {
  const handler = (newMessage: Message) => {
    if(newMessage.sender=== user?._id){
      return
    }
    setMessageCounters(prev => {
      const exists = prev.find(c => c.conversationId === newMessage.conversationId);
      const ts = DateFormater(newMessage.timestamp)
      if (exists) {
        return prev.map(c =>
          c.conversationId === newMessage.conversationId ? { ...c, counter: c.counter + 1, message: newMessage.content, timestamp: ts } : c
        );
      }
      return [...prev, { conversationId: newMessage.conversationId, counter: 1, message: newMessage.content, timestamp: ts }];
    });
  };

  socket.on("message created", handler);

  return () => {
    socket.off("message created", handler);
  };
}, []);

useEffect(() => {
  if (selectedConversation?._id) {
    setMessageCounters(prev => 
      prev.map(counter => 
        counter.conversationId === selectedConversation._id 
          ? { ...counter, counter: 0 } 
          : counter
      )
    );
  }
}, [selectedConversation]);

const closeChat=()=>{
  setSelectedConversation(null)
  setIsChatOpen(false)
}

  const createConversation = async(contactId:string)=>{
    try{
      const response = await conversationService.createConversation(contactId)
      setUserConversations([...userConversations, response])
      setSelectedConversation(response)
    }catch{

    }
  }
  return (
    <ConversationContext.Provider value={{
      userConversations,
      selectedConversation,
      messageCounters,
      selectedConversationMessages,
      setSelectedConversation,
      setSelectedConversationMessages,
      setUserConversations,
      createConversation,
      isConversationLoading,
      isSelectedConversationLoading,
      isMessagesLoading,
      isChatOpen,
      openChat: () => setIsChatOpen(true),
      closeChat,
    }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) throw new Error("useConversation debe usarse dentro de ConversationProvider");
  return context;
};

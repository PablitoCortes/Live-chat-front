"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Conversation } from "@/interfaces/Conversation";
import { conversationService } from "@/services/conversationService";
import { Message } from "@/interfaces/Message";
import { messageService } from "@/services/messageService";
import { useUser } from "./UserContext";

interface ConversationContextType {
  userConversations: Conversation[];
  selectedConversation: Conversation | null;
  selectedConversationMessages: Message[];
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
  
    useEffect(()=>{
      console.log("conversationContext", userConversations)
    })

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
      closeChat: () => setIsChatOpen(false),
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

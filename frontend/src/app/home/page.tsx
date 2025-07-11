"use client"
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, Contact, Settings, MessageCircleMoreIcon} from "lucide-react"
import Aside from "@/components/Aside/Aside";
import { AsideVariant } from "@/components/Aside/Aside";
import Chat from "@/components/Chat/Chat";
import { useUser } from "@/context/UserContext";
import { useConversation } from "@/context/ConversationContext";
import { useContacts } from "@/context/ContactContext";

// Componente de debug temporal

const Home = () => { 

  const [asideMode, setAsideMode] = useState<AsideVariant>(AsideVariant.Chat);
  
  const handleAsideChange = (variant: AsideVariant) => {
    setAsideMode(variant)
  }; 

  return (
  <div className="flex min-h-screen w-full text-white">
    <section className="min-w-[5%] min-h-[100%] flex flex-col items-center py-10 gap-4 bg-secondary">
      <div className="flex flex-col gap-4">
      <button onClick={()=>handleAsideChange(AsideVariant.Chat)}>
        <MessageCircleMoreIcon size={29} />
      </button>
        <button onClick={()=>handleAsideChange(AsideVariant.Contact)}> 
          <Contact size={29} />
        </button>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <button>
          <UserIcon size={29}/>
        </button>
        <button>
          <Settings size={29} />
        </button>
      </div>
      </section>
      <Aside variant={asideMode}/>
      <Chat></Chat>
  </div>
  ) 
};

export default Home;

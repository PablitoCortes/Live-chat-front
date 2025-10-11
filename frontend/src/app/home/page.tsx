"use client";
import {  useState } from "react";
import { UserIcon, Contact, Settings, MessageCircleMore } from "lucide-react";
import Aside from "@/components/Aside/Aside"; import Chat from "@/components/Chat/Chat"; 
import { AsideVariant } from "@/components/Aside/Aside.types";

const Home = () => {
  
 const [asideMode, setAsideMode] = useState<AsideVariant>("conversation");

  const handleAsideChange = (variant: AsideVariant) => {
     setAsideMode(variant); 
    };
    return (
       <div className="flex w-screen h-screen text-white"> 
       <section className="min-w-[5%] h-full flex flex-col items-center py-10 gap-4 bg-secondary">
         <div className="flex flex-col gap-4">
           <button onClick={() => handleAsideChange("conversation")}> 
            <MessageCircleMore size={29} /> 
           </button> 
           <button onClick={() => handleAsideChange("contact")}> <Contact size={29} /> 
           </button>
           </div>
          <div className="mt-auto flex flex-col gap-4"> 
            <button> 
              <UserIcon size={29} /> 
            </button>
             <button> 
              <Settings size={29} />
            </button> 
           </div> 
        </section> 
        <Aside variant={asideMode} />
       <Chat /> 
     </div>
    );
 }; 
export default Home;
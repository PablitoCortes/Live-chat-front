"use client";
import {  useState } from "react";
import { UserIcon, Contact, MessageCircleMore, LogOut } from "lucide-react";
import Aside from "@/components/Aside/Aside"; import Chat from "@/components/Chat/Chat"; 
import { AsideVariant } from "@/components/Aside/Aside.types";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const Home = () => {
  
 const [asideMode, setAsideMode] = useState<AsideVariant>("conversation");
 const {user} = useUser()
 const {logout} = useAuth()
 const router = useRouter()

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
            <button onClick={()=>router.push("/home/profile")}> 
              {user?.avatarUrl ? 
              <Image src={user.avatarUrl} alt={user.name} width={29} height={29} className="rounded-full"/> 
              : 
              <UserIcon size={29} />}
            </button>
             <button onClick={logout}> 
              <LogOut size={29} />
            </button> 
           </div> 
        </section> 
        <Aside variant={asideMode} />
       <Chat /> 
     </div>
    );
 }; 
export default Home;
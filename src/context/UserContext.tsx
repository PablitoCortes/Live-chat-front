"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/interfaces/User";
import { userService } from "@/services/userService";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isProfileLoading:boolean;
  updateProfilePicture:(file: File, userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  useEffect(()=>{
    const loadUserProfile = async () => {
      try {
        // Pequeño delay para asegurar que las cookies estén disponibles
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const res = await userService.getProfile();
        if (res?.data) {
          setUser(res.data);
        }
        else{
          setUser(null)
        }
      }catch (err){
        console.log("Error loading user profile:", err);
        setUser(null);
      }
      finally {
        setIsProfileLoading(false);
      }
    };
    loadUserProfile()
  },[])

  useEffect(()=>{
    console.log(user)
  })

  const updateProfilePicture = async(file:File, userId:string)=>{
   const response = await userService.uploadProfilePicture(file,userId)
   if(response?.data && user){
     // Actualizar el usuario con la nueva URL de la imagen
     setUser({...user, avatarUrl: response.data})
   }
  }

  return (
    <UserContext.Provider value={{ user, setUser,isProfileLoading, updateProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

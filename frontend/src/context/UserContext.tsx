"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/interfaces/User";
import { userService } from "@/services/userService";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isProfileLoading:boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  useEffect(()=>{
    const loadUserProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res?.data) {
          setUser(res.data);
        }
        else{
          setUser(null)
        }
      }catch (err){
        throw err
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

  return (
    <UserContext.Provider value={{ user, setUser,isProfileLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

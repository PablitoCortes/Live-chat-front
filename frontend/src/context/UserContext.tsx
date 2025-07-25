"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/interfaces/User";
import { userService } from "@/services/userService";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoginComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isProfileLoaded:boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  
  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res && res.data) {
          setUser(res.data);
          setIsProfileLoaded(true);
        }
        setIsProfileLoaded(false)
      } catch (err) {
        setUser(null)
        setIsProfileLoaded(false);
      } 
  };  
    loadUserProfile()
  },[])

  const login = async (email: string, password: string) => {
    setIsLoginComplete(false);
    try {
      const res = await userService.login({ email, password });
      if (!res || !res.data?.user) {
        setUser(null);
        return;
      }
      setUser(res.data.user);
    } catch (err) {
      throw err;
    } finally {
      setIsLoginComplete(true);
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
    } catch (err) {
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoginComplete, setUser, login, logout,isProfileLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

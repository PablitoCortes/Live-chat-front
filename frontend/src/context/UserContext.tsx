"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/interfaces/User";
import { userService } from "@/services/userService";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isProfileLoaded:boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  
  
  const loadUserProfile = async () => {
  try {
    const res = await userService.getProfile();
    if (res?.data) {
      setUser(res.data);
    }
  }catch {
  if (!user) setUser(null);
  }
 finally {
    setIsProfileLoaded(true);
  }
};

  useEffect(() => {
    loadUserProfile()
  },[])

  const login = async (email: string, password: string) => {
    try {
      const res = await userService.login({ email, password });
      if (res && res.data?.user) {
        setIsProfileLoaded(false)
      } else {
        setUser(null)
      }
    } catch (err) {
      throw err;
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
    <UserContext.Provider value={{ user, setUser, login, logout,isProfileLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

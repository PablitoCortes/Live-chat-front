"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/interfaces/User";
import { userService } from "@/services/userService";

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserProfile: ()=>void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 
    const loadUserProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
  };
  
  useEffect(() => {
    loadUserProfile()
  },[])

  const login = async (email: string, password: string) => {
    setLoading(true);
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
      setLoading(false);
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
    <UserContext.Provider value={{ user, loading, setUser, login, loadUserProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

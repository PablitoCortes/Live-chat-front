'use client';
import React, { createContext, useContext } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  logout: () => void;
  login: (email: string, password: string) => void;
  googleLogin: () => void;
  register: (email: string, name: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
    } catch (err) {
      throw err;
    }
  };

  const googleLogin = () => {
    authService.googleLogin();
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      const data = await authService.register({ email, name, password });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error desconocido';
        throw new Error(message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      router.replace('/auth/login');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};

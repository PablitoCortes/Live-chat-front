import { LoginData, RegisterData } from "@/interfaces/User";
import { apiClient } from "./apiClient";

export const authService ={

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  googleLogin: async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/google`;
  },
}
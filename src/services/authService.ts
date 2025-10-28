import { LoginData, RegisterData } from "@/interfaces/User";
import { apiClient } from "./apiClient";

export const authService ={

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  googleLogin: async () => {
    const returnTo = "/api/auth/exchange";
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}&connection=google-oauth2`;
  },
}
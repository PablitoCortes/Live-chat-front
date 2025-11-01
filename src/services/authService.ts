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

  recoverPassword: async (email: string, newPassword: string) => {
    const response = await apiClient.put('/auth/recover-password', {
      userEmail: email,
      newPassword: newPassword
    });
    return response.data;
  }
}
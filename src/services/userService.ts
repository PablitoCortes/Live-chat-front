import { User } from '@/interfaces/User';
import { apiClient } from './apiClient';

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get(`users/profile`, {
    })
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put(`users/profile/update`, data, {
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete(`users/delete`, {
    });
    return response.data;
  },

  uploadProfilePicture: async (file:File, userId:string)=>{
    const formData= new FormData()
    formData.append("avatar",file)  // ← Cambiado de "file" a "avatar"
    formData.append("userId",userId)

    const response = await apiClient.post('upload/avatar',formData,{ headers: { "Content-Type": "multipart/form-data" }})
    return response.data
  }

};

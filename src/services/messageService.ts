import { apiClient } from "./apiClient";


export const messageService = {
  // Crear mensaje
  createMessage: async (data: { 
    content: string; 
    conversationId: string;
    receiver: string;
  }) => {
    const response = await apiClient.post(`messages/create`, data);
    return response.data;
  },

  getConversationMessages: async (conversationId: string, page: number = 1, limit: number = 20) => {
    const response = await apiClient.get(`messages/${conversationId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Eliminar mensaje
  deleteMessage: async (messageId: string) => {
    const response = await apiClient.delete(`messages/delete/${messageId}`);
    return response.data;
  },
};

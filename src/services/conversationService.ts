import { apiClient } from "./apiClient";

export const conversationService = {

  createConversation: async (contactId: string) => {
    const response = await apiClient.post(`/create`, { contactId });
    return response.data;
  },

  getUserConversations: async () => {
    const response = await apiClient.get(`/conversations`);
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  },

  // Eliminar conversación
  deleteConversation: async (conversationId: string) => {
    const response = await apiClient.delete(`/conversations/${conversationId}`);
    return response.data;
  },
};

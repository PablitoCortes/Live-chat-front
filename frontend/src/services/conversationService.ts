import axios from 'axios';

const CONVERSATION_API_URL = process.env.NEXT_PUBLIC_CONVERSATION_API_URL;

export const conversationService = {

  createConversation: async (contactId: string) => {
    const response = await axios.post(`${CONVERSATION_API_URL}/create`, { contactId });
    return response.data;
  },

  getUserConversations: async () => {
    const response = await axios.get(`${CONVERSATION_API_URL}`);
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await axios.get(`${CONVERSATION_API_URL}/${conversationId}`);
    return response.data;
  },

  // Eliminar conversación
  deleteConversation: async (conversationId: string) => {
    const response = await axios.delete(`${CONVERSATION_API_URL}/${conversationId}`);
    return response.data;
  },
};

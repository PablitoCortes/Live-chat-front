import axios from 'axios';

const NEXT_PUBLIC_MESSAGE_API_URL = process.env.NEXT_PUBLIC_MESSAGE_API_URL;

export interface Message {
  messageId: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date;
}

export const messageService = {
  // Crear mensaje
  createMessage: async (data: { 
    content: string; 
    conversationId: string;
    receiver: string;
  }) => {
    const response = await axios.post(`${NEXT_PUBLIC_MESSAGE_API_URL}/create`, data);
    return response.data;
  },

  getConversationMessages: async (conversationId: string, page: number = 1, limit: number = 20) => {
    const response = await axios.get(`${NEXT_PUBLIC_MESSAGE_API_URL}/${conversationId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Eliminar mensaje
  deleteMessage: async (messageId: string) => {
    const response = await axios.delete(`${NEXT_PUBLIC_MESSAGE_API_URL}/delete/${messageId}`);
    return response.data;
  },
};

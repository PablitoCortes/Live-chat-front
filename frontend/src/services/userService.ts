import { RegisterData, LoginData, User } from '@/interfaces/User';
import axios from 'axios';

const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:3000/api/users';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const userService = {
  register: async (data: RegisterData) => {
    const response = await axios.post(`${USER_API_URL}/register`, data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axios.post(`${USER_API_URL}/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${USER_API_URL}/logout`, {}, {
    
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get(`${USER_API_URL}/profile`, {
    })
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await axios.put(`${USER_API_URL}/profile/update`, data, {
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await axios.delete(`${USER_API_URL}/delete`, {
    });
    return response.data;
  },

  getContacts: async () => {
    const response = await axios.get(`${USER_API_URL}/contacts`, {
      
    });
    return response.data;
  },

  addContact: async (contactEmail: string) => {
    const response = await axios.put(`${USER_API_URL}/contacts/add`, 
      { contactEmail }, 
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  },

  deleteContact: async (contactId: string) => {
    const response = await axios.delete(`${USER_API_URL}/contacts/${contactId}`, {
    });
    return response.data;
  },
};

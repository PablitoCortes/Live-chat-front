import { apiClient } from "./apiClient";

export const contactService = {

getContacts: async () => {
    const response = await apiClient.get('/api/contacts');
    return response.data;
  },

  addContact: async (contactEmail: string) => {
    const response = await apiClient.put('/api/contacts/add', 
      { contactEmail }
    );
    return response.data;
  },

  deleteContact: async (contactId: string) => {
    const response = await apiClient.delete(`/api/contacts/${contactId}`);
    return response.data;
  },

}
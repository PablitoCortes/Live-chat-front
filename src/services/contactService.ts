import { apiClient } from "./apiClient";

export const contactService = {

  getContacts: async () => {
    const response = await apiClient.get('/contacts');
    return response.data;
  },
  getAllContacts: async()=>{
    const response = await apiClient.get('contacts/all');
    return response.data
  },

  addContact: async (contactEmail: string) => {
    const response = await apiClient.put('/contacts/add', 
      { contactEmail }
    );
    return response.data;
  },

  deleteContact: async (contactId: string) => {
    const response = await apiClient.delete(`/contacts/${contactId}`);
    return response.data;
  },

}
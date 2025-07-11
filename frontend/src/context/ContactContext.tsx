"use client"
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User } from '@/interfaces/User';
import { userService } from '@/services/userService';

interface ContactContextType {
  contacts: User[];
  isLoading: boolean;
  addContact: (contactEmail: string) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserContacts = async () => {  
      setIsLoading(true);
      try {
        const res = await userService.getContacts();
        if (!res || !res.data) {
          setContacts([]);
          return;
        }
        setContacts(res.data);
      } catch (err) {
        console.error('Error obteniendo contactos:', err);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    }
    getUserContacts()
  }, []);

  const addContact = useCallback(async (contactEmail: string) => {
    setIsLoading(true);
    try {
      const res = await userService.addContact(contactEmail);
    } catch (err) {
      console.error('Error agregando contacto:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContact = useCallback(async (contactId: string) => {
    setIsLoading(true);
    try {
      const res = await userService.deleteContact(contactId);
      if (res && res.data) {
        setContacts(prevContacts => 
          prevContacts.filter(contact => contact._id !== contactId)
        );
      }
    } catch (err) {
      console.error('Error eliminando contacto:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ContactContext.Provider value={{ 
      contacts, 
      isLoading, 
      addContact, 
      deleteContact 
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts debe usarse dentro de ContactProvider');
  }
  return context;
};

"use client"
import { createContext, useContext, useState, ReactNode, useCallback,useEffect } from 'react';
import { User } from '@/interfaces/User';
import { userService } from '@/services/userService';
import { useUser } from './UserContext';

interface ContactContextType {
  contacts: User[];
  isContactsLoading: boolean;
  addContact: (contactEmail: string) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [isContactsLoading, setIsContactsLoading] = useState(false);
  const { user, isProfileLoaded } = useUser();

 
  useEffect(() => {
    setIsContactsLoading(true);
    const getUserContacts = async () => { 
      try {
        if(user?._id && isProfileLoaded){
        const res = await userService.getContacts();
        if (!res || !res.data) {
          setContacts([]);
          return;
        }
        setContacts(res.data);
        }
      } catch (err) {
        console.error('Error obteniendo contactos:', err);
        setContacts([]);
        setIsContactsLoading(false);
      }
    }
   getUserContacts()
  },[user])
  
  const addContact = useCallback(async (contactEmail: string) => {
    try {
      const res = await userService.addContact(contactEmail);
    } catch (err) {
      console.error('Error agregando contacto:', err);
      throw err;
    } finally {
    }
  }, []);

  const deleteContact = useCallback(async (contactId: string) => {
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
    }
  }, []);

  return (
    <ContactContext.Provider value={{ 
      contacts, 
      isContactsLoading, 
      addContact, 
      deleteContact,
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

"use client"
import { createContext, useContext, useState, ReactNode, useCallback,useEffect } from 'react';
import { User } from '@/interfaces/User';
import { useUser } from './UserContext';
import { contactService } from '@/services/contactService';

interface ContactContextType {
  contacts: User[];
  allContacts: User[];
  isContactsLoading: boolean;
  isAllContactsLoading: boolean;
  addContact: (contactEmail: string) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [allContacts, setAllContacts]= useState<User[]>([]);
  const [isAllContactsLoading, setIsAllContactsLoading] = useState(false);
  const [isContactsLoading, setIsContactsLoading] = useState(false);
  const { user, isProfileLoading } = useUser();

useEffect(()=>{
  const getAllContacts = async()=>{
    try{
      setIsAllContactsLoading(true)
      const res = await contactService.getAllContacts()
      if(res.data){
        setAllContacts(res.data)
      }
      else{
        setAllContacts([])
      }
    }catch(err){
      console.error(err)
    }
  }
  getAllContacts()
},[])

useEffect(() => {
  const getUserContacts = async () => {
    try {
      setIsContactsLoading(true);
      const res = await contactService.getContacts();
      if(res.data){
        setContacts(res.data);
      }
    } catch (err) {
      console.error('Error obteniendo contactos:', err);
      setContacts([]);
    } finally {
      setIsContactsLoading(false);
    }
  };

  getUserContacts();
}, [user, isProfileLoading]);


  
  const addContact = useCallback(async (contactEmail: string) => {
    try {
      await contactService.addContact(contactEmail);
    } catch (err) {
      console.error('Error agregando contacto:', err);
      throw err;
    } finally {
    }
  }, []);

  const deleteContact = useCallback(async (contactId: string) => {
    try {
      const res = await contactService.deleteContact(contactId);
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
      isAllContactsLoading,
      allContacts
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

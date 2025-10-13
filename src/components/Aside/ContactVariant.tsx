'use client';
import { useContacts } from '@/context/ContactContext';
import ContactCard from '../Cards/ContactCard';

const ContactsAsideSection = () => {
  const { contacts, isContactsLoading } = useContacts();


  if(!isContactsLoading && contacts.length===0){
    return(
      <div className='flex flex-col items-center justify-center h-full text-2xl text-plain text-center'>
        You don´t have any contact
      </div>
    )
  }
  return (
    <>
      <div className="overflow-y-auto px-4 flex flex-col gap-4">
        {contacts.map(cont => (
          <ContactCard key={cont._id} contact={cont} />
        ))}
      </div>
    </>
  );
};

export default ContactsAsideSection;

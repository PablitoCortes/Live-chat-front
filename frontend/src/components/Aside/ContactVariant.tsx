'use client';
import { Search, UserPlus } from 'lucide-react';
import { useContacts } from '@/context/ContactContext';
import ContactCard from '../Cards/ContactCard';
import AsideContactVariantSkeleton from '@/ux/components/AsideContactVariantSkeleton';
import Skeleton from '../Skeleton/Skeleton';

const ContactsAsideSection = () => {
  const { contacts, isContactsLoading } = useContacts();

  if (isContactsLoading){
    return(
      <div>

      <div className="p-4 min-h-[8%] ">
      <header className="flex justify-between items-center ">
        <span className="font-bold text-2xl">Live-Chat</span>
        <Skeleton className="w-8 h-8 rounded-full"/>
      </header>
    </div>
      <AsideContactVariantSkeleton/>
      </div>
    )
  }

  if(!isContactsLoading && contacts.length===0){
    return(
      <>
      <div className="p-4 min-h-[8%] ">
        <header className="flex justify-between items-center ">
          <span className="font-bold text-2xl">Live-Chat</span>
          <button className="flex justify-center items-center">
            <UserPlus size={29} />
          </button>
        </header>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center bg-input rounded-lg">
          <div className="pl-3">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="search"
            placeholder="find contact"
            className="w-full p-2 rounded-lg focus:outline-none bg-input"
          />
        </div>
      </div>
      <div className='flex justify-center items-center h-full text-2xl text-plain mt-[-100px]'>
        You don´t have any contact
        </div>
    </>
    )
  }
  return (
    <>
      <div className="p-4 min-h-[8%] ">
        <header className="flex justify-between items-center ">
          <span className="font-bold text-2xl">Live-Chat</span>
          <button className="flex justify-center items-center">
            <UserPlus size={29} />
          </button>
        </header>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center bg-input rounded-lg">
          <div className="pl-3">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="search"
            placeholder="find contact"
            className="w-full p-2 rounded-lg focus:outline-none bg-input"
          />
        </div>
      </div>

      <div className="overflow-y-auto px-4 flex flex-col gap-4">
        {contacts.map(cont => (
          <ContactCard key={cont._id} contact={cont} />
        ))}
      </div>
    </>
  );
};

export default ContactsAsideSection;

import { useUser } from '@/context/UserContext';
import { User } from '@/interfaces/User';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import NewConversationModal from '../NewConversationModal/NewConversationModal';

interface CardProps {
  contact: User;
  onContactClick?: () => void;
}

const ContactCard: React.FC<CardProps> = ({ contact, onContactClick }) => {
  const { user } = useUser();
  const [isNewContactModalOpen, setIsAddContactModalOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <div
        className="flex h-[72px] mt-auto transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsAddContactModalOpen(true);
          onContactClick?.();
        }}
      >
        <div className="flex items-center px-4">
          <MessageSquare size={48} className="text-gray-600" />
        </div>
        <div className="flex w-[85%] flex-col">
          <div className="flex flex-col w-[100%] justify-between p-3">
            <h2 className="text-lg font-semibold text-important">{contact.name}</h2>
            <div className="flex justify-between items-center">
              <small className="text-plain">{contact.email || 'Sin email'}</small>
            </div>
          </div>
        </div>
      </div>

      {isNewContactModalOpen && (
        <NewConversationModal
          contact={contact}
          setIsAddContactModalOpen={setIsAddContactModalOpen}
        />
      )}
    </div>
  );
};

export default ContactCard;

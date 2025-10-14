import { useUser } from '@/context/UserContext';
import { socket } from '@/socket/socket';
import { useConversation } from '@/context/ConversationContext';
import { User } from '@/interfaces/User';
import { useContacts } from '@/context/ContactContext';
import { useEffect } from 'react';
import { Conversation } from '@/interfaces/Conversation';

interface NewConversationModalProps {
  contact: User;
  setIsAddContactModalOpen: (value: boolean) => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  contact,
  setIsAddContactModalOpen,
}) => {
  const { user } = useUser();
  const { setSelectedConversation, userConversations, setUserConversations,openChat } = useConversation();
  const { addContact } = useContacts();

  const handleNewConversation = async (contactId: string) => {
    if (contactId === user?._id) {
      return alert('Cannot create a conversation with yourself');
    }

    try {
      if (contact && contact.email) {
        await addContact(contact.email);
      }

      socket.emit('new conversation', {
        participants: [contactId, user?._id],
      });
    } catch(err) {
      alert(err)
    }
  };

  useEffect(() => {
    const handleConversationCreated = (data:Conversation) => {
      
      setSelectedConversation(data);
      setUserConversations([...userConversations, data]);
      setIsAddContactModalOpen(false);
			openChat()
    };

    const handleConversationError = (data: { message: string }) => {
      if (data.message.includes('already exists') || data.message.includes('duplicate')) {
        alert('Ya tienes una conversación con este usuario');
      } else {
        alert(`Error creating conversation: ${data.message}`);
      }
    };

    socket.on('conversation created', handleConversationCreated);
    socket.on('newConversationError', handleConversationError);

    return () => {
      socket.off('conversation created', handleConversationCreated);
      socket.off('newConversationError', handleConversationError);
    };
  }, [userConversations, setSelectedConversation, setUserConversations, setIsAddContactModalOpen,openChat]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn"
      onClick={() => setIsAddContactModalOpen(false)}
    >
      <div 
        className="bg-primary p-6 rounded-xl shadow-2xl max-w-md w-[90%] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-semibold text-center text-white">
          {`Do you want to create a conversation with ${contact.name}?`}
        </h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => contact._id && handleNewConversation(contact._id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={() => setIsAddContactModalOpen(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;

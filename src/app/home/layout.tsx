import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { ContactProvider } from '@/context/ContactContext';
import { ConversationProvider } from '@/context/ConversationContext';
import { UserProvider } from '@/context/UserContext';

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ProtectedRoute>
        <ConversationProvider>
          <ContactProvider>{children}</ContactProvider>
        </ConversationProvider>
      </ProtectedRoute>
    </UserProvider>
  );
}

export default HomeLayout;

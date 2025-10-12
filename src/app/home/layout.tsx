import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { ContactProvider } from "@/context/ContactContext";
import { ConversationProvider } from "@/context/ConversationContext";
import { UserProvider } from "@/context/UserContext";

function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
        <ConversationProvider>
          <ContactProvider>
            <ProtectedRoute>
           {children}
            </ProtectedRoute>
          </ContactProvider>
        </ConversationProvider>
      </UserProvider>
    );
  }


  export default HomeLayout
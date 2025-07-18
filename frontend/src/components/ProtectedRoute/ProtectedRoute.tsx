import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  console.log(user)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Cargando sesión...</div>; // spinner opcional

  return <>{children}</>;
};

export default ProtectedRoute;

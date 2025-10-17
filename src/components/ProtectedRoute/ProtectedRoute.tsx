"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isProfileLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isProfileLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isProfileLoading, router]);

  if (isProfileLoading) {

    return <div>Cargando...</div>
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

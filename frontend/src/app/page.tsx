'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const Page = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  console.log(user)
  useEffect(() => {
    if (loading) return; 

    if (user) {
      router.replace("/home");
    } else {
      router.replace("/login"); 
    }
  }, [user, loading, router]);

  return null;
};

export default Page;

// 'use client'

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/context/UserContext";

// const Page = () => {
//   const router = useRouter();
//   const { user, isProfileLoaded } = useUser();


//   useEffect(() => {
//     if (!isProfileLoaded) {
//       return
//     }
//     if (user) {
//       router.replace("/login");
//     } else {
//       router.replace("/login"); 
//     }
//   }, [user, isProfileLoaded, router]);

//   return null;
// };

// export default Page;

import React from "react";
import Image from "next/image";
import { authService } from "@/services/authService";


const GoogleLoginButton = () => {

  const handleGoogleLogin =async () => {
    await authService.googleLogin()
  };

  return (
    <div className="w-full">
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-lg flex items-center justify-center gap-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="flex gap-4">
          Iniciar sesión con Google
          <Image
          src={"https://developers.google.com/identity/images/g-logo.png"}
          width={25}
          height={25}
          alt="google-logo"
          >
          
          </Image>
        </span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;

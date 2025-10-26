import React from "react";
import Image from "next/image";
import {signIn} from 'next-auth/react';

const buttonProps = {
  register: {
    text: "Register with Google",
  },
  login: {
    text: "Login with Google",
  },
};

type GoogleLoginButtonProps = {
  variant?: "register" | "login";
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ variant = "login" }) => {

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/home" });
  };

  const text = buttonProps[variant].text;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-lg flex items-center justify-center gap-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="flex gap-4">
          {text}
          <Image
            src={"https://developers.google.com/identity/images/g-logo.png"}
            width={25}
            height={25}
            alt="google-logo"
          />
        </span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;

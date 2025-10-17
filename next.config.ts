import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://live-chat-back-qjac.onrender.com/api/:path*", // tu backend
      },
    ];
  },
  images:{
    domains: ['developers.google.com','res.cloudinary.com',"lh3.googleusercontent.com"]
  }
  

};

export default nextConfig;

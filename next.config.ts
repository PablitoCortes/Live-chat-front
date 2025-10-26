import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self' data: blob: http://localhost:3000 https://live-chat-front-xutz.onrender.com;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com;
              connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://live-chat-back-qjac.onrender.com;
              img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com https://developers.google.com;
              style-src 'self' 'unsafe-inline';
              frame-src 'self' https://accounts.google.com;
              frame-ancestors 'self';
              font-src 'self' data:;
            `.replace(/\s{2,}/g, " "),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://live-chat-back-qjac.onrender.com/api/:path*", // proxy al backend
      },
    ];
  },

  images: {
    domains: [
      "developers.google.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;

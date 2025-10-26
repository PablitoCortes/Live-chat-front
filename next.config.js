const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const connectSources = [
      "'self'",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
      "https://live-chat-back-qjac.onrender.com",
      "wss://live-chat-back-qjac.onrender.com",
    ];

    if (isDev) {
      connectSources.push("http://localhost:5500", "ws://localhost:5500");
    }

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://lh3.googleusercontent.com https://res.cloudinary.com",
      `connect-src ${connectSources.join(" ")}`,
      "frame-src https://accounts.google.com",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
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

module.exports = nextConfig;

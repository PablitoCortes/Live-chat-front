import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none", // necesario para cross-site
        path: "/",
        secure: process.env.NODE_ENV === "production", // solo HTTPS
      },
    },
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log para debugging
      console.log("🔐 SignIn callback:", { 
        user: user?.email, 
        account: account?.provider,
        profile: profile?.email 
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, usar baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Si la URL es del mismo dominio, permitirla
      else if (new URL(url).origin === baseUrl) return url;
      // Por defecto, ir al exchange
      return `${baseUrl}/api/auth/exchange`;
    },
  },
});

export { handler as GET, handler as POST };

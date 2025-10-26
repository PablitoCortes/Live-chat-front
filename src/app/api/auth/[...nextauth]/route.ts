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
  session:{
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
      async signIn() {
    // en lugar de fetch directo, redirige a /api/auth/exchange (o llama y luego redirect)
    return true; // dejamos que NextAuth complete el flujo
  },
  async redirect({ baseUrl }) {
    // después del callback, redirigir a la ruta de intercambio
    return `${baseUrl}/api/auth/exchange`;
  }
  },
});


export { handler as GET, handler as POST };

import { prismaClient } from "@/app/LIB/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          await prismaClient.user.create({
            data: {
              email: user.email,
              provider: "Google"
            }
          });
        }
      } catch (e) {
        console.error("Error creating user", e);
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      // Only on initial sign-in
      if (user?.email) {
        const dbUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          token.id = dbUser.id; // ✅ assign DB user ID to token
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; // ✅ inject into session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // ✅ using JWT strategy
  },
});

export { handler as GET, handler as POST };


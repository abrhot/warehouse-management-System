import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Use JWT for session strategy
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Return user object with a string ID, which NextAuth requires
        return {
          id: user.id, // User.id is already a string based on your schema (cuid)
          email: user.email,
          role: user.role as string, // Ensure role is a string
        };
      }
    })
  ],
  // Callbacks are used to control what happens when an action is performed
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // On initial sign-in, add user properties to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }) {
      // Pass token properties to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Redirect users to /login if they are not signed in
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
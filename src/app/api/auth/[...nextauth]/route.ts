// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { login } from "@/lib/auth" // <-- Using your existing login function

export const authOptions = {
  pages: {
    signIn: '/login', // Redirect users to your custom login page
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Use your custom login logic to verify the user
        const user = await login(credentials.email, credentials.password)

        if (user) {
          // Return the user object if login is successful
          return user
        }
        // Return null if login fails
        return null
      },
    }),
  ],
  callbacks: {
    // This callback includes the user's ID and role in the session token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // This callback makes the user's ID and role available in the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
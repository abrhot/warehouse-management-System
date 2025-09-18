// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Declares the properties we want to augment for `next-auth`.
 */
declare module "next-auth" {
  /**
   * Extends the default `Session` to include custom properties.
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context.
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the default `User` to include custom properties.
   * The user object returned by the `authorize` callback.
   */
  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

/**
 * Declares the properties we want to augment for `next-auth/jwt`.
 */
declare module "next-auth/jwt" {
  /**
   * Extends the default `JWT` to include custom properties.
   * Returned by the `jwt` callback and `getToken`.
   */
  interface JWT {
    id: string;
    role: string;
  }
}
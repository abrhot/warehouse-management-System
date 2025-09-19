import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the NextAuth handler using your authOptions
const handler = NextAuth(authOptions);

// Export for both GET and POST requests (required in App Router)
export { handler as GET, handler as POST };

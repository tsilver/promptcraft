import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Create the handler using the config
const handler = NextAuth(authOptions);

// Export the handler functions
export { handler as GET, handler as POST }; 
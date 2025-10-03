import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID. */
      id: string;
      /** The user's roles from STS. */
      roles?: string[];
    } & DefaultSession["user"];
  }

  interface JWT {
    /** The user's roles from STS. */
    roles?: string[];
  }
} 
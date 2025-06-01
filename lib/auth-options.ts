import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

// Configuration for NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ token, account, profile }) => {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    signIn: async ({ user, account, profile }) => {
      console.log("SignIn callback executed", { userId: user.id, email: user.email });
      
      if (user.email) {
        // Create or update user in the database
        try {
          const result = await prisma.user.upsert({
            where: { 
              id: user.id as string 
            },
            update: {
              name: user.name,
              email: user.email,
              image: user.image,
              updatedAt: new Date(),
            },
            create: {
              id: user.id as string,
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
          
          console.log("User upserted successfully", { userId: result.id });
          
          // Create an initial anonymous tracking profile if none exists
          const anonymousId = generateAnonymousId();
          try {
            const existingProfile = await prisma.anonymousTrackingProfile.findFirst({
              where: {
                userId: user.id as string,
              },
            });
            
            if (existingProfile) {
              // Update existing profile
              await prisma.anonymousTrackingProfile.update({
                where: {
                  id: existingProfile.id,
                },
                data: {
                  lastSeen: new Date(),
                },
              });
            } else {
              // Create new profile
              await prisma.anonymousTrackingProfile.create({
                data: {
                  anonymousId,
                  userId: user.id as string,
                  firstSeen: new Date(),
                  lastSeen: new Date(),
                  metadata: { source: 'direct_signin' },
                },
              });
            }
          } catch (error) {
            console.error("Error managing anonymous tracking profile:", error);
          }
        } catch (error) {
          console.error("Error creating/updating user in database:", error);
          // Continue sign in even if database operation fails
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode to see detailed logs
};

// Helper function to generate a random anonymous ID
function generateAnonymousId() {
  return `anon_${Math.random().toString(36).substring(2, 15)}`;
} 
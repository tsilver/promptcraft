import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import { exchangeTokenForRoles } from "./sts";

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
      console.log('🔄 AUTH: Session callback triggered');
      console.log('🔄 AUTH: Token roles:', token.roles);
      
      if (session?.user && token.sub) {
        session.user.id = token.sub;
        session.user.roles = token.roles as string[] | undefined;
        
        console.log('✅ AUTH: Session updated with roles:', session.user.roles);
        console.log('✅ AUTH: Complete session user:', {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          roles: session.user.roles
        });
      }
      return session;
    },
    jwt: async ({ token, account, profile }) => {
      console.log('🔄 AUTH: JWT callback triggered');
      console.log('🔄 AUTH: Account present:', !!account);
      console.log('🔄 AUTH: ID token present:', !!account?.id_token);
      
      if (account) {
        token.accessToken = account.access_token;
        
        // Exchange Google ID token for STS roles
        if (account.id_token) {
          console.log('🔄 AUTH: Starting STS token exchange...');
          try {
            const roles = await exchangeTokenForRoles(account.id_token);
            token.roles = roles || [] as string[];
            console.log('✅ AUTH: STS exchange completed, roles assigned to token:', token.roles);
          } catch (error) {
            console.error('❌ AUTH: Failed to fetch user roles from STS:', error);
            token.roles = [] as string[];
          }
        } else {
          console.log('⚠️ AUTH: No ID token available for STS exchange');
          token.roles = [] as string[];
        }
      } else {
        console.log('🔄 AUTH: No account in JWT callback, keeping existing token roles:', token.roles);
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
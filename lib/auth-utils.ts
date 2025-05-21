import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

// Function to get the session on the server side
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

// Function to check if a user is authenticated (for server components/API routes)
export async function isAuthenticated() {
  const session = await getServerAuthSession();
  return !!session?.user;
}

// Function to get the current user's ID from session (for server components/API routes)
export async function getCurrentUserId() {
  const session = await getServerAuthSession();
  return session?.user?.id;
} 
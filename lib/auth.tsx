'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';
import prisma from './prisma';

// Define user type
type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
} | null;

// Define auth context type
type AuthContextType = {
  user: User;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// Auth Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Export auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);

  // Check if Supabase is configured
  useEffect(() => {
    // Check if Supabase URL and anon key are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase configuration missing. Auth functionality will be disabled.');
      setIsSupabaseConfigured(false);
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase session error:', error.message);
          return;
        }
        
        if (data?.session) {
          // Get user data if session exists
          const { user: authUser } = data.session;
          
          if (authUser) {
            // Find or create user in the database
            await ensureUserInDatabase({
              id: authUser.id,
              email: authUser.email || '',
              name: authUser.user_metadata?.full_name,
              image: authUser.user_metadata?.avatar_url,
            });
            
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              name: authUser.user_metadata?.full_name,
              image: authUser.user_metadata?.avatar_url,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Find or create user in the database
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name,
            image: session.user.user_metadata?.avatar_url,
          };
          
          await ensureUserInDatabase(userData);
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured]);
  
  // Ensure the user exists in our database
  const ensureUserInDatabase = async (userData: Omit<NonNullable<User>, "id"> & { id: string }) => {
    try {
      // This would be implemented to connect to your Prisma backend
      // In a real implementation, you'd make an API call to a secure endpoint
      // For example:
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        console.error('Failed to update user in database');
      }
    } catch (error) {
      console.error('Error ensuring user in database:', error);
    }
  };
  
  // Sign in with Google
  const signIn = async () => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Cannot sign in.');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
      }
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };
  
  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Cannot sign out.');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        return;
      }
      
      setUser(null);
      router.push('/');
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 
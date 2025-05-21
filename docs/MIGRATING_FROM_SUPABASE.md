# Migrating from Supabase to NextAuth

This guide explains how we migrated the authentication system from Supabase to NextAuth.js.

## Why the Change?

The original implementation used Supabase for authentication, but we've switched to NextAuth.js for the following reasons:

1. **Simpler Integration**: NextAuth has better direct integration with Next.js, requiring less custom code
2. **Wider Provider Support**: NextAuth supports more authentication providers out of the box
3. **Standardized API**: NextAuth's API is more widely adopted in the Next.js ecosystem
4. **Better TypeScript Support**: NextAuth has excellent TypeScript integration
5. **Session Management**: NextAuth handles sessions more elegantly with Next.js

## Changes Made

The following changes were made to complete the migration:

1. **New Dependencies**:
   - Added `next-auth` library
   - Removed Supabase client dependencies (if you're not using Supabase for other features)

2. **Configuration**:
   - Created NextAuth API route at `app/api/auth/[...nextauth]/route.ts`
   - Updated environment variables (see `docs/AUTH_SETUP.md`)

3. **Auth Provider**:
   - Added `SessionProvider` in the application layout
   - Created a NextAuth wrapper (`lib/nextauth.ts`) that provides a compatible interface with the previous Supabase auth system
   - Updated imports from `@/lib/auth` to `@/lib/nextauth` throughout the application

4. **User Interface**:
   - Added sign-in page (`app/auth/signin/page.tsx`)
   - Added auth error page (`app/auth/error/page.tsx`)
   - Updated header/navigation components to use NextAuth

5. **Protected Routes**:
   - Updated the `AuthRequired` component to work with NextAuth

6. **Event Tracking**:
   - Updated event tracking system to work with NextAuth user IDs
   - Modified anonymous tracking to be compatible with NextAuth

## Key API Changes

### Old Supabase Auth API:

```typescript
import { useAuth } from '@/lib/auth';

// In components
const { user, signIn, signOut, isLoading } = useAuth();

// Sign in/out
await signIn(); // Opened Supabase OAuth popup
await signOut();
```

### New NextAuth API:

```typescript
import { useAuth } from '@/lib/nextauth';

// In components (same interface)
const { user, signIn, signOut, isLoading } = useAuth();

// Sign in/out (same method signatures)
await signIn(); 
await signOut();
```

## TypeScript Types

NextAuth includes TypeScript types for sessions and users. We've extended these types in `types/next-auth.d.ts` to include the user ID in the session, providing similar functionality to Supabase's auth.

## Data Migration

If you were storing user data in Supabase, you'll need to migrate that data to your new authentication system. NextAuth can work with various database adapters, or you can continue to use Prisma as configured in this application.

## Testing the Migration

1. Follow the setup instructions in `docs/AUTH_SETUP.md`
2. Test signing in with the new system
3. Verify that protected routes work as expected
4. Confirm that tracking events are properly associated with user accounts

## Rollback Plan

If you encounter issues with NextAuth and need to revert to Supabase:

1. Restore the original `lib/auth.tsx` file
2. Remove NextAuth configuration and dependencies
3. Ensure Supabase environment variables are correctly set 
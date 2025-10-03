# STS (Secure Token Service) Integration

This document explains how the STS integration works with Google Auth to provide role-based access control.

## Overview

The application now integrates with a Secure Token Service (STS) to exchange Google ID tokens for role-based JWT tokens. This enables role-based access control where users can have roles like `user`, `admin`, or `student`.

## How It Works

1. **User Authentication**: User signs in with Google OAuth
2. **Token Exchange**: The Google ID token is exchanged with the STS service for a role-based JWT
3. **Role Extraction**: Roles are extracted from the STS JWT and stored in the NextAuth session
4. **Role Display**: User roles are displayed in the header and user menu

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
# STS (Secure Token Service) Settings
STS_URL=http://localhost:3000
STS_CLIENT_ID=demo_client
```

### STS Service

The STS service should be running and accessible at the configured URL. The service expects:

**Request Format:**
```bash
curl -X POST ${STS_URL}/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "client_id=${STS_CLIENT_ID}" \
  -d "subject_token=${GOOGLE_ID_TOKEN}" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:id_token" \
  -d "requested_token_type=urn:ietf:params:oauth:token-type:id_token"
```

**Response Format:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**JWT Payload (in access_token):**
```json
{
  "iss": "http://localhost:3000",
  "sub": "988e5add-0be6-42ad-81ac-3e12325876aa",
  "aud": "demo_client",
  "iat": 1759508319,
  "exp": 1759508919,
  "roles": ["student"]
}
```

## Implementation Details

### Files Modified

1. **`lib/sts.ts`** - STS service integration functions
2. **`lib/auth-options.ts`** - NextAuth configuration with STS integration
3. **`types/next-auth.d.ts`** - TypeScript definitions for roles in session
4. **`components/Header.tsx`** - UI updates to display user roles
5. **`setup-env.sh`** - Environment setup script with STS configuration

### Key Functions

- `exchangeTokenForRoles(googleIdToken)` - Exchanges Google ID token for roles
- `isAdmin(roles)` - Checks if user has admin role
- `getPrimaryRole(roles)` - Gets the user's primary role

### Role Display

User roles are displayed in:
- Header badge (desktop view)
- User dropdown menu
- Mobile menu

Role badges are color-coded:
- **Admin**: Red badge
- **Other roles**: Blue badge

## Error Handling

If the STS service is unavailable or returns an error:
- The user can still sign in (graceful degradation)
- Roles array will be empty
- No role badge will be displayed
- Error is logged to console

## Security Considerations

- The STS JWT is decoded client-side for display purposes only
- Server-side validation should be implemented for protected routes
- The Google ID token is securely exchanged with the STS service
- Role information is stored in the NextAuth session


/**
 * Secure Token Service (STS) integration
 * Exchanges Google ID tokens for role-based JWT tokens
 */

interface STSTokenRequest {
  grant_type: string;
  client_id: string;
  subject_token: string;
  subject_token_type: string;
  requested_token_type: string;
}

interface STSTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface RoleToken {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  roles: string[];
}

/**
 * Exchange Google ID token for STS role token
 */
export async function exchangeTokenForRoles(googleIdToken: string): Promise<string[] | null> {
  try {
    const stsUrl = process.env.STS_URL || 'http://localhost:3000';
    const clientId = process.env.STS_CLIENT_ID || 'demo_client';
    
    const requestBody = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: clientId,
      subject_token: googleIdToken,
      subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
      requested_token_type: 'urn:ietf:params:oauth:token-type:id_token'
    });

    const response = await fetch(`${stsUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString(),
    });

    if (!response.ok) {
      console.error('STS token exchange failed:', response.status, response.statusText);
      return null;
    }

    const tokenResponse: STSTokenResponse = await response.json();
    
    // Decode the JWT to extract roles
    const roleToken = decodeJWT(tokenResponse.access_token) as RoleToken;
    
    return roleToken.roles || [];
  } catch (error) {
    console.error('Error exchanging token for roles:', error);
    return null;
  }
}

/**
 * Simple JWT decoder (for client-side use only, not for verification)
 */
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if user has admin role
 */
export function isAdmin(roles: string[]): boolean {
  return roles.includes('admin');
}

/**
 * Get user's primary role (first role in the array)
 */
export function getPrimaryRole(roles: string[]): string {
  return roles.length > 0 ? roles[0] : 'user';
}


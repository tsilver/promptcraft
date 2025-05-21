# Authentication Setup Guide

This application uses NextAuth.js (Auth.js) for authentication with Google OAuth provider. Follow these steps to set up authentication for your environment.

## Step 1: Create Required Environment Variables

Run the setup script to create a `.env.local` file with the required environment variables:

```bash
./setup-env.sh
```

This will generate a secure random string for the `NEXTAUTH_SECRET` and create a template `.env.local` file.

## Step 2: Set Up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set the Application type to "Web application"
6. Add the following authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `https://your-production-domain.com` (for production)
7. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
8. Click "Create" to generate your Client ID and Client Secret
9. Copy the Client ID and Client Secret to your `.env.local` file

## Step 3: Update Environment Variables

Open the `.env.local` file and update the following values:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

For production, also update:

```
NEXTAUTH_URL=https://your-production-domain.com
```

## Step 4: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000` in your browser
3. Click the "Sign In" button
4. You should be redirected to Google's OAuth consent screen
5. After authenticating, you'll be redirected back to the application

## Troubleshooting

### Common Issues:

1. **"Error: Configuration": The Google provider is not configured correctly.**
   - Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are properly set in `.env.local`
   - Verify that the authorized redirect URIs in Google Cloud Console match your application's callback URLs

2. **"Error: Callback": Unable to complete the authentication process.**
   - Check that your `NEXTAUTH_URL` is correctly set
   - Ensure there are no firewall or network issues preventing the OAuth flow

3. **"Error: AccessDenied": User denied access to your application.**
   - The user declined to grant permission during the OAuth consent screen

4. **"Error: OAuthCallback": Received no OAuth callback data.**
   - Check that the callback URL is correctly configured in Google Cloud Console

## Additional Configuration

For advanced configuration options, refer to the [NextAuth.js documentation](https://next-auth.js.org/configuration/options). 
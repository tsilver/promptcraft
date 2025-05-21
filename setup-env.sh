#!/bin/bash

# Helper script to set up environment variables for NextAuth

# Create .env.local file
cat > .env.local << EOL
# NextAuth Settings
NEXTAUTH_URL=http://localhost:3000
# Generate a secure random string for NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
# Get these from Google Cloud Console OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database Settings (already existing in your app)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptcraft?schema=public"
EOL

echo "Created .env.local file with placeholder values"
echo "Please update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with your actual credentials"
echo ""
echo "Instructions for obtaining Google OAuth credentials:"
echo "1. Go to https://console.cloud.google.com/"
echo "2. Create a new project or select an existing one"
echo "3. Go to 'APIs & Services' > 'Credentials'"
echo "4. Click 'Create Credentials' > 'OAuth client ID'"
echo "5. Set Application type to 'Web application'"
echo "6. Add authorized JavaScript origins: http://localhost:3000"
echo "7. Add authorized redirect URIs: http://localhost:3000/api/auth/callback/google"
echo "8. Copy the generated Client ID and Client Secret to your .env.local file"
echo ""
echo "After updating credentials, restart your server" 
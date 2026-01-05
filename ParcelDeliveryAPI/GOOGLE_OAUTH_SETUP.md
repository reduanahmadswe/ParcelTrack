# Google OAuth Setup Guide

## Prerequisites
- Google Cloud Platform account
- Project with OAuth credentials

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name**: Parcel Delivery System
   - **Authorized JavaScript origins**:
     - `http://localhost:5000` (development backend)
     - `http://localhost:5173` (development frontend)
     - Your production frontend URL
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - Your production backend URL + `/api/auth/google/callback`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace the placeholder values with your actual credentials from Step 1.

## Step 3: OAuth Flow

### How It Works:

1. **User clicks "Sign in with Google"** on the login page
2. **Frontend redirects** to: `GET /api/auth/google`
3. **Backend (Passport)** redirects to Google's consent screen
4. **User authorizes** the application
5. **Google redirects back** to: `GET /api/auth/google/callback`
6. **Backend processes**:
   - Verifies Google user
   - Creates account if new user
   - Links Google ID to existing account (if email matches)
   - Generates JWT tokens (access + refresh)
   - Sets HTTP-only cookies
7. **Backend redirects** to: `${FRONTEND_URL}/auth/google/success?token=xxx&refreshToken=xxx&user=xxx`
8. **Frontend callback page**:
   - Extracts tokens from URL
   - Saves to localStorage
   - Fetches user data
   - Redirects to dashboard

## Database Schema

The User model includes:
- `googleId`: Unique Google account identifier (optional, indexed)
- `isEmailVerified`: Boolean flag (auto-true for Google OAuth users)

Users can sign up with:
- Email/password (traditional)
- Google OAuth
- Both (linking accounts by email)

## Security Features

- ✅ Tokens are passed via URL (temporary) and saved to localStorage
- ✅ HTTP-only cookies for additional security
- ✅ Automatic account linking by email
- ✅ Email verification bypassed for Google users
- ✅ Secure callback URL validation

## Testing

### Development:
1. Ensure backend running on `http://localhost:5000`
2. Ensure frontend running on `http://localhost:5173`
3. Click "Sign in with Google" button
4. Authorize with Google account
5. Should redirect to dashboard with user logged in

### Production:
1. Update `.env` with production credentials
2. Update Google OAuth redirect URIs in Cloud Console
3. Test full flow in production environment

## Troubleshooting

### "redirect_uri_mismatch" error
- Verify redirect URI in Google Console matches: `{BACKEND_URL}/api/auth/google/callback`
- Check for trailing slashes
- Ensure protocol (http/https) matches

### "Invalid client" error
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Ensure credentials are from correct Google Cloud project

### User not redirected after login
- Check `FRONTEND_URL` in `.env`
- Verify frontend route `/auth/google/success` exists
- Check browser console for errors

### Tokens not saved
- Check localStorage in browser DevTools
- Verify `GoogleAuthCallback` component is rendering
- Check Network tab for API calls

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google OAuth20 Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [JWT Best Practices](https://jwt.io/introduction)

# OAuth Integration Setup Guide

## Overview
Your MuscleUp app now supports OAuth authentication with Google, Facebook, and Apple. This allows users to sign in or create accounts using their existing social media accounts.

## ✅ What's Already Implemented

### Frontend (signin.html)
- ✅ Google, Facebook, and Apple sign-in buttons
- ✅ OAuth SDK scripts loaded
- ✅ Complete OAuth handling JavaScript
- ✅ Success/error message system
- ✅ Automatic redirection after authentication

### Backend (/backend/routes/oauth.js)
- ✅ OAuth token verification for all providers
- ✅ User creation/login with OAuth data
- ✅ JWT token generation
- ✅ OAuth account linking/unlinking
- ✅ Configuration endpoint

### Database (User Model)
- ✅ OAuth fields added to User schema
- ✅ Support for multiple OAuth providers per user

## 🔧 Configuration Required

To make OAuth fully functional, you need to:

### 1. Create OAuth Apps

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized domains:
   - `http://localhost:3000` (for development)
   - Your production domain
6. Copy the Client ID

#### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. In Facebook Login settings, add valid OAuth redirect URIs:
   - `http://localhost:3000/pages/signin.html`
   - Your production URLs
5. Copy the App ID

#### Apple Sign-In Setup (Optional - requires Apple Developer account)
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a Service ID in "Certificates, Identifiers & Profiles"
3. Configure domains and return URLs
4. Copy the Service ID

### 2. Environment Variables

Add these to your `/backend/.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# Apple Sign-In (optional)
APPLE_SERVICE_ID=your_apple_service_id_here
APPLE_TEAM_ID=your_apple_team_id_here
APPLE_KEY_ID=your_apple_key_id_here
APPLE_PRIVATE_KEY=your_apple_private_key_here
```

### 3. Update Frontend Configuration

Replace placeholder values in `/pages/signin.html`:

```javascript
// Line ~45: Replace with your actual Google Client ID
client_id: 'YOUR_GOOGLE_CLIENT_ID.googleusercontent.com'

// Line ~85: Replace with your actual Facebook App ID  
appId: 'YOUR_FACEBOOK_APP_ID'

// Line ~160: Replace with your actual Apple Service ID
clientId: 'YOUR_APPLE_SERVICE_ID'
```

### 4. Install Required Dependencies

```bash
cd backend
npm install google-auth-library axios
```

## 🚀 How It Works

### User Flow
1. User clicks social login button (Google/Facebook/Apple)
2. OAuth provider popup opens for authentication
3. User authorizes your app
4. OAuth token is sent to your backend (`/api/oauth/auth`)
5. Backend verifies token with OAuth provider
6. User account is created or existing account is updated
7. JWT token is returned to frontend
8. User is redirected to main app

### Backend API Endpoints

#### `POST /api/oauth/auth`
Authenticate user with OAuth token
```json
{
  "provider": "google|facebook|apple",
  "accessToken": "oauth_access_token"
}
```

#### `GET /api/oauth/config`
Get OAuth configuration for frontend

#### `DELETE /api/oauth/unlink/:provider`
Unlink OAuth provider from user account (requires authentication)

## 🔒 Security Features

- ✅ OAuth token verification with provider APIs
- ✅ JWT token generation for session management
- ✅ Secure password generation for OAuth users
- ✅ Email verification status tracking
- ✅ Account linking for existing users
- ✅ Rate limiting and CORS protection

## 🧪 Testing Without OAuth Setup

Even without OAuth provider setup, the buttons will show helpful messages:
- "Google Sign-In is loading. Please try again in a moment."
- "Facebook Sign-In is loading. Please try again in a moment."
- "Apple Sign-In is not available. Please use a different method."

## 📱 Mobile Compatibility

The OAuth implementation works on:
- ✅ Desktop browsers
- ✅ Mobile web browsers
- ✅ iOS Safari (Apple Sign-In native integration)
- ✅ Android Chrome (Google Sign-In native integration)

## 🚨 Important Notes

1. **HTTPS Required**: OAuth providers require HTTPS in production
2. **Domain Verification**: Add your domain to OAuth app configurations
3. **Apple Sign-In**: Requires paid Apple Developer account
4. **Rate Limits**: OAuth providers have rate limits for token verification
5. **Privacy**: OAuth implementation respects user privacy and data minimization

## 📞 Support

If you need help setting up OAuth providers:
1. Check the OAuth provider documentation
2. Verify environment variables are set correctly
3. Check browser console for error messages
4. Ensure MongoDB is running for user storage

Your OAuth integration is now ready! Just add the API keys and you'll have full social login functionality! 🎉

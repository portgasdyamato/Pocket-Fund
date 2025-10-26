# Financial Glow-Up - Local Setup Guide

This guide will help you set up the Financial Glow-Up app locally with Google OAuth authentication.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Cloud Console account (for OAuth setup)

## 1. Database Setup

1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE financial_glowup;
   ```
3. Update the `DATABASE_URL` in your environment variables

## 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Copy the Client ID and Client Secret

## 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/financial_glowup

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini AI Configuration (optional)
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 4. Installation and Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database schema:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5000`

## 5. Testing the Setup

1. Open `http://localhost:5000` in your browser
2. Click "Log In" or "Get Started"
3. You should be redirected to Google OAuth
4. After successful authentication, you'll be redirected back to the app

## 6. Production Deployment

For production deployment:

1. Update the Google OAuth redirect URI to your production domain
2. Set `NODE_ENV=production`
3. Use a secure `SESSION_SECRET`
4. Ensure your database is accessible from your production environment
5. Build the app:
   ```bash
   npm run build
   npm start
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure PostgreSQL is running and the connection string is correct
2. **OAuth Error**: Check that your Google OAuth credentials are correct and the redirect URI matches
3. **Session Issues**: Ensure `SESSION_SECRET` is set and consistent across restarts

### Environment Variables Not Loading

Make sure your `.env` file is in the root directory and contains all required variables.

## Features

- Google OAuth authentication
- Financial goal tracking
- Expense logging and categorization
- AI-powered financial insights
- Gamified savings experience
- Responsive web interface

## Support

If you encounter any issues, check the console logs for error messages and ensure all environment variables are properly configured.


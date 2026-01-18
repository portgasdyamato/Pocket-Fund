import type { VercelRequest, VercelResponse } from '@vercel/node';
// import { storage } from '../../../../server/storage';

// ... inside handler ...

      // Save/update user in database - TEMPORARILY DISABLED
      /*
      try {
        await storage.upsertUser({
          id: googleUser.id,
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
          lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: googleUser.picture || null,
        });
      } catch (error) {
        console.error('Error saving user to database:', error);
      }
      */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Only handle GET requests for OAuth callback
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const code = req.query.code as string;
    
    if (!code) {
      console.error('No authorization code received');
      res.redirect('/?error=no_code');
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'https://pocket-fund-theta.vercel.app/api/auth/google/callback';

    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured');
      res.redirect('/?error=config_missing');
      return;
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code'
        })
      });

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        console.error('Failed to get access token:', tokens);
        res.redirect('/?error=token_failed');
        return;
      }

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      if (!userResponse.ok) {
        console.error('Failed to fetch user info:', await userResponse.text());
        res.redirect('/?error=userinfo_failed');
        return;
      }

      const googleUser = await userResponse.json();

      // Save/update user in database
      try {
        await storage.upsertUser({
          id: googleUser.id,
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
          lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: googleUser.picture || null,
        });
      } catch (error) {
        console.error('Error saving user to database:', error);
        // Continue even if save fails
      }

      // Save user ID to cookie for authentication
      // Note: This is a temporary solution. For production, use JWT tokens or proper session management
      res.setHeader('Set-Cookie', `userId=${googleUser.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);
      
      // Redirect to HQ page (dashboard)
      res.redirect(302, '/hq');

    } catch (error: any) {
      console.error('OAuth error:', error);
      res.redirect('/?error=auth_failed');
    }
  } catch (error: any) {
    console.error('Google auth callback handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message 
    });
  }
}

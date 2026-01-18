import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    // Only handle GET requests for OAuth redirect
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'https://pocket-fund-theta.vercel.app/api/auth/google/callback';
    
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is not configured');
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('profile email')}&` +
      `access_type=offline&` +
      `prompt=consent`;

    res.redirect(302, googleAuthUrl);
  } catch (error: any) {
    console.error('Google auth handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message 
    });
  }
}

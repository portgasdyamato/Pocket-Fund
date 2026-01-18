import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const path = req.url || '';
    console.log(`Processing API request: ${path}`);

    // --- GOOGLE AUTH: START ---
    if (path.startsWith('/api/auth/google') && !path.includes('callback')) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'https://pocket-fund-theta.vercel.app/api/auth/google/callback';
      
      if (!clientId) return res.status(500).json({ error: 'Google OAuth not configured' });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('profile email')}&` +
        `access_type=offline&` +
        `prompt=consent`;

      return res.redirect(googleAuthUrl);
    }

    // --- GOOGLE AUTH: CALLBACK ---
    if (path.includes('/api/auth/google/callback')) {
      const code = req.query.code as string;
      if (!code) return res.redirect('/?error=no_code');

      try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL || 'https://pocket-fund-theta.vercel.app/api/auth/google/callback',
            grant_type: 'authorization_code'
          })
        });

        const tokens = await tokenResponse.json();
        if (!tokens.access_token) return res.redirect('/?error=token_failed');

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const googleUser = await userResponse.json();

        // Save/update user in database (Robust dynamic import)
        try {
          const mod = await import('../server/storage');
          const storage = mod.storage;
          await storage.upsertUser({
            id: googleUser.id,
            email: googleUser.email,
            firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
            lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || null,
            profileImageUrl: googleUser.picture || null,
          });
          console.log(`User ${googleUser.id} upserted`);
        } catch (dbErr) {
          console.error('DB Upsert Error (Continuing):', dbErr);
        }

        // Set Cookie
        const cookieValue = `userId=${googleUser.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
        res.setHeader('Set-Cookie', cookieValue);
        
        return res.redirect(302, '/hq');
      } catch (authErr) {
        console.error('OAuth Callback Error:', authErr);
        return res.redirect('/?error=auth_failed');
      }
    }

    // --- AUTH: GET CURRENT USER ---
    if (path.includes('/api/auth/user')) {
      const userId = req.cookies?.userId;
      console.log(`Auth check for userId: ${userId}`);

      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      try {
        const mod = await import('../server/storage');
        const storage = mod.storage;
        const user = await storage.getUser(userId);
        if (!user) return res.status(401).json({ message: 'User not found' });
        return res.status(200).json(user);
      } catch (dbErr) {
        console.error('DB Fetch Error:', dbErr);
        return res.status(500).json({ message: 'Database error' });
      }
    }

    // --- DATA ENDPOINTS (Fallback to empty arrays) ---
    if (path.includes('/api/transactions')) return res.status(200).json([]);
    if (path.includes('/api/quests')) return res.status(200).json([]);
    if (path.includes('/api/badges')) return res.status(200).json([]);
    if (path.includes('/api/goals')) return res.status(200).json([]);
    if (path.includes('/api/stash')) return res.status(200).json([]);
    if (path.includes('/api/streak')) return res.status(200).json({ saveStreak: 0, fightStreak: 0 });

    // --- LOGOUT ---
    if (path.includes('/api/logout')) {
      res.setHeader('Set-Cookie', 'userId=; Path=/; HttpOnly; Max-Age=0');
      return res.redirect('/');
    }

    // --- HEALTH ---
    if (path.includes('/api/health')) {
      return res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        cookies: !!req.cookies?.userId
      });
    }

    return res.status(200).json({ message: 'API active', path });

  } catch (error: any) {
    console.error('Global Handler Error:', error);
    return res.status(500).json({ error: 'Internal error', message: error?.message });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Determine Origin for CORS
    const origin = req.headers.origin || process.env.CLIENT_URL || '*';
    
    // 2. Set Robust Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin === '*' ? '*' : origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // 3. Robust Path Parsing
    const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    console.log(`[API] ${req.method} request to path: ${pathname}`);

    // --- DEBUG ENDPOINT ---
    if (pathname === '/api/debug') {
      return res.status(200).json({
        pathname,
        method: req.method,
        cookies: req.cookies || 'No cookies found in req.cookies',
        allHeaders: req.headers,
        env: {
          nodeEnv: process.env.NODE_ENV,
          hasClientId: !!process.env.GOOGLE_CLIENT_ID,
          hasDb: !!process.env.DATABASE_URL
        }
      });
    }

    // --- GOOGLE AUTH: INITIATE ---
    if (pathname === '/api/auth/google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `https://${req.headers.host}/api/auth/google/callback`;
      
      console.log(`[Auth] Initiating Google login. Callback: ${callbackUrl}`);
      
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
    if (pathname === '/api/auth/google/callback') {
      const code = req.query.code as string;
      if (!code) {
        console.error('[Auth] Callback missing code');
        return res.redirect('/?error=no_code');
      }

      try {
        const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `https://${req.headers.host}/api/auth/google/callback`;
        
        console.log('[Auth] Exchanging code for tokens...');
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code'
          })
        });

        const tokens = await tokenResponse.json();
        if (!tokens.access_token) {
          console.error('[Auth] Token exchange failed', tokens);
          return res.redirect('/?error=token_failed');
        }

        console.log('[Auth] Fetching Google user info...');
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const googleUser = await userResponse.json();

        // Save to DB
        try {
          const { storage } = await import('../server/storage');
          await storage.upsertUser({
            id: googleUser.id,
            email: googleUser.email,
            firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
            lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || null,
            profileImageUrl: googleUser.picture || null,
          });
          console.log(`[Auth] User ${googleUser.id} synced with DB`);
        } catch (dbErr) {
          console.error('[Auth] DB Error (non-fatal):', dbErr);
        }

        // Set Cookie permanently for the domain
        const isProd = process.env.NODE_ENV === 'production';
        const cookieValue = `userId=${googleUser.id}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}`;
        res.setHeader('Set-Cookie', cookieValue);
        
        console.log(`[Auth] Cookie set for ${googleUser.id}, redirecting to /hq`);
        return res.redirect(302, '/hq');
      } catch (err) {
        console.error('[Auth] Callback Error:', err);
        return res.redirect('/?error=auth_internal');
      }
    }

    // --- AUTH: CURRENT USER ---
    if (pathname === '/api/auth/user') {
      // Robust cookie retrieval
      let userId = req.cookies?.userId;
      
      // Fallback to manual header parsing if req.cookies is missing
      if (!userId && req.headers.cookie) {
        const match = req.headers.cookie.match(/userId=([^;]+)/);
        userId = match ? match[1] : undefined;
        console.log(`[Auth] Manual cookie parse found userId: ${userId}`);
      }

      if (!userId) {
        console.log('[Auth] No session cookie found for /api/auth/user');
        return res.status(401).json({ message: 'Not authenticated' });
      }

      try {
        const { storage } = await import('../server/storage');
        const user = await storage.getUser(userId);
        if (!user) {
          console.log(`[Auth] User ${userId} not found in database`);
          return res.status(401).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
      } catch (dbErr) {
        console.error('[Auth] Database fetch error:', dbErr);
        return res.status(500).json({ message: 'Database lookup failed' });
      }
    }

    // --- DATA FALLBACKS ---
    if (pathname.startsWith('/api/transactions')) return res.status(200).json([]);
    if (pathname.startsWith('/api/quests')) return res.status(200).json([]);
    if (pathname.startsWith('/api/badges')) return res.status(200).json([]);
    if (pathname.startsWith('/api/goals')) return res.status(200).json([]);
    if (pathname.startsWith('/api/stash')) return res.status(200).json([]);

    if (pathname === '/api/logout') {
      res.setHeader('Set-Cookie', 'userId=; Path=/; HttpOnly; Max-Age=0');
      return res.redirect('/');
    }

    if (pathname === '/api/health') {
      return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
    }

    return res.status(200).json({ status: 'active', path: pathname });

  } catch (error: any) {
    console.error('[API] Global Error:', error);
    return res.status(500).json({ error: 'Internal Error', message: error?.message });
  }
}

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Use middleware
app.use(cookieParser());
app.use(express.json());

// Robust CORS
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Helper to get userId from various sources
const getUserId = (req: any) => {
  // 1. Try cookie-parser
  if (req.cookies?.userId) return req.cookies.userId;
  
  // 2. Try manual header parsing
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/userId=([^;]+)/);
    if (match) return match[1];
  }
  
  return null;
};

// --- GOOGLE AUTH: INITIATE ---
app.get('/api/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `https://${req.headers.host}/api/auth/google/callback`;
  
  console.log(`[API] Initiating Google Auth. Callback: ${callbackUrl}`);
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('profile email')}&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.redirect(googleAuthUrl);
});

// --- GOOGLE AUTH: CALLBACK ---
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=no_code');

  try {
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `https://${req.headers.host}/api/auth/google/callback`;
    
    // Exchange token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) return res.redirect('/?error=token_failed');

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const googleUser = await userRes.json();

    // DB Sync
    try {
      const { storage } = await import('../server/storage');
      await storage.upsertUser({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
        lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: googleUser.picture || null,
      });
      console.log(`[API] User ${googleUser.id} upserted successfully`);
    } catch (e) {
      console.error('[API] DB Sync Error:', e);
    }

    // Set Cookie with brute force (Header + res.cookie)
    const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    const userId = String(googleUser.id);
    
    const cookieOptions = [
      `userId=${userId}`,
      'Path=/',
      `Max-Age=${7 * 24 * 60 * 60}`,
      'HttpOnly',
      'SameSite=Lax'
    ];
    if (isProd) cookieOptions.push('Secure');
    
    res.setHeader('Set-Cookie', cookieOptions.join('; '));
    console.log(`[API] Cookie set for user ${userId}. Redirecting...`);
    
    res.redirect(302, '/hq');
  } catch (err) {
    console.error('[API] Callback Global Error:', err);
    res.redirect('/?error=auth_failed');
  }
});

// --- AUTH: USER ---
app.get('/api/auth/user', async (req, res) => {
  const userId = getUserId(req);
  console.log(`[API] /api/auth/user check. userId found: ${userId}`);

  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { storage } = await import('../server/storage');
    const user = await storage.getUser(userId);
    if (!user) {
      console.log(`[API] User ${userId} not found in database`);
      return res.status(401).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    console.error('[API] Fetch User DB Error:', e);
    res.status(500).json({ message: 'Database error' });
  }
});

// --- LOGOUT ---
app.get('/api/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'userId=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
  res.redirect('/');
});

// --- DATA ---
app.get('/api/transactions', (req, res) => res.json([]));
app.get('/api/quests', (req, res) => res.json([]));
app.get('/api/badges', (req, res) => res.json([]));
app.get('/api/goals', (req, res) => res.json([]));
app.get('/api/stash', (req, res) => res.json([]));
app.get('/api/streak', (req, res) => res.json({ saveStreak: 0, fightStreak: 0 }));

app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  vercel: process.env.VERCEL === '1',
  env: process.env.NODE_ENV
}));

export default app;

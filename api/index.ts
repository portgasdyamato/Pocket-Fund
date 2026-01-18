import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// 1. Basic Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));

// 2. Logging and Cache Control
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// --- GOOGLE AUTH: INITIATE ---
app.get('/api/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `https://${req.headers.host}/api/auth/google/callback`;
  
  if (!clientId) return res.status(500).json({ error: 'OAuth not configured' });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=profile%20email&access_type=offline&prompt=consent`;
  res.redirect(url);
});

// --- GOOGLE AUTH: CALLBACK ---
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?error=no_code');

  try {
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `https://${req.headers.host}/api/auth/google/callback`;
    
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

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const googleUser = await userRes.json();

    // DB Upsert
    try {
      const { storage } = await import('../server/storage');
      await storage.upsertUser({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
        lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: googleUser.picture || null,
      });
    } catch (e) {
      console.error('DB Error:', e);
    }

    // Set Cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('userId', googleUser.id, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd
    });

    res.redirect(302, '/hq');
  } catch (err) {
    console.error('Callback Error:', err);
    res.redirect('/?error=auth_failed');
  }
});

// --- AUTH: GET CURRENT USER ---
app.get('/api/auth/user', async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const { storage } = await import('../server/storage');
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Database error' });
  }
});

// --- LOGOUT ---
app.get('/api/logout', (req, res) => {
  res.clearCookie('userId', { path: '/' });
  res.redirect('/');
});

// --- DATA STUBS ---
app.get('/api/transactions', (req, res) => res.json([]));
app.get('/api/quests', (req, res) => res.json([]));
app.get('/api/badges', (req, res) => res.json([]));
app.get('/api/goals', (req, res) => res.json([]));
app.get('/api/stash', (req, res) => res.json([]));
app.get('/api/streak', (req, res) => res.json({ saveStreak: 0, fightStreak: 0 }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;

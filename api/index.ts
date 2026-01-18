import type { VercelRequest, VercelResponse } from '@vercel/node';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import express from 'express';

// Initialize Express app for middleware
const app = express();

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // For now, just pass the profile
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const path = req.url || '';

  // Google Auth routes
  if (path.startsWith('/api/auth/google/callback')) {
    return new Promise((resolve) => {
      passport.authenticate('google', { 
        failureRedirect: '/' 
      }, (err: any, user: any) => {
        if (err || !user) {
          res.redirect('/');
          return resolve(null);
        }
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            res.redirect('/');
            return resolve(null);
          }
          res.redirect('/dashboard');
          return resolve(null);
        });
      })(req, res);
    });
  }

  if (path.startsWith('/api/auth/google')) {
    return new Promise((resolve) => {
      passport.authenticate('google', {
        scope: ['profile', 'email']
      })(req, res, () => resolve(null));
    });
  }

  if (path.startsWith('/api/logout')) {
    req.logout(() => {
      res.redirect('/');
    });
    return;
  }

  // Health check
  if (path === '/api/health') {
    return res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      auth: {
        configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
      }
    });
  }

  // Return empty arrays for data endpoints to prevent frontend crashes
  if (path.includes('/api/transactions')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/quests')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/badges')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/goals')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/stash')) {
    return res.status(200).json([]);
  }
  
  if (path.includes('/api/streak')) {
    return res.status(200).json({ saveStreak: 0, fightStreak: 0 });
  }
  
  if (path.includes('/api/auth/user')) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.status(200).json(req.user);
    }
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Default response
  return res.status(200).json({ 
    message: 'API endpoint', 
    path: req.url,
    note: 'Endpoint not implemented yet'
  });
}

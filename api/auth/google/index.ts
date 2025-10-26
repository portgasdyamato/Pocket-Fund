import type { VercelRequest, VercelResponse } from '@vercel/node';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Google OAuth credentials not configured' });
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          return done(null, profile);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res);
}
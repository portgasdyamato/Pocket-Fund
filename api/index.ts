import express from 'express';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql as drizzleSql } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

// 1. Define Schema Inline (No imports from other files)
const usersTable = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: text("profile_image_url"),
  onboardingStatus: text("onboarding_status").notNull().default("step_1"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const app = express();
app.use(cookieParser());
app.use(express.json());

// 2. Optimized CORS for Vercel
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// 3. Database Singleton
let dbInstance: any = null;
const getDb = () => {
  if (!dbInstance && process.env.DATABASE_URL) {
    const client = neon(process.env.DATABASE_URL);
    dbInstance = drizzle(client);
  }
  return dbInstance;
};

// 4. Helper to find User
const fetchUser = async (id: string) => {
  const db = getDb();
  if (!db) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return user;
};

// 5. Routes (Handling both /api/path and /path for Vercel flexibility)

// --- DEBUG ---
app.get(['/api/debug', '/debug'], async (req, res) => {
  try {
    const db = getDb();
    const dbStatus = db ? "Configured" : "Missing DATABASE_URL";
    let dbTest = "Not tested";
    if (db) {
       await db.execute(drizzleSql`SELECT 1`);
       dbTest = "Connection Successful";
    }
    res.json({
      status: "running",
      dbStatus,
      dbTest,
      cookies: req.cookies || "No cookies object",
      userIdCookie: req.cookies?.userId || "Missing",
      env: { NODE_ENV: process.env.NODE_ENV, VERCEL: process.env.VERCEL }
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message, stack: err.stack });
  }
});

// --- GOOGLE LOGIN ---
app.get(['/api/auth/google', '/auth/google'], (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = `https://${req.headers.host}/api/auth/google/callback`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=profile%20email&prompt=consent`;
  res.redirect(url);
});

// --- CALLBACK ---
app.get(['/api/auth/google/callback', '/auth/google/callback'], async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.redirect('/?error=no_code');
  
  try {
    const callbackUrl = `https://${req.headers.host}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: callbackUrl, grant_type: 'authorization_code'
      })
    });
    const tokens = await tokenRes.json();
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const googleUser = await userRes.json();

    // Brute force upsert
    const db = getDb();
    if (db) {
      await db.insert(usersTable).values({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        profileImageUrl: googleUser.picture
      }).onConflictDoUpdate({
        target: usersTable.id,
        set: { updatedAt: new Date() }
      });
    }

    res.cookie('userId', googleUser.id, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });
    res.redirect('/hq');
  } catch (err) {
    res.redirect('/?error=auth_failed');
  }
});

// --- GET USER ---
app.get(['/api/auth/user', '/auth/user'], async (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(401).json({ message: 'No userId cookie' });
  
  try {
    const user = await fetchUser(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'DB Error' });
  }
});

// --- FALLBACK DATA ---
app.get('/api/:resource', (req, res) => res.json([]));

export default app;

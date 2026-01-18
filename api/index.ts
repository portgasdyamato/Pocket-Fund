import express from 'express';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql as drizzleSql } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

// 1. Define Schema Inline
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

let dbInstance: any = null;
const getDb = () => {
  if (!dbInstance && process.env.DATABASE_URL) {
    const client = neon(process.env.DATABASE_URL);
    dbInstance = drizzle(client);
  }
  return dbInstance;
};

// --- DEBUG (UPGRADED) ---
app.get(['/api/debug', '/debug'], async (req, res) => {
  try {
    const db = getDb();
    const userId = req.cookies?.userId;
    let userInDb = "N/A";
    
    if (db && userId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, String(userId)));
      userInDb = user ? `Found (${user.email})` : "NOT FOUND IN DB";
    }

    res.json({
      status: "running",
      dbStatus: db ? "Connected" : "No DB",
      userInDb,
      userIdCookie: userId || "Missing",
      env: { NODE_ENV: process.env.NODE_ENV }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
        code, 
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: callbackUrl, 
        grant_type: 'authorization_code'
      })
    });
    
    const tokens = await tokenRes.json();
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const googleUser = await userRes.json();
    const userId = String(googleUser.id);

    // CRITICAL: Robust Upsert
    const db = getDb();
    if (db) {
      console.log(`[Auth] Upserting user ${userId}`);
      await db.insert(usersTable).values({
        id: userId,
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        profileImageUrl: googleUser.picture,
        onboardingStatus: 'step_1'
      }).onConflictDoUpdate({
        target: usersTable.id,
        set: { 
          email: googleUser.email,
          updatedAt: new Date() 
        }
      });
    }

    res.cookie('userId', userId, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });
    
    res.redirect('/hq');
  } catch (err: any) {
    console.error(`[Auth] Callback Error: ${err.message}`);
    res.redirect(`/?error=auth_failed&msg=${encodeURIComponent(err.message)}`);
  }
});

// --- GET USER ---
app.get(['/api/auth/user', '/auth/user'], async (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(401).json({ message: 'No userId cookie' });
  
  try {
    const db = getDb();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, String(userId)));
    if (!user) return res.status(401).json({ message: 'User not in DB' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'DB Error' });
  }
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('userId', { path: '/' });
  res.redirect('/');
});

app.get('/api/:resource', (req, res) => res.json([]));

export default app;

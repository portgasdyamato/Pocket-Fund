import express from 'express';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and, desc, isNull, sql as drizzleSql } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, decimal, boolean, integer } from 'drizzle-orm/pg-core';

// --- SCHEMA DEFINITION (TRULY SELF-CONTAINED) ---

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

const goalsTable = pgTable("goals", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  isMain: boolean("is_main").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const transactionsTable = pgTable("transactions", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category"),
  tag: text("tag"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const badgesTable = pgTable("badges", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(),
});

const userBadgesTable = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  badgeId: varchar("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

const questsTable = pgTable("quests", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  points: integer("points").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
});

const userQuestsTable = pgTable("user_quests", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questId: varchar("quest_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

const streaksTable = pgTable("streaks", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  saveStreak: integer("save_streak").default(0).notNull(),
  fightStreak: integer("fight_streak").default(0).notNull(),
  lastSaveDate: timestamp("last_save_date"),
  lastFightDate: timestamp("last_fight_date"),
});

const stashTransactionsTable = pgTable("stash_transactions", {
  id: varchar("id").primaryKey().default(drizzleSql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(),
  goalId: varchar("goal_id"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- API SETUP ---

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// Database Singleton
let dbInstance: any = null;
const getDb = () => {
  if (!dbInstance && process.env.DATABASE_URL) {
    const client = neon(process.env.DATABASE_URL);
    dbInstance = drizzle(client);
  }
  return dbInstance;
};

// --- AUTH MIDDLEWARE (Unified) ---
const isAuthenticated = async (req: any, res: any, next: any) => {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });
  
  const db = getDb();
  if (!db) return res.status(500).json({ message: "Database not connected" });
  
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, String(userId)));
  if (!user) return res.status(401).json({ message: "User not found in database" });
  
  req.user = user;
  next();
};

// --- GEMINI SERVICE INLINE ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(requestBody: any): Promise<any | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

// --- CORE ROUTES ---

// Auth Check
app.get(['/api/auth/user', '/auth/user'], isAuthenticated, (req: any, res) => {
  res.json(req.user);
});

// Profile & Onboarding
app.patch(['/api/user/onboarding', '/user/onboarding'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  await db.update(usersTable).set({ onboardingStatus: req.body.status }).where(eq(usersTable.id, req.user.id));
  res.json({ success: true });
});

app.patch(['/api/user/profile', '/user/profile'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const { firstName, lastName, profileImageUrl } = req.body;
  const [updated] = await db.update(usersTable).set({
    firstName: firstName || req.user.firstName,
    lastName: lastName || req.user.lastName,
    profileImageUrl: profileImageUrl || req.user.profileImageUrl,
    updatedAt: new Date()
  }).where(eq(usersTable.id, req.user.id)).returning();
  res.json(updated);
});

// Wallet
app.post(['/api/wallet/add', '/wallet/add'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const amount = parseFloat(req.body.amount || "0");
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  
  const currentBalance = parseFloat(req.user.walletBalance || "0");
  const [updated] = await db.update(usersTable).set({
    walletBalance: (currentBalance + amount).toFixed(2),
    updatedAt: new Date()
  }).where(eq(usersTable.id, req.user.id)).returning();
  
  res.json({ newBalance: updated.walletBalance });
});

// Goals
app.get(['/api/goals', '/goals'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const goals = await db.select().from(goalsTable).where(eq(goalsTable.userId, req.user.id));
  res.json(goals);
});

app.post(['/api/goals', '/goals'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const { name, targetAmount, isMain } = req.body;
  const [goal] = await db.insert(goalsTable).values({
    userId: req.user.id,
    name,
    targetAmount: parseFloat(targetAmount || "0").toFixed(2),
    isMain: !!isMain
  }).returning();
  res.json(goal);
});

// Transactions
app.get(['/api/transactions', '/transactions'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const limit = parseInt(req.query.limit || "50");
  const transactions = await db.select().from(transactionsTable)
    .where(eq(transactionsTable.userId, req.user.id))
    .orderBy(desc(transactionsTable.date))
    .limit(limit);
  res.json(transactions);
});

app.get(['/api/transactions/untagged', '/transactions/untagged'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const transactions = await db.select().from(transactionsTable)
    .where(and(eq(transactionsTable.userId, req.user.id), isNull(transactionsTable.tag)))
    .orderBy(desc(transactionsTable.date));
  res.json(transactions);
});

app.patch('/api/transactions/:id/tag', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const { id } = req.params;
  const { tag } = req.body;
  await db.update(transactionsTable).set({ tag }).where(eq(transactionsTable.id, id));
  
  // Update fight streak if tag is added
  if (tag) {
    const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
    if (streak) {
      await db.update(streaksTable).set({ fightStreak: streak.fightStreak + 1, lastFightDate: new Date() }).where(eq(streaksTable.id, streak.id));
    } else {
      await db.insert(streaksTable).values({ userId: req.user.id, fightStreak: 1, lastFightDate: new Date() });
    }
  }
  res.json({ success: true });
});

app.delete('/api/transactions/:id', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const { id } = req.params;
  
  // Optional: Add back to wallet balance if desired? The original routes.ts just deleted it. 
  // Let's follow original behavior - just delete.
  await db.delete(transactionsTable).where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, req.user.id)));
  res.json({ success: true });
});

app.post('/api/transactions/:id/categorize', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const { id } = req.params;
  const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, id));
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });

  const aiRes = await callGemini({
    contents: [{ 
      role: "user", 
      parts: [{ text: `Categorize this: "${transaction.description}" (Amount: ${transaction.amount}). Categories: Need, Want, Ick. Reply with JSON { "suggestedCategory": "...", "reasoning": "..." }` }] 
    }]
  });
  
  const raw = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  try {
    const cleaned = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
    res.json(JSON.parse(cleaned));
  } catch (e) {
    res.json({ suggestedCategory: "Want", reasoning: "Could not categorize automatically." });
  }
});

app.post(['/api/transactions', '/transactions'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const amount = parseFloat(req.body.amount || "0");
  const currentBalance = parseFloat(req.user.walletBalance || "0");
  
  if (currentBalance < amount) return res.status(400).json({ message: "Insufficient balance" });
  
  const [transaction] = await db.insert(transactionsTable).values({
    userId: req.user.id,
    description: req.body.description,
    amount: amount.toFixed(2),
    category: req.body.category,
    date: new Date(req.body.date || Date.now())
  }).returning();
  
  await db.update(usersTable).set({
    walletBalance: (currentBalance - amount).toFixed(2),
    updatedAt: new Date()
  }).where(eq(usersTable.id, req.user.id));
  
  res.json(transaction);
});

// Badges
app.get(['/api/badges', '/badges'], async (req, res) => {
  const db = getDb();
  const badges = await db.select().from(badgesTable);
  res.json(badges);
});

app.get(['/api/user/badges', '/user/badges'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const userBadges = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, req.user.id));
  res.json(userBadges);
});

// Quests
app.get(['/api/quests', '/quests'], async (req, res) => {
  const db = getDb();
  const quests = await db.select().from(questsTable);
  res.json(quests);
});

app.get(['/api/user/quests', '/user/quests'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const userQuests = await db.select().from(userQuestsTable).where(eq(userQuestsTable.userId, req.user.id));
  res.json(userQuests);
});

app.post('/api/quests/:id/join', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const questId = req.params.id;
  const [existing] = await db.select().from(userQuestsTable).where(and(eq(userQuestsTable.userId, req.user.id), eq(userQuestsTable.questId, questId)));
  if (!existing) {
    await db.insert(userQuestsTable).values({ userId: req.user.id, questId, completed: false });
  }
  res.json({ success: true });
});

app.post('/api/quests/:id/complete', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const questId = req.params.id;
  await db.update(userQuestsTable).set({ completed: true, completedAt: new Date() })
    .where(and(eq(userQuestsTable.userId, req.user.id), eq(userQuestsTable.questId, questId)));
  res.json({ success: true });
});

// Streaks
app.get(['/api/streak', '/streak'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
  res.json(streak || { saveStreak: 0, fightStreak: 0 });
});

// Stash
app.post(['/api/stash', '/stash'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const amount = parseFloat(req.body.amount || "0");
  const isStash = req.body.type === 'stash';
  const currentBalance = parseFloat(req.user.walletBalance || "0");
  
  if (isStash && currentBalance < amount) return res.status(400).json({ message: "Insufficient balance" });
  
  const [stash] = await db.insert(stashTransactionsTable).values({
    userId: req.user.id,
    amount: amount.toFixed(2),
    type: req.body.type,
    goalId: req.body.goalId,
    status: 'completed'
  }).returning();
  
  await db.update(usersTable).set({
    walletBalance: (isStash ? currentBalance - amount : currentBalance + amount).toFixed(2),
    updatedAt: new Date()
  }).where(eq(usersTable.id, req.user.id));
  
  if (req.body.goalId) {
    const [goal] = await db.select().from(goalsTable).where(eq(goalsTable.id, req.body.goalId));
    if (goal) {
      const curGoal = parseFloat(goal.currentAmount || "0");
      const nextGoal = isStash ? curGoal + amount : curGoal - amount;
      await db.update(goalsTable).set({ currentAmount: nextGoal.toFixed(2) }).where(eq(goalsTable.id, goal.id));
    }
  }
  
  res.json(stash);
});

// AI Assistant
app.post(['/api/ai/chat', '/ai/chat'], isAuthenticated, async (req: any, res) => {
  const { message } = req.body;
  const db = getDb();
  
  const totalStashedRows = await db.select({ total: drizzleSql`sum(amount)` })
    .from(stashTransactionsTable)
    .where(and(eq(stashTransactionsTable.userId, req.user.id), eq(stashTransactionsTable.type, 'stash')));
  const totalStashed = parseFloat((totalStashedRows[0]?.total as string) || "0");
  
  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
  
  const systemPrompt = `You are a friendly financial coach for "Pocket Fund". Use ₹ for currency. User context: ₹${totalStashed} stashed, ${streak?.saveStreak || 0} day streak.`;
  
  const aiRes = await callGemini({
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }]
  });
  
  const text = aiRes?.candidates?.[0]?.content?.parts?.[0]?.text || "Coach logic unavailable. Keep saving!";
  res.json({ response: text });
});

app.get(['/api/stash/total', '/stash/total'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const totalRows = await db.select({ total: drizzleSql`sum(amount)` })
    .from(stashTransactionsTable)
    .where(and(eq(stashTransactionsTable.userId, req.user.id), eq(stashTransactionsTable.type, 'stash')));
  res.json({ total: parseFloat(totalRows[0]?.total || "0") });
});

app.post(['/api/ai/insight', '/ai/insight'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const transactions = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, req.user.id));
  
  const totalSpent = transactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);
  const ickSpent = transactions.filter((t: any) => t.tag === 'Ick').reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);
  const wantSpent = transactions.filter((t: any) => t.tag === 'Want').reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);
  const needSpent = transactions.filter((t: any) => t.tag === 'Need').reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);
  
  const aiRes = await callGemini({
    contents: [{ 
      role: "user", 
      parts: [{ text: `Stats: Total ₹${totalSpent}, Needs ₹${needSpent}, Wants ₹${wantSpent}, Icks ₹${ickSpent}. Give a 2-sentence motivational insight.` }] 
    }]
  });
  
  res.json({ insight: aiRes?.candidates?.[0]?.content?.parts?.[0]?.text || "Keep saving!" });
});

// --- GOOGLE OAUTH FLOW ---
app.get(['/api/auth/google', '/auth/google'], (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = `https://${req.headers.host}/api/auth/google/callback`;
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=profile%20email&prompt=consent`);
});

app.get(['/api/auth/google/callback', '/auth/google/callback'], async (req, res) => {
  const { code } = req.query;
  const callbackUrl = `https://${req.headers.host}/api/auth/google/callback`;
  
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
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });
  const googleUser = await userRes.json();
  
  const db = getDb();
  await db.insert(usersTable).values({
    id: googleUser.id,
    email: googleUser.email,
    firstName: googleUser.given_name,
    lastName: googleUser.family_name,
    profileImageUrl: googleUser.picture,
    onboardingStatus: 'step_1'
  }).onConflictDoUpdate({
    target: usersTable.id,
    set: { email: googleUser.email, updatedAt: new Date() }
  });
  
  res.cookie('userId', googleUser.id, { path: '/', maxAge: 7*24*60*60*1000, httpOnly: true, secure: true, sameSite: 'lax' });
  res.redirect('/hq');
});

// Logout
app.get('/api/logout', (req, res) => {
  res.clearCookie('userId', { path: '/' });
  res.redirect('/');
});

export default app;

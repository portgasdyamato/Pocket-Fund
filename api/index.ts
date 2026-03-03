import express from 'express';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and, desc, isNull, sql as drizzleSql } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, decimal, boolean, integer } from 'drizzle-orm/pg-core';

// --- SCHEMA DEFINITION ---

const usersTable = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: text("profile_image_url"),
  onboardingStatus: text("onboarding_status").notNull().default("step_1"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  vaultPin: varchar("vault_pin", { length: 4 }),
  vaultPinUpdatedAt: timestamp("vault_pin_updated_at"),
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
  completed: boolean("completed").default(false).notNull(),
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
  category: text("category").notNull().default("challenge"),
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
  // Always use the request's host/origin instead of '*' when credentials: true is needed
  const origin = req.headers.origin || (req.headers.host ? `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}` : '*');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  // Log request for debugging in Vercel logs
  if (!req.path.startsWith('/_next') && !req.path.includes('hot-update')) {
    console.log(`[Req] ${req.method} ${req.path}`);
  }

  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

let dbInstance: any = null;
const getDb = () => {
  if (!process.env.DATABASE_URL) {
    console.error('[DB] DATABASE_URL is missing in environment variables!');
    return null;
  }
  if (!dbInstance) {
    try {
      const client = neon(process.env.DATABASE_URL);
      dbInstance = drizzle(client);
    } catch (err: any) {
      console.error('[DB] Initialization error:', err?.message);
    }
  }
  return dbInstance;
};

// --- AUTH MIDDLEWARE ---
const isAuthenticated = async (req: any, res: any, next: any) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    console.log(`[Auth] 401: No userId cookie for path: ${req.path}`);
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const db = getDb();
    if (!db) throw new Error("DB not available");

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, String(userId)));
    if (!user) {
      console.log(`[Auth] 401: Cookie has userId ${userId} but not found in DB`);
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err: any) {
    console.error(`[Auth] Middleware error at ${req.path}:`, err?.message);
    return res.status(500).json({ message: "Auth check failed" });
  }
};

// --- AI SERVICE ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(requestBody: any): Promise<any | null> {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment");
    return { error: { message: "GEMINI_API_KEY is not configured in Vercel environment variables." } };
  }
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    const data = await res.json();
    // Return data regardless of status so we can parse the error message
    return data;
  } catch (err: any) { 
    console.error("Gemini Network Error:", err);
    return { error: { message: err.message || "Network error while connecting to Gemini API" } }; 
  }
}

// --- SEEDING LOGIC ---
const seedData = async () => {
  const db = getDb();
  if (!db) return;
  try {
    const seed = await import('../server/seedCourses');
    const CHALLENGE_QUESTS = seed.CHALLENGE_QUESTS;
    const COURSES = [
      ...seed.EASY_SHORT_COURSES, 
      ...seed.MEDIUM_COURSES, 
      ...seed.HARD_LONG_COURSES
    ];

    const ALL_ITEMS = [...CHALLENGE_QUESTS, ...COURSES];
    const currentQuests = await db.select().from(questsTable);
    
    if (currentQuests.length < ALL_ITEMS.length) { 
      console.log(`[Seed] Delta detected. Current: ${currentQuests.length}, Required: ${ALL_ITEMS.length}. Refreshing library...`);
      
      // We don't delete userQuests anymore to prevent progress loss
      // Just clear the library. Quests with existing IDs in user_quests will stay linked if we don't change IDs,
      // but since they have default UUIDs, we have to clear them.
      await db.delete(questsTable);
      
      // Batch in chunks of 5 to avoid payload size or timeout issues
      const CHUNK_SIZE = 5;
      for (let i = 0; i < ALL_ITEMS.length; i += CHUNK_SIZE) {
        const chunk = ALL_ITEMS.slice(i, i + CHUNK_SIZE);
        await db.insert(questsTable).values(chunk);
        console.log(`[Seed] Progress: ${Math.min(i + CHUNK_SIZE, ALL_ITEMS.length)}/${ALL_ITEMS.length} items synced.`);
      }
      console.log("[Seed] MEGA library sync complete.");
    }

    const currentBadges = await db.select().from(badgesTable);
    if (currentBadges.length === 0) {
      await db.insert(badgesTable).values([
        { name: "Stash Starter", description: "First stash deposit", icon: "piggy-bank", requirement: "Make 1 deposit" },
        { name: "Ick Fighter", description: "Successfully tagged an Ick", icon: "sword", requirement: "Tag 1 expense" }
      ]);
    }
  } catch (err: any) {
    console.error("[Seed] ERROR:", err);
    throw err; // Re-throw so the endpoint knows it failed
  }
};


app.post('/api/admin/seed-courses', async (req: any, res: any) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ message: "DB not available" });
    console.log("[Admin] Forced library re-sync requested...");
    // We clear quests only inside seedData now with better logic
    await seedData();
    res.json({ success: true, message: "Database synchronized successfully." });
  } catch (err: any) {
    console.error("[Admin] Sync failed:", err);
    res.status(500).json({ message: err.message || "Internal sync error" });
  }
});

// --- ROUTES ---

app.get(['/api/auth/user', '/auth/user'], isAuthenticated, (req: any, res) => res.json(req.user));

app.patch(['/api/user/onboarding', '/user/onboarding'], isAuthenticated, async (req: any, res) => {
  await getDb().update(usersTable).set({ onboardingStatus: req.body.status }).where(eq(usersTable.id, req.user.id));
  res.json({ success: true });
});

app.patch(['/api/user/profile', '/user/profile'], isAuthenticated, async (req: any, res) => {
  const [updated] = await getDb().update(usersTable).set({
    firstName: req.body.firstName || req.user.firstName,
    lastName: req.body.lastName || req.user.lastName,
    profileImageUrl: req.body.profileImageUrl || req.user.profileImageUrl,
    updatedAt: new Date()
  }).where(eq(usersTable.id, req.user.id)).returning();
  res.json(updated);
});

app.patch(['/api/user/vault-pin', '/user/vault-pin'], isAuthenticated, async (req: any, res: any) => {
  const { pin } = req.body;
  if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ message: "PIN must be exactly 4 digits" });
  }

  await getDb().update(usersTable).set({ 
    vaultPin: pin, 
    vaultPinUpdatedAt: new Date(),
    updatedAt: new Date() 
  }).where(eq(usersTable.id, req.user.id));
  
  res.json({ success: true });
});

app.post(['/api/wallet/add', '/wallet/add'], isAuthenticated, async (req: any, res) => {
  const amount = parseFloat(req.body.amount || "0");
  const [updated] = await getDb().update(usersTable).set({
    walletBalance: (parseFloat(req.user.walletBalance) + amount).toFixed(2),
    updatedAt: new Date()
  }).where(eq(usersTable.id, req.user.id)).returning();
  res.json({ newBalance: updated.walletBalance });
});

app.get(['/api/goals', '/goals'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(goalsTable).where(eq(goalsTable.userId, req.user.id)));
});

app.get(['/api/goals/main', '/goals/main'], isAuthenticated, async (req: any, res) => {
  const [goal] = await getDb().select().from(goalsTable).where(and(eq(goalsTable.userId, req.user.id), eq(goalsTable.isMain, true)));
  res.json(goal || null);
});

app.post(['/api/goals/:id/claim', '/goals/:id/claim'], isAuthenticated, async (req: any, res: any) => {
  const db = getDb();
  const [goal] = await db.select().from(goalsTable).where(and(eq(goalsTable.userId, req.user.id), eq(goalsTable.id, req.params.id)));
  
  if (!goal) return res.status(404).json({ message: "Goal not found" });
  if (parseFloat((goal as any).currentAmount) < parseFloat((goal as any).targetAmount)) return res.status(400).json({ message: "Goal not reached" });
  if ((goal as any).completed) return res.status(400).json({ message: "Already claimed" });

  // 1. Vault Transaction (Subtract from locker)
  await db.insert(stashTransactionsTable).values({
    userId: req.user.id,
    amount: (goal as any).targetAmount,
    type: 'claim',
    goalId: goal.id,
    status: 'completed'
  });

  // 2. Expense History (Add to transaction history with tag)
  await db.insert(transactionsTable).values({
    userId: req.user.id,
    description: `Claimed Goal: ${goal.name}`,
    amount: (goal as any).targetAmount,
    category: 'Savings',
    tag: 'Goal Claim',
    date: new Date()
  });

  // 3. Mark goal as completed
  await db.update(goalsTable).set({ completed: true } as any).where(eq(goalsTable.id, goal.id));
  
  res.json({ success: true });
});

app.post(['/api/goals', '/goals'], isAuthenticated, async (req: any, res) => {
  const [goal] = await getDb().insert(goalsTable).values({
    userId: req.user.id, name: req.body.name, 
    targetAmount: parseFloat(req.body.targetAmount || "0").toFixed(2), 
    isMain: !!req.body.isMain 
  }).returning();
  res.json(goal);
});

app.get(['/api/transactions', '/transactions'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(transactionsTable).where(eq(transactionsTable.userId, req.user.id)).orderBy(desc(transactionsTable.date)).limit(parseInt(req.query.limit || "50")));
});

app.get(['/api/transactions/untagged', '/transactions/untagged'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(transactionsTable).where(and(eq(transactionsTable.userId, req.user.id), isNull(transactionsTable.tag))).orderBy(desc(transactionsTable.date)));
});

app.post(['/api/transactions', '/transactions'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const amount = parseFloat(req.body.amount || "0");
  const balance = parseFloat(req.user.walletBalance);
  if (balance < amount) return res.status(400).json({ message: "Insufficient balance" });
  
  const [tx] = await db.insert(transactionsTable).values({
    userId: req.user.id, description: req.body.description, amount: amount.toFixed(2), 
    category: req.body.category, date: new Date(req.body.date || Date.now())
  }).returning();
  
  await db.update(usersTable).set({ walletBalance: (balance - amount).toFixed(2) }).where(eq(usersTable.id, req.user.id));
  res.json(tx);
});

app.delete('/api/transactions/:id', isAuthenticated, async (req: any, res) => {
  await getDb().delete(transactionsTable).where(and(eq(transactionsTable.id, req.params.id), eq(transactionsTable.userId, req.user.id)));
  res.json({ success: true });
});

app.patch('/api/transactions/:id/tag', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  await db.update(transactionsTable).set({ tag: req.body.tag }).where(eq(transactionsTable.id, req.params.id));
  if (req.body.tag === 'Ick') {
    const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
    if (streak) await db.update(streaksTable).set({ fightStreak: streak.fightStreak + 1, lastFightDate: new Date() }).where(eq(streaksTable.id, streak.id));
    else await db.insert(streaksTable).values({ userId: req.user.id, fightStreak: 1, lastFightDate: new Date() });
  }
  res.json({ success: true });
});

app.get(['/api/badges', '/badges'], async (req, res) => {
  res.json(await getDb().select().from(badgesTable));
});

app.get(['/api/user/badges', '/user/badges'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(userBadgesTable).where(eq(userBadgesTable.userId, req.user.id)));
});

app.get(['/api/quests', '/quests'], async (req, res) => {
  res.json(await getDb().select().from(questsTable));
});

app.get(['/api/user/quests', '/user/quests'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(userQuestsTable).where(eq(userQuestsTable.userId, req.user.id)));
});

app.post('/api/quests/:id/join', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const [existing] = await db.select().from(userQuestsTable).where(and(eq(userQuestsTable.userId, req.user.id), eq(userQuestsTable.questId, req.params.id)));
  if (!existing) {
    await db.insert(userQuestsTable).values({ userId: req.user.id, questId: req.params.id, completed: false });
  } else if (existing.completed) {
    // Allows resetting the challenge for a new week/session
    await db.update(userQuestsTable).set({ 
      completed: false, 
      completedAt: null, 
      completionNote: null 
    }).where(eq(userQuestsTable.id, existing.id));
  }
  res.json({ success: true });
});

app.post('/api/quests/:id/complete', isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const [existing] = await db.select().from(userQuestsTable).where(and(eq(userQuestsTable.userId, req.user.id), eq(userQuestsTable.questId, req.params.id)));
  
  if (existing) {
    await db.update(userQuestsTable).set({ 
      completed: true, 
      completedAt: new Date(),
      completionNote: req.body.completionNote || null
    }).where(eq(userQuestsTable.id, existing.id));
  } else {
    await db.insert(userQuestsTable).values({
      userId: req.user.id,
      questId: req.params.id,
      completed: true,
      completedAt: new Date(),
      completionNote: req.body.completionNote || null
    });
  }

  // Also fetch the quest points to return for the UI
  const [quest] = await db.select().from(questsTable).where(eq(questsTable.id, req.params.id));
  res.json({ success: true, pointsEarned: quest?.points, questTitle: quest?.title });
});

app.get(['/api/streak', '/streak'], isAuthenticated, async (req: any, res) => {
  const [streak] = await getDb().select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
  res.json(streak || { saveStreak: 0, fightStreak: 0 });
});

app.post(['/api/stash', '/stash'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const amount = parseFloat(req.body.amount || "0");
  const isStash = req.body.type === 'stash';
  const balance = parseFloat(req.user.walletBalance);
  if (isStash && balance < amount) return res.status(400).json({ message: "Insufficient balance" });
  
  const isWithdraw = req.body.type === 'withdraw';
  const isClaim = req.body.type === 'claim';

  const [txn] = await db.insert(stashTransactionsTable).values({
    userId: req.user.id, amount: amount.toFixed(2), type: req.body.type, goalId: req.body.goalId, status: 'completed'
  }).returning();
  
  // Update wallet balance: Stash = deduct, Withdraw = add, Claim = do nothing to wallet
  let newWalletBalance = balance;
  if (isStash) newWalletBalance -= amount;
  else if (isWithdraw) newWalletBalance += amount;
  
  await db.update(usersTable).set({ walletBalance: newWalletBalance.toFixed(2) }).where(eq(usersTable.id, req.user.id));
  
  if (isClaim) {
     // Log to expense history if it's a claim from this endpoint
     const [goal] = req.body.goalId ? await db.select().from(goalsTable).where(eq(goalsTable.id, req.body.goalId)) : [null];
     await db.insert(transactionsTable).values({
       userId: req.user.id,
       description: goal ? `Goal Claim: ${goal.name}` : `Vault Claim`,
       amount: amount.toFixed(2),
       category: 'Savings',
       tag: 'Goal Claim',
       date: new Date()
     });
  }

  if (req.body.goalId) {
    const [goal] = await db.select().from(goalsTable).where(eq(goalsTable.id, req.body.goalId));
    if (goal) {
      const current = parseFloat(goal.currentAmount);
      await db.update(goalsTable).set({ currentAmount: (isStash ? current + amount : current - amount).toFixed(2) }).where(eq(goalsTable.id, goal.id));
    }
  }
  
  if (isStash) {
    const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
    if (streak) await db.update(streaksTable).set({ saveStreak: streak.saveStreak + 1, lastSaveDate: new Date() }).where(eq(streaksTable.id, streak.id));
    else await db.insert(streaksTable).values({ userId: req.user.id, saveStreak: 1, lastSaveDate: new Date() });
  }
  
  res.json(txn);
});

app.get(['/api/stash', '/stash'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(stashTransactionsTable).where(eq(stashTransactionsTable.userId, req.user.id)).orderBy(desc(stashTransactionsTable.createdAt)));
});

app.get(['/api/stash/total', '/stash/total'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  const txs = await db.select().from(stashTransactionsTable).where(eq(stashTransactionsTable.userId, req.user.id));
  const totalVal = txs.reduce((acc: number, t: any) => acc + (t.type === 'stash' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0);
  res.json({ total: totalVal });
});

app.post(['/api/ai/chat', '/ai/chat'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  
  // Get Stash Stats
  const txs = await db.select().from(stashTransactionsTable).where(eq(stashTransactionsTable.userId, req.user.id));
  const totalStashed = txs.reduce((acc: number, t: any) => {
    const val = parseFloat(t.amount);
    return t.type === 'stash' ? acc + val : acc - val;
  }, 0);
  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
  
  // Get Recent Icks
  const ickRows = await db.select({ total: drizzleSql`sum(amount)` }).from(transactionsTable).where(and(
    eq(transactionsTable.userId, req.user.id),
    eq(transactionsTable.tag, 'Ick')
  ));

  const totalIcks = parseFloat((ickRows[0]?.total as string) || "0");
  const saveStreak = streak?.saveStreak || 0;
  const userName = req.user.firstName || "User";

  const systemPrompt = `You are "Pocket Fund Coach", a friendly, motivational high-level financial expert for young adults in India. 
Tone: Encouraging, non-judgmental, straightforward, and slightly "Gen-Z" friendly but professional.
Currency: Always use Rupee (₹).
User Context:
- Name: ${userName}
- Total Saved: ₹${totalStashed}
- Saving Streak: ${saveStreak} days
- Recent "Icks" (unnecessary spending): ₹${totalIcks}

Your Role:
1. Help ${userName} understand their spending habits and how to save more.
2. Provide actionable financial tips (e.g., the 50/30/20 rule, emergency funds).
3. Celebrate their saving wins and motivate them to keep their streak alive.
4. Help them identify and fight "Icks" (impulse buys).
5. Explain financial terms simply.

Guidelines:
- Keep responses concise (3-5 sentences).
- Use ${userName}'s name occasionally.
- Be positive and supportive.
- If they ask about their stats, use the context provided.`;

  const ai = await callGemini({
    contents: [{ 
      role: "user", 
      parts: [{ text: `${systemPrompt}\n\nUser Question: ${req.body.message}` }] 
    }]
  });
  
  let responseText = ai?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!responseText && ai?.candidates?.[0]?.finishReason === "SAFETY") {
    responseText = "My tactical algorithms flagged this query as a safety risk. Protocol mismatch. Please rephrase your request.";
  }

  if (!responseText) {
    if (!GEMINI_API_KEY) {
      responseText = "I'm your Pocket Fund Coach, but my AI brain isn't connected yet! Ask your developer to add a valid GEMINI_API_KEY to the environment variables so I can help you reach your goals.";
    } else {
      // If we got an error object from callGemini but no text
      const errorMsg = ai?.error?.message || "Internal Neural Link Interruption";
      responseText = `I'm having a bit of trouble thinking right now (Error: ${errorMsg}). But remember: every ₹100 you save today is a step towards your freedom! What else can I help you with?`;
    }
  }
                      
  res.json({ response: responseText });
});

// ─── GOOGLE OAUTH ───────────────────────────────────────────────────────────

// Helper — always use env var so it exactly matches what's in Google Console
const getCallbackUrl = (req: any): string => {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;
  
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${protocol}://${host}/api/auth/google/callback`;
};

app.get(['/api/auth/google', '/auth/google'], (req: any, res: any) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'GOOGLE_CLIENT_ID not configured' });
  }
  const callbackUrl = getCallbackUrl(req);
  console.log('[Auth] Starting Google OAuth, callbackUrl:', callbackUrl);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'profile email',
    prompt: 'select_account',    // Always show account picker
    access_type: 'online',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get(['/api/auth/google/callback', '/auth/google/callback'], async (req: any, res: any) => {
  const { code, error: oauthError } = req.query;

  // Google returned an error (e.g., user denied access)
  if (oauthError) {
    console.error('[Auth] Google OAuth error:', oauthError);
    return res.redirect('/?auth_error=' + encodeURIComponent(String(oauthError)));
  }

  if (!code) {
    console.error('[Auth] No code received from Google');
    return res.redirect('/?auth_error=no_code');
  }

  try {
    const callbackUrl = getCallbackUrl(req);
    console.log('[Auth] Exchanging code for tokens. Callback:', callbackUrl);

    // 1. Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error('[Auth] Token exchange failed:', JSON.stringify(tokens));
      return res.redirect('/?auth_error=token_failed');
    }

    // 2. Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const gUser = await userRes.json();
    
    if (!gUser.id || !gUser.email) {
      console.error('[Auth] Invalid user info from Google:', JSON.stringify(gUser));
      return res.redirect('/?auth_error=userinfo_failed');
    }

    // DEBUG LOG FOR USER'S FRIEND
    if (gUser.email === 'preetin614@gmail.com') {
      console.log(`[Auth][DEBUG] Friend detected: ${gUser.email}. Running DB logic.`);
    }

    const db = getDb();
    if (!db) throw new Error("Database initialization failed");

    // 3. ROBUST UPSERT: 
    // First, try to find user by ID
    let [existingUser] = await db.select().from(usersTable).where(eq(usersTable.id, String(gUser.id)));
    
    // If not found by ID, try by email (prevents unique constraint crash)
    if (!existingUser) {
      const [userWithEmail] = await db.select().from(usersTable).where(eq(usersTable.email, gUser.email));
      existingUser = userWithEmail;
    }

    if (existingUser) {
      // UPDATE existing user with latest info
      await db.update(usersTable).set({
        id: String(gUser.id), // Ensure the Google ID is linked
        email: gUser.email,
        firstName: gUser.given_name,
        lastName: gUser.family_name,
        profileImageUrl: gUser.picture,
        updatedAt: new Date(),
      }).where(eq(usersTable.email, gUser.email));
      console.log(`[Auth] Existing user updated: ${gUser.email}`);
    } else {
      // NEW USER: Insert
      await db.insert(usersTable).values({
        id: String(gUser.id),
        email: gUser.email,
        firstName: gUser.given_name,
        lastName: gUser.family_name,
        profileImageUrl: gUser.picture,
        onboardingStatus: 'step_1',
      });
      console.log(`[Auth] New user created: ${gUser.email}`);
    }

    // 4. Set auth cookie
    const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure;
    res.cookie('userId', String(gUser.id), {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
    });

    console.log(`[Auth] Success for ${gUser.email}. Redirecting to app.`);
    return res.redirect('/');

  } catch (err: any) {
    console.error('[Auth] CALLBACK ERROR:', err?.stack || err?.message);
    return res.redirect('/?auth_error=server_error');
  }
});

app.get(['/api/logout', '/logout'], (req: any, res: any) => {
  res.clearCookie('userId', { path: '/', secure: true, sameSite: 'none' });
  res.redirect('/');
});

export default app;

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
    const currentQuests = await db.select().from(questsTable);
    if (currentQuests.length < 10) { 
      console.log("Seeding quests...");
      await db.delete(userQuestsTable);
      await db.delete(questsTable);
      
      const CHALLENGES = [
        { title: "The 1% Rule", description: "Save just 1% over your target today.", difficulty: "Easy", points: 50, content: JSON.stringify({ target: 50, type: "save" }), icon: "target", category: "challenge" },
        { title: "Subscription Audit", description: "Review and cancel one unused app subscription.", difficulty: "Medium", points: 100, content: JSON.stringify({ type: "manual" }), icon: "shield", category: "challenge" },
        { title: "Morning Brew Stash", description: "Stash ₹100 instead of buying that coffee today.", difficulty: "Easy", points: 30, content: JSON.stringify({ target: 100, type: "save" }), icon: "coffee", category: "challenge" },
        { title: "Impulse Shield", description: "Avoided an impulse buy? Stash that money!", difficulty: "Medium", points: 75, content: JSON.stringify({ type: "manual" }), icon: "zap", category: "challenge" },
        { title: "Generic Hero", description: "Swap a brand name for a generic one and stash ₹30.", difficulty: "Easy", points: 40, content: JSON.stringify({ target: 30, type: "save" }), icon: "shopping-bag", category: "challenge" },
      ];

      for (const c of CHALLENGES) {
        await db.insert(questsTable).values(c);
      }

      const COURSES = [
        {
          title: "The Zero-to-One of Money",
          description: "Learn why money exists and how it flows. The first step for any beginner.",
          difficulty: "Easy", points: 100, icon: "star", category: "literacy",
          content: JSON.stringify({
            duration: 10,
            slides: [
              { icon: "star", title: "Money: The Great Invention", text: "Money is a social agreement that stores your time and energy. Its value comes from trust.", keyTakeaway: "Value comes from trust.", example: "Stranded with cash vs bread." },
              { icon: "trending-up", title: "The Value Equation", text: "You are paid in proportion to the difficulty of the problem you solve.", keyTakeaway: "Specific knowledge = higher pay.", example: "Surgeon vs Doctor." }
            ],
            quizzes: [
              { question: "Money is a 'Social Ledger' because:", options: ["Govt made it", "It records stored work", "It's physical", "It's rare"], answer: 1 }
            ]
          })
        },
        {
          title: "Credit Score Architecture",
          description: "Understand the math behind your credit score and how it saves you money.",
          difficulty: "Easy", points: 120, icon: "shield", category: "literacy",
          content: JSON.stringify({
            duration: 10,
            slides: [
              { icon: "shield", title: "The Financial Resume", text: "Your credit score is your financial resume.", keyTakeaway: "Higher score = lower interest.", example: "Save lakhs on loans." }
            ],
            quizzes: [
              { question: "What is a good CIBIL score?", options: ["300", "500", "750+", "900"], answer: 2 }
            ]
          })
        },
        {
          title: "Mastering the 50/30/20 Rule",
          description: "The most robust budgeting framework for maximum freedom.",
          difficulty: "Medium", points: 200, icon: "calculator", category: "literacy",
          content: JSON.stringify({
            duration: 15,
            slides: [
              { icon: "calculator", title: "Philosophy of Proportion", text: "50% Needs, 30% Wants, 20% Savings.", keyTakeaway: "Budgeting is intentionality.", example: "The Pie analogy." }
            ],
            quizzes: [
              { question: "What is a 'Need'?", options: ["Fun spend", "Survival essentials", "Latest fashion", "Dining out"], answer: 1 }
            ]
          })
        },
        {
          title: "The Emergency Fund Blueprint",
          description: "Build a safety net to sleep peacefully regardless of the economy.",
          difficulty: "Medium", points: 200, icon: "shield", category: "literacy",
          content: JSON.stringify({
            duration: 20,
            slides: [
              { icon: "shield", title: "The SWAN Fund", text: "Sleep Well At Night fund. 3-6 months essentials.", keyTakeaway: "Insurance for life.", example: "Job loss protection." }
            ],
            quizzes: [
              { question: "How much is enough?", options: ["1mo salary", "3-6mo essentials", "1yr salary", "Whatever bank says"], answer: 1 }
            ]
          })
        },
        {
          title: "The Mutual Fund Revolution",
          description: "Learn professional managers grow your wealth through diversification.",
          difficulty: "Medium", points: 300, icon: "trending-up", category: "literacy",
          content: JSON.stringify({
            duration: 30,
            slides: [
              { icon: "users", title: "The Power of Pooling", text: "Mutual funds allow diversification for small amounts.", keyTakeaway: "Pool money to hire experts.", example: "₹500 vs ₹10 Lakhs." }
            ],
            quizzes: [
              { question: "Main benefit of Mutual Funds?", options: ["Guaranteed returns", "Diversification", "No taxes", "Free money"], answer: 1 }
            ]
          })
        },
        {
          title: "The Debt Trap Escape",
          description: "Strategies to destroy high-interest debt and reclaim freedom.",
          difficulty: "Medium", points: 350, icon: "zap", category: "literacy",
          content: JSON.stringify({
            duration: 45,
            slides: [
              { icon: "zap", title: "Math of Slavery", text: "Destructive debt (36% interest) is a medical emergency.", keyTakeaway: "Kill 36% before 8% growth.", example: "Credit cards." }
            ],
            quizzes: [
              { question: "Snowball method is about:", options: ["Math", "Psychology of small wins", "Cold weather", "Waiting"], answer: 1 }
            ]
          })
        },
        {
          title: "Equity Intelligence: Mastering Stocks",
          description: "Go deep into the engine of global business. Valuation and psychology.",
          difficulty: "Hard", points: 500, icon: "trending-up", category: "literacy",
          content: JSON.stringify({
            duration: 60,
            slides: [
              { icon: "building-2", title: "Ownership Architecture", text: "A stock is a legal claim on future profits.", keyTakeaway: "Be an owner, not a consumer.", example: "Buy Apple, not iPhone." }
            ],
            quizzes: [
              { question: "Volatility vs Risk?", options: ["Same", "Risk is total loss; Volatility is temp price move", "Volatility is worse", "None"], answer: 1 }
            ]
          })
        },
        {
          title: "Advanced Retirement Engineering",
          description: "Build a wealth machine. FI number and the 4% rule.",
          difficulty: "Hard", points: 600, icon: "target", category: "literacy",
          content: JSON.stringify({
            duration: 90,
            slides: [
              { icon: "target", title: "The 4% Rule", text: "Financial Independence = Annual Expenses x 25.", keyTakeaway: "Math-based retirement.", example: "₹50k/mo -> ₹1.5 Cr." }
            ],
            quizzes: [
              { question: "Your FI Number is?", options: ["Age x 2", "Expenses x 25", "Income x 10", "10 Crore"], answer: 1 }
            ]
          })
        }
      ];

      for (const course of COURSES) {
        await db.insert(questsTable).values(course);
      }
    }

    const currentBadges = await db.select().from(badgesTable);
    if (currentBadges.length === 0) {
      await db.insert(badgesTable).values([
        { name: "Stash Starter", description: "First stash deposit", icon: "piggy-bank", requirement: "Make 1 deposit" },
        { name: "Ick Fighter", description: "Successfully tagged an Ick", icon: "sword", requirement: "Tag 1 expense" }
      ]);
    }
  } catch (err) {
    console.error("[Seed] Error:", err);
  }
};


app.post('/api/admin/seed-courses', async (req: any, res: any) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ message: "DB not available" });
    console.log("[Admin] Forcing database re-seed...");
    await db.delete(userQuestsTable);
    await db.delete(questsTable);
    await seedData();
    res.json({ success: true, message: "Database re-seeded with MEGA courses." });
  } catch (err: any) {
    console.error("[Admin] Seed failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// Run seed on startup
seedData().catch(console.error);

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
  await seedData();
  res.json(await getDb().select().from(badgesTable));
});

app.get(['/api/user/badges', '/user/badges'], isAuthenticated, async (req: any, res) => {
  res.json(await getDb().select().from(userBadgesTable).where(eq(userBadgesTable.userId, req.user.id)));
});

app.get(['/api/quests', '/quests'], async (req, res) => {
  await seedData();
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
  await getDb().update(userQuestsTable).set({ 
    completed: true, 
    completedAt: new Date(),
    completionNote: req.body.completionNote || null
  }).where(and(eq(userQuestsTable.userId, req.user.id), eq(userQuestsTable.questId, req.params.id)));
  res.json({ success: true });
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
  
  const [txn] = await db.insert(stashTransactionsTable).values({
    userId: req.user.id, amount: amount.toFixed(2), type: req.body.type, goalId: req.body.goalId, status: 'completed'
  }).returning();
  
  await db.update(usersTable).set({ walletBalance: (isStash ? balance - amount : balance + amount).toFixed(2) }).where(eq(usersTable.id, req.user.id));
  
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
  const rows = await db.select({ total: drizzleSql`sum(amount)` }).from(stashTransactionsTable).where(and(eq(stashTransactionsTable.userId, req.user.id), eq(stashTransactionsTable.type, 'stash')));
  res.json({ total: parseFloat(rows[0]?.total || "0") });
});

app.post(['/api/ai/chat', '/ai/chat'], isAuthenticated, async (req: any, res) => {
  const db = getDb();
  
  // Get Stash Stats
  const stashRows = await db.select({ total: drizzleSql`sum(amount)` }).from(stashTransactionsTable).where(and(eq(stashTransactionsTable.userId, req.user.id), eq(stashTransactionsTable.type, 'stash')));
  const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, req.user.id));
  
  // Get Recent Icks
  const ickRows = await db.select({ total: drizzleSql`sum(amount)` }).from(transactionsTable).where(and(
    eq(transactionsTable.userId, req.user.id),
    eq(transactionsTable.tag, 'Ick')
  ));

  const totalStashed = parseFloat((stashRows[0]?.total as string) || "0");
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

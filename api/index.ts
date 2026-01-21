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
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
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

// --- AUTH MIDDLEWARE ---
const isAuthenticated = async (req: any, res: any, next: any) => {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });
  const db = getDb();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, String(userId)));
  if (!user) return res.status(401).json({ message: "User not found" });
  req.user = user;
  next();
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
  const quests = await db.select().from(questsTable);
  if (quests.length < 10) {
    console.log("Seeding quests (found " + quests.length + ", expected 10)...");
    try {
    await db.delete(userQuestsTable); // Clear dependent first
    await db.delete(questsTable);
    
    await db.insert(questsTable).values([
      { title: "The 1% Rule", description: "Save just 1% over your target today.", difficulty: "Easy", points: 50, content: JSON.stringify({ target: 50, type: "save" }), icon: "target", category: "challenge" },
      { title: "Subscription Audit", description: "Review and cancel one unused app subscription.", difficulty: "Medium", points: 100, content: JSON.stringify({ type: "manual" }), icon: "shield", category: "challenge" },
      { title: "Morning Brew Stash", description: "Stash ₹100 instead of buying that coffee today.", difficulty: "Easy", points: 30, content: JSON.stringify({ target: 100, type: "save" }), icon: "coffee", category: "challenge" },
      { title: "Impulse Shield", description: "Avoided an impulse buy? Stash that money!", difficulty: "Medium", points: 75, content: JSON.stringify({ type: "manual" }), icon: "zap", category: "challenge" },
      { title: "Generic Hero", description: "Swap a brand name for a generic one and stash ₹30.", difficulty: "Easy", points: 40, content: JSON.stringify({ target: 30, type: "save" }), icon: "shopping-bag", category: "challenge" },
      { title: "Commute GlowUp", description: "Walk or bike once and stash the ₹50 fare saved.", difficulty: "Medium", points: 60, content: JSON.stringify({ target: 50, type: "save" }), icon: "car", category: "challenge" },
      
      // --- Literacy Quests (In-Depth Content) ---
      { 
        title: "The 50/30/20 Framework", 
        description: "Master the most famous budgeting framework and learn the 'Anti-Budget' strategy.", 
        difficulty: "Easy", 
        points: 150, 
        icon: "trending-up", 
        category: "literacy",
        content: JSON.stringify({
          slides: [
            { title: "The Philosophy", text: "Budgeting isn't about restriction; it's about prioritization. The 50/30/20 rule provides a clear roadmap for every rupee you earn.", icon: "star" },
            { title: "50% Needs: The Foundation", text: "Essentials only: Rent/EMI, Groceries, Electricity, and Basic transport. Strategy: If your Needs exceed 50%, you're 'House Rich, Cash Poor'. Look to downsize fixed costs.", icon: "home" },
            { title: "30% Wants: The Lifestyle", text: "Dining out, Netflix, Hobbies. Framework: Use the '48-Hour Rule'—wait 2 days before buying a 'Want' over ₹1,000 to kill impulse spending.", icon: "shopping-bag" },
            { title: "20% Savings: The Future", text: "Investments and Debt. Problem: Many save 'what's left' at the end of the month. Strategy: 'Pay Yourself First' by automating this 20% on salary day.", icon: "shield" },
            { title: "The Anti-Budget", text: "If tracking every rupee is hard, try the Anti-Budget: Just pull out your 20% savings first, pay your 50% bills, and spend the rest guilt-free.", icon: "zap" }
          ],
          quiz: {
            question: "What is the 'Pay Yourself First' strategy?",
            options: ["Buying a treat after work", "Paying off credit cards early", "Moving your 20% savings as soon as you get paid", "Lending money to family"],
            answer: 2
          }
        })
      },
      { 
        title: "Emergency Fund Blueprint", 
        description: "Build a bulletproof safety net using the 'Sinking Fund' framework.", 
        difficulty: "Medium", 
        points: 200, 
        icon: "shield-check", 
        category: "literacy",
        content: JSON.stringify({
          slides: [
            { title: "The 3-Tier Strategy", text: "Tier 1: Starter Fund (₹25k-50k) for quick repairs. Tier 2: The Core (3 months expenses). Tier 3: Bulletproof (6-12 months).", icon: "help-circle" },
            { title: "Avoid the Interest Trap", text: "Problem: Keeping emergency cash in a Zero-interest box. Framework: Keep Tier 1 in savings, but put Tiers 2 & 3 in a Liquid Mutual Fund for higher growth.", icon: "calculator" },
            { title: "Sinking Funds vs. Emergency", text: "Framework: A car repair is an emergency. A car's annual insurance is a Sinking Fund. Plan for the expected so it doesn't become an emergency.", icon: "target" },
            { title: "When to use it?", text: "The 'ICK' Test: Is it Immediate? Is it Critical? Is it Known/Expected? If yes to the first two and no to the last, it's an emergency.", icon: "lock" }
          ],
          quiz: {
            question: "What is the primary difference between an Emergency Fund and a Sinking Fund?",
            options: ["Only Sinking funds earn interest", "Sinking funds are for expected costs (like Diwali), Emergency for unexpected", "There is no difference", "Emergency funds are only for health"],
            answer: 1
          }
        })
      },
      { 
        title: "Debt Destruction Lab", 
        description: "Snowball vs. Avalanche: Learn the psychology and math of getting debt-free.", 
        difficulty: "Hard", 
        points: 300, 
        icon: "zap", 
        category: "literacy",
        content: JSON.stringify({
          slides: [
            { title: "The Debt Avalanche (Math)", text: "Strategy: List all debts by Interest Rate. Pay minimums on all, throw every extra rupee at the highest interest rate first. Mathematically fastest.", icon: "trending-down" },
            { title: "The Debt Snowball (Psychology)", text: "Strategy: List debts by balance size. Pay minimums, but crush the smallest balance first. Why? Small wins create massive momentum.", icon: "trending-up" },
            { title: "The High-Interest Trap", text: "Credit cards in India often charge 36% to 42% per year. Framework: Never carry a balance. If you do, it's a Financial Emergency—Tier 1 cash should go here.", icon: "alert-triangle" },
            { title: "Good vs. Bad Debt", text: "Good: Education/Home loans (Asset building, low interest). Bad: Car loans/Personal loans for treats (Depreciating assets, high interest).", icon: "thumbs-down" }
          ],
          quiz: {
            question: "Which debt strategy focuses on clearing the smallest balance first to build emotional momentum?",
            options: ["The Avalanche", "The Snowball", "The Blizzard", "The Tornado"],
            answer: 1
          }
        })
      },
      { 
        title: "Investment Foundations", 
        description: "Understand the Power of 72 and the Rule of Compounding.", 
        difficulty: "Hard", 
        points: 500, 
        icon: "coffee", 
        category: "literacy",
        content: JSON.stringify({
          slides: [
            { title: "The Power of Compounding", text: "Example: ₹10,000/month at 12% for 10 years gives ₹23 Lakhs. For 30 years? It's ₹3.5 CRORE. Time is more important than the amount.", icon: "zap" },
            { title: "The Rule of 72", text: "Framework: Divide 72 by your interest rate. That's how many years it takes to double your money. (e.g., 72 / 12% = 6 years to double).", icon: "calculator" },
            { title: "Index Funds vs. Fancy Stocks", text: "Framework: 90% of professional pickers fail to beat the market over time. Most beginners should use Nifty 50 Index funds for steady, low-cost growth.", icon: "line-chart" },
            { title: "Risk Tolerance", text: "Strategy: Your age is the % of money to keep in safe assets (Debt), the rest in growth (Equity). At age 25, keep 25% in debt and 75% in equity.", icon: "shield" }
          ],
          quiz: {
            question: "According to the Rule of 72, if you earn a 9% return, how long does it take for your money to double?",
            options: ["9 years", "12 years", "8 years", "5 years"],
            answer: 2
          }
        })
      }
    ]);
    } catch (err) {
      console.error("Error seeding quests:", err);
    }
  }
  const badges = await db.select().from(badgesTable).limit(1);
  if (badges.length === 0) {
    await db.insert(badgesTable).values([
      { name: "Stash Starter", description: "First stash deposit", icon: "piggy-bank", requirement: "Make 1 deposit" },
      { name: "Ick Fighter", description: "Successfully tagged an Ick", icon: "sword", requirement: "Tag 1 expense" }
    ]);
  }
};

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

app.get(['/api/auth/google', '/auth/google'], (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = `https://${req.headers.host}/api/auth/google/callback`;
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=profile%20email&prompt=consent`);
});

app.get(['/api/auth/google/callback', '/auth/google/callback'], async (req, res) => {
  const { code } = req.query;
  const callbackUrl = `https://${req.headers.host}/api/auth/google/callback`;
  const tRes = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code: code as string, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: callbackUrl, grant_type: 'authorization_code' }) });
  const tokens = await tRes.json();
  const uRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
  const gUser = await uRes.json();
  await getDb().insert(usersTable).values({ id: String(gUser.id), email: gUser.email, firstName: gUser.given_name, lastName: gUser.family_name, profileImageUrl: gUser.picture, onboardingStatus: 'step_1' }).onConflictDoUpdate({ target: usersTable.id, set: { email: gUser.email, updatedAt: new Date() } });
  res.cookie('userId', String(gUser.id), { path: '/', maxAge: 7*24*60*60*1000, httpOnly: true, secure: true, sameSite: 'lax' });
  res.redirect('/hq');
});

app.get('/api/logout', (req, res) => { res.clearCookie('userId', { path: '/' }); res.redirect('/'); });

export default app;

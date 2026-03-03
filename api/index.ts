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
    if (currentQuests.length < 5) { // If missing or obviously stale
      console.log("Seeding quests...");
      await db.delete(userQuestsTable);
      await db.delete(questsTable);
      
      await db.insert(questsTable).values([
        { title: "The 1% Rule", description: "Save just 1% over your target today.", difficulty: "Easy", points: 50, content: JSON.stringify({ target: 50, type: "save" }), icon: "target", category: "challenge" },
        { title: "Subscription Audit", description: "Review and cancel one unused app subscription.", difficulty: "Medium", points: 100, content: JSON.stringify({ type: "manual" }), icon: "shield", category: "challenge" },
        { title: "Morning Brew Stash", description: "Stash ₹100 instead of buying that coffee today.", difficulty: "Easy", points: 30, content: JSON.stringify({ target: 100, type: "save" }), icon: "coffee", category: "challenge" },
        { title: "Impulse Shield", description: "Avoided an impulse buy? Stash that money!", difficulty: "Medium", points: 75, content: JSON.stringify({ type: "manual" }), icon: "zap", category: "challenge" },
        { title: "Generic Hero", description: "Swap a brand name for a generic one and stash ₹30.", difficulty: "Easy", points: 40, content: JSON.stringify({ target: 30, type: "save" }), icon: "shopping-bag", category: "challenge" },
        
        {
          title: "The Zero-to-One of Money",
          description: "Learn why money exists, how it flows, and the psychological traps that keep people broke.",
          difficulty: "Easy", points: 150, icon: "star", category: "literacy",
          content: JSON.stringify({
            slides: [
              { icon: "star", title: "Money: The Great Human Invention", text: "Money is the most successful shared fiction ever created by the human race. At its absolute core, a ₹500 note has zero intrinsic value—it is just a piece of high-quality paper with security threads. It only works because of a universal, unspoken agreement among billions of people: you trust that if you hand this paper to a shopkeeper, they will give you bread. And the shopkeeper trusts that they can hand that same paper to someone else for fuel.\n\nBefore money, humanity used the 'Barter System.' If you were a wheat farmer and needed a cow, you had to find a cattle owner who specifically wanted wheat right at that moment. This is known as the 'double coincidence of wants.' Barter was incredibly inefficient and impossible to scale for a growing civilization. Money solved this by becoming a universal medium of exchange. It allowed us to decouple the acquisition of what we want from the production of what we specialize in.\n\nThink of money as a 'Social Ledger.' When you work at your job today, you are giving your time and energy to society. Society, in return, gives you a 'Certificate of Appreciation' in the form of currency. This certificate (money) is essentially stored time. In the modern digital age, money has evolved further. More than 90% of the world's money exists only as bits and bytes on banking servers. When you check your bank balance on your phone, you're looking at digits that represent your claim on a portion of the world's resources. Mastery of finance begins here: understanding that money is an abstract tool for measuring, storing, and moving human energy across time and space.", keyTakeaway: "Money is a social agreement that stores your time and energy. Its value comes from trust.", example: "If you were stranded on a deserted island with ₹100 crore in cash, you would be 'poor' because there is no social agreement to recognize that value." },
              { icon: "trending-up", title: "The Value Equation: Why Some Earn Millions", text: "If money is a measurement of value, how do you actually get more of it? The answer is simple: You are paid in direct proportion to the difficulty of the problem you solve for other people. Most legacy education systems teach us to trade 'time' for money, leading to a linear growth trap. Consider the difference between a general physician and a heart surgeon. Both might work the same hours, but the surgeon is paid exponentially more. Why? Because the problem they solve is rarer, training is more intense, and stakes are higher.\n\nTo escape the trap of low income, you must stop focusing on 'effort' and start focusing on 'scarcity' and 'scale.' Effort is a commodity; everyone can work hard. But not everyone can manage a team of 50 people, or design a bridge, or write code that secures billions. Your income is not a reward for your sweat; it is a reflection of how difficult you are to replace. If anyone can do your job with one week of training, you will always be paid the minimum. To earn more, you must acquire 'Specific Knowledge'—skills that feel like play to you but look like work to others.", keyTakeaway: "The market doesn't pay for effort; it pays for the scale and scarcity of the value you contribute.", example: "A delivery driver works incredibly hard but is easily replaced. A Logistics Network Architect who designs the system used by 10,000 drivers is solving a much harder, rarer problem at scale." },
              { icon: "brain", title: "The Psychology of Want: The Dopamine Trap", text: "Most financial failures are caused by a lack of emotional self-regulation. We are wired for 'Instant Gratification,' which leads to financial ruin in a consumerist society. When you see a flashy new smartphone, your brain releases dopamine—the neurotransmitter associated with pleasure. Crucially, dopamine is released during the *anticipation* of the purchase, not the long-term ownership. This is why excitement fades into 'Buyer's Remorse' just a few days later.\n\nModern advertising is a multi-billion dollar machine designed to exploit these biological triggers. They don't sell you a watch; they sell you the feeling of being a successful, respected person. When you buy luxury items on a loan you can't afford, you aren't buying a product—you're buying the *perception* of status. True financial freedom is the things you *don't* see: the emergency fund that lets you quit a toxic job, the investments that provide for your family, and the time you own for yourself. Discipline is the ability to ignore the short-term dopamine of spending in favor of the long-term freedom of owning.", keyTakeaway: "Spend to maintain your life, not your ego. Discipline is choosing what you want *most* over what you want *now*.", example: "A person with a ₹12 lakh car loan who earns ₹50,000/month is 'status rich' but 'freedom poor'." },
              { icon: "zap", title: "Inflation: The Silent, Ongoing Robbery", text: "Inflation is the single greatest threat to your long-term financial health. Imagine you have ₹10,000 in a safe today. You leave it there for 20 years. In 2046, it is still ₹10,000, but the milk that cost ₹50 today now costs ₹150. Your ₹10,000 is still physically there, but its 'Economic Weight' has been crushed. In India, historical inflation is roughly 6-7% per year, meaning the 'purchasing power' of your cash drops by half every decade.\n\nIf your bank savings account only gives you 3% interest, you are actually *becoming poorer* every single day. This is a negative real return. Inflation is essentially a hidden tax on everyone who holds cash and a hidden gift to everyone who owns productive assets. To survive, you must stop 'saving' and start 'investing.' You need your money to grow at a rate *higher* than inflation. Productive assets—like shares in profitable companies, land, or gold—tend to appreciate over time as the value of currency falls. Holding large amounts of cash for decades is a guaranteed way to lose your life's work to the invisible thief of inflation.", keyTakeaway: "Inflation is the decrease in what your money can buy. Keeping cash for long periods is a guaranteed loss.", example: "In 1990, a cinema ticket was ₹10. Today it's ₹300. That's a 30x increase. If your grandfather saved ₹1000 in 1990, it bought 100 tickets. Today, it buys 3." },
              { icon: "target", title: "The Magic of Compounding and Time", text: "Einstein described Compound Interest as the '8th Wonder of the World' because it allows a person with a small regular income to become a multi-millionaire, provided they have one thing: TIME. Compounding is the process where your investment earns a return, and in the next period, that return *also* earns a return. It is an exponential explosion that humans struggle to visualize because we think linearly.\n\nIf you invest ₹1 lakh at a 15% return, in the first year you earn ₹15,000. By Year 20, it is ₹16 lakh. By Year 30, it is ₹66 lakh! The secret isn't the ₹1 lakh; it's the 30 years. The 'Heavy Lifting' happens at the very end of the curve. This is why Warren Buffett earned over 99% of his fortune after his 50th birthday. Time is your greatest asset, far more important than the amount of money you start with. A 20-year-old who invests just ₹1,000 per month will likely end up with much more wealth than a 40-year-old who starts investing ₹10,000 per month. You cannot buy more time, but you can start using it today.", keyTakeaway: "Compounding turns small, consistent habits into massive late-stage wealth. Focus on time in the market, not timing the market.", example: "Person A invests from age 25 to 35 and stops. Person B invests from 35 to 65. Person A often ends up with more because their money had a 10-year head start to compound." }
            ],
            quizzes: [
              { question: "Money is a 'Social Ledger' because:", options: ["Government made it", "It records stored work society honors later", "It tracks success", "It's a physical asset"], answer: 1 },
              { question: "How do you double income without more hours?", options: ["Work harder", "Increase Leverage/Scale", "Ask for raises", "Save more"], answer: 1 },
              { question: "Why 'Buyer's Remorse'?", options: ["Broken product", "Dopamine fades after purchase", "Inflation", "Rude shopkeeper"], answer: 1 },
              { question: "If interest is 4% but inflation is 6%:", options: ["Growing 4%", "Staying same", "Losing 2% power annually", "Growing 10%"], answer: 2 },
              { question: "Most critical factor in compounding?", options: ["Starting amount", "Daily news", "Time allowed for growth", "Bank prestige"], answer: 2 }
            ]
          })
        },
        {
          title: "Mastering the 50/30/20 Rule",
          description: "The most robust budgeting framework for maximum freedom.",
          difficulty: "Medium", points: 200, icon: "calculator", category: "literacy",
          content: JSON.stringify({
            slides: [
              { icon: "calculator", title: "The Philosophy of Proportion", text: "Most people fail at budgeting because they think it's about restriction. They try to track every single rupee, which leads to exhaustion. The 50/30/20 rule takes a different approach: it's about **Structure**. It focuses on the high-level proportions of your income rather than the micro-details of spending.\n\nFinancial freedom isn't about saying 'NO' to every coffee; it's about saying 'YES' to the things that matter most while ensuring your future is secure. A budget is actually a 'Permission Slip' to spend money on things you value. By dividing your take-home pay into three distinct buckets—Needs, Wants, and Savings—you ensure that you can survive today, enjoy today, and build wealth for tomorrow. If you have money left in your 'Wants' bucket for the month, the expense is already accounted for.", keyTakeaway: "Budgeting is about intentionality, not deprivation. Use proportions to maintain balance.", example: "Think of your income as a pie. Instead of worrying about every crumb, just make sure the three main slices stay the right size." },
              { icon: "home", title: "The 50% Needs: Protecting Your Foundation", text: "The first slice is the 50% allocated to your 'Needs.' These are non-negotiable expenses you *must* pay to maintain health, safety, and your basic ability to earn. In India, this includes rent/EMI, groceries, utilities, essential commuting, and minimum loan repayments. The most common mistake is 'Needs Inflation'—confusing a basic need with an upgraded desire.\n\nHousing is a fundmental need, but paying for a 4BHK when you are single is a 'Want' masquerading as a 'Need.' If your core needs exceed 50% of your take-home pay, you are 'House Poor' or 'Loan Poor.' You have zero breathing room, and any emergency will force you into debt. To fix this, you must either find a way to increase income or make the difficult decision to downsize fixed costs until survival fits within 50%.", keyTakeaway: "Needs are about survival and earning capacity. If they exceed 50%, your financial house is at risk.", example: "If take-home is ₹60k but rent/EMI alone is ₹40k, you have already failed the 50% rule before buying groceries." },
              { icon: "shopping-bag", title: "The 30% Wants: The Joy Bucket", text: "This is where most financial advice goes wrong. Traditional gurus suggest cutting out all joy—the 30% 'Wants'—to save money. This lead to a 'spending binge' later. The 50/30/20 rule recognizes that you have a right to enjoy your hard-earned money. This bucket is for dining out, Netflix, travel, and hobbies.\n\nThis 30% is a **Cap**, not a floor. When financial situations get tough, this bucket acts as your primary shock absorber. It can be cut to zero without affecting survival. Value-based spending means identifying the 2-3 things that genuinely make you happy and ruthlessly cutting rest. As long as the total remains under 30%, you are doing perfectly. This allows you to live a rich life today while respecting your future.", keyTakeaway: "Wants keep you motivated. Treat this bucket as a flexible variable to dial up or down.", example: "To buy a ₹15k gadget, you decide which other 'wants' (like dinners) to give up this month to stay under 30%." },
              { icon: "shield", title: "The 20% Savings: Paying Your Future Self", text: "This final 20% is for building long-term wealth: your Emergency Fund, aggressive debt repayment, and investments like Mutual Funds or PPF. The problem is that people save 'what is left' at the end of the month. According to Parkinson’s Law, expenses naturally expand to fill available money. There is almost *never* anything left.\n\nTo break this, practice the golden rule: **Pay Yourself First**. As soon as your salary hits, move that 20% to a separate account. Treat your savings like a mandatory bill you owe to your 'Future Self'—the person who will eventually be too old to work and rely on these savings. If 20% is hard, start with 5% and increase by 1% every few months. The 'Habit' is more important than the amount. Automating this is the single most effective action for wealth.", keyTakeaway: "Savings are a debt to your future. Automate the 20% on salary day so you never see it as spendable.", example: "A person earning ₹40k who saves ₹8k is 'wealthier' than a person earning ₹1.2 lakh who saves ₹0." },
              { icon: "target", title: "Reverse Lifestyle Creep", text: "The 50/30/20 rule is a destination, not a rigid law. If rent in a city like Mumbai is high, you might start at 60/20/20. The important thing is the **Direction** of your behavior. As your income grows, aim for 'Reverse Lifestyle Creep.'\n\nMost people use a raise to buy a bigger car, which keeps their savings rate at 0%. Instead, if you get a ₹20k raise, keep your lifestyle exactly where it is and move that extra amount into your savings bucket. Suddenly, your rate might jump to 30% or 40%. This 'Gap' is where your freedom lives. It’s what allows you to take risks, start a business, or retire early. Start today by looking at bank statements for the last 90 days. Categorize honestly, be ruthless, and remember: you are building a life.", keyTakeaway: "The 'Gap' between earning and spending is where your freedom lives.", example: "If you get a bonus, don't spend it. Put it in savings to boost your rate without changing your daily life at all." }
            ],
            quizzes: [
              { question: "What is a 'Need'?", options: ["Regular spend", "Health/Survival/Earning essentials", "What friends pay", "Status items"], answer: 1 },
              { question: "Benefit of 'Pay Yourself First'?", options: ["More for wants", "Ensures automatic wealth building", "Kills debt", "VIP status"], answer: 1 },
              { question: "If Needs are 75% of income:", options: ["Stop saving", "Ignore budget", "Downsize fixed costs", "Spend more"], answer: 2 },
              { question: "With ₹1 lakh salary, 'Wants' cap is?", options: ["₹50k", "₹20k", "₹30k", "₹10k"], answer: 2 },
              { question: "Shock absorber bucket?", options: ["50% Needs", "30% Wants", "20% Savings", "Bank fund"], answer: 1 }
            ]
          })
        },
        {
          title: "The Emergency Fund Blueprint",
          description: "Build a safety net to sleep peacefully regardless of the economy.",
          difficulty: "Medium", points: 200, icon: "shield", category: "literacy",
          content: JSON.stringify({
            slides: [
              { icon: "shield", title: "The 'Sleep Well At Night' (SWAN) Fund", text: "An emergency fund is insurance, not an investment. Its purpose isn't to make money, but to prevent losing everything when life goes wrong. Most live 1-2 paychecks from collapse. A sudden medical crisis or layoff should not be a tragedy forced upon you.\n\nAn emergency fund breaks this cycle of fragility. It's a dedicated chunk of cash sitting in a safe, boring place. People with funds navigate global crises with a sense of calm. When you have six months of essential cash in the bank, your boss loses the power to bully you, and you gain the 'mental bandwidth' to make smart decisions instead of panic-driven ones. Security must always come before growth.", keyTakeaway: "It's your financial immune system. It buys you peace of mind and time to think clearly during a crisis.", example: "During economic shocks, those with 6-month funds stay calm while those without are forced into ruin within weeks." },
              { icon: "calculator", title: "How Much is Enough? Scaling Your Safety Net", text: "Target 3-6 months of ESSENTIAL expenses. The real answer depends on your personal 'Fragility'—how likely is your income to stop? We calculate based on **Expenses** (cost to survive), not income.\n\n**3 Months:** Young, single, low expenses, stable job.\n**6-12 Months:** Children, aging parents, or freelancers/business owners in volatile industries like Tech. To find your 'Survival Number,' add up Rent/EMI, Food, Utilities, Transport, and Insurance. Multiply this by your target months. When you hit this, you have effectively bought months of freedom from the need to earn.", keyTakeaway: "Target 3-6 months of survival expenses. Go higher if you have dependents or irregular pay.", example: "If earnings are ₹80k but essentials are ₹30k, your 6-month goal is ₹1.8 Lakh, not ₹4.8 Lakh." },
              { icon: "lock", title: "Safe and Liquid: Where to Park Your Protection", text: "Your fund has two rules: Safe and Liquid. SAFE means the principle amount never fluctuates—so no stock market. Imagine the market crashes 30% exactly when companies start firing people. LIQUID means you get the money within 24 hours. A property is not an emergency fund because you can't sell a kitchen sink to pay a hospital bill.\n\nStrategy: Keep 10% as cash or in your main account for instant access. Keep 90% in a separate High-Interest Savings Account with a *different* bank, or a 'Sweep-in' Fixed Deposit. Separation is psychological—it prevents 'accidental' spending on sales.", keyTakeaway: "Zero risk and instant access are the priorities. Avoid the stock market for this fund.", example: "Sweep-in FDs earn high interest but the bank breaks them instantly if you swipe your card at a pharmacy." },
              { icon: "target", title: "Dealing with Debt and the Starter Fund", text: "If you have high-interest debt like credit cards (15-40%), that debt *is* an emergency. But you should first build a **'Starter Fund'** of ₹25k-50k. Life doesn't stop for your debt plan. If your phone breaks and you have ₹0, you'll be forced back into debt.\n\nThe Starter Fund is a shield that prevents 'relapsing.' Once you have it, stop all saving and attack high-interest debt with everything. Once the debt is dead, finish the full 6-month fund. 1. Starter Fund -> 2. Kill High-Interest Debt -> 3. Full 6-Month Fund -> 4. Long-term Investing.", keyTakeaway: "Small starter fund stops you from relapsing into more debt while you tackle old ones.", example: "₹25k savings with debt is more secure than ₹0 savings with debt. One can handle a leaking pipe; other goes deeper into debt." },
              { icon: "zap", title: "The Discipline: Rules of Use and Refill", text: "Define emergencies strictly. Is it unexpected? Necessary for survival or earning? Urgent? If the answer to all is not 'Yes,' it is a 'Want' that should come from your 30% bucket. Car service is NOT an emergency; it's a planned expense.\n\nThe moment you withdraw from your fund, enter 'Code Red.' Pause all discretionary spending and cancel SIP investments until the fund is restored to 100%. Treat it like the oxygen supply in a submarine; if it's low, nothing else matters except refilling it.", keyTakeaway: "Define emergencies strictly. Refilling the fund is your #1 financial priority if touched.", example: "Establish a 'Holy Sh*t' rule. If it isn't a situation that makes you say that aloud, keep the vault closed." }
            ],
            quizzes: [
              { question: "Purpose of an Emergency Fund?", options: ["Max returns", "Mental bandwidth and calm", "Bank VIP", "Sales/Liquidation"], answer: 1 },
              { question: "How to calculate goal?", options: ["6mo salary", "3-6mo essentials", "Fixed ₹5L", "Credit limit"], answer: 1 },
              { question: "Poorest place to keep it?", options: ["Savings acct", "Sweep-in FD", "Stock market", "Liquid fund"], answer: 2 },
              { question: "When build ₹25k Starter Fund?", options: ["After debt-free", "Before killing high-interest debt", "After buying house", "Never"], answer: 1 },
              { question: "After using the fund?", options: ["Continue usual", "Refill as #1 priority", "Take replacement loan", "Forget it"], answer: 1 }
            ]
          })
        }
      ]);
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

import { db } from "./db";
import { quests } from "@shared/schema";
import { eq } from "drizzle-orm";

const LITERACY_COURSES = [
  {
    title: "What Is Money?",
    description: "Understand the basics of money — what it is, where it comes from, and why it matters in everyday life.",
    difficulty: "Easy",
    points: 50,
    icon: "star",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "star",
          title: "Money is a Tool, Not a Goal",
          text: "Money itself has no value — a ₹500 note is just paper. Its power comes from what people agree it can buy. Think of money as a universal voucher: you trade your time and skills for it, then trade it back for things you need or want."
        },
        {
          icon: "trending-up",
          title: "Where Does Money Come From?",
          text: "Governments and central banks (like the Reserve Bank of India) control the supply of money. They print currency and set rules about how it flows. But in your life, money comes from one main place: the value you create for others — through your job, your business, or your investments."
        },
        {
          icon: "calculator",
          title: "The Three Uses of Money",
          text: "Every rupee you have can do one of three things: (1) Spend — buy goods and services right now. (2) Save — keep it for later use. (3) Invest — put it to work so it grows into more money. Most people only Spend. The rich prioritise Save and Invest first."
        },
        {
          icon: "shield",
          title: "Inflation: Why ₹100 Won't Buy the Same Tomorrow",
          text: "Inflation is the slow rise in prices over time. If inflation is 6% per year, something that costs ₹100 today will cost ₹106 next year. This means money sitting idle in cash LOSES value. This is why saving in a bank (which gives interest) and investing (which can beat inflation) is critical."
        }
      ],
      quizzes: [
        {
          question: "Why does a ₹500 note have value?",
          options: [
            "Because it's made of special paper",
            "Because people agree and trust it as a medium of exchange",
            "Because the government forces you to accept it",
            "Because it is backed by gold reserves"
          ],
          answer: 1
        },
        {
          question: "If inflation is 8% in a year, what happens to ₹1,000 kept as cash?",
          options: [
            "It grows to ₹1,080",
            "It stays exactly the same",
            "Its purchasing power effectively drops to about ₹926",
            "It doubles in value"
          ],
          answer: 2
        },
        {
          question: "Which of the following is the BEST first financial habit to build?",
          options: [
            "Spend everything you earn on enjoying life",
            "Save and invest a portion of income before spending",
            "Borrow money to invest",
            "Keep all your money as cash at home"
          ],
          answer: 1
        }
      ]
    })
  },
  {
    title: "Needs vs Wants",
    description: "Learn the #1 skill every financially healthy person has: telling the difference between what you truly need and what you just want.",
    difficulty: "Easy",
    points: 75,
    icon: "shopping-bag",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "shopping-bag",
          title: "The Golden Rule of Spending",
          text: "A **Need** is something essential for your survival or basic functioning — food, rent, medicine, transport to work. A **Want** is something that improves your comfort or pleasure — Netflix, new shoes, eating out. There's nothing wrong with wants, but buying them before covering your needs is a fast track to financial stress."
        },
        {
          icon: "calculator",
          title: "The 50/30/20 Rule Simplified",
          text: "A classic budgeting guide: spend **50%** of your income on Needs (rent, groceries, bills), **30%** on Wants (entertainment, eating out, hobbies), and **20%** on Savings & Debt repayment. Most Indians spend 70%+ on basic needs, which is fine — the key is to actively track and cut Wants when savings are falling short."
        },
        {
          icon: "shield",
          title: "The 24-Hour Rule",
          text: "Before buying anything that is a Want and costs over ₹500, wait 24 hours. You'll find that most impulse purchases (that new gadget, the trending sneakers) feel far less urgent the next day. This single habit can save you thousands of rupees every month."
        },
        {
          icon: "trending-up",
          title: "Lifestyle Creep: The Silent Wealth Killer",
          text: "When your income goes up, do your savings go up too? For most people, expenses grow with income — this is called **Lifestyle Creep**. You upgrade your phone, eat at nicer restaurants, move to a bigger flat. The key is to save and invest a raise BEFORE your lifestyle adjusts to the new income."
        }
      ],
      quizzes: [
        {
          question: "Monthly internet bill for working from home — Need or Want?",
          options: [
            "Want — internet is a luxury",
            "Need — it is essential for income generation",
            "It depends on how fast the connection is",
            "Neither — it's an investment"
          ],
          answer: 1
        },
        {
          question: "You get a ₹10,000 salary raise. What does 'Lifestyle Creep' look like?",
          options: [
            "Investing the full ₹10,000",
            "Saving ₹5,000 and spending ₹5,000 more",
            "Immediately upgrading your phone, rent, and dining habits so expenses rise by ₹10,000",
            "Paying off existing debt first"
          ],
          answer: 2
        },
        {
          question: "According to the 50/30/20 rule, if you earn ₹50,000/month, how much should go to savings?",
          options: [
            "₹5,000",
            "₹15,000",
            "₹10,000",
            "₹25,000"
          ],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Building Your First Budget",
    description: "A budget isn't a restriction — it's a plan that tells your money where to go so you're always in control.",
    difficulty: "Easy",
    points: 100,
    icon: "calculator",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "calculator",
          title: "Why Most People Avoid Budgeting",
          text: "Budgeting feels boring or restrictive. But here's the truth: people without a budget don't have more freedom — they just have less clarity. A budget is simply a plan. Would you take a road trip with no map? Your finances are the same. A budget is your GPS."
        },
        {
          icon: "home",
          title: "Step 1: Know Your Income",
          text: "List every source of income you have this month: salary, freelance work, rent received, interest, side hustles. Only count what you are CERTAIN to receive. Don't include bonuses or variable income unless you're sure. This is your total income for the budget."
        },
        {
          icon: "shopping-bag",
          title: "Step 2: List Your Fixed & Variable Expenses",
          text: "**Fixed expenses** are the same every month: rent, EMI, insurance premium, subscriptions. **Variable expenses** change: groceries, fuel, eating out, entertainment. Fixed are easy to plan. Variable is where most people overspend. Track every variable expense — even ₹50 chai counts."
        },
        {
          icon: "trending-up",
          title: "Step 3: Save FIRST, Spend the Rest",
          text: "Most people budget like this: Income → Spend → Save whatever's left (which is often nothing). Flip the formula. Income → Save your target first → Spend what's left. This is called **Paying Yourself First** and it's the single most powerful budgeting principle."
        }
      ],
      quizzes: [
        {
          question: "Which of these is a FIXED expense?",
          options: [
            "Grocery shopping",
            "Eating out with friends",
            "Monthly rent payment",
            "Fuel costs"
          ],
          answer: 2
        },
        {
          question: "What is 'Paying Yourself First'?",
          options: [
            "Spending on yourself before paying bills",
            "Taking a salary from your own business",
            "Setting aside savings immediately when income arrives, before spending on anything else",
            "Buying what you want before considering others"
          ],
          answer: 2
        },
        {
          question: "You earn ₹40,000 this month. Rent is ₹12,000, groceries ₹5,000, subscriptions ₹1,000, and you want to save ₹8,000. How much is left for other spending?",
          options: [
            "₹14,000",
            "₹13,000",
            "₹20,000",
            "₹18,000"
          ],
          answer: 0
        }
      ]
    })
  },
  {
    title: "Emergency Fund 101",
    description: "The #1 financial safety net every person needs before they do anything else with their money.",
    difficulty: "Medium",
    points: 125,
    icon: "shield",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "shield",
          title: "What Is an Emergency Fund?",
          text: "An emergency fund is money set aside specifically for unexpected, urgent expenses: job loss, medical emergency, urgent home repair, car breakdown. It is NOT for planned expenses (vacation, new TV) and NOT for investments. Think of it as your personal insurance policy."
        },
        {
          icon: "calculator",
          title: "How Much Do You Need?",
          text: "The standard rule: **3 to 6 months of your monthly expenses**. If your monthly expenses are ₹30,000, your emergency fund target is ₹90,000 to ₹1,80,000. If your income is irregular (freelance, gig work), aim for 6–12 months. This fund acts as a buffer so a single crisis doesn't destroy years of financial progress."
        },
        {
          icon: "home",
          title: "Where Should You Keep It?",
          text: "Your emergency fund must be: (1) **Safe** — not in stocks where value can drop. (2) **Liquid** — accessible within 24–48 hours. (3) **Separate** — not in your regular account (too easy to spend). Best options: a high-yield savings account, liquid mutual funds, or a short-term FD with premature withdrawal allowed."
        },
        {
          icon: "trending-up",
          title: "How to Build It When You Have Nothing",
          text: "Start small. Even ₹500 a month is a start. Automate it — set up an auto-transfer on salary day so it's moved before you see it. Sell unused items. Use windfalls (bonus, tax refund) to accelerate. Most people build a full emergency fund in 12–18 months if they're consistent. The key word is consistent."
        }
      ],
      quizzes: [
        {
          question: "Your friend's car breaks down and they need ₹15,000 for repairs. They have no savings. What should they have had?",
          options: [
            "A credit card to cover it",
            "A personal loan",
            "An emergency fund",
            "Investment in stocks"
          ],
          answer: 2
        },
        {
          question: "Where is the BEST place to park your emergency fund?",
          options: [
            "In high-growth stocks for maximum returns",
            "Under your mattress as cash",
            "In a liquid, safe account like a high-yield savings account or liquid fund",
            "In a 5-year fixed deposit with lock-in"
          ],
          answer: 2
        },
        {
          question: "Your monthly expenses are ₹25,000. What is the minimum recommended emergency fund?",
          options: [
            "₹25,000 (1 month)",
            "₹75,000 (3 months)",
            "₹5,00,000 (20 months)",
            "₹10,000 (less than 1 month)"
          ],
          answer: 1
        }
      ]
    })
  },
  {
    title: "Understanding Credit & Debt",
    description: "Debt is a tool. Used wisely, it builds wealth. Used carelessly, it destroys it. Learn the difference.",
    difficulty: "Medium",
    points: 150,
    icon: "help-circle",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "help-circle",
          title: "Good Debt vs Bad Debt",
          text: "**Good debt** helps you build wealth or income: a home loan (asset that appreciates), an education loan (increases earning potential), a business loan (generates revenue). **Bad debt** costs you money with no return: credit card debt for shopping, personal loans for vacations, Buy Now Pay Later for gadgets. The interest you pay is the real cost."
        },
        {
          icon: "calculator",
          title: "How Interest Really Works",
          text: "Credit card companies charge 36–42% annual interest in India. If you spend ₹10,000 on a credit card and only pay the minimum each month, you'll pay back ₹14,000–₹16,000 over time. Compare that to a home loan at 8–9% — you pay far less extra. Always know the interest rate before taking on debt."
        },
        {
          icon: "shield",
          title: "Your Credit Score: The Number That Costs You Money",
          text: "A CIBIL score (credit score in India) ranges from 300–900. Above 750 is excellent. Banks use this to decide if they'll lend to you and at what rate. A low score = higher interest rates or loan rejection. It's built by: paying bills on time, not using too much of your credit limit, and not applying for too many loans at once."
        },
        {
          icon: "trending-up",
          title: "The Debt Avalanche Method",
          text: "If you have multiple debts, use the **Avalanche Method**: list all debts by interest rate, highest first. Pay minimum on all, but put every extra rupee toward the highest-rate debt first. Once cleared, attack the next one. This saves the most money in interest over time. Alternatively, the **Snowball Method** pays smallest balance first for psychological wins."
        }
      ],
      quizzes: [
        {
          question: "A credit card charges 40% annual interest. You owe ₹20,000 and only pay the minimum each month. What will happen?",
          options: [
            "The debt will stay the same",
            "The debt will slowly decrease to zero in 12 months",
            "The debt will grow rapidly and you'll end up paying back far more than ₹20,000",
            "The bank will forgive the interest after 6 months"
          ],
          answer: 2
        },
        {
          question: "Which of these is considered 'Good Debt'?",
          options: [
            "A credit card loan to buy a new TV on sale",
            "A personal loan to fund a vacation",
            "A home loan to purchase a property that appreciates in value",
            "BNPL (Buy Now Pay Later) for new shoes"
          ],
          answer: 2
        },
        {
          question: "What is the most effective strategy to build a good CIBIL credit score?",
          options: [
            "Apply for as many credit cards as possible",
            "Never use credit at all",
            "Pay all EMIs and credit card bills on time, every time",
            "Keep a very high credit card balance"
          ],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Investing Basics: Make Money Work for You",
    description: "Investing isn't just for rich people. With as little as ₹100 a month, you can start building wealth today.",
    difficulty: "Hard",
    points: 200,
    icon: "trending-up",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "trending-up",
          title: "The Power of Compound Interest",
          text: "Einstein reportedly called compound interest the 'eighth wonder of the world'. Compounding means you earn interest on your interest. ₹10,000 invested at 12% annual return becomes ₹17,623 in 5 years, ₹31,058 in 10 years, and ₹96,462 in 20 years — without adding another rupee. Start EARLY. A 25-year-old beats a 35-year-old investor hands down."
        },
        {
          icon: "shield",
          title: "FD vs Mutual Funds vs Stocks",
          text: "**Fixed Deposits (FD)**: Safe, guaranteed 6–7% return, but barely beats inflation. Good for short-term goals. **Mutual Funds**: Pooled money managed by experts. Returns of 10–15% historically. Safer than stocks but some risk exists. **Stocks**: Direct ownership of companies. Highest potential return (15–20%+) but highest risk. Rule of thumb: invest in stocks only money you won't need for 5+ years."
        },
        {
          icon: "calculator",
          title: "SIP — India's Favourite Way to Invest",
          text: "A Systematic Investment Plan (SIP) means investing a fixed amount in a mutual fund every month — like ₹500 or ₹1,000. You buy more units when prices fall and fewer when they rise, which averages your cost over time (called rupee cost averaging). SIPs make investing automatic, disciplined, and accessible to everyone."
        },
        {
          icon: "star",
          title: "The Rule of 72",
          text: "Want to know how long it takes for your money to double? Divide 72 by your annual return rate. At 8% return: 72 ÷ 8 = **9 years** to double. At 12% return: 72 ÷ 12 = **6 years**. At 6% (most FDs): **12 years**. This is why higher returns compound dramatically over time and why investing early matters so much."
        }
      ],
      quizzes: [
        {
          question: "You invest ₹5,000/month via SIP for 20 years at 12% annual return. Approximately how much will you have?",
          options: [
            "₹12,00,000 (just your contributions)",
            "₹18,00,000",
            "₹49,95,740 (compounding in action!)",
            "₹1,00,000"
          ],
          answer: 2
        },
        {
          question: "Using the Rule of 72, how many years does it take to double money at 9% annual return?",
          options: [
            "9 years",
            "8 years",
            "12 years",
            "6 years"
          ],
          answer: 1
        },
        {
          question: "What is the main advantage of investing via SIP compared to a lump sum?",
          options: [
            "SIPs always guarantee a higher return",
            "SIPs are completely risk-free",
            "Rupee cost averaging — you buy more units when markets fall, reducing average cost",
            "SIPs are only available through government banks"
          ],
          answer: 2
        }
      ]
    })
  }
];

export async function seedLiteracyCourses() {
  if (!db) {
    console.log("Database not connected. Skipping seeding.");
    return;
  }

  console.log("🌱 Seeding financial literacy courses...");

  for (const course of LITERACY_COURSES) {
    // Check if course with this title already exists
    const existing = await db.select().from(quests).where(eq(quests.title, course.title));
    
    if (existing.length === 0) {
      await db.insert(quests).values(course);
      console.log(`✅ Created course: "${course.title}" (${course.points} XP)`);
    } else {
      // Update the content to ensure quizzes are up to date
      await db.update(quests)
        .set({ 
          content: course.content,
          points: course.points,
          description: course.description,
          difficulty: course.difficulty
        })
        .where(eq(quests.title, course.title));
      console.log(`🔄 Updated course: "${course.title}" (${course.points} XP)`);
    }
  }

  console.log(`✨ Done! ${LITERACY_COURSES.length} courses seeded.`);
}

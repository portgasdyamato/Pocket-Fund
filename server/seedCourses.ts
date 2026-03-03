import { db } from "./db";
import { quests } from "@shared/schema";
import { eq } from "drizzle-orm";

const LITERACY_COURSES = [
  {
    title: "What Is Money?",
    description: "Understand the basics of money — what it is, where it comes from, and why it matters in everyday life. Perfect for anyone starting from scratch.",
    difficulty: "Easy",
    points: 50,
    icon: "star",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "star",
          title: "Money Is Just a Shared Agreement",
          text: "A ₹500 note is just paper and ink. It has value only because millions of people agree it does. This shared agreement is what makes money powerful. Before money existed, people used barter — trading one good for another. But barter was inefficient: you needed someone who had exactly what you wanted AND wanted exactly what you had.\n\nMoney solved this problem by becoming a universal medium of exchange. Instead of carrying cows to market, you carry notes and coins.",
          keyTakeaway: "Money has no intrinsic value — its power comes entirely from collective trust and agreement.",
          example: "If everyone suddenly stopped believing a ₹500 note was valuable, it would be worthless paper. This is why financial crises (like hyperinflation in Zimbabwe) destroy economies — trust in money collapses."
        },
        {
          icon: "trending-up",
          title: "Where Does Your Money Actually Come From?",
          text: "The Reserve Bank of India controls the supply of money in India's economy. They print currency and manage how much money flows in the system. Too little money = recession (people can't buy things). Too much money = inflation (prices go up because money becomes less valuable).\n\nBut in YOUR life, money comes from one source: the value you create for other people. Your employer pays you because you help them make money. A business earns because it solves problems customers are willing to pay for. Even interest and dividends are payment for letting others use your money.",
          keyTakeaway: "You earn money by creating value. The more value you create, the more money you can earn.",
          example: "A software developer who can build apps that save companies ₹10 lakhs gets paid more than one who can only fix bugs. Higher value = higher pay."
        },
        {
          icon: "calculator",
          title: "The Three Things Money Can Do",
          text: "Every single rupee you own can do one of three things:\n\n1. SPEND — Trade it now for goods and services you need or want today.\n2. SAVE — Keep it for a future purchase or emergency. Money saved is security.\n3. INVEST — Put it to work so it creates MORE money over time through returns.\n\nMost people default to spending everything they earn. The financially healthy person pays themselves first — they set aside amounts to save and invest BEFORE deciding what to spend.",
          keyTakeaway: "The 3 uses of money: Spend, Save, Invest. Prioritise them in reverse order for wealth building.",
          example: "Ramesh earns ₹40,000/month. He spends ₹38,000 and saves ₹2,000. Suresh earns the same but invests ₹8,000 first, then lives on ₹32,000. After 20 years, Suresh has over ₹1 crore. Ramesh has ₹2-3 lakhs top."
        },
        {
          icon: "shield",
          title: "Inflation: The Invisible Tax on Your Money",
          text: "Inflation is the gradual rise in prices over time. India's average inflation rate is around 5-7% per year. This means ₹1,000 today will buy roughly ₹930 worth of goods next year. Hold ₹1,000 as cash for a decade and its real purchasing power drops to under ₹600.\n\nThis is why keeping all your money as cash is a terrible long-term plan. A bank savings account giving 3-4% interest doesn't even beat inflation. You need growth that outpaces inflation — which requires investing.",
          keyTakeaway: "If your money isn't growing at least as fast as inflation, it's shrinking in real value every year.",
          example: "In 2004, a samosa cost ₹2. In 2024, it costs ₹15-20. That's 700-900% inflation in 20 years — about 11-12% annually on snacks. Your savings need to grow faster than this."
        },
        {
          icon: "home",
          title: "The Time Value of Money",
          text: "₹100 today is worth MORE than ₹100 one year from now. Why? Because today's ₹100 can be invested and grow into ₹108 or ₹115 a year from now. This concept — the time value of money — is the foundation of all of finance.\n\nIt explains why it's better to receive money now than later, why debt costs you money, and why starting to invest early is the single most powerful financial decision you can make. A 25-year-old investing ₹5,000/month will accumulate FAR more by age 60 than a 35-year-old investing the same amount.",
          keyTakeaway: "Time is the most powerful ingredient in wealth building. The sooner you start, the more money does the heavy lifting.",
          example: "Investing ₹1 lakh at age 25 at 12% return grows to ₹30 lakhs by age 65 (40 years). Investing the same ₹1 lakh at age 35 only grows to ₹9.6 lakhs (30 years). 10 years' difference = ₹20 lakhs difference!"
        }
      ],
      quizzes: [
        {
          question: "A ₹500 note has value because:",
          options: ["It's made from special paper", "The government printed it", "People collectively trust and agree it can be exchanged for goods and services", "It is backed by gold reserves in RBI"],
          answer: 2
        },
        {
          question: "India's inflation is 6% per year. You keep ₹50,000 cash under your mattress for 5 years. What happens?",
          options: ["It grows to ₹66,911", "It stays ₹50,000 but feels like less", "Its purchasing power effectively drops to about ₹37,363 in today's terms", "Nothing — cash is always safe"],
          answer: 2
        },
        {
          question: "Which of the following BEST describes the correct order of priority for your income?",
          options: ["Spend everything first, save what's left", "Pay bills first, then spend, then invest", "Save and invest a set amount first, then spend the remainder", "Invest everything and spend nothing"],
          answer: 2
        },
        {
          question: "Why is it better to receive ₹10,000 today rather than ₹10,000 one year from now?",
          options: ["Because prices might drop in a year", "Because today's ₹10,000 can be invested and grow into more over the year", "Because the note might wear out", "There is no difference"],
          answer: 1
        },
        {
          question: "Priya invests ₹5,000/month from age 25. Deepa invests the same from age 35. At age 60, assuming 12% annual returns, who has more money?",
          options: ["Deepa, because she invested more carefully", "They will have the same since the amount per month is identical", "Priya, by a massive margin — she had 10 extra years of compounding", "Deepa, because younger people take more risk"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Needs vs Wants",
    description: "The most important skill in personal finance: knowing the difference between what you must have and what you simply desire.",
    difficulty: "Easy",
    points: 75,
    icon: "shopping-bag",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "shopping-bag",
          title: "The Foundation of Every Budget",
          text: "A NEED is something essential for your basic functioning and survival. Without it, your health, safety, or ability to earn would be seriously compromised. Examples: rent/housing, food, medicine, electricity, transport to work, mobile phone for work communication.\n\nA WANT is something that improves your comfort, pleasure, or lifestyle — but is not essential. Examples: Netflix, new sneakers, restaurant meals, a newer phone when yours works fine, branded clothing.\n\nThe crucial insight: neither is bad. Wants add joy to life. The problem is buying wants before covering needs, or confusing the two.",
          keyTakeaway: "Needs are non-negotiable. Wants are choices. Both can exist in a healthy budget — but needs come first.",
          example: "Your current phone working fine? A new iPhone is a WANT. Phone is broken and you work via apps? Replacing it is a NEED. Context matters hugely."
        },
        {
          icon: "calculator",
          title: "The 50/30/20 Rule — A Simple Budget Framework",
          text: "One of the most popular and practical budgeting methods divides your after-tax income into three buckets:\n\n50% → NEEDS: Rent, groceries, electricity bills, transport, EMIs, insurance premiums, minimum debt payments\n\n30% → WANTS: Dining out, entertainment, shopping, travel, hobbies, subscriptions\n\n20% → SAVINGS & DEBT REPAYMENT: Emergency fund, investments, extra debt payments\n\nThis isn't a rigid law — adapt it to your situation. If you live in a high-rent city like Mumbai, needs might take 60-65%. That's okay. The key is being intentional about each category.",
          keyTakeaway: "The 50/30/20 rule: Needs 50%, Wants 30%, Savings 20%. Adjust to fit your reality, but always save something.",
          example: "Monthly income: ₹60,000. Target: ₹30,000 for rent+food+bills, ₹18,000 for dining/fun, ₹12,000 for investments and savings. If rent alone is ₹25,000, adjust wants down to ₹15,000 and savings to ₹10,000."
        },
        {
          icon: "shield",
          title: "Lifestyle Creep: The Silent Wealth Killer",
          text: "Here's what happens to most people when they get a raise: their expenses grow to match the new income. New salary → upgrade the phone, move to a nicer flat, eat at better restaurants, buy branded clothes. This is called LIFESTYLE CREEP.\n\nThe result? Despite earning more, they save exactly the same percentage (often zero). A person earning ₹1 lakh and saving ₹0 is in the same financial position as when they earned ₹40,000 and saved ₹0. The number changed; the habit didn't.\n\nThe antidote: when income rises, save or invest the majority of the increase BEFORE adjusting your lifestyle. Lock it away automatically so it never enters your spending account.",
          keyTakeaway: "Lifestyle creep silently eliminates wealth gains from every promotion and raise. Fight it by saving raises before spending them.",
          example: "You get a ₹15,000 annual raise. If you invest ₹10,000/month of that at 12% for 20 years, you'll have ₹1 crore from that single raise. If you spend it all on a nicer flat, you have nothing extra."
        },
        {
          icon: "home",
          title: "The 24-Hour Rule and Other Tricks to Beat Impulse Spending",
          text: "Impulse spending on wants is the #1 drain on most people's finances. Marketers spend billions engineering FOMO, urgency, and desire. Your brain's dopamine system rewards the ACT of buying — not the ownership after.\n\nPractical tools to fight it:\n• The 24-Hour Rule: Before buying any want over ₹500, wait 24 hours. Most impulses fade.\n• The 'Cost Per Use' Test: Divide price by how many times you'll actually use it. ₹5,000 shoes worn twice = ₹2,500 per use. Terrible value.\n• The 'Work Hours' Test: How many hours of work does this cost? A ₹4,000 purchase at ₹200/hour = 20 hours of your life.\n• Unsubscribe from retail emails and delete shopping apps from your home screen.",
          keyTakeaway: "Impulse buying is engineered by marketers. The 24-hour rule and 'cost per use' thinking are powerful counter-tools.",
          example: "Meera saved ₹28,000 in 6 months just by deleting shopping apps and applying the 24-hour rule. 90% of items she had in her cart — she didn't buy within a day."
        },
        {
          icon: "trending-up",
          title: "Reframing Wants: Spending Consciously",
          text: "The goal isn't to eliminate wants — it's to spend on wants CONSCIOUSLY, not by default. A helpful reframe: instead of 'I can't afford this', say 'I'm choosing not to spend on this right now because I'm prioritising X'.\n\nValue-based spending means identifying what genuinely makes you happy long-term and cutting spending on everything that doesn't serve those values.\n\nResearch consistently shows that spending on EXPERIENCES creates more lasting happiness than spending on THINGS. A weekend trip often brings more joy than a new gadget of the same price. And spending on OTHERS (giving, treating loved ones) often brings more satisfaction than spending on yourself.",
          keyTakeaway: "Conscious, value-based spending on wants is healthy. Mindless spending on wants out of habit, FOMO, or boredom is wealth-destroying.",
          example: "Raj cut his ₹8,000/month random shopping habit. He redirected ₹5,000 into a travel fund and invested ₹3,000. He takes two trips a year now and has ₹3.6 lakh invested after 10 years. More happiness, more wealth."
        }
      ],
      quizzes: [
        {
          question: "Your current phone works, but the new model just launched. Buying it is a:",
          options: ["Need — technology is essential for survival", "Want — your existing phone meets your needs", "Need — you should always have the latest tech", "Investment — phones appreciate in value"],
          answer: 1
        },
        {
          question: "Using the 50/30/20 rule, if you earn ₹80,000/month, how much should go toward savings and investment?",
          options: ["₹8,000", "₹24,000", "₹16,000", "₹40,000"],
          answer: 2
        },
        {
          question: "What is 'Lifestyle Creep'?",
          options: ["When prices rise faster than your income", "When your spending increases to match every income increase, leaving savings unchanged", "When you invest in risky assets", "When you spend money on unnecessary gadgets"],
          answer: 1
        },
        {
          question: "You see shoes for ₹6,000 online. Using the 24-hour rule, what should you do?",
          options: ["Buy immediately — they might sell out", "Add to cart and check back the next day before deciding", "Never buy anything online", "Buy if you have the money available"],
          answer: 1
        },
        {
          question: "Research shows which type of spending creates the MOST lasting happiness?",
          options: ["Buying expensive physical goods (luxury items)", "Experiences and spending on others", "Saving all money and spending nothing", "Daily convenience upgrades"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "Building Your First Budget",
    description: "A budget isn't a restriction — it's freedom. Learn to build one that actually works for your life in 4 practical steps.",
    difficulty: "Easy",
    points: 100,
    icon: "calculator",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "calculator",
          title: "Why Most People Avoid Budgets (And Why That's a Mistake)",
          text: "The word 'budget' feels restrictive, like going on a financial diet. Most people avoid it for one of two reasons:\n1. They think budgets are for people who are struggling with money.\n2. They feel it'll make life joyless and complicated.\n\nBoth are myths. A budget is simply a PLAN that tells your money where to go. Without one, money silently disappears and you wonder at month-end where it all went. People who budget consistently have less financial stress, not more — because they know exactly where they stand.\n\nThe goal isn't to restrict your life. It's to align your spending with your values and goals.",
          keyTakeaway: "A budget gives you control and clarity. It's the opposite of restriction — it's a roadmap to financial freedom.",
          example: "Studies show that people with written budgets save 15-20% more than those without, even when their incomes are identical."
        },
        {
          icon: "home",
          title: "Step 1: Calculate Your True Monthly Income",
          text: "Before building a budget, you need to know exactly how much money is coming in. This sounds obvious, but many people get it wrong:\n\n• Use TAKE-HOME pay (after taxes and PF deductions), not your CTC\n• Include all regular income: salary, freelance work, rental income, interest\n• For variable income (freelance, sales commission), use a CONSERVATIVE estimate — the lowest amount you reliably earn in an average month\n• Do NOT include: one-time windfalls, expected bonuses (unless confirmed), hoped-for income\n\nBeing honest and conservative here is critical. Overestimating income leads to overspending.",
          keyTakeaway: "Budget from your TAKE-HOME pay, not your CTC. Use a conservative estimate for any variable income.",
          example: "Amit's CTC is ₹8 lakhs/year. After PF, tax, and deductions, his take-home is ₹52,000/month. He budgets from ₹52,000 — not ₹66,667 (CTC divided by 12)."
        },
        {
          icon: "shield",
          title: "Step 2: List Every Expense — Fixed and Variable",
          text: "FIXED EXPENSES are the same every month and non-negotiable:\n• Rent/EMI\n• Insurance premiums\n• Subscriptions (Netflix, gym, etc.)\n• Loan repayments\n\nVARIABLE EXPENSES change month to month:\n• Groceries\n• Electricity and utility bills\n• Fuel and transport\n• Dining out and entertainment\n• Clothing and personal care\n\nFor variable expenses, look at your last 3 months of bank statements. Calculate the average. Be honest — don't underestimate. Many people discover they spend ₹5,000-₹10,000/month on things they didn't consciously realise (delivery apps, small purchases that add up).",
          keyTakeaway: "Track every rupee for one month. Most people find 15-25% of their spending goes to things they barely remember buying.",
          example: "Kavya thought she spent ₹3,000/month on food delivery. When she checked her bank statement, the actual number was ₹7,400 — nearly 2.5x what she estimated."
        },
        {
          icon: "trending-up",
          title: "Step 3: Pay Yourself First",
          text: "The single most powerful budgeting principle: move your savings BEFORE you spend on anything else.\n\nMost people budget like this:\nIncome → Pay all bills → Spend on wants → Save whatever's left (usually ₹0)\n\nThe correct sequence:\nIncome → SAVE/INVEST your target amount → Pay bills → Spend the rest\n\nThis is called 'Pay Yourself First.' Set up an automatic transfer to your savings account on the day salary arrives. You literally never see the money — so you can't spend it. Force the saving, then live on what remains.\n\nStart with even 5-10% of income. Increase by 1% every 3 months. After a year, you'll barely notice and you'll be saving significantly.",
          keyTakeaway: "Automate your savings on payday. 'Pay yourself first' is the most reliable path to consistent wealth building.",
          example: "Priya earns ₹55,000 and sets up an auto-transfer of ₹8,000 on salary day to her savings account. She lives on ₹47,000. After 2 years, she has ₹1.92 lakh in savings plus interest — without ever feeling deprived."
        },
        {
          icon: "calculator",
          title: "Step 4: Review, Adjust, Repeat",
          text: "A budget is a living document, not a one-time task. Real life won't match your plan perfectly — and that's okay. The goal is to review monthly and course-correct.\n\nMonthly budget review (takes 15 minutes):\n1. Compare actual spending to budget in each category\n2. Identify where you overspent and why\n3. Adjust next month's budget if needed\n4. Celebrate wins — every month under budget in a category is a victory\n\nTools to make it easy:\n• A simple spreadsheet works perfectly\n• Banking apps like HDFC, SBI, ICICI have spending summaries\n• Dedicated apps: Walnut, Money Manager, Spendee\n\nAfter 3-4 months, budgeting becomes second nature and takes minutes.",
          keyTakeaway: "Month-end budget reviews keep you on track and reveal patterns in your spending you'd otherwise never notice.",
          example: "After reviewing his first budget, Vikram found he spent ₹9,000 on 'random' UPI payments. Setting a ₹5,000 'miscellaneous' limit with weekly check-ins reduced this to ₹3,200 the next month."
        }
      ],
      quizzes: [
        {
          question: "Which income figure should you use when building a personal budget?",
          options: ["Your CTC (Cost to Company)", "Your take-home pay after all deductions", "Your gross salary before tax", "The salary you hope to have next year"],
          answer: 1
        },
        {
          question: "Your rent is ₹15,000/month, your Netflix is ₹649, and your electricity bill varies between ₹800-₹1,400. Which are FIXED expenses?",
          options: ["All three are fixed", "Rent and Netflix are fixed; electricity is variable", "Only rent is fixed", "None — all can change"],
          answer: 1
        },
        {
          question: "What does 'Pay Yourself First' mean?",
          options: ["Buying things you want before paying bills", "Transferring savings/investment money immediately on payday, before spending anything", "Paying yourself a salary from your business", "Spending on self-care before financial obligations"],
          answer: 1
        },
        {
          question: "Shreya earns ₹70,000/month. She wants to save 20%. When should she move ₹14,000 to savings?",
          options: ["At month-end, if she has ₹14,000 left over", "On payday, as the very first transaction via automatic transfer", "Whenever she feels like it during the month", "Only after all bills and groceries are paid"],
          answer: 1
        },
        {
          question: "After 3 months of budgeting, you notice you consistently overspend on groceries by ₹2,000. What is the BEST response?",
          options: ["Abandon the budget — it isn't working", "Increase your grocery budget by ₹2,000 and reduce another category, or find ways to shop smarter", "Ignore it and hope next month is better", "Stop buying groceries"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "Emergency Fund 101",
    description: "Before any investment, you need this one financial safety net. Learn what it is, why it's non-negotiable, and how to build it from scratch.",
    difficulty: "Medium",
    points: 125,
    icon: "shield",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "shield",
          title: "What Is an Emergency Fund and Why Is It Non‑Negotiable?",
          text: "An emergency fund is cash set aside exclusively for genuine, unexpected financial emergencies. It is NOT a vacation fund, a 'fun money' reserve, or a supplement to your monthly budget. It is purely insurance against life's most common financial shocks:\n\n• Job loss or income disruption\n• Medical emergency for you or a family member\n• Urgent car or vehicle repair\n• Critical home repair (burst pipe, roof damage)\n• Medical emergency for a dependent parent\n\nWithout it, even a single unexpected expense forces you to go into debt — often at high interest rates. People with emergency funds navigate crises without financial damage.",
          keyTakeaway: "An emergency fund is your financial immune system. Without it, any shock can spiral into long-term financial damage.",
          example: "Rajan lost his job in 2020. Without an emergency fund, he used credit cards and borrowed from family to survive 5 months without income. He spent 2 years paying off that debt at 36% interest. His colleague Meena had 6 months of expenses saved — she survived comfortably and found a better job without debt."
        },
        {
          icon: "calculator",
          title: "How Much Do You Actually Need?",
          text: "The standard recommendation: 3 to 6 months of your total monthly EXPENSES (not income).\n\n• Stable job, dual-income household, strong family network → 3 months\n• Single income, dependent family members, unstable industry → 6 months\n• Freelancer, self-employed, contractor, irregular income → 6-12 months\n\nCalculate your monthly essential expenses: rent + groceries + utilities + transport + insurance + loan EMIs. That's your monthly 'survival number.' Multiply by 3-6.\n\nDon't try to build it all at once. Set a target and work toward it over months. Even ₹20,000-₹30,000 covers many small emergencies and is infinitely better than zero.",
          keyTakeaway: "Your emergency fund target = 3-6 months of essential expenses. For irregular income, aim for 6-12 months.",
          example: "Monthly expenses: Rent ₹12,000 + groceries ₹5,000 + bills ₹2,000 + transport ₹3,000 + insurance ₹2,000 = ₹24,000. A 3-month fund = ₹72,000. A 6-month fund = ₹1,44,000."
        },
        {
          icon: "home",
          title: "Where Should You Keep the Emergency Fund?",
          text: "Your emergency fund has three requirements:\n1. SAFE — Not exposed to market risk. You can't have it drop 30% right when you need it.\n2. LIQUID — Accessible within 24-48 hours without penalties or waiting periods.\n3. SEPARATE — Not in your regular spending account, where you'll be tempted to use it for non-emergencies.\n\nBest options:\n• High-yield savings account (some banks offer 4-6% on savings accounts like DCB, RBL, Kotak)\n• Liquid mutual funds (returns of 5-7%, withdrawal in 1-2 business days)\n• Bank FD with sweep-in facility (earns FD rates but accessible on demand)\n\nNOT suitable: Stock market, equity mutual funds, PPF (5-year lock-in), crypto (too volatile)",
          keyTakeaway: "Emergency fund = safe + liquid + separate. High-yield savings accounts and liquid mutual funds are ideal.",
          example: "Divya keeps her emergency fund in a liquid mutual fund earning 6.5% annually. When her father needed emergency surgery (₹85,000), she redeemed units and received money in her account by next day."
        },
        {
          icon: "trending-up",
          title: "How to Build It When You Have Very Little",
          text: "Building a solid emergency fund feels daunting when money is tight. But here's how to make progress regardless of where you're starting:\n\nSTEP 1: Start with a micro-goal. Target ₹10,000 first (covers most minor emergencies). Even ₹500/month reaches this in 20 months.\n\nSTEP 2: Automate it. Set up a standing instruction on payday. Treat it like a bill — non-negotiable.\n\nSTEP 3: Windfalls go in. Tax refunds, work bonuses, festival cash gifts — all go into the fund until the target is hit.\n\nSTEP 4: Sell unused items. Old electronics, books, clothes — one-time sale can give you ₹5,000-₹20,000 toward the fund.\n\nSTEP 5: Cut one expense temporarily. Pause one subscription. Skip restaurant meals for 2 months. Every bit accelerates progress.",
          keyTakeaway: "Start small, automate it, use windfalls. Most people can build a starter emergency fund within 6-12 months with intentional effort.",
          example: "On a ₹35,000 salary, Ananya saved ₹2,000/month, added her ₹8,000 tax refund, and sold unused items for ₹6,000. She hit her ₹70,000 target in 28 months — without feeling financially strained."
        },
        {
          icon: "shield",
          title: "Rules for Using and Replenishing Your Emergency Fund",
          text: "An emergency fund only works if you use it ONLY for genuine emergencies and replenish it after use.\n\nTHIS IS AN EMERGENCY:\n• Job loss income gap\n• Unexpected medical bill\n• Critical vehicle repair keeping you from work\n• Urgent home repair (affecting safety/livability)\n\nTHIS IS NOT AN EMERGENCY:\n• A flight sale you want to use for vacation\n• New phone launch\n• Credit card bill you couldn't pay\n• Festive shopping\n\nAfter every withdrawal, your first financial priority becomes replenishing the fund to its target level. Suspend discretionary spending and extra investments until the fund is restored.",
          keyTakeaway: "Use the fund only for genuine emergencies. If you dip into it, rebuilding it immediately becomes your #1 financial priority.",
          example: "Sanjay used ₹45,000 from his emergency fund for a medical procedure. The next 3 months, he paused his SIP investments and directed that money to restore the fund before resuming investments."
        }
      ],
      quizzes: [
        {
          question: "Your AC breaks in summer and repair costs ₹12,000. Is this an emergency fund situation?",
          options: ["No — it's a household item, not a life emergency", "Yes — it's unexpected and urgent. This is exactly what an emergency fund is for", "Only if the repair costs more than ₹20,000", "No — use a credit card and pay it off later"],
          answer: 1
        },
        {
          question: "You're a freelancer with variable monthly income. What emergency fund target is most appropriate?",
          options: ["1 month of expenses", "3 months of expenses", "6-12 months of expenses", "No emergency fund needed — freelancers earn more"],
          answer: 2
        },
        {
          question: "Where should you NOT keep your emergency fund?",
          options: ["High-yield savings account", "Liquid mutual funds", "A separate bank FD with sweep-in facility", "Equity mutual funds tied to stock market performance"],
          answer: 3
        },
        {
          question: "You get a ₹25,000 Diwali bonus. Your emergency fund is ₹40,000 short of target. What should you do?",
          options: ["Spend the bonus on festive shopping — it's a celebration", "Put the entire ₹25,000 toward the emergency fund shortfall", "Invest the bonus in stocks", "Split it: ₹15,000 for fun, ₹10,000 toward the fund"],
          answer: 1
        },
        {
          question: "You use ₹60,000 from your emergency fund to cover a medical expense. What is your IMMEDIATE next financial priority?",
          options: ["Invest in the stock market to recover losses", "Take a loan to rebuild the fund faster", "Pause discretionary spending and direct money to restore the emergency fund before other goals", "The fund served its purpose — no need to rebuild it"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Understanding Credit & Debt",
    description: "Debt is a tool. Used correctly, it builds wealth. Used carelessly, it enslaves. Learn to tell the difference and manage debt smartly.",
    difficulty: "Medium",
    points: 150,
    icon: "help-circle",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "help-circle",
          title: "Good Debt vs Bad Debt",
          text: "Not all debt is equal. The distinguishing factor: does the debt help you BUILD something valuable, or does it CONSUME value?\n\nGOOD DEBT builds an asset or earns a return greater than the interest cost:\n• Home loan: Property likely appreciates; you build equity (ownership). Rate: 8-9%\n• Education loan: Increases your long-term earning capacity significantly\n• Business loan: Generates revenue exceeding interest costs\n\nBAD DEBT funds consumption with nothing to show afterward:\n• Credit card debt for shopping: 36-42% annual interest\n• Personal loan for vacation: 12-22% interest, nothing grows from it\n• Buy Now Pay Later for gadgets: often 18-30% effective interest\n• Loan to buy a depreciating asset (new car on loan): asset loses value as debt accrues",
          keyTakeaway: "Good debt creates assets or income. Bad debt funds lifestyle with no return. Interest rate is the critical differentiator.",
          example: "Taking a ₹50 lakh home loan at 9% for an apartment that appreciates to ₹80 lakhs in 10 years = good debt. Taking a ₹3 lakh personal loan at 18% to fund a vacation = bad debt — you pay ₹1.4 lakh in interest for a memory."
        },
        {
          icon: "calculator",
          title: "How Interest REALLY Works — The Math That Changes Lives",
          text: "Interest compounds — meaning you pay interest on interest already accumulated. This is devastating with high-rate debt.\n\nCredit card example:\nYou spend ₹20,000 on a credit card at 3% monthly interest (36% annually)\nYou pay only the minimum (₹700/month)\nTime to pay off: 5+ years\nTotal interest paid: ₹22,000+\nYou end up paying OVER DOUBLE the original purchase!\n\nThe minimum payment trap: Credit card companies set minimum payments low on purpose — to keep you in debt longer and collect maximum interest.\n\nRule: ALWAYS pay your credit card balance in FULL every month. If you can't, you're spending beyond your means.",
          keyTakeaway: "Never pay only the credit card minimum. Full payment every month means 0% effective interest rate — the only way to use credit cards without cost.",
          example: "₹15,000 credit card balance at 36% annual interest: paying ₹500/month means 4+ years to clear and ₹9,000+ in interest. Paying ₹2,000/month clears it in 9 months with only ₹2,000 in interest."
        },
        {
          icon: "shield",
          title: "Your CIBIL Score: The Number That Sets Your Interest Rates",
          text: "Your CIBIL score (India's credit score system) ranges from 300 to 900. This three-digit number determines:\n• Whether you can get a loan at all\n• What interest rate you'll be offered\n• Credit card limits you'll receive\n\nScore 750-900 → Excellent. Banks compete for your business. Best interest rates.\nScore 650-749 → Good. You'll get loans but at average rates.\nScore 550-649 → Fair. Higher rates, some rejections.\nScore below 550 → Poor. Most lenders will reject you.\n\nFactors that BUILD your score:\n• Paying all EMIs and credit card bills on time, every time (most important factor — 35%)\n• Keeping credit utilisation below 30% (use only ₹30,000 of your ₹1 lakh limit)\n• Long credit history\n\nFactors that HURT your score:\n• Late or missed payments\n• Defaulting on loans\n• Applying for multiple loans simultaneously",
          keyTakeaway: "Pay every bill on time and keep credit utilisation below 30%. These two habits alone will build an excellent credit score.",
          example: "Rohit and Suresh both apply for a ₹50 lakh home loan. Rohit's CIBIL is 800 → gets 8.5% interest. Suresh's is 620 → gets 9.5% interest. Over 20 years, that 1% difference costs Suresh ₹7+ lakh extra in interest!"
        },
        {
          icon: "trending-up",
          title: "The Debt Avalanche: The Smartest Way to Pay Off Multiple Debts",
          text: "If you have multiple debts, you need a systematic payoff strategy. Two popular methods:\n\nAVALANCHE METHOD (mathematically optimal):\n1. List all debts by interest rate, highest to lowest\n2. Pay minimum on ALL debts every month (never miss)\n3. Put every extra rupee toward the HIGHEST-INTEREST debt\n4. When that's cleared, roll that payment amount into the next highest-rate debt\nResult: You pay the least total interest. Best for saving money.\n\nSNOWBALL METHOD (psychologically easier):\n1. List all debts by BALANCE, smallest to largest\n2. Pay minimum on all; put extra money toward SMALLEST BALANCE\n3. Eliminate debts one by one for motivation\nResult: Quick wins keep you motivated. Costs a bit more in total interest.",
          keyTakeaway: "Avalanche method saves maximum money. Snowball method gives quicker motivation. Choose based on your personality — the one you'll actually stick to is the right one.",
          example: "Deepa has: Credit card ₹30,000 at 36%; personal loan ₹80,000 at 15%; bike loan ₹40,000 at 11%. Avalanche: tackle credit card first. Snowball: tackle bike loan first. Avalanche saves her ₹12,000 in interest overall."
        },
        {
          icon: "home",
          title: "Credit Cards: Friend or Enemy?",
          text: "Credit cards are exceptional financial tools when used correctly. They offer:\n• 45-50 day interest-free window on purchases\n• 1-5% cashback or reward points on spending\n• Purchase protection and fraud protection\n• Insurance benefits on travel, electronics\n• Help build your credit score\n• Emergency purchasing power\n\nThey become dangerous when:\n• You spend money you don't have\n• You carry a balance month-to-month\n• You see available credit as 'your money'\n\nThe GOLDEN RULE: Use credit cards like a debit card. Only spend money you already have in your account. Pay the full balance every month by due date. Never use more than 30% of your credit limit.",
          keyTakeaway: "Credit cards are powerful tools for the disciplined. Pay in full every month, never carry a balance, and earn rewards for free.",
          example: "Aisha spends ₹25,000/month on a 2% cashback card — paid fully every month. She earns ₹6,000/year in cashback with zero interest paid. Over 10 years, that's ₹60,000 free money, plus a great credit score."
        }
      ],
      quizzes: [
        {
          question: "You take a ₹5 lakh education loan at 9% interest to complete an MBA that increases your salary by ₹3 lakhs/year. This is:",
          options: ["Bad debt — you should never borrow for education", "Good debt — the return (₹3 lakh salary increase) far exceeds the cost", "Neither — education loans are too risky", "Bad debt — all loans are dangerous"],
          answer: 1
        },
        {
          question: "Your credit card bill is ₹18,000. Interest is 3%/month. You pay only ₹1,000 minimum. What happens?",
          options: ["The balance stays at ₹18,000", "The balance slowly reduces over 18 months to zero", "Interest compounds on the unpaid amount, making your debt grow rapidly", "The bank forgives interest if you pay minimum consistently"],
          answer: 2
        },
        {
          question: "Which single factor has the BIGGEST impact on your CIBIL credit score?",
          options: ["The number of credit cards you have", "Paying all bills and EMIs on time, every time", "Your annual income", "How many times you check your credit score"],
          answer: 1
        },
        {
          question: "Using the Debt Avalanche method, which debt should you prioritise paying off first?",
          options: ["The debt with the smallest balance", "The debt with the highest interest rate", "The debt with the longest remaining term", "The most recent debt"],
          answer: 1
        },
        {
          question: "The 'Golden Rule' of credit card use is:",
          options: ["Never use credit cards — cash only", "Use your full credit limit every month to maximise credit score", "Spend only what you can pay back in full by the due date, every month", "Pay at least the minimum to avoid penalties"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Investing Basics: Make Money Work for You",
    description: "Investing isn't for the rich — it's how people become rich. Learn the fundamentals of making your money grow through the power of compounding.",
    difficulty: "Hard",
    points: 200,
    icon: "trending-up",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "trending-up",
          title: "The 8th Wonder: Compound Interest",
          text: "Compounding is the process where your money earns returns, and then those returns also earn returns. It starts slow but accelerates dramatically over time.\n\n₹1,00,000 invested at 12% annual return:\nYear 1: ₹1,12,000 (₹12,000 earned)\nYear 5: ₹1,76,234 (₹76,234 earned)\nYear 10: ₹3,10,585 (₹2,10,585 earned)\nYear 20: ₹9,64,629 (₹8,64,629 earned)\nYear 30: ₹29,95,992 (₹28,95,992 earned)\n\nNotice: the first 10 years added ₹2.1 lakhs. The NEXT 10 years added ₹6.5 lakhs. The FINAL 10 years added ₹20 lakhs. This exponential acceleration is why time in the market matters more than timing the market.",
          keyTakeaway: "Compounding is exponential, not linear. The longer you invest, the faster the growth. Starting 5 years earlier can double your final corpus.",
          example: "Arun starts investing ₹3,000/month at 25. Bala starts the same at 35. By 60, Arun has ₹3.5 crore. Bala has only ₹1 crore — same monthly investment, same returns. Arun's 10-year head start made a ₹2.5 crore difference."
        },
        {
          icon: "calculator",
          title: "The Investment Risk Ladder",
          text: "All investments involve a tradeoff between RISK and RETURN. Higher potential returns always come with higher risk.\n\nRISK LADDER (lowest to highest risk and return):\n\n🔵 SAVINGS ACCOUNTS: 3-4% return. Zero risk. Government insured up to ₹5 lakh. But doesn't beat inflation.\n\n🟢 FIXED DEPOSITS: 5.5-7.5%. Very low risk. Guaranteed return. Good for 1-5 year goals.\n\n🟡 DEBT MUTUAL FUNDS: 6-8%. Low risk. Invests in bonds and government securities.\n\n🟠 BALANCED/HYBRID FUNDS: 9-11%. Medium risk. Mix of equity and debt.\n\n🔴 EQUITY MUTUAL FUNDS: 10-15% long-term average. High short-term volatility. Best for 7+ year goals.\n\n🔴🔴 DIRECT STOCKS: 15%+ potential. Highest risk. Requires research and expertise.",
          keyTakeaway: "Match your investment type to your time horizon. Short-term goals (1-3 years) → low risk. Long-term goals (7+ years) → equity is appropriate.",
          example: "For a vacation in 1 year, use an FD (safe, guaranteed). For retirement in 25 years, use equity funds (short-term drops don't matter — the long-term trend is upward)."
        },
        {
          icon: "shield",
          title: "SIP — The Most Accessible Path to Wealth",
          text: "A Systematic Investment Plan (SIP) is the simplest, most powerful investment method for beginners. You invest a fixed amount in a mutual fund every month automatically — as little as ₹100/month with some funds.\n\nWhy SIPs work so well:\n\nRUPEE COST AVERAGING: When markets fall, your fixed ₹5,000 buys MORE units. When markets rise, it buys fewer units. Over time, your average cost is lower than the average price — you always buy more when things are cheap.\n\nDISCIPLINE: Automatic monthly debit means you don't need willpower to invest. The system does it for you.\n\nCOMPOUNDING: Monthly returns compound on each other continuously.\n\nAFFORDABILITY: ₹500-₹1,000/month is accessible to almost everyone.",
          keyTakeaway: "A SIP of ₹1,000/month from age 25 to 55 (30 years) at 12% return grows to ₹35 lakhs — from just ₹3.6 lakhs invested total.",
          example: "Pooja started a ₹2,000/month SIP at 28. It got auto-debited and she barely thought about it. At 55, after 27 years and ₹6.48 lakh invested, her corpus was ₹67 lakh — a 10x growth from her contributions."
        },
        {
          icon: "home",
          title: "PPF, NPS, and Tax-Saving Investments",
          text: "India offers several investment options that also save you significant tax under Section 80C:\n\nPPF (Public Provident Fund):\n• Government-backed, completely safe\n• Returns: ~7.1% per annum (revised quarterly)\n• Tax benefits: Investment, interest, and maturity are all tax-free (EEE status)\n• Lock-in: 15 years (partial withdrawal from year 7)\n• Limit: ₹1.5 lakh per year\n• Best for: Long-term wealth with zero risk\n\nNPS (National Pension System):\n• Pension-focused retirement account\n• Market-linked returns (historically 9-11%)\n• Additional ₹50,000 tax benefit under 80CCD(1B)\n• Partial lock-in until retirement\n\nELSS (Equity-Linked Saving Scheme):\n• Equity mutual fund with 3-year lock-in\n• Historical returns: 12-15%\n• Tax benefit under 80C (up to ₹1.5 lakh)\n• Shortest lock-in among tax-saving options",
          keyTakeaway: "PPF is the safest long-term tax-free option. ELSS offers highest returns with shortest lock-in. NPS is best specifically for retirement.",
          example: "On ₹8 lakh taxable income, investing ₹1.5 lakh in ELSS saves ₹45,000 in tax (30% bracket) immediately. Over 15 years, that ₹1.5 lakh at 13% return becomes ₹8.5 lakh — you saved tax AND built wealth."
        },
        {
          icon: "star",
          title: "The Rule of 72 and Building Your Investment Strategy",
          text: "THE RULE OF 72:\nTo estimate how fast your money doubles, divide 72 by the annual return rate.\n• At 6% (FD): 72÷6 = 12 years to double\n• At 9% (hybrid funds): 72÷9 = 8 years to double\n• At 12% (equity funds): 72÷12 = 6 years to double\n• At 36% (credit card debt you owe): your debt doubles in 2 years!\n\nBUILDING YOUR STRATEGY:\n1. Emergency fund first (3-6 months of expenses)\n2. High-interest debt gone (credit cards, personal loans)\n3. Tax-saving investments (PPF, ELSS under 80C)\n4. Equity SIP for long-term goals\n5. Additional goals: property, travel, education\n\nStart with just Step 1 and 2. Once done, step 3 is life-changing.",
          keyTakeaway: "Use the Rule of 72 to evaluate any investment instantly. And always clear high-interest debt before investing — debt at 36% is worse than any investment return.",
          example: "Investing ₹50,000 at 12% doubles in 6 years (₹1 lakh), doubles again to ₹2 lakh in 12 years, and ₹4 lakh by year 18, and ₹8 lakh by year 24 — from a one-time ₹50,000 with no further input!"
        }
      ],
      quizzes: [
        {
          question: "You invest ₹1,00,000 at 12% annual return. Using the Rule of 72, approximately how many years to double your money?",
          options: ["12 years", "6 years", "8 years", "10 years"],
          answer: 1
        },
        {
          question: "What makes SIP investing particularly effective for beginners?",
          options: ["It guarantees positive returns every month", "It requires expert knowledge of stock markets", "Automatic monthly investing creates discipline and rupee cost averaging reduces purchase price over time", "It only works for large investment amounts above ₹10,000"],
          answer: 2
        },
        {
          question: "You have ₹20,000 extra this month. You have credit card debt at 36% interest AND you want to start an equity SIP at expected 12% return. What should you do?",
          options: ["Split equally — ₹10,000 to debt, ₹10,000 to SIP", "Start the SIP — investments are more important", "Pay off the credit card debt first — clearing 36% debt is a guaranteed 36% return", "Save it in a savings account"],
          answer: 2
        },
        {
          question: "Investing in equity mutual funds is MOST suitable for which type of goal?",
          options: ["A vacation planned for next year", "Emergency fund you might need anytime", "Retirement savings you won't need for 20 years", "Down payment for a house you're buying in 18 months"],
          answer: 2
        },
        {
          question: "What is the main advantage of a PPF account over a bank FD?",
          options: ["PPF gives higher guaranteed returns every year", "PPF interest and maturity amount are completely tax-free, and contributions qualify for 80C deduction", "PPF allows withdrawal anytime without penalty", "PPF is invested in the stock market for better growth"],
          answer: 1
        }
      ]
    })
  }
];

export async function seedLiteracyCourses() {
  if (!db) { console.log("Database not connected. Skipping seeding."); return; }
  console.log("🌱 Seeding financial literacy courses...");
  for (const course of LITERACY_COURSES) {
    const existing = await db.select().from(quests).where(eq(quests.title, course.title));
    if (existing.length === 0) {
      await db.insert(quests).values(course);
      console.log(`✅ Created: "${course.title}" (${course.points} XP)`);
    } else {
      await db.update(quests).set({ content: course.content, points: course.points, description: course.description, difficulty: course.difficulty }).where(eq(quests.title, course.title));
      console.log(`🔄 Updated: "${course.title}" (${course.points} XP)`);
    }
  }
  console.log(`✨ Done! ${LITERACY_COURSES.length} courses seeded.`);
}

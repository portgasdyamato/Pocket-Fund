import { db } from "./db";
import { quests } from "@shared/schema";

const LITERACY_COURSES = [
  {
    title: "The Zero-to-One of Money",
    description: "Learn why money exists, how it flows through the modern world, and the psychological traps that keep people broke. A comprehensive guide for the absolute beginner.",
    difficulty: "Easy",
    points: 100,
    icon: "star",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "star",
          title: "Money: The Great Human Invention",
          text: "Money is the most successful shared fiction ever created. At its core, a ₹500 note has zero intrinsic value—it's just a piece of high-quality paper. It only works because of a universal, unspoken agreement: you trust that if you hand this paper to a shopkeeper, they will give you bread. And the shopkeeper trusts that they can hand that same paper to someone else for fuel.\n\nBefore money, we had the 'Barter System.' If you had surplus wheat and wanted a cow, you had to find a cattle owner who specifically wanted wheat right at that moment. This 'coincidence of wants' made trade incredibly slow and difficult. Money acts as the 'Universal Lubricant' of society. It allows us to store our labor (time) in a portable, divisible, and durable form.\n\nIn the modern digital age, money has evolved further. More than 90% of the world's money exists only as data on servers. When you check your bank balance, you're looking at digits that represent your claim on society's resources. Understanding this abstraction is the first step to mastering finance: money isn't just 'stuff,' it's a tool for measuring and moving value.",
          keyTakeaway: "Money is a tool for storing and transferring value. Its power comes from trust, not the physical material it's printed on.",
          example: "Imagine being on a deserted island with ₹1 crore in cash. It's useless. But in a city, that same paper can buy a house. Value is social, situational, and based on collective agreement."
        },
        {
          icon: "trending-up",
          title: "The Flow of Value: How You Get Paid",
          text: "If money is a measurement of value, how do you get more of it? The answer is simple but often misunderstood: You get paid in direct proportion to the difficulty of the problem you solve for others. This is the 'Value Equation.'\n\nA heart surgeon is paid more than a general physician because the problem they solve is rarer and higher-stakes. A software engineer at a global firm is paid more than a local freelancer because their work impacts millions of users simultaneously. Scale and Rareness are the two main drivers of high income.\n\nMany people fall into the trap of thinking they are paid for their 'time' or 'effort.' While those are inputs, they are not what the market pays for. If you spend 20 hours digging a hole and filling it back up, you've put in immense effort, but created zero value. To increase your income, you must stop focusing on 'working harder' and start focusing on 'becoming more valuable.' This means specialized skills, better decision-making, or managing others to create results at scale.",
          keyTakeaway: "The market pays for results and value, not effort. To earn more, increase the rareness or scale of the problems you solve.",
          example: "A baker who makes 10 loaves of bread a day has a capped income. A baker who creates a franchise model that sells 10,000 loaves across 50 cities has used 'leverage' (systems and employees) to create massive value."
        },
        {
          icon: "brain",
          title: "Psychology of Money: Why We Spend",
          text: "Most financial mistakes aren't caused by a lack of math skills; they are caused by a lack of emotional control. We are biological creatures designed for survival in the wild, not for managing digital assets in a 24/7 consumerist society. Our brains are wired for 'Instant Gratification.'\n\nWhen we see a 'SALE' sign or a flashy new gadget, our brain releases dopamine—the pleasure chemical. This makes us feel good *during* the act of buying, but that feeling fades almost instantly after the purchase. This is called the 'Hedonic Treadmill.' We buy things to feel a momentary spike in happiness, then return to our baseline level of satisfaction and feel the urge to buy again.\n\nModern marketing is designed to exploit these biological weaknesses. They sell you a 'lifestyle' or 'status' rather than a product. When you buy a luxury car on a loan You can't afford, you aren't buying transportation—you're buying the *perception* of success. True wealth is the things you *don't* see: the investments, the savings, and the freedom to walk away from a job you hate. Spending money to show people how much money you have is the fastest way to have less money.",
          keyTakeaway: "Spending for status is a trap. True wealth is invisible. Discipline is the art of choosing what you want *most* over what you want *now*.",
          example: "The 'Millionaire Next Door' study found that most actual millionaires drive second-hand cars and live in mid-range neighborhoods. They prioritized building assets over displaying status."
        },
        {
          icon: "zap",
          title: "Inflation: The Invisible Thief",
          text: "Imagine you have ₹10,000 in your cupboard. You leave it there for 20 years. When you take it out, it's still ₹10,000. But the world has changed. What used to cost ₹1,000 now costs ₹3,000. Your money hasn't moved, but it has 'shrunk' in power. This is Inflation.\n\nInflation is the silent, ongoing rise in the prices of goods and services. In India, historical inflation averages around 6% per year. This means that every single year, your cash loses 6% of its purchasing power. If your bank account only gives you 3% interest, you are actually *losing* 3% of your wealth's value every year. You are becoming poorer while 'saving.'\n\nThis is why keeping too much cash is dangerous. To truly protect your wealth, you must invest in assets that grow faster than inflation—like equity, real estate, or gold. Inflation is a tax on those who hold cash and a gift to those who own productive assets. If you don't grow your money, the economy will slowly eat it away.",
          keyTakeaway: "Cash is a depreciating asset over long periods. You must invest to outpace inflation and protect your purchasing power.",
          example: "In the 1970s, you could buy a decent house in a major Indian city for ₹1-2 lakhs. Today, that same amount might not even cover a year's rent in the same area. That's the power of inflation over decades."
        },
        {
          icon: "target",
          title: "The Power of Compounding",
          text: "Albert Einstein reportedly called Compound Interest the '8th Wonder of the World.' It is the most powerful force in finance, yet the human brain struggles to understand it because it is exponential, not linear. We are used to things growing $1+1=2$, but compounding is $2x2=4, 4x4=16$.\n\nWhen you invest money, it earns a return. Next year, you earn a return on your original investment AND the return you earned last year. At first, the difference is tiny—it looks like a flat line. But after 10, 20, or 30 years, the line shoots up vertically. This is why the billionaire Warren Buffett earned 99% of his wealth after his 50th birthday.\n\nThe most important ingredient in compounding isn't the amount of money or even the interest rate—it's **TIME**. A person who starts investing ₹2,000 at age 20 will end up with far more than someone who starts investing ₹10,000 at age 40. Start early, even with tiny amounts, and let time do the heavy lifting for you.",
          keyTakeaway: "Time is your greatest asset. High returns are good, but a head start is better. The best time to start was 10 years ago; the second best time is today.",
          example: "If you save ₹1,00,000 once and get a 15% return, in 30 years it becomes ₹66 Lakhs. If you wait just 5 years to start, it only becomes ₹32 Lakhs. That 5-year delay cost you ₹34 Lakhs!"
        }
      ],
      quizzes: [
        {
          question: "Why does the market pay a heart surgeon more than a grocery clerk?",
          options: ["Because surgeons work longer hours", "Because the problem a surgeon solves is rarer and requires more specialized value", "Because surgeons are smarter on average", "There is no economic reason; it's just luck"],
          answer: 1
        },
        {
          question: "What is the 'Hedonic Treadmill'?",
          options: ["A piece of gym equipment that generates electricity", "The psychological tendency to return to a baseline level of happiness after a purchase", "A method for tracking stock market cycles", "The process of inflation eating away at savings"],
          answer: 1
        },
        {
          question: "If inflation is 7% and your savings account gives 4% interest, what is your 'real' return?",
          options: ["+11%", "+3%", "-3%", "0%"],
          answer: 2
        },
        {
          question: "Which of these is the MOST important factor in the success of compounding?",
          options: ["The amount of money you start with", "Choosing the highest risk stocks", "The amount of time the money stays invested", "Watching the news every day"],
          answer: 2
        },
        {
          question: "How much of the world's money exists only as digital data on servers?",
          options: ["Less than 10%", "About 50%", "Over 90%", "Exactly 100%"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Mastering the 50/30/20 Rule",
    description: "The most famous budgeting framework in the world, explained deeply. Learn how to allocate every rupee for maximum freedom and minimum stress.",
    difficulty: "Medium",
    points: 150,
    icon: "calculator",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "calculator",
          title: "The Philosophy of Proportion",
          text: "Most people fail at budgeting because they try to track every single paisa. This leads to burnout and eventual abandonment. The 50/30/20 rule, popularized by Senator Elizabeth Warren, takes a different approach. It focuses on *proportions* rather than specific categories.\n\nBudgeting isn't about saying 'NO' to everything you love; it's about saying 'YES' to the things that matter most. By setting clear boundaries for your spending, you actually gain MORE freedom because you don't have to feel guilty when you spend within your limits. A budget is a permission slip to spend on the things you value.\n\nThe rule divides your after-tax income into three distinct buckets: Needs (50%), Wants (30%), and Savings/Debt (20%). This balance ensures you survive today, enjoy today, and secure tomorrow.",
          keyTakeaway: "Budgeting is about intentionality, not deprivation. Proportions help you maintain balance without the stress of micro-tracking.",
          example: "Instead of worrying if you spent ₹200 too much on coffee, you just look at your total 'Wants' bucket for the month. If there's money in the bucket, you can spend it guilt-free."
        },
        {
          icon: "home",
          title: "The 50%: Non-Negotiable Needs",
          text: "Fifty percent of your take-home pay should go to your 'Needs.' These are the expenses you *must* pay to maintain your health, safety, and ability to work. In an Indian context, this typically includes:\n\n• Rent or Home Loan EMI\n• Groceries and basic household supplies\n• Utilities (Electricity, Water, LPG)\n• Essential Transport (Petrol, Metro, Bus)\n• Minimum loan repayments (Credit card minimums, Personal loans)\n• Basic healthcare and insurance premiums\n\nThe trap: Many people confuse 'Needs' with 'Upgraded Needs.' For example, a house is a need, but a 3BHK when you only need a 1BHK is a want. Transport is a need, but a luxury car EMI is a want. If your needs exceed 50%, you are likely 'house poor' or 'car poor' and need to either increase your income or drastically downsize your lifestyle to find breathing room.",
          keyTakeaway: "Needs should be strictly essential. If they cross 50%, your financial foundation is unstable.",
          example: "If you earn ₹50,000 but your rent is ₹25,000, you have already spent your entire 50% on just one item. You have zero room left for food, bills, or transport within this bucket."
        },
        {
          icon: "shopping-bag",
          title: "The 30%: Guilt-Free Wants",
          text: "This is the most misunderstood part of the rule. Thirty percent of your income is allocated to 'Wants.' These are the things that make life worth living—the experiences, the style, and the fun. Examples include:\n\n• Dining out and Zomato/Swiggy orders\n• Subscriptions (Netflix, Prime, Gym)\n• Travel and weekend getaways\n• Hobbies and entertainment\n• Upgraded gadgets and fashion\n\nMany 'financial gurus' tell you to cut out your morning tea or coffee to get rich. This is bad advice. Cutting out a ₹20 tea won't make you a millionaire, but it will make you miserable. Instead, the 50/30/20 rule says: keep the tea, but make sure the *total* of all such joys doesn't exceed 30% of your income. When money is tight, the 'Wants' bucket is the first place to look for cuts. It acts as a shock absorber for your finances.",
          keyTakeaway: "Wants are essential for a happy life, but they must be capped. Use this bucket as a flexible variable to protect your savings.",
          example: "If you want to buy a new ₹30,000 phone, you don't 'find' the money—it must come out of your 30% bucket. You might have to skip dining out for three months to afford it. That's conscious trade-off."
        },
        {
          icon: "shield",
          title: "The 20%: Paying Your Future Self",
          text: "The final 20% is the most important for building long-term wealth. This money is gone before you even see it. It goes toward:\n\n• Building an Emergency Fund (3-6 months of expenses)\n• Extra debt repayments (Aggressively paying off the principal)\n• Retirement investments (EPF, NPS, PPF)\n• Long-term wealth building (Mutual Funds, Stocks)\n\nMost people save 'what is left' at the end of the month. The problem is, there is *never* anything left. Parkinson’s Law states that expenses rise to meet income. If you have ₹10,000 in your account, you will find a 'need' for ₹10,000. To fix this, you must **Pay Yourself First**. As soon as your salary hits, move that 20% to a separate account or investment. You must learn to live on the remaining 80%. If you can't save 20%, start with 5% and increase it by 1% every month. The habit of saving is more important than the amount.",
          keyTakeaway: "Savings are a mandatory bill you owe your future self. Automate this 20% to ensure it happens every single month.",
          example: "Wealth isn't what you earn; it's what you *keep*. A person earning ₹1 lakh and saving ₹0 is poorer than someone earning ₹30,000 and saving ₹6,000."
        },
        {
          icon: "target",
          title: "Adapting the Rule to India",
          text: "The 50/30/20 rule is a guide, not a law. In Indian cities, rent can be extremely high, or you might have large family responsibilities. You might need to adjust it to 60/20/20 or even 70/10/20 during tough times.\n\nHowever, the goal should always be to trend toward the 20% savings rate. As your income grows, you should aim for 'Reverse Lifestyle Creep.' Instead of spending more when you get a raise, keep your lifestyle the same and move the extra money into the 20% (and eventually 30% or 40%) savings bucket.\n\nFinancial freedom isn't about having a high salary; it's about having a large gap between what you earn and what you spend. That gap is where your freedom lives. Start today by looking at your last 3 months of bank statements and categorizing your spending into these three buckets. You might be surprised at what you find.",
          keyTakeaway: "The rule is flexible but the 20% savings target is the gold standard. Focus on growing the gap between income and expenses.",
          example: "If you get a ₹10,000 raise, don't move to a bigger house. Keep your rent the same, and now your savings rate has effectively jumped by a huge margin."
        }
      ],
      quizzes: [
        {
          question: "Which of these is considered a 'Need' in the 50/30/20 framework?",
          options: ["A premium Netflix subscription", "Minimum electricity bill for your home", "A weekend trip to Goa", "The latest iPhone 15 Pro"],
          answer: 1
        },
        {
          question: "What is the primary benefit of the 'Pay Yourself First' strategy?",
          options: ["It makes you feel rich immediately", "It ensures savings happen before you have the chance to spend the money", "It allows you to skip paying your other bills", "It increases your credit card limit"],
          answer: 1
        },
        {
          question: "According to the rule, what percentage should go towards 'Wants'?",
          options: ["50%", "20%", "30%", "10%"],
          answer: 2
        },
        {
          question: "Your monthly take-home is ₹60,000. How much should you ideally be saving/investing?",
          options: ["₹6,000", "₹12,000", "₹18,000", "₹30,000"],
          answer: 1
        },
        {
          question: "What should you do if your 'Needs' currently take up 70% of your income?",
          options: ["Ignore the 50/30/20 rule; it's not for you", "Stop saving entirely until your income doubles", "Look for ways to downsize big fixed costs like rent or debt, and aim to reduce needs to 50% over time", "Spend more on 'Wants' to feel better"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "The Emergency Fund Blueprint",
    description: "Learn how to build a bulletproof financial safety net that allows you to sleep peacefully at night, regardless of what happens in the economy.",
    difficulty: "Medium",
    points: 150,
    icon: "shield",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "shield",
          title: "The 'Sleep Well At Night' Fund",
          text: "An emergency fund is not an investment; it is an insurance policy for your life. Its purpose isn't to make you money—it's to prevent you from losing everything when life goes wrong. Most people live just 1-2 paychecks away from bankruptcy. If they lose their job or face a medical crisis, they are forced to take high-interest loans, sell their gold, or beg from relatives.\n\nAn emergency fund breaks this cycle. It is a chunk of cash sitting in a safe place, ready to be used for *only* genuine emergencies. It gives you 'unfuckwithable' confidence. When you have 6 months of cash in the bank, your boss can't bully you, a market crash doesn't scare you, and a broken car is just a minor inconvenience instead of a tragedy.\n\nThis is the very first step of all financial planning. Do not buy stocks, do not buy crypto, and do not buy a house until this fund is started.",
          keyTakeaway: "An emergency fund is your financial foundation. It buys you peace of mind and time to think during a crisis.",
          example: "In 2020, people with emergency funds could stay calm and plan their next move. Those without were forced into panic decisions and debt within weeks of the lockdown."
        },
        {
          icon: "calculator",
          title: "How Much is Enough? Scaling Your Fund",
          text: "The standard advice is '3 to 6 months of expenses.' But this varies based on your 'Fragility.'\n\n**3 Months is for:**\n• Single people with low expenses\n• Government employees with high job security\n• People with multiple sources of income\n\n**6-12 Months is for:**\n• People with children or aging parents (dependents)\n• Freelancers and business owners with variable income\n• People in volatile industries (like Startups or Aviation)\n\nTo calculate your number, add up your absolute essentials: Rent + Food + Bills + Minimum Debt + Essential Travel. Multiply that by your target months. This is your 'Freedom Number.' Don't use your *income* for this calculation, use your *expenses*. If you lose your job, you won't be spending on movies; you'll be spending on survival.",
          keyTakeaway: "Calculate based on essential expenses, not income. Aim for 3 months if secure, 6-12 months if you have dependents or variable pay.",
          example: "If your basic survival costs ₹25,000/month, your 6-month fund target is ₹1.5 Lakhs. This is your wall of protection."
        },
        {
          icon: "lock",
          title: "Where to Park Your Safety Net",
          text: "Your emergency fund has two non-negotiable rules: it must be **Safe** and it must be **Liquid**.\n\n**SAFE** means the value must not fluctuate. You cannot keep your emergency fund in the stock market. Imagine the market crashes by 40%—and that same week, your company announces layoffs. Your ₹5 Lakh fund is now ₹3 Lakh precisely when you need it most. That is a failure of planning.\n\n**LIQUID** means you can get the money out in hours, not weeks. A real estate investment is not an emergency fund because it takes months to sell a flat.\n\n**The Ideal Strategy:**\n1. Keep ₹20,000 as cash/regular bank account (Instant access)\n2. Keep the rest in a 'Sweep-in' FD or a separate Savings Account with a different bank (Accessible in 24 hours, earns decent interest, but isn't visible in your daily spending app). This separation prevents you from accidentally spending it on a 'sale.'",
          keyTakeaway: "Safety and Liquidity are more important than returns for this specific fund. Use separate accounts to avoid temptation.",
          example: "A 'Sweep-in' FD is perfect. It earns higher interest like an FD, but if you swipe your card for an emergency, the bank automatically breaks the FD and pays the bill."
        },
        {
          icon: "target",
          title: "The Hierarchy of Debt and Savings",
          text: "Should you save for an emergency when you have debt? The answer depends on the interest rate. \n\nIf you have Credit Card debt (36-42% interest), that is its own emergency. It is a 'financial hair-on-fire' situation. However, you should still build a **Starter Emergency Fund** of ₹25,000 to ₹50,000 *before* tackling the debt. Why? Because if your car breaks down while you're paying off debt, you'll just put the repair cost back on the credit card and feel defeated.\n\nOnce you have a small starter fund, stop all saving and throw every rupee at the high-interest debt. Once the credit cards are cleared, go back and finish the full 6-month fund. \n\n**The Golden Sequence:**\n1. Starter Fund (₹25,000)\n2. Pay off High-Interest Debt (>12%)\n3. Full Emergency Fund (6 months)\n4. Long-term Investing",
          keyTakeaway: "Build a small starter fund first to break the cycle of debt. Then kill high-interest debt, then finish the full fund.",
          example: "Think of the starter fund as a shield. It stops you from getting *more* debt while you're trying to kill the *old* debt."
        },
        {
          icon: "zap",
          title: "Common Traps and Rules of Use",
          text: "The hardest part of an emergency fund is defining what counts as an 'emergency.' Humans are very good at lying to themselves. \n\n**What Is an Emergency:**\n• Medical crisis (Hospitalization)\n• Job loss / Business failure\n• Essential repairs (Leaking roof, broken fridge)\n• Urgent family travel (Death/Illness)\n\n**What Is NOT an Emergency:**\n• A 'Limited Time Offer' on sneakers\n• A friend's destination wedding you 'have' to attend\n• Your favorite band coming to town\n• Improving your home's aesthetic\n\n**The replenishment rule:** If you use even one rupee from your fund, your *only* financial goal becomes refilling it. No investing, no fancy dinners, no shopping until the fund is back to 100%. Treat it like a holy vault that must never be empty.",
          keyTakeaway: "Be ruthlessly honest about what an emergency is. Refill the fund immediately after use.",
          example: "Create a 'Decision Tree' in your head: 'Will something terrible happen in 48 hours if I don't pay this?' If no, it's not an emergency."
        }
      ],
      quizzes: [
        {
          question: "Why shouldn't you keep your emergency fund in the stock market?",
          options: ["The stock market is a scam", "The value might drop exactly when you need the money for an emergency", "It's too easy to withdraw money from stocks", "Stock returns are too high"],
          answer: 1
        },
        {
          question: "What is the 'Golden Sequence' for financial stability?",
          options: ["Invest → Spend → Pay Debt", "Starter Fund → Kill High-Interest Debt → Full Fund → Invest", "Buy House → Get Credit Card → Save", "Spend → Borrow → Repay"],
          answer: 1
        },
        {
          question: "You have ₹50,000 in credit card debt and ₹0 in savings. What is your first step?",
          options: ["Pay back the ₹50,000 immediately", "Invest in a high-growth startup", "Build a ₹25,000 starter emergency fund", "Go on a vacation to de-stress"],
          answer: 2
        },
        {
          question: "How should you calculate your Emergency Fund target amount?",
          options: ["Target = 12 months of your gross income", "Target = 3-6 months of your essential monthly expenses", "Target = The amount of your credit card limit", "Target = Fixed ₹10 Lakhs for everyone"],
          answer: 1
        },
        {
          question: "A friend invites you to a wedding in Thailand. It will cost ₹60,000. Your emergency fund has ₹2 Lakhs. Should you use it?",
          options: ["Yes, memories are more important than money", "No, a wedding is a planned event/desire, not an unexpected crisis", "Yes, but only if you take a loan for the rest", "Only if you're the best man/maid of honor"],
          answer: 1
        }
      ]
    })
  }
];

export async function seedLiteracyCourses() {
  const { db } = await import("./db");
  const { quests } = await import("@shared/schema");
  if (!db) { console.log("Database not connected. Skipping seeding."); return; }
  console.log("🌱 Seeding mega-detailed financial literacy courses...");

  const { eq } = await import("drizzle-orm");
  
  // Wipe ALL literacy quests before re-seeding to ensure fresh content and correct quiz counts
  await db.delete(quests).where(eq(quests.category, "literacy"));
  console.log("🗑️  Nuked all stale literacy courses from orbit.");

  for (const course of LITERACY_COURSES) {
    await db.insert(quests).values(course);
    console.log(`✅ Deployed Mega-Course: "${course.title}" (${course.points} XP)`);
  }
  console.log(`✨ Done! ${LITERACY_COURSES.length} high-fidelity courses deployed.`);
}

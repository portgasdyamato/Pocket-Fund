import { db } from "./db";
import { quests } from "@shared/schema";

const LITERACY_COURSES = [
  {
    title: "The Zero-to-One of Money",
    description: "Learn why money exists, how it flows, and the psychological traps that keep people broke. The absolute first step for any beginner.",
    difficulty: "Easy",
    points: 100,
    icon: "star",
    category: "literacy",
    content: JSON.stringify({
      duration: 10,
      slides: [
        {
          icon: "star",
          title: "Money: The Great Human Invention",
          text: "Money is the most successful shared fiction ever created by the human race. At its absolute core, a ₹500 note has zero intrinsic value—it is just a piece of high-quality paper with security threads. It only works because of a universal, unspoken agreement among billions of people: you trust that if you hand this paper to a shopkeeper, they will give you bread. And the shopkeeper trusts that they can hand that same paper to someone else for fuel.\n\nBefore money, humanity used the 'Barter System.' If you were a wheat farmer and needed a cow, you had to find a cattle owner who specifically wanted wheat right at that moment. This is known as the 'double coincidence of wants.' Barter was incredibly inefficient and impossible to scale for a growing civilization. Money solved this by becoming a universal medium of exchange. It allowed us to decouple the acquisition of what we want from the production of what we specialize in.\n\nThink of money as a 'Social Ledger.' When you work at your job today, you are giving your time and energy to society. Society, in return, gives you a 'Certificate of Appreciation' in the form of currency. This certificate (money) is essentially stored time. In the modern digital age, money has evolved further. More than 90% of the world's money exists only as bits and bytes on banking servers. When you check your bank balance on your phone, you're looking at digits that represent your claim on a portion of the world's resources. Mastery of finance begins here: understanding that money is an abstract tool for measuring, storing, and moving human energy across time and space.",
          keyTakeaway: "Money is a social agreement that stores your time and energy. Its value comes from trust.",
          example: "If you were stranded on a deserted island with ₹100 crore in cash, you would be 'poor' because there is no social agreement to recognize that value."
        },
        {
          icon: "trending-up",
          title: "The Value Equation: Why Some Earn Millions",
          text: "If money is a measurement of value, how do you actually get more of it? The answer is simple: You are paid in direct proportion to the difficulty of the problem you solve for other people. Most legacy education systems teach us to trade 'time' for money, leading to a linear growth trap. Consider the difference between a general physician and a heart surgeon. Both might work the same hours, but the surgeon is paid exponentially more. Why? Because the problem they solve is rarer, training is more intense, and stakes are higher.\n\nTo escape the trap of low income, you must stop focusing on 'effort' and start focusing on 'scarcity' and 'scale.' Effort is a commodity; everyone can work hard. But not everyone can manage a team of 50 people, or design a bridge, or write code that secures billions. Your income is not a reward for your sweat; it is a reflection of how difficult you are to replace. If anyone can do your job with one week of training, you will always be paid the minimum. To earn more, you must acquire 'Specific Knowledge'—skills that feel like play to you but look like work to others.",
          keyTakeaway: "The market doesn't pay for effort; it pays for the scale and scarcity of the value you contribute.",
          example: "A delivery driver works incredibly hard but is easily replaced. A Logistics Network Architect who designs the system used by 10,000 drivers is solving a much harder, rarer problem at scale."
        },
        {
          icon: "brain",
          title: "The Psychology of Want: The Dopamine Trap",
          text: "Most financial failures are caused by a lack of emotional self-regulation. We are wired for 'Instant Gratification,' which leads to financial ruin in a consumerist society. When you see a flashy new smartphone, your brain releases dopamine—the neurotransmitter associated with pleasure. Crucially, dopamine is released during the *anticipation* of the purchase, not the long-term ownership. This is why excitement fades into 'Buyer's Remorse' just a few days later.\n\nModern advertising is a multi-billion dollar machine designed to exploit these biological triggers. They don't sell you a watch; they sell you the feeling of being a successful, respected person. When you buy luxury items on a loan you can't afford, you aren't buying a product—you're buying the *perception* of status. True financial freedom is the things you *don't* see: the emergency fund that lets you quit a toxic job, the investments that provide for your family, and the time you own for yourself. Discipline is the ability to ignore the short-term dopamine of spending in favor of the long-term freedom of owning.",
          keyTakeaway: "Spend to maintain your life, not your ego. Discipline is choosing what you want *most* over what you want *now*.",
          example: "A person with a ₹12 lakh car loan who earns ₹50,000/month is 'status rich' but 'freedom poor'."
        },
        {
          icon: "zap",
          title: "Inflation: The Silent, Ongoing Robbery",
          text: "Inflation is the single greatest threat to your long-term financial health. Imagine you have ₹10,000 in a safe today. You leave it there for 20 years. In 2046, it is still ₹10,000, but the milk that cost ₹50 today now costs ₹150. Your ₹10,000 is still physically there, but its 'Economic Weight' has been crushed. In India, historical inflation is roughly 6-7% per year, meaning the 'purchasing power' of your cash drops by half every decade.\n\nIf your bank savings account only gives you 3% interest, you are actually *becoming poorer* every single day. This is a negative real return. Inflation is essentially a hidden tax on everyone who holds cash and a hidden gift to everyone who owns productive assets. To survive, you must stop 'saving' and start 'investing.' You need your money to grow at a rate *higher* than inflation. Productive assets—like shares in profitable companies, land, or gold—tend to appreciate over time as the value of currency falls. Holding large amounts of cash for decades is a guaranteed way to lose your life's work to the invisible thief of inflation.",
          keyTakeaway: "Inflation is the decrease in what your money can buy. Keeping cash for long periods is a guaranteed loss.",
          example: "In 1990, a cinema ticket was ₹10. Today it's ₹300. That's a 30x increase. If your grandfather saved ₹1000 in 1990, it bought 100 tickets. Today, it buys 3."
        },
        {
          icon: "target",
          title: "The Magic of Compounding and Time",
          text: "Einstein described Compound Interest as the '8th Wonder of the World' because it allows a person with a small regular income to become a multi-millionaire, provided they have one thing: TIME. Compounding is the process where your investment earns a return, and in the next period, that return *also* earns a return. It is an exponential explosion that humans struggle to visualize because we think linearly.\n\nIf you invest ₹1 lakh at a 15% return, in the first year you earn ₹15,000. By Year 20, it is ₹16 lakh. By Year 30, it is ₹66 lakh! The secret isn't the ₹1 lakh; it's the 30 years. The 'Heavy Lifting' happens at the very end of the curve. This is why Warren Buffett earned over 99% of his fortune after his 50th birthday. Time is your greatest asset, far more important than the amount of money you start with. A 20-year-old who invests just ₹1,00,000 per month will likely end up with much more wealth than a 40-year-old who starts investing ₹10,00,000 per month. You cannot buy more time, but you can start using it today.",
          keyTakeaway: "Compounding turns small, consistent habits into massive late-stage wealth. Focus on time in the market, not timing the market.",
          example: "Person A invests from age 25 to 35 and stops. Person B invests from 35 to 65. Person A often ends up with more because their money had a 10-year head start to compound."
        }
      ],
      quizzes: [
        {
          question: "Money is a 'Social Ledger' because:",
          options: ["Government made it", "It records stored work society honors later", "It tracks success", "It's a physical asset"],
          answer: 1
        },
        {
          question: "How do you double income without more hours?",
          options: ["Work harder", "Increase Leverage/Scale", "Ask for raises", "Save more"],
          answer: 1
        },
        {
          question: "Why 'Buyer's Remorse'?",
          options: ["Broken product", "Dopamine fades after purchase", "Inflation", "Rude shopkeeper"],
          answer: 1
        },
        {
          question: "If interest is 4% but inflation is 6%:",
          options: ["Growing 4%", "Staying same", "Losing 2% power annually", "Growing 10%"],
          answer: 2
        },
        {
          question: "Most critical factor in compounding?",
          options: ["Starting amount", "Daily news", "Time allowed for growth", "Bank prestige"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Credit Score Architecture: The Hidden Filter",
    description: "Understand the math behind your credit score, how lenders see you, and how to build a profile that gives you access to the cheapest money on the market.",
    difficulty: "Easy",
    points: 120,
    icon: "shield",
    category: "literacy",
    content: JSON.stringify({
      duration: 10,
      slides: [
        {
          icon: "shield",
          title: "The Financial Resume: Why the Score Matters",
          text: "In the modern economy, your credit score is your 'Financial Resume.' It is the first filter used by banks, landlords, and even some employers to judge your reliability. In India, scores are mostly tracked by CIBIL (Credit Information Bureau (India) Limited), ranging from 300 to 900. A score of 750 or above is considered the 'Golden Gate'—it gives you the power to negotiate lower interest rates on home loans, get credit cards with massive rewards, and have loans approved in minutes.\n\nThink of the score as a measurement of 'Trust.' When a bank lends you money, they are taking a risk. The credit score is a mathematical prediction of the probability that you will pay them back. A low score implies a high probability of 'Default,' forcing the bank to charge you a higher interest rate to compensate for that risk. Over a 20-year home loan, the difference between an 8% interest rate and a 7.5% interest rate (common for high-score individuals) can save you over ₹15 lakhs in interest alone. Understanding this score is not just about debt; it is about the cost of your future. High credit isn't about owing money; it is about the *ability* to borrow cheaply when an opportunity arises.",
          keyTakeaway: "Your credit score is a measurement of trust. A higher score buys you lower interest rates, saving you lakhs over a lifetime.",
          example: "Person A has a 650 score and gets a car loan at 12%. Person B has a 800 score and gets it at 8%. Both buy the same ₹10 lakh car, but Person A pays ₹2 lakh more just for the privilege of borrowing."
        },
        {
          icon: "calculator",
          title: "The 5 Pillars: How the Math Works",
          text: "The CIBIL score is not a mystery; it is a formula based on five distinct pillars of your history. \n\n1. **Payment History (35%):** This is the most weighted factor. Even a single payment delayed by 30 days can tank your score for months. It shows if you respect deadlines. \n2. **Credit Utilization (30%):** How much of your available limit are you using? If you have a ₹1 lakh limit and use ₹90,000, you look 'Credit Hungry' and desperate, which drops your score. Aim to keep this below 30%. \n3. **Credit History Length (15%):** The older your oldest account, the better. This is why you should never close your very first credit card, even if you don't use it—it shows you have been reliable for a long time. \n4. **Credit Mix (10%):** Lenders like to see a balance between 'Secured' loans (Home/Gold) and 'Unsecured' loans (Credit Cards/Personal). \n5. **New Credit (10%):** Every time you apply for a loan, a 'Hard Inquiry' is made. Too many inquiries in 3 months tell the bank you are in a financial crisis and need money urgently.",
          keyTakeaway: "Payment history and utilization are the heavyweights. Pay on time and keep your credit card balances low.",
          example: "Spending ₹30,000 on a card with a ₹1,00,000 limit is healthy. Spending ₹30,000 on a card with a ₹35,000 limit looks dangerous to the algorithm."
        }
      ],
      quizzes: [
        {
          question: "What is the 'Golden Gate' credit score range in India?",
          options: ["300-500", "500-600", "750 and above", "Exactly 900"],
          answer: 2
        },
        {
          question: "Which factor has the BIGGEST impact on your credit score?",
          options: ["Your monthly income", "The number of banks you use", "Your payment history (timeliness)", "Your job title"],
          answer: 2
        },
        {
          question: "Why should you avoid using 90% of your credit card limit?",
          options: ["The bank will close your account", "It makes you look 'Credit Hungry' and risky to the algorithm", "It increases your income tax", "It's too much work to pay back"],
          answer: 1
        },
        {
          question: "How does a high credit score save you money?",
          options: ["It gives you free groceries", "It allows you to negotiate lower interest rates on major loans", "It doubles your bank balance", "It exempts you from GST"],
          answer: 1
        },
        {
          question: "Is it a good idea to close your oldest credit card?",
          options: ["Yes, to avoid annual fees", "No, because 'Credit History Length' is 15% of your score", "Yes, to open a newer one", "It doesn't matter"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "Mastering the 50/30/20 Rule",
    description: "The most robust budgeting framework for maximum freedom and minimum stress.",
    difficulty: "Medium",
    points: 200,
    icon: "calculator",
    category: "literacy",
    content: JSON.stringify({
      duration: 15,
      slides: [
        {
          icon: "calculator",
          title: "The Philosophy of Proportion",
          text: "Most people fail at budgeting because they think it's about restriction. They try to track every single rupee, which leads to exhaustion. The 50/30/20 rule takes a different approach: it's about **Structure**. It focuses on the high-level proportions of your income rather than the micro-details of spending.\n\nFinancial freedom isn't about saying 'NO' to every coffee; it's about saying 'YES' to the things that matter most while ensuring your future is secure. A budget is actually a 'Permission Slip' to spend money on things you value. By dividing your take-home pay into three distinct buckets—Needs, Wants, and Savings—you ensure that you can survive today, enjoy today, and build wealth for tomorrow. If you have money left in your 'Wants' bucket for the month, the expense is already accounted for.",
          keyTakeaway: "Budgeting is about intentionality, not deprivation. Use proportions to maintain balance.",
          example: "Think of your income as a pie. Instead of worrying about every crumb, just make sure the three main slices stay the right size."
        },
        {
          icon: "home",
          title: "The 50% Needs: Protecting Your Foundation",
          text: "The first slice is the 50% allocated to your 'Needs.' These are non-negotiable expenses you *must* pay to maintain health, safety, and your basic ability to earn. In India, this includes rent/EMI, groceries, utilities, essential commuting, and minimum loan repayments. The most common mistake is 'Needs Inflation'—confusing a basic need with an upgraded desire.\n\nHousing is a fundmental need, but paying for a 4BHK when you are single is a 'Want' masquerading as a 'Need.' If your core needs exceed 50% of your take-home pay, you are 'House Poor' or 'Loan Poor.' You have zero breathing room, and any emergency will force you into debt. To fix this, you must either find a way to increase income or make the difficult decision to downsize fixed costs until survival fits within 50%.",
          keyTakeaway: "Needs are about survival and earning capacity. If they exceed 50%, your financial house is at risk.",
          example: "If take-home is ₹60k but rent/EMI alone is ₹40k, you have already failed the 50% rule before buying groceries."
        },
        {
          icon: "shopping-bag",
          title: "The 30% Wants: The Joy Bucket",
          text: "This is where most financial advice goes wrong. Traditional gurus suggest cutting out all joy—the 30% 'Wants'—to save money. This lead to a 'spending binge' later. The 50/30/20 rule recognizes that you have a right to enjoy your hard-earned money. This bucket is for dining out, Netflix, travel, and hobbies.\n\nThis 30% is a **Cap**, not a floor. When financial situations get tough, this bucket acts as your primary shock absorber. It can be cut to zero without affecting survival. Value-based spending means identifying the 2-3 things that genuinely make you happy and ruthlessly cutting rest. As long as the total remains under 30%, you are doing perfectly. This allows you to live a rich life today while respecting your future.",
          keyTakeaway: "Wants keep you motivated. Treat this bucket as a flexible variable to dial up or down.",
          example: "To buy a ₹15k gadget, you decide which other 'wants' (like dinners) to give up this month to stay under 30%."
        },
        {
          icon: "shield",
          title: "The 20% Savings: Paying Your Future Self",
          text: "This final 20% is for building long-term wealth: your Emergency Fund, aggressive debt repayment, and investments like Mutual Funds or PPF. The problem is that people save 'what is left' at the end of the month. According to Parkinson’s Law, expenses naturally expand to fill available money. There is almost *never* anything left.\n\nTo break this, practice the golden rule: **Pay Yourself First**. As soon as your salary hits, move that 20% to a separate account. Treat your savings like a mandatory bill you owe to your 'Future Self'—the person who will eventually be too old to work and rely on these savings. If 20% is hard, start with 5% and increase by 1% every few months. The 'Habit' is more important than the amount. Automating this is the single most effective action for wealth.",
          keyTakeaway: "Savings are a debt to your future. Automate the 20% on salary day so you never see it as spendable.",
          example: "A person earning ₹40k who saves ₹8k is 'wealthier' than a person earning ₹1.2 lakh who saves ₹0."
        },
        {
          icon: "target",
          title: "Reverse Lifestyle Creep",
          text: "The 50/30/20 rule is a destination, not a rigid law. If rent in a city like Mumbai is high, you might start at 60/20/20. The important thing is the **Direction** of your behavior. As your income grows, aim for 'Reverse Lifestyle Creep.'\n\nMost people use a raise to buy a bigger car, which keeps their savings rate at 0%. Instead, if you get a ₹20k raise, keep your lifestyle exactly where it is and move that extra amount into your savings bucket. Suddenly, your rate might jump to 30% or 40%. This 'Gap' is where your freedom lives. It’s what allows you to take risks, start a business, or retire early. Start today by looking at bank statements for the last 90 days. Categorize honestly, be ruthless, and remember: you are building a life.",
          keyTakeaway: "The 'Gap' between earning and spending is where your freedom lives.",
          example: "If you get a bonus, don't spend it. Put it in savings to boost your rate without changing your daily life at all."
        }
      ],
      quizzes: [
        {
          question: "What is a 'Need'?",
          options: ["Regular spend", "Health/Survival/Earning essentials", "What friends pay", "Status items"],
          answer: 1
        },
        {
          question: "Benefit of 'Pay Yourself First'?",
          options: ["More for wants", "Ensures automatic wealth building", "Kills debt", "VIP status"],
          answer: 1
        },
        {
          question: "If Needs are 75% of income:",
          options: ["Stop saving", "Ignore budget", "Downsize fixed costs", "Spend more"],
          answer: 2
        },
        {
          question: "With ₹1 lakh salary, 'Wants' cap is?",
          options: ["₹50k", "₹20k", "₹30k", "₹10k"],
          answer: 2
        },
        {
          question: "Shock absorber bucket?",
          options: ["50% Needs", "30% Wants", "20% Savings", "Bank fund"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "The Emergency Fund Blueprint",
    description: "Build a safety net to sleep peacefully regardless of the economy.",
    difficulty: "Medium",
    points: 200,
    icon: "shield",
    category: "literacy",
    content: JSON.stringify({
      duration: 20,
      slides: [
        {
          icon: "shield",
          title: "The 'Sleep Well At Night' (SWAN) Fund",
          text: "An emergency fund is insurance, not an investment. Its purpose isn't to make money, but to prevent losing everything when life goes wrong. Most live 1-2 paychecks from collapse. A sudden medical crisis or layoff should not be a tragedy forced upon you.\n\nAn emergency fund breaks this cycle of fragility. It's a dedicated chunk of cash sitting in a safe, boring place. People with funds navigate global crises with a sense of calm. When you have six months of essential cash in the bank, your boss loses the power to bully you, and you gain the 'mental bandwidth' to make smart decisions instead of panic-driven ones. Security must always come before growth.",
          keyTakeaway: "It's your financial immune system. It buys you peace of mind and time to think clearly during a crisis.",
          example: "During economic shocks, those with 6-month funds stay calm while those without are forced into ruin within weeks."
        },
        {
          icon: "calculator",
          title: "How Much is Enough? Scaling Your Safety Net",
          text: "Target 3-6 months of ESSENTIAL expenses. The real answer depends on your personal 'Fragility'—how likely is your income to stop? We calculate based on **Expenses** (cost to survive), not income.\n\n**3 Months:** Young, single, low expenses, stable job.\n**6-12 Months:** Children, aging parents, or freelancers/business owners in volatile industries like Tech. To find your 'Survival Number,' add up Rent/EMI, Food, Utilities, Transport, and Insurance. Multiply this by your target months. When you hit this, you have effectively bought months of freedom from the need to earn.",
          keyTakeaway: "Target 3-6 months of survival expenses. Go higher if you have dependents or irregular pay.",
          example: "If earnings are ₹80k but essentials are ₹30k, your 6-month goal is ₹1.8 Lakh, not ₹4.8 Lakh."
        },
        {
          icon: "lock",
          title: "Safe and Liquid: Where to Park Your Protection",
          text: "Your fund has two rules: Safe and Liquid. SAFE means the principle amount never fluctuates—so no stock market. Imagine the market crashes 30% exactly when companies start firing people. LIQUID means you get the money within 24 hours. A property is not an emergency fund because you can't sell a kitchen sink to pay a hospital bill.\n\nStrategy: Keep 10% as cash or in your main account for instant access. Keep 90% in a separate High-Interest Savings Account with a *different* bank, or a 'Sweep-in' Fixed Deposit. Separation is psychological—it prevents 'accidental' spending on sales.",
          keyTakeaway: "Zero risk and instant access are the priorities. Avoid the stock market for this fund.",
          example: "Sweep-in FDs earn high interest but the bank breaks them instantly if you swipe your card at a pharmacy."
        },
        {
          icon: "target",
          title: "Dealing with Debt and the Starter Fund",
          text: "If you have high-interest debt like credit cards (15-40%), that debt *is* an emergency. But you should first build a **'Starter Fund'** of ₹25k-50k. Life doesn't stop for your debt plan. If your phone breaks and you have ₹0, you'll be forced back into debt.\n\nThe Starter Fund is a shield that prevents 'relapsing.' Once you have it, stop all saving and attack high-interest debt with everything. Once the debt is dead, finish the full 6-month fund. 1. Starter Fund -> 2. Kill High-Interest Debt -> 3. Full 6-Month Fund -> 4. Long-term Investing.",
          keyTakeaway: "Small starter fund stops you from relapsing into more debt while you tackle old ones.",
          example: "₹25k savings with debt is more secure than ₹0 savings with debt. One can handle a leaking pipe; other goes deeper into debt."
        },
        {
          icon: "zap",
          title: "The Discipline: Rules of Use and Refill",
          text: "Define emergencies strictly. Is it unexpected? Necessary for survival or earning? Urgent? If the answer to all is not 'Yes,' it is a 'Want' that should come from your 30% bucket. Car service is NOT an emergency; it's a planned expense.\n\nThe moment you withdraw from your fund, enter 'Code Red.' Pause all discretionary spending and cancel SIP investments until the fund is restored to 100%. Treat it like the oxygen supply in a submarine; if it's low, nothing else matters except refilling it.",
          keyTakeaway: "Define emergencies strictly. Refilling the fund is your #1 financial priority if touched.",
          example: "Establish a 'Holy Sh*t' rule. If it isn't a situation that makes you say that aloud, keep the vault closed."
        }
      ],
      quizzes: [
        {
          question: "Purpose of an Emergency Fund?",
          options: ["Max returns", "Mental bandwidth and calm", "Bank VIP", "Sales/Liquidation"],
          answer: 1
        },
        {
          question: "How to calculate goal?",
          options: ["6mo salary", "3-6mo essentials", "Fixed ₹5L", "Credit limit"],
          answer: 1
        },
        {
          question: "Poorest place to keep it?",
          options: ["Savings acct", "Sweep-in FD", "Stock market", "Liquid fund"],
          answer: 2
        },
        {
          question: "When build ₹25k Starter Fund?",
          options: ["After debt-free", "Before killing high-interest debt", "After buying house", "Never"],
          answer: 1
        },
        {
          question: "After using the fund?",
          options: ["Continue usual", "Refill as #1 priority", "Take replacement loan", "Forget it"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "The Mutual Fund Revolution",
    description: "Move beyond simple savings. Learn professional managers grow your wealth through diversification and the power of markets.",
    difficulty: "Medium",
    points: 300,
    icon: "trending-up",
    category: "literacy",
    content: JSON.stringify({
      duration: 30,
      slides: [
        {
          icon: "users",
          title: "Introduction: The Power of Pooling",
          text: "A Mutual Fund is essentially a 'Bucket of Money' contributed by thousands of small investors like you. It allows someone with just ₹500 to get the same professional management and diversification that a millionaire enjoys. Instead of you trying to research 50 different companies, you give your money to an 'Asset Management Company' (AMC). They hire an expert 'Fund Manager' who spends 10 hours a day researching where to put that money to get the best returns.\n\nWhen you buy a 'Unit' of a mutual fund, you own a tiny slice of everything that fund owns. If the fund manager buys shares in 40 different companies like Reliance, HDFC, and Infosys, and one of those companies fails, your overall portfolio is protected because the other 39 are still performing. This is the 'Magic of Diversification.' It eliminates the risk of losing everything on a single bad decision. In exchange for this professional service, the AMC charges a small annual fee called the 'Expense Ratio.' Understanding how to pick funds with low costs and high consistency is the first step toward long-term wealth.",
          keyTakeaway: "Mutual funds pool money to provide professional management and instant diversification for a small fee.",
          example: "If you spend ₹1,00,000 on a single stock and it crashes 50%, you lose ₹50,000. If you put ₹1,00,000 in a Mutual Fund with 50 stocks and one crashes 50%, you might only lose ₹1,000."
        },
        {
          icon: "target",
          title: "SIP vs Lumpsum: The Disciplined Path",
          text: "There are two main ways to invest in Mutual Funds: Lumpsum (one-time) and SIP (Systematic Investment Plan). While Lumpsum might feel exciting, the **SIP** is the true secret weapon of the retail investor. A SIP is an automated instruction to invest a fixed amount every month on a specific date. This eliminates 'Emotional Timing'—the urge to wait for the market to crash before buying.\n\nSIPs benefit from **'Rupee Cost Averaging.'** When the market is high, your ₹5,000 buys fewer units. When the market crashes, your ₹5,000 automatically buys *more* units. Over 10 years, you end up with a lower average cost per unit than someone trying to 'time the market.' The market is volatile, but the SIP turns that volatility into your friend. It forces you to 'Buy Low' without you even thinking about it. Discipline beats intelligence in the long term.",
          keyTakeaway: "SIPs automate your wealth building and use Rupee Cost Averaging to lower your risk over time.",
          example: "Imagine buying gold. Instead of waiting for the 'best price,' you buy ₹1000 worth every Friday. Some weeks it's expensive, some weeks it's cheap—eventually, you own a lot of gold at a very fair average price."
        },
        {
          icon: "layers",
          title: "Types of Funds: Equity, Debt, and Index",
          text: "Not all mutual funds are the same. You must match the 'Bucket' to your 'Goal.' \n\n1. **Equity Funds:** These buy shares in companies. They have high risk in the short term but the highest potential for growth over 5-10 years. \n2. **Debt Funds:** These lend money to governments and corporations. They are much safer than equity and usually give better returns than a bank savings account. Ideal for 1-3 year goals. \n3. **Index Funds (Passive):** This is the modern gold standard for beginners. Instead of a fund manager trying to beat the market, an Index Fund simply copies a market index like the Nifty 50. Because there is no expensive manager to pay, the fees (Expense Ratio) are incredibly low. Historically, 80% of active managers fail to beat the index anyway. Choosing low-cost index funds is often the smartest move for long-term retirement planning.",
          keyTakeaway: "Match your fund type to your timeline. Use Index Funds for long-term goals to keep fees extremely low.",
          example: "Saving for a vacation in 12 months? Use a Debt Fund. Saving for a house in 15 years? Use an Equity Index Fund."
        }
      ],
      quizzes: [
        {
          question: "What is a 'Mutual Fund'?",
          options: ["A bank account", "A pool of money from many investors managed by a professional", "A type of insurance", "A government loan"],
          answer: 1
        },
        {
          question: "What is the main benefit of 'Diversification'?",
          options: ["It guarantees 100% returns", "It reduces total risk by spreading money across many different assets", "It makes the app look better", "It avoids all taxes"],
          answer: 1
        },
        {
          question: "What is 'Rupee Cost Averaging' in an SIP?",
          options: ["Paying the bank for every transaction", "Buying more units when prices are low and fewer when high, lowering average cost", "A way to avoid the GST tax", "The cost of converting currency"],
          answer: 1
        },
        {
          question: "Why are 'Index Funds' often recommended for beginners?",
          options: ["They are the riskiest", "They have the highest management fees", "They provide broad market diversification with the lowest possible fees", "They only invest in government gold"],
          answer: 2
        },
        {
          question: "What is the 'Expense Ratio'?",
          options: ["The number of employees at a bank", "The annual fee you pay to the AMC for managing your money", "The tax on your withdrawal", "The profit the fund made last year"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "The Debt Trap Escape",
    description: "Learn high-level strategies to destroy debt and reclaim your financial sovereignty. Professional tactics for personal freedom.",
    difficulty: "Medium",
    points: 350,
    icon: "zap",
    category: "literacy",
    content: JSON.stringify({
      duration: 45,
      slides: [
        {
          icon: "zap",
          title: "The Math of Slavery: High Interest Debt",
          text: "Interest is the price of time. When you borrow money at 2.5% to 4% per month (typical for credit cards), you are effectively selling your future labor at a massive discount. At 36% annual interest, your debt doubles every two years. This is 'Negative Compounding'—the exact opposite of wealth building.\n\nThe first step to escape is to differentiate between 'Productive Debt' (Home loans, Education loans) and 'Destructive Debt' (Credit cards, Personal loans for lifestyle). Destructive debt is a trap because it allows you to consume tomorrow's income today. You must treat this like a medical emergency. You cannot build a house on quicksand, and you cannot build wealth while paying 36% interest. The goal is to 'Stop the Bleeding' by cutting up the cards and moving to a cash-only lifestyle until the balance is zero.",
          keyTakeaway: "High-interest debt is negative compounding. Treat it as a financial emergency that must be killed before everything else.",
          example: "₹1,00,000 credit card debt at 36% interest costs ₹3,000 every single month just to stay the same. That's ₹100 of your labor gone every single day before you buy food."
        },
        {
          icon: "target",
          title: "Snowball vs Avalanche: Choosing Your Weapon",
          text: "There are two proven psychological methods to kill debt: \n\n1. **The Snowball Method:** List your debts from smallest balance to largest. Pay the minimum on all, and put every extra rupee into the smallest debt. When it's gone, the 'victory' gives you the dopamine to attack the next one. This is about *Psychology*.\n2. **The Avalanche Method:** List debts from highest interest rate to lowest. Attack the highest interest one first. Mathematically, this saves you the most money in the long run. This is about *Math*.\n\nChoose the method that fits your personality. If you need quick wins to stay motivated, Snowball. If you are cold and calculating, Avalanche. The weapon matters less than the consistency of the attack.",
          keyTakeaway: "Snowball for psychological wins; Avalanche for mathematical efficiency. Both work if you stay consistent.",
          example: "Debts: ₹10,000 (15%) and ₹50,000 (36%). Snowball attacks the ₹10,000 first. Avalanche attacks the ₹50,000 first."
        }
      ],
      quizzes: [
        {
          question: "What is 'Negative Compounding'?",
          options: ["Losing your wallet", "When high interest on debt grows your balance faster than you can pay it", "A type of tax", "When the stock market drops"],
          answer: 1
        },
        {
          question: "Which debt should you treat as a 'Medical Emergency'?",
          options: ["Home Loan at 8%", "Credit Card debt at 36%", "Education Loan at 9%", "Zero interest loan from a friend"],
          answer: 1
        },
        {
          question: "What is the core idea of the 'Snowball Method'?",
          options: ["Paying the highest interest first", "Paying the smallest balance first to get quick psychological wins", "Waiting for winter to pay", "Ignoring small debts"],
          answer: 1
        },
        {
          question: "What is the core idea of the 'Avalanche Method'?",
          options: ["Mathematical efficiency by paying the highest interest debt first", "Paying debts at random", "Consolidating all debts into one", "Only paying the minimum"],
          answer: 0
        },
        {
          question: "What is the most important factor in escaping debt?",
          options: ["Having a high IQ", "The specific bank you use", "Consistency and stopping new spending", "The color of your credit card"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Equity Intelligence: Mastering the Stock Market",
    description: "Go deep into the engine of global business. Covers stock valuation, fundamental analysis, and psychological fortitude. (Advanced Depth)",
    difficulty: "Hard",
    points: 500,
    icon: "trending-up",
    category: "literacy",
    content: JSON.stringify({
      duration: 60,
      slides: [
        {
          icon: "building-2",
          title: "Ownership Architecture: What is a Stock?",
          text: "A stock is not a ticker symbol on a screen; it is a legal claim to the future profits and assets of a real business. When you buy one share of a company, you have effectively 'hired' the CEO and every employee of that company to work for you. If the company makes a profit, you are entitled to a slice of it through **Dividends** or the increase in the share price as other people realize the business is more valuable.\n\nUnderstanding the 'Capital Structure' of a company is the first step of an advanced investor. Companies raise money either by taking loans (Debt) or by selling pieces of themselves (Equity). As an equity holder, you are the last in line to get paid, which is why your risk is higher—but your potential 'Upside' is unlimited. Unlike a loan that only pays interest, a stock can grow 10x, 100x, or 1000x over decades as the business scales. To be a successful stock investor, you must transition from a 'Consumer' mindset to an 'Owner' mindset. You stop looking at products and start looking at 'Business Models'—how does this company defend its profits from competitors? What is its 'Moat'?",
          keyTakeaway: "A stock is a piece of a business. Your returns come from the business's ability to generate cash and defend its market position.",
          example: "Instead of just buying an iPhone, you buy shares of Apple. You are now the 'boss' of the engineers who designed the phone you're holding."
        },
        {
          icon: "microscope",
          title: "Fundamental Analysis: Reading the Vitials",
          text: "Advanced investors use 'Fundamental Analysis' to determine the 'Intrinsic Value' of a company—what it is actually worth, regardless of its current price. This involves reading the three main financial statements: the Balance Sheet (What they own vs owe), the Income Statement (What they earned), and the Cash Flow Statement (Where the actual liquid cash went).\n\nKey Metrics to Master: \n1. **P/E Ratio (Price-to-Earnings):** Are you paying ₹50 for every ₹1 the company earns, or ₹10? High P/E usually means high expectations for future growth. \n2. **ROE (Return on Equity):** This measures management's efficiency. If they take ₹100 of your money, do they generate ₹20 of profit (Excellent) or ₹2 (Poor)? \n3. **Debt-to-Equity:** A company with too much debt is fragile. If the economy slows down, interest payments can bankrupt them even if they have a good product. \n4. **Free Cash Flow:** Profits can be manipulated by accounting; cash in the bank cannot. A great company turns a high percentage of its earnings into real cash that can be reinvested or paid to you.",
          keyTakeaway: "Price is what you pay; Value is what you get. Use financial ratios to see through the hype and find solid businesses.",
          example: "Company A and B both earn ₹100. But Company A has no debt and ₹50 cash in bank, while Company B has ₹500 debt. Company A is a much 'safer' and more valuable business, even if the share prices are the same."
        },
        {
          icon: "brain",
          title: "The Emotional Game: Market Cycles",
          text: "The Stock Market is a weighing machine in the long term, but a 'Voting Machine' in the short term. It is driven by the twin emotions of **Fear** and **Greed**. Professional investors understand that 'Volatility' is not the same as 'Risk.' Volatility is just the price moving up and down; Risk is the permanent loss of your money.\n\nMost retail investors fail because they buy when the news is good (Greed/High Prices) and sell when the news is bad (Fear/Low Prices). They do the exact opposite of what logic dictates. An advanced investor knows that market crashes are actually 'Sales' on high-quality businesses. As Warren Buffett says, 'Be fearful when others are greedy, and greedy when others are fearful.' To survive a 60-minute deep-dive into the market, you must build the 'Psychological Fortitude' to see your account drop 30% without panicking, knowing that the underlying businesses you own are still strong. Time in the market is your greatest leverage, but only if you have the stomach to stay through the storms.",
          keyTakeaway: "Volatility is the price of entry for high returns. Master your emotions or the market will take your money.",
          example: "In March 2020, the market crashed 40%. Panicked investors sold and lost everything. Disciplined investors waited, and by 2021, the market was at an all-time high."
        }
      ],
      quizzes: [
        {
          question: "What does 'Equity' represent in a company?",
          options: ["A loan the company must pay back", "Legal ownership and a claim on future profits", "The company's marketing budget", "A type of tax"],
          answer: 1
        },
        {
          question: "Why is 'Free Cash Flow' often more important than accounting 'Profit'?",
          options: ["It's easier to calculate", "Profits can be manipulated by accounting rules, but liquid cash is hard to fake", "Cash earns more interest", "Government doesn't tax cash"],
          answer: 1
        },
        {
          question: "What is the difference between Volatility and Risk?",
          options: ["They are the same thing", "Risk is a total loss; Volatility is just temporary price movement", "Volatility is more dangerous", "Risk is only for beginners"],
          answer: 1
        },
        {
          question: "What is the core idea behind 'Fundamental Analysis'?",
          options: ["Following what's trending on Twitter", "Determining the true intrinsic value of a business based on its financials", "Buying stocks that have a pretty logo", "Only buying stocks that are currently expensive"],
          answer: 1
        },
        {
          question: "What is 'Position Sizing' in risk management?",
          options: ["Buying more stocks than your friends", "Limiting the percentage of your total money in one single stock to prevent ruin", "Ordering stocks from largest to smallest price", "Only buying stocks from large companies"],
          answer: 1
        }
      ]
    })
  },
  {
    title: "Advanced Retirement Engineering",
    description: "The ultimate guide to building a multi-decade wealth machine. Modern strategies for financial independence and early retirement.",
    difficulty: "Hard",
    points: 600,
    icon: "target",
    category: "literacy",
    content: JSON.stringify({
      duration: 90,
      slides: [
        {
          icon: "target",
          title: "The Trinity Study and the 4% Rule",
          text: "Retirement engineering is math, not magic. The core principle is the **4% Rule**, derived from the Trinity Study. It states that you can safely withdraw 4% of your total portfolio value in the first year of retirement, and adjust that amount for inflation every year after, with a very high probability that your money will last at least 30 years.\n\nTo find your 'Financial Independence Number' (FI Number), multiply your annual expenses by 25. If you need ₹12 Lakhs per year to live a great life, you need a portfolio of ₹3 Crores. Once you hit this number, work becomes optional. The goal of this course is to accelerate your path to that number by optimizing asset allocation across Equity, Gold, and Debt. This is 'Engineering' because we treat your portfolio as a machine designed to produce a specific cash output regardless of market conditions.",
          keyTakeaway: "Your FI Number = Annual Expenses x 25. Once hit, you can safely live off 4% withdrawal forever.",
          example: "Monthly expenses: ₹50,000 -> Annual: ₹6,00,000 -> FI Number: ₹1.5 Crore. At this point, your money earns your salary for you."
        },
        {
          icon: "layers",
          title: "Asset Allocation: The Engine Room",
          text: "The returns of your portfolio are 90% determined by your **Asset Allocation** (how you split money between Stocks, Bonds, and Gold) and only 10% by which specific stocks you pick. An advanced retirement portfolio is 'Anti-Fragile.' \n\n1. **Equity (Stocks):** The growth engine. Provides returns that beat inflation but with high volatility.\n2. **Debt (Bonds/PPF):** The stabilizer. Provides fixed returns and reduces the impact of market crashes.\n3. **Gold/Commodities:** The hedge. Gold typically performs well when both stocks and currency are in trouble.\n\nA classic 60/30/10 split is a solid foundation. As you get closer to your retirement date, you slowly move towards more Debt to protect the principal. Mastering 'Rebalancing'—selling the assets that went up to buy the ones that stayed low—is the secret to capturing extra returns over decades.",
          keyTakeaway: "Asset allocation is the most important decision you'll make. Rebalance annually to stay on target.",
          example: "If Stocks grow to 70% of your portfolio due to a bull market, you sell 10% and buy Debt/Gold to bring it back to 60/30/10. You are effectively 'Buying Low and Selling High' automatically."
        }
      ],
      quizzes: [
        {
          question: "What is the '4% Rule'?",
          options: ["Saving 4% of your salary", "The safe annual withdrawal rate that allows a portfolio to last 30+ years", "The tax you pay on retirement", "The interest rate of a bank"],
          answer: 1
        },
        {
          question: "How do you calculate your 'Financial Independence Number'?",
          options: ["Monthly expenses x 12", "Annual expenses x 25", "Your current age x ₹1 Lakh", "Fixed ₹10 Crore"],
          answer: 1
        },
        {
          question: "Which factor determines 90% of your long-term returns?",
          options: ["Picking the right individual stocks", "Asset Allocation (how you split money between asset classes)", "The timing of your buy", "The bank you choose"],
          answer: 1
        },
        {
          question: "What is 'Rebalancing' a portfolio?",
          options: ["Moving all money to a new bank", "Periodic adjustment of your asset weights back to your target allocation", "Selling everything when the market crashes", "Buying only what is trending"],
          answer: 1
        },
        {
          question: "Why include Debt (Bonds) in a retirement portfolio?",
          options: ["To maximize returns", "To act as a stabilizer and reduce volatility during market crashes", "To avoid all taxes", "Because the government requires it"],
          answer: 1
        }
      ]
    })
  }
];

const CHALLENGE_QUESTS = [
  { title: "The 1% Rule", description: "Save just 1% over your target today.", difficulty: "Easy", points: 50, content: JSON.stringify({ target: 50, type: "save" }), icon: "target", category: "challenge" },
  { title: "Subscription Audit", description: "Review and cancel one unused app subscription.", difficulty: "Medium", points: 100, content: JSON.stringify({ type: "manual" }), icon: "shield", category: "challenge" },
  { title: "Morning Brew Stash", description: "Stash ₹100 instead of buying that coffee today.", difficulty: "Easy", points: 30, content: JSON.stringify({ target: 100, type: "save" }), icon: "coffee", category: "challenge" },
  { title: "Impulse Shield", description: "Avoided an impulse buy? Stash that money!", difficulty: "Medium", points: 75, content: JSON.stringify({ type: "manual" }), icon: "zap", category: "challenge" },
  { title: "Generic Hero", description: "Swap a brand name for a generic one and stash ₹30.", difficulty: "Easy", points: 40, content: JSON.stringify({ target: 30, type: "save" }), icon: "shopping-bag", category: "challenge" },
];

export async function seedLiteracyCourses() {
  const { db } = await import("./db");
  const { quests } = await import("@shared/schema");
  if (!db) { console.log("Database not connected. Skipping seeding."); return; }
  console.log("🌱 Seeding MEGA-DETAILED financial literacy courses...");

  const { eq } = await import("drizzle-orm");
  
  // Wipe ALL quests (literacy AND challenges) for a clean state
  await db.delete(quests);
  console.log("🗑️  Nuked all stale quests to make room for the new content library.");

  // Insert Challenges
  for (const challenge of CHALLENGE_QUESTS) {
    await db.insert(quests).values(challenge);
    console.log(`✅ Deployed Challenge: "${challenge.title}"`);
  }

  // Insert Mega-Courses
  for (const course of LITERACY_COURSES) {
    await db.insert(quests).values(course);
    console.log(`✅ Deployed Mega-Course: "${course.title}" (${course.points} XP)`);
  }
  
  console.log(`✨ Done! ${CHALLENGE_QUESTS.length + LITERACY_COURSES.length} high-fidelity courses and challenges are live.`);
}

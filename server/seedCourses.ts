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
          text: "Money is the most successful shared fiction ever created by the human race. At its absolute core, a ₹500 note has zero intrinsic value—it is just a piece of high-quality paper with security threads. It has no use in the physical world; you can't eat it, you can't wear it, and you can't build a house out of it. It only works because of a universal, unspoken agreement among billions of people: you trust that if you hand this paper to a shopkeeper, they will give you bread. And the shopkeeper trusts that they can hand that same paper to someone else for fuel, clothing, or taxes.\n\nBefore money became the standard, humanity used the 'Barter System.' If you were a wheat farmer and needed a cow, you had to find a cattle owner who specifically wanted wheat right at that moment. This is known as the 'double coincidence of wants.' If the cow owner wanted salt instead, you were stuck. Barter was incredibly inefficient, slow, and impossible to scale for a growing civilization. Money solved this by becoming a universal medium of exchange. It allowed us to decouple the acquisition of what we want from the production of what we specialize in.\n\nThink of money as a 'Social Ledger.' When you work at your job today, you are giving your time and energy to society. Society, in return, gives you a 'Certificate of Appreciation' in the form of currency. This certificate (money) is essentially stored time. You can trade that stored time 20 years from now for someone else's labor. In the modern digital age, money has evolved further. More than 90% of the world's money exists only as bits and bytes on banking servers. When you check your bank balance on your phone, you're looking at digits that represent your claim on a portion of the world's resources. Mastery of finance begins here: understanding that money is an abstract tool for measuring, storing, and moving human energy across time and space.",
          keyTakeaway: "Money is a social agreement that stores your time and energy. Its value comes from trust, not the material.",
          example: "If you were stranded on a deserted island with ₹100 crore in cash, you would be 'poor' because there is no social agreement to recognize that value. Money requires a community to exist."
        },
        {
          icon: "trending-up",
          title: "The Value Equation: Why Some Earn Millions",
          text: "If money is a measurement of value, how do you actually get more of it? The answer is simple but often missed: You are paid in direct proportion to the difficulty of the problem you solve for other people. This is the fundamental 'Value Equation' that dictates the economy. Most legacy education systems teach us to trade 'time' for money, leading people to believe that working 16 hours instead of 8 hours is the only way to double their income. This is a linear growth trap.\n\nConsider the difference between a general physician and a heart surgeon. Both might work the same number of hours, but the surgeon is paid exponentially more. Why? Because the problem they solve is rarer, the training is more intense, and the stakes of the outcome are higher. The surgeon has higher 'Leverage' because their specialized knowledge is in high demand but low supply. In the same way, a software engineer who builds an app used by millions has astronomical leverage compared to an artisan who can only make one item per day. The app creates value while the engineer sleeps; the artisan only creates value while they are physically working.\n\nTo escape the trap of low income, you must stop focusing on 'effort' and start focusing on 'scarcity' and 'scale.' Effort is a commodity; everyone can work hard. But not everyone can manage a team of 50 people, or design a bridge, or write code that secures billions of dollars. Your income is not a reward for your sweat; it is a reflection of how difficult you are to replace. If anyone can do your job with one week of training, you will always be paid the minimum. To earn more, you must acquire 'Specific Knowledge'—skills that feel like play to you but look like work to others.",
          keyTakeaway: "The market doesn't pay for effort; it pays for the scale and scarcity of the value you contribute. Leverage is the key to decoupling time from income.",
          example: "A delivery driver works incredibly hard but is easily replaced. A Logistics Network Architect who designs the system used by 10,000 drivers is solving a much harder, rarer problem at scale."
        },
        {
          icon: "brain",
          title: "The Psychology of Want: The Dopamine Trap",
          text: "Most financial failures are not caused by a lack of IQ or math skills; they are caused by a lack of emotional self-regulation. We are biological creatures with brains evolved for survival in an environment of scarcity. Our ancestors were rewarded for eating as much as possible whenever food was available. In our modern world of abundance, this same instinct leads to obesity. Similarly, our brains are wired for 'Instant Gratification,' which leads to financial ruin in a consumerist society.\n\nWhen you see a flashy new smartphone or a '50% OFF' sale, your brain's reward center releases dopamine—the neurotransmitter associated with pleasure and motivation. Crucially, dopamine is released during the *anticipation* of the purchase, not the long-term ownership. This is why you feel a massive rush when you click 'Buy Now,' but the excitement fades into 'Buyer's Remorse' just a few days later. You are caught on the 'Hedonic Treadmill.' You buy something to get a happiness spike, your baseline happiness eventually returns to normal, and you feel the urge to buy something bigger and better to get that same spike again.\n\nModern advertising is a multi-billion dollar machine designed specifically to exploit these biological triggers. They don't sell you a watch; they sell you the feeling of being a successful, respected person. When you buy luxury items on a loan you can't afford, you aren't buying a product—you're buying the *perception* of status. True financial freedom is the things you *don't* see: the emergency fund that lets you quit a toxic job, the investments that provide for your family, and the time you own for yourself. If you spend your money to show people how much money you have, you are effectively guaranteed to never actually *be* wealthy. Discipline is the ability to ignore the short-term dopamine of spending in favor of the long-term freedom of owning.",
          keyTakeaway: "Spend to maintain your life, not your ego. Discipline is choosing what you want *most* over what you want *now*.",
          example: "A person with a ₹12 lakh car loan who earns ₹50,000/month is 'status rich' but 'freedom poor.' A person with a 10-year-old car and ₹12 lakhs in a mutual fund is truly wealthy."
        },
        {
          icon: "zap",
          title: "Inflation: The Silent, Ongoing Robbery",
          text: "Inflation is the single greatest threat to your long-term financial health, and it works so slowly that most people don't even notice until it's too late. Imagine you have ₹10,000 in cash tucked away in a safe today. You leave it there for 20 years. When you take it out in the year 2046, it is still ₹10,000. But the world around you has changed drastically. The milk that cost ₹50 today now costs ₹150. The rent that was ₹15,000 is now ₹50,000. Your ₹10,000 is still physically there, but its 'Economic Weight' has been crushed.\n\nIn India, the historical average inflation rate is roughly 6-7% per year. This means that every single year, the 'purchasing power' of your cash drops by 6%. If your bank savings account only gives you 3% interest, you are actually *becoming poorer* every single day. You are losing 3% of your wealth's power annually even though the number in your account is going up. This is a negative real return. Inflation is essentially a hidden tax on everyone who holds cash and a hidden gift to everyone who owns productive assets or is in debt with fixed interest rates.\n\nTo survive inflation, you must stop 'saving' and start 'investing.' You need your money to grow at a rate that is *higher* than the rate of inflation. If inflation is 7%, your money must grow at least 8% just to maintain its value. Wealth is built when your growth rate is 12%, 15%, or 20%. Productive assets—like shares in profitable companies, land, or gold—tend to appreciate over time as the value of currency falls. Holding onto large amounts of cash for decades is a guaranteed way to lose your life's work to the invisible thief of inflation.",
          keyTakeaway: "Inflation is the decrease in what your money can buy. Keeping cash for long periods is a guaranteed loss. You must invest to protect your power.",
          example: "In 1990, a cinema ticket was ₹10. Today it's ₹250. That's a 2500% increase. If your grandfather saved ₹1000 in 1990, it would buy 100 tickets then. Today, it buys just 4."
        },
        {
          icon: "target",
          title: "The Magic of Compounding and Time",
          text: "Albert Einstein famously described Compound Interest as the '8th Wonder of the World' for a very specific reason: it allows a person with a small regular income to become a multi-millionaire, provided they have one thing—TIME. Compounding is the process where your investment earns a return, and in the next period, that return *also* earns a return. It is an exponential explosion that humans fundamentally struggle to visualize because we are wired to think linearly (1+1=2).\n\nConsider this: If you invest ₹1 lakh at a 15% return, in the first year you earn ₹15,000. Nice, but not life-changing. But by Year 10, that ₹1 lakh has grown to ₹4 lakh. By Year 20, it is ₹16 lakh. By Year 30, it is ₹66 lakh! The secret isn't the ₹1 lakh; it's the 30 years. The 'Heavy Lifting' of compounding happens at the very end of the curve. This is why the world's most famous investor, Warren Buffett, earned over 99% of his multi-billion dollar fortune after his 50th birthday. He wasn't necessarily a genius in his 50s; he had just been compounding since his teens.\n\nThe most important takeaway is that **Time is your greatest asset**, far more important than the amount of money you start with or even the interest rate you get. A 20-year-old who invests just ₹1,000 per month will likely end up with much more wealth than a 40-year-old who starts investing ₹10,000 per month. You cannot buy more time, but you can start using it today. Even a tiny amount invested consistently is better than a large amount 'saved' later. The best time to start was 10 years ago; the second best time is right now.",
          keyTakeaway: "Compounding turns small, consistent habits into massive late-stage wealth. Focus on time in the market, not timing the market.",
          example: "Person A invests ₹5,000/month from age 25 to 35 and then stops. Person B invests ₹5,000/month from age 35 to 65. Even though B invested for 30 years vs A's 10 years, Person A will likely have more money at age 65 because their money had a 10-year head start to compound."
        }
      ],
      quizzes: [
        {
          question: "Money is described as a 'Social Ledger' because:",
          options: ["It's made by the government", "It represents a record of your stored work that society agrees to honor in the future", "It's the only way to track who is successful", "It's a physical asset with inherent utility"],
          answer: 1
        },
        {
          question: "How can someone double their income without working more hours?",
          options: ["By working much harder at the same task", "By increasing the rarity and scale of the problem they solve (Leverage)", "By asking for a raise every month", "By saving more of their current salary"],
          answer: 1
        },
        {
          question: "Why do we feel 'Buyer's Remorse' after a major purchase?",
          options: ["Because the product is usually broken", "Because the dopamine rush happens during anticipation, not long-term ownership", "Because we realize inflation has eaten the value", "Because the shopkeeper was rude"],
          answer: 1
        },
        {
          question: "If your savings account gives 4% interest but inflation is 6%, what is effectively happening to your money?",
          options: ["It's growing by 4%", "It's staying exactly the same", "It's losing 2% of its real purchasing power every year", "It's growing by 10%"],
          answer: 2
        },
        {
          question: "What is the most critical factor in the success of compounding interest?",
          options: ["The starting amount of capital", "The specific news of the day", "The amount of time the investment is allowed to grow", "The prestige of the bank"],
          answer: 2
        }
      ]
    })
  },
  {
    title: "Mastering the 50/30/20 Rule",
    description: "The most robust budgeting framework in the world, explained deeply. Learn to allocate every rupee for maximum freedom and minimum stress.",
    difficulty: "Medium",
    points: 150,
    icon: "calculator",
    category: "literacy",
    content: JSON.stringify({
      slides: [
        {
          icon: "calculator",
          title: "The Philosophy of Proportion",
          text: "Most people fail at budgeting for one simple reason: they think it's about restriction. They try to track every single rupee, every cup of tea, and every small UPI payment. This leads to information overload, exhaustion, and the eventual abandonment of the budget within 30 days. The 50/30/20 rule, popularized by bankruptcy expert Senator Elizabeth Warren, takes a radically different approach. It is about **Structure**, not tracking. It focuses on the high-level proportions of your income rather than the micro-details of your spending.\n\nFinancial freedom isn't about saying 'NO' to every coffee or dinner out; it's about saying 'YES' to the things that matter most while ensuring your future is secure. When you have a clear plan, you actually gain MORE freedom because you no longer have to feel a sense of vague guilt every time you spend money. A budget is actually a 'Permission Slip' to spend money on the things you value, within the boundaries you've set for yourself. By dividing your take-home pay into three distinct buckets—Needs, Wants, and Savings—you ensure that you can survive today, enjoy today, and build wealth for tomorrow without the stress of constant calculation.\n\nThe framework is designed to automate your decision-making. Instead of asking 'Can I afford this coffee?', you simply check if you have money left in your 'Wants' bucket for the month. If the answer is yes, the expense is already accounted for. This simplicity is why the 50/30/20 rule is used by millions of successful people worldwide to manage everything from entry-level salaries to massive corporate bonuses.",
          keyTakeaway: "Budgeting is about intentionality, not deprivation. Use proportions to maintain balance without the burnout of micro-tracking.",
          example: "Think of your income as a pie. Instead of worrying about every crumb, just make sure the three main slices stay the right size."
        },
        {
          icon: "home",
          title: "The 50%: Protecting Your Foundation",
          text: "The first and most critical slice of your budget is the 50% allocated to your 'Needs.' These are the non-negotiable expenses that you *must* pay to maintain your health, your safety, and your basic ability to earn an income. In the Indian context, this bucket includes your rent or home loan EMI, groceries and basic household staples, utilities like electricity, water, and LPG, essential commuting costs to reach your workplace, and minimum repayments on any existing loans. These are the bills that would cause significant trouble if left unpaid.\n\nThe most common mistake people make is 'Needs Inflation.' They confuse a basic human need with an upgraded desire. For example, housing is a fundamental need, but paying for a 4BHK apartment in a premium locality when you are single is a 'Want' masquerading as a 'Need.' Similarly, while transport is a need, the EMI for a luxury SUV is almost certainly a want. If your core needs exceed 50% of your take-home pay, you are 'House Poor' or 'Loan Poor.' You have zero breathing room, and any small emergency will force you into debt. To fix this, you must either find a way to increase your income or make the difficult decision to downsize your fixed costs—like moving to a more affordable area or selling a car with high EMIs—until your baseline survival fits within 50% of your earnings.",
          keyTakeaway: "Needs are about survival and earning capacity. If they exceed 50%, your financial house is in danger during a crisis.",
          example: "If you take home ₹60,000 but your rent and car EMI alone total ₹40,000, you have already failed the 50% rule before buying a single grain of rice. You are living a lifestyle your income cannot sustain."
        },
        {
          icon: "shopping-bag",
          title: "The 30%: The Joy Bucket",
          text: "This is where most financial advice goes wrong. Traditional gurus suggest you should cut out all joy—the 30% 'Wants'—to save money. This is functionally equivalent to an impossible crash diet; you will suffer for a week and then binge-spend in a moment of weakness. The 50/30/20 rule recognizes that you have a right to enjoy the money you work hard for. This 30% bucket is for dining out, Zomato/Swiggy orders, weekend trips, gym memberships, Netflix/Prime subscriptions, and hobbies. It is the 'Lifestyle' portion of your budget.\n\nThe key is that this 30% is a **Cap**, not a floor. When your financial situation gets tough—say, if a bill increases or you lose a side-income—this 'Wants' bucket acts as your primary shock absorber. It is the only bucket that can be cut to zero without affecting your survival. The goal isn't to live a joyless life, but to be 'Conscious' about where that joy comes from. Value-based spending means identifying the 2-3 things that genuinely make you happy and ruthlessly cutting spending on the things that don't. Maybe you love high-quality coffee but don't care about the latest fashion—keep the coffee and skip the branded clothes. As long as the total remains under 30%, you are doing perfectly. This allows you to live a rich life today while still respecting your financial future.",
          keyTakeaway: "Wants keep you motivated and happy. Treat this bucket as a flexible variable that you can dial up or down based on your savings goals.",
          example: "If you want to buy a ₹15,000 gadget, you don't 'find' the money. You decide which other 'wants' to give up this month—like fancy dinners—to stay under your 30% limit."
        },
        {
          icon: "shield",
          title: "The 20%: Paying Your Future Self",
          text: "The final 20% is the most important for building long-term wealth, yet it is often the first bucket people ignore. This money is for your Emergency Fund, aggressive debt repayment, and long-term investments like Mutual Funds, NPS, or PPF. The fundamental problem most people have is that they save 'what is left' at the end of the month. According to Parkinson’s Law, our expenses naturally expand to fill the money we have available. If you have ₹10,000 in your account on the 25th of the month, you will subconsciously find a 'need' to spend it. There is almost *never* anything left at the end of the month.\n\nTo break this cycle, you must practice the golden rule of wealth: **Pay Yourself First**. This means as soon as your salary hits your bank account, the first transaction you make is moving that 20% to a separate savings or investment account. You must learn to treat your savings like a mandatory bill that you owe to your 'Future Self'—someone who will eventually be too old to work and will rely entirely on the money you save today. If you can't manage 20% right away, don't give up. Start with 5% or 10% and commit to increasing it by 1% every couple of months. The 'Habit' of saving is mathematically and psychologically more important than the starting amount. Automating this 20% is the single most effective action you can take to become wealthy over time.",
          keyTakeaway: "Savings are not an option; they are a debt to your future. Automate the 20% on salary day so you never even see it as spendable money.",
          example: "Wealth isn't about what you earn; it's about what you *keep*. A person earning ₹1.2 lakh who saves ₹0 is 'poorer' than a person earning ₹40,000 who keeps ₹8,000 every month."
        },
        {
          icon: "target",
          title: "Adapting the Rule to Your Reality",
          text: "The 50/30/20 rule is a powerful guide, but it is not a rigid law that will land you in jail if you break it. We live in the real world where rent in cities like Mumbai or Bangalore can be astronomical, or you might have large responsibilities for aging parents. During certain life stages, you might need to adjust the proportions to 60/20/20 or even 70/10/20. The important thing isn't the exact percentage today; it's the **Direction** of your behavior over time.\n\nAs your income grows throughout your career, you should aim for 'Reverse Lifestyle Creep.' Most people use a raise to buy a bigger car or a better apartment, which keeps their savings rate at 0%. Instead, if you get a ₹20,000 raise, keep your lifestyle exactly where it is and move that entire extra amount into your savings bucket. Suddenly, your 20% savings rate might jump to 30% or 40%. This 'Gap' between your income and your expenses is the most important number in your financial life. That gap is where your freedom lives. It’s the gap that allows you to take risks, start a business, or retire early. Start today by looking at your bank statements for the last 90 days. Categorize every transaction into Need, Want, or Save. Be honest, be ruthless, and remember: you are building a life, not just a spreadsheet.",
          keyTakeaway: "The rule is a destination. If your needs are currently high, work aggressively to grow the gap between what you earn and what you spend.",
          example: "If you get a bonus, don't spend it. Put it in your savings bucket. You've just given your 20% a massive boost without changing your daily life at all."
        }
      ],
      quizzes: [
        {
          question: "Which of these is the most accurate definition of a 'Need'?",
          options: ["Anything you spend money on regularly", "Expenses you MUST pay to maintain health, safety, and your ability to work", "Anything your friends also pay for", "Items that make you feel successful"],
          answer: 1
        },
        {
          question: "What is the primary benefit of the 'Pay Yourself First' approach?",
          options: ["It leaves you more money for 'Wants'", "It ensures wealth building happens automatically before you have the chance to spend the money", "It eliminates all your debt instantly", "It tells the bank you're a high-value customer"],
          answer: 1
        },
        {
          question: "If your 'Needs' (Rent, Bills, Food) currently take up 75% of your income, what is the best strategy?",
          options: ["Stop saving completely until you earn more", "Ignore the budget entirely", "Look to downsize major fixed costs like rent or debt, and aim to bring needs back to 50% over time", "Spend more on 'Wants' to relieve the stress"],
          answer: 2
        },
        {
          question: "Your take-home salary is ₹1,00,000. According to the rule, how much should you ideally spend on 'Wants' (Dining, fun, shopping)?",
          options: ["₹50,000", "₹20,000", "₹30,000", "₹10,000"],
          answer: 2
        },
        {
          question: "Which bucket should act as your 'Shock Absorber' when money gets tight?",
          options: ["The 50% Needs bucket", "The 30% Wants bucket", "The 20% Savings bucket", "The emergency fund from the bank"],
          answer: 1
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
          title: "The 'Sleep Well At Night' (SWAN) Fund",
          text: "An emergency fund is not an investment; it is an insurance policy for your life. Its purpose isn't to make you money, earn interest, or maximize returns—it's to prevent you from losing everything when life inevitably goes wrong. Most people in the modern world live just 1 or 2 missed paychecks away from total financial collapse. If they lose their job, face a sudden medical crisis, or their business fails, they are instantly forced into a cycle of desperation: taking high-interest credit card loans, selling family jewelry at a loss, or begging for help from relatives.\n\nAn emergency fund breaks this cycle of fragility. It is a dedicated chunk of cash sitting in a safe, boring place, ready to be used for *only* genuine, unforeseen emergencies. People with emergency funds navigate global crises, market crashes, and job losses with a sense of calm that others find impossible. When you have six months of essential cash in the bank, your boss loses the power to bully you, a car breakdown becomes a minor inconvenience rather than a tragedy, and you gain the 'mental bandwidth' to make smart decisions instead of panic-driven ones. This is the absolute first step of all financial planning. Do not buy a single share of stock, do not touch crypto, and do not think about a home loan until you have laid this foundation. Security must always come before growth.",
          keyTakeaway: "An emergency fund is your financial immune system. It buys you peace of mind and the time needed to think clearly during a crisis.",
          example: "During the 2008 or 2020 economic shocks, those with 6-month funds could stay calm and pivot. Those without were forced into debt or ruin within weeks."
        },
        {
          icon: "calculator",
          title: "How Much is Enough? Scaling Your Safety Net",
          text: "The generic advice you'll hear from most bankers is 'save 3 months of expenses.' However, the real answer depends entirely on your personal 'Fragility'—how likely is your income to stop, and how many people depend on that income? You must look at your life honestly and decide where you sit on the risk spectrum. We calculate based on your **Expenses** (the cost to survive), not your income (what you earn).\n\n**3 Months is appropriate if:** You are young, single, have low fixed expenses, and work in a very stable job (like a government position) where your skills are high in demand. \n\n**6 to 12 Months is appropriate if:** You have children, aging parents, or other dependents who rely on your salary. It is also mandatory if you are a freelancer, a business owner, or work in a volatile industry like Tech Startups or Hospitality where layoffs are common. \n\nTo find your 'Survival Number,' add up every single essential: Rent/EMI + Food + Utilities + Transport + Insurance + Mandatory Loan Payments. This is your monthly baseline. Multiply this by your target months (e.g., ₹25,000 * 6 = ₹1.5 Lakhs). This is your 'Wall of Protection.' When you hit this number, you have effectively bought 6 months of freedom from the need to earn an income. That is one of the most powerful feelings in the world.",
          keyTakeaway: "Target 3-6 months of ESSENTIAL expenses for stability. Go for 6-12 months if you have a family or an irregular income.",
          example: "If you earn ₹80,000 but only spend ₹30,000 on essentials, your 6-month goal is ₹1.8 Lakhs. Don't build a fund for ₹4.8 Lakhs (80k * 6) unless you actually need all that to survive."
        },
        {
          icon: "lock",
          title: "Where to Park Your Protection",
          text: "Your emergency fund has two non-negotiable rules that override any desire for profit: it must be **Safe** and it must be **Liquid**. \n\n**SAFE** means the principle amount must never fluctuate. You cannot keep your emergency fund in the stock market or equity mutual funds. Imagine the stock market crashes by 30%—historical data shows this often happens exactly when the economy slows down and companies start firing people. If your ₹5 Lakh fund becomes ₹3.5 Lakh exactly when you lose your job, your plan has failed. \n\n**LIQUID** means you can get the money into your hand within hours or a maximum of one day. A property or a startup investment is not an emergency fund because you can't sell a kitchen sink to pay a hospital bill on a Sunday night. \n\n**The Ideal Strategy:** \n1. Keep 10% (around ₹20,000) as cash at home or in your main savings account for instant, minute-by-minute access.\n2. Keep the remaining 90% in a separate High-Interest Savings Account with a *different* bank, or a 'Sweep-in' Fixed Deposit. This separation is psychological—it prevents you from 'accidentally' spending your safety net because you saw a travel deal or a sale on your primary banking app. You want this fund to be 'Out of sight, out of mind' until the day you truly need it.",
          keyTakeaway: "Zero risk and instant access are the priorities. Use high-yield savings accounts or liquid FDs. Avoid the stock market for this fund.",
          example: "A 'Sweep-in' FD earns 7% interest like an FD, but if you swipe your card at a pharmacy, the bank instantly breaks the FD and pays the bill for you with zero manual effort."
        },
        {
          icon: "target",
          title: "Dealing with Debt and the Starter Fund",
          text: "A very common dilemma: 'Should I build an emergency fund when I have significant debt?' The answer depends on the type of debt you are carrying. If you have a Home Loan or an Education Loan at 8-9% interest, prioritize building your full 6-month fund while continuing your regular EMIs. \n\nHowever, if you have Credit Card debt or a Personal Loan at 15% to 40% interest, that debt *is* an emergency. But you should not put every single rupee toward the debt yet. You must first build a **'Starter Emergency Fund'** of roughly ₹25,000 to ₹50,000. Why? Because life doesn't stop just because you're paying off debt. If your phone breaks or you get a flat tire and you have ₹0 in savings, you will be forced to put that repair back on your credit card. This 'One step forward, two steps back' cycle is what kills motivation. \n\nThe Starter Fund acts as a shield that prevents you from going *further* into debt while you tackle the old ones. Once you have that small shield, stop all saving and attack the high-interest debt with everything you have. Once the debt is dead, go back and finish the full 6-month fund. \n\n1. Starter Fund (₹25k-₹50k) → 2. Kill High-Interest Debt (>12%) → 3. Full 6-Month Fund → 4. Long-term Investing.",
          keyTakeaway: "A small starter fund stops you from relapsing into more debt. Once you have it, focus entirely on killing expensive debt before finishing the full fund.",
          example: "A person with ₹2 Lakhs in debt and ₹25k in savings is much more secure than someone with ₹2 Lakhs in debt and ₹0 in savings. The first person can handle a leaking pipe; the second person goes into deeper debt."
        },
        {
          icon: "zap",
          title: "The Discipline: Rules of Use and Refill",
          text: "The final and most difficult part of an emergency fund is maintaining the discipline to use it only for real emergencies. Most people are experts at 'Creative Justification'—they convince themselves that a once-in-a-lifetime flight sale or a broken laptop screen (that still works with a monitor) is an 'emergency.' \n\n**The 'Is It An Emergency?' Test:** \n1. Is it unexpected? (A car service is NOT unexpected, it's a planned expense). \n2. Is it absolutely necessary for survival or earning my living? \n3. Is it urgent (must be paid within 24-48 hours)? \n\nIf the answer to all three is not 'Yes,' it is a 'Want' that should come from your 30% bucket, not the fund. \n\n**The Replenishment Rule:** The moment you withdraw money from your fund, your entire financial life goes into 'Code Red' mode. You must pause all discretionary spending, cancel your SIP investments for 1-2 months, and skip the weekend trips until the fund is restored to its 100% target level. Treat your emergency fund like the oxygen supply in a submarine; if it's low, nothing else matters except refilling it. Respect the fund, and the fund will protect your life.",
          keyTakeaway: "Define emergencies strictly. If you touch the fund, refilling it becomes your #1 financial priority over everything else.",
          example: "Establish a 'Holy Sh*t' rule. If it isn't a situation that makes you say that out loud, keep the vault closed."
        }
      ],
      quizzes: [
        {
          question: "What is the primary psychological purpose of an Emergency Fund?",
          options: ["To maximize your investment returns", "To provide 'mental bandwidth' and calm so you can make smart decisions during a crisis", "To show the bank you are a VIP customer", "To buy luxury items when they go on sale"],
          answer: 1
        },
        {
          question: "How should you calculate your Emergency Fund goal?",
          options: ["Goal = 6 months of your gross salary", "Goal = 3-6 months of your ESSENTIAL survival expenses", "Goal = Fixed ₹5 Lakhs for everyone in India", "Goal = The amount of your credit card limit"],
          answer: 1
        },
        {
          question: "Where is the POOREST place to keep your emergency fund?",
          options: ["A high-interest savings account", "A 'Sweep-in' Fixed Deposit", "The stock market or equity-linked funds", "A liquid mutual fund"],
          answer: 2
        },
        {
          question: "When should you build a 'Starter Fund' of ₹25,000?",
          options: ["Only after you are 100% debt-free", "As your very first step, even before aggressively paying off 30% interest debt", "After buying your first house", "Never; ₹25,000 is too small to matter"],
          answer: 1
        },
        {
          question: "After using money from your emergency fund for a medical bill, what should you do?",
          options: ["Continue investing and spending as usual", "Refill the fund as your #1 financial priority before doing any other investing or fancy spending", "Take a loan to replace the money", "Forget about it; the money did its job"],
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

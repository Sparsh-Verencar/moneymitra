export interface Concept {
  id: number;
  title: string;
  content: string;
  keyPoints?: string[];
  realWorldExample?: string;
  commonMistakes?: string[];
  // Using any for complex nested templates provided in the data
  trackingTemplate?: any;
  goalTrackingSheet?: any;
  incomeCalculator?: any;
  expenseEstimationTemplate?: any;
}

export interface Subtopic {
  id: number;
  title: string;
  description: string; // Added to match data
  concepts: Concept[];
}

export interface Topic {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
  overview?: string; // Added to match data
  importance?: string; // Added to match data
  subtopics: Subtopic[];
}

export const topics: Topic[] = [
  {
    id: 1,
    title: 'Personal Budgeting',
    icon: '📊',
    color: '#D4A574',
    description: 'Master the fundamentals of managing your money',
    overview:
      "Personal budgeting is the process of creating a plan for how you will spend your money. It's like a roadmap that tells you where your money comes from and where it goes. A good budget helps you control your spending, save for goals, and build wealth over time.\n\nIt is not about restricting your life—it is about making sure your money is working for you, not disappearing without your knowledge.",
    importance:
      'Without a budget, most people spend money without thinking about it. This leads to overspending, debt, and stress. A budget gives you control and helps you achieve financial goals like buying a house, saving for vacation, or retiring comfortably.\n\nEven small improvements in budgeting can create big long-term results due to consistent savings and better financial habits.',

    subtopics: [
      {
        id: 1,
        title: 'Budget Basics',
        description:
          'Understanding the fundamentals of budgeting and why it matters',
        concepts: [
          {
            id: 1,
            title: 'What is a Budget?',
            content:
              "A budget is a written plan that shows how much money you expect to earn and spend over a period of time, usually monthly or yearly. Think of it as a detailed receipt book that you create BEFORE you spend money, not after.\n\nExample: If you earn ₹50,000 per month, a budget would break it down like this:\n- Rent: ₹12,500\n- Food: ₹5,000\n- Transport: ₹2,500\n- Entertainment: ₹3,000\n- Savings: ₹10,000\n- Other: ₹16,000\n\nWhy it matters: Most people don't know where their money goes each month. They think 'I earned ₹50,000 but where did it all go?' A budget answers this question before you spend.\n\nA budget also helps you make intentional decisions instead of emotional spending decisions.",
            keyPoints: [
              'Budget = Income - Expenses',
              "It's a plan made BEFORE spending, not a record of past spending",
              'Usually created for 1 month or 1 year',
              'Helps you see where money is actually going',
              'Gives control over your financial decisions',
              'Prevents overspending and unnecessary debt',
            ],
            realWorldExample:
              'Raj earns ₹60,000/month but always runs out of money by the 25th. When he created a budget:\n- He discovered he was spending ₹15,000/month on food (eating out)\n- He was spending ₹8,000/month on subscriptions he never used\n- He had no money left for savings\n\nOnce he saw this budget, he reduced eating out and cancelled unused subscriptions, allowing him to save ₹8,000/month.',
          },
          {
            id: 2,
            title: 'The 50/30/20 Rule',
            content:
              'This is the simplest and most popular budgeting method. It divides your income into three categories:\n\n1. NEEDS (50%): Essential expenses like rent, food, bills\n2. WANTS (30%): Things you enjoy like dining out, entertainment\n3. SAVINGS (20%): Money for future goals and emergencies\n\nThis rule is flexible—it gives you a starting point, not a strict rule. You can adjust percentages based on your income and goals.',
            keyPoints: [
              '50% = NEEDS (must have)',
              '30% = WANTS (nice to have)',
              '20% = SAVINGS (future goals)',
              'Simple to remember and follow',
              'Can be adjusted based on lifestyle',
              'Helps balance enjoyment and responsibility',
            ],
            realWorldExample:
              'Priya earns ₹80,000/month: Needs: ₹40,000, Wants: ₹24,000, Savings: ₹16,000.\n\nIf she wants to save faster, she can reduce wants to ₹18,000 and increase savings to ₹22,000.',
            commonMistakes: [
              "Putting entertainment as a 'need'",
              'Not leaving room for wants (leads to burnout)',
              'Trying to save too aggressively too early',
              'Ignoring irregular expenses like repairs',
            ],
          },
          {
            id: 3,
            title: 'Tracking Expenses',
            content:
              'Tracking expenses means writing down or recording everything you spend money on. This is the most important habit for successful budgeting.\n\nMost people underestimate how much they spend. Small expenses like coffee, snacks, or online purchases add up quickly.\n\nTracking helps you identify patterns and areas where you can cut unnecessary spending.',
            keyPoints: [
              'Record EVERY expense, no matter how small',
              'Categorize spending for clarity',
              'Review weekly to stay on track',
              'Use apps or notebooks—whatever works for you',
              'Small daily expenses add up significantly',
              'Tracking creates awareness and discipline',
            ],
            trackingTemplate: {
              categories: [
                'Food & Groceries',
                'Transport',
                'Entertainment',
                'Utilities',
              ],
              dailyExample: {
                date: '2024-01-15',
                transactions: [
                  { category: 'Food', amount: 150, description: 'Coffee' },
                ],
              },
            },
          },
        ],
      },

      {
        id: 2,
        title: 'Budget Planning',
        description:
          'Creating and implementing a budget tailored to your situation',
        concepts: [
          {
            id: 4,
            title: 'Setting Financial Goals',
            content:
              'A financial goal is something you want to achieve with money in the future. Without goals, budgeting feels meaningless.\n\nGoals can be short-term (buying a phone), medium-term (buying a car), or long-term (retirement).\n\nClear goals give direction to your spending and saving decisions.',
            keyPoints: [
              'Goals give purpose to your money',
              'Use SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound)',
              'Divide goals into short, medium, long-term',
              'Review goals regularly and adjust',
              'Write down goals to stay committed',
            ],
            goalTrackingSheet: {
              goals: [
                {
                  name: 'Emergency Fund',
                  targetAmount: 100000,
                  currentAmount: 45000,
                },
              ],
            },
          },
          {
            id: 5,
            title: 'Income Assessment',
            content:
              'Income assessment means calculating how much money you actually have available each month after taxes and deductions.\n\nMany people make the mistake of budgeting based on their gross salary instead of their take-home salary.\n\nYou should also include additional income sources like freelancing, rent, or bonuses.',
            keyPoints: [
              'Always use net (take-home) income',
              'Include all income sources',
              'Be realistic and conservative',
              'Account for variable income carefully',
              'Avoid overestimating your income',
            ],
            incomeCalculator: {
              salaryIncome: { gross: 80000, net: 68800 },
              totalNetIncome: 76300,
            },
          },
          {
            id: 6,
            title: 'Expense Estimation',
            content:
              'Expense estimation means figuring out how much money you need for all your monthly expenses.\n\nExpenses are usually divided into fixed (rent, EMI) and variable (food, entertainment).\n\nAccurate estimation helps you avoid surprises and ensures your budget works in real life.',
            keyPoints: [
              'Separate fixed and variable expenses',
              'Always leave a buffer for unexpected costs',
              'Review past spending for accuracy',
              'Plan for irregular expenses (repairs, festivals)',
              'Avoid underestimating spending',
            ],
            expenseEstimationTemplate: {
              fixedExpenses: [{ category: 'Housing', subtotal: 17000 }],
              estimatedTotal: 32500,
            },
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: 'Investing Fundamentals',
    icon: '📈',
    color: '#D4A574',
    description: 'Learn how to make your hard-earned money work for you.',
    overview:
      "Investing is the act of putting your money into things that have the potential to grow over time. While saving is about keeping your money safe, investing is about building wealth so you can meet your future goals, like retirement or a child's wedding, without just relying on your monthly salary.",
    importance:
      'If you keep all your money in a cupboard, it actually loses value because prices of milk, petrol, and rent go up every year. Investing helps your money grow faster than these rising prices, ensuring your future stays comfortable.',
    subtopics: [
      {
        id: 1,
        title: 'The Starting Point',
        description:
          'Understanding the difference between just saving and actually growing your wealth.',
        concepts: [
          {
            id: 1,
            title: 'Saving vs. Investing',
            content:
              'Saving is like keeping seeds in a box; they are safe, but they will never become trees. Investing is like planting those seeds in fertile soil. It involves a bit of patience and a small amount of risk, but it is the only way to grow wealth over time.\n\nMost Indian families are great at saving (putting money in a piggy bank or a savings account), but saving alone is not enough to build wealth. The money grows very slowly and often fails to keep up with rising prices.\n\nInvesting allows your money to grow through returns such as interest, dividends, or market appreciation. Over long periods, this difference becomes very large.\n\nThe goal is not to stop saving, but to use saving as the foundation and investing as the growth engine.',
            keyPoints: [
              'Saving is for short-term needs (buying a phone next month).',
              'Investing is for long-term goals (retirement, wealth creation).',
              'Savings are low risk but low growth.',
              'Investments offer higher growth but come with some risk.',
              'Both saving and investing are necessary for financial stability.',
              'Always build savings first before investing.',
            ],
            realWorldExample:
              'Ramesh saves ₹10,000 in a box. After 5 years, he still has ₹10,000. Suresh invests ₹10,000 in a simple investment. After 5 years, it becomes ₹14,000–₹16,000. Over 20 years, the difference becomes much larger, allowing Suresh to afford much more.',
          },
          {
            id: 2,
            title: 'Inflation: The Silent Money Eater',
            content:
              'Inflation is the steady increase in the price of goods and services over time. It means that the same amount of money buys fewer things in the future.\n\nEven if your money stays the same in your bank account, its value is slowly decreasing because prices keep rising.\n\nIn India, inflation is usually around 5–7% per year. If your money is growing slower than this, you are actually losing value in real terms.\n\nThis is why investing is important—to make sure your money grows faster than inflation.',
            keyPoints: [
              'Inflation reduces purchasing power over time.',
              'Money that is not growing is effectively losing value.',
              'Goal of investing is to beat inflation.',
              'Fixed Deposits often barely match inflation.',
              'Real wealth growth = returns minus inflation.',
            ],
            realWorldExample:
              'In 1990, ₹100 could buy a full week of groceries. Today, ₹100 might only buy a few basic items. If money is not invested, it loses value over time.',
          },
          {
            id: 3,
            title: 'Why Saving Alone is Not Enough',
            content:
              'Many people believe that saving money is enough to secure their future. While saving is important, it does not help your money grow significantly.\n\nIf you only save money in low-interest accounts, your wealth will not increase meaningfully, especially after adjusting for inflation.\n\nTo build real wealth, you must combine saving with investing. Saving protects your money, while investing grows it.',
            keyPoints: [
              'Saving protects money but does not grow it much.',
              'Inflation reduces the value of saved money.',
              'Investing helps your money grow over time.',
              'Balance between saving and investing is important.',
            ],
          },
          {
            id: 4,
            title: 'Short-Term vs Long-Term Thinking',
            content:
              'Understanding the difference between short-term and long-term goals is key to managing money properly.\n\nShort-term goals include things you want in the next 1–2 years, like buying a phone or going on a trip. These should be handled through savings.\n\nLong-term goals like retirement, buying a house, or building wealth require investing, because they need growth over time.',
            keyPoints: [
              'Short-term goals → use savings.',
              'Long-term goals → use investments.',
              'Do not invest money you may need soon.',
              'Time horizon determines your financial strategy.',
            ],
            realWorldExample:
              'Saving for a vacation next year should be done in a savings account. Saving for retirement 25 years later should be done through investments like mutual funds.',
          },
          {
            id: 5,
            title: 'The First Step: Financial Awareness',
            content:
              'The most important first step in your financial journey is awareness—understanding where your money comes from and where it goes.\n\nMany people earn well but still struggle financially because they are not aware of their spending habits.\n\nOnce you understand your income, expenses, and savings, you can make better decisions about investing and growing your wealth.',
            keyPoints: [
              'Track your income and expenses.',
              'Understand your spending habits.',
              'Awareness leads to better financial decisions.',
              'Small changes can create big long-term impact.',
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'The Magic of Growth',
        description:
          'How small amounts of money turn into large fortunes over time.',
        concepts: [
          {
            id: 3,
            title: 'Power of Compounding',
            content:
              "Compounding is what happens when you earn interest on your interest. It is like a snowball rolling down a hill—it starts small, but as it picks up more snow (interest), it grows much faster.\n\nIn the beginning, compounding feels slow and almost invisible. But after a few years, the growth becomes exponential, meaning your money starts increasing faster without you adding much more.\n\nIn India, we often call this the '8th Wonder of the World'. The secret ingredient to compounding isn't a lot of money; it's a lot of TIME. The earlier you start, the more powerful compounding becomes.",
            keyPoints: [
              "Don't withdraw your profits; let them reinvest.",
              'Starting 5 years earlier can result in double the final amount.',
              'Small, consistent amounts (SIPs) beat large, one-time amounts over time.',
              'Time is more important than how much you invest.',
              'Consistency builds stronger results than timing the market.',
            ],
            realWorldExample:
              'Two friends, Anil and Sunil. Anil starts investing ₹5,000 a month at age 25. Sunil starts at age 35. By the time they are 60, Anil will have nearly triple the money Sunil has, simply because he gave his money 10 more years to grow.',
          },
          {
            id: 4,
            title: 'Time vs Timing the Market',
            content:
              "Many beginners try to wait for the 'perfect time' to invest, thinking they can buy at the lowest price and sell at the highest.\n\nIn reality, this is very difficult even for experts. Instead of trying to time the market, successful investors focus on spending more time in the market.\n\nThe longer your money stays invested, the more it benefits from compounding and market growth.",
            keyPoints: [
              'Time in the market beats timing the market.',
              'Regular investing reduces risk of bad timing.',
              'Missing a few good market days can reduce returns significantly.',
              'Consistency is more important than perfection.',
            ],
          },
          {
            id: 5,
            title: 'Consistency Over Perfection',
            content:
              'You don’t need to invest a large amount to build wealth. What matters more is consistency—investing regularly without breaks.\n\nEven small monthly investments can grow into large amounts over time due to compounding.\n\nMany people fail not because they don’t earn enough, but because they don’t invest consistently.',
            keyPoints: [
              'Regular investing builds discipline.',
              'Even ₹500/month can grow significantly over time.',
              'Skipping investments breaks compounding momentum.',
              'Consistency reduces emotional decision-making.',
            ],
            realWorldExample:
              'Investing ₹2,000 every month for 20 years can grow into lakhs, even though each individual amount is small.',
          },
          {
            id: 6,
            title: 'The Effect of Delays',
            content:
              'Delaying investments has a huge impact on your final wealth. Even a delay of a few years can reduce your final amount significantly.\n\nThis happens because you lose valuable compounding time.\n\nThe earlier you start, the less effort you need later.',
            keyPoints: [
              'Starting late means you need to invest more to catch up.',
              'Early investors benefit the most from compounding.',
              'Time lost cannot be recovered.',
              'Start small, but start early.',
            ],
            realWorldExample:
              'If one person starts investing at 25 and another at 35, the second person may need to invest almost double monthly to reach the same final amount.',
          },
        ],
      },
      {
        id: 3,
        title: 'Where to Invest in India',
        description:
          'A simple guide to the most common ways Indians grow their money.',
        concepts: [
          {
            id: 4,
            title: 'Gold: The Traditional Favorite',
            content:
              "For generations, Indians have trusted gold. While jewelry is beautiful, it often involves 'making charges' that you lose when you sell. To invest in gold today, you can use 'Sovereign Gold Bonds' (SGBs) issued by the government. You get the growth of gold prices PLUS a small extra interest every year, with no storage worries.",
            keyPoints: [
              'Jewelry is a lifestyle choice; Gold Bonds are an investment choice.',
              'SGBs are safe as they are backed by the Government of India.',
              'No tension of locker theft or purity checks.',
            ],
          },
          {
            id: 5,
            title: 'Mutual Funds & SIPs',
            content:
              "A Mutual Fund is like a 'Potluck Lunch'. Many people (investors) bring a small amount of money, and a professional chef (Fund Manager) uses that money to buy a huge variety of stocks and bonds. A 'Systematic Investment Plan' (SIP) is just a way to put a fixed amount into these funds every month automatically—like a monthly committee or bishi.",
            keyPoints: [
              "You don't need to be an expert; the manager handles it.",
              'You can start with as little as ₹500.',
              'It spreads your risk across many different companies.',
            ],
            commonMistakes: [
              "Stopping your SIP when thet goes down (that's actually the best time to buy!)",
              "Trying to pick 'the best' fund every month.",
            ],
          },
        ],
      },
      {
        id: 4,
        title: 'Risk & Safety',
        description:
          'Balancing your desire for growth with your need for security.',
        concepts: [
          {
            id: 6,
            title: 'The Risk-Return Seesaw',
            content:
              'In the world of money, higher returns usually come with higher risk. Think of it like travel: Walking is very safe but very slow. A car is faster but has some risk. A plane is the fastest but requires the most trust. You need a mix of all three to get to your destination safely and on time.',
            keyPoints: [
              'Safe: PPF, FD, Government Bonds (Slow but steady).',
              'Moderate: Hybrid Mutual Funds (A mix of safety and speed).',
              'High: Direct Stocks (Fast but can be bumpy).',
            ],
          },
          {
            id: 7,
            title: 'Diversification: The Golden Rule',
            content:
              "This is a fancy word for a simple idea: 'Don't put all your eggs in one basket.' If you put all your money in one company and that company fails, you lose everything. If you spread your money across gold, bank deposits, and mutual funds, you are protected even if one of them performs poorly.",
            keyPoints: [
              'Mix different types of investments.',
              'Protects you from total loss.',
              'Helps you sleep better at night.',
            ],
            realWorldExample:
              'If a farmer only grows onions and the onion price crashes, he is in trouble. If he grows onions, wheat, and keeps cows for milk, he will be okay even if one crop fails.',
          },
        ],
      },
      {
        id: 5,
        title: 'Starting Your Journey',
        description:
          'Practical steps to take today to begin your investment life.',
        concepts: [
          {
            id: 8,
            title: 'The Emergency Fund First',
            content:
              "Before you buy your first stock or gold bond, you must have an 'Emergency Fund'. This is money kept in a simple bank account that you only touch for true emergencies (hospital bills, job loss). It should be enough to cover 6 months of your household expenses.",
            keyPoints: [
              "Don't invest money you might need next month.",
              'Safety first, growth second.',
              'Keeps you from having to sell your investments at a loss during a crisis.',
            ],
          },
          {
            id: 9,
            title: 'KYC and the Demat Account',
            content:
              "To invest in modern India, you need three things: A bank account, a PAN card, and 'KYC' (Know Your Customer) verification. A Demat account is like a digital cupboard where your investments are kept safely. It's much safer than keeping paper certificates in a file.",
            keyPoints: [
              'KYC is a one-time process to prove your identity.',
              'Everything is digital and linked to your Aadhar/PAN.',
              'Extremely secure and easy to track on your phone.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Taxing & Savings',
    icon: '🏦',
    color: '#D4A574',
    description:
      'Understand how to keep more of what you earn through smart, legal planning.',
    overview:
      "Taxes are the contribution we make to the country's development, but the government also provides many **legal paths** to reduce this burden if you save for your future. Tax planning is simply the art of arranging your money so that you pay the right amount of tax while maximizing your family's savings. It is not about avoiding tax—it is about using the rules smartly.",
    importance:
      "Many people in India pay more tax than they need to simply because they don't understand the rules. By learning a few simple sections of the tax law, you can save thousands of rupees every year—money that could go toward your children's education or your own retirement. Smart tax planning is one of the easiest ways to increase your effective income without earning more.",

    subtopics: [
      {
        id: 1,
        title: 'Tax Basics for Families',
        description:
          'Breaking down how the government calculates what you owe.',
        concepts: [
          {
            id: 1,
            title: 'Income Tax Slabs',
            content:
              "In **India**, tax isn't a flat rate for everyone. It works like a 'stepped ladder'. You don't pay any tax on your initial earnings (up to a certain limit). As you climb higher and earn more, only the 'extra' money is taxed at a higher rate.\n\nThis means even if you enter a higher tax bracket, your entire income is NOT taxed at that rate—only the portion above that level is. This system protects lower-income earners and ensures fairness.",
            keyPoints: [
              'Exemption Limit: The amount you can earn before paying any tax.',
              'Progressive Tax: Higher earners pay more only on higher portions.',
              'Crossing a slab does NOT increase tax on your full income.',
              'Old vs. New Regime: Choose whichever saves you more tax.',
            ],
            realWorldExample:
              'If you earn ₹8 lakh, only the income above ₹5 lakh is taxed at higher rates. Your first ₹5 lakh still gets lower or zero tax benefits.',
          },
          {
            id: 2,
            title: 'Direct vs. Indirect Tax',
            content:
              'There are two ways the government collects money. Direct Tax is what you pay on your income (like salary or business profit). Indirect Tax is what you pay when you buy goods and services (GST).\n\nYou cannot avoid GST—it is included in prices. But you can legally reduce your income tax through smart planning and investments.',
            keyPoints: [
              'Income Tax is based on your earnings.',
              'GST is included in everything you buy.',
              'Tax planning focuses mainly on Direct Tax.',
              'You control income tax, not GST.',
            ],
          },
          {
            id: 3,
            title: 'Old vs. New Tax Regime',
            content:
              'The government gives you two ways to calculate tax: the Old Regime and the New Regime.\n\nThe Old Regime allows you to claim deductions like 80C, 80D, etc., while the New Regime has lower tax rates but removes most deductions.\n\nChoosing the right one depends on how much you invest and save.',
            keyPoints: [
              'Old Regime = More deductions, higher rates.',
              'New Regime = Lower rates, fewer deductions.',
              'People with investments benefit more from old regime.',
              'Always compare both before filing.',
            ],
          },
          {
            id: 4,
            title: 'What is Taxable Income?',
            content:
              'Your taxable income is not your full salary. It is the amount left after subtracting deductions and exemptions from your total income.\n\nThis is the number on which the government calculates your final tax.',
            keyPoints: [
              'Total Income – Deductions = Taxable Income.',
              'Lower taxable income = lower tax.',
              '80C, 80D reduce taxable income.',
              'Important for all tax calculations.',
            ],
          },
          {
            id: 5,
            title: 'Standard Deduction',
            content:
              'A standard deduction is a fixed amount that salaried individuals can subtract from their income without any investment.\n\nThis means you automatically reduce your taxable income even before applying other deductions.',
            keyPoints: [
              'Available for salaried individuals.',
              'No proof or investment required.',
              'Reduces taxable income directly.',
              'Applies in both tax regimes (with limits).',
            ],
          },
          {
            id: 6,
            title: 'TDS (Tax Deducted at Source)',
            content:
              'TDS is the tax that is automatically deducted from your salary, bank interest, or payments before you receive the money.\n\nIt ensures that tax is collected in advance instead of waiting till the end of the year.',
            keyPoints: [
              'Deducted by employer or bank.',
              'Reduces final tax burden at year end.',
              'Can result in refund if excess is deducted.',
              'Shown in Form 16 or bank statements.',
            ],
          },
          {
            id: 7,
            title: 'Why Tax Planning Matters',
            content:
              'Tax planning helps you legally reduce your tax burden while building savings. Without planning, you may end up paying more tax than necessary.\n\nIt is one of the simplest ways to increase your effective income without earning more.',
            keyPoints: [
              'Helps save money legally.',
              'Encourages disciplined investing.',
              'Prevents last-minute financial stress.',
              'Improves long-term financial health.',
            ],
          },
        ],
      },

      {
        id: 2,
        title: "The 'Golden' Section 80C",
        description:
          'The most popular way for Indians to save tax and build wealth simultaneously.',
        concepts: [
          {
            id: 3,
            title: 'What is Section 80C?',
            content:
              "This is the most famous rule in Indian tax law. It allows you to reduce your 'taxable income' by up to ₹1.5 Lakh every year.\n\nIf you earn ₹8 Lakh and invest ₹1.5 Lakh in 80C options, the government will calculate your tax as if you only earned ₹6.5 Lakh. This is like getting a discount on your income for saving money.\n\nIt rewards disciplined financial behavior.",
            keyPoints: [
              'Maximum Limit: ₹1,50,000 per year.',
              'Reduces taxable income, not tax directly.',
              'Applies only in the old tax regime.',
              'Encourages long-term savings habits.',
            ],
            commonMistakes: [
              'Investing more than ₹1.5 Lakh expecting extra benefit.',
              'Last-minute investing without planning.',
              'Choosing wrong investment just for tax saving.',
            ],
          },
          {
            id: 4,
            title: '80C Investment Options',
            content:
              'The government gives you a menu of where to invest under 80C. Each option has a different purpose—some are safe, some grow faster.\n\n1. PPF: Safe, long-term (15 years).\n2. ELSS:t-linked, higher returns.\n3. Life Insurance: Protection + tax saving.\n4. Tuition Fees: Already part of your expenses.\n\nThe key is to choose based on your goals, not just tax saving.',
            keyPoints: [
              'PPF is best for stability and safety.',
              'ELSS has highest growth potential.',
              'Diversify instead of putting all money in one option.',
              'Match investment with your goals (not just tax saving).',
            ],
          },
        ],
      },

      {
        id: 3,
        title: 'Retirement & Security Savings',
        description: 'Special government schemes designed for your old age.',
        concepts: [
          {
            id: 5,
            title: 'NPS (National Pension System)',
            content:
              'The NPS is a long-term retirement plan where you invest during your working life and receive a pension later. It also gives an extra tax benefit of ₹50,000 beyond 80C.\n\nThis makes it one of the most powerful tools for tax saving + retirement planning together.',
            keyPoints: [
              'Extra deduction under Section 80CCD(1B).',
              'Low-cost investment option.',
              'Provides pension after retirement.',
              'Encourages disciplined long-term savings.',
            ],
          },
          {
            id: 6,
            title: 'EPF (Employee Provident Fund)',
            content:
              'EPF is a forced savings system for salaried employees. Both you and your employer contribute every month.\n\nOver time, this becomes a large retirement corpus that is tax-free if conditions are met.',
            keyPoints: [
              'Employer contribution doubles your savings.',
              'Safe and government-backed.',
              'Long-term compounding benefit.',
              'Tax-free after 5 years of continuous service.',
            ],
          },
        ],
      },

      {
        id: 4,
        title: 'Health & Home Benefits',
        description: 'How your basic needs can help you reduce your tax bill.',
        concepts: [
          {
            id: 7,
            title: 'Section 80D: Health Insurance',
            content:
              'Paying health insurance premiums gives tax benefits. You can save up to ₹25,000 for yourself and family, and ₹50,000 for senior citizen parents.\n\nThis means you are protecting your health AND saving tax at the same time.',
            keyPoints: [
              'Higher deduction for senior citizens.',
              'Includes preventive health check-ups.',
              'Must be paid digitally.',
              'Encourages financial responsibility.',
            ],
          },
          {
            id: 8,
            title: 'Home Loan Benefits',
            content:
              'A home loan gives you multiple tax benefits. You can claim deduction on both interest and principal.\n\nInterest (Section 24) up to ₹2 lakh and principal under 80C. This significantly reduces your tax burden and makes buying a home more affordable.',
            keyPoints: [
              'Interest deduction up to ₹2 lakh.',
              'Principal falls under 80C.',
              'Available only for completed property.',
              'Major benefit for long-term wealth building.',
            ],
          },
        ],
      },

      {
        id: 5,
        title: 'The Annual Habit',
        description: 'How to stay organized so tax season is never stressful.',
        concepts: [
          {
            id: 9,
            title: 'Income Tax Returns (ITR)',
            content:
              "Filing your ITR is your 'financial report card' submitted to the government.\n\nIt shows your income, tax paid, and deductions claimed. Even if your tax is zero, filing ITR is useful for loans, visas, and financial credibility.",
            keyPoints: [
              'Deadline is usually July 31.',
              'TDS is tax already deducted.',
              'Refund comes if excess tax is paid.',
              'Important for loans and visa applications.',
            ],
          },
          {
            id: 10,
            title: 'Choosing the Correct ITR Form',
            content:
              'Different types of taxpayers need to file different ITR forms depending on their income sources.\n\nFor example, salaried individuals usually file ITR-1, while those with capital gains or business income may need ITR-2 or ITR-3.',
            keyPoints: [
              'ITR-1 for salaried individuals (simple income).',
              'ITR-2 for capital gains or multiple income sources.',
              'ITR-3 for business/professional income.',
              'Filing the wrong form can lead to rejection.',
            ],
          },
          {
            id: 11,
            title: 'Form 16 & AIS (Annual Information Statement)',
            content:
              'Form 16 is provided by your employer and summarizes your salary and TDS.\n\nAIS is a comprehensive statement from the tax department showing all your financial transactions like interest, dividends, and investments.',
            keyPoints: [
              'Form 16 helps in easy filing.',
              'AIS shows all reported financial activities.',
              'Mismatch between AIS and your ITR can cause issues.',
              'Always cross-check before filing.',
            ],
          },
          {
            id: 12,
            title: 'Deductions & Tax Saving Proofs',
            content:
              'To reduce your taxable income, you must claim deductions and provide proof when required.\n\nThese include investments, insurance, and certain expenses.',
            keyPoints: [
              'Section 80C covers ELSS, PPF, LIC, etc.',
              '80D for health insurance premiums.',
              'Home loan interest under Section 24.',
              'Keep all receipts and proofs organized.',
            ],
          },
          {
            id: 13,
            title: 'Advance Tax & Self-Assessment Tax',
            content:
              'If your tax liability is high and not fully covered by TDS, you must pay advance tax in installments.\n\nAny remaining tax before filing is paid as self-assessment tax.',
            keyPoints: [
              'Advance tax applies if liability exceeds ₹10,000.',
              'Paid in quarterly installments.',
              'Avoids penalty under Sections 234B and 234C.',
              'Self-assessment tax clears final dues before filing.',
            ],
          },
          {
            id: 14,
            title: 'E-Verification of ITR',
            content:
              'After filing your ITR, it must be verified to complete the process.\n\nWithout verification, your return is considered invalid.',
            keyPoints: [
              'Can be done via Aadhaar OTP, net banking, or bank account.',
              'Must be completed within 30 days.',
              'No need to send physical documents if e-verified.',
              'Quick and mandatory final step.',
            ],
          },
          {
            id: 15,
            title: 'Tracking Refund & Status',
            content:
              'After filing and verification, you can track the status of your return and refund.\n\nRefunds are credited directly to your bank account if excess tax was paid.',
            keyPoints: [
              'Check status on the income tax portal.',
              'Refunds usually processed within weeks to months.',
              'Delays can happen due to mismatches or scrutiny.',
              'Ensure bank account is pre-validated.',
            ],
          },
          {
            id: 16,
            title: 'Maintaining Financial Records',
            content:
              'Keeping your financial documents organized throughout the year makes tax filing effortless.\n\nThis includes salary slips, investment proofs, bank statements, and invoices.',
            keyPoints: [
              'Maintain digital and physical copies.',
              'Organize by financial year.',
              'Track investments and expenses regularly.',
              'Reduces last-minute stress during filing.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Insurance Essentials',
    icon: '🛡️',
    color: '#D4A574',
    description:
      "Protect your family's future from life's unexpected surprises.",
    overview:
      "Insurance is like an umbrella. You don't buy it because you want it to rain; you buy it so that if it does rain, you and your family stay dry. It is a way to transfer your 'financial risk' to a big company so that a single accident or illness doesn't destroy your life's savings. Think of it as paying a small, fixed amount today to avoid a very large, unpredictable loss in the future.",
    importance:
      'In India, many families are just one medical bill away from poverty. Insurance acts as a safety net. It ensures that even in your absence, your children can finish school, your spouse can live with dignity, and your elderly parents receive the best medical care. Without insurance, even a single emergency can force families to sell assets, take loans, or depend on others.',
    subtopics: [
      {
        id: 1,
        title: 'Life Insurance: The Family Guard',
        description:
          "Ensuring your loved ones are financially safe, even if you aren't there.",
        concepts: [
          {
            id: 1,
            title: 'Term Insurance vs. Endowment',
            content:
              "There are two main types of life insurance in India. \n\n1. **Term Insurance**: This is 'Pure Protection'. It is very cheap and gives a massive payout (like ₹1 Crore) to your family if something happens to you. If you survive, you get nothing back. Think of it like a security guard's salary—you pay him to protect the house, not to return the money at the end of the year. The goal here is protection, not profit.\n\n2. **Endowment Plans**: These mix 'Saving' with 'Insurance'. They are much more expensive and give a small payout plus some 'returns' if you survive. However, the returns are usually low compared to other investment options like mutual funds. That’s why most experts suggest keeping insurance and investment separate—buy term insurance for protection and invest separately for growth.",
            keyPoints: [
              'Term Insurance is the most important for the breadwinner.',
              'Endowment plans often give lower returns than a simple bank FD.',
              'Buy Term Insurance as early as possible to lock in a low premium.',
              'Insurance should first protect your family, not act as an investment.',
            ],
            realWorldExample:
              'A 30-year-old can get ₹1 Crore cover for just ₹800-₹1000 a month with Term Insurance. An Endowment plan for the same cover might cost ₹50,000+ a month, while still giving lower returns than mutual funds.',
          },
          {
            id: 2,
            title: 'How Much Cover is Enough?',
            content:
              "A simple thumb rule in India is the '10X Rule'. Your life insurance cover (Sum Assured) should be at least 10 times your annual salary. This ensures that if the money is put in a safe investment like a bank FD or mutual fund, the returns can help replace your monthly income for your family.\n\nHowever, this is just a starting point. You should also consider your family's future expenses like children's education, marriage, and any ongoing loans.",
            keyPoints: [
              'Cover = (Annual Income × 10) + Outstanding Loans.',
              "Don't forget to include your home loan or car loan in the calculation.",
              'Review your cover every time you have a major life event (marriage, birth of a child).',
              'Higher responsibilities = higher insurance cover.',
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Health Insurance: The Hospital Shield',
        description: 'Protecting your savings from rising medical costs.',
        concepts: [
          {
            id: 3,
            title: 'Family Floater vs. Individual Plan',
            content:
              "Health insurance comes in two styles:\n\n1. **Family Floater**: One single policy covers the whole family (Husband, Wife, Children). The 'pool' of money is shared. If the limit is ₹10 Lakh, any member can use it. It is usually cheaper for young families because the risk is spread across members.\n\n2. **Individual Plan**: Each person has their own dedicated limit. This is highly recommended for elderly parents (60+) because they are more likely to need the full amount, and their health risks shouldn't affect the rest of the family's premium.\n\nChoosing the right type depends on your family structure and age group.",
            keyPoints: [
              'Floater plans are cost-effective for healthy, young families.',
              'Individual plans are better for seniors or those with chronic illnesses.',
              "Always check if 'Ayush' (Ayurveda/Homeopathy) is covered if your parents prefer those treatments.",
              'Mix of floater (for you) + individual (for parents) is often ideal.',
            ],
          },
          {
            id: 4,
            title: "The 'Fine Print' Basics",
            content:
              "Health insurance has specific terms you must know before buying:\n\n- **Waiting Period**: The time (usually 2-4 years) you must wait before the insurance covers pre-existing diseases like diabetes or BP.\n- **Network Hospitals**: Hospitals where you can get 'Cashless' treatment—meaning you don’t have to pay upfront.\n- **Copay**: A percentage of the bill (like 10% or 20%) that YOU must pay. Lower copay is better.\n\nUnderstanding these terms helps avoid surprises during emergencies.",
            keyPoints: [
              'Never hide health conditions when buying a policy.',
              "Check for 'Room Rent Capping'—it can increase your final bill.",
              'Restoration Benefit refills your coverage after usage.',
              'Always check hospital network near your home.',
            ],
          },
        ],
      },
      {
        id: 3,
        title: 'Motor & Asset Insurance',
        description: 'Protecting your vehicle and your home from accidents.',
        concepts: [
          {
            id: 5,
            title: 'Third-Party vs. Comprehensive',
            content:
              "In India, 'Third-Party' motor insurance is a legal requirement. It only pays for damage you cause to others (their car or their injury). It does NOT pay for your own car.\n\n'Comprehensive Insurance' covers everything—your car damage, theft, fire, natural disasters (like floods), and third-party liability. This is highly recommended for most vehicle owners, especially if the car is new or expensive.\n\nThink of third-party as minimum legal compliance, while comprehensive is full protection that saves you from large repair costs.",
            keyPoints: [
              'Third-Party is mandatory by law; Comprehensive gives full protection.',
              'IDV (Insured Declared Value) decides how much you get if the car is stolen.',
              'NCB (No Claim Bonus) gives discounts for safe driving.',
              'Comprehensive is strongly recommended for vehicles under 10 years.',
              'Natural disasters like floods are only covered in comprehensive plans.',
            ],
          },
          {
            id: 6,
            title: 'Personal Accident Cover',
            content:
              'This is a small but powerful add-on. If the owner-driver meets with an accident that leads to disability or death, the company pays a fixed amount (usually ₹15 Lakh).\n\nThis cover is important because normal motor insurance focuses on the vehicle, not the person. This ensures financial support for your family in case of serious accidents.\n\nEven if you are a safe driver, accidents can happen due to others on the road—this cover protects you from that risk.',
            keyPoints: [
              'Covers death, disability, or loss of limbs.',
              'Provides financial support to family.',
              'Works across India.',
              'Very low cost but very high value.',
              'Mandatory in many cases unless you already have separate cover.',
            ],
          },
          {
            id: 8,
            title: 'Zero Depreciation Cover',
            content:
              "In normal insurance claims, the company reduces the payout based on 'depreciation' (wear and tear of parts like plastic or rubber).\n\nZero Depreciation (Zero Dep) cover removes this deduction. This means the insurance company pays the full cost of replacing parts without reducing value due to age.\n\nThis is especially useful for new cars where repair costs can be very high.",
            keyPoints: [
              'No deduction for wear and tear.',
              'Best for cars less than 5 years old.',
              'Saves large out-of-pocket repair costs.',
              'Slightly higher premium but worth it.',
            ],
          },
          {
            id: 9,
            title: 'Home Insurance Basics',
            content:
              "Home insurance protects your house and belongings from risks like fire, theft, floods, earthquakes, and other damages.\n\nIt covers both the structure (walls, roof) and the contents (TV, furniture, electronics). Despite being very affordable in India, many people ignore it.\n\nIt ensures that even if something unexpected happens, you don't have to rebuild everything using your savings.",
            keyPoints: [
              'Covers both house structure and belongings.',
              'Very affordable compared to the protection it offers.',
              'Important in flood or earthquake-prone areas.',
              'Can include temporary accommodation costs.',
            ],
          },
        ],
      },
      {
        id: 4,
        title: 'Common Mistakes to Avoid',
        description:
          'How to ensure your claim is actually paid when you need it.',
        concepts: [
          {
            id: 7,
            title: "The 'Signature' Trap",
            content:
              'Never let an insurance agent fill your form and ask you to just sign. If incorrect information is submitted (like hiding BP or smoking habits), the insurance company can reject your claim later.\n\nAlways read and fill your own details carefully. Insurance works on trust—if that trust is broken, your protection disappears when you need it most.\n\nTaking a few extra minutes now can save your family from huge financial stress later.',
            keyPoints: [
              'Always fill your own form.',
              'Disclosure is more important than premium price.',
              'Double-check nominee details.',
              'Keep a digital copy of your policy for emergencies.',
              'Never hide medical history or habits.',
            ],
          },
          {
            id: 10,
            title: 'Ignoring Policy Terms',
            content:
              'Many people buy insurance without reading the terms and conditions. This leads to surprises during claims.\n\nImportant things like waiting period, exclusions, and coverage limits are written in the policy document.',
            keyPoints: [
              'Always read policy exclusions carefully.',
              'Check waiting period for diseases.',
              'Understand what is NOT covered.',
              'Ask questions before buying.',
            ],
          },
          {
            id: 11,
            title: 'Choosing Cheapest Policy',
            content:
              'Many people choose insurance only based on low premium. This can lead to poor coverage and claim rejection issues.\n\nA slightly higher premium with better coverage is always safer.',
            keyPoints: [
              'Cheap policies may have hidden limits.',
              'Check claim settlement ratio of company.',
              'Look at hospital network (for health insurance).',
              'Balance cost with coverage quality.',
            ],
          },
          {
            id: 12,
            title: 'Not Renewing on Time',
            content:
              'If you forget to renew your policy, you may lose important benefits like waiting period continuity and no-claim bonus.\n\nIn some cases, you may even lose coverage completely and need to start from scratch.',
            keyPoints: [
              'Always renew before expiry date.',
              'Set reminders or auto-pay.',
              'Late renewal may restart waiting period.',
              'Continuous coverage is very important.',
            ],
          },
          {
            id: 13,
            title: 'Not Informing Family',
            content:
              'Many people buy insurance but never tell their family about it. In emergencies, the family may not even know a policy exists.\n\nThis defeats the whole purpose of insurance.',
            keyPoints: [
              'Inform your nominee about the policy.',
              'Share policy details and documents.',
              'Keep contact details of insurer saved.',
              'Ensure easy access during emergencies.',
            ],
          },
        ],
      },
    ],
  },
];

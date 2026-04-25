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
        title: "Personal Budgeting",
        icon: "📊",
        color: "#D4A574",
        description: "Master the fundamentals of managing your money",
        overview: "Personal budgeting is the process of creating a plan for how you will spend your money. It's like a roadmap that tells you where your money comes from and where it goes. A good budget helps you control your spending, save for goals, and build wealth over time.",
        importance: "Without a budget, most people spend money without thinking about it. This leads to overspending, debt, and stress. A budget gives you control and helps you achieve financial goals like buying a house, saving for vacation, or retiring comfortably.",
        subtopics: [
            {
                id: 1,
                title: "Budget Basics",
                description: "Understanding the fundamentals of budgeting and why it matters",
                concepts: [
                    {
                        id: 1,
                        title: "What is a Budget?",
                        content: "A budget is a written plan that shows how much money you expect to earn and spend over a period of time, usually monthly or yearly. Think of it as a detailed receipt book that you create BEFORE you spend money, not after.\n\nExample: If you earn ₹50,000 per month, a budget would break it down like this:\n- Rent: ₹12,500\n- Food: ₹5,000\n- Transport: ₹2,500\n- Entertainment: ₹3,000\n- Savings: ₹10,000\n- Other: ₹16,000\n\nWhy it matters: Most people don't know where their money goes each month. They think 'I earned ₹50,000 but where did it all go?' A budget answers this question before you spend.",
                        keyPoints: [
                            "Budget = Income - Expenses",
                            "It's a plan made BEFORE spending, not a record of past spending",
                            "Usually created for 1 month or 1 year",
                            "Helps you see where money is actually going"
                        ],
                        realWorldExample: "Raj earns ₹60,000/month but always runs out of money by the 25th. When he created a budget:\n- He discovered he was spending ₹15,000/month on food (eating out)\n- He was spending ₹8,000/month on subscriptions he never used\n- He had no money left for savings\n\nOnce he saw this budget, he could make changes and save ₹8,000/month."
                    },
                    {
                        id: 2,
                        title: "The 50/30/20 Rule",
                        content: "This is the simplest and most popular budgeting method. It divides your income into three categories:\n\n1. NEEDS (50%): Essential expenses that you must pay\n2. WANTS (30%): Things you enjoy but don't need to survive\n3. SAVINGS (20%): Money you keep for the future",
                        keyPoints: [
                            "50% = NEEDS (must have)",
                            "30% = WANTS (nice to have)",
                            "20% = SAVINGS (future goals)",
                            "Simple to remember and follow"
                        ],
                        realWorldExample: "Priya earns ₹80,000/month: Needs: ₹40,000, Wants: ₹24,000, Savings: ₹16,000.",
                        commonMistakes: [
                            "Putting entertainment as a 'need'",
                            "Not leaving room for wants",
                            "Trying to save more than 20% too quickly"
                        ]
                    },
                    {
                        id: 3,
                        title: "Tracking Expenses",
                        content: "Tracking expenses means writing down or recording everything you spend money on. This is the most important habit for successful budgeting.",
                        keyPoints: [
                            "Record EVERY expense, no matter how small",
                            "Categorize spending",
                            "Review weekly to stay on track"
                        ],
                        trackingTemplate: { 
                            categories: ["Food & Groceries", "Transport", "Entertainment", "Utilities"], 
                            dailyExample: { 
                                date: "2024-01-15", 
                                transactions: [
                                    { category: "Food", amount: 150, description: "Coffee" }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                id: 2,
                title: "Budget Planning",
                description: "Creating and implementing a budget tailored to your situation",
                concepts: [
                    {
                        id: 4,
                        title: "Setting Financial Goals",
                        content: "A financial goal is something you want to achieve with money in the future.",
                        keyPoints: ["Goals give purpose", "Use SMART framework", "Review quarterly"],
                        goalTrackingSheet: { 
                            goals: [
                                { name: "Emergency Fund", targetAmount: 100000, currentAmount: 45000 }
                            ]
                        }
                    },
                    {
                        id: 5,
                        title: "Income Assessment",
                        content: "Income assessment means calculating how much money you actually have to spend and save each month.",
                        incomeCalculator: { 
                            salaryIncome: { gross: 80000, net: 68800 },
                            totalNetIncome: 76300
                        }
                    },
                    {
                        id: 6,
                        title: "Expense Estimation",
                        content: "Expense estimation means figuring out how much money you'll need to spend each month.",
                        expenseEstimationTemplate: { 
                            fixedExpenses: [{ category: "Housing", subtotal: 17000 }],
                            estimatedTotal: 32500
                        }
                    }
                ]
            }
        ]
    },

   {
    id: 2,
    title: "Investing Fundamentals",
    icon: "📈",
    color: "#D4A574",
    description: "Learn how to make your hard-earned money work for you.",
    overview: "Investing is the act of putting your money into things that have the potential to grow over time. While saving is about keeping your money safe, investing is about building wealth so you can meet your future goals, like retirement or a child's wedding, without just relying on your monthly salary.",
    importance: "If you keep all your money in a cupboard, it actually loses value because prices of milk, petrol, and rent go up every year. Investing helps your money grow faster than these rising prices, ensuring your future stays comfortable.",
    subtopics: [
        {
            id: 1,
            title: "The Starting Point",
            description: "Understanding the difference between just saving and actually growing your wealth.",
            concepts: [
                {
                    id: 1,
                    title: "Saving vs. Investing",
                    content: "Saving is like keeping seeds in a box; they are safe, but they will never become trees. Investing is like planting those seeds in fertile soil. It involves a bit of patience and a tiny bit of risk, but it is the only way to get a harvest.\n\nMost Indian families are great at saving (putting money in a piggy bank or a zero-interest savings account), but to beat rising prices, you must move from being a 'saver' to an 'investor'.",
                    keyPoints: [
                        "Saving is for short-term needs (buying a phone next month).",
                        "Investing is for long-term dreams (retirement in 20 years).",
                        "Savings accounts offer low growth; investments offer higher potential."
                    ],
                    realWorldExample: "Ramesh saves ₹10,000 in a box. After 5 years, he still has ₹10,000. Suresh invests ₹10,000 in a safe government scheme. After 5 years, Suresh has ₹14,000. Suresh can now buy more than Ramesh can."
                },
                {
                    id: 2,
                    title: "Inflation: The Silent Money Eater",
                    content: "Inflation is the reason why a movie ticket that cost ₹20 thirty years ago now costs ₹250. It is the steady increase in the price of goods and services. If your money is not growing at a rate higher than inflation (usually 6-7% in India), you are actually becoming poorer every day, even if your bank balance stays the same.",
                    keyPoints: [
                        "Inflation reduces your 'purchasing power'.",
                        "The goal of investing is to 'Beat Inflation'.",
                        "Fixed Deposits often only just match inflation; you need more for true growth."
                    ],
                    realWorldExample: "In 1990, ₹100 could buy a full week of groceries. Today, ₹100 might only buy a liter of milk and some bread. If you hid ₹100 in 1990 and took it out today, it has 'shrunk' in value."
                }
            ]
        },
        {
            id: 2,
            title: "The Magic of Growth",
            description: "How small amounts of money turn into large fortunes over time.",
            concepts: [
                {
                    id: 3,
                    title: "Power of Compounding",
                    content: "Compounding is what happens when you earn interest on your interest. It is like a snowball rolling down a hill—it starts small, but as it picks up more snow (interest), it grows much faster. In India, we often call this the '8th Wonder of the World'. The secret ingredient to compounding isn't a lot of money; it's a lot of TIME.",
                    keyPoints: [
                        "Don't withdraw your profits; let them reinvest.",
                        "Starting 5 years earlier can result in double the final amount.",
                        "Small, consistent amounts (SIPs) beat large, one-time amounts over time."
                    ],
                    realWorldExample: "Two friends, Anil and Sunil. Anil starts investing ₹5,000 a month at age 25. Sunil starts at age 35. By the time they are 60, Anil will have nearly triple the money Sunil has, simply because he gave his money 10 more years to grow."
                }
            ]
        },
        {
            id: 3,
            title: "Where to Invest in India",
            description: "A simple guide to the most common ways Indians grow their money.",
            concepts: [
                {
                    id: 4,
                    title: "Gold: The Traditional Favorite",
                    content: "For generations, Indians have trusted gold. While jewelry is beautiful, it often involves 'making charges' that you lose when you sell. To invest in gold today, you can use 'Sovereign Gold Bonds' (SGBs) issued by the government. You get the growth of gold prices PLUS a small extra interest every year, with no storage worries.",
                    keyPoints: [
                        "Jewelry is a lifestyle choice; Gold Bonds are an investment choice.",
                        "SGBs are safe as they are backed by the Government of India.",
                        "No tension of locker theft or purity checks."
                    ]
                },
                {
                    id: 5,
                    title: "Mutual Funds & SIPs",
                    content: "A Mutual Fund is like a 'Potluck Lunch'. Many people (investors) bring a small amount of money, and a professional chef (Fund Manager) uses that money to buy a huge variety of stocks and bonds. A 'Systematic Investment Plan' (SIP) is just a way to put a fixed amount into these funds every month automatically—like a monthly committee or bishi.",
                    keyPoints: [
                        "You don't need to be an expert; the manager handles it.",
                        "You can start with as little as ₹500.",
                        "It spreads your risk across many different companies."
                    ],
                    commonMistakes: [
                        "Stopping your SIP when the market goes down (that's actually the best time to buy!)",
                        "Trying to pick 'the best' fund every month."
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "Risk & Safety",
            description: "Balancing your desire for growth with your need for security.",
            concepts: [
                {
                    id: 6,
                    title: "The Risk-Return Seesaw",
                    content: "In the world of money, higher returns usually come with higher risk. Think of it like travel: Walking is very safe but very slow. A car is faster but has some risk. A plane is the fastest but requires the most trust. You need a mix of all three to get to your destination safely and on time.",
                    keyPoints: [
                        "Safe: PPF, FD, Government Bonds (Slow but steady).",
                        "Moderate: Hybrid Mutual Funds (A mix of safety and speed).",
                        "High: Direct Stocks (Fast but can be bumpy)."
                    ]
                },
                {
                    id: 7,
                    title: "Diversification: The Golden Rule",
                    content: "This is a fancy word for a simple idea: 'Don't put all your eggs in one basket.' If you put all your money in one company and that company fails, you lose everything. If you spread your money across gold, bank deposits, and mutual funds, you are protected even if one of them performs poorly.",
                    keyPoints: [
                        "Mix different types of investments.",
                        "Protects you from total loss.",
                        "Helps you sleep better at night."
                    ],
                    realWorldExample: "If a farmer only grows onions and the onion price crashes, he is in trouble. If he grows onions, wheat, and keeps cows for milk, he will be okay even if one crop fails."
                }
            ]
        },
        {
            id: 5,
            title: "Starting Your Journey",
            description: "Practical steps to take today to begin your investment life.",
            concepts: [
                {
                    id: 8,
                    title: "The Emergency Fund First",
                    content: "Before you buy your first stock or gold bond, you must have an 'Emergency Fund'. This is money kept in a simple bank account that you only touch for true emergencies (hospital bills, job loss). It should be enough to cover 6 months of your household expenses.",
                    keyPoints: [
                        "Don't invest money you might need next month.",
                        "Safety first, growth second.",
                        "Keeps you from having to sell your investments at a loss during a crisis."
                    ]
                },
                {
                    id: 9,
                    title: "KYC and the Demat Account",
                    content: "To invest in modern India, you need three things: A bank account, a PAN card, and 'KYC' (Know Your Customer) verification. A Demat account is like a digital cupboard where your investments are kept safely. It's much safer than keeping paper certificates in a file.",
                    keyPoints: [
                        "KYC is a one-time process to prove your identity.",
                        "Everything is digital and linked to your Aadhar/PAN.",
                        "Extremely secure and easy to track on your phone."
                    ]
                }
            ]
        }
    ]
},
{
    id: 3,
    title: "Taxing & Savings",
    icon: "🏦",
    color: "#D4A574",
    description: "Understand how to keep more of what you earn through smart, legal planning.",
    overview: "Taxes are the contribution we make to the country's development, but the government also provides many 'legal paths' to reduce this burden if you save for your future. Tax planning is simply the art of arranging your money so that you pay the right amount of tax while maximizing your family's savings.",
    importance: "Many people in India pay more tax than they need to simply because they don't understand the rules. By learning a few simple sections of the tax law, you can save thousands of rupees every year—money that could go toward your children's education or your own retirement.",
    subtopics: [
        {
            id: 1,
            title: "Tax Basics for Families",
            description: "Breaking down how the government calculates what you owe.",
            concepts: [
                {
                    id: 1,
                    title: "Income Tax Slabs",
                    content: "In India, tax isn't a flat rate for everyone. It works like a 'stepped ladder'. You don't pay any tax on your initial earnings (up to a certain limit). As you climb higher and earn more, only the 'extra' money is taxed at a higher rate. This ensures that those who earn less are protected.",
                    keyPoints: [
                        "Exemption Limit: The amount you can earn before paying any tax.",
                        "Progressive Tax: Higher earners pay a higher percentage on their top earnings.",
                        "Old vs. New Regime: The government offers two different ways to calculate tax; you can choose the one that saves you more."
                    ],
                    realWorldExample: "Imagine a ladder. The first few steps are free. Only when you reach the 7th or 8th step does the government ask for a small percentage of that specific step. You never pay a high tax on your very first rupee earned."
                },
                {
                    id: 2,
                    title: "Direct vs. Indirect Tax",
                    content: "There are two ways the government collects money. 'Direct Tax' is what you pay on your salary or business profit (Income Tax). 'Indirect Tax' is what you pay when you buy a biscuit, a car, or a phone (GST). While you can't avoid GST, you can legally reduce your Income Tax through smart savings.",
                    keyPoints: [
                        "Income Tax is personal and based on what you earn.",
                        "GST is included in the price of almost everything you buy.",
                        "Tax planning focuses almost entirely on Direct (Income) Tax."
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "The 'Golden' Section 80C",
            description: "The most popular way for Indians to save tax and build wealth simultaneously.",
            concepts: [
                {
                    id: 3,
                    title: "What is Section 80C?",
                    content: "This is the most famous rule in Indian tax law. It allows you to reduce your 'taxable income' by up to ₹1.5 Lakh every year. If you earn ₹8 Lakh and invest ₹1.5 Lakh in 80C options, the government will calculate your tax as if you only earned ₹6.5 Lakh. It is a massive discount for being a disciplined saver.",
                    keyPoints: [
                        "Maximum Limit: ₹1,50,000 per year.",
                        "Double Benefit: You save tax today, and your money grows for tomorrow.",
                        "Includes many things you already pay for, like children's school fees or home loan principal."
                    ],
                    commonMistakes: [
                        "Investing more than ₹1.5 Lakh in this section (you won't get extra tax benefits).",
                        "Waiting until March 31st to finish your investments in a hurry."
                    ]
                },
                {
                    id: 4,
                    title: "80C Investment Options",
                    content: "The government gives you a menu of where to put your money to get the 80C benefit. Common choices include:\n\n1. PPF (Public Provident Fund): Extremely safe, 15-year government plan.\n2. ELSS (Tax-Saving Mutual Funds): Offers higher growth but has a 3-year lock-in.\n3. Life Insurance Premiums: The money you pay to protect your family also saves you tax.\n4. Children's Tuition Fees: The base fee you pay for school is tax-deductible!",
                    keyPoints: [
                        "PPF is best for long-term safety.",
                        "ELSS has the shortest 'waiting period' (lock-in) of only 3 years.",
                        "School fees benefit is available for up to two children."
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "Retirement & Security Savings",
            description: "Special government schemes designed for your old age.",
            concepts: [
                {
                    id: 5,
                    title: "NPS (National Pension System)",
                    content: "The NPS is a modern way to save for retirement. It's like a 'voluntary pension'. You put in money during your working years, and the government gives you an *additional* tax benefit of ₹50,000 (above the 80C limit). When you retire at 60, you get a large lumpsum and a regular monthly pension.",
                    keyPoints: [
                        "Extra Tax Benefit: Up to ₹50,000 under Section 80CCD(1B).",
                        "Low Cost: One of the cheapest ways to invest in the world.",
                        "Pension: Ensures you aren't dependent on others in your old age."
                    ]
                },
                {
                    id: 6,
                    title: "EPF (Employee Provident Fund)",
                    content: "If you work in a company, a small portion of your salary is automatically cut and put into your EPF account. Your employer also contributes an equal amount. This is your 'forced' savings. It earns a good interest rate and is completely tax-free when you withdraw it after retirement.",
                    keyPoints: [
                        "Employer Match: Your company helps you build your wealth.",
                        "Safety: Backed by the government.",
                        "Withdrawal: Tax-free if you've worked for at least 5 years."
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "Health & Home Benefits",
            description: "How your basic needs can help you reduce your tax bill.",
            concepts: [
                {
                    id: 7,
                    title: "Section 80D: Health Insurance",
                    content: "Paying for health insurance for yourself, your spouse, and your children saves you tax up to ₹25,000. If you also pay for your elderly parents' health insurance, you can save an *additional* ₹50,000. This is the government's way of rewarding you for taking care of your family's health.",
                    keyPoints: [
                        "Includes preventive health check-ups (up to ₹5,000).",
                        "Higher benefits if parents are Senior Citizens (over 60).",
                        "Must be paid digitally (not cash) to get the tax benefit."
                    ]
                },
                {
                    id: 8,
                    title: "Home Loan Benefits",
                    content: "Buying a home is a dream for most Indians. To help, the government lets you deduct the 'Interest' you pay on your home loan (up to ₹2 Lakh) and the 'Principal' amount you repay (under the 80C limit). This effectively makes your home loan much cheaper than it looks.",
                    keyPoints: [
                        "Section 24: Interest deduction up to ₹2 Lakh.",
                        "Section 80C: Principal repayment deduction.",
                        "Only available if you actually live in the house or it is rented out."
                    ]
                }
            ]
        },
        {
            id: 5,
            title: "The Annual Habit",
            description: "How to stay organized so tax season is never stressful.",
            concepts: [
                {
                    id: 9,
                    title: "Income Tax Returns (ITR)",
                    content: "Filing your ITR is simply a 'Yearly Report Card' you send to the government. It shows how much you earned and how much tax you already paid (TDS). Even if your income is below the taxable limit, filing your ITR is very helpful for getting bank loans or visa applications in the future.",
                    keyPoints: [
                        "Deadline: Usually July 31st every year.",
                        "TDS (Tax Deducted at Source): Tax already cut by your bank or employer.",
                        "Refund: If you paid too much tax, the government will send it back to your bank account!"
                    ]
                }
            ]
        }
    ]
},
{
    id: 4,
    title: "Insurance Essentials",
    icon: "🛡️",
    color: "#D4A574",
    description: "Protect your family's future from life's unexpected surprises.",
    overview: "Insurance is like an umbrella. You don't buy it because you want it to rain; you buy it so that if it does rain, you and your family stay dry. It is a way to transfer your 'financial risk' to a big company so that a single accident or illness doesn't destroy your life's savings.",
    importance: "In India, many families are just one medical bill away from poverty. Insurance acts as a safety net. It ensures that even in your absence, your children can finish school, your spouse can live with dignity, and your elderly parents receive the best medical care.",
    subtopics: [
        {
            id: 1,
            title: "Life Insurance: The Family Guard",
            description: "Ensuring your loved ones are financially safe, even if you aren't there.",
            concepts: [
                {
                    id: 1,
                    title: "Term Insurance vs. Endowment",
                    content: "There are two main types of life insurance in India. \n\n1. **Term Insurance**: This is 'Pure Protection'. It is very cheap and gives a massive payout (like ₹1 Crore) to your family if something happens to you. If you survive, you get nothing back. Think of it like a security guard's salary—you pay him to protect the house, not to return the money at the end of the year.\n\n2. **Endowment Plans**: These mix 'Saving' with 'Insurance'. They are much more expensive and give a small payout plus some 'returns' if you survive. Usually, it's better to keep insurance and investments separate.",
                    keyPoints: [
                        "Term Insurance is the most important for the breadwinner.",
                        "Endowment plans often give lower returns than a simple bank FD.",
                        "Buy Term Insurance as early as possible to lock in a low premium."
                    ],
                    realWorldExample: "A 30-year-old can get ₹1 Crore cover for just ₹800-₹1000 a month with Term Insurance. An Endowment plan for the same cover might cost ₹50,000+ a month!"
                },
                {
                    id: 2,
                    title: "How Much Cover is Enough?",
                    content: "A simple thumb rule in India is the '10X Rule'. Your life insurance cover (Sum Assured) should be at least 10 times your annual salary. This ensures that if the money is put in a bank, the interest alone can replace your monthly salary for your family.",
                    keyPoints: [
                        "Cover = (Annual Income × 10) + Outstanding Loans.",
                        "Don't forget to include your home loan or car loan in the calculation.",
                        "Review your cover every time you have a major life event (marriage, birth of a child)."
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "Health Insurance: The Hospital Shield",
            description: "Protecting your savings from rising medical costs.",
            concepts: [
                {
                    id: 3,
                    title: "Family Floater vs. Individual Plan",
                    content: "Health insurance comes in two styles:\n\n1. **Family Floater**: One single policy covers the whole family (Husband, Wife, Children). The 'pool' of money is shared. If the limit is ₹10 Lakh, any member can use it. It is usually cheaper for young families.\n\n2. **Individual Plan**: Each person has their own dedicated limit. This is highly recommended for elderly parents (60+) because they are more likely to need the full amount, and their health risks shouldn't affect the rest of the family's premium.",
                    keyPoints: [
                        "Floater plans are cost-effective for healthy, young families.",
                        "Individual plans are better for seniors or those with chronic illnesses.",
                        "Always check if 'Ayush' (Ayurveda/Homeopathy) is covered if your parents prefer those treatments."
                    ]
                },
                {
                    id: 4,
                    title: "The 'Fine Print' Basics",
                    content: "Health insurance has specific terms you must know:\n\n- **Waiting Period**: The time (usually 2-4 years) you must wait before the insurance covers 'Pre-existing' diseases like Diabetes or BP.\n- **Network Hospitals**: The list of hospitals where you can get 'Cashless' treatment (the insurance company pays the bill directly).\n- **Copay**: A percentage of the bill (like 10% or 20%) that YOU must pay. Try to choose 'Zero Copay' plans for younger people.",
                    keyPoints: [
                        "Never hide health secrets (like smoking or sugar) when buying.",
                        "Check for 'Room Rent Capping'—some policies only pay for a general ward.",
                        "Restoration Benefit: If you use up your limit, the company 'refills' it for free for the next illness."
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "Motor & Asset Insurance",
            description: "Protecting your vehicle and your home from accidents.",
            concepts: [
                {
                    id: 5,
                    title: "Third-Party vs. Comprehensive",
                    content: "In India, 'Third-Party' motor insurance is a legal requirement. It only pays for damage you cause to *others* (their car or their injury). It does NOT pay for your car's repair. \n\n'Comprehensive Insurance' covers everything: theft, fire, damage to your car, and third-party costs. It is highly recommended for any vehicle less than 10 years old.",
                    keyPoints: [
                        "Third-Party is mandatory by law; Comprehensive is for your own peace of mind.",
                        "IDV (Insured Declared Value): The 'market value' of your car that the company will pay if it's stolen.",
                        "NCB (No Claim Bonus): A discount you get for every year you don't have an accident."
                    ]
                },
                {
                    id: 6,
                    title: "Personal Accident Cover",
                    content: "This is a small but powerful add-on. If the owner-driver meets with an accident that leads to disability or death, the company pays a fixed amount (usually ₹15 Lakh). In 2026, the government has made this a standard part of vehicle ownership unless you already have a separate high-value accident policy.",
                    keyPoints: [
                        "Covers death, loss of limbs, or permanent disability.",
                        "Works anywhere in India.",
                        "The nominee gets the full amount in case of an accidental death."
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "Common Mistakes to Avoid",
            description: "How to ensure your claim is actually paid when you need it.",
            concepts: [
                {
                    id: 7,
                    title: "The 'Signature' Trap",
                    content: "Never let an insurance agent fill your form and just sign at the bottom. If they make a mistake (like saying you don't have BP when you do), the company can legally refuse to pay your claim later. Take 20 minutes to read and fill it yourself.",
                    keyPoints: [
                        "Disclosure is more important than the premium price.",
                        "Double-check your Nominee's name and age.",
                        "Keep a digital copy of your policy on your phone for emergencies."
                    ]
                }
            ]
        }
    ]
}

];
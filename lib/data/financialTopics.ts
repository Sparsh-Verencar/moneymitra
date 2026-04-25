export interface Concept {
  id: number;
  title: string;
  content: string;
}

export interface Subtopic {
  id: number;
  title: string;
  concepts: Concept[];
}

export interface Topic {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
  subtopics: Subtopic[];
}

export const topics: Topic[] = [
  {
    id: 1,
    title: 'Personal Budgeting',
    icon: '📊',
    color: '#D4A574',
    description: 'Master the fundamentals of managing your money',
    subtopics: [
      {
        id: 1,
        title: 'Budget Basics',
        concepts: [
          { id: 1, title: 'What is a Budget?', content: 'A budget is a financial plan that shows how much money you expect to earn and spend over a period of time. It helps you control your spending and achieve your financial goals. Think of it as a roadmap for your money.' },
          { id: 2, title: 'The 50/30/20 Rule', content: 'A popular budgeting method where: 50% of income goes to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. This simple framework helps most people balance their finances.' },
          { id: 3, title: 'Tracking Expenses', content: 'Monitor every rupee you spend. Use apps, spreadsheets, or notebooks. Categorize expenses (food, transport, entertainment). This awareness alone helps reduce unnecessary spending by 10-20% for most people.' }
        ]
      },
      {
        id: 2,
        title: 'Budget Planning',
        concepts: [
          { id: 4, title: 'Setting Financial Goals', content: 'Define what you want to achieve: emergency fund (3-6 months expenses), vacation in 2 years, home down payment. Specific, measurable goals with timelines are more likely to be achieved.' },
          { id: 5, title: 'Income Assessment', content: 'Calculate your actual monthly income from all sources. Be conservative—use net income (after tax). Include side income only if it\'s consistent for 3+ months. This is your realistic spending ceiling.' },
          { id: 6, title: 'Expense Estimation', content: 'List all monthly expenses. Use past 3-6 months of bank statements as reference. Fixed costs (rent, insurance) stay same; variable costs (food, transport) need averaging. Build in 10-15% buffer for unexpected expenses.' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Investing Fundamentals',
    icon: '📈',
    color: '#D4A574',
    description: 'Start your wealth-building journey with confidence',
    subtopics: [
      {
        id: 1,
        title: 'Investment Basics',
        concepts: [
          { id: 1, title: 'Why Invest?', content: 'Inflation erodes your savings. ₹1 lakh today = ₹87,000 in purchasing power after 5 years at 3% inflation. Investing at 8-12% annually beats inflation and compounds wealth. Start early, start small, stay consistent.' },
          { id: 2, title: 'Asset Classes', content: 'Different investment types: Stocks (ownership in companies, ~12% annual return), Bonds (loans to companies, ~6-8% return), Mutual Funds (managed portfolios), Real Estate (long-term stability). Each has risk/return tradeoffs.' },
          { id: 3, title: 'Risk vs Return', content: 'Higher potential returns come with higher volatility. Stocks more volatile than bonds. Your age and goals determine risk tolerance. Younger people can afford more risk; near-retirees need stability. Diversification reduces risk.' }
        ]
      },
      {
        id: 2,
        title: 'Mutual Funds',
        concepts: [
          { id: 4, title: 'What are Mutual Funds?', content: 'Professional managers pool money from investors to buy stocks/bonds. You own a small share. Benefits: diversification, professional management, low minimum investment (₹500/month SIP). Perfect for beginners.' },
          { id: 5, title: 'SIP vs Lump Sum', content: 'SIP (Systematic Investment Plan): invest fixed amount monthly, reduces market timing risk. Lump Sum: invest entire amount at once, requires market timing skill. SIP recommended for salaried people; easier psychologically when market drops.' },
          { id: 6, title: 'Index Funds', content: 'Passively managed funds that track market indices (Nifty 50, Sensex). Low fees (0.1-0.3%), consistent returns, less risk than active funds. Nifty 50 has returned ~12% annually over 10+ years. Good foundation for beginners.' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Taxes & Savings',
    icon: '💰',
    color: '#D4A574',
    description: 'Legally save thousands in taxes and maximize deductions',
    subtopics: [
      {
        id: 1,
        title: 'Tax Basics for Salaried',
        concepts: [
          { id: 1, title: 'Income Tax Overview', content: 'Salaried individuals pay tax on income above ₹2.5L (FY 24-25). Tax slabs: 5% (2.5-5L), 20% (5-10L), 30% (10L+). Deductions reduce taxable income. ITR filing is mandatory if income > ₹2.5L.' },
          { id: 2, title: 'Standard & HRA Deduction', content: 'Standard Deduction: ₹50,000 for salaried (reduces taxable income directly). HRA: If you rent, claim 40-50% of salary as HRA deduction (must have rent receipt/agreement). Both are automatic reductions before tax calculation.' },
          { id: 3, title: 'Deductions Explained', content: 'Section 80C: Invest up to ₹1.5L/year in PPF, ELSS, LIC, NSC, reduce taxable income by that amount. Section 80D: Health insurance premiums (₹25k/year). Section 80E: Education loan interest. These directly reduce taxes.' }
        ]
      },
      {
        id: 2,
        title: 'Tax-Efficient Investments',
        concepts: [
          { id: 4, title: 'PPF (Public Provident Fund)', content: '15-year maturity, guaranteed 7-8% returns, tax-free growth. Withdraw after 7 years. Opens savings account mentality. For ₹10,000/month = ₹18L+ in 15 years. Perfect 80C investment.' },
          { id: 5, title: 'ELSS Funds', content: 'Equity Linked Savings Scheme: 3-year lock-in, invest up to ₹1.5L/year in 80C. Returns 12-15% historically (equity-based). Lock-in is short, high growth potential. Complements PPF well.' },
          { id: 6, title: 'NPS (National Pension Scheme)', content: 'Long-term retirement savings: ₹1.5L/year deduction (80C). Withdraw after 60 years. Returns 9-10% historically (diversified portfolio). Especially useful for self-employed people (₹2L/year deduction).' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Insurance Essentials',
    icon: '🛡️',
    color: '#D4A574',
    description: 'Protect yourself and your family with the right insurance',
    subtopics: [
      {
        id: 1,
        title: 'Life Insurance',
        concepts: [
          { id: 1, title: 'Term Insurance', content: 'Pure protection: if you die, family gets ₹50L-₹1Cr payout. Cost: ₹40-100/month for young, healthy people. 20-30 year terms common. NOT for investment. If you have dependents, this is non-negotiable.' },
          { id: 2, title: 'ULIP vs Term', content: 'ULIP: combines insurance + investment, high fees (1.5-3%), confusing. Term: pure insurance, cheap (₹50-150/month), transparent. Experts recommend term + separate investments. More control, lower cost, better returns.' },
          { id: 3, title: 'How Much Coverage?', content: 'Rule of thumb: 10x your annual income. If earning ₹6L/year, get ₹60L coverage. This ensures family can repay debts, cover living expenses, and have cushion if you die. Increase coverage when income grows.' }
        ]
      },
      {
        id: 2,
        title: 'Health Insurance',
        concepts: [
          { id: 4, title: 'Health Insurance Basics', content: 'Covers hospitalization costs: room charges, doctor fees, medicines, surgery. Claim reimbursement after paying bill. Family of 4: ₹7-15L cover recommended. Cost: ₹5-15k/year depending on age.' },
          { id: 5, title: 'Pre-existing Diseases', content: 'Conditions you had before buying insurance: typically excluded for 1-4 years. Declare all existing conditions honestly. Some policies offer faster coverage inclusion. Don\'t hide—claims will be rejected.' },
          { id: 6, title: 'Claim Process', content: 'Cashless at network hospitals: show policy, pay copay only. Non-network: pay full bill, claim reimbursement (10-15 days). Keep all receipts. Most claims processed smoothly if documented properly.' }
        ]
      }
    ]
  }
];
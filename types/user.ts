// types/user.ts

import { Timestamp } from 'firebase/firestore';

export type Gender = 'Male' | 'Female' | 'Other';

export type Caste = 'General' | 'OBC' | 'SC' | 'ST' | 'Prefer not to say';

export type LifeStage = 'student' | 'working' | 'family' | 'retired';

export type IncomeType = 'salary' | 'business';

export type InvestmentType = 'FD' | 'SIP / Mutual Funds' | 'Stocks' | 'PPF';

export interface Expenses {
  rent: number;
  homeLoan: number;
  utilities: number;
  internet: number;
  food: number;
  transport: number;
}

export interface UserProfile {
  // Personal Info
  name: string;
  age: number;
  gender: Gender;
  caste: Caste;

  // Life Stage
  lifeStage: LifeStage;

  // Financial Snapshot
  monthlyAllowance?: number; // student only
  monthlyIncome?: number; // working / family
  incomeType?: IncomeType; // working / family
  dependents?: number; // working / family (0 if none)
  monthlyPension?: number; // retired only

  // Expenses
  expenses: Expenses;

  // Savings
  savesMoney: boolean;
  approxSavings?: number; // only present if savesMoney is true

  // Investments
  investedBefore: boolean;
  investments: InvestmentType[]; // empty array if investedBefore is false

  // Insurance
  healthInsurance: boolean;
  lifeInsurance: boolean;

  // Tax
  filesTax: boolean;
  wantsTaxSave: boolean;

  // Metadata
  phone: string;
  onboardingComplete: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Raw form state — all strings/nulls until submitted
export interface OnboardingFormData {
  name: string;
  age: string;
  gender: Gender | '';
  caste: Caste | '';
  lifeStage: LifeStage | '';
  monthlyAllowance: string;
  monthlyIncome: string;
  incomeType: IncomeType | '';
  dependents: string;
  monthlyPension: string;
  rent: string;
  homeLoan: string;
  utilities: string;
  internet: string;
  food: string;
  transport: string;
  savesMoney: boolean | null;
  approxSavings: string;
  investedBefore: boolean | null;
  investments: InvestmentType[];
  healthInsurance: boolean | null;
  lifeInsurance: boolean | null;
  filesTax: boolean | null;
  wantsTaxSave: boolean | null;
}

export const INITIAL_FORM: OnboardingFormData = {
  name: '',
  age: '',
  gender: '',
  caste: '',
  lifeStage: '',
  monthlyAllowance: '',
  monthlyIncome: '',
  incomeType: '',
  dependents: '',
  monthlyPension: '',
  rent: '',
  homeLoan: '',
  utilities: '',
  internet: '',
  food: '',
  transport: '',
  savesMoney: null,
  approxSavings: '',
  investedBefore: null,
  investments: [],
  healthInsurance: null,
  lifeInsurance: null,
  filesTax: null,
  wantsTaxSave: null,
};

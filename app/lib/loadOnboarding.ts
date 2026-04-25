// lib/loadOnboarding.ts
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { waitForAuthReady } from './auth';

export interface OnboardingFormData {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  caste: 'General' | 'OBC' | 'SC' | 'ST' | 'Prefer not to say' | '';
  lifeStage: 'student' | 'working' | 'family' | 'retired' | '';
  monthlyAllowance: string;
  monthlyIncome: string;
  incomeType: 'salary' | 'business' | '';
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
  investments: string[];
  healthInsurance: boolean | null;
  lifeInsurance: boolean | null;
  filesTax: boolean | null;
  wantsTaxSave: boolean | null;
}

export async function loadOnboarding(): Promise<OnboardingFormData | null> {
  const user = auth.currentUser ?? (await waitForAuthReady());
  if (!user) {
    return null; // no logged-in user → no onboarding data
  }

  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  const data = snap.data() as any;
  const lifeStage = (data.lifeStage ?? '') as OnboardingFormData['lifeStage'];

  const mapped: OnboardingFormData = {
    name: data.name ?? '',
    age: data.age != null ? String(data.age) : '',
    gender: data.gender ?? '',
    caste: data.caste ?? '',

    lifeStage,

    monthlyAllowance: data.monthlyAllowance ?? '',
    monthlyIncome: data.monthlyIncome ?? '',
    incomeType: (data.incomeType ?? '') as OnboardingFormData['incomeType'],

    dependents:
      data.dependents === 0
        ? 'None'
        : data.dependents >= 4
        ? '4+'
        : data.dependents != null
        ? String(data.dependents)
        : '',

    monthlyPension: data.monthlyPension ?? '',

    rent: data.expenses?.rent ?? '',
    homeLoan: data.expenses?.homeLoan ?? '',
    utilities: data.expenses?.utilities ?? '',
    internet: data.expenses?.internet ?? '',
    food: data.expenses?.food ?? '',
    transport: data.expenses?.transport ?? '',

    savesMoney:
      typeof data.savesMoney === 'boolean' ? data.savesMoney : null,
    approxSavings: data.approxSavings ?? '',

    investedBefore:
      typeof data.investedBefore === 'boolean' ? data.investedBefore : null,
    investments: Array.isArray(data.investments) ? data.investments : [],

    healthInsurance:
      typeof data.healthInsurance === 'boolean'
        ? data.healthInsurance
        : null,
    lifeInsurance:
      typeof data.lifeInsurance === 'boolean'
        ? data.lifeInsurance
        : null,

    filesTax:
      typeof data.filesTax === 'boolean' ? data.filesTax : null,
    wantsTaxSave:
      typeof data.wantsTaxSave === 'boolean' ? data.wantsTaxSave : null,
  };

  return mapped;
}
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { waitForAuthReady } from './auth';

export async function saveOnboarding(data: {
  name: string;
  age: string;
  gender: string;
  caste: string;
  lifeStage: string;
  monthlyAllowance: string;
  monthlyIncome: string;
  incomeType: string;
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
}): Promise<void> {
  const user = auth.currentUser ?? (await waitForAuthReady());
  if (!user) throw new Error('Not logged in');

  await setDoc(
    doc(db, 'users', user.uid),
    {
      name: data.name,
      age: Number(data.age),
      gender: data.gender,
      caste: data.caste,
      lifeStage: data.lifeStage,

      ...(data.lifeStage === 'student' && {
        monthlyAllowance: data.monthlyAllowance,
      }),

      ...((data.lifeStage === 'working' || data.lifeStage === 'family') && {
        monthlyIncome: data.monthlyIncome,
        incomeType: data.incomeType,
        dependents: data.dependents === 'None' ? 0 : Number(data.dependents) || 0,
      }),

      ...(data.lifeStage === 'retired' && {
        monthlyPension: data.monthlyPension,
      }),

      expenses: {
        rent: data.rent || 'None',
        homeLoan: data.homeLoan || 'None',
        utilities: data.utilities || 'None',
        internet: data.internet || 'None',
        food: data.food || 'None',
        transport: data.transport || 'None',
      },

      savesMoney: data.savesMoney ?? false,
      ...(data.savesMoney && { approxSavings: data.approxSavings }),

      investedBefore: data.investedBefore ?? false,
      investments: data.investedBefore ? data.investments : [],

      healthInsurance: data.healthInsurance ?? false,
      lifeInsurance: data.lifeInsurance ?? false,

      filesTax: data.filesTax ?? false,
      wantsTaxSave: data.wantsTaxSave ?? false,

      phone: user.phoneNumber ?? '',
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
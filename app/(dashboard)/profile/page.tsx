'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase'; // Adjust this import based on your actual path

// ─── Types ────────────────────────────────────────────────────────────────────

type LifeStage = 'student' | 'working' | 'family' | 'retired' | '';
type IncomeType = 'salary' | 'business' | '';
type Gender = 'Male' | 'Female' | 'Other' | '';
type Caste = 'General' | 'OBC' | 'SC' | 'ST' | 'Prefer not to say' | '';

interface FormData {
  name: string;
  age: string;
  gender: Gender;
  caste: Caste;
  lifeStage: LifeStage;
  monthlyAllowance: string;
  monthlyIncome: string;
  incomeType: IncomeType;
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

const INITIAL: FormData = {
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

// ─── Reusable primitives ──────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-[#888] mb-2">
      {children}
    </label>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#141414] border-2 border-[#333] rounded-md px-4 py-3.5 font-mono text-base text-white placeholder-[#444] outline-none transition-all duration-200 focus:border-amber-500"
    />
  );
}

function SelectInput({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#141414] border-2 border-[#333] rounded-md px-4 py-3.5 font-mono text-base text-white outline-none transition-all duration-200 focus:border-amber-500 appearance-none"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function RangeSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`px-3 py-2 rounded-md font-mono text-[12px] border-2 transition-all duration-150 ${value === o ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-3">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 py-3.5 rounded-md font-mono text-[13px] tracking-wide border-2 transition-all duration-150 ${value === v ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'}`}
          >
            {v ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-md border-2 font-mono text-[13px] transition-all duration-150 ${checked ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'}`}
    >
      <span
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${checked ? 'border-amber-500 bg-amber-500' : 'border-[#444]'}`}
      >
        {checked && (
          <span className="text-[#141414] text-[10px] font-bold">✓</span>
        )}
      </span>
      {label}
    </button>
  );
}

function CardButton({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 h-full rounded-md border-2 transition-all duration-150 ${selected ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-mono text-[12px] tracking-wide text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

// ─── Shared Content Blocks (From Onboarding) ──────────────────────────────────

const INCOME_RANGES = [
  '< ₹10k',
  '₹10k–25k',
  '₹25k–50k',
  '₹50k–1L',
  '₹1L–2L',
  '> ₹2L',
];
const SAVINGS_RANGES = [
  '< ₹10k',
  '₹10k–50k',
  '₹50k–1L',
  '₹1L–5L',
  '₹5L–10L',
  '> ₹10L',
];
const EXPENSE_RANGES = [
  'None',
  '< ₹2k',
  '₹2k–5k',
  '₹5k–10k',
  '₹10k–20k',
  '> ₹20k',
];
const EXPENSE_KEYS: { key: keyof FormData; label: string; sub: string }[] = [
  { key: 'rent', label: 'Rent', sub: 'Monthly house / apartment rent' },
  { key: 'homeLoan', label: 'Home Loan EMI', sub: 'If you own a property' },
  {
    key: 'utilities',
    label: 'Utilities',
    sub: 'Electricity, water & maintenance',
  },
  { key: 'internet', label: 'Internet / Cable', sub: 'Broadband, DTH, OTT' },
  { key: 'food', label: 'Food & Groceries', sub: 'Including eating out' },
  { key: 'transport', label: 'Transport', sub: 'Fuel, auto, public transit' },
];

const STEP_META = [
  { title: 'Personal Info', sub: 'Basic details' },
  { title: 'Life Stage', sub: 'Current phase' },
  { title: 'Financial Snapshot', sub: 'Income & Dependents' },
  { title: 'Expense Snapshot', sub: 'Monthly outflows' },
  { title: 'Savings Status', sub: 'Money set aside' },
  { title: 'Investments', sub: 'Money at work' },
  { title: 'Insurance Check', sub: 'Coverage status' },
  { title: 'Tax Awareness', sub: 'Filing & saving' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const set = (key: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch initial data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const d = docSnap.data();
            setData({
              name: d.name || '',
              age: d.age ? String(d.age) : '',
              gender: d.gender || '',
              caste: d.caste || '',
              lifeStage: d.lifeStage || '',
              monthlyAllowance: d.monthlyAllowance || '',
              monthlyIncome: d.monthlyIncome || '',
              incomeType: d.incomeType || '',
              // Reverse mapping dependents: 0 becomes 'None'
              dependents:
                d.dependents !== undefined
                  ? d.dependents === 0
                    ? 'None'
                    : String(d.dependents)
                  : '',
              monthlyPension: d.monthlyPension || '',
              // Flattening expenses
              rent: d.expenses?.rent || '',
              homeLoan: d.expenses?.homeLoan || '',
              utilities: d.expenses?.utilities || '',
              internet: d.expenses?.internet || '',
              food: d.expenses?.food || '',
              transport: d.expenses?.transport || '',
              savesMoney: d.savesMoney ?? null,
              approxSavings: d.approxSavings || '',
              investedBefore: d.investedBefore ?? null,
              investments: d.investments || [],
              healthInsurance: d.healthInsurance ?? null,
              lifeInsurance: d.lifeInsurance ?? null,
              filesTax: d.filesTax ?? null,
              wantsTaxSave: d.wantsTaxSave ?? null,
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/'); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const saveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');

      // Re-map the flat state to the grouped firestore schema
      await updateDoc(doc(db, 'users', user.uid), {
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
          dependents:
            data.dependents === 'None' ? 0 : Number(data.dependents) || 0,
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
        approxSavings: data.savesMoney ? data.approxSavings : '',

        investedBefore: data.investedBefore ?? false,
        investments: data.investedBefore ? data.investments : [],

        healthInsurance: data.healthInsurance ?? false,
        lifeInsurance: data.lifeInsurance ?? false,

        filesTax: data.filesTax ?? false,
        wantsTaxSave: data.wantsTaxSave ?? false,

        updatedAt: serverTimestamp(),
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] px-4 py-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-0">
        <div className="w-125 h-100 rounded-full bg-amber-500/5 blur-3xl translate-y-20" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-serif text-4xl text-white mb-2">
              Your Profile
            </h1>
            <p className="font-mono text-[#888] text-sm">
              Review and edit your financial details.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {message.text && (
              <span
                className={`font-mono text-[12px] px-3 py-1 rounded-full ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
              >
                {message.text}
              </span>
            )}
            <button
              onClick={saveProfile}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[13px] tracking-[0.18em] uppercase font-semibold px-6 py-3 rounded-md transition-all duration-200 disabled:opacity-50 shadow-lg shadow-amber-500/10"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Wrapper component for consistency */}
          {STEP_META.map((meta, i) => (
            <div
              key={i}
              className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 shadow-xl relative flex flex-col"
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/50 rounded-tl-md" />

              <div className="mb-5 pb-4 border-b border-[#2a2a2a]">
                <h2 className="font-serif text-xl text-white mb-1">
                  {meta.title}
                </h2>
                <p className="font-mono text-[11px] text-[#666]">{meta.sub}</p>
              </div>

              <div className="flex-1 space-y-5">
                {/* 1. Personal Info */}
                {i === 0 && (
                  <>
                    <div>
                      <Label>Your Name</Label>
                      <TextInput
                        placeholder="Full name"
                        value={data.name}
                        onChange={(v) => set('name', v)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Age</Label>
                        <TextInput
                          placeholder="e.g. 35"
                          value={data.age}
                          onChange={(v) => set('age', v)}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label>Caste / Category</Label>
                        <SelectInput
                          value={data.caste}
                          onChange={(v) => set('caste', v)}
                          placeholder="Select"
                          options={[
                            'General',
                            'OBC',
                            'SC',
                            'ST',
                            'Prefer not to say',
                          ]}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <div className="flex gap-2">
                        {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => set('gender', g)}
                            className={`flex-1 py-2.5 rounded-md font-mono text-[11px] border-2 transition-all ${data.gender === g ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666] hover:border-[#444]'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 2. Life Stage */}
                {i === 1 && (
                  <div className="grid grid-cols-2 gap-3 h-full">
                    {[
                      { key: 'student', label: 'Student', icon: '🎓' },
                      { key: 'working', label: 'Working Pro', icon: '💼' },
                      { key: 'family', label: 'Family Man', icon: '🏠' },
                      { key: 'retired', label: 'Retired', icon: '🌅' },
                    ].map((s) => (
                      <CardButton
                        key={s.key}
                        label={s.label}
                        icon={s.icon}
                        selected={data.lifeStage === s.key}
                        onClick={() => set('lifeStage', s.key as LifeStage)}
                      />
                    ))}
                  </div>
                )}

                {/* 3. Financial Snapshot */}
                {i === 2 && (
                  <>
                    {!data.lifeStage && (
                      <p className="font-mono text-sm text-[#555] italic">
                        Select a life stage first.
                      </p>
                    )}

                    {data.lifeStage === 'student' && (
                      <RangeSelect
                        label="Monthly Allowance"
                        options={[
                          '< ₹5k',
                          '₹5k–10k',
                          '₹10k–20k',
                          '₹20k–40k',
                          '> ₹40k',
                        ]}
                        value={data.monthlyAllowance}
                        onChange={(v) => set('monthlyAllowance', v)}
                      />
                    )}

                    {(data.lifeStage === 'working' ||
                      data.lifeStage === 'family') && (
                      <>
                        <RangeSelect
                          label="Monthly Income"
                          options={INCOME_RANGES}
                          value={data.monthlyIncome}
                          onChange={(v) => set('monthlyIncome', v)}
                        />
                        <div>
                          <Label>Income Type</Label>
                          <div className="flex gap-3">
                            {(['Salary', 'Business'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() =>
                                  set('incomeType', t.toLowerCase())
                                }
                                className={`flex-1 py-2.5 rounded-md font-mono text-[12px] border-2 transition-all ${data.incomeType === t.toLowerCase() ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666]'}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Number of Dependents</Label>
                          <div className="flex gap-2 flex-wrap">
                            {['None', '1', '2', '3', '4+'].map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => set('dependents', d)}
                                className={`px-4 py-2.5 rounded-md font-mono text-[12px] border-2 transition-all ${data.dependents === d ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666]'}`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {data.lifeStage === 'retired' && (
                      <RangeSelect
                        label="Monthly Pension"
                        options={INCOME_RANGES}
                        value={data.monthlyPension}
                        onChange={(v) => set('monthlyPension', v)}
                      />
                    )}
                  </>
                )}

                {/* 4. Expense Snapshot */}
                {i === 3 && (
                  <div className="h-full overflow-y-auto pr-2 space-y-4 max-h-62.5 custom-scrollbar">
                    {EXPENSE_KEYS.map((e) => (
                      <div key={e.key}>
                        <div className="mb-1.5 flex justify-between items-baseline">
                          <span className="font-mono text-[12px] text-white">
                            {e.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {EXPENSE_RANGES.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => set(e.key, r)}
                              className={`px-2 py-1.5 rounded-md font-mono text-[10px] border-2 transition-all ${data[e.key] === r ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-[#2e2e2e] text-[#666] hover:border-[#444]'}`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Savings */}
                {i === 4 && (
                  <>
                    <YesNo
                      label="Do you currently save money?"
                      value={data.savesMoney}
                      onChange={(v) => set('savesMoney', v)}
                    />
                    {data.savesMoney === true && (
                      <div className="pt-2 border-t border-[#2a2a2a]">
                        <RangeSelect
                          label="Approximate Savings"
                          options={SAVINGS_RANGES}
                          value={data.approxSavings}
                          onChange={(v) => set('approxSavings', v)}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* 6. Investments */}
                {i === 5 && (
                  <>
                    <YesNo
                      label="Have you invested before?"
                      value={data.investedBefore}
                      onChange={(v) => set('investedBefore', v)}
                    />
                    {data.investedBefore === true && (
                      <div className="pt-2 border-t border-[#2a2a2a]">
                        <Label>Where have you invested?</Label>
                        <div className="flex flex-col gap-2">
                          {['FD', 'SIP / Mutual Funds', 'Stocks', 'PPF'].map(
                            (inv) => (
                              <CheckChip
                                key={inv}
                                label={inv}
                                checked={data.investments.includes(inv)}
                                onChange={() => {
                                  const cur = data.investments;
                                  set(
                                    'investments',
                                    cur.includes(inv)
                                      ? cur.filter((x) => x !== inv)
                                      : [...cur, inv],
                                  );
                                }}
                              />
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 7. Insurance */}
                {i === 6 && (
                  <>
                    <YesNo
                      label="Do you have health insurance?"
                      value={data.healthInsurance}
                      onChange={(v) => set('healthInsurance', v)}
                    />
                    <div className="pt-2 border-t border-[#2a2a2a]">
                      <YesNo
                        label="Do you have life insurance?"
                        value={data.lifeInsurance}
                        onChange={(v) => set('lifeInsurance', v)}
                      />
                    </div>
                  </>
                )}

                {/* 8. Tax */}
                {i === 7 && (
                  <>
                    <YesNo
                      label="Do you file income tax?"
                      value={data.filesTax}
                      onChange={(v) => set('filesTax', v)}
                    />
                    <div className="pt-2 border-t border-[#2a2a2a]">
                      <YesNo
                        label="Would you like to save on taxes?"
                        value={data.wantsTaxSave}
                        onChange={(v) => set('wantsTaxSave', v)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        .font-mono  { font-family: 'DM Mono', monospace !important; }
        select option { background: #1e1e1e; color: white; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </div>
  );
}

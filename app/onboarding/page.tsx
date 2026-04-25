'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

type LifeStage = 'student' | 'working' | 'family' | 'retired' | '';
type IncomeType = 'salary' | 'business' | '';

interface FormData {
  // Step 1
  name: string;
  age: string;
  gender: string;
  caste: string;
  // Step 2
  lifeStage: LifeStage;
  // Step 3
  monthlyAllowance: string;
  monthlyIncome: string;
  incomeType: IncomeType;
  dependents: string;
  monthlyPension: string;
  // Step 4
  rent: string;
  homeLoan: string;
  utilities: string;
  internet: string;
  food: string;
  transport: string;
  // Step 5
  savesMoney: boolean | null;
  approxSavings: string;
  // Step 6
  investedBefore: boolean | null;
  investments: string[];
  // Step 7
  healthInsurance: boolean | null;
  lifeInsurance: boolean | null;
  // Step 8
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

const TOTAL_STEPS = 8;

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
            className={`px-3 py-2 rounded-md font-mono text-[12px] border-2 transition-all duration-150 ${
              value === o
                ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
            }`}
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
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 py-3.5 rounded-md font-mono text-[13px] tracking-wide border-2 transition-all duration-150 ${
              value === v
                ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
            }`}
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
      className={`flex items-center gap-2.5 px-4 py-3 rounded-md border-2 font-mono text-[13px] transition-all duration-150 ${
        checked
          ? 'border-amber-500 bg-amber-500/15 text-amber-400'
          : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
      }`}
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
      className={`flex flex-col items-center gap-2 p-4 rounded-md border-2 transition-all duration-150 ${
        selected
          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
          : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-mono text-[12px] tracking-wide text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

function NextBtn({
  onClick,
  disabled,
  label = 'Continue →',
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[13px] tracking-[0.18em] uppercase font-semibold rounded-md py-4 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10 mt-6"
    >
      {label}
    </button>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Your Name</Label>
        <TextInput
          placeholder="Full name"
          value={data.name}
          onChange={(v) => set('name', v)}
        />
      </div>
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
        <Label>Gender</Label>
        <div className="flex gap-3">
          {['Male', 'Female', 'Other'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set('gender', g)}
              className={`flex-1 py-3 rounded-md font-mono text-[13px] border-2 transition-all duration-150 ${
                data.gender === g
                  ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                  : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Caste / Category</Label>
        <SelectInput
          value={data.caste}
          onChange={(v) => set('caste', v)}
          placeholder="Select category"
          options={['General', 'OBC', 'SC', 'ST', 'Prefer not to say']}
        />
      </div>
    </div>
  );
}

function Step2({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  const stages: { key: LifeStage; label: string; icon: string }[] = [
    { key: 'student', label: 'Student', icon: '🎓' },
    { key: 'working', label: 'Working Professional', icon: '💼' },
    { key: 'family', label: 'Family Man', icon: '🏠' },
    { key: 'retired', label: 'Retired', icon: '🌅' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {stages.map((s) => (
        <CardButton
          key={s.key}
          label={s.label}
          icon={s.icon}
          selected={data.lifeStage === s.key}
          onClick={() => set('lifeStage', s.key)}
        />
      ))}
    </div>
  );
}

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

function Step3({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  if (data.lifeStage === 'student') {
    return (
      <RangeSelect
        label="Monthly Allowance"
        options={['< ₹5k', '₹5k–10k', '₹10k–20k', '₹20k–40k', '> ₹40k']}
        value={data.monthlyAllowance}
        onChange={(v) => set('monthlyAllowance', v)}
      />
    );
  }
  if (data.lifeStage === 'working' || data.lifeStage === 'family') {
    return (
      <div className="space-y-5">
        <RangeSelect
          label="Monthly Income"
          options={INCOME_RANGES}
          value={data.monthlyIncome}
          onChange={(v) => set('monthlyIncome', v)}
        />
        <div>
          <Label>Income Type</Label>
          <div className="flex gap-3">
            {['Salary', 'Business'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('incomeType', t.toLowerCase())}
                className={`flex-1 py-3 rounded-md font-mono text-[13px] border-2 transition-all duration-150 ${
                  data.incomeType === t.toLowerCase()
                    ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                    : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
                }`}
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
                className={`px-5 py-3 rounded-md font-mono text-[13px] border-2 transition-all duration-150 ${
                  data.dependents === d
                    ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                    : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (data.lifeStage === 'retired') {
    return (
      <RangeSelect
        label="Monthly Pension"
        options={INCOME_RANGES}
        value={data.monthlyPension}
        onChange={(v) => set('monthlyPension', v)}
      />
    );
  }
  return null;
}

function Step4({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  const EXPENSE_RANGES = [
    'None',
    '< ₹2k',
    '₹2k–5k',
    '₹5k–10k',
    '₹10k–20k',
    '> ₹20k',
  ];
  const expenses: { key: keyof FormData; label: string; sub: string }[] = [
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
  return (
    <div className="space-y-5">
      {expenses.map((e) => (
        <div key={e.key}>
          <div className="mb-2">
            <span className="font-mono text-[13px] text-white">{e.label}</span>
            <span className="font-mono text-[11px] text-[#555] ml-2">
              {e.sub}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXPENSE_RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set(e.key, r)}
                className={`px-3 py-2 rounded-md font-mono text-[12px] border-2 transition-all duration-150 ${
                  (data[e.key] as string) === r
                    ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                    : 'border-[#2e2e2e] text-[#666] hover:border-[#444] hover:text-[#aaa]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Step5({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <YesNo
        label="Do you currently save money?"
        value={data.savesMoney}
        onChange={(v) => set('savesMoney', v)}
      />
      {data.savesMoney === true && (
        <RangeSelect
          label="Approximate Savings"
          options={SAVINGS_RANGES}
          value={data.approxSavings}
          onChange={(v) => set('approxSavings', v)}
        />
      )}
    </div>
  );
}

function Step6({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  const investmentOptions = ['FD', 'SIP / Mutual Funds', 'Stocks', 'PPF'];
  const toggle = (inv: string) => {
    const cur = data.investments;
    set(
      'investments',
      cur.includes(inv) ? cur.filter((i) => i !== inv) : [...cur, inv],
    );
  };
  return (
    <div className="space-y-6">
      <YesNo
        label="Have you invested before?"
        value={data.investedBefore}
        onChange={(v) => set('investedBefore', v)}
      />
      {data.investedBefore === true && (
        <div>
          <Label>Where have you invested?</Label>
          <div className="flex flex-col gap-2.5">
            {investmentOptions.map((inv) => (
              <CheckChip
                key={inv}
                label={inv}
                checked={data.investments.includes(inv)}
                onChange={() => toggle(inv)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step7({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <YesNo
        label="Do you have health insurance?"
        value={data.healthInsurance}
        onChange={(v) => set('healthInsurance', v)}
      />
      <YesNo
        label="Do you have life insurance?"
        value={data.lifeInsurance}
        onChange={(v) => set('lifeInsurance', v)}
      />
    </div>
  );
}

function Step8({
  data,
  set,
}: {
  data: FormData;
  set: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <YesNo
        label="Do you file income tax?"
        value={data.filesTax}
        onChange={(v) => set('filesTax', v)}
      />
      <YesNo
        label="Would you like to save on taxes?"
        value={data.wantsTaxSave}
        onChange={(v) => set('wantsTaxSave', v)}
      />
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i < step ? 'bg-amber-500' : 'bg-[#2a2a2a]'
          } ${i === step - 1 ? 'flex-2' : 'flex-1'}`}
        />
      ))}
    </div>
  );
}

// ─── Step meta ────────────────────────────────────────────────────────────────

const STEP_META = [
  { title: 'Personal Info', sub: 'Tell us a little about yourself.' },
  { title: 'Life Stage', sub: 'Which best describes you right now?' },
  { title: 'Financial Snapshot', sub: 'Help us understand your income.' },
  {
    title: 'Expense Snapshot',
    sub: 'Roughly how much do you spend each month?',
  },
  { title: 'Savings Status', sub: 'Are you setting money aside?' },
  { title: 'Investments', sub: 'Have you put your money to work?' },
  { title: 'Insurance Check', sub: 'Are you protected?' },
  { title: 'Tax Awareness', sub: 'Last one — this will be fun.' },
];

// ─── Outro screen ─────────────────────────────────────────────────────────────

function OutroScreen({
  wantsTax,
  onDone,
}: {
  wantsTax: boolean | null;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const msg = wantsTax
    ? {
        headline: 'We`ve got you covered.',
        body: 'Sit back — we`ll walk you through everything, one step at a time.',
      }
    : {
        headline: 'We`ll change your mind. 😄',
        body: 'Tax saving isn`t scary. We`ll make sure you never miss out.',
      };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div
        className="text-center max-w-sm transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <div className="text-5xl mb-6">✦</div>
        <h2 className="font-serif text-3xl text-white mb-4 leading-snug">
          {msg.headline}
        </h2>
        <p className="font-mono text-[14px] text-[#888] leading-relaxed mb-10">
          {msg.body}
        </p>
        <button
          onClick={onDone}
          className="bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[13px] tracking-[0.18em] uppercase font-semibold px-10 py-4 rounded-md transition-all duration-200 shadow-lg shadow-amber-500/10"
        >
          Let's go →
        </button>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        .font-mono  { font-family: 'DM Mono', monospace !important; }
      `}</style>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [done, setDone] = useState(false);
  const router = useRouter();

  const set = (key: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const transition = (toStep: number, dir: 'forward' | 'back') => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(toStep);
      setAnimating(false);
    }, 220);
  };

  const next = () => {
    if (step === TOTAL_STEPS) {
      setAnimating(true);
      setTimeout(() => setDone(true), 220);
    } else {
      transition(step + 1, 'forward');
    }
  };

  const back = () => {
    if (step > 1) transition(step - 1, 'back');
  };

  const canProceed = (): boolean => {
    if (step === 1)
      return !!(data.name && data.age && data.gender && data.caste);
    if (step === 2) return !!data.lifeStage;
    if (step === 3) {
      if (data.lifeStage === 'student') return !!data.monthlyAllowance;
      if (data.lifeStage === 'working' || data.lifeStage === 'family')
        return !!(data.monthlyIncome && data.incomeType && data.dependents);
      if (data.lifeStage === 'retired') return !!data.monthlyPension;
    }
    if (step === 5) return data.savesMoney !== null;
    if (step === 6) return data.investedBefore !== null;
    if (step === 7)
      return data.healthInsurance !== null && data.lifeInsurance !== null;
    if (step === 8) return data.filesTax !== null && data.wantsTaxSave !== null;
    return true;
  };

  if (done) {
    return (
      <OutroScreen
        wantsTax={data.wantsTaxSave}
        onDone={() => router.push('/home')}
      />
    );
  }

  const meta = STEP_META[step - 1];
  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1 data={data} set={set} />,
    2: <Step2 data={data} set={set} />,
    3: <Step3 data={data} set={set} />,
    4: <Step4 data={data} set={set} />,
    5: <Step5 data={data} set={set} />,
    6: <Step6 data={data} set={set} />,
    7: <Step7 data={data} set={set} />,
    8: <Step8 data={data} set={set} />,
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-start px-4 py-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 flex items-start justify-center pointer-events-none">
        <div className="w-125 h-100 rounded-full bg-amber-500/5 blur-3xl translate-y-20" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-[13px] tracking-[0.28em] uppercase text-amber-500/70">
            Step {step} of {TOTAL_STEPS}
          </p>
          {step > 1 && (
            <button
              onClick={back}
              className="font-mono text-[16px] text-[#555] hover:text-[#aaa] transition-colors duration-200"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Progress */}
        <ProgressBar step={step} total={TOTAL_STEPS} />

        {/* Card */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-8 py-8 shadow-2xl relative">
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/50 rounded-tl-md" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/50 rounded-br-md" />

          {/* Step title */}
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-white mb-1">
              {meta.title}
            </h2>
            <p className="font-mono text-[12px] text-[#666]">{meta.sub}</p>
          </div>

          {/* Step content with slide animation */}
          <div
            className="transition-all duration-200"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'forward' ? '-20px' : '20px'})`
                : 'translateX(0)',
            }}
          >
            {stepComponents[step]}
          </div>

          <NextBtn
            onClick={next}
            disabled={!canProceed()}
            label={step === TOTAL_STEPS ? 'Finish →' : 'Continue →'}
          />
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step - 1
                  ? 'w-4 h-1.5 bg-amber-500'
                  : i < step - 1
                    ? 'w-1.5 h-1.5 bg-amber-500/40'
                    : 'w-1.5 h-1.5 bg-[#2e2e2e]'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        .font-mono  { font-family: 'DM Mono', monospace !important; }
        select option { background: #1e1e1e; color: white; }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useAuthUser } from '../context/AuthContext';

type LifeStage = 'student' | 'working' | 'family' | 'retired' | '';
type IncomeType = 'salary' | 'business' | '';

interface FormData {
  name: string;
  age: string;
  gender: string;
  caste: string;
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

interface SavedAnswer {
  field_key: string;
  answer: any;
}

function boolText(v: boolean | null) {
  if (v === null) return 'Not answered';
  return v ? 'Yes' : 'No';
}

function mapToBackendPayload(data: FormData) {
  return {
    personal_info: { name: data.name, age: data.age, gender: data.gender, cast: data.caste },
    life_stage: {
      stage:
        data.lifeStage === 'working' ? 'Working Professional'
        : data.lifeStage === 'family' ? 'Family Man'
        : data.lifeStage === 'student' ? 'Student'
        : data.lifeStage === 'retired' ? 'Retired'
        : '',
    },
    dynamic_info: {
      monthly_allowance_range: data.monthlyAllowance,
      monthly_income_range: data.monthlyIncome,
      income_type: data.incomeType,
      dependents: data.dependents,
      monthly_pension_range: data.monthlyPension,
    },
    expense_snapshot: {
      housing: { rent: data.rent, home_loan_emi: data.homeLoan, utilities: data.utilities, internet_cable: data.internet },
      food: data.food,
      transport: data.transport,
    },
    savings_status: {
      currently_save_money: data.savesMoney === null ? '' : data.savesMoney ? 'yes' : 'no',
      approx_savings_range: data.approxSavings,
    },
    investments: {
      invested_before: data.investedBefore === null ? '' : data.investedBefore ? 'yes' : 'no',
      fd: data.investments.includes('FD') ? 'yes' : 'no',
      sip_mutual_funds: data.investments.includes('SIP / Mutual Funds') ? 'yes' : 'no',
      stocks: data.investments.includes('Stocks') ? 'yes' : 'no',
      ppf: data.investments.includes('PPF') ? 'yes' : 'no',
    },
    insurance_check: {
      health_insurance: data.healthInsurance === null ? '' : data.healthInsurance ? 'yes' : 'no',
      life_insurance: data.lifeInsurance === null ? '' : data.lifeInsurance ? 'yes' : 'no',
    },
    tax_awareness: {
      file_income_tax: data.filesTax === null ? '' : data.filesTax ? 'yes' : 'no',
      want_to_save_tax: data.wantsTaxSave === null ? '' : data.wantsTaxSave ? 'yes' : 'no',
    },
    goal_plan: { item_to_buy: '', time_limit: '', target_amount: '' },
  };
}

function formatFieldKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatAnswerDisplay(answer: any): string {
  if (answer === null || answer === undefined) return '—';
  if (typeof answer === 'object' && !Array.isArray(answer)) {
    if ('type' in answer && 'amount' in answer) {
      return `₹${answer.amount} / ${answer.type}`;
    }
    return Object.entries(answer)
      .map(([k, v]) => {
        const val = typeof v === 'object' ? formatAnswerDisplay(v) : String(v ?? '—');
        return `${k.replace(/_/g, ' ')}: ${val}`;
      })
      .join(' · ');
  }
  if (Array.isArray(answer)) {
    if (answer.length === 0) return '—';
    return answer
      .map((item: any) =>
        typeof item === 'object'
          ? `${item.label || '—'}: ₹${item.amount || '—'}`
          : String(item)
      )
      .join(' · ');
  }
  return String(answer) || '—';
}

function renderAdviceValue(value: any): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${renderAdviceValue(v)}`)
      .join('\n');
  }
  if (Array.isArray(value)) {
    return value.map((v) => renderAdviceValue(v)).join(', ');
  }
  return String(value);
}

export default function BudgetingPage() {
  const { user, onboarding, loading } = useAuthUser();

  const storedData: FormData | null = useMemo(() => {
    if (!onboarding) return null;
    return {
      name: onboarding.name, age: onboarding.age, gender: onboarding.gender,
      caste: onboarding.caste, lifeStage: onboarding.lifeStage,
      monthlyAllowance: onboarding.monthlyAllowance, monthlyIncome: onboarding.monthlyIncome,
      incomeType: onboarding.incomeType, dependents: onboarding.dependents,
      monthlyPension: onboarding.monthlyPension, rent: onboarding.rent,
      homeLoan: onboarding.homeLoan, utilities: onboarding.utilities,
      internet: onboarding.internet, food: onboarding.food, transport: onboarding.transport,
      savesMoney: onboarding.savesMoney, approxSavings: onboarding.approxSavings,
      investedBefore: onboarding.investedBefore, investments: onboarding.investments,
      healthInsurance: onboarding.healthInsurance, lifeInsurance: onboarding.lifeInsurance,
      filesTax: onboarding.filesTax, wantsTaxSave: onboarding.wantsTaxSave,
    };
  }, [onboarding]);

  const [sessionId, setSessionId] = useState('');
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [aiState, setAiState] = useState<any>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [currentAnswerType, setCurrentAnswerType] = useState('monthly');
  const [currentAnswerAmount, setCurrentAnswerAmount] = useState('');
  const [currentMultiExpense, setCurrentMultiExpense] = useState([{ label: '', amount: '' }]);

  // Edit state for past answers
  const [editValue, setEditValue] = useState('');
  const [editType, setEditType] = useState('monthly');
  const [editMultiExpense, setEditMultiExpense] = useState([{ label: '', amount: '' }]);

  // Goal plan state — collected before session starts
  const [goalItem, setGoalItem] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalMonths, setGoalMonths] = useState('');

  const backendPayload = useMemo(() => {
    if (!storedData) return null;
    const base = mapToBackendPayload(storedData);
    return {
      ...base,
      goal_plan: {
        item_to_buy: goalItem.trim(),
        time_limit: goalMonths.trim() ? `${goalMonths.trim()} months` : '',
        target_amount: goalAmount.trim(),
      },
    };
  }, [storedData, goalItem, goalAmount, goalMonths]);

  const startBudgeting = async () => {
    if (!backendPayload) return;
  
    setStarting(true);
    try {
      const res = await fetch('http://localhost:8000/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake_data: backendPayload }),
      });
      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);
      setAiState(data.ai);
      setSavedAnswers([]);
    } catch (error) {
      console.error(error);
      alert('Failed to start AI budgeting session.');
    } finally {
      setStarting(false);
    }
  };

  const addExpenseRow = () =>
    setCurrentMultiExpense([...currentMultiExpense, { label: '', amount: '' }]);

  const updateExpenseRow = (index: number, key: 'label' | 'amount', value: string) => {
    const clone = [...currentMultiExpense];
    clone[index][key] = value;
    setCurrentMultiExpense(clone);
  };

  const submitAnswer = async () => {
    if (!sessionId || !aiState) return;
    setSubmitting(true);
    try {
      const key = aiState?.field_key || '';
      let answerPayload: any = currentAnswerAmount;
      if (key.includes('expense') || key.includes('fixed') || key.includes('category')) {
        answerPayload = currentMultiExpense.filter((item) => item.label.trim() || item.amount.trim());
      } else if (key.includes('income_frequency') || key.includes('income') || key.includes('salary')) {
        answerPayload = { type: currentAnswerType, amount: currentAnswerAmount };
      }
      const res = await fetch('http://localhost:8000/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, field_key: aiState?.field_key, answer: answerPayload }),
      });
      const data = await res.json();
      setSavedAnswers(data.saved_answers || []);
      setAiState(data.ai);
      setCurrentAnswerAmount('');
      setCurrentMultiExpense([{ label: '', amount: '' }]);
    } catch (error) {
      console.error(error);
      alert('Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditAnswer = (index: number) => {
    const ans = savedAnswers[index];
    setEditingIndex(index);
    if (typeof ans.answer === 'object' && ans.answer !== null && 'type' in ans.answer && 'amount' in ans.answer) {
      setEditType(ans.answer.type);
      setEditValue(ans.answer.amount);
      setEditMultiExpense([{ label: '', amount: '' }]);
    } else if (Array.isArray(ans.answer) && ans.answer[0]?.label !== undefined) {
      setEditMultiExpense(ans.answer.length > 0 ? ans.answer : [{ label: '', amount: '' }]);
      setEditValue('');
      setEditType('monthly');
    } else {
      setEditValue(String(ans.answer ?? ''));
      setEditType('monthly');
      setEditMultiExpense([{ label: '', amount: '' }]);
    }
  };

  const saveEditAnswer = async () => {
    if (editingIndex === null || !sessionId) return;
    const ans = savedAnswers[editingIndex];
    const key = ans.field_key;
    let answerPayload: any = editValue;
    if (key.includes('expense') || key.includes('fixed') || key.includes('category')) {
      answerPayload = editMultiExpense.filter((item) => item.label.trim() || item.amount.trim());
    } else if (key.includes('income_frequency') || key.includes('income') || key.includes('salary')) {
      answerPayload = { type: editType, amount: editValue };
    }
    setSubmitting(true);
    try {
      // Re-submit the edited answer through the normal /answer endpoint so the AI reruns
      const res = await fetch('http://localhost:8000/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, field_key: key, answer: answerPayload }),
      });
      const data = await res.json();
      setSavedAnswers(data.saved_answers || savedAnswers);
      if (data.ai) setAiState(data.ai);
    } catch {
      // Optimistic local update if server unreachable
      const updated = [...savedAnswers];
      updated[editingIndex] = { ...updated[editingIndex], answer: answerPayload };
      setSavedAnswers(updated);
    } finally {
      setSubmitting(false);
    }
    setEditingIndex(null);
  };

  const resetSession = () => {
    setSessionId('');
    setAiState(null);
    setSavedAnswers([]);
    setCurrentAnswerAmount('');
    setCurrentMultiExpense([{ label: '', amount: '' }]);
    setEditingIndex(null);
  };

  const isIncomeKey = (key: string) =>
    key.includes('income_frequency') || key.includes('income') || key.includes('salary');
  const isExpenseKey = (key: string) =>
    key.includes('expense') || key.includes('fixed') || key.includes('category');

  const renderAnswerInput = (
    key: string,
    val: string, setVal: (v: string) => void,
    typeVal: string, setTypeVal: (v: string) => void,
    multiVal: {label:string;amount:string}[], setMultiVal: (v: {label:string;amount:string}[]) => void,
    onAddRow: () => void,
  ) => {
    if (isExpenseKey(key)) {
      return (
        <div className="space-y-2">
          {multiVal.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2">
              <input placeholder="Label" value={item.label}
                onChange={(e) => { const c=[...multiVal]; c[idx].label=e.target.value; setMultiVal(c); }}
                className={inputBase} />
              <input placeholder="₹ Amount" value={item.amount}
                onChange={(e) => { const c=[...multiVal]; c[idx].amount=e.target.value; setMultiVal(c); }}
                className={inputBase} />
            </div>
          ))}
          <button type="button" onClick={onAddRow} className={ghostBtn}>+ Add row</button>
        </div>
      );
    }
    if (isIncomeKey(key)) {
      return (
        <div className="grid gap-2 grid-cols-[160px_1fr]">
          <select value={typeVal} onChange={(e) => setTypeVal(e.target.value)} className={inputBase}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly</option>
          </select>
          <input placeholder="₹ Amount" value={val} onChange={(e) => setVal(e.target.value)} className={inputBase} />
        </div>
      );
    }
    return <input placeholder="Your answer" value={val} onChange={(e) => setVal(e.target.value)} className={inputBase} />;
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const inputBase =
    'w-full rounded-xl border border-amber-300/10 bg-[#121212]/90 px-4 py-3 text-[13px] text-[#f6efe2] placeholder:text-[#7b7469] outline-none transition duration-300 focus:border-amber-300/45 focus:shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_0_24px_rgba(245,158,11,0.08)]';
  const mono = 'font-mono tracking-[0.08em] uppercase';
  const sectionCard =
    'relative overflow-hidden rounded-[1.75rem] border border-amber-200/10 bg-[#1a1a1a]/88 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.42)]';
  const panelCard =
    'relative rounded-[1.25rem] border border-amber-200/10 bg-[#141414]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_0_1px_rgba(251,191,36,0.03)]';
  const ghostBtn =
    'rounded-xl border border-amber-200/15 bg-transparent px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#d8ccb3] transition duration-300 hover:border-amber-300/40 hover:bg-amber-400/[0.04] hover:text-amber-100 hover:shadow-[0_0_26px_rgba(245,158,11,0.08)]';
  const primaryBtn =
    'rounded-xl border border-amber-300/35 bg-[linear-gradient(180deg,rgba(251,191,36,0.95),rgba(217,119,6,0.92))] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#120f09] shadow-[0_10px_30px_rgba(245,158,11,0.18),0_0_30px_rgba(251,191,36,0.10)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(245,158,11,0.22),0_0_42px_rgba(251,191,36,0.16)] disabled:opacity-50';
  const dangerBtn =
    'rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-red-400/80 transition hover:border-red-400/40 hover:text-red-300';

  const renderProfileRow = (label: string, value: string) => (
    <div key={label} className="flex items-start justify-between gap-4 border-b border-white/[0.04] py-2.5 last:border-b-0">
      <span className={`text-[10px] text-[#8d846f] ${mono}`}>{label}</span>
      <span className="text-right text-sm text-[#f2eadc]">{value || '—'}</span>
    </div>
  );

  // ─── Loading / empty states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className={`text-[11px] text-[#b7a98b] ${mono}`}>Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!user || !storedData) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className={`mb-3 text-[11px] text-[#b7a98b] ${mono}`}>Profile missing</p>
          <h1 className="text-3xl text-[#f5ecde]" style={{ fontFamily: '"DM Serif Display", serif' }}>
            No onboarding data found
          </h1>
          <p className="mt-3 text-sm text-[#9b927f]">
            Please complete the onboarding flow first.
          </p>
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-hidden bg-[#111111] px-4 py-8 text-white md:px-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');
        html { background: #111111; }
        body {
          background:
            radial-gradient(circle at top, rgba(245,158,11,0.10), transparent 26%),
            radial-gradient(circle at 85% 15%, rgba(251,191,36,0.08), transparent 20%),
            radial-gradient(circle at 20% 70%, rgba(180,83,9,0.06), transparent 22%),
            linear-gradient(180deg, #0f0f10 0%, #131313 38%, #101010 100%);
          color: white;
        }
        * { scrollbar-width: thin; scrollbar-color: rgba(251,191,36,0.22) #111111; }
        *::-webkit-scrollbar { width: 10px; height: 10px; }
        *::-webkit-scrollbar-track { background: #111111; }
        *::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.2); border-radius: 999px; border: 2px solid #111111; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-[10%] h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[20%] h-72 w-72 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className={`${sectionCard} mb-6 p-6 md:p-8`}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-amber-300/25" />
            <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-amber-300/25" />
            <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-amber-300/25" />
            <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-amber-300/25" />
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className={`mb-3 text-[11px] text-[#b7a98b] ${mono}`}>Premium budgeting interface</p>
              <h1 className="text-4xl leading-[1.05] text-[#f5ecde] md:text-6xl"
                style={{ fontFamily: '"DM Serif Display", serif' }}>
                Budgeting AI
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#9b927f] md:text-base">
                Your profile is loaded. Start the AI budgeting flow for step-by-step financial guidance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {sessionId && (
                <div className="rounded-full border border-amber-200/10 bg-amber-400/[0.04] px-4 py-2 text-[10px] text-amber-200/80 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  <span className={mono}>Session active</span>
                </div>
              )}
              <button onClick={resetSession} className={ghostBtn}>Reset session</button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

          {/* ── LEFT: Profile ── */}
          <div className="space-y-6">
            <div className={`${sectionCard} p-6 md:p-8`}>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Loaded profile</p>
                  <h2 className="text-3xl text-[#f5ecde]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    Your data
                  </h2>
                </div>

              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Personal</p>
                  {renderProfileRow('Name', storedData.name)}
                  {renderProfileRow('Age', storedData.age)}
                  {renderProfileRow('Gender', storedData.gender)}
                  {renderProfileRow('Caste', storedData.caste)}
                  {renderProfileRow('Life stage', storedData.lifeStage || 'Not answered')}
                </div>

                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Income</p>
                  {renderProfileRow('Monthly allowance', storedData.monthlyAllowance)}
                  {renderProfileRow('Monthly income', storedData.monthlyIncome)}
                  {renderProfileRow('Income type', storedData.incomeType)}
                  {renderProfileRow('Dependents', storedData.dependents)}
                  {renderProfileRow('Monthly pension', storedData.monthlyPension)}
                </div>

                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Expenses</p>
                  {renderProfileRow('Rent', storedData.rent)}
                  {renderProfileRow('Home loan EMI', storedData.homeLoan)}
                  {renderProfileRow('Utilities', storedData.utilities)}
                  {renderProfileRow('Internet', storedData.internet)}
                  {renderProfileRow('Food', storedData.food)}
                  {renderProfileRow('Transport', storedData.transport)}
                </div>

                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Savings & Protection</p>
                  {renderProfileRow('Saves money', boolText(storedData.savesMoney))}
                  {renderProfileRow('Approx savings', storedData.approxSavings)}
                  {renderProfileRow('Invested before', boolText(storedData.investedBefore))}
                  {renderProfileRow('Investments', storedData.investments.join(', ') || '—')}
                  {renderProfileRow('Health insurance', boolText(storedData.healthInsurance))}
                  {renderProfileRow('Life insurance', boolText(storedData.lifeInsurance))}
                  {renderProfileRow('Files tax', boolText(storedData.filesTax))}
                  {renderProfileRow('Wants tax saving', boolText(storedData.wantsTaxSave))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: AI Flow + Saved Answers ── */}
          <div className="space-y-6">

            {/* AI question card */}
            {aiState && (
              <div className={`${sectionCard} p-6 md:p-8`}>
                <div className="mb-5">
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Interactive assistant</p>
                  <h2 className="text-3xl text-[#f5ecde]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    AI budgeting flow
                  </h2>
                </div>

                <div className="rounded-[1.4rem] border border-amber-200/10 bg-[#131313]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_40px_rgba(245,158,11,0.04)]">
                  <span className="mb-4 inline-flex rounded-full border border-amber-300/15 bg-amber-400/[0.04] px-3 py-1.5 text-[10px] text-amber-300">
                    <span className={mono}>{aiState.reply_type}</span>
                  </span>

                  {aiState.question && (
                    <p className="mb-5 text-lg leading-8 text-[#f2eadc]">{aiState.question}</p>
                  )}

                  {aiState.reply_type === 'question' && (
                    <div className="space-y-4">
                      {renderAnswerInput(
                        aiState?.field_key || '',
                        currentAnswerAmount, setCurrentAnswerAmount,
                        currentAnswerType, setCurrentAnswerType,
                        currentMultiExpense, setCurrentMultiExpense,
                        addExpenseRow,
                      )}
                      <button onClick={submitAnswer} disabled={submitting} className={primaryBtn}>
                        {submitting ? 'Submitting…' : 'Submit answer'}
                      </button>
                    </div>
                  )}

                  {aiState.reply_type === 'advice' && aiState.advice && (
                    <div className="mt-4 space-y-3">
                      {/* Goal verdict banner */}
                      {aiState.advice.goal_feasibility && (
                        <div className={`rounded-xl px-4 py-3 border ${
                          aiState.advice.goal_feasibility === 'Realistic'
                            ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
                            : aiState.advice.goal_feasibility === 'Tight'
                            ? 'border-amber-400/20 bg-amber-400/[0.05]'
                            : 'border-red-500/20 bg-red-500/[0.05]'
                        }`}>
                          <p className={`mb-1 text-[10px] ${mono} ${
                            aiState.advice.goal_feasibility === 'Realistic' ? 'text-emerald-400'
                            : aiState.advice.goal_feasibility === 'Tight' ? 'text-amber-400'
                            : 'text-red-400'
                          }`}>{aiState.advice.goal_feasibility}</p>
                          <p className="text-sm text-[#e8dcc6] leading-6">{aiState.advice.goal_verdict}</p>
                        </div>
                      )}

                      {/* Key numbers */}
                      {aiState.advice.summary && (
                        <div className="rounded-xl border border-amber-200/10 bg-[#0f0f0f] px-4 py-3">
                          <p className={`mb-3 text-[10px] text-amber-400 ${mono}`}>Financial snapshot</p>
                          <div className="space-y-1.5">
                            {Object.entries(aiState.advice.summary).map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-4 text-sm">
                                <span className="text-[#8d846f] capitalize">{k.replace(/_/g, ' ')}</span>
                                <span className="text-[#f2eadc] font-mono">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Saving numbers */}
                      {(aiState.advice.required_monthly_saving || aiState.advice.current_monthly_surplus) && (
                        <div className="grid grid-cols-2 gap-2">
                          {aiState.advice.required_monthly_saving && (
                            <div className="rounded-xl border border-amber-200/10 bg-[#0f0f0f] px-4 py-3">
                              <p className={`mb-1 text-[10px] text-amber-400 ${mono}`}>Need to save</p>
                              <p className="text-sm text-[#f2eadc]">{aiState.advice.required_monthly_saving}</p>
                            </div>
                          )}
                          {aiState.advice.current_monthly_surplus && (
                            <div className="rounded-xl border border-amber-200/10 bg-[#0f0f0f] px-4 py-3">
                              <p className={`mb-1 text-[10px] text-amber-400 ${mono}`}>Current surplus</p>
                              <p className="text-sm text-[#f2eadc]">{aiState.advice.current_monthly_surplus}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Timelines */}
                      {(aiState.advice.realistic_timeline || aiState.advice.accelerated_timeline) && (
                        <div className="rounded-xl border border-amber-200/10 bg-[#0f0f0f] px-4 py-3 space-y-2">
                          <p className={`mb-2 text-[10px] text-amber-400 ${mono}`}>Timeline</p>
                          {aiState.advice.realistic_timeline && (
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 text-[#6b6358]">◦</span>
                              <p className="text-sm text-[#d4c9b0]"><span className="text-[#8d846f]">Current pace: </span>{aiState.advice.realistic_timeline}</p>
                            </div>
                          )}
                          {aiState.advice.accelerated_timeline && (
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 text-emerald-500">◦</span>
                              <p className="text-sm text-[#d4c9b0]"><span className="text-emerald-400/70">With cuts: </span>{aiState.advice.accelerated_timeline}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Suggested cuts */}
                      {Array.isArray(aiState.advice.suggested_cuts) && aiState.advice.suggested_cuts.length > 0 && (
                        <div className="rounded-xl border border-amber-200/10 bg-[#0f0f0f] px-4 py-3">
                          <p className={`mb-3 text-[10px] text-amber-400 ${mono}`}>Suggested cuts</p>
                          <div className="space-y-2">
                            {aiState.advice.suggested_cuts.map((cut: string, i: number) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="mt-1 text-amber-400/50 text-xs">✂</span>
                                <p className="text-sm text-[#d4c9b0] leading-6">{cut}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Monthly plan */}
                      {Array.isArray(aiState.advice.monthly_plan) && aiState.advice.monthly_plan.length > 0 && (
                        <div className="rounded-xl border border-amber-200/10 bg-[#0f0f0f] px-4 py-3">
                          <p className={`mb-3 text-[10px] text-amber-400 ${mono}`}>Savings milestones</p>
                          <div className="space-y-1.5">
                            {aiState.advice.monthly_plan.map((step: string, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/40" />
                                <p className="text-sm text-[#d4c9b0]">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Income boost tip */}
                      {aiState.advice.income_boost_tip && (
                        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] px-4 py-3">
                          <p className={`mb-1 text-[10px] text-emerald-400 ${mono}`}>Boost your income</p>
                          <p className="text-sm text-[#d4c9b0] leading-6">{aiState.advice.income_boost_tip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Past answers */}
            {savedAnswers.length > 0 && (
              <div className={`${sectionCard} p-6 md:p-8`}>
                <div className="mb-5">
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Conversation history</p>
                  <h2 className="text-3xl text-[#f5ecde]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    Your answers
                  </h2>
                </div>

                <div className="space-y-3">
                  {savedAnswers.map((ans, index) => (
                    <div key={index} className="rounded-[1.25rem] border border-amber-200/10 bg-[#141414]/95 overflow-hidden">
                      {editingIndex === index ? (
                        /* Edit mode */
                        <div className="p-4 space-y-3">
                          <p className={`text-[10px] text-amber-400 ${mono}`}>
                            Editing — {formatFieldKey(ans.field_key)}
                          </p>
                          {renderAnswerInput(
                            ans.field_key,
                            editValue, setEditValue,
                            editType, setEditType,
                            editMultiExpense, setEditMultiExpense,
                            () => setEditMultiExpense([...editMultiExpense, { label: '', amount: '' }]),
                          )}
                          <div className="flex gap-2 pt-1">
                            <button onClick={saveEditAnswer} className={primaryBtn}>Save</button>
                            <button onClick={() => setEditingIndex(null)} className={ghostBtn}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        /* Display mode */
                        <div className="flex items-start justify-between gap-4 px-5 py-4">
                          <div className="min-w-0">
                            <p className={`mb-1 text-[10px] text-[#8d846f] ${mono}`}>
                              {formatFieldKey(ans.field_key)}
                            </p>
                            <p className="text-sm text-[#f2eadc] leading-6">
                              {formatAnswerDisplay(ans.answer)}
                            </p>
                          </div>
                          <button
                            onClick={() => startEditAnswer(index)}
                            className="shrink-0 rounded-lg border border-amber-200/10 bg-amber-400/[0.04] px-3 py-1.5 text-[10px] text-amber-300/70 transition hover:border-amber-300/30 hover:text-amber-200"
                          >
                            <span className={mono}>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Idle state — Goal capture */}
            {!aiState && (
              <div className={`${sectionCard} p-6 md:p-8`}>
                <div className="mb-5">
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Before we begin</p>
                  <h3 className="text-3xl text-[#f5ecde]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                    Set your goal
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#9b927f]">
                    Tell us what you're saving toward — we'll tell you exactly what to cut, how much to save monthly, and whether your timeline is realistic.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`mb-1.5 block text-[10px] text-[#8d846f] ${mono}`}>What do you want to buy / achieve?</label>
                    <input
                      placeholder="e.g. MacBook Pro, Trip to Japan, Emergency Fund"
                      value={goalItem}
                      onChange={(e) => setGoalItem(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`mb-1.5 block text-[10px] text-[#8d846f] ${mono}`}>Target cost (₹)</label>
                      <input
                        placeholder="e.g. 150000"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        className={inputBase}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className={`mb-1.5 block text-[10px] text-[#8d846f] ${mono}`}>Target months</label>
                      <input
                        placeholder="e.g. 6"
                        value={goalMonths}
                        onChange={(e) => setGoalMonths(e.target.value)}
                        className={inputBase}
                        type="number"
                        min="1"
                      />
                    </div>
                  </div>

                  {goalItem && goalAmount && goalMonths && (
                    <div className="rounded-xl border border-amber-300/10 bg-amber-400/[0.03] px-4 py-3">
                      <p className={`mb-1 text-[10px] text-amber-400 ${mono}`}>Goal summary</p>
                      <p className="text-sm text-[#e8dcc6]">
                        Save ₹{Math.ceil(Number(goalAmount) / Number(goalMonths)).toLocaleString('en-IN')} / month for {goalMonths} months to get <span className="text-amber-300">{goalItem}</span> (₹{Number(goalAmount).toLocaleString('en-IN')})
                      </p>
                    </div>
                  )}

                  <div className="pt-1">
                    <button onClick={startBudgeting} disabled={starting || !goalItem || !goalAmount || !goalMonths} className={`${primaryBtn} w-full`}>
                      {starting ? 'Starting…' : 'Start AI budgeting →'}
                    </button>
                    <p className="mt-2 text-center text-[10px] text-[#6b6358]">All fields required to generate your personalised plan</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useMemo, useState } from 'react';

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

const ONBOARDING_STORAGE_KEY = 'budget_app_onboarding_data';
const BUDGET_SESSION_STORAGE_KEY = 'budget_app_session_id';

function boolText(v: boolean | null) {
  if (v === null) return 'Not answered';
  return v ? 'Yes' : 'No';
}

function mapToBackendPayload(data: FormData) {
  return {
    personal_info: {
      name: data.name,
      age: data.age,
      gender: data.gender,
      cast: data.caste,
    },
    life_stage: {
      stage:
        data.lifeStage === 'working'
          ? 'Working Professional'
          : data.lifeStage === 'family'
          ? 'Family Man'
          : data.lifeStage === 'student'
          ? 'Student'
          : data.lifeStage === 'retired'
          ? 'Retired'
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
      housing: {
        rent: data.rent,
        home_loan_emi: data.homeLoan,
        utilities: data.utilities,
        internet_cable: data.internet,
      },
      food: data.food,
      transport: data.transport,
    },
    savings_status: {
      currently_save_money:
        data.savesMoney === null ? '' : data.savesMoney ? 'yes' : 'no',
      approx_savings_range: data.approxSavings,
    },
    investments: {
      invested_before:
        data.investedBefore === null ? '' : data.investedBefore ? 'yes' : 'no',
      fd: data.investments.includes('FD') ? 'yes' : 'no',
      sip_mutual_funds: data.investments.includes('SIP / Mutual Funds') ? 'yes' : 'no',
      stocks: data.investments.includes('Stocks') ? 'yes' : 'no',
      ppf: data.investments.includes('PPF') ? 'yes' : 'no',
    },
    insurance_check: {
      health_insurance:
        data.healthInsurance === null ? '' : data.healthInsurance ? 'yes' : 'no',
      life_insurance:
        data.lifeInsurance === null ? '' : data.lifeInsurance ? 'yes' : 'no',
    },
    tax_awareness: {
      file_income_tax: data.filesTax === null ? '' : data.filesTax ? 'yes' : 'no',
      want_to_save_tax:
        data.wantsTaxSave === null ? '' : data.wantsTaxSave ? 'yes' : 'no',
    },
    goal_plan: {
      item_to_buy: '',
      time_limit: '',
      target_amount: '',
    },
  };
}

export default function BudgetingPage() {
  const [storedData, setStoredData] = useState<FormData | null>(null);
  const [loadingStorage, setLoadingStorage] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [savedAnswers, setSavedAnswers] = useState<any[]>([]);
  const [aiState, setAiState] = useState<any>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentAnswerType, setCurrentAnswerType] = useState('monthly');
  const [currentAnswerAmount, setCurrentAnswerAmount] = useState('');
  const [currentMultiExpense, setCurrentMultiExpense] = useState([{ label: '', amount: '' }]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const existingSession = localStorage.getItem(BUDGET_SESSION_STORAGE_KEY);

    if (raw) {
      try {
        setStoredData(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse onboarding data', e);
      }
    }

    if (existingSession) {
      setSessionId(existingSession);
    }

    setLoadingStorage(false);
  }, []);

  const backendPayload = useMemo(() => {
    if (!storedData) return null;
    return mapToBackendPayload(storedData);
  }, [storedData]);

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

      if (data.session_id) {
        setSessionId(data.session_id);
        if (typeof window !== 'undefined') {
          localStorage.setItem(BUDGET_SESSION_STORAGE_KEY, data.session_id);
        }
      }

      setAiState(data.ai);
      setSavedAnswers([]);
    } catch (error) {
      console.error(error);
      alert('Failed to start AI budgeting session.');
    } finally {
      setStarting(false);
    }
  };

  const addExpenseRow = () => {
    setCurrentMultiExpense([...currentMultiExpense, { label: '', amount: '' }]);
  };

  const updateExpenseRow = (
    index: number,
    key: 'label' | 'amount',
    value: string
  ) => {
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

      if (
        key.includes('expense') ||
        key.includes('fixed') ||
        key.includes('category')
      ) {
        answerPayload = currentMultiExpense.filter(
          (item) => item.label.trim() || item.amount.trim()
        );
      } else if (
        key.includes('income_frequency') ||
        key.includes('income') ||
        key.includes('salary')
      ) {
        answerPayload = {
          type: currentAnswerType,
          amount: currentAnswerAmount,
        };
      }

      const res = await fetch('http://localhost:8000/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          field_key: aiState?.field_key,
          answer: answerPayload,
        }),
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

  const clearStoredData = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(BUDGET_SESSION_STORAGE_KEY);
    setStoredData(null);
    setSessionId('');
    setAiState(null);
    setSavedAnswers([]);
  };

  const inputBase =
    'w-full rounded-xl border border-amber-300/10 bg-[#121212]/90 px-4 py-3 text-[13px] text-[#f6efe2] placeholder:text-[#7b7469] outline-none transition duration-300 focus:border-amber-300/45 focus:shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_0_24px_rgba(245,158,11,0.08)]';
  const mono = 'font-mono tracking-[0.08em] uppercase';
  const labelClass = `mb-2 block text-[11px] text-[#b7a98b] ${mono}`;
  const sectionCard =
    'relative overflow-hidden rounded-[1.75rem] border border-amber-200/10 bg-[#1a1a1a]/88 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.42)]';
  const panelCard =
    'relative rounded-[1.25rem] border border-amber-200/10 bg-[#141414]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_0_1px_rgba(251,191,36,0.03)]';
  const ghostBtn =
    'rounded-xl border border-amber-200/15 bg-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#d8ccb3] transition duration-300 hover:border-amber-300/40 hover:bg-amber-400/[0.04] hover:text-amber-100 hover:shadow-[0_0_26px_rgba(245,158,11,0.08)]';
  const primaryBtn =
    'rounded-xl border border-amber-300/35 bg-[linear-gradient(180deg,rgba(251,191,36,0.95),rgba(217,119,6,0.92))] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#120f09] shadow-[0_10px_30px_rgba(245,158,11,0.18),0_0_30px_rgba(251,191,36,0.10)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(245,158,11,0.22),0_0_42px_rgba(251,191,36,0.16)] disabled:opacity-50';

  const renderValue = (label: string, value: string) => (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] py-2.5 last:border-b-0">
      <span className={`text-[10px] text-[#8d846f] ${mono}`}>{label}</span>
      <span className="text-right text-sm text-[#f2eadc]">{value || '—'}</span>
    </div>
  );

  const renderDynamicAnswerInput = () => {
    const key = aiState?.field_key || '';

    if (
      key.includes('expense') ||
      key.includes('fixed') ||
      key.includes('category')
    ) {
      return (
        <div className="space-y-3">
          {currentMultiExpense.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-2">
              <input
                placeholder="Expense label"
                value={item.label}
                onChange={(e) => updateExpenseRow(index, 'label', e.target.value)}
                className={`${inputBase} ${mono}`}
              />
              <input
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => updateExpenseRow(index, 'amount', e.target.value)}
                className={`${inputBase} ${mono}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addExpenseRow}
            className={ghostBtn}
          >
            Add expense row
          </button>
        </div>
      );
    }

    if (
      key.includes('income_frequency') ||
      key.includes('income') ||
      key.includes('salary')
    ) {
      return (
        <div className="grid gap-3 md:grid-cols-[190px_1fr]">
          <select
            value={currentAnswerType}
            onChange={(e) => setCurrentAnswerType(e.target.value)}
            className={`${inputBase} ${mono}`}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly</option>
          </select>
          <input
            placeholder="Enter amount"
            value={currentAnswerAmount}
            onChange={(e) => setCurrentAnswerAmount(e.target.value)}
            className={`${inputBase} ${mono}`}
          />
        </div>
      );
    }

    return (
      <input
        placeholder="Type your answer"
        value={currentAnswerAmount}
        onChange={(e) => setCurrentAnswerAmount(e.target.value)}
        className={`${inputBase} ${mono}`}
      />
    );
  };

  if (loadingStorage) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');
          html {
            background: #111111;
          }
          body {
            background:
              radial-gradient(circle at top, rgba(245, 158, 11, 0.08), transparent 30%),
              radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.06), transparent 24%),
              linear-gradient(180deg, #111111 0%, #141414 45%, #101010 100%);
            color: white;
          }
        `}</style>
        <div className="text-center">
          <p className={`text-[11px] text-[#b7a98b] ${mono}`}>Budget AI Portal</p>
          <h1
            className="mt-3 text-4xl text-[#f5ecde]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Loading your saved onboarding data...
          </h1>
        </div>
      </div>
    );
  }

  if (!storedData) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');
          html {
            background: #111111;
          }
          body {
            background:
              radial-gradient(circle at top, rgba(245, 158, 11, 0.08), transparent 30%),
              radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.06), transparent 24%),
              linear-gradient(180deg, #111111 0%, #141414 45%, #101010 100%);
            color: white;
          }
        `}</style>

        <div className={`${sectionCard} max-w-xl w-full p-8`}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-amber-300/25" />
            <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-amber-300/25" />
            <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-amber-300/25" />
            <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-amber-300/25" />
          </div>

          <p className={`mb-3 text-[11px] text-[#b7a98b] ${mono}`}>Restricted access</p>
          <h1
            className="text-4xl leading-tight text-[#f5ecde]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            No onboarding data found
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#9b927f]">
            Please complete the onboarding form first so the budgeting page can load your saved profile and start the budgeting session.
          </p>

          <div className="mt-8">
            <a href="/onboarding" className={`${primaryBtn} inline-block no-underline`}>
              Go to onboarding
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#111111] px-4 py-8 text-white md:px-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

        html {
          background: #111111;
        }

        body {
          background:
            radial-gradient(circle at top, rgba(245, 158, 11, 0.10), transparent 26%),
            radial-gradient(circle at 85% 15%, rgba(251, 191, 36, 0.08), transparent 20%),
            radial-gradient(circle at 20% 70%, rgba(180, 83, 9, 0.06), transparent 22%),
            linear-gradient(180deg, #0f0f10 0%, #131313 38%, #101010 100%);
          color: white;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(251, 191, 36, 0.22) #111111;
        }

        *::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        *::-webkit-scrollbar-track {
          background: #111111;
        }

        *::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.2);
          border-radius: 999px;
          border: 2px solid #111111;
        }

        details > summary {
          list-style: none;
        }

        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-[10%] h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[20%] h-72 w-72 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
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
              <h1
                className="text-4xl leading-[1.05] text-[#f5ecde] md:text-6xl"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                Budgeting AI
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#9b927f] md:text-base">
                Your onboarding profile has been loaded from local storage. Review the data, then launch the AI budgeting flow for one-question-at-a-time financial guidance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {sessionId && (
                <div className="rounded-full border border-amber-200/10 bg-amber-400/[0.04] px-4 py-2 text-[10px] text-amber-200/80 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
                  <span className={mono}>Session active</span>
                </div>
              )}
              <button onClick={clearStoredData} className={ghostBtn}>
                Clear local data
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className={`${sectionCard} p-6 md:p-8`}>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Stored profile</p>
                  <h2
                    className="text-3xl text-[#f5ecde]"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
                    Saved onboarding data
                  </h2>
                </div>

                {!aiState && (
                  <button
                    onClick={startBudgeting}
                    disabled={starting}
                    className={primaryBtn}
                  >
                    {starting ? 'Starting...' : 'Start AI budgeting'}
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Personal</p>
                  {renderValue('Name', storedData.name)}
                  {renderValue('Age', storedData.age)}
                  {renderValue('Gender', storedData.gender)}
                  {renderValue('Caste', storedData.caste)}
                  {renderValue('Life stage', storedData.lifeStage || 'Not answered')}
                </div>

                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Income</p>
                  {renderValue('Monthly allowance', storedData.monthlyAllowance)}
                  {renderValue('Monthly income', storedData.monthlyIncome)}
                  {renderValue('Income type', storedData.incomeType)}
                  {renderValue('Dependents', storedData.dependents)}
                  {renderValue('Monthly pension', storedData.monthlyPension)}
                </div>

                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Expenses</p>
                  {renderValue('Rent', storedData.rent)}
                  {renderValue('Home loan', storedData.homeLoan)}
                  {renderValue('Utilities', storedData.utilities)}
                  {renderValue('Internet', storedData.internet)}
                  {renderValue('Food', storedData.food)}
                  {renderValue('Transport', storedData.transport)}
                </div>

                <div className={panelCard}>
                  <p className={`mb-4 text-[11px] text-amber-300 ${mono}`}>Savings / Protection</p>
                  {renderValue('Saves money', boolText(storedData.savesMoney))}
                  {renderValue('Approx savings', storedData.approxSavings)}
                  {renderValue('Invested before', boolText(storedData.investedBefore))}
                  {renderValue('Investments', storedData.investments.join(', ') || '—')}
                  {renderValue('Health insurance', boolText(storedData.healthInsurance))}
                  {renderValue('Life insurance', boolText(storedData.lifeInsurance))}
                  {renderValue('Files tax', boolText(storedData.filesTax))}
                  {renderValue('Wants tax save', boolText(storedData.wantsTaxSave))}
                </div>
              </div>

              <div className="mt-6">
                <details className="rounded-[1.25rem] border border-amber-200/10 bg-[#131313] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <summary className={`cursor-pointer select-none text-[11px] text-[#d7c8a5] ${mono}`}>
                    View raw JSON
                  </summary>
                  <pre className="mt-4 overflow-auto rounded-xl border border-amber-300/10 bg-[#0f0f0f] p-4 text-xs leading-6 text-emerald-300/90">
                    {JSON.stringify(storedData, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {aiState && (
              <div className={`${sectionCard} p-6 md:p-8`}>
                <div className="mb-6">
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Interactive assistant</p>
                  <h2
                    className="text-3xl text-[#f5ecde]"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
                    AI budgeting flow
                  </h2>
                </div>

                <div className="rounded-[1.4rem] border border-amber-200/10 bg-[#131313]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_0_1px_rgba(251,191,36,0.03),0_0_40px_rgba(245,158,11,0.04)]">
                  <div className="mb-5 inline-flex rounded-full border border-amber-300/15 bg-amber-400/[0.04] px-3 py-1.5 text-[10px] text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
                    <span className={mono}>{aiState.reply_type}</span>
                  </div>

                  {aiState.question && (
                    <p className="mb-5 text-lg leading-8 text-[#f2eadc]">
                      {aiState.question}
                    </p>
                  )}

                  {aiState.reply_type === 'question' && (
                    <div className="space-y-4">
                      {renderDynamicAnswerInput()}
                      <button
                        onClick={submitAnswer}
                        disabled={submitting}
                        className={primaryBtn}
                      >
                        {submitting ? 'Submitting...' : 'Submit answer'}
                      </button>
                    </div>
                  )}

                  {aiState.reply_type === 'advice' && (
                    <pre className="overflow-auto rounded-xl border border-amber-300/10 bg-[#0f0f0f] p-4 text-sm leading-7 text-emerald-300/90">
                      {JSON.stringify(aiState.advice, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {savedAnswers.length > 0 && (
              <div className={`${sectionCard} p-6 md:p-8`}>
                <div className="mb-6">
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Conversation memory</p>
                  <h2
                    className="text-3xl text-[#f5ecde]"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
                    Saved answers
                  </h2>
                </div>

                <pre className="overflow-auto rounded-[1.25rem] border border-amber-300/10 bg-[#0f0f0f] p-5 text-sm leading-7 text-emerald-300/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  {JSON.stringify(savedAnswers, null, 2)}
                </pre>
              </div>
            )}

            {!aiState && (
              <div className={`${sectionCard} p-6 md:p-8`}>
                <div className="rounded-[1.4rem] border border-dashed border-amber-300/15 bg-[#131313]/90 p-6">
                  <p className={`mb-2 text-[11px] text-[#b7a98b] ${mono}`}>Awaiting launch</p>
                  <h3
                    className="text-2xl text-[#f5ecde]"
                    style={{ fontFamily: '"DM Serif Display", serif' }}
                  >
                    Ready to begin
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#9b927f]">
                    Start the AI budgeting session to begin a guided one-question-at-a-time financial interview based on the onboarding data already loaded above.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
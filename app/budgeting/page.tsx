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
            <div key={index} className="grid grid-cols-2 gap-3">
              <input
                placeholder="Expense label"
                value={item.label}
                onChange={(e) => updateExpenseRow(index, 'label', e.target.value)}
                className="w-full bg-[#141414] border border-[#333] rounded-md px-4 py-3 text-white"
              />
              <input
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => updateExpenseRow(index, 'amount', e.target.value)}
                className="w-full bg-[#141414] border border-[#333] rounded-md px-4 py-3 text-white"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addExpenseRow}
            className="px-4 py-3 rounded-md border border-[#444] text-[#ccc]"
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
        <div className="grid grid-cols-[180px_1fr] gap-3">
          <select
            value={currentAnswerType}
            onChange={(e) => setCurrentAnswerType(e.target.value)}
            className="w-full bg-[#141414] border border-[#333] rounded-md px-4 py-3 text-white"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly</option>
          </select>
          <input
            placeholder="Enter amount"
            value={currentAnswerAmount}
            onChange={(e) => setCurrentAnswerAmount(e.target.value)}
            className="w-full bg-[#141414] border border-[#333] rounded-md px-4 py-3 text-white"
          />
        </div>
      );
    }

    return (
      <input
        placeholder="Type your answer"
        value={currentAnswerAmount}
        onChange={(e) => setCurrentAnswerAmount(e.target.value)}
        className="w-full bg-[#141414] border border-[#333] rounded-md px-4 py-3 text-white"
      />
    );
  };

  if (loadingStorage) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        Loading your saved onboarding data...
      </div>
    );
  }

  if (!storedData) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h1 className="text-2xl mb-3">No onboarding data found</h1>
          <p className="text-[#999] mb-6">
            Please complete the onboarding form first so the budgeting page can load your saved data.
          </p>
          <a
            href="/onboarding"
            className="inline-block bg-amber-500 text-[#141414] px-5 py-3 rounded-md font-semibold"
          >
            Go to onboarding
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto grid gap-6">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Budgeting AI</h1>
              <p className="text-[#999]">
                Loaded your initial onboarding data from local storage.
              </p>
            </div>
            <button
              onClick={clearStoredData}
              className="px-4 py-2 rounded-md border border-[#444] text-[#ddd]"
            >
              Clear local data
            </button>
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-semibold">Saved onboarding data</h2>
            {!aiState && (
              <button
                onClick={startBudgeting}
                disabled={starting}
                className="bg-amber-500 text-[#141414] px-5 py-3 rounded-md font-semibold disabled:opacity-50"
              >
                {starting ? 'Starting...' : 'Start AI budgeting'}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#151515] rounded-lg p-4 border border-[#2a2a2a]">
              <h3 className="text-amber-400 mb-3">Personal</h3>
              <p><strong>Name:</strong> {storedData.name}</p>
              <p><strong>Age:</strong> {storedData.age}</p>
              <p><strong>Gender:</strong> {storedData.gender}</p>
              <p><strong>Caste:</strong> {storedData.caste}</p>
              <p><strong>Life Stage:</strong> {storedData.lifeStage || 'Not answered'}</p>
            </div>

            <div className="bg-[#151515] rounded-lg p-4 border border-[#2a2a2a]">
              <h3 className="text-amber-400 mb-3">Income</h3>
              <p><strong>Monthly Allowance:</strong> {storedData.monthlyAllowance || '—'}</p>
              <p><strong>Monthly Income:</strong> {storedData.monthlyIncome || '—'}</p>
              <p><strong>Income Type:</strong> {storedData.incomeType || '—'}</p>
              <p><strong>Dependents:</strong> {storedData.dependents || '—'}</p>
              <p><strong>Monthly Pension:</strong> {storedData.monthlyPension || '—'}</p>
            </div>

            <div className="bg-[#151515] rounded-lg p-4 border border-[#2a2a2a]">
              <h3 className="text-amber-400 mb-3">Expenses</h3>
              <p><strong>Rent:</strong> {storedData.rent || '—'}</p>
              <p><strong>Home Loan:</strong> {storedData.homeLoan || '—'}</p>
              <p><strong>Utilities:</strong> {storedData.utilities || '—'}</p>
              <p><strong>Internet:</strong> {storedData.internet || '—'}</p>
              <p><strong>Food:</strong> {storedData.food || '—'}</p>
              <p><strong>Transport:</strong> {storedData.transport || '—'}</p>
            </div>

            <div className="bg-[#151515] rounded-lg p-4 border border-[#2a2a2a]">
              <h3 className="text-amber-400 mb-3">Savings / Protection</h3>
              <p><strong>Saves Money:</strong> {boolText(storedData.savesMoney)}</p>
              <p><strong>Approx Savings:</strong> {storedData.approxSavings || '—'}</p>
              <p><strong>Invested Before:</strong> {boolText(storedData.investedBefore)}</p>
              <p><strong>Investments:</strong> {storedData.investments.join(', ') || '—'}</p>
              <p><strong>Health Insurance:</strong> {boolText(storedData.healthInsurance)}</p>
              <p><strong>Life Insurance:</strong> {boolText(storedData.lifeInsurance)}</p>
              <p><strong>Files Tax:</strong> {boolText(storedData.filesTax)}</p>
              <p><strong>Wants Tax Save:</strong> {boolText(storedData.wantsTaxSave)}</p>
            </div>
          </div>

          <div className="mt-6">
            <details className="bg-[#151515] rounded-lg p-4 border border-[#2a2a2a]">
              <summary className="cursor-pointer text-[#ddd]">View raw JSON</summary>
              <pre className="mt-4 overflow-auto text-xs text-green-300">
                {JSON.stringify(storedData, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {aiState && (
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">AI budgeting flow</h2>

            <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-5">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs mb-4">
                {aiState.reply_type}
              </div>

              {aiState.question && (
                <p className="text-lg mb-4">{aiState.question}</p>
              )}

              {aiState.reply_type === 'question' && (
                <div className="space-y-4">
                  {renderDynamicAnswerInput()}
                  <button
                    onClick={submitAnswer}
                    disabled={submitting}
                    className="bg-amber-500 text-[#141414] px-5 py-3 rounded-md font-semibold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit answer'}
                  </button>
                </div>
              )}

              {aiState.reply_type === 'advice' && (
                <pre className="overflow-auto text-sm text-green-300">
                  {JSON.stringify(aiState.advice, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {savedAnswers.length > 0 && (
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Saved answers</h2>
            <pre className="overflow-auto text-sm text-green-300">
              {JSON.stringify(savedAnswers, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
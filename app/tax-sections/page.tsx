'use client';

import React, { useState } from 'react';
import { useAuthUser } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { IndianRupee, Sparkles, User as UserIcon, Bot, Receipt } from 'lucide-react';

type OnboardingFormData = {
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
};

type SectionUsed = {
  section: string;
  title: string;
  approx_limit?: string;
  why_relevant?: string;
  concrete_actions?: string[];
};

type TaxAdvice = {
  summary: string;
  regime_hint: string;
  sections_used: SectionUsed[];
  suggestions: string[];
  warnings: string[];
};

const mono =
  'font-mono tracking-[0.08em] uppercase';
const inputBase =
  'w-full rounded-xl border border-amber-300/10 bg-[#121212]/90 px-4 py-3 text-[13px] text-[#f6efe2] placeholder:text-[#7b7469] outline-none transition duration-300 focus:border-amber-300/45 focus:shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_0_24px_rgba(245,158,11,0.08)]';
const primaryBtn =
  'rounded-xl border border-amber-300/35 bg-[linear-gradient(180deg,rgba(251,191,36,0.95),rgba(217,119,6,0.92))] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#120f09] shadow-[0_10px_30px_rgba(245,158,11,0.18),0_0_30px_rgba(251,191,36,0.10)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(245,158,11,0.22),0_0_42px_rgba(251,191,36,0.16)] disabled:opacity-50';

function boolText(v: boolean | null) {
  if (v === null) return 'Not answered';
  return v ? 'Yes' : 'No';
}

const TaxAssistantPage = () => {
  const router = useRouter();
  const { user, loading, onboarding } = useAuthUser() as {
    user: any;
    loading: boolean;
    onboarding: OnboardingFormData | null;
  };

  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState<TaxAdvice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAsk = async () => {
    if (!onboarding || !question.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:8000/tax-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboarding,
          question,
        }),
      });

      const data = await res.json();
      setAdvice(data);
    } catch (e) {
      console.error(e);
      alert('Failed to get tax advice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
        <p className={`text-[11px] text-[#b7a98b] ${mono}`}>Loading profile...</p>
      </div>
    );
  }

  if (!user || !onboarding) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className={`mb-3 text-[11px] text-[#b7a98b] ${mono}`}>Tax helper</p>
          <h1
            className="text-3xl text-[#f5ecde]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            No onboarding data found
          </h1>
          <p className="mt-3 text-sm text-[#9b927f]">
            Complete the onboarding so we can use your income, rent, loan, and insurance details to
            suggest tax sections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#111111] px-4 py-8 text-white md:px-6">
      {/* You can reuse the same global styles snippet as in BudgetingPage */}

      {/* Simple top bar */}
      <nav className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/15 bg-amber-500/10 text-amber-300">
            <Sparkles size={18} />
          </div>
          <div className="text-left">
            <div className="font-semibold tracking-tight text-white text-sm">
              MONEY<span className="text-amber-400">MITRA</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-[#8f877a]">
              Tax & Savings Helper
            </div>
          </div>
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141414] px-3 py-2">
          <div className="text-right leading-tight">
            <div className={`text-[9px] text-[#b7a98b] ${mono}`}>Signed in as</div>
            <div className="text-sm text-[#f5ecde]">
              {onboarding.name || user.phoneNumber || 'User'}
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#111111]">
            <UserIcon size={16} className="text-amber-300" />
          </div>
        </div>
      </nav>

      <div className="relative mx-auto max-w-6xl grid gap-6 md:grid-cols-[1.1fr_1.1fr]">
        {/* Left: tax-relevant snapshot */}
        <section className="rounded-[1.5rem] border border-amber-200/10 bg-[#1a1a1a]/90 p-6 md:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className={`mb-2 text-[11px] text-amber-300 ${mono}`}>Profile snapshot</p>
              <h2
                className="text-2xl text-[#f5ecde]"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                Income & deductions
              </h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#141414]">
              <Receipt className="text-amber-300" size={18} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.1rem] border border-amber-200/10 bg-[#131313]/95 p-4">
              <p className={`mb-3 text-[11px] text-amber-300 ${mono}`}>Basics</p>
              <Line label="Life stage" value={onboarding.lifeStage || '—'} />
              <Line label="Income type" value={onboarding.incomeType || '—'} />
              <Line label="Monthly income" value={onboarding.monthlyIncome || '—'} />
              <Line label="Dependents" value={onboarding.dependents || '—'} />
            </div>

            <div className="rounded-[1.1rem] border border-amber-200/10 bg-[#131313]/95 p-4">
              <p className={`mb-3 text-[11px] text-amber-300 ${mono}`}>Home & health</p>
              <Line label="Rent" value={onboarding.rent || '—'} />
              <Line label="Home loan EMI" value={onboarding.homeLoan || '—'} />
              <Line label="Health insurance" value={boolText(onboarding.healthInsurance)} />
              <Line label="Files income tax" value={boolText(onboarding.filesTax)} />
              <Line label="Wants to save tax" value={boolText(onboarding.wantsTaxSave)} />
            </div>
          </div>

          <div className="mt-4 rounded-[1.1rem] border border-amber-200/10 bg-[#131313]/95 p-4">
            <p className={`mb-3 text-[11px] text-amber-300 ${mono}`}>Investments & savings</p>
            <Line label="Approx savings" value={onboarding.approxSavings || '—'} />
            <Line label="Invested before" value={boolText(onboarding.investedBefore)} />
            <Line
              label="Investment types"
              value={onboarding.investments.length ? onboarding.investments.join(', ') : '—'}
            />
          </div>
        </section>

        {/* Right: AI tax assistant */}
        <section className="rounded-[1.5rem] border border-amber-200/10 bg-[#1a1a1a]/90 p-6 md:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className={`mb-2 text-[11px] text-amber-300 ${mono}`}>AI help</p>
              <h2
                className="text-2xl text-[#f5ecde]"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                Ask about tax saving
              </h2>
              <p className="mt-2 text-sm text-[#9b927f]">
                Describe your situation (income, old/new regime, home loan, insurance) in plain
                language. The assistant will map it to sections like 80C, 80D, 80CCD, 24(b), HRA,
                etc.
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#141414]">
              <Bot className="text-amber-300" size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={4}
              className={`${inputBase} ${mono}`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: I earn ₹9L salary, pay ₹18k rent in a metro, have a home loan interest of ₹1.8L and PPF of ₹60k. Which sections should I use and old vs new regime?"
            />
            <button
              className={primaryBtn}
              onClick={handleAsk}
              disabled={submitting || !question.trim()}
            >
              {submitting ? 'Thinking…' : 'Ask AI for tax plan'}
            </button>
          </div>

          {advice && (
            <div className="mt-6 rounded-[1.25rem] border border-amber-200/10 bg-[#131313]/95 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] text-amber-300 ${mono}`}>AI summary</span>
                <span className={`rounded-full border border-amber-200/20 px-3 py-1 text-[9px] ${mono} text-[#e5d7b4]`}>
                  Regime hint: {advice.regime_hint || 'depends'}
                </span>
              </div>
              <p className="text-sm leading-7 text-[#f2eadc]">{advice.summary}</p>

              {advice.sections_used?.length > 0 && (
                <div className="space-y-3">
                  <p className={`text-[10px] text-[#b7a98b] ${mono}`}>Sections to focus on</p>
                  <div className="space-y-3">
                    {advice.sections_used.map((sec) => (
                      <div
                        key={sec.section + sec.title}
                        className="rounded-xl border border-amber-200/15 bg-[#111111] p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className={`text-[10px] text-amber-300 ${mono}`}>
                              {sec.section}
                            </div>
                            <div className="text-sm font-medium text-[#f5ecde]">
                              {sec.title}
                            </div>
                          </div>
                          {sec.approx_limit && (
                            <div className="rounded-full border border-amber-200/20 px-3 py-1 text-[10px] text-[#e5d7b4]">
                              Limit: {sec.approx_limit}
                            </div>
                          )}
                        </div>
                        {sec.why_relevant && (
                          <p className="mt-2 text-xs leading-6 text-[#b7a98b]">
                            {sec.why_relevant}
                          </p>
                        )}
                        {sec.concrete_actions && sec.concrete_actions.length > 0 && (
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[#d3c7b0]">
                            {sec.concrete_actions.map((a) => (
                              <li key={a}>{a}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {advice.suggestions?.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-[10px] text-[#b7a98b] ${mono}`}>Next steps</p>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-[#d3c7b0]">
                    {advice.suggestions.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {advice.warnings?.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-[10px] text-[#b7a98b] ${mono}`}>Notes</p>
                  <ul className="list-disc space-y-1 pl-4 text-[11px] text-[#f59e0b]">
                    {advice.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Line = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] py-2 last:border-b-0">
    <span className={`text-[10px] text-[#8d846f] ${mono}`}>{label}</span>
    <span className="text-right text-sm text-[#f2eadc]">{value || '—'}</span>
  </div>
);

export default TaxAssistantPage;
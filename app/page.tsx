"use client";

import { useMemo, useState } from "react";

const HARDCODED_INITIAL_DATA = {
  personal_info: {
    name: "Rahul Sharma",
    age: "29",
    gender: "Male",
    cast: "General",
  },
  life_stage: {
    stage: "Working Professional",
  },
  dynamic_info: {
    monthly_allowance_range: "",
    monthly_income_range: "₹45,000 - ₹55,000",
    income_type: "salary",
    dependents: "2",
    monthly_pension_range: "",
  },
  expense_snapshot: {
    housing: {
      rent: "12000",
      home_loan_emi: "0",
      utilities: "2500",
      internet_cable: "800",
    },
    food: "7000",
    transport: "3500",
  },
  savings_status: {
    currently_save_money: "yes",
    approx_savings_range: "₹5,000 - ₹10,000",
  },
  investments: {
    invested_before: "yes",
    fd: "yes",
    sip_mutual_funds: "yes",
    stocks: "no",
    ppf: "yes",
  },
  insurance_check: {
    health_insurance: "yes",
    life_insurance: "no",
  },
  tax_awareness: {
    file_income_tax: "yes",
    want_to_save_tax: "yes",
  },
  goal_plan: {
    item_to_buy: "Laptop",
    time_limit: "8 months",
    target_amount: "80000",
  },
};

type ExpenseRow = {
  label: string;
  amount: string;
};

type AnswerItem = {
  field_key: string;
  answer: any;
};

export default function HomePage() {
  const [formData, setFormData] = useState(HARDCODED_INITIAL_DATA);
  const [sessionId, setSessionId] = useState("");
  const [savedAnswers, setSavedAnswers] = useState<AnswerItem[]>([]);
  const [aiState, setAiState] = useState<any>(null);
  const [currentAnswerValue, setCurrentAnswerValue] = useState("");
  const [currentMultiExpense, setCurrentMultiExpense] = useState<ExpenseRow[]>([
    { label: "", amount: "" },
  ]);

  const inputClass =
    "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
  const labelClass = "text-sm font-medium text-slate-700";

  const setNestedValue = (path: string[], value: string) => {
    const clone: any = structuredClone(formData);
    let current = clone;
    for (let i = 0; i < path.length - 1; i++) current = current[path[i]];
    current[path[path.length - 1]] = value;
    setFormData(clone);
  };

  const startSession = async () => {
    const res = await fetch("http://localhost:8000/start-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ intake_data: formData }),
    });

    const data = await res.json();
    setSessionId(data.session_id);
    setSavedAnswers(data.saved_answers || []);
    setAiState(data.ai);
    setCurrentAnswerValue("");
    setCurrentMultiExpense([{ label: "", amount: "" }]);
  };

  const addExpenseRow = () => {
    setCurrentMultiExpense((prev) => [...prev, { label: "", amount: "" }]);
  };

  const updateExpenseRow = (
    index: number,
    key: "label" | "amount",
    value: string
  ) => {
    const clone = [...currentMultiExpense];
    clone[index][key] = value;
    setCurrentMultiExpense(clone);
  };

  const submitAnswer = async () => {
    if (!sessionId || !aiState?.field_key) return;

    let answerPayload: any = currentAnswerValue;

    if (
      aiState.field_key === "fixed_expenses" ||
      aiState.field_key === "variable_expenses"
    ) {
      answerPayload = currentMultiExpense.filter(
        (item) => item.label.trim() && item.amount.trim()
      );
    }

    const res = await fetch("http://localhost:8000/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        field_key: aiState.field_key,
        answer: answerPayload,
      }),
    });

    const data = await res.json();
    setSavedAnswers(data.saved_answers || []);
    setAiState(data.ai);
    setCurrentAnswerValue("");
    setCurrentMultiExpense([{ label: "", amount: "" }]);
  };

  const answerMap = useMemo(() => {
    const map: Record<string, any> = {};
    for (const item of savedAnswers) {
      map[item.field_key] = item.answer;
    }
    return map;
  }, [savedAnswers]);

  const updateSavedAnswer = (fieldKey: string, value: any) => {
    setSavedAnswers((prev) =>
      prev.map((item) =>
        item.field_key === fieldKey ? { ...item, answer: value } : item
      )
    );
  };

  const updateSavedExpenseAnswer = (
    fieldKey: string,
    index: number,
    key: "label" | "amount",
    value: string
  ) => {
    setSavedAnswers((prev) =>
      prev.map((item) => {
        if (item.field_key !== fieldKey) return item;
        const updated = [...item.answer];
        updated[index][key] = value;
        return { ...item, answer: updated };
      })
    );
  };

  const addSavedExpenseRow = (fieldKey: string) => {
    setSavedAnswers((prev) =>
      prev.map((item) => {
        if (item.field_key !== fieldKey) return item;
        return {
          ...item,
          answer: [...item.answer, { label: "", amount: "" }],
        };
      })
    );
  };

  const labelFromFieldKey = (key: string) => {
    const map: Record<string, string> = {
      income_frequency: "Income Frequency",
      income_amount: "Income Amount",
      fixed_expenses: "Fixed Expenses",
      variable_expenses: "Variable Expenses",
      current_savings_exact: "Current Savings",
      lifestyle_preferences: "Lifestyle Preferences",
      goal_confirmation: "Goal Confirmation",
    };
    return map[key] || key;
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );

  const renderDynamicAnswerInput = () => {
    const inputType = aiState?.input_type || "";
    const options = aiState?.options || [];

    if (inputType === "multi_expense") {
      return (
        <div className="space-y-3">
          {currentMultiExpense.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-2">
              <input
                className={inputClass}
                placeholder="Expense label"
                value={item.label}
                onChange={(e) => updateExpenseRow(index, "label", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => updateExpenseRow(index, "amount", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addExpenseRow}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add expense row
          </button>
        </div>
      );
    }

    if (inputType === "select") {
      return (
        <select
          className={inputClass}
          value={currentAnswerValue}
          onChange={(e) => setCurrentAnswerValue(e.target.value)}
        >
          <option value="">Select an option</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (inputType === "yes_no") {
      return (
        <select
          className={inputClass}
          value={currentAnswerValue}
          onChange={(e) => setCurrentAnswerValue(e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      );
    }

    if (inputType === "number") {
      return (
        <input
          type="number"
          className={inputClass}
          placeholder="Enter amount in rupees"
          value={currentAnswerValue}
          onChange={(e) => setCurrentAnswerValue(e.target.value)}
        />
      );
    }

    return (
      <textarea
        rows={4}
        className={inputClass}
        placeholder="Type your answer"
        value={currentAnswerValue}
        onChange={(e) => setCurrentAnswerValue(e.target.value)}
      />
    );
  };

  const renderEditablePreviousAnswers = () => {
    if (savedAnswers.length === 0) return null;

    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-slate-900">Previous Inputs</h2>
          <p className="mt-1 text-sm text-slate-500">
            These are the answers already collected. You can edit them directly.
          </p>
        </div>

        <div className="space-y-5">
          {savedAnswers.map((item) => {
            if (
              item.field_key === "fixed_expenses" ||
              item.field_key === "variable_expenses"
            ) {
              return (
                <div
                  key={item.field_key}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <h3 className="text-base font-semibold text-slate-900">
                    {labelFromFieldKey(item.field_key)}
                  </h3>
                  <div className="mt-3 space-y-3">
                    {(item.answer || []).map((row: ExpenseRow, index: number) => (
                      <div key={index} className="grid gap-3 md:grid-cols-2">
                        <input
                          className={inputClass}
                          value={row.label}
                          onChange={(e) =>
                            updateSavedExpenseAnswer(
                              item.field_key,
                              index,
                              "label",
                              e.target.value
                            )
                          }
                        />
                        <input
                          className={inputClass}
                          value={row.amount}
                          onChange={(e) =>
                            updateSavedExpenseAnswer(
                              item.field_key,
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSavedExpenseRow(item.field_key)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Add row
                    </button>
                  </div>
                </div>
              );
            }

            if (
              item.field_key === "income_frequency" ||
              item.field_key === "goal_confirmation"
            ) {
              const options =
                item.field_key === "income_frequency"
                  ? ["monthly", "weekly", "hourly"]
                  : ["yes", "no"];

              return (
                <div
                  key={item.field_key}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <label className="text-base font-semibold text-slate-900">
                    {labelFromFieldKey(item.field_key)}
                  </label>
                  <select
                    className={inputClass}
                    value={item.answer}
                    onChange={(e) => updateSavedAnswer(item.field_key, e.target.value)}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            const isTextarea = item.field_key === "lifestyle_preferences";

            return (
              <div
                key={item.field_key}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <label className="text-base font-semibold text-slate-900">
                  {labelFromFieldKey(item.field_key)}
                </label>
                {isTextarea ? (
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={item.answer}
                    onChange={(e) => updateSavedAnswer(item.field_key, e.target.value)}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={item.answer}
                    onChange={(e) => updateSavedAnswer(item.field_key, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Budgeting AI App</h1>
          <p className="mt-2 max-w-3xl text-sm text-emerald-50">
            Edit intake data, answer one question at a time, and review previous
            inputs without raw JSON.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Initial Intake Form
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Hardcoded data is prefilled and fully editable.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Personal Info
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name">
                    <input
                      className={inputClass}
                      value={formData.personal_info.name}
                      onChange={(e) =>
                        setNestedValue(["personal_info", "name"], e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Age">
                    <input
                      className={inputClass}
                      value={formData.personal_info.age}
                      onChange={(e) =>
                        setNestedValue(["personal_info", "age"], e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Gender">
                    <input
                      className={inputClass}
                      value={formData.personal_info.gender}
                      onChange={(e) =>
                        setNestedValue(["personal_info", "gender"], e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Cast">
                    <input
                      className={inputClass}
                      value={formData.personal_info.cast}
                      onChange={(e) =>
                        setNestedValue(["personal_info", "cast"], e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Life Stage
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Life Stage">
                    <select
                      className={inputClass}
                      value={formData.life_stage.stage}
                      onChange={(e) =>
                        setNestedValue(["life_stage", "stage"], e.target.value)
                      }
                    >
                      <option>Student</option>
                      <option>Working Professional</option>
                      <option>Family Man</option>
                      <option>Retired</option>
                    </select>
                  </Field>

                  <Field label="Monthly Income Range">
                    <input
                      className={inputClass}
                      value={formData.dynamic_info.monthly_income_range}
                      onChange={(e) =>
                        setNestedValue(
                          ["dynamic_info", "monthly_income_range"],
                          e.target.value
                        )
                      }
                    />
                  </Field>

                  <Field label="Income Type">
                    <select
                      className={inputClass}
                      value={formData.dynamic_info.income_type}
                      onChange={(e) =>
                        setNestedValue(["dynamic_info", "income_type"], e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="salary">Salary</option>
                      <option value="business">Business</option>
                    </select>
                  </Field>

                  <Field label="Dependents">
                    <input
                      className={inputClass}
                      value={formData.dynamic_info.dependents}
                      onChange={(e) =>
                        setNestedValue(["dynamic_info", "dependents"], e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Monthly Allowance Range">
                    <input
                      className={inputClass}
                      value={formData.dynamic_info.monthly_allowance_range}
                      onChange={(e) =>
                        setNestedValue(
                          ["dynamic_info", "monthly_allowance_range"],
                          e.target.value
                        )
                      }
                    />
                  </Field>

                  <Field label="Monthly Pension Range">
                    <input
                      className={inputClass}
                      value={formData.dynamic_info.monthly_pension_range}
                      onChange={(e) =>
                        setNestedValue(
                          ["dynamic_info", "monthly_pension_range"],
                          e.target.value
                        )
                      }
                    />
                  </Field>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Expense Snapshot
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Rent">
                    <input
                      className={inputClass}
                      value={formData.expense_snapshot.housing.rent}
                      onChange={(e) =>
                        setNestedValue(
                          ["expense_snapshot", "housing", "rent"],
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <Field label="Home Loan EMI">
                    <input
                      className={inputClass}
                      value={formData.expense_snapshot.housing.home_loan_emi}
                      onChange={(e) =>
                        setNestedValue(
                          ["expense_snapshot", "housing", "home_loan_emi"],
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <Field label="Utilities">
                    <input
                      className={inputClass}
                      value={formData.expense_snapshot.housing.utilities}
                      onChange={(e) =>
                        setNestedValue(
                          ["expense_snapshot", "housing", "utilities"],
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <Field label="Internet / Cable">
                    <input
                      className={inputClass}
                      value={formData.expense_snapshot.housing.internet_cable}
                      onChange={(e) =>
                        setNestedValue(
                          ["expense_snapshot", "housing", "internet_cable"],
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <Field label="Food">
                    <input
                      className={inputClass}
                      value={formData.expense_snapshot.food}
                      onChange={(e) =>
                        setNestedValue(["expense_snapshot", "food"], e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Transport">
                    <input
                      className={inputClass}
                      value={formData.expense_snapshot.transport}
                      onChange={(e) =>
                        setNestedValue(["expense_snapshot", "transport"], e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Savings, Investments, Insurance, Tax
                </h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Currently Save Money">
                    <select
                      className={inputClass}
                      value={formData.savings_status.currently_save_money}
                      onChange={(e) =>
                        setNestedValue(
                          ["savings_status", "currently_save_money"],
                          e.target.value
                        )
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="Approx Savings Range">
                    <input
                      className={inputClass}
                      value={formData.savings_status.approx_savings_range}
                      onChange={(e) =>
                        setNestedValue(
                          ["savings_status", "approx_savings_range"],
                          e.target.value
                        )
                      }
                    />
                  </Field>
                  <Field label="Invested Before">
                    <select
                      className={inputClass}
                      value={formData.investments.invested_before}
                      onChange={(e) =>
                        setNestedValue(["investments", "invested_before"], e.target.value)
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="FD">
                    <select
                      className={inputClass}
                      value={formData.investments.fd}
                      onChange={(e) =>
                        setNestedValue(["investments", "fd"], e.target.value)
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="SIP / Mutual Funds">
                    <select
                      className={inputClass}
                      value={formData.investments.sip_mutual_funds}
                      onChange={(e) =>
                        setNestedValue(
                          ["investments", "sip_mutual_funds"],
                          e.target.value
                        )
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="Stocks">
                    <select
                      className={inputClass}
                      value={formData.investments.stocks}
                      onChange={(e) =>
                        setNestedValue(["investments", "stocks"], e.target.value)
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="PPF">
                    <select
                      className={inputClass}
                      value={formData.investments.ppf}
                      onChange={(e) =>
                        setNestedValue(["investments", "ppf"], e.target.value)
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="Health Insurance">
                    <select
                      className={inputClass}
                      value={formData.insurance_check.health_insurance}
                      onChange={(e) =>
                        setNestedValue(
                          ["insurance_check", "health_insurance"],
                          e.target.value
                        )
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="Life Insurance">
                    <select
                      className={inputClass}
                      value={formData.insurance_check.life_insurance}
                      onChange={(e) =>
                        setNestedValue(
                          ["insurance_check", "life_insurance"],
                          e.target.value
                        )
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="File Income Tax">
                    <select
                      className={inputClass}
                      value={formData.tax_awareness.file_income_tax}
                      onChange={(e) =>
                        setNestedValue(
                          ["tax_awareness", "file_income_tax"],
                          e.target.value
                        )
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                  <Field label="Want To Save Tax">
                    <select
                      className={inputClass}
                      value={formData.tax_awareness.want_to_save_tax}
                      onChange={(e) =>
                        setNestedValue(
                          ["tax_awareness", "want_to_save_tax"],
                          e.target.value
                        )
                      }
                    >
                      <option>yes</option>
                      <option>no</option>
                    </select>
                  </Field>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Optional Goal
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="What do you want to buy?">
                    <input
                      className={inputClass}
                      value={formData.goal_plan.item_to_buy}
                      onChange={(e) =>
                        setNestedValue(["goal_plan", "item_to_buy"], e.target.value)
                      }
                    />
                  </Field>
                  <Field label="When do you want it?">
                    <input
                      className={inputClass}
                      value={formData.goal_plan.time_limit}
                      onChange={(e) =>
                        setNestedValue(["goal_plan", "time_limit"], e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Target Money">
                    <input
                      className={inputClass}
                      value={formData.goal_plan.target_amount}
                      onChange={(e) =>
                        setNestedValue(["goal_plan", "target_amount"], e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={startSession}
                className="inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Submit Initial Data
              </button>
            </div>
          </section>

          {renderEditablePreviousAnswers()}

          {aiState && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {aiState.reply_type}
                </span>
                <h2 className="text-2xl font-semibold text-slate-900">
                  AI Budgeting Flow
                </h2>
              </div>

              {aiState.reply_type === "question" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-base font-medium text-slate-900">
                    {aiState.question}
                  </p>

                  <div className="mt-4">{renderDynamicAnswerInput()}</div>

                  <div className="mt-5">
                    <button
                      onClick={submitAnswer}
                      className="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Submit Answer & Next
                    </button>
                  </div>
                </div>
              )}

              {aiState.reply_type === "advice" && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Monthly income estimate
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {aiState.advice?.summary?.monthly_income_estimate}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Fixed expenses total
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {aiState.advice?.summary?.fixed_expenses_total}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                        Variable expenses total
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {aiState.advice?.summary?.variable_expenses_total}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                        Disposable income
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {aiState.advice?.summary?.disposable_income}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Monthly target
                    </h3>
                    <p className="mt-2 text-slate-700">
                      {aiState.advice?.monthly_target}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Suggested cuts
                      </h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                        {(aiState.advice?.suggested_cuts || []).map(
                          (item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-lg font-semibold text-slate-900">Plan</h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                        {(aiState.advice?.plan || []).map(
                          (item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
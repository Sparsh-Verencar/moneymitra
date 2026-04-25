'use client'

import React, { useState } from 'react'

interface UserInput {
  salary: string
  interest: string
  freelance: string
  rent: string
  capitalGains: string
  section80C: string
  section80D: string
  section80E: string
  section80G: string
  tdsPaid: string
}

interface TaxResult {
  totalIncome: number
  taxableIncome: number
  estimatedTax: number
  regime: string
  recommendations: string[]
  itrForm: string
  refundOrPayable: number
}

const TaxPlanner: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const [input, setInput] = useState<UserInput>({
    salary: '',
    interest: '',
    freelance: '',
    rent: '',
    capitalGains: '',
    section80C: '',
    section80D: '',
    section80E: '',
    section80G: '',
    tdsPaid: ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<TaxResult | null>(null)

  const steps = [
    {
      title: 'INCOME SOURCES',
      fields: [
        { key: 'salary', label: 'Annual Salary (₹)', hint: 'From Form 16 or payslip' },
        { key: 'interest', label: 'Interest Income (₹)', hint: 'Bank FD, savings account' },
        { key: 'freelance', label: 'Freelance/Side Income (₹)', hint: 'Projects, consulting' },
        { key: 'rent', label: 'Rental Income (₹)', hint: 'Property rent received' },
        { key: 'capitalGains', label: 'Capital Gains (₹)', hint: 'Stocks, crypto, property sale' }
      ]
    },
    {
      title: 'DEDUCTIONS (80C, 80D, etc.)',
      fields: [
        { key: 'section80C', label: 'Section 80C (₹)', hint: 'PPF, ELSS, insurance, EPF up to ₹1.5L' },
        { key: 'section80D', label: 'Section 80D (₹)', hint: 'Health insurance premium' },
        { key: 'section80E', label: 'Section 80E (₹)', hint: 'Education loan interest' },
        { key: 'section80G', label: 'Section 80G (₹)', hint: 'Charitable donations' }
      ]
    },
    {
      title: 'TAX PAID',
      fields: [
        { key: 'tdsPaid', label: 'TDS Already Paid (₹)', hint: 'From Form 16, salary slips' }
      ]
    }
  ]

  const handleInputChange = (key: keyof UserInput, value: string): void => {
    setInput(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleNext = (): void => {
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  const handleAnalyze = async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/analyze-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salary: parseFloat(input.salary) || 0,
          interest: parseFloat(input.interest) || 0,
          freelance: parseFloat(input.freelance) || 0,
          rent: parseFloat(input.rent) || 0,
          capitalGains: parseFloat(input.capitalGains) || 0,
          section80C: parseFloat(input.section80C) || 0,
          section80D: parseFloat(input.section80D) || 0,
          section80E: parseFloat(input.section80E) || 0,
          section80G: parseFloat(input.section80G) || 0,
          tdsPaid: parseFloat(input.tdsPaid) || 0
        })
      })

      const data: TaxResult = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze tax')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = steps[step - 1]
  const progress = (step / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] to-[#1e1e1e] p-8">
      <div className="max-w-2xl mx-auto bg-[#141414] border border-[#404040] p-10 shadow-2xl">
        <h1 className="font-serif text-4xl text-[#d4af37] mb-2 text-center tracking-widest">TAX PLANNER</h1>
        <p className="text-center text-[#808080] text-sm mb-8 font-mono">Step {step} of {steps.length}</p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#404040] mb-10">
          <div
            className="h-full bg-[#d4af37] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {!result ? (
          <>
            <h2 className="font-serif text-2xl text-[#d4af37] mb-8 tracking-wide">{currentStep.title}</h2>

            <div className="space-y-6 mb-10">
              {currentStep.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-[#d4af37] font-semibold tracking-wider mb-2 uppercase">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={input[field.key as keyof UserInput]}
                    onChange={(e) => handleInputChange(field.key as keyof UserInput, e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#404040] text-[#e0e0e0] text-sm font-mono outline-none focus:border-[#d4af37] transition-all"
                  />
                  <p className="text-xs text-[#808080] mt-2 font-mono">{field.hint}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 bg-[#404040] text-[#d4af37] font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-[#505050]"
                >
                  BACK
                </button>
              )}
              {step < steps.length ? (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-[#d4af37] text-[#141414] font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-[#e5c158]"
                >
                  NEXT
                </button>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#d4af37] text-[#141414] font-mono text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#e5c158]"
                >
                  {loading ? 'ANALYZING...' : 'ANALYZE & GET STRATEGY'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#d4af37] mb-8 tracking-wide">YOUR TAX STRATEGY</h2>

            {/* Summary */}
            <div className="bg-[#1e1e1e] border border-[#404040] p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase">Total Income</span>
                <span className="text-lg text-[#e0e0e0] font-mono">₹{result.totalIncome?.toLocaleString()}</span>
              </div>
              <div className="border-t border-[#404040]"></div>
              <div className="flex justify-between">
                <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase">Taxable Income</span>
                <span className="text-lg text-[#e0e0e0] font-mono">₹{result.taxableIncome?.toLocaleString()}</span>
              </div>
              <div className="border-t border-[#404040]"></div>
              <div className="flex justify-between">
                <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase">Estimated Tax</span>
                <span className="text-lg text-[#e0e0e0] font-mono font-bold">₹{result.estimatedTax?.toLocaleString()}</span>
              </div>
            </div>

            {/* Regime & Form */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1e1e1e] border border-[#404040] p-6">
                <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase block mb-2">Best Regime</span>
                <span className="text-2xl text-[#e0e0e0] font-mono font-bold">{result.regime}</span>
              </div>
              <div className="bg-[#1e1e1e] border border-[#404040] p-6">
                <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase block mb-2">File ITR Form</span>
                <span className="text-2xl text-[#e0e0e0] font-mono font-bold">{result.itrForm}</span>
              </div>
            </div>

            {/* Refund/Payable */}
            <div className="bg-[#1e1e1e] border border-[#404040] p-6">
              <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase block mb-2">
                {result.refundOrPayable >= 0 ? 'REFUND' : 'ADDITIONAL TAX PAYABLE'}
              </span>
              <span className={`text-2xl font-mono font-bold ${
                result.refundOrPayable >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{Math.abs(result.refundOrPayable).toLocaleString()}
              </span>
            </div>

            {/* Recommendations */}
            <div className="bg-[#1e1e1e] border border-[#404040] p-6">
              <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase block mb-4">Recommendations</span>
              <ul className="space-y-3">
                {result.recommendations?.map((rec, idx) => (
                  <li key={idx} className="text-sm text-[#e0e0e0] flex items-start">
                    <span className="text-[#d4af37] mr-3">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setStep(1)
                setResult(null)
                setInput({
                  salary: '',
                  interest: '',
                  freelance: '',
                  rent: '',
                  capitalGains: '',
                  section80C: '',
                  section80D: '',
                  section80E: '',
                  section80G: '',
                  tdsPaid: ''
                })
              }}
              className="w-full py-3 bg-[#404040] text-[#d4af37] font-mono text-xs font-bold tracking-wider uppercase transition-all hover:bg-[#505050]"
            >
              START OVER
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaxPlanner
'use client';

import { useState, useEffect, useRef } from 'react';
import { sendOTP, verifyOTP } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

type Step = 'phone' | 'otp';
type Status = 'idle' | 'loading' | 'error' | 'success';

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </span>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-900/40 border border-red-500/60 rounded px-4 py-3 mb-5 animate-[slideIn_0.2s_ease]">
      <span className="text-red-400 text-sm mt-px shrink-0">⚠</span>
      <p className="font-mono text-[13px] text-red-300 leading-relaxed">
        {msg}
      </p>
    </div>
  );
}

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<Step>('phone');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSend = async () => {
    const trimmed = phone.trim();
    if (!trimmed || !/^\+?[1-9]\d{9,14}$/.test(trimmed.replace(/\s/g, ''))) {
      setErrorMsg(
        'Enter a valid phone number with country code (e.g. +91XXXXXXXXXX)',
      );
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await sendOTP(trimmed);
      setStep('otp');
      setStatus('idle');
      setCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setStatus('error');
      const code = err?.code ?? '';
      if (code === 'auth/too-many-requests')
        setErrorMsg('Too many attempts. Please try again later.');
      else if (code === 'auth/invalid-phone-number')
        setErrorMsg('Invalid phone number format.');
      else setErrorMsg('Failed to send OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setStatus('loading');
    setErrorMsg('');
    try {
      await sendOTP(phone.trim());
      setStatus('idle');
      setCountdown(30);
      otpRefs.current[0]?.focus();
    } catch {
      setStatus('error');
      setErrorMsg('Failed to resend OTP. Please try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const next = [...otp];
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await verifyOTP(code);
      setStatus('success');
      setTimeout(() => router.push('/onboarding'), 700);
    } catch (err: any) {
      setStatus('error');
      const c = err?.code ?? '';
      if (c === 'auth/code-expired')
        setErrorMsg('OTP has expired. Please request a new one.');
      else if (c === 'auth/invalid-verification-code')
        setErrorMsg('Incorrect OTP. Please check and try again.');
      else setErrorMsg('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-130 h-130 rounded-full bg-amber-500/8 blur-3xl -translate-y-10" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm bg-[#1e1e1e] border border-[#2e2e2e] rounded-md px-10 py-12 shadow-2xl animate-[fadeUp_0.45s_ease_both]">
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/70 rounded-tl-md" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/70 rounded-br-md" />

        {/* Brand */}
        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-amber-400/80 mb-8">
          Verify Identity
        </p>

        {/* ── PHONE STEP ── */}
        {step === 'phone' && (
          <>
            <h1 className="font-serif text-3xl font-normal text-white leading-snug mb-2">
              Sign in
            </h1>
            <p className="font-mono text-[13px] text-[#888] leading-relaxed mb-8">
              Enter your phone number to receive
              <br />a one-time passcode via SMS.
            </p>

            {status === 'error' && <ErrorBanner msg={errorMsg} />}

            <label className="block font-mono text-[11px] tracking-[0.18em] uppercase text-[#888] mb-2.5">
              Phone Number
            </label>
            <input
              className="w-full bg-[#141414] border-2 border-[#333] rounded-md px-4 py-3.5 font-mono text-base text-white placeholder-[#444] tracking-wide outline-none transition-all duration-200 focus:border-amber-500 mb-5 disabled:opacity-50"
              placeholder="+91 XXXXX XXXXX"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setErrorMsg('');
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={status === 'loading'}
            />

            <button
              className="w-full bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[13px] tracking-[0.18em] uppercase font-semibold rounded-md py-4 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
              onClick={handleSend}
              disabled={status === 'loading' || !phone.trim()}
            >
              {status === 'loading' ? <LoadingDots /> : 'Send OTP →'}
            </button>
          </>
        )}

        {/* ── OTP STEP ── */}
        {step === 'otp' && (
          <>
            <h1 className="font-serif text-3xl font-normal text-white leading-snug mb-1">
              Enter code
            </h1>
            <p className="font-mono text-[13px] text-[#888] mb-1">
              Sent to <span className="text-amber-400">{phone}</span>
            </p>
            <p className="font-mono text-[11px] text-[#555] tracking-wide mb-7">
              6-digit code · expires in 10 min
            </p>

            {status === 'error' && <ErrorBanner msg={errorMsg} />}

            {/* OTP boxes */}
            <div
              className="grid grid-cols-6 gap-2.5 mb-5"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={status === 'loading' || status === 'success'}
                  autoComplete="one-time-code"
                  className="aspect-square bg-[#141414] border-2 border-[#333] rounded-md text-center font-serif text-2xl text-white outline-none transition-all duration-200 focus:border-amber-500 disabled:opacity-50 caret-amber-400"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={
                status === 'loading' ||
                status === 'success' ||
                otp.join('').length !== 6
              }
              className={[
                'w-full rounded-md py-4 font-mono text-[13px] tracking-[0.18em] uppercase font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg',
                status === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-[#141414] shadow-amber-500/10',
              ].join(' ')}
            >
              {status === 'loading' ? (
                <LoadingDots />
              ) : status === 'success' ? (
                '✓ Verified'
              ) : (
                'Verify →'
              )}
            </button>

            {/* Footer row */}
            <div className="flex items-center justify-between mt-6">
              <button
                className="font-mono text-[12px] tracking-wide text-[#555] hover:text-[#aaa] transition-colors duration-200"
                onClick={() => {
                  setStep('phone');
                  setStatus('idle');
                  setErrorMsg('');
                  setOtp(['', '', '', '', '', '']);
                }}
              >
                ← Change number
              </button>

              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || status === 'loading'}
                  className="font-mono text-[12px] tracking-wide transition-colors duration-200 disabled:text-[#333] disabled:cursor-default text-amber-400 hover:text-amber-300"
                >
                  Resend OTP
                </button>
                {countdown > 0 && (
                  <span className="font-mono text-[11px] text-[#444]">
                    in {countdown}s
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div id="recaptcha-container" className="hidden" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        .font-mono  { font-family: 'DM Mono', monospace !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { topics } from '@/app/lib/financialTopics';

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen({ subtopicTitle }: { subtopicTitle: string }) {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center gap-1.5 mb-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-amber-500/70 mb-2">
          Generating Quiz
        </p>
        <p className="font-serif text-xl text-white">{subtopicTitle}</p>
        <p className="font-mono text-[11px] text-[#444] mt-2">
          Preparing your questions{'·'.repeat(dot + 1)}
        </p>
      </div>
      <Styles />
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  score,
  total,
  subtopicTitle,
  onRetry,
}: {
  score: number;
  total: number;
  subtopicTitle: string;
  onRetry: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const pct = total === 0 ? 0 : score / total;
  const msg =
    pct === 1
      ? {
          headline: 'Perfect score!',
          body: 'You nailed every question. Outstanding.',
        }
      : pct >= 0.8
        ? {
            headline: 'Well done.',
            body: 'Strong performance. Just a couple to review.',
          }
        : pct >= 0.5
          ? {
              headline: 'Good effort.',
              body: 'Solid foundation — review the explanations and try again.',
            }
          : {
              headline: 'Keep at it.',
              body: 'Go back through the concepts and give it another shot.',
            };

  const ringColor = pct >= 0.8 ? '#4ade80' : pct >= 0.5 ? '#f59e0b' : '#f87171';
  const textColor =
    pct >= 0.8
      ? 'text-emerald-400'
      : pct >= 0.5
        ? 'text-amber-400'
        : 'text-red-400';
  const r = 48;
  const circ = 2 * Math.PI * r;

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div
        className="text-center max-w-sm w-full transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* Score ring */}
        <div className="relative flex items-center justify-center mb-6">
          <svg width="120" height="120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s ease 0.3s' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`font-serif text-3xl ${textColor}`}>{score}</span>
            <span className="font-mono text-[11px] text-[#555]">
              of {total}
            </span>
          </div>
        </div>
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-amber-500/70 mb-2">
          Quiz Complete · {subtopicTitle}
        </p>
        <h2 className="font-serif text-3xl text-white mb-3">{msg.headline}</h2>
        <p className="font-mono text-[13px] text-[#888] leading-relaxed mb-10">
          {msg.body}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.replace('/home')}
            className="w-full border-2 border-[#2a2a2a] hover:border-[#444] text-[#666] hover:text-[#aaa] font-mono text-[12px] tracking-[0.18em] uppercase font-semibold py-4 rounded-md transition-all duration-200"
          >
            ← Go Home
          </button>
          <button
            onClick={onRetry}
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[12px] tracking-[0.18em] uppercase font-semibold py-4 rounded-md transition-all duration-200 shadow-lg shadow-amber-500/10"
          >
            Try Again →
          </button>
        </div>
      </div>
      <Styles />
    </div>
  );
}

// ─── Option button ────────────────────────────────────────────────────────────

function OptionBtn({
  opt,
  selected,
  submitted,
  correct,
  onClick,
}: {
  opt: string;
  selected: boolean;
  submitted: boolean;
  correct: boolean;
  onClick: () => void;
}) {
  const letter = opt[0];

  let rowClass = '';
  let bulletClass = '';

  if (!submitted) {
    rowClass = selected
      ? 'border-amber-500 bg-amber-500/10 text-white'
      : 'border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-[#ccc]';
    bulletClass = selected
      ? 'border-amber-500 bg-amber-500 text-[#141414]'
      : 'border-[#333] text-[#555]';
  } else {
    if (correct) {
      rowClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
      bulletClass = 'border-emerald-500 bg-emerald-500 text-[#141414]';
    } else if (selected) {
      rowClass = 'border-red-500 bg-red-500/10 text-red-300';
      bulletClass = 'border-red-500 bg-red-500 text-[#141414]';
    } else {
      rowClass = 'border-[#222] text-[#444]';
      bulletClass = 'border-[#2a2a2a] text-[#444]';
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={submitted}
      className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-md border-2 text-left transition-all duration-150 disabled:cursor-default ${rowClass}`}
    >
      <span
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-semibold transition-all duration-150 ${bulletClass}`}
      >
        {letter}
      </span>
      <span className="font-mono text-[13px] leading-relaxed">
        {opt.slice(3)}
      </span>
    </button>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600&display=swap');
      .font-serif { font-family: 'DM Serif Display', serif !important; }
      .font-mono  { font-family: 'DM Mono', monospace !important; }
    `}</style>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topicId = Number(searchParams.get('topicId'));
  const subtopicId = Number(searchParams.get('subtopicId'));

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false); // ← only set on explicit "See Results" click

  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);

  const fetchQuiz = async () => {
    if (!topic || !subtopic) return;
    setLoading(true);
    setSelected({});
    setSubmitted(false);
    setCurrent(0);
    setShowResult(false);

    const res = await fetch('http://localhost:8000/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: topic.title,
        subtopic: subtopic.title,
        concepts: subtopic.concepts.map((c) => ({
          title: c.title,
          content: c.content,
          keyPoints: c.keyPoints ?? [],
        })),
        num_questions: subtopic.concepts.length * 2,
      }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const score = Object.entries(selected).filter(
    ([i, ans]) => ans === questions[Number(i)]?.correct,
  ).length;

  const totalAnswered = Object.keys(selected).length;
  const allAnswered = totalAnswered === questions.length;

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questions.length) setCurrent(idx);
  };

  // Submit just marks answers — user still navigates freely
  const handleSubmit = () => setSubmitted(true);

  if (loading)
    return <LoadingScreen subtopicTitle={subtopic?.title ?? 'Quiz'} />;
  if (showResult)
    return (
      <ResultScreen
        score={score}
        total={questions.length}
        subtopicTitle={subtopic?.title ?? ''}
        onRetry={fetchQuiz}
      />
    );

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const isLast = current === questions.length - 1;

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center px-4 py-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 flex items-start justify-center pointer-events-none">
        <div className="w-125 h-100 rounded-full bg-amber-500/5 blur-3xl translate-y-10" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-amber-500/70 mb-1">
            {topic?.title}
          </p>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl text-white">
              {subtopic?.title}
            </h1>
            <span className="font-mono text-[11px] text-[#555]">
              {current + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#2a2a2a] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md px-6 py-6 shadow-2xl relative mb-4">
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/40 rounded-tl-md" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/40 rounded-br-md" />

          {/* Q badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-amber-500/60 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
              Q{current + 1}
            </span>
            {submitted &&
              (selected[current] === q.correct ? (
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-emerald-500">
                  Correct
                </span>
              ) : selected[current] !== undefined ? (
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-red-400">
                  Incorrect
                </span>
              ) : (
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#555]">
                  Skipped
                </span>
              ))}
            {!submitted && selected[current] !== undefined && (
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#555]">
                Answered
              </span>
            )}
          </div>

          {/* Question text */}
          <p className="font-serif text-[17px] text-white leading-relaxed mb-6">
            {q.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt) => (
              <OptionBtn
                key={opt}
                opt={opt}
                selected={selected[current] === opt[0]}
                submitted={submitted}
                correct={opt[0] === q.correct}
                onClick={() => {
                  if (!submitted)
                    setSelected((prev) => ({ ...prev, [current]: opt[0] }));
                }}
              />
            ))}
          </div>

          {/* Explanation — visible after submit */}
          {submitted && (
            <div className="mt-5 flex items-start gap-2.5 bg-[#141414] border border-[#2a2a2a] rounded-md px-4 py-3 animate-[slideIn_0.25s_ease]">
              <span className="text-amber-500 text-sm mt-0.5 shrink-0">💡</span>
              <p className="font-mono text-[12px] text-[#888] leading-relaxed">
                {q.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Dot navigator */}
        <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
          {questions.map((_, i) => {
            const answered = selected[i] !== undefined;
            const isCurrent = i === current;
            const isCorrect = submitted && selected[i] === questions[i].correct;
            const isWrong =
              submitted && answered && selected[i] !== questions[i].correct;

            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'w-5 h-2 bg-amber-500'
                    : isCorrect
                      ? 'w-2 h-2 bg-emerald-500'
                      : isWrong
                        ? 'w-2 h-2 bg-red-500'
                        : answered
                          ? 'w-2 h-2 bg-amber-500/50'
                          : 'w-2 h-2 bg-[#2e2e2e] hover:bg-[#444]'
                }`}
              />
            );
          })}
        </div>

        {/* Navigation row */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="px-5 py-3.5 border-2 border-[#2a2a2a] rounded-md font-mono text-[12px] text-[#555] hover:border-[#444] hover:text-[#aaa] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          {/* Middle button — context-aware */}
          {!submitted ? (
            // Pre-submit: Next or Submit
            isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[12px] tracking-[0.18em] uppercase font-semibold rounded-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
              >
                {!allAnswered
                  ? `Submit (${totalAnswered}/${questions.length})`
                  : 'Submit Quiz →'}
              </button>
            ) : (
              <button
                onClick={() => goTo(current + 1)}
                className="flex-1 py-3.5 border-2 border-[#2a2a2a] rounded-md font-mono text-[12px] text-[#555] hover:border-[#444] hover:text-[#aaa] transition-all duration-150"
              >
                Next →
              </button>
            )
          ) : // Post-submit: Next or See Results (on last question)
          isLast ? (
            <button
              onClick={() => setShowResult(true)}
              className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#141414] font-mono text-[12px] tracking-[0.18em] uppercase font-semibold rounded-md transition-all duration-200 shadow-lg shadow-amber-500/10"
            >
              See Results →
            </button>
          ) : (
            <button
              onClick={() => goTo(current + 1)}
              className="flex-1 py-3.5 border-2 border-[#2a2a2a] rounded-md font-mono text-[12px] text-[#555] hover:border-[#444] hover:text-[#aaa] transition-all duration-150"
            >
              Next →
            </button>
          )}
        </div>

        {/* Status hint */}
        <p className="font-mono text-[10px] text-[#444] text-center mt-4 tracking-wide">
          {!submitted
            ? `${totalAnswered} of ${questions.length} answered${!allAnswered ? ' · answer all to submit' : ''}`
            : isLast
              ? 'Review done · press See Results when ready'
              : `Reviewing answers · ${current + 1} of ${questions.length}`}
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500;600&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        .font-mono  { font-family: 'DM Mono', monospace !important; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

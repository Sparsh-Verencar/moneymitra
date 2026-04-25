'use client';

import React, { useMemo, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Receipt,
  User,
  LayoutGrid,
  Search,
  Sparkles,
  IndianRupee,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { topics } from '@/app/lib/financialTopics';

const getIcon = (id: string | number) => {
  const iconId = String(id).toLowerCase();
  switch (iconId) {
    case 'investing':
      return (
        <TrendingUp className="text-amber-400" size={22} strokeWidth={1.75} />
      );
    case 'budgeting':
      return <Wallet className="text-amber-400" size={22} strokeWidth={1.75} />;
    case 'insurance':
      return (
        <ShieldCheck className="text-amber-400" size={22} strokeWidth={1.75} />
      );
    case 'taxes':
      return (
        <Receipt className="text-amber-400" size={22} strokeWidth={1.75} />
      );
    default:
      return (
        <LayoutGrid className="text-amber-400" size={22} strokeWidth={1.75} />
      );
  }
};

const HomePage = () => {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const stats = useMemo(
    () => [
      { label: 'Topics available', value: topics.length.toString() },
      { label: 'Goal', value: 'Learn first, then act' },
    ],
    [],
  );

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#f4f1ea] antialiased overflow-x-hidden">
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#090909]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 transition hover:opacity-90 self-start"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/15 bg-amber-500/10 text-amber-300">
              <Sparkles size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold tracking-tight text-white text-sm sm:text-base">
                MONEY<span className="text-amber-400">MITRA</span>
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#8f877a]">
                Awareness & Planning Hub
              </div>
            </div>
          </button>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 md:w-[320px]">
              <Search size={14} className="shrink-0 text-[#9a9184]" />
              <span className="truncate text-sm text-[#b7b1a6]">
                Search topics, subtopics, concepts
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/3 px-3 py-2 md:justify-start">
              <div className="text-right leading-tight">
                <div className="text-[9px] uppercase tracking-[0.2em] text-amber-300 sm:text-[10px] sm:tracking-[0.25em]">
                  Welcome back
                </div>
                <div className="text-sm font-medium text-white">
                  Suyash Khobrekar
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414]">
                <User size={18} className="text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <section className="mb-10 rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div>
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300 sm:text-xs sm:tracking-[0.25em]">
                <IndianRupee size={14} />
                Learn money in plain language
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-6xl">
                Build financial confidence step by step.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b7b1a6] sm:text-base sm:leading-8 md:text-lg">
                Start with a topic, open its subtopics, and move through
                concepts in a guided learning flow. The language stays simple.
                The content stays India-specific.
              </p>
            </div>

            <div className="grid gap-3 md:justify-self-end">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/8 bg-black/20 px-5 py-4"
                >
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#8f877a]">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white sm:text-base">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-300 sm:text-xs sm:tracking-[0.3em]">
              Financial topics
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
              Pick a topic to continue
            </h2>
          </div>

          <div className="flex gap-2 self-start sm:self-auto">
            <button
              onClick={() => scrollCarousel('left')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-amber-500/30 hover:bg-amber-500/10"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-amber-500/30 hover:bg-amber-500/10"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <section className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
          >
            {topics.map((topic) => (
              <article
                key={topic.id}
                onClick={() => router.push(`/topics/${topic.id}`)}
                className="group w-[82vw] max-w-[320px] shrink-0 snap-start cursor-pointer rounded-[1.5rem] border border-white/8 bg-[#111111] p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-[#151515] sm:w-[300px] md:w-[330px] md:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-black/25">
                    {getIcon(topic.id)}
                  </div>
                  <div className="rounded-full border border-white/8 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-[#8f877a] sm:text-[10px] sm:tracking-[0.25em]">
                    Topic {String(topic.id).padStart(2, '0')}
                  </div>
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight text-white group-hover:text-amber-300 sm:text-2xl">
                  {topic.title}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#a8a091] sm:text-base">
                  {topic.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5 text-[#8f877a] transition group-hover:text-amber-300">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">
                    Open topic
                  </span>
                  <ArrowUpRight size={18} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            'Plain-language explanations for beginners',
            'India-specific rules and instruments',
            'A learning flow that can later extend into concept details and AI help',
          ].map((text) => (
            <div
              key={text}
              className="rounded-2xl border border-white/8 bg-white/3 p-5 text-sm leading-7 text-[#b7b1a6]"
            >
              {text}
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/8 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <div className="text-sm font-medium text-[#6f675b]">
            MONEY<span className="text-[#3b352d]">MITRA</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#6f675b] sm:tracking-[0.28em]">
            Awareness and planning for Indian families
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

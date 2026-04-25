'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
    ChevronRight,
    CheckCircle2,
    Users,
    Lightbulb,
    BookOpen,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';

interface LandingPageProps {
    onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#090909] text-[#f4f1ea] antialiased selection:bg-amber-500/30">
            <main>
                <section className="relative isolate overflow-hidden border-b border-white/8 px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24 md:pt-24 md:pb-28">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_32%)]" />
                    <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[10px] sm:text-xs font-medium tracking-[0.22em] sm:tracking-[0.25em] text-amber-300 uppercase">
                            <Sparkles size={14} />
                            Financial learning for families
                        </div>

                        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-7xl">
                            Money<span className="text-amber-400">Mitra</span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-[#b7b1a6] sm:text-lg sm:leading-8 md:text-2xl">
                            Learn money without jargon, pressure, or fake promises.
                            <br className="hidden md:block" />
                            Built for real families, real goals, and real decisions.
                        </p>

                        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                            <button
                                onClick={() => router.push('/login')}
                                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition hover:scale-[1.02] hover:bg-amber-400 sm:w-auto"
                            >
                                Start learning
                                <ChevronRight size={18} />
                            </button>
                            <div className="text-sm text-[#90897d] text-center sm:text-left">
                                Clear guidance. No sales pitch.
                            </div>
                        </div>

                        <div className="mt-14 grid w-full max-w-4xl gap-4 md:grid-cols-3">
                            {[
                                ['Plain language', 'Explain money in simple terms'],
                                ['Action first', 'Know what to do next'],
                                ['No conflict', 'No commissions, no product pushing'],
                            ].map(([title, desc]) => (
                                <div
                                    key={title}
                                    className="rounded-2xl border border-white/8 bg-white/3 p-5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur"
                                >
                                    <div className="text-sm font-semibold text-white">{title}</div>
                                    <div className="mt-2 text-sm leading-6 text-[#a8a091]">{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-10 md:py-20">
                    <div className="rounded-3xl border border-white/8 bg-white/3 p-6 sm:p-8 md:p-10">
                        <div className="mb-4 text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-amber-300 uppercase">
                            Who we are
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                            Built for families,
                            <br /> not for bankers.
                        </h2>
                        <p className="mt-6 max-w-xl text-sm leading-7 text-[#b7b1a6] sm:text-base sm:leading-8 md:text-lg">
                            Most financial apps bury people in jargon. MoneyMitra removes the noise and gives
                            practical guidance that a family can actually use.
                        </p>

                        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-amber-500/15 bg-amber-500/8 p-5">
                            <Users className="mt-0.5 shrink-0 text-amber-300" size={22} />
                            <p className="text-sm leading-7 text-[#d2c9bb] italic md:text-base">
                                We are trying to make money conversations easier inside the home, not harder.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/8 bg-[#111111] p-6 sm:p-8 md:p-10">
                        <div className="mb-4 text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-amber-300 uppercase">
                            The problem
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                            Most advice is either too technical or too sales-driven.
                        </h2>
                        <p className="mt-6 text-sm leading-7 text-[#b7b1a6] sm:text-base sm:leading-8 md:text-lg">
                            Users are left confused by terms, pushed into bad products, or given generic plans
                            that do not match their situation.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                'Confusing terms like 80C, NPS, and SIP',
                                'High-pressure agents and commission bias',
                                'Generic advice that ignores life stage and goals',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3 text-sm text-[#d0c7b8] md:text-base">
                                    <span className="mt-1 text-amber-400">✕</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-y border-white/8 bg-[#070707] px-4 py-16 sm:px-6 md:py-20">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center">
                            <div className="mb-4 text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-amber-300 uppercase">
                                Our approach
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
                                Simple, practical, and honest
                            </h2>
                        </div>

                        <div className="mt-14 grid gap-6 md:grid-cols-3">
                            {[
                                {
                                    icon: BookOpen,
                                    title: 'Plain language',
                                    text: 'We explain taxes, insurance, and investing with examples that feel familiar and easy to remember.',
                                },
                                {
                                    icon: Lightbulb,
                                    title: 'Actionable steps',
                                    text: 'You get a clear next step for your current stage instead of vague theory that sits unused.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'No conflict',
                                    text: 'No commissions. No hidden selling. The goal is clarity, not conversion.',
                                },
                            ].map(({ icon: Icon, title, text }) => (
                                <div
                                    key={title}
                                    className="group rounded-3xl border border-white/8 bg-white/3 p-7 transition hover:border-amber-500/25 hover:bg-white/[0.05]"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-[#a8a091] md:text-base">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-4 py-16 sm:px-6 md:py-20">
                    <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-500/15 bg-gradient-to-br from-amber-500/10 via-white/3 to-transparent p-6 sm:p-8 md:p-12">
                        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr] md:items-end">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] sm:text-xs font-medium tracking-[0.22em] sm:tracking-[0.25em] text-amber-300 uppercase">
                                    <CheckCircle2 size={14} />
                                    Learn before you decide
                                </div>
                                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
                                    Clear the confusion and make better money decisions.
                                </h2>
                                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b7b1a6] sm:text-base sm:leading-8 md:text-lg">
                                    MoneyMitra is designed to feel calm, direct, and usable from the first screen.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-black transition hover:scale-[1.02]"
                                >
                                    Begin your journey
                                    <ChevronRight size={18} />
                                </button>
                                <div className="text-sm text-[#8f877a] text-center md:text-left">
                                    Built for mobile and desktop.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;

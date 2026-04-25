'use client';

import React from 'react';
import { ChevronRight, CheckCircle2, Users, Lightbulb, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5] font-sans selection:bg-amber-500/30">
      {/* 1. Header & Hero Section */}
      <section className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center overflow-hidden border-b border-[#1e1e1e]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-900/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-serif text-white mb-6">
            Money<span className="text-amber-500">Mitra</span>
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-[#a0a0a0] leading-snug mb-8">
            The friendly way to master <br/> your family's financial future.
          </p>
          <button
            onClick={onEnter}
            className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white transition-all duration-300 rounded-md text-lg font-medium shadow-xl flex items-center gap-3 mx-auto"
          >
            Start Learning Now
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* 2. Who We Are & The Problem */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-amber-500 mb-4">Who we are</h2>
          <h3 className="text-4xl font-serif text-white mb-6 leading-tight">
            Built for families, <br/> not for bankers.
          </h3>
          <p className="text-[#a0a0a0] leading-relaxed text-lg mb-6">
            Most financial apps are full of jargon and "expert" talk that leaves people feeling more confused than when they started. 
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="mt-1 text-amber-500"><Users size={24} /></div>
              <p className="text-[#888] font-medium italic">"We grew up in Indian households where money wasn't taught at the dinner table. We're here to change that for your family."</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#141414] p-10 border border-[#222] rounded-sm">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-amber-500 mb-4">The Problem</h2>
          <p className="text-xl text-[#f5f5f5] font-serif leading-relaxed italic">
            "Advice in India is either too technical or someone is trying to sell you a policy you don't need."
          </p>
          <hr className="my-8 border-[#222]" />
          <ul className="space-y-4 text-[#888]">
            <li className="flex items-center gap-3">
              <span className="text-red-900">✕</span> Confusing terms like 80C, NPS, or SIP
            </li>
            <li className="flex items-center gap-3">
              <span className="text-red-900">✕</span> High-pressure sales agents
            </li>
            <li className="flex items-center gap-3">
              <span className="text-red-900">✕</span> One-size-fits-all generic plans
            </li>
          </ul>
        </div>
      </section>

      {/* 3. How We Solve It */}
      <section className="bg-[#080808] py-24 border-y border-[#1e1e1e]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-amber-500 mb-4">Our Approach</h2>
            <h3 className="text-4xl font-serif text-white">How we make it simple</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center rounded-sm mb-6">
                <BookOpen className="text-amber-500" />
              </div>
              <h4 className="text-xl font-serif text-white mb-3">Plain Language</h4>
              <p className="text-[#888] text-sm leading-relaxed">
                We explain concepts like taxes and insurance using simple stories, just like how you'd explain it to a friend.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center rounded-sm mb-6">
                <Lightbulb className="text-amber-500" />
              </div>
              <h4 className="text-xl font-serif text-white mb-3">Actionable Steps</h4>
              <p className="text-[#888] text-sm leading-relaxed">
                Instead of just theory, we give you a clear checklist of what to do for your specific life stage.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center rounded-sm mb-6">
                <CheckCircle2 className="text-amber-500" />
              </div>
              <h4 className="text-xl font-serif text-white mb-3">No Conflict</h4>
              <p className="text-[#888] text-sm leading-relaxed">
                We don't sell products. We don't take commissions. Our only goal is to help you understand your money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final Reassurance Footer */}
      <footer className="py-20 px-6 text-center">
        <h3 className="text-2xl font-serif text-white mb-8">Ready to clear the confusion?</h3>
        <button
          onClick={onEnter}
          className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-white transition-all duration-300 rounded-md font-medium shadow-2xl inline-flex items-center gap-3"
        >
          Begin Your Journey
          <ChevronRight size={20} />
        </button>
        <div className="mt-12 text-[#444] font-mono text-[10px] uppercase tracking-widest">
          Mumbai • Delhi • Bangalore • Goa • India
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
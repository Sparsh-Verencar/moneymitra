'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowUpRight,
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Receipt,
  User,
  LayoutGrid
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { topics } from '@/lib/data/financialTopics';

// Friendly icon mapping
const getIcon = (id: string | number) => {
  const iconId = String(id).toLowerCase();
  switch (iconId) {
    case 'investing': return <TrendingUp className="text-amber-500" size={24} strokeWidth={1.5} />;
    case 'budgeting': return <Wallet className="text-amber-500" size={24} strokeWidth={1.5} />;
    case 'insurance': return <ShieldCheck className="text-amber-500" size={24} strokeWidth={1.5} />;
    case 'taxes': return <Receipt className="text-amber-500" size={24} strokeWidth={1.5} />;
    default: return <LayoutGrid className="text-amber-500" size={24} strokeWidth={1.5} />;
  }
};

const HomePage = () => {
  const router = useRouter();
  const [carouselPos, setCarouselPos] = useState(0);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const scrollAmount = 352; 
    const maxScroll = Math.max(0, (topics.length - 3) * scrollAmount);
    setCarouselPos(prev => direction === 'left' ? Math.max(0, prev - scrollAmount) : Math.min(maxScroll, prev + scrollAmount));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] overflow-x-hidden relative">
      {/* Soft warm glow in the corner */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-amber-500/5 blur-[120px] pointer-events-none" />
      
      {/* Simple Navigation Bar */}
      <nav className="border-b border-[#1e1e1e] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif text-2xl tracking-tighter text-white">
              MONEY<span className="text-amber-500">MITRA</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="font-mono text-[10px] text-amber-500 uppercase tracking-widest leading-none mb-1">Welcome back,</p>
              <p className="text-sm text-white font-medium">Suyash Khobrekar</p>
            </div>
            <div className="w-10 h-10 border border-[#2e2e2e] bg-[#141414] flex items-center justify-center rounded-full">
              <User size={18} className="text-amber-500/80" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
        {/* Progress Overview Section */}
        <section className="mb-12">
          <div className="bg-[#141414] border border-[#1e1e1e] p-8 rounded-sm relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="font-serif text-4xl text-white mb-2">My Learning Path</h1>
              <p className="font-mono text-sm text-[#888]">Continue where you left off to master your finances.</p>
              
              <div className="flex gap-8 mt-8">
                <div>
                  <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1">Topics Started</p>
                  <p className="text-2xl text-white">4 <span className="text-[#333]">/ 12</span></p>
                </div>
                <div className="w-px h-10 bg-[#2e2e2e]" />
                <div>
                  <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1">Overall Progress</p>
                  <p className="text-2xl text-amber-500">32%</p>
                </div>
              </div>
            </div>
            {/* Minimalist corner decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          </div>
        </section>

        {/* Carousel Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-white">Financial Topics</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scrollCarousel('left')}
              className="p-2 border border-[#2e2e2e] hover:border-amber-500 text-white transition-all bg-[#141414] disabled:opacity-20 rounded-sm"
              disabled={carouselPos === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="p-2 border border-[#2e2e2e] hover:border-amber-500 text-white transition-all bg-[#141414] rounded-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* The Carousel */}
        <div className="relative">
          <div 
            className="flex gap-8 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${carouselPos}px)` }}
          >
            {topics.map((topic) => (
              <div 
                key={topic.id}
                onClick={() => router.push(`/topics/${topic.id}`)}
                className="shrink-0 w-[320px] group cursor-pointer"
              >
                <div className="h-96 bg-[#141414] border border-[#2e2e2e] p-8 relative flex flex-col justify-between transition-all duration-300 group-hover:border-amber-500/60 rounded-sm">
                  
                  {/* Subtle Top Accent */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 border border-[#2e2e2e] flex items-center justify-center bg-[#0a0a0a] group-hover:border-amber-500/30 transition-colors">
                      {getIcon(topic.id)}
                    </div>
                    <span className="font-mono text-[9px] text-[#444] uppercase tracking-widest">ID: {String(topic.id).padStart(3, '0')}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-amber-500 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-[#888] leading-relaxed line-clamp-3">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#1e1e1e] flex items-center justify-between group-hover:text-amber-500 transition-colors text-[#555]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Open Topic</span>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Clear Footer */}
      <footer className="mt-20 border-t border-[#1e1e1e] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-serif text-lg text-[#444]">
            MONEY<span className="text-[#222]">MITRA</span>
          </div>
          <p className="font-mono text-[10px] text-[#444] uppercase tracking-widest">
            Expert guidance for your financial future.
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-[#555] uppercase tracking-widest">
            <span>Privacy</span>
            <span>Security</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
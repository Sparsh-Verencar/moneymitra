'use client';

import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { topics } from '@/app/lib/financialTopics';

const TopicsPage = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = Number(params.id);

  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center px-4 text-center">
        Topic not found
      </div>
    );
  }

  const handleSelectSubtopic = (subtopic: (typeof topic.subtopics)[0]) => {
    router.push(`/learning/${topicId}/${subtopic.id}`);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#f4f1ea]">
      {/* subtle background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => router.push('/home')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300 transition hover:bg-amber-500/20"
          >
            <Home size={18} />
          </button>
          <div className="text-sm sm:text-base font-medium text-white truncate">
            / {topic.title}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            {topic.title}
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#b7b1a6] leading-7">
            {topic.description}
          </p>
        </div>

        {/* Subtopics Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {topic.subtopics.map((subtopic) => (
            <div
              key={subtopic.id}
              onClick={() => handleSelectSubtopic(subtopic)}
              className="group cursor-pointer"
            >
              <div className="relative h-[170px] sm:h-[190px] rounded-[1.5rem] border border-white/10 bg-[#111111] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-[#151515]">
                {/* hover glow */}
                <div className="absolute inset-0 rounded-[1.5rem] bg-amber-500 opacity-0 group-hover:opacity-[0.04] transition-opacity" />

                <div className="relative z-10">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-amber-300 transition">
                    {subtopic.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#8f877a]">
                    {subtopic.concepts.length} concepts
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-xs sm:text-sm font-medium text-[#8f877a] group-hover:text-amber-300 transition">
                  Start Learning
                  <ChevronRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;

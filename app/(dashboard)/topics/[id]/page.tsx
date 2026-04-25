'use client';

import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { topics } from '@/app/lib/financialTopics';

const TopicsPage = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = parseInt(params.id as string);
  const topic = topics.find(t => t.id === topicId);

  if (!topic) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Topic not found</div>;
  }

  const handleSelectSubtopic = (subtopic: typeof topic.subtopics[0]) => {
    router.push(`/learning/${topicId}/${subtopic.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-amber-500 border-opacity-20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="text-amber-400 hover:text-amber-300 transition p-2 border border-amber-500 border-opacity-30"
            style={{ borderRadius: '2px' }}
          >
            <Home size={20} />
          </button>
          <div className="text-amber-400 font-serif">/ {topic.title}</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-4 mb-16">
          <h1 className="text-5xl font-serif text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>
            {topic.title}
          </h1>
          <p className="text-slate-400 text-lg">
            {topic.description}
          </p>
        </div>

        {/* Subtopics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {topic.subtopics.map((subtopic) => (
            <div
              key={subtopic.id}
              onClick={() => handleSelectSubtopic(subtopic)}
              className="group cursor-pointer"
            >
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500 border-opacity-20 p-8 hover:border-opacity-40 transition-all duration-300 h-48 flex flex-col justify-between"
                style={{ borderRadius: '4px' }}>
                {/* Hover glow */}
                <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 transition-opacity rounded"></div>

                <div className="relative z-10 space-y-4">
                  <h2 className="text-2xl font-serif text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {subtopic.title}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {subtopic.concepts.length} concepts to explore
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-amber-400 text-sm font-mono group-hover:translate-x-2 transition-transform">
                  Start Learning <ChevronRight size={16} className="ml-2" />
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
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

export interface Concept {
  id: number;
  title: string;
  content: string;
}

interface ConceptCardProps {
  concept: Concept;
  conceptIndex: number;
  totalConcepts: number;
}

const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  conceptIndex,
  totalConcepts,
}) => {
  return (
    <div className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
      <div className="max-w-3xl space-y-6 sm:space-y-7">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white font-serif">
          {concept.title}
        </h2>

        {/* Formatted Content */}
        <div className="prose prose-invert prose-amber max-w-none">
          <ReactMarkdown
            components={{
              // Custom styling for Markdown elements to keep it parent-friendly
              p: ({ children }) => (
                <p className="text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-[#b7b1a6] mb-4">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="text-amber-400 font-semibold">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-[#b7b1a6]">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-sm sm:text-base leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <div className="border-l-4 border-amber-600/50 pl-4 py-1 italic text-[#8f877a] bg-amber-900/5 my-6">
                  {children}
                </div>
              ),
            }}
          >
            {concept.content}
          </ReactMarkdown>
        </div>

        {/* Progress Section */}
        <div className="pt-5 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#8f877a]">
            Lesson {conceptIndex + 1} of {totalConcepts}
          </p>

          <div className="w-24 sm:w-32 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-500"
              style={{
                width: `${((conceptIndex + 1) / totalConcepts) * 100}%`,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConceptCard;
'use client';

import React from 'react';

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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {concept.title}
        </h2>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-[#b7b1a6]">
            {concept.content}
          </p>
        </div>

        {/* Progress */}
        <div className="pt-5 border-t border-white/10 flex items-center justify-between">
          
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8f877a]">
            Concept {conceptIndex + 1} / {totalConcepts}
          </p>

          {/* Progress bar */}
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
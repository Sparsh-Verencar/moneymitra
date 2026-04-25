'use client';

import React from 'react';

export interface Concept {
  id: number;
  title: string;
  content: string;
}

interface TimelineProps {
  concepts: Concept[];
  selectedConceptId: number;
  onSelectConcept: (id: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  concepts,
  selectedConceptId,
  onSelectConcept,
}) => {
  return (
    <div className="w-full md:w-64 md:pr-6 lg:pr-8 overflow-y-auto">
      <div className="space-y-5">
        
        {/* Header */}
        <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#8f877a]">
          Learning Path
        </h3>

        {/* Timeline */}
        <div className="space-y-4">
          {concepts.map((concept, index) => {
            const isActive = selectedConceptId === concept.id;

            return (
              <div key={concept.id} className="flex gap-4">
                
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onSelectConcept(concept.id)}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-cyan-400 border-transparent scale-125'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  />

                  {index < concepts.length - 1 && (
                    <div className="w-[2px] h-10 mt-2 bg-gradient-to-b from-white/15 to-transparent" />
                  )}
                </div>

                {/* Label */}
                <button
                  onClick={() => onSelectConcept(concept.id)}
                  className={`flex-1 text-left transition ${
                    isActive
                      ? 'text-white'
                      : 'text-[#8f877a] hover:text-[#cfc7b8]'
                  }`}
                >
                  <p className="text-sm sm:text-base font-medium leading-snug line-clamp-2">
                    {concept.title}
                  </p>

                  {/* Optional small progress hint */}
                  <p className="text-[10px] uppercase tracking-[0.25em] mt-1 opacity-60">
                    Step {index + 1}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
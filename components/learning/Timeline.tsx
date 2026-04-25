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

const Timeline: React.FC<TimelineProps> = ({ concepts, selectedConceptId, onSelectConcept }) => {
  return (
    <div className="w-64 border-r border-amber-500 border-opacity-20 pr-8 overflow-y-auto">
      <div className="space-y-6">
        <h3 className="text-amber-400 font-mono text-sm tracking-widest">YOUR LEARNING PATH</h3>
        
        <div className="space-y-4">
          {concepts.map((concept, index) => (
            <div key={concept.id} className="flex gap-4">
              {/* Timeline marker */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 border-2 rounded-full transition-all cursor-pointer ${
                    selectedConceptId === concept.id
                      ? 'border-amber-400 bg-amber-400 scale-125'
                      : 'border-amber-500 border-opacity-30 hover:border-opacity-60'
                  }`}
                  onClick={() => onSelectConcept(concept.id)}
                ></div>
                {index < concepts.length - 1 && (
                  <div className="w-0.5 h-12 bg-gradient-to-b from-amber-500 from-opacity-20 to-transparent mt-2"></div>
                )}
              </div>

              {/* Concept label */}
              <div
                className={`flex-1 pt-1 cursor-pointer transition-all ${
                  selectedConceptId === concept.id
                    ? 'text-amber-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
                onClick={() => onSelectConcept(concept.id)}
              >
                <p className="text-sm font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                  {concept.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
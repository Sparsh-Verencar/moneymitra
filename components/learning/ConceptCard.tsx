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

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, conceptIndex, totalConcepts }) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500 border-opacity-20 p-12 overflow-y-auto"
      style={{ borderRadius: '4px' }}>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-4xl font-serif text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>
          {concept.title}
        </h2>
        
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed text-lg">
            {concept.content}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="pt-6 border-t border-amber-500 border-opacity-20">
          <p className="text-amber-500 text-sm font-mono">
            Concept {conceptIndex + 1} of {totalConcepts}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptCard;
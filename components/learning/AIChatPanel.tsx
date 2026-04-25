'use client';

import React from 'react';
import { X, Send } from 'lucide-react';
import type { Concept } from './ConceptCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  concept: Concept;
  messages: Message[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  concept,
  messages,
  chatInput,
  onChatInputChange,
  onSendMessage,
  onClose,
}) => {
  return (
    <div className="w-full lg:w-96 flex flex-col rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#8f877a]">
            AI Guide
          </h3>
          <p className="text-sm text-white mt-1">Ask about this concept</p>
        </div>

        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="text-sm text-[#8f877a] leading-6">
            Ask anything about{' '}
            <span className="text-white">{concept.title}</span>. I’ll explain it
            in simple terms.
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={idx}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-6 rounded-2xl border ${
                    isUser
                      ? 'bg-linear-to-r from-amber-400/20 to-cyan-400/20 border-white/10 text-white'
                      : 'bg-white/5 border-white/10 text-[#d6d0c4]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Ask a question..."
          className="flex-1 rounded-full bg-black/20 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-[#8f877a] focus:outline-none focus:border-cyan-400/40"
        />

        <button
          onClick={onSendMessage}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-cyan-400/20 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;

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
  onClose
}) => {
  return (
    <div className="w-96 border-l border-amber-500 border-opacity-20 pl-8 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-amber-400 font-mono text-sm tracking-widest">AI GUIDE</h3>
        <button
          onClick={onClose}
          className="text-amber-400 hover:text-amber-300 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-slate-400 text-sm">
            Ask me anything about {concept.title}. I'm here to help clarify concepts.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded text-sm ${
                  msg.role === 'user'
                    ? 'bg-amber-500 bg-opacity-20 text-amber-100 border border-amber-500 border-opacity-30'
                    : 'bg-slate-800 text-slate-100 border border-amber-500 border-opacity-20'
                }`}
                style={{ borderRadius: '4px' }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-6 border-t border-amber-500 border-opacity-20">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-800 border border-amber-500 border-opacity-20 text-white text-sm px-3 py-2 focus:border-opacity-40 focus:outline-none transition"
          style={{ borderRadius: '2px' }}
        />
        <button
          onClick={onSendMessage}
          className="p-2 border border-amber-500 text-amber-400 hover:bg-amber-500 hover:bg-opacity-10 transition"
          style={{ borderRadius: '2px' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
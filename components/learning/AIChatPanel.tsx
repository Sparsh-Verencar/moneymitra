'use client';

import React, { useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Concept } from './ConceptCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  concept: Concept;
  messages: Message[];
  chatInput: string;
  isTyping: boolean;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  concept,
  messages,
  chatInput,
  isTyping,
  onChatInputChange,
  onSendMessage,
  onClose,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Isolate scroll — prevent page scroll when cursor is inside chat
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    const atTop = el.scrollTop === 0 && e.deltaY < 0;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;

    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full lg:w-96 flex flex-col rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-5 h-150">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
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

      {/* Messages — isolated scrollable area */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex-1 overflow-y-auto pr-1 space-y-4 overscroll-contain"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
      >
        {messages.length === 0 ? (
          <div className="text-sm text-[#8f877a] leading-6">
            Ask anything about{' '}
            <span className="text-white">{concept.title}</span>. I'll explain it
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
                  className={`max-w-[85%] px-4 py-3 text-sm leading-6 rounded-2xl border ${
                    isUser
                      ? 'bg-linear-to-r from-amber-400/20 to-cyan-400/20 border-white/10 text-white'
                      : 'bg-white/5 border-white/10 text-[#d6d0c4]'
                  }`}
                >
                  {isUser ? (
                    // User messages — plain text
                    msg.content
                  ) : (
                    // AI messages — render markdown
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-amber-400 font-semibold">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="text-[#e0d9cc] italic">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 mb-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[#d6d0c4]">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-black/30 text-amber-300 px-1.5 py-0.5 rounded text-[12px] font-mono">
                            {children}
                          </code>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-white font-semibold text-[15px] mb-1">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-white font-medium mb-1">
                            {children}
                          </h4>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-amber-400/50 pl-3 text-[#a09890] italic my-2">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl border bg-white/5 border-white/10 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 border-t border-white/10 pt-4 shrink-0">
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
          disabled={isTyping || !chatInput.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-cyan-400/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;

'use client';

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { Concept } from './ConceptCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  concept: Concept;
  onClose: () => void;
  userProfile: any; // Pass user profile from parent
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  concept,
  onClose,
  userProfile
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userProfile.id,
          message: chatInput,
          user_profile: userProfile
        })
      });

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

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
            Ask me anything about personal finance in India. I'm here to help based on your financial situation.
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
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-100 border border-amber-500 border-opacity-20 px-4 py-3 text-sm rounded">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-6 border-t border-amber-500 border-opacity-20">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 bg-slate-800 border border-amber-500 border-opacity-20 text-white text-sm px-3 py-2 focus:border-opacity-40 focus:outline-none transition disabled:opacity-50"
          style={{ borderRadius: '2px' }}
        />
        <button
          onClick={onSendMessage}
          disabled={loading}
          className="p-2 border border-amber-500 text-amber-400 hover:bg-amber-500 hover:bg-opacity-10 transition disabled:opacity-50"
          style={{ borderRadius: '2px' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
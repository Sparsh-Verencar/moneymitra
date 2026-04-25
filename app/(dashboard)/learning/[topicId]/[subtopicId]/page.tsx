'use client';

import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { topics } from '@/app/lib/financialTopics';
import Timeline from '@/components/learning/Timeline';
import ConceptCard from '@/components/learning/ConceptCard';
import AIChatPanel from '@/components/learning/AIChatPanel';

const LearningPage = () => {
  const router = useRouter();
  const params = useParams();

  const topicId = parseInt(params.topicId as string);
  const subtopicId = parseInt(params.subtopicId as string);

  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);

  const initialConceptId = subtopic?.concepts[0]?.id ?? 0;

  const [selectedConceptId, setSelectedConceptId] = useState(initialConceptId);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  if (!topic || !subtopic) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center">
        Content not found
      </div>
    );
  }

  const selectedConcept =
    subtopic.concepts.find((c) => c.id === selectedConceptId) ||
    subtopic.concepts[0];

  const currentIndex = subtopic.concepts.findIndex(
    (c) => c.id === selectedConceptId,
  );

  const isFirstConcept = currentIndex === 0;
  const isLastConcept = currentIndex === subtopic.concepts.length - 1;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Let's break this down simply: ${chatInput}`,
        },
      ]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#f4f1ea]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push(`/topics/${topicId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-amber-400/40 transition"
          >
            <Home size={18} className="text-amber-400" />
          </button>

          <div className="text-sm text-[#b7b1a6] truncate">
            <span className="text-white">{topic.title}</span> / {subtopic.title}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* MOBILE TIMELINE (top) */}
        <div className="md:hidden mb-6">
          <Timeline
            concepts={subtopic.concepts}
            selectedConceptId={selectedConceptId}
            onSelectConcept={setSelectedConceptId}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* DESKTOP TIMELINE */}
          <div className="hidden md:block w-65 shrink-0">
            <Timeline
              concepts={subtopic.concepts}
              selectedConceptId={selectedConceptId}
              onSelectConcept={setSelectedConceptId}
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col gap-6">
            <ConceptCard
              concept={selectedConcept}
              conceptIndex={currentIndex}
              totalConcepts={subtopic.concepts.length}
            />

            {/* NAV + ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-3">
                <button
                  disabled={isFirstConcept}
                  onClick={() =>
                    setSelectedConceptId(
                      subtopic.concepts[currentIndex - 1]?.id,
                    )
                  }
                  className={`px-5 py-3 text-sm rounded-xl border transition ${
                    isFirstConcept
                      ? 'border-white/10 text-[#555]'
                      : 'border-white/10 hover:border-amber-400 text-white hover:bg-white/5'
                  }`}
                >
                  ← Previous
                </button>

                <button
                  disabled={isLastConcept}
                  onClick={() =>
                    setSelectedConceptId(
                      subtopic.concepts[currentIndex + 1]?.id,
                    )
                  }
                  className={`px-5 py-3 text-sm rounded-xl border transition ${
                    isLastConcept
                      ? 'border-white/10 text-[#555]'
                      : 'border-white/10 hover:border-amber-400 text-white hover:bg-white/5'
                  }`}
                >
                  Next →
                </button>
              </div>

              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="px-5 py-3 rounded-xl bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition"
              >
                {chatOpen ? 'Close AI' : 'Ask AI'}
              </button>
            </div>
          </div>

          {/* CHAT PANEL */}
          {chatOpen && (
            <div className="w-full md:w-90 shrink-0">
              <AIChatPanel
                concept={selectedConcept}
                messages={messages}
                chatInput={chatInput}
                onChatInputChange={setChatInput}
                onSendMessage={handleSendMessage}
                onClose={() => setChatOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;

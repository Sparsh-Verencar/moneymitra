'use client';

import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { topics } from '@/app/lib/financialTopics';
import Timeline from '@/components/learning/Timeline';
import ConceptCard from '@/components/learning/ConceptCard';
import AIChatPanel from '@/components/learning/AIChatPanel';
import { db, auth } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const LearningPage = () => {
  const router = useRouter();
  const params = useParams();
  const topicId = parseInt(params.topicId as string);
  const subtopicId = parseInt(params.subtopicId as string);
  
  const topic = topics.find(t => t.id === topicId);
  const subtopic = topic?.subtopics.find(s => s.id === subtopicId);
  
  const initialConceptId = subtopic?.concepts[0]?.id ?? 0;
  const [selectedConceptId, setSelectedConceptId] = useState<number>(initialConceptId);
  const [chatOpen, setChatOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile({
              id: user.uid,
              ...docSnap.data()
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!topic || !subtopic) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Content not found</div>;
  }

  const selectedConcept = subtopic.concepts.find(c => c.id === selectedConceptId) || subtopic.concepts[0];
  const currentIndex = subtopic.concepts.findIndex(c => c.id === selectedConceptId);
  const isFirstConcept = currentIndex === 0;
  const isLastConcept = currentIndex === subtopic.concepts.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-amber-500 border-opacity-20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push(`/topics/${topicId}`)}
            className="text-amber-400 hover:text-amber-300 transition p-2 border border-amber-500 border-opacity-30"
            style={{ borderRadius: '2px' }}
          >
            <Home size={20} />
          </button>
          <div className="text-amber-400 font-serif text-sm">
            / {topic.title} / {subtopic.title}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8 h-[calc(100vh-200px)]">
          {/* Timeline Sidebar */}
          <Timeline 
            concepts={subtopic.concepts}
            selectedConceptId={selectedConceptId}
            onSelectConcept={setSelectedConceptId}
          />

          {/* Content Area */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Concept Card */}
            <ConceptCard 
              concept={selectedConcept}
              conceptIndex={currentIndex}
              totalConcepts={subtopic.concepts.length}
            />

            {/* Action buttons and navigation */}
            <div className="flex gap-4 items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (currentIndex > 0) {
                      setSelectedConceptId(subtopic.concepts[currentIndex - 1].id);
                    }
                  }}
                  className={`px-6 py-3 border font-mono text-sm tracking-widest ${
                    isFirstConcept
                      ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                      : 'border-amber-500 text-amber-400 hover:bg-amber-500 hover:bg-opacity-10'
                  } transition-all`}
                  style={{ borderRadius: '2px' }}
                  disabled={isFirstConcept}
                >
                  ← Previous
                </button>

                <button
                  onClick={() => {
                    if (currentIndex < subtopic.concepts.length - 1) {
                      setSelectedConceptId(subtopic.concepts[currentIndex + 1].id);
                    }
                  }}
                  className={`px-6 py-3 border font-mono text-sm tracking-widest ${
                    isLastConcept
                      ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                      : 'border-amber-500 text-amber-400 hover:bg-amber-500 hover:bg-opacity-10'
                  } transition-all`}
                  style={{ borderRadius: '2px' }}
                  disabled={isLastConcept}
                >
                  Next →
                </button>
              </div>

              {/* AI Chat toggle */}
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="px-6 py-3 border border-amber-500 text-amber-400 font-mono text-sm tracking-widest hover:bg-amber-500 hover:bg-opacity-10 transition-all flex items-center gap-2"
                style={{ borderRadius: '2px' }}
              >
                {chatOpen ? '✕ Hide AI' : '💬 Ask AI'}
              </button>
            </div>
          </div>

          {/* AI Chat Sidebar */}
          {chatOpen && userProfile && (
            <AIChatPanel
              concept={selectedConcept}
              onClose={() => setChatOpen(false)}
              userProfile={userProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
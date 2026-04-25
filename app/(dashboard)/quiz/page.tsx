'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { topics } from '@/app/lib/financialTopics'; // adjust path

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topicId = Number(searchParams.get('topicId'));
  const subtopicId = Number(searchParams.get('subtopicId'));

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const topic = topics.find((t) => t.id === topicId);
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId);

  useEffect(() => {
    if (!topic || !subtopic) return;

    const fetchQuiz = async () => {
      const res = await fetch('http://localhost:8000/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.title,
          subtopic: subtopic.title,
          concepts: subtopic.concepts.map((c) => ({
            title: c.title,
            content: c.content,
            keyPoints: c.keyPoints ?? [],
          })),
          num_questions: subtopic.concepts.length * 2,
        }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setLoading(false);
    };

    fetchQuiz();
  }, []);

  const score = Object.entries(selected).filter(
    ([i, ans]) => ans === questions[Number(i)].correct,
  ).length;

  if (loading) return <p>Generating quiz...</p>;

  return (
    <div>
      <h1>{subtopic?.title} Quiz</h1>

      {questions.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() =>
                !submitted && setSelected((prev) => ({ ...prev, [i]: opt[0] }))
              }
              style={{
                background: submitted
                  ? opt[0] === q.correct
                    ? 'green'
                    : selected[i] === opt[0]
                      ? 'red'
                      : 'gray'
                  : selected[i] === opt[0]
                    ? 'blue'
                    : 'gray',
              }}
            >
              {opt}
            </button>
          ))}
          {submitted && <p>{q.explanation}</p>}
        </div>
      ))}

      {!submitted && <button onClick={() => setSubmitted(true)}>Submit</button>}

      {submitted && (
        <p>
          Score: {score}/{questions.length}
        </p>
      )}
    </div>
  );
}

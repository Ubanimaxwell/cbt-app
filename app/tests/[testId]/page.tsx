"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Question = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

type Test = {
  id: string;
  title: string;
  duration_minutes: number;
};

export default function TakeTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Load test, questions, and start the attempt
  useEffect(() => {
    async function setup() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: testData } = await supabase
        .from("tests")
        .select("id, title, duration_minutes")
        .eq("id", testId)
        .single();

      if (!testData) {
        router.push("/tests");
        return;
      }
      setTest(testData);
      setSecondsLeft(testData.duration_minutes * 60);

      const { data: questionData } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", testId)
        .order("created_at", { ascending: true });

      if (questionData) setQuestions(questionData);

      const { data: attempt } = await supabase
        .from("attempts")
        .insert({ test_id: testId, student_id: user.id })
        .select()
        .single();

      if (attempt) setAttemptId(attempt.id);

      setLoading(false);
    }

    setup();
  }, [testId, router]);

  const handleSubmit = useCallback(async () => {
    if (submitted || !attemptId) return;
    setSubmitted(true);

    let correctCount = 0;
    const answerRows = questions.map((q) => {
      const selected = answers[q.id] || null;
      if (selected === q.correct_option) correctCount++;
      return {
        attempt_id: attemptId,
        question_id: q.id,
        selected_option: selected,
      };
    });

    if (answerRows.length > 0) {
      await supabase.from("answers").insert(answerRows);
    }

    await supabase
      .from("attempts")
      .update({ score: correctCount, submitted_at: new Date().toISOString() })
      .eq("id", attemptId);

    setScore(correctCount);
  }, [submitted, attemptId, questions, answers]);

  // Countdown timer
  useEffect(() => {
    if (loading || submitted) return;

    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, loading, submitted, handleSubmit]);

  function selectAnswer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">Loading test...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Test Submitted</h1>
          <p className="mt-4 text-4xl font-bold text-zinc-900">
            {score} / {questions.length}
          </p>
          <p className="mt-2 text-zinc-600">
            You scored {score} out of {questions.length} questions correctly.
          </p>
          <button
            onClick={() => router.push("/tests")}
            className="mt-6 rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="sticky top-4 z-10 mb-6 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4">
          <h1 className="text-lg font-semibold text-zinc-900">{test?.title}</h1>
          <span
            className={`text-xl font-bold ${
              secondsLeft <= 60 ? "text-red-600" : "text-zinc-900"
            }`}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-zinc-200 bg-white p-6">
              <p className="font-medium text-zinc-900">
                {i + 1}. {q.question_text}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {(["a", "b", "c", "d"] as const).map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 ${
                      answers[q.id] === opt
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt}
                      onChange={() => selectAnswer(q.id, opt)}
                    />
                    <span className="text-zinc-800">
                      {q[`option_${opt}` as keyof Question]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-700"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
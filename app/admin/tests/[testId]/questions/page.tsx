"use client";

import { useState, useEffect } from "react";
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

export default function AddQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("a");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  async function fetchQuestions() {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", testId)
      .order("created_at", { ascending: true });

    if (data) setQuestions(data);
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase.from("questions").insert({
      test_id: testId,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_option: correctOption,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Clear the form for the next question
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectOption("a");
    setLoading(false);
    fetchQuestions();
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-900">Add Questions</h1>
        <p className="mt-2 text-zinc-600">
          Add as many questions as you need. When you're done, go back to the dashboard.
        </p>

        <form
          onSubmit={handleAddQuestion}
          className="mt-8 rounded-lg border border-zinc-200 bg-white p-6"
        >
          {error && (
            <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">Question</label>
              <textarea
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Option A</label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Option B</label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Option C</label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Option D</label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Correct Option</label>
              <select
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900">
            Questions added ({questions.length})
          </h2>
          <div className="mt-4 space-y-3">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="font-medium text-zinc-900">
                  {i + 1}. {q.question_text}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Correct answer: {q.correct_option.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="mt-8 rounded-lg border border-zinc-300 px-5 py-2 font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Done — Back to Dashboard
        </button>
      </div>
    </div>
  );
}
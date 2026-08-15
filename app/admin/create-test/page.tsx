"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreateTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(15);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("tests")
      .insert({
        title,
        description,
        duration_minutes: duration,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(`/admin/tests/${data.id}/questions`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <form
        onSubmit={handleCreate}
        className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-8"
      >
        <h1 className="text-2xl font-bold text-zinc-900">Create a Test</h1>

        {error && (
          <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">Test Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="e.g. Mid-Semester Physics Test"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
              rows={3}
              placeholder="Optional short description for students"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Duration (minutes)</label>
            <input
              type="number"
              required
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Test & Add Questions"}
          </button>
        </div>
      </form>
    </div>
  );
}
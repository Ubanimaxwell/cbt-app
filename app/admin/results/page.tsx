"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AttemptRow = {
  id: string;
  score: number | null;
  submitted_at: string | null;
  started_at: string;
  tests: { title: string } | null;
  profiles: { full_name: string } | null;
};

export default function ResultsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);

  useEffect(() => {
    async function checkAccessAndLoad() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/tests");
        return;
      }

      const { data, error } = await supabase
        .from("attempts")
        .select("id, score, submitted_at, started_at, tests(title), profiles(full_name)")
        .order("started_at", { ascending: false });

      if (data) setAttempts(data as unknown as AttemptRow[]);
      if (error) console.error(error);

      setChecking(false);
    }

    checkAccessAndLoad();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Results</h1>
            <p className="mt-2 text-zinc-600">
              All student attempts across all tests.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          {attempts.length === 0 ? (
            <p className="p-6 text-zinc-500">No attempts yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-zinc-700">Student</th>
                  <th className="px-6 py-3 font-medium text-zinc-700">Test</th>
                  <th className="px-6 py-3 font-medium text-zinc-700">Score</th>
                  <th className="px-6 py-3 font-medium text-zinc-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-6 py-3 text-zinc-900">
                      {a.profiles?.full_name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-zinc-900">
                      {a.tests?.title || "Unknown test"}
                    </td>
                    <td className="px-6 py-3 text-zinc-900">
                      {a.score !== null ? a.score : "—"}
                    </td>
                    <td className="px-6 py-3">
                      {a.submitted_at ? (
                        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Submitted
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                          In progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
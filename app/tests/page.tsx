"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Test = {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
};

export default function TestsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setChecking(false);
      fetchTests();
    }

    checkAccess();
  }, [router]);

  async function fetchTests() {
    const { data } = await supabase
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setTests(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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
            <h1 className="text-3xl font-bold text-zinc-900">
              Available Tests
            </h1>
            <p className="mt-2 text-zinc-600">
              Select a test below to begin. Once started, the timer cannot be paused.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Log Out
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {tests.length === 0 && (
            <p className="text-zinc-500">No tests available yet. Check back later.</p>
          )}

          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {test.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  {test.description}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {test.duration_minutes} minutes
                </p>
              </div>
              <Link
                href={`/tests/${test.id}`}
                className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700"
              >
                Start Test
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
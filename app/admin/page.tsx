"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
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

      setChecking(false);
    }

    checkAccess();
  }, [router]);

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
              Admin Dashboard
            </h1>
            <p className="mt-2 text-zinc-600">
              Manage your tests and view results here.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Log Out
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/create-test"
            className="rounded-lg border border-zinc-200 bg-white p-6 hover:border-zinc-400"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              Create a Test
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Set up a new test with questions and a time limit.
            </p>
          </Link>

          <Link
            href="/admin/results"
            className="rounded-lg border border-zinc-200 bg-white p-6 hover:border-zinc-400"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              View Results
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              See scores and attempts from students.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
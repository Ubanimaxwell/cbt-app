"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Fetch their profile to know where to redirect them
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      setError("Could not find your profile. Please contact support.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(profile.role === "admin" ? "/admin" : "/tests");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8"
      >
        <h1 className="text-2xl font-bold text-zinc-900">Log in</h1>

        {error && (
          <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium text-zinc-900 underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
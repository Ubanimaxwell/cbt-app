import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">
        CBT Portal
      </h1>
      <p className="mt-4 max-w-md text-lg text-zinc-600">
        A simple computer-based testing platform. Create tests, take tests, and view results in real time.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/admin"
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700"
        >
          Login as Admin
        </Link>
        <Link
          href="/tests"
          className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Login as Student
        </Link>
      </div>
    </div>
  );
}
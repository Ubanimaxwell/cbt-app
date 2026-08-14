export default function TestsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900">
          Available Tests
        </h1>
        <p className="mt-2 text-zinc-600">
          Select a test below to begin. Once started, the timer cannot be paused.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Sample Test
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                10 questions · 15 minutes
              </p>
            </div>
            <button className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700">
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
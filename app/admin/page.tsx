export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-zinc-600">
          Manage your tests and view results here.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Create a Test
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Set up a new test with questions and a time limit.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              View Results
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              See scores and attempts from students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
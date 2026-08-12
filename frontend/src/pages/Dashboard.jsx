import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            AI Resume Analyzer
          </h1>

          <button
            onClick={logout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome!
          </h2>

          <p className="mt-3 text-gray-600">
            You are logged in as:
          </p>

          <p className="mt-1 font-medium text-blue-600">
            {user?.email}
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
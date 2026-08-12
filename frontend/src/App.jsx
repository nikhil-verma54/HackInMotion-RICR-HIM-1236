import { auth } from "./config/firebase";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">
          AI Resume Analyzer
        </h1>

        <p className="mt-3 text-gray-600">
          Firebase Auth Ready
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Auth object: {auth ? "Connected" : "Not connected"}
        </p>
      </div>
    </div>
  );
}

export default App;
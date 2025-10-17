import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          Kelime Oyunu
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          Tauri v2 + React + TypeScript + Tailwind CSS
        </p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Count: {count}
        </button>
        <p className="text-gray-400 mt-8">
          ✅ Project setup complete!
        </p>
      </div>
    </div>
  );
}

export default App;

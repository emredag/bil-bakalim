import { DesignSystemDemo } from './components/DesignSystemDemo';
import { runStoreTests } from './test-stores';

/**
 * Main App Component
 *
 * Currently showing Design System Demo (Task 05)
 * This will be replaced with actual app routing in Task 37
 */
function App() {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => runStoreTests()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          🧪 Test Stores
        </button>
      </div>
      <DesignSystemDemo />
    </div>
  );
}

export default App;

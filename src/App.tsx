import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { soundService } from './services/soundService';

/**
 * Main App Component
 *
 * Features:
 * - React Router navigation (Task 37)
 * - Error Boundary for error handling (Task 39)
 * - Sound service initialization synced with settings store (Task 31)
 */
function App() {
  useEffect(() => {
    // Initialize sound service and sync with settings store
    soundService.init();
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;

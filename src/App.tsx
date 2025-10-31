import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { soundService } from './services/soundService';

/**
 * Main App Component
 */
function App() {
  useEffect(() => {
    // Initialize sound service (non-blocking)
    try {
      soundService.init();
    } catch (err) {
      console.warn('Sound service init failed:', err);
    }
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;

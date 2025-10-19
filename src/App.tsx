import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main App Component
 *
 * Features:
 * - React Router navigation (Task 37)
 * - Error Boundary for error handling (Task 39)
 */
function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;

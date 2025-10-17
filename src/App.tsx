import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

/**
 * Main App Component
 * 
 * Now with React Router navigation (Task 37)
 * Replaces Design System Demo with actual app routing
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;

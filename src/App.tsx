import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { soundService } from './services/soundService';
import { checkForUpdates, ReleaseInfo, getCurrentVersion } from './services';
import { UpdateNotification } from './components/modals/UpdateNotification';

/**
 * Main App Component
 */
function App() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    // Initialize sound service (non-blocking)
    try {
      soundService.init();
    } catch (err) {
      console.warn('Sound service init failed:', err);
    }

    // Check for updates on app start (non-blocking)
    // Will show every time app opens if update is available
    checkForUpdates()
      .then((result) => {
        if (result.hasUpdate && result.releaseInfo) {
          setReleaseInfo(result.releaseInfo);
          setShowUpdateModal(true);
        }
      })
      .catch((err) => {
        console.warn('Update check failed:', err);
      });
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      
      {/* Update Notification Modal */}
      {releaseInfo && (
        <UpdateNotification
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          currentVersion={getCurrentVersion()}
          releaseInfo={releaseInfo}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;

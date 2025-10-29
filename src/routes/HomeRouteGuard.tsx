/**
 * Home Route Guard Component
 * Checks first launch status on every render and redirects accordingly
 */

import { Navigate } from 'react-router-dom';
import { MainMenuScreen } from '../components/screens';
import { isFirstLaunch } from '../services/firstLaunch';
import { ROUTES } from './constants';

/**
 * HomeRouteGuard - Dynamic first launch check
 *
 * This component checks first launch status on every render,
 * ensuring that the redirect happens correctly even after
 * the first launch flag is set during the session.
 */
export function HomeRouteGuard() {
  const shouldShowWelcome = isFirstLaunch();

  if (shouldShowWelcome) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  return <MainMenuScreen />;
}

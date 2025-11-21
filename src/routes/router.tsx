/**
 * Router Configuration
 * PRD Reference: Section 4 - OYUN AKIŞI
 * Task 40 - Performance Optimization: Build-time code splitting via Vite
 *
 * Defines all routes and their components
 * Includes PageTransition wrapper for smooth page transitions (Task 06)
 * Performance: Code splitting via lazy loading for large screens
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';
import {
  WelcomeScreen,
  CategorySelectScreen,
  ModeSelectScreen,
  ParticipantSetupScreen,
  SettingsScreen,
  HowToPlayScreen,
} from '../components/screens';
import { PageLayout } from '../components/layouts/PageLayout';
import { HomeRouteGuard } from './HomeRouteGuard';

// Lazy load large/complex screens for better performance
const GameScreen = lazy(() => import('../components/screens/GameScreen').then(m => ({ default: m.GameScreen })));
const ResultsScreen = lazy(() => import('../components/screens/ResultsScreenWrapper').then(m => ({ default: m.ResultsScreen })));
const GameHistoryScreen = lazy(() => import('../components/screens/GameHistoryScreen').then(m => ({ default: m.GameHistoryScreen })));
const GameHistoryDetailScreen = lazy(() => import('../components/screens/GameHistoryDetailScreen').then(m => ({ default: m.GameHistoryDetailScreen })));
const CategoryManagementScreen = lazy(() => import('../components/screens/CategoryManagementScreen').then(m => ({ default: m.CategoryManagementScreen })));
const WordManagementScreen = lazy(() => import('../components/screens/WordManagementScreen').then(m => ({ default: m.WordManagementScreen })));

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Yükleniyor...
  </div>
);

/**
 * Main application router
 * Uses React Router v7 createBrowserRouter with PageLayout wrapper
 * All routes include fade + slide transitions (PRD 8.4)
 *
 * First launch detection: HomeRouteGuard checks on every render
 */
export const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomeRouteGuard />,
      },
      // Task 38: First Launch Experience
      {
        path: ROUTES.WELCOME,
        element: <WelcomeScreen />,
      },
      // Game Flow
      {
        path: ROUTES.CATEGORY_SELECT,
        element: <CategorySelectScreen />,
      },
      {
        path: ROUTES.MODE_SELECT,
        element: <ModeSelectScreen />,
      },
      {
        path: ROUTES.PARTICIPANT_SETUP,
        element: <ParticipantSetupScreen />,
      },
      {
        path: ROUTES.GAME,
        element: <Suspense fallback={<LoadingFallback />}><GameScreen /></Suspense>,
      },
      {
        path: ROUTES.RESULTS,
        element: <Suspense fallback={<LoadingFallback />}><ResultsScreen /></Suspense>,
      },
      // History
      {
        path: ROUTES.HISTORY,
        element: <Suspense fallback={<LoadingFallback />}><GameHistoryScreen /></Suspense>,
      },
      {
        path: ROUTES.HISTORY_DETAIL,
        element: <Suspense fallback={<LoadingFallback />}><GameHistoryDetailScreen /></Suspense>,
      },
      // Management
      {
        path: ROUTES.CATEGORY_MANAGEMENT,
        element: <Suspense fallback={<LoadingFallback />}><CategoryManagementScreen /></Suspense>,
      },
      {
        path: ROUTES.WORD_MANAGEMENT,
        element: <Suspense fallback={<LoadingFallback />}><WordManagementScreen /></Suspense>,
      },
      // Settings & Help
      {
        path: ROUTES.SETTINGS,
        element: <SettingsScreen />,
      },
      {
        path: ROUTES.HOW_TO_PLAY,
        element: <HowToPlayScreen />,
      },
      // Catch all - redirect to home
      {
        path: '*',
        element: <Navigate to={ROUTES.HOME} replace />,
      },
    ],
  },
]);

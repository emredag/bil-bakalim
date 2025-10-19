/**
 * Router Configuration
 * PRD Reference: Section 4 - OYUN AKIŞI
 *
 * Defines all routes and their components
 * Includes PageTransition wrapper for smooth page transitions (Task 06)
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';
import {
  MainMenuScreen,
  AnimationDemo,
  SoundDemo,
  ErrorDemo,
  CategorySelectScreen,
  ModeSelectScreen,
  ParticipantSetupScreen,
  GameScreen,
  ResultsScreen,
  HistoryScreen,
  HistoryDetailScreen,
  CategoryManagementScreen,
  WordManagementScreen,
  SettingsScreen,
  HowToPlayScreen,
} from '../components/screens';
import { PageLayout } from '../components/layouts/PageLayout';

/**
 * Main application router
 * Uses React Router v7 createBrowserRouter with PageLayout wrapper
 * All routes include fade + slide transitions (PRD 8.4)
 */
export const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <MainMenuScreen />,
      },
      // Demo Pages (Task 06, 07, 39 Testing)
      {
        path: '/animation-demo',
        element: <AnimationDemo />,
      },
      {
        path: '/sound-demo',
        element: <SoundDemo />,
      },
      {
        path: '/error-demo',
        element: <ErrorDemo />,
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
        element: <GameScreen />,
      },
      {
        path: ROUTES.RESULTS,
        element: <ResultsScreen />,
      },
      // History
      {
        path: ROUTES.HISTORY,
        element: <HistoryScreen />,
      },
      {
        path: ROUTES.HISTORY_DETAIL,
        element: <HistoryDetailScreen />,
      },
      // Management
      {
        path: ROUTES.CATEGORY_MANAGEMENT,
        element: <CategoryManagementScreen />,
      },
      {
        path: ROUTES.WORD_MANAGEMENT,
        element: <WordManagementScreen />,
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

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
  AnimationDemo,
  SoundDemo,
  ErrorDemo,
  A11yDemo,
  WelcomeScreen,
  FirstLaunchTest,
  CategorySelectScreen,
  ModeSelectScreen,
  ParticipantSetupScreen,
  GameScreen,
  GameScreenTest,
  ResultsScreen,
  HistoryScreen,
  HistoryDetailScreen,
  CategoryManagementScreen,
  WordManagementScreen,
  SettingsScreen,
  HowToPlayScreen,
} from '../components/screens';
import { PageLayout } from '../components/layouts/PageLayout';
import { HomeRouteGuard } from './HomeRouteGuard';
import WordSelectionTestRunner from '../components/WordSelectionTestRunner';
import SimpleTauriTest from '../components/SimpleTauriTest';
import { CategoryValidationDemo } from '../components/CategoryValidationDemo';

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
      // Demo Pages (Task 06, 07, 34, 38, 39 Testing)
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
      {
        path: '/a11y-demo',
        element: <A11yDemo />,
      },
      {
        path: '/first-launch-test',
        element: <FirstLaunchTest />,
      },
      // Task 12: Game Screen Test
      {
        path: '/game-screen-test',
        element: <GameScreenTest />,
      },
      // Task 13: Word Selection Algorithm Test
      {
        path: '/word-selection-test',
        element: <WordSelectionTestRunner />,
      },
      {
        path: '/tauri-test',
        element: <SimpleTauriTest />,
      },
      // Task 29: Category Validation Demo
      {
        path: '/validation-demo',
        element: <CategoryValidationDemo />,
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

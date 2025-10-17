/**
 * Router Configuration
 * PRD Reference: Section 4 - OYUN AKIŞI
 * 
 * Defines all routes and their components
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';
import {
  MainMenuScreen,
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

/**
 * Main application router
 * Uses React Router v6 createBrowserRouter
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainMenuScreen />,
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
]);

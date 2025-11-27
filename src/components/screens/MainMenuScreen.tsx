/**
 * Main Menu Screen
 * Design System v2.0 - Main Menu Migration
 * PRD Reference: Section 4.1 - Başlangıç Ekranı (Ana Menü)
 *
 * Hero-first dashboard with modern design:
 * - Hero section with prominent CTA
 * - Quick stats dashboard (3 cards)
 * - Recent activity section
 * - Quick actions grid (4 cards)
 * - Mesh gradient background
 * - Glassmorphism styling
 * - Keyboard navigation support
 * - WCAG 2.1 AA compliant
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/constants';
import { useKeyboardShortcuts, useGameHistory } from '../../hooks';
import { HeroSection } from '../main-menu/HeroSection';
import { QuickStats } from '../main-menu/QuickStats';
import { RecentActivity } from '../main-menu/RecentActivity';
import { QuickActions } from '../main-menu/QuickActions';
import './MainMenuScreen.css';

/**
 * MainMenuScreen - Primary navigation hub
 *
 * Features:
 * - Modern hero-first layout
 * - Game statistics at a glance
 * - Recent activity display
 * - Quick access to all features
 * - TV-optimized for classroom projection
 * - Responsive: Mobile → Tablet → Desktop
 * - Keyboard accessible (Tab navigation)
 */
export function MainMenuScreen() {
  const navigate = useNavigate();

  // Global keyboard shortcuts
  useKeyboardShortcuts();

  // Fetch game history data for stats and recent activity
  const { stats, lastGame, loading } = useGameHistory();

  /**
   * Navigation handlers
   */
  const handleStartGame = () => {
    void navigate(ROUTES.CATEGORY_SELECT);
  };

  const handleNavigate = (route: string) => {
    void navigate(route);
  };

  const handleViewGameDetails = (gameId: number) => {
    void navigate(`${ROUTES.HISTORY}/${gameId}`);
  };

  const handlePlayAgain = () => {
    // Navigate to category selection to start a new game
    void navigate(ROUTES.CATEGORY_SELECT);
  };

  const handleResumeGame = (gameId: number) => {
    // For now, navigate to game history detail
    // In future, could implement actual game resume functionality
    void navigate(`${ROUTES.HISTORY}/${gameId}`);
  };

  return (
    <div className="main-menu-screen">
      {/* Mesh Gradient Background */}
      <div className="main-menu-background" />

      {/* Main Container */}
      <div className="main-menu-container">
        {/* Hero Section with Primary CTA */}
        <HeroSection
          onStartGame={handleStartGame}
          lastGame={lastGame}
          onResumeGame={handleResumeGame}
        />

        {/* Quick Stats Dashboard */}
        <QuickStats stats={stats} loading={loading} />

        {/* Recent Activity */}
        <RecentActivity
          lastGame={lastGame}
          loading={loading}
          onViewDetails={handleViewGameDetails}
          onPlayAgain={handlePlayAgain}
        />

        {/* Quick Actions Grid */}
        <QuickActions onNavigate={handleNavigate} />

        {/* Footer - Version and GitHub Link */}
        <footer className="main-menu-footer">
          <p className="font-medium">v1.0.1 • MIT License</p>
          <a
            href="https://github.com/emredag/word-game-app"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="GitHub repository"
          >
            <span>GitHub'da Görüntüle</span>
            <span>→</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

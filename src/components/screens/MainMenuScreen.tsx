/**
 * Main Menu Screen
 * Design System v2.0 - Main Menu Migration
 * PRD Reference: Section 4.1 - Başlangıç Ekranı (Ana Menü)
 *
 * Hero-first dashboard with modern design:
 * - Hero section with prominent CTA
 * - Quick actions grid (4 cards)
 * - Mesh gradient background
 * - Glassmorphism styling
 * - Keyboard navigation support
 * - WCAG 2.1 AA compliant
 */

import { useNavigate } from 'react-router-dom';
import { openUrl } from '@tauri-apps/plugin-opener';
import { ROUTES } from '../../routes/constants';
import { useKeyboardShortcuts } from '../../hooks';
import { HeroSection } from '../main-menu/HeroSection';
import { QuickActions } from '../main-menu/QuickActions';
import './MainMenuScreen.css';

/**
 * MainMenuScreen - Primary navigation hub
 *
 * Features:
 * - Modern hero-first layout
 * - Quick access to all features
 * - TV-optimized for classroom projection
 * - Responsive: Mobile → Tablet → Desktop
 * - Keyboard accessible (Tab navigation)
 */
export function MainMenuScreen() {
  const navigate = useNavigate();

  // Global keyboard shortcuts
  useKeyboardShortcuts();

  /**
   * Navigation handlers
   */
  const handleStartGame = () => {
    void navigate(ROUTES.CATEGORY_SELECT);
  };

  const handleNavigate = (route: string) => {
    void navigate(route);
  };

  return (
    <div className="main-menu-screen">
      {/* Mesh Gradient Background */}
      <div className="main-menu-background" />

      {/* Main Container */}
      <div className="main-menu-container">
        {/* Hero Section with Primary CTA */}
        <HeroSection onStartGame={handleStartGame} />

        {/* Quick Actions Grid */}
        <QuickActions onNavigate={handleNavigate} />

        {/* Footer - Version, Developer and GitHub Link */}
        <footer className="main-menu-footer">
          <p className="font-medium">
            v1.2.0 • 
            <button
              onClick={() => openUrl('https://www.linkedin.com/in/emredag/')}
              className="ml-1 text-primary-400 hover:text-primary-300 transition-colors"
            >
              Emre Dağ
            </button>
          </p>
          <button
            onClick={() => openUrl('https://github.com/emredag/bil-bakalim')}
            className="footer-link"
            aria-label="GitHub repository"
          >
            <span>GitHub'da Görüntüle</span>
            <span>→</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

/**
 * PageLayout Component
 *
 * Main layout wrapper for all pages with PageTransition
 * Provides consistent page transition animations throughout the app
 * Automatically scrolls to top on route change
 */

import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageTransition } from '../../animations/PageTransition';

export const PageLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change - handle all scroll containers
  useEffect(() => {
    // Reset window scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Also reset document element and body (for some browsers)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
};

PageLayout.displayName = 'PageLayout';

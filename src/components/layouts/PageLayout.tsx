/**
 * PageLayout Component
 *
 * Main layout wrapper for all pages with PageTransition
 * Provides consistent page transition animations throughout the app
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageTransition } from '../../animations/PageTransition';

export const PageLayout: React.FC = () => {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
};

PageLayout.displayName = 'PageLayout';

/**
 * Accessibility Demo Screen - Task 34 Testing
 *
 * Demonstrates WCAG 2.1 AA accessibility features
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { SkipLink } from '../A11y';
import { announceToScreenReader } from '../../utils/a11y';

export const A11yDemo: React.FC = () => {
  const navigate = useNavigate();
  const [announceCount, setAnnounceCount] = useState(0);

  const handleAnnouncement = () => {
    announceToScreenReader(
      `Test bildirimi ${announceCount + 1}. Bu mesaj sadece ekran okuyuculara duyurulur.`,
      'polite'
    );
    setAnnounceCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <SkipLink />

      <div className="safe-container max-w-7xl mx-auto py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              ♿ Accessibility Demo
            </h1>
            <p className="text-text-secondary">
              Task 34 - WCAG 2.1 Level AA Features
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/')}
            aria-label="Ana menüye geri dön"
          >
            Back to Home
          </Button>
        </header>

        <main id="main-content">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Keyboard Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>⌨️ Keyboard Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    Full keyboard support throughout the app
                  </p>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• Tab/Shift+Tab - Navigate elements</li>
                    <li>• Space/Enter - Activate buttons</li>
                    <li>• ESC - Close modals</li>
                    <li>• Focus visible indicators</li>
                  </ul>
                  <div className="pt-2">
                    <Button size="sm" className="w-full">
                      Try Tab Navigation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screen Reader */}
            <Card>
              <CardHeader>
                <CardTitle>👁️ Screen Reader Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    ARIA labels and live regions
                  </p>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• Semantic HTML</li>
                    <li>• aria-label attributes</li>
                    <li>• aria-live regions</li>
                    <li>• Screen reader announcements</li>
                  </ul>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleAnnouncement}
                      aria-label="Ekran okuyucuya test mesajı gönder"
                    >
                      Test Announcement ({announceCount})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Focus Management */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Focus Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    Focus trap and restore
                  </p>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• Focus trap in modals</li>
                    <li>• Auto-focus on open</li>
                    <li>• Return focus on close</li>
                    <li>• Skip to content link</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Color Contrast */}
            <Card>
              <CardHeader>
                <CardTitle>🎨 Color Contrast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    WCAG AA contrast ratio 4.5:1
                  </p>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• All text meets AA standard</li>
                    <li>• Status colors + icons</li>
                    <li>• High contrast theme</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Touch Targets */}
            <Card>
              <CardHeader>
                <CardTitle>👆 Touch Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    Minimum 48×48px hit areas
                  </p>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• Large buttons</li>
                    <li>• Generous padding</li>
                    <li>• Smartboard friendly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Reduce Motion */}
            <Card>
              <CardHeader>
                <CardTitle>🎬 Reduce Motion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    Respects motion preferences
                  </p>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• System preference detection</li>
                    <li>• Reduced animations</li>
                    <li>• CSS @media query support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <Card className="bg-slate-800/50 border-2 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">ℹ️</div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary mb-2">
                    WCAG 2.1 Level AA Compliance
                  </h3>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• <strong>Keyboard:</strong> Tab/Shift+Tab, Space/Enter, ESC navigation</li>
                    <li>• <strong>Screen Reader:</strong> ARIA labels, live regions, semantic HTML</li>
                    <li>• <strong>Contrast:</strong> Minimum 4.5:1 ratio for all text</li>
                    <li>• <strong>Focus:</strong> Visible indicators, focus trap, skip links</li>
                    <li>• <strong>Touch:</strong> 48×48px minimum target size</li>
                    <li>• <strong>Motion:</strong> Reduced motion preference support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

A11yDemo.displayName = 'A11yDemo';

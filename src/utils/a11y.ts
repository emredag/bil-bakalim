/**
 * Accessibility Utility Functions
 * PRD Section 8.6 - Erişilebilirlik (A11y)
 * WCAG 2.1 Level AA Compliance
 *
 * Utility functions for accessibility features
 */

/**
 * Generate unique ID for ARIA attributes
 */
export function generateA11yId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;

  const tagName = element.tagName.toLowerCase();
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];

  if (focusableTags.includes(tagName)) {
    return !element.hasAttribute('disabled');
  }

  return element.tabIndex >= 0;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    // Check if element is visible
    return (
      el.offsetWidth > 0 && el.offsetHeight > 0 && getComputedStyle(el).visibility !== 'hidden'
    );
  });
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Announce message to screen readers
 * Creates a temporary live region for announcements
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Screen reader only
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check color contrast ratio
 * WCAG 2.1 AA requires minimum 4.5:1 for normal text
 */
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map((val) => {
      const normalized = val / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Simple RGB extraction (works for hex colors)
  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  const fgLuminance = getLuminance(hexToRgb(foreground));
  const bgLuminance = getLuminance(hexToRgb(background));

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard
 */
export function meetsContrastAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const minimumRatio = isLargeText ? 3 : 4.5;
  return ratio >= minimumRatio;
}

/**
 * Format number for screen readers
 * e.g., "1000" -> "1 thousand" or "1,000"
 */
export function formatNumberForScreenReader(num: number): string {
  return new Intl.NumberFormat('tr-TR').format(num);
}

/**
 * Format time for screen readers
 * e.g., "300" seconds -> "5 dakika"
 */
export function formatTimeForScreenReader(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0 && remainingSeconds > 0) {
    return `${minutes} dakika ${remainingSeconds} saniye`;
  } else if (minutes > 0) {
    return `${minutes} dakika`;
  } else {
    return `${remainingSeconds} saniye`;
  }
}

/**
 * Create visually hidden element (for screen readers only)
 */
export function createSROnlyElement(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get ARIA label for game mode
 */
export function getGameModeLabel(mode: 'single' | 'multi' | 'team'): string {
  const labels = {
    single: 'Tek yarışmacı modu',
    multi: 'Çoklu yarışmacı modu',
    team: 'Takım modu',
  };
  return labels[mode];
}

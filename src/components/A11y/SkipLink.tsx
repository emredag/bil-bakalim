/**
 * Skip Link Component
 * PRD Section 8.6 - Accessibility
 *
 * Allows keyboard users to skip to main content
 */

import React from 'react';

export interface SkipLinkProps {
  /** Target element ID to skip to */
  targetId?: string;
  /** Link text */
  children?: string;
}

/**
 * Skip to Content Link
 *
 * Visible only when focused (keyboard navigation)
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  children = 'Ana içeriğe atla',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4 focus:left-4
        focus:z-50
        focus:px-6 focus:py-3
        focus:bg-accent-primary
        focus:text-white
        focus:rounded-lg
        focus:font-semibold
        focus:shadow-xl
        focus:ring-2 focus:ring-white
      "
    >
      {children}
    </a>
  );
};

SkipLink.displayName = 'SkipLink';

/**
 * useFocusTrap Hook
 * PRD Section 8.6 - Accessibility
 *
 * Traps focus within a container (for modals, dialogs)
 */

import { useEffect, useRef } from 'react';
import { getFocusableElements, trapFocus } from '../utils/a11y';

export interface UseFocusTrapOptions {
  /** Whether focus trap is active */
  active?: boolean;
  /** Initial focus element selector */
  initialFocus?: string;
  /** Return focus to this element when deactivated */
  returnFocusOnDeactivate?: boolean;
}

/**
 * Focus trap hook for modals and dialogs
 *
 * Usage:
 * ```tsx
 * const trapRef = useFocusTrap({ active: isOpen });
 * return <div ref={trapRef}>...</div>
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions = {}
): React.RefObject<T> {
  const {
    active = true,
    initialFocus,
    returnFocusOnDeactivate = true,
  } = options;

  const containerRef = useRef<T>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    // Store previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable
    const focusableElements = getFocusableElements(container);
    if (initialFocus) {
      const initialElement = container.querySelector<HTMLElement>(initialFocus);
      initialElement?.focus();
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Handle Tab key
    const handleKeyDown = (event: KeyboardEvent) => {
      trapFocus(container, event);
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus
      if (returnFocusOnDeactivate && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, initialFocus, returnFocusOnDeactivate]);

  return containerRef;
}

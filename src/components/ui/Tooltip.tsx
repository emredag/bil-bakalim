import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

/**
 * Tooltip Component - ui-ux-design.md
 *
 * TV Show Quality tooltip.
 *
 * Features:
 * - Hover/focus trigger
 * - Position aware (top, bottom, left, right)
 * - Dark theme styling
 * - Delay before showing
 * - Accessible (aria-describedby)
 * - Z-index: tooltip layer (10)
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for ARIA
  const tooltipId = React.useId();

  // Show tooltip with delay
  const handleMouseEnter = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  // Hide tooltip
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();

    // Get actual tooltip dimensions if available, otherwise use defaults
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 50;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.top - tooltipHeight - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipWidth - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

    setCoords({ x, y });
  };

  // Recalculate position on window resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition);
      };
    }
  }, [isVisible]);

  // Recalculate position after tooltip is rendered to use actual dimensions
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerElement) {
      calculatePosition();
    }
  }, [isVisible, triggerElement]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants
  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.15, ease: [0, 0, 0.2, 1] }, // easeOut as cubic bezier
    },
  };

  // Callback ref for trigger element
  const triggerRefCallback = React.useCallback(
    (node: HTMLElement | null) => {
      setTriggerElement(node);

      // Handle existing ref from children
      const childRef = (children as any).ref;
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef && 'current' in childRef) {
          childRef.current = node;
        }
      }
    },
    [children]
  );

  // Clone children and add event handlers + aria
  const trigger = React.cloneElement(children, {
    ref: triggerRefCallback,
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter();
      // Call existing handler if present
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave();
      // Call existing handler if present
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      handleMouseEnter();
      // Call existing handler if present
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      handleMouseLeave();
      // Call existing handler if present
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
    'aria-describedby': isVisible ? tooltipId : undefined,
  });

  return (
    <>
      {trigger}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              className="
                fixed z-tooltip
                bg-slate-800 text-slate-100
                border border-slate-700
                px-3 py-2 rounded-lg
                text-sm
                shadow-xl
                pointer-events-none
                max-w-xs
              "
              style={{
                left: coords.x,
                top: coords.y,
              }}
              variants={tooltipVariants as any}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

/**
 * Screen Reader Announcer Component
 * PRD Section 8.6 - Accessibility
 *
 * Announces messages to screen readers using aria-live regions
 */

import React, { useEffect, useState } from 'react';

export interface AnnouncementMessage {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
}

interface ScreenReaderAnnouncerProps {
  /** Messages to announce */
  messages?: AnnouncementMessage[];
}

/**
 * Screen Reader Announcer
 *
 * Creates aria-live regions for screen reader announcements
 */
export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  messages = [],
}) => {
  const [politeMessages, setPoliteMessages] = useState<string[]>([]);
  const [assertiveMessages, setAssertiveMessages] = useState<string[]>([]);

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.priority === 'assertive') {
        setAssertiveMessages((prev) => [...prev, msg.message]);
      } else {
        setPoliteMessages((prev) => [...prev, msg.message]);
      }

      // Clear message after announcement
      setTimeout(() => {
        if (msg.priority === 'assertive') {
          setAssertiveMessages((prev) => prev.filter((m) => m !== msg.message));
        } else {
          setPoliteMessages((prev) => prev.filter((m) => m !== msg.message));
        }
      }, 1000);
    });
  }, [messages]);

  return (
    <>
      {/* Polite announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      {/* Assertive announcements (urgent) */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </>
  );
};

ScreenReaderAnnouncer.displayName = 'ScreenReaderAnnouncer';

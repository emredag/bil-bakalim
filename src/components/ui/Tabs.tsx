import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'segmented';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Tabs Component - ui-ux-design.md
 *
 * TV Show Quality tabs/segmented control.
 *
 * Variants:
 * - default: Traditional tabs with bottom border
 * - segmented: iOS-style segmented control
 *
 * Features:
 * - Active indicator animation
 * - Keyboard navigation (Arrow keys)
 * - Icon support
 * - Disabled state
 * - Fully accessible (ARIA)
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    } else if (e.key === 'ArrowRight') {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    } else {
      return;
    }

    e.preventDefault();
    handleTabChange(tabs[newIndex].id);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab List */}
      {variant === 'default' ? (
        <DefaultTabList
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onKeyDown={handleKeyDown}
          fullWidth={fullWidth}
        />
      ) : (
        <SegmentedTabList
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onKeyDown={handleKeyDown}
          fullWidth={fullWidth}
        />
      )}

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

/**
 * Default Tab List (traditional tabs with bottom border)
 */
interface TabListProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  fullWidth: boolean;
}

const DefaultTabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onKeyDown,
  fullWidth,
}) => {
  return (
    <div
      className="flex border-b border-slate-700"
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            className={`
              relative px-4 py-3
              text-sm md:text-base font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${fullWidth ? 'flex-1' : ''}
              ${isActive ? 'text-accent-primary' : 'text-text-tertiary hover:text-text-secondary'}
            `}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                layoutId="activeTab"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Segmented Tab List (iOS-style segmented control)
 */
const SegmentedTabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onKeyDown,
  fullWidth,
}) => {
  return (
    <div
      className={`
        inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700
        ${fullWidth ? 'w-full' : ''}
      `}
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            className={`
              relative px-4 py-2 rounded-md
              text-sm md:text-base font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${fullWidth ? 'flex-1' : ''}
              ${isActive ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}
            `}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {/* Active background */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-slate-700 rounded-md"
                layoutId="segmentedActiveTab"
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

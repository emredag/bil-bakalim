/**
 * UI Component Library - Task 05 (UI Design System)
 *
 * TV Show Quality components following PRD Section 8 and ui-ux-design.md
 *
 * Features:
 * - Fully responsive (768px → 1920px+)
 * - Dark theme optimized
 * - WCAG 2.1 AA compliant
 * - Framer Motion animations
 * - Min 48×48px touch targets
 */

// Core Components (PRD 8.3)
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardTitleProps, CardContentProps, CardFooterProps } from './Card';

export { Input, Textarea } from './Input';
export type { InputProps, TextareaProps } from './Input';

export { Modal, ModalFooter } from './Modal';
export type { ModalProps, ModalFooterProps } from './Modal';

export { LetterBox, LetterBoxRow } from './LetterBox';
export type { LetterBoxProps, LetterBoxRowProps } from './LetterBox';

// TV Show Quality Components (ui-ux-design.md)
export { Toast, ToastContainer, useToast } from './Toast';
export type { ToastProps, ToastContainerProps, UseToastReturn } from './Toast';

export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

export { Badge, StatusBadge, CountBadge } from './Badge';
export type { BadgeProps, StatusBadgeProps, CountBadgeProps } from './Badge';

export { Tabs } from './Tabs';
export type { TabsProps, Tab } from './Tabs';

export { Table, ResponsiveTable } from './Table';
export type { TableProps, ResponsiveTableProps, Column } from './Table';

export { ProgressBar, ProgressRing, CountUp, Timer } from './Progress';
export type { ProgressBarProps, ProgressRingProps, CountUpProps, TimerProps } from './Progress';

export { TeamChip, TeamChipList, TEAM_COLORS, TEAM_EMOJIS } from './TeamChip';
export type { TeamChipProps, TeamChipListProps } from './TeamChip';

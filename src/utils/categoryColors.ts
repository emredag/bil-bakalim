/**
 * Category Theme Colors Utility
 * Design System v2.0 - Migration 4
 *
 * Maps category emojis to theme colors from the design system.
 * Each category gets a unique accent color for visual differentiation.
 */

/**
 * Category color mapping based on emoji
 * Uses Design System v2.0 color palette
 */
const categoryColorMap: Record<string, string> = {
  // Default categories
  '🐾': '#10b981', // Emerald - Animals (nature/natural)
  '🌍': '#3b82f6', // Blue - Countries (world/earth)
  '🍕': '#f59e0b', // Amber - Food (warm/appetizing)
  '📝': '#8b5cf6', // Purple - General (varied/misc)

  // Additional emoji mappings
  '🎮': '#06b6d4', // Cyan - Gaming
  '🎬': '#ec4899', // Pink - Movies
  '🎵': '#14b8a6', // Teal - Music
  '🏃': '#f97316', // Orange - Sports
  '🚗': '#6366f1', // Indigo - Vehicles
  '🏛️': '#a855f7', // Purple - History
  '🔬': '#22c55e', // Green - Science
  '📚': '#0ea5e9', // Primary Blue - Books
  '🍎': '#ef4444', // Red - Fruits
  '🌺': '#f43f5e', // Rose - Flowers
  '⚽': '#10b981', // Green - Football
  '🎨': '#d946ef', // Fuchsia - Art
  '💻': '#0284c7', // Blue - Technology
  '🌈': '#a855f7', // Purple - Colors
};

/**
 * Get theme color for a category based on its emoji
 * Falls back to primary color if emoji not found
 */
export function getCategoryThemeColor(emoji: string): string {
  return categoryColorMap[emoji] || '#0ea5e9'; // Default: primary-500
}

/**
 * Get category color with opacity for backgrounds
 */
export function getCategoryColorWithOpacity(emoji: string, opacity: number = 0.15): string {
  const color = getCategoryThemeColor(emoji);
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get all unique category colors
 */
export function getAllCategoryColors(): string[] {
  return [...new Set(Object.values(categoryColorMap))];
}

/**
 * Check if emoji has a custom color mapping
 */
export function hasCategoryColor(emoji: string): boolean {
  return emoji in categoryColorMap;
}

/**
 * Generate Tailwind-compatible color classes
 * Note: These need to be in tailwind.config.js or use arbitrary values
 */
export function getCategoryColorClasses(emoji: string) {
  const color = getCategoryThemeColor(emoji);

  return {
    // Use arbitrary values for dynamic colors
    border: `border-l-4 border-[${color}]`,
    bg: `bg-[${color}]/10`,
    text: `text-[${color}]`,
    glow: `shadow-[0_0_20px_${color}40]`, // 40 = 0.25 opacity in hex
  };
}

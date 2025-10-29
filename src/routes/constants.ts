/**
 * Route Constants
 * PRD Reference: Section 4 - OYUN AKIŞI
 *
 * Centralized route definitions for the application
 */

export const ROUTES = {
  // Main navigation
  HOME: '/',
  WELCOME: '/welcome',

  // Game flow
  CATEGORY_SELECT: '/category-select',
  MODE_SELECT: '/mode-select',
  PARTICIPANT_SETUP: '/participant-setup',
  GAME: '/game',
  RESULTS: '/results',

  // History
  HISTORY: '/history',
  HISTORY_DETAIL: '/history/:id',

  // Management
  CATEGORY_MANAGEMENT: '/category-management',
  WORD_MANAGEMENT: '/category/:categoryId/words',

  // Settings & Help
  SETTINGS: '/settings',
  HOW_TO_PLAY: '/how-to-play',
} as const;

/**
 * Route builder helpers
 */
export const buildRoute = {
  historyDetail: (id: number | string) => `/history/${id}`,
  wordManagement: (categoryId: number | string) => `/category/${categoryId}/words`,
};

/**
 * Route titles for page headers
 */
export const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: 'Ana Menü',
  [ROUTES.WELCOME]: 'Hoş Geldiniz',
  [ROUTES.CATEGORY_SELECT]: 'Kategori Seçin',
  [ROUTES.MODE_SELECT]: 'Oyun Modu Seçin',
  [ROUTES.PARTICIPANT_SETUP]: 'Yarışmacı Ayarları',
  [ROUTES.GAME]: 'Oyun',
  [ROUTES.RESULTS]: 'Sonuçlar',
  [ROUTES.HISTORY]: 'Geçmiş Yarışmalar',
  [ROUTES.HISTORY_DETAIL]: 'Yarışma Detayı',
  [ROUTES.CATEGORY_MANAGEMENT]: 'Kategori Yönetimi',
  [ROUTES.WORD_MANAGEMENT]: 'Kelime Yönetimi',
  [ROUTES.SETTINGS]: 'Ayarlar',
  [ROUTES.HOW_TO_PLAY]: 'Nasıl Oynanır?',
};

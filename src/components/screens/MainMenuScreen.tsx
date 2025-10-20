/**
 * Main Menu Screen
 * Task 08: Main Menu Screen
 * PRD Reference: Section 4.1 - Başlangıç Ekranı (Ana Menü)
 * Design Reference: ui-ux-design.md#main-menu
 *
 * TV Show Quality main menu with:
 * - Hero layout with centered logo/title
 * - 5 action cards in responsive grid (2×3 pattern)
 * - Safe area margins (24-48px) for projection/TV displays
 * - Gradient background
 * - Stagger entrance animations
 * - Keyboard navigation support
 * - Version info and GitHub link
 */

import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/constants';
import { ActionCard } from '../ActionCard';
import { ParticleBackground } from '../ParticleBackground';

/**
 * MainMenuScreen - Primary navigation hub
 *
 * Features:
 * - TV-optimized layout for classroom projection
 * - Safe area margins prevent edge cutoff
 * - Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
 * - Fluid typography scales with viewport
 * - Stagger entrance animation
 * - Keyboard accessible (Tab navigation)
 */
export function MainMenuScreen() {
  const navigate = useNavigate();

  // Check if in development mode
  const isDev = import.meta.env.DEV;

  // Action cards configuration (PRD 4.1)
  const actionCards = [
    {
      emoji: '🏁',
      title: 'Yarışma Başlat',
      description: 'Yeni bir kelime yarışması başlat',
      onClick: () => navigate(ROUTES.CATEGORY_SELECT),
    },
    {
      emoji: '📚',
      title: 'Kategori Yönetimi',
      description: 'Kategorileri ve kelimeleri düzenle',
      onClick: () => navigate(ROUTES.CATEGORY_MANAGEMENT),
    },
    {
      emoji: '📊',
      title: 'Geçmiş Yarışmalar',
      description: 'Önceki yarışmaları görüntüle',
      onClick: () => navigate(ROUTES.HISTORY),
    },
    {
      emoji: '⚙️',
      title: 'Ayarlar',
      description: 'Uygulama ayarlarını düzenle',
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    {
      emoji: 'ℹ️',
      title: 'Nasıl Oynanır?',
      description: 'Oyun kurallarını öğren',
      onClick: () => navigate(ROUTES.HOW_TO_PLAY),
    },
  ];

  // Test/Demo cards (only in development mode)
  const testCards = isDev
    ? [
        {
          emoji: '🧪',
          title: 'First Launch Test',
          description: 'Test first launch experience',
          onClick: () => navigate('/first-launch-test'),
        },
        {
          emoji: '🎬',
          title: 'Animation Demo',
          description: 'View animation examples',
          onClick: () => navigate('/animation-demo'),
        },
        {
          emoji: '🔊',
          title: 'Sound Demo',
          description: 'Test sound effects',
          onClick: () => navigate('/sound-demo'),
        },
        {
          emoji: '♿',
          title: 'A11y Demo',
          description: 'Accessibility features',
          onClick: () => navigate('/a11y-demo'),
        },
        {
          emoji: '❌',
          title: 'Error Demo',
          description: 'Test error handling',
          onClick: () => navigate('/error-demo'),
        },
      ]
    : [];

  // Combine all cards
  const allCards = [...actionCards, ...testCards];

  // Container animation variants (stagger children)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Card animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Particle Background Layer - Subtle TV show effect */}
      <ParticleBackground />

      {/* Safe Container - Responsive padding for TV/projection edge tolerance */}
      <div className="relative safe-container max-w-[1600px] mx-auto min-h-screen flex flex-col">
        {/* Hero Section - Logo and Title */}
        <motion.header
          className="text-center py-8 md:py-12 lg:py-16 xl:py-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1
            className="font-extrabold text-white mb-4 md:mb-6 lg:mb-8 leading-tight tracking-tight drop-shadow-2xl"
            style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            }}
          >
            🎯 Kelime Oyunu
          </h1>
          <p
            className="text-slate-200 leading-relaxed font-medium drop-shadow-lg"
            style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 2rem)',
            }}
          >
            Eğlenceli Kelime Tahmin Yarışması
          </p>
        </motion.header>

        {/* Action Cards Grid - 12-column system with TV-optimized spacing */}
        <motion.main
          className="flex-1 flex items-center pb-8 md:pb-12 lg:pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 12-column grid with 80-96px gutters (gap-20 = 80px, gap-24 = 96px) */}
          <div className="w-full grid grid-cols-12 gap-6 md:gap-12 lg:gap-20 xl:gap-24">
            {allCards.map((card, index) => (
              <motion.div
                key={index}
                className="col-span-12 md:col-span-6 lg:col-span-4"
                variants={cardVariants}
              >
                <ActionCard
                  emoji={card.emoji}
                  title={card.title}
                  description={card.description}
                  onClick={card.onClick}
                />
              </motion.div>
            ))}
          </div>
        </motion.main>

        {/* Footer - Version and GitHub Link */}
        <motion.footer
          className="text-center py-6 md:py-8 lg:py-10 text-slate-400 text-base md:text-lg space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="font-medium">v1.0.0 • MIT License</p>
          <a
            href="https://github.com/yourusername/kelime-oyunu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold underline underline-offset-4 decoration-2 hover:decoration-amber-300"
            aria-label="GitHub repository"
          >
            <span>GitHub'da Görüntüle</span>
            <span className="text-xl">→</span>
          </a>
        </motion.footer>
      </div>
    </div>
  );
}

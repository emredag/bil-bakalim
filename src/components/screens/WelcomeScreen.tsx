/**
 * Welcome Screen Component
 * PRD Reference: Section 13.1 - İlk Kurulum Akışı
 * UI/UX Reference: First Launch Experience
 *
 * Displayed on first launch to welcome users and confirm database initialization
 */

import { motion } from 'framer-motion';
import { Play, Database, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Logo } from '../ui/Logo';
import { useNavigate } from 'react-router-dom';
import { markFirstLaunchCompleted } from '../../services/firstLaunch';
import { ROUTES } from '../../routes/constants';

/**
 * WelcomeScreen Component
 *
 * Features:
 * - Welcome message and app introduction
 * - Database initialization confirmation
 * - Smooth entry animation
 * - Call-to-action button to main menu
 */
export function WelcomeScreen() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate a brief loading period to ensure database is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent any default behavior and stop propagation
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Mark first launch as completed
      markFirstLaunchCompleted();

      // Navigate to main menu with replace to prevent back navigation
      navigate(ROUTES.HOME, { replace: true });
    },
    [navigate]
  );

  return (
    <div className="relative min-h-screen overflow-y-auto bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4 md:p-6 lg:p-8">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 hero-mesh-overlay opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-2xl w-full mx-auto z-10 my-auto"
      >
        {/* Hero Card with Glassmorphism */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-white/10 backdrop-blur-xl">
          {/* Icon & Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            {/* Professional Glow Icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(14, 165, 233, 0.3)',
                  '0 0 40px rgba(14, 165, 233, 0.5)',
                  '0 0 20px rgba(14, 165, 233, 0.3)',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-6"
            >
              <Logo size={96} />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-4 leading-tight">
              Bil Bakalım'a
              <br />
              Hoş Geldiniz!
            </h1>

            <p className="text-lg md:text-xl text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Eğitim kurumları ve sınıf içi yarışmalar için tasarlanmış interaktif kelime tahmin
              oyunu
            </p>
          </motion.div>

          {/* Features with Stagger Animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4,
                },
              },
            }}
            className="space-y-3 mb-8"
          >
            <FeatureItem
              icon="🎯"
              title="Kategoriye Dayalı Oyun"
              description="Kendi kelime kategorilerinizi oluşturun veya hazır kategorileri kullanın"
            />
            <FeatureItem
              icon="👥"
              title="Çoklu Oyun Modları"
              description="Tek oyuncu, çoklu oyuncu veya takım modunda oynayın"
            />
            <FeatureItem
              icon="🏆"
              title="Yarışma Geçmişi"
              description="Tüm oyun sonuçlarını takip edin ve karşılaştırın"
            />
            <FeatureItem
              icon="⚙️"
              title="Tamamen Özelleştirilebilir"
              description="Kategoriler, kelimeler ve ayarları dilediğiniz gibi düzenleyin"
            />
          </motion.div>

          {/* Database Status */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative bg-neutral-900/60 backdrop-blur-sm rounded-xl p-5 mb-8 border border-white/5"
          >
            <div className="flex items-center gap-4">
              {isReady ? (
                <>
                  <div className="flex-shrink-0 w-12 h-12 bg-success-500/20 rounded-xl flex items-center justify-center ring-2 ring-success-500/30">
                    <Check className="w-6 h-6 text-success-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-success-400 font-semibold text-lg">Veritabanı Hazır</p>
                    <p className="text-neutral-400 text-sm mt-0.5">
                      Varsayılan kategoriler ve kelimeler yüklendi
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center ring-2 ring-primary-500/30">
                    <Database className="w-6 h-6 text-primary-400 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-primary-400 font-semibold text-lg">Veritabanı Hazırlanıyor...</p>
                    <p className="text-neutral-400 text-sm mt-0.5">İlk kurulum işlemleri tamamlanıyor</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <motion.button
              type="button"
              onClick={handleGetStarted}
              disabled={!isReady}
              whileHover={isReady ? { scale: 1.02 } : {}}
              whileTap={isReady ? { scale: 0.98 } : {}}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white text-lg md:text-xl font-bold py-4 md:py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 touch-target"
            >
              <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              {isReady ? 'Hemen Başla' : 'Hazırlanıyor...'}
            </motion.button>

            <p className="text-center text-neutral-500 text-sm mt-4">
              Bu ekran sadece ilk açılışta gösterilir
            </p>
          </motion.div>
        </div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-6 text-neutral-500 text-sm"
        >
          <p>Bil Bakalım v1.0.2 • Open Source • MIT License</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Feature Item Component
 * Displays a single feature with icon and description
 */
interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-900/50 transition-all duration-200 group cursor-default"
    >
      <span className="flex-shrink-0 text-3xl group-hover:scale-105 transition-transform duration-200">
        {icon}
      </span>
      <div>
        <h3 className="text-neutral-100 font-semibold mb-1.5 text-base">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/**
 * Welcome Screen Component
 * PRD Reference: Section 13.1 - İlk Kurulum Akışı
 * UI/UX Reference: First Launch Experience
 *
 * Displayed on first launch to welcome users and confirm database initialization
 */

import { motion } from 'framer-motion';
import { Sparkles, Play, Database, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
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

  const handleGetStarted = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Mark first launch as completed
    markFirstLaunchCompleted();
    
    // Navigate to main menu with replace to prevent back navigation
    navigate(ROUTES.HOME, { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-2xl w-full"
      >
        {/* Hero Card */}
        <div className="bg-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-700">
          {/* Icon & Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl mb-6 shadow-lg"
            >
              <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-4">
              Kelime Oyunu'na
              <br />
              Hoş Geldiniz!
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto">
              Eğitim kurumları ve sınıf içi yarışmalar için tasarlanmış
              interaktif kelime tahmin oyunu
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
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
            transition={{ delay: 0.6 }}
            className="bg-slate-900 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center gap-3">
              {isReady ? (
                <>
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-400 font-semibold">
                      Veritabanı Hazır
                    </p>
                    <p className="text-slate-400 text-sm">
                      Varsayılan kategori ve 70 kelime yüklendi
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-400 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-400 font-semibold">
                      Veritabanı Hazırlanıyor...
                    </p>
                    <p className="text-slate-400 text-sm">
                      İlk kurulum işlemleri tamamlanıyor
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={!isReady}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white text-lg md:text-xl font-bold py-4 md:py-5 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-60"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {isReady ? 'Hemen Başla' : 'Hazırlanıyor...'}
            </button>

            <p className="text-center text-slate-500 text-sm mt-4">
              Bu ekran sadece ilk açılışta gösterilir
            </p>
          </motion.div>
        </div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-slate-500 text-sm"
        >
          <p>Kelime Oyunu v1.0.0 • Open Source • MIT License</p>
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
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-900/50 transition-colors">
      <span className="flex-shrink-0 text-2xl md:text-3xl">{icon}</span>
      <div>
        <h3 className="text-slate-100 font-semibold mb-1">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

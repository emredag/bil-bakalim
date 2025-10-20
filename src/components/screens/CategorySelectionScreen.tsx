/**
 * Category Selection Screen
 * Task 09: Category Selection Screen
 * PRD Reference: Section 4.2 - Category Selection
 * Design Reference: ui-ux-design.md#category-selection
 *
 * Allows users to select a category to play with:
 * - Displays category cards in grid
 * - Shows validation status for each category
 * - Enables/disables play based on playability
 * - Empty state when no categories exist
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, Plus, PackagePlus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CategoryCard } from '../CategoryCard';
import { useCategories } from '../../hooks/useCategories';
import { ROUTES } from '../../routes/constants';
import { Skeleton } from '../../animations/SkeletonLoader';
import { useCategoryStore } from '../../store/categoryStore';

/**
 * CategorySelectionScreen - Category selection page
 *
 * Features:
 * - Fetch categories from backend
 * - Display category cards with validation badges
 * - Enable/disable play based on playability
 * - Empty state with quick create button
 * - Back navigation to main menu
 * - Stagger entrance animation
 */
export function CategorySelectionScreen() {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();
  const setSelectedCategory = useCategoryStore((state) => state.setSelectedCategory);
  const setValidation = useCategoryStore((state) => state.setValidation);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Handle category selection (Play button)
  const handlePlayCategory = (categoryId: number) => {
    const selected = categories.find((c) => c.category.id === categoryId);
    if (selected) {
      setSelectedCategory(selected.category);
      // Store validation data for mode selection screen
      setValidation(selected.category.id, selected.validation);
      navigate(ROUTES.MODE_SELECT);
    }
  };

  // Handle create new category
  const handleCreateCategory = () => {
    navigate(ROUTES.CATEGORY_MANAGEMENT);
  };

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories.filter(({ category }) =>
      category.name.toLowerCase().includes(query) ||
      category.emoji.includes(query) ||
      category.description?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="safe-container max-w-[1600px] mx-auto min-h-screen flex flex-col py-8 md:py-12">
        {/* Header */}
        <header className="space-y-6 md:space-y-8 mb-8 md:mb-12">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate(ROUTES.HOME)}
                className="flex items-center gap-2"
                aria-label="Ana menüye dön"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">Geri</span>
              </Button>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                Kategori Seçin
              </h1>
            </div>

            {/* Quick Create Button */}
            {categories.length > 0 && (
              <Button
                variant="primary"
                onClick={handleCreateCategory}
                className="flex items-center gap-2"
                aria-label="Yeni kategori oluştur"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">Yeni Kategori</span>
              </Button>
            )}
          </div>

          {/* Search Bar */}
          {categories.length > 0 && (
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 text-lg"
                  aria-label="Kategori ara"
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="box" className="h-[320px] rounded-2xl" />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
              <p className="text-2xl md:text-3xl text-red-400 mb-4">❌ Hata</p>
              <p className="text-lg md:text-xl text-slate-300 mb-8">{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Tekrar Dene
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PackagePlus
                className="w-24 h-24 md:w-32 md:h-32 text-slate-600 mb-6"
                strokeWidth={1.5}
              />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Henüz kategori yok
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-md">
                Oyuna başlamak için önce bir kategori oluşturmanız gerekiyor.
              </p>
              <Button
                variant="primary"
                onClick={handleCreateCategory}
                className="flex items-center gap-3 px-8 py-4 text-lg"
              >
                <Plus className="w-6 h-6" />
                Yeni Kategori Oluştur
              </Button>
            </motion.div>
          )}

          {/* Category Grid */}
          {!loading && !error && categories.length > 0 && (
            <>
              {filteredCategories.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredCategories.map(({ category, validation }) => (
                    <motion.div key={category.id} variants={cardVariants}>
                      <CategoryCard
                        category={category}
                        validation={validation}
                        onPlay={() => handlePlayCategory(category.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Search className="w-24 h-24 md:w-32 md:h-32 text-slate-600 mb-6" strokeWidth={1.5} />
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Sonuç bulunamadı
                  </h2>
                  <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-md">
                    "{searchQuery}" için hiçbir kategori bulunamadı.
                  </p>
                  <Button variant="secondary" onClick={() => setSearchQuery('')}>
                    Aramayı Temizle
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

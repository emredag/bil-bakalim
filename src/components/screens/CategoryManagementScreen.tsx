/**
 * Category Management Screen
 * Task 25: Category Management Screen
 * PRD Reference: Section 5.1 - Category Management
 *
 * Main screen for managing categories:
 * - List all categories with validation status
 * - Search/filter categories
 * - Create new categories
 * - Edit existing categories
 * - Delete categories (except default)
 * - Navigate to word management
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CategoryManagementCard } from '../CategoryManagementCard';
import { CreateCategoryModal } from '../modals/CreateCategoryModal';
import { EditCategoryModal } from '../modals/EditCategoryModal';
import { DeleteCategoryDialog } from '../modals/DeleteCategoryDialog';
import { getAllCategories, validateCategory } from '../../api/category';
import { Category, ValidationResult } from '../../types/database';
import { ROUTES, buildRoute } from '../../routes/constants';

/**
 * CategoryManagementScreen Component
 *
 * Features:
 * - Grid layout of category cards
 * - Real-time search filtering
 * - Create/Edit/Delete modals
 * - Validation status display
 * - Empty state message
 * - Responsive design (1-2-3 columns)
 * - Loading and error states
 */
export function CategoryManagementScreen() {
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [validations, setValidations] = useState<Map<number, ValidationResult>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load all categories and their validations
  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all categories
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);

      // Fetch validation for each category
      const validationMap = new Map<number, ValidationResult>();
      await Promise.all(
        fetchedCategories.map(async (category) => {
          try {
            const validation = await validateCategory(category.id);
            validationMap.set(category.id, validation);
          } catch (err) {
            console.error(`Failed to validate category ${category.id}:`, err);
          }
        })
      );
      setValidations(validationMap);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Kategoriler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description?.toLowerCase() || '').includes(query)
    );
  }, [categories, searchQuery]);

  // Handlers
  const handleCreateSuccess = () => {
    loadCategories(); // Reload to get fresh data
  };

  const handleEditSuccess = () => {
    loadCategories(); // Reload to get fresh data
  };

  const handleDeleteSuccess = (categoryId: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setValidations((prev) => {
      const newMap = new Map(prev);
      newMap.delete(categoryId);
      return newMap;
    });
  };

  const handleViewWords = (categoryId: number) => {
    navigate(buildRoute.wordManagement(categoryId));
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              📚 Kategori Yönetimi
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              Kategorileri oluşturun, düzenleyin ve yönetin
            </p>
          </div>

          {/* Back Button */}
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.HOME)}
            className="self-start md:self-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ana Menü
          </Button>
        </div>

        {/* Top Bar: Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create Button */}
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Kategori Oluştur
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 text-center">
            <p className="text-red-400 text-lg font-medium">{error}</p>
            <Button
              variant="secondary"
              onClick={loadCategories}
              className="mt-4"
            >
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCategories.length === 0 && (
          <motion.div
            className="bg-slate-800 rounded-2xl p-8 md:p-12 text-center border-2 border-slate-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl md:text-7xl mb-4">📚</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {searchQuery ? 'Kategori Bulunamadı' : 'Henüz Kategori Yok'}
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-6">
              {searchQuery
                ? 'Arama kriterlerinize uygun kategori bulunamadı. Farklı bir arama deneyin.'
                : 'Yeni bir kategori oluşturarak başlayın.'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                İlk Kategoriyi Oluştur
              </Button>
            )}
          </motion.div>
        )}

        {/* Category Grid */}
        {!isLoading && !error && filteredCategories.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCategories.map((category) => {
              const validation = validations.get(category.id) || {
                is_valid: false,
                total_words: 0,
                words_by_length: [],
                max_players_single: 0,
                max_players_multi: 0,
                max_teams: 0,
                message: 'Yükleniyor...',
              };

              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <CategoryManagementCard
                    category={category}
                    validation={validation}
                    onViewWords={() => handleViewWords(category.id)}
                    onEdit={() => handleEdit(category)}
                    onDelete={() => handleDelete(category)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditCategoryModal
        isOpen={editingCategory !== null}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSuccess={handleEditSuccess}
      />

      <DeleteCategoryDialog
        isOpen={deletingCategory !== null}
        category={deletingCategory}
        validation={deletingCategory ? validations.get(deletingCategory.id) || null : null}
        onClose={() => setDeletingCategory(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

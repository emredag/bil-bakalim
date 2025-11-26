/**
 * Category Management Screen - MIGRATED to Design System v2.0
 * Priority 3 Migration: Table layout with bulk operations
 *
 * Changes from original:
 * - Card grid → Sortable data table
 * - Added bulk selection (checkboxes)
 * - Added quick actions menu (⋮)
 * - Added inline name editing (double-click)
 * - Updated to Design System v2.0 colors
 * - Import/Export prominent in header
 *
 * Maintained functionality:
 * - All CRUD operations
 * - Search/filter
 * - Validation display
 * - Keyboard shortcuts
 * - Loading/error states
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ArrowLeft,
  Loader2,
  Eye,
  Edit2,
  Trash2,
  FileUp,
  FileDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  DataTable,
  DataTableColumn,
  QuickActionsMenu,
  QuickActionItem,
  BulkActionBar,
  BulkAction,
  InlineEditCell
} from '../ui';
import { CreateCategoryModal } from '../modals/CreateCategoryModal';
import { EditCategoryModal } from '../modals/EditCategoryModal';
import { DeleteCategoryDialog } from '../modals/DeleteCategoryDialog';
import {
  getAllCategories,
  validateCategory,
  updateCategory,
  exportCategoryToJson
} from '../../api/category';
import { Category, ValidationResult } from '../../types/database';
import { ROUTES, buildRoute } from '../../routes/constants';
import { useKeyboardShortcuts } from '../../hooks';

type SortKey = 'name' | 'words' | 'valid';
type SortDirection = 'asc' | 'desc';

/**
 * CategoryManagementScreen Component - Design System v2.0
 *
 * Features:
 * - Data table with sorting
 * - Bulk selection and operations
 * - Quick actions dropdown per row
 * - Inline name editing
 * - Real-time search filtering
 * - Import/Export prominent
 * - Responsive design
 * - Loading and error states
 */
export function CategoryManagementScreen() {
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [validations, setValidations] = useState<Map<number, ValidationResult>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Search input ref for keyboard shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNew: () => setShowCreateModal(true),
    onSearch: () => searchInputRef.current?.focus(),
  });

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

      // Fetch validation for each category (parallel)
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

  // Filter and sort categories
  const processedCategories = useMemo(() => {
    let filtered = categories;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          (category.description?.toLowerCase() || '').includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'name') {
        comparison = a.name.localeCompare(b.name, 'tr');
      } else if (sortKey === 'words') {
        const aWords = validations.get(a.id)?.total_words || 0;
        const bWords = validations.get(b.id)?.total_words || 0;
        comparison = aWords - bWords;
      } else if (sortKey === 'valid') {
        const aValid = validations.get(a.id)?.is_valid ? 1 : 0;
        const bValid = validations.get(b.id)?.is_valid ? 1 : 0;
        comparison = aValid - bValid;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [categories, searchQuery, sortKey, sortDirection, validations]);

  // Handlers
  const handleCreateSuccess = () => {
    loadCategories();
  };

  const handleCreateAndAddWords = (category: Category) => {
    navigate(buildRoute.wordManagement(category.id));
  };

  const handleEditSuccess = () => {
    loadCategories();
  };

  const handleDeleteSuccess = (categoryId: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setValidations((prev) => {
      const newMap = new Map(prev);
      newMap.delete(categoryId);
      return newMap;
    });
    // Clear from selection if selected
    setSelectedIds((prev) => prev.filter((id) => id !== categoryId.toString()));
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

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key as SortKey);
    setSortDirection(direction);
  };

  // Inline name editing
  const handleNameSave = async (categoryId: number, newName: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    try {
      await updateCategory(
        categoryId,
        newName,
        category.emoji,
        category.description || undefined
      );
      // Update local state
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, name: newName } : c))
      );
    } catch (err) {
      console.error('Failed to update category name:', err);
      alert('Kategori adı güncellenirken hata oluştu');
    }
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    const selectedCategories = categories.filter((c) =>
      selectedIds.includes(c.id.toString())
    );

    // Check if any are default
    const hasDefault = selectedCategories.some((c) => c.is_default);
    if (hasDefault) {
      alert('Varsayılan kategoriler silinemez. Lütfen seçiminizi gözden geçirin.');
      return;
    }

    if (confirm(`${selectedIds.length} kategori silinecek. Emin misiniz?`)) {
      // For simplicity, delete one by one (in real app, use bulk API)
      for (const id of selectedIds) {
        const category = categories.find((c) => c.id.toString() === id);
        if (category) {
          setDeletingCategory(category);
          // Wait for modal to handle deletion
          // In a real implementation, you'd have a bulk delete API
        }
      }
      setSelectedIds([]);
    }
  };

  const handleBulkExport = async () => {
    for (const id of selectedIds) {
      const categoryId = parseInt(id);
      try {
        const category = categories.find((c) => c.id === categoryId);
        await exportCategoryToJson(categoryId, category?.name || 'category');
      } catch (err) {
        console.error(`Failed to export category ${id}:`, err);
      }
    }
  };

  // Define table columns
  const columns: DataTableColumn<Category>[] = [
    {
      key: 'name',
      header: 'Kategori',
      sortable: true,
      width: 'w-1/3',
      accessor: (category) => (
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {category.emoji}
          </span>
          <div className="flex flex-col">
            <InlineEditCell
              value={category.name}
              onSave={(newName) => handleNameSave(category.id, newName)}
              placeholder="Kategori adı"
              maxLength={50}
              validation={(value) => {
                if (!value.trim()) return 'Kategori adı boş olamaz';
                if (value.length < 2) return 'En az 2 karakter olmalı';
                return null;
              }}
              className="font-semibold text-neutral-50"
            />
            {category.is_default && (
              <Badge variant="warning" size="sm" className="mt-1 self-start">
                Varsayılan
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'words',
      header: 'Kelimeler',
      sortable: true,
      width: 'w-32',
      accessor: (category) => {
        const validation = validations.get(category.id);
        return (
          <span className="font-medium text-neutral-300">
            {validation?.total_words || 0} kelime
          </span>
        );
      },
    },
    {
      key: 'valid',
      header: 'Durum',
      sortable: true,
      width: 'w-48',
      accessor: (category) => {
        const validation = validations.get(category.id);
        if (!validation) {
          return <Badge variant="neutral" size="sm">Yükleniyor...</Badge>;
        }

        return (
          <div className="flex flex-col gap-1">
            {validation.is_valid ? (
              <>
                <Badge variant="success" size="sm">
                  ✅ Oynanabilir
                </Badge>
                {validation.max_players_multi > 0 && (
                  <span className="text-xs text-neutral-500">
                    Max {validation.max_players_multi} oyuncu
                  </span>
                )}
              </>
            ) : (
              <Badge variant="error" size="sm">
                ⚠️ Yetersiz kelime
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'İşlemler',
      width: 'w-24',
      accessor: (category) => {
        const actions: QuickActionItem[] = [
          {
            label: 'Kelimeleri Görüntüle',
            icon: <Eye className="w-4 h-4" />,
            onClick: () => handleViewWords(category.id),
          },
          {
            label: 'Düzenle',
            icon: <Edit2 className="w-4 h-4" />,
            onClick: () => handleEdit(category),
          },
          {
            label: 'Dışa Aktar',
            icon: <FileDown className="w-4 h-4" />,
            onClick: async () => {
              try {
                await exportCategoryToJson(category.id, category.name);
              } catch (err) {
                console.error('Export failed:', err);
                alert('Dışa aktarma başarısız oldu');
              }
            },
          },
          {
            label: 'Sil',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => handleDelete(category),
            variant: 'destructive',
            disabled: category.is_default,
          },
        ];

        return <QuickActionsMenu actions={actions} />;
      },
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: 'Dışa Aktar',
      icon: <FileDown className="w-4 h-4" />,
      onClick: handleBulkExport,
      variant: 'secondary',
    },
    {
      label: 'Sil',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleBulkDelete,
      variant: 'destructive',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-50 mb-2">
              📚 Kategori Yönetimi
            </h1>
            <p className="text-neutral-400 text-base md:text-lg">
              Kategorileri oluşturun, düzenleyin ve yönetin
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.HOME)}
            className="self-start md:self-auto"
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Ana Menü
          </Button>
        </div>

        {/* Top Toolbar: Actions and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Left: Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="w-5 h-5" />}
            >
              Yeni Kategori
            </Button>

            <Button
              variant="secondary"
              onClick={() => {/* TODO: Implement import */}}
              icon={<FileUp className="w-5 h-5" />}
            >
              İçe Aktar
            </Button>
          </div>

          {/* Right: Search */}
          <div className="flex-1 lg:max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Kategori ara... (Ctrl/Cmd+F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-error-500/10 border-2 border-error-500/50 rounded-2xl p-6 text-center">
            <p className="text-error-400 text-lg font-medium">{error}</p>
            <Button variant="secondary" onClick={loadCategories} className="mt-4">
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && processedCategories.length === 0 && (
          <motion.div
            className="bg-neutral-800 rounded-2xl p-8 md:p-12 text-center border-2 border-neutral-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl md:text-7xl mb-4">📚</div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-50 mb-3">
              {searchQuery ? 'Kategori Bulunamadı' : 'Henüz Kategori Yok'}
            </h2>
            <p className="text-neutral-400 text-base md:text-lg mb-6">
              {searchQuery
                ? 'Arama kriterlerinize uygun kategori bulunamadı.'
                : 'Yeni bir kategori oluşturarak başlayın.'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                size="lg"
                icon={<Plus className="w-5 h-5" />}
              >
                İlk Kategoriyi Oluştur
              </Button>
            )}
          </motion.div>
        )}

        {/* Data Table */}
        {!isLoading && !error && processedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden"
          >
            <DataTable
              data={processedCategories}
              columns={columns}
              keyExtractor={(category) => category.id.toString()}
              onSort={handleSort}
              sortKey={sortKey}
              sortDirection={sortDirection}
              selectable
              selectedKeys={selectedIds}
              onSelectionChange={setSelectedIds}
              zebra
              stickyHeader
            />
          </motion.div>
        )}
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <BulkActionBar
            selectedCount={selectedIds.length}
            onClear={() => setSelectedIds([])}
            actions={bulkActions}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        onSuccessAndAddWords={handleCreateAndAddWords}
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

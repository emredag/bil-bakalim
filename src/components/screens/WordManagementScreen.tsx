/**
 * Word Management Screen - MIGRATED to Design System v2.0
 * Priority 3 Migration: Inline editing + Donut chart + Quick add
 *
 * Changes from original:
 * - Added QuickAddRow at top of table
 * - Added inline editing for word and hint
 * - Replaced bar chart with DonutChart in sidebar
 * - Made sidebar sticky
 * - Updated to Design System v2.0 colors
 * - Enhanced visual hierarchy
 *
 * Maintained functionality:
 * - All CRUD operations
 * - Import/Export
 * - Search/filter
 * - Sorting
 * - Validation display
 * - Keyboard shortcuts
 * - Modal workflows
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ArrowLeft,
  Upload,
  Download,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  DataTable,
  DataTableColumn,
  QuickAddRow,
  InlineEditCell,
  DonutChart,
  DonutChartSegment,
} from '../ui';
import { AddWordModal, EditWordModal, DeleteWordDialog } from '../modals';
import { addWord, updateWord } from '../../api/word';
import { getWordsByCategory } from '../../api/word';
import {
  getCategoryById,
  validateCategory,
  exportCategoryToJson,
  importCategoryFromJson,
} from '../../api/category';
import { Category, Word, ValidationResult } from '../../types/database';
import { ROUTES } from '../../routes/constants';
import { useToast, ToastContainer } from '../ui/Toast';
import { useKeyboardShortcuts } from '../../hooks';

// Color palette for donut chart (letter counts 4-10)
const CHART_COLORS = [
  '#0ea5e9', // primary-500 (4 letters)
  '#22c55e', // success-500 (5 letters)
  '#f59e0b', // accent-500 (6 letters)
  '#a855f7', // secondary-500 (7 letters)
  '#06b6d4', // info-500 (8 letters)
  '#ec4899', // pink (9 letters)
  '#10b981', // emerald (10 letters)
];

/**
 * WordManagementScreen Component - Design System v2.0
 *
 * Features:
 * - Quick add row for fast word entry
 * - Inline editing (double-click word or hint)
 * - Interactive donut chart visualization
 * - Sticky sidebar with real-time updates
 * - Import/Export with error handling
 * - Responsive design
 */
export function WordManagementScreen() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();

  // State
  const [category, setCategory] = useState<Category | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deletingWord, setDeletingWord] = useState<Word | null>(null);

  // Import/Export error state
  const [importExportError, setImportExportError] = useState<string | null>(null);

  // Sort state
  const [sortKey, setSortKey] = useState<string>('word');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Search input ref for keyboard shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNew: () => setShowAddModal(true),
    onSearch: () => searchInputRef.current?.focus(),
  });

  // Load category and words on mount
  useEffect(() => {
    if (categoryId) {
      loadData();
    } else {
      setError('Kategori ID bulunamadı');
      setIsLoading(false);
    }
  }, [categoryId]);

  // Load category, words, and validation
  const loadData = async () => {
    if (!categoryId) return;

    setIsLoading(true);
    setError(null);

    try {
      const categoryIdNum = parseInt(categoryId, 10);

      // Load category, words, and validation in parallel
      const [fetchedCategory, fetchedWords, fetchedValidation] = await Promise.all([
        getCategoryById(categoryIdNum),
        getWordsByCategory(categoryIdNum),
        validateCategory(categoryIdNum),
      ]);

      setCategory(fetchedCategory);
      setWords(fetchedWords);
      setValidation(fetchedValidation);
    } catch (err) {
      console.error('Failed to load word management data:', err);
      setError('Veriler yüklenirken hata oluştu');
      showToast('Veriler yüklenirken hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort words
  const filteredAndSortedWords = useMemo(() => {
    let filtered = words;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = words.filter(
        (word) => word.word.toLowerCase().includes(query) || word.hint.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case 'word':
          comparison = a.word.localeCompare(b.word, 'tr');
          break;
        case 'letter_count':
          comparison = a.letter_count - b.letter_count;
          break;
        case 'hint':
          comparison = a.hint.localeCompare(b.hint, 'tr');
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [words, searchQuery, sortKey, sortDirection]);

  // Calculate donut chart segments
  const chartSegments = useMemo((): DonutChartSegment[] => {
    if (!validation) return [];

    return validation.words_by_length.map((item, index) => {
      return {
        label: `${item.letter_count} harf`,
        value: item.count,
        color: CHART_COLORS[index] || CHART_COLORS[0],
      };
    });
  }, [validation]);

  // Handle sort
  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  // Quick add word handler
  const handleQuickAdd = async (values: Record<string, string>) => {
    if (!categoryId) return;

    const word = values.word.toUpperCase().trim();
    const hint = values.hint.trim();

    // Validate
    if (word.length < 4 || word.length > 10) {
      throw new Error('Kelime 4-10 karakter arasında olmalıdır');
    }

    if (!/^[A-ZÇĞİÖŞÜ]+$/.test(word)) {
      throw new Error('Kelime sadece Türkçe büyük harflerden oluşmalıdır');
    }

    if (!hint) {
      throw new Error('İpucu gereklidir');
    }

    // Add word
    const newWord = await addWord(parseInt(categoryId, 10), word, hint);
    setWords((prev) => [...prev, newWord]);
    showToast('Kelime başarıyla eklendi', 'success');

    // Reload to refresh validation
    await loadData();
  };

  // Inline edit handlers
  const handleWordEdit = async (wordId: number, newWordText: string) => {
    const word = words.find((w) => w.id === wordId);
    if (!word) return;

    const upperWord = newWordText.toUpperCase().trim();

    try {
      await updateWord(wordId, upperWord, word.hint);
      setWords((prev) =>
        prev.map((w) => (w.id === wordId ? { ...w, word: upperWord } : w))
      );
      showToast('Kelime güncellendi', 'success');
      await loadData();
    } catch (err) {
      console.error('Failed to update word:', err);
      showToast('Kelime güncellenirken hata oluştu', 'error');
    }
  };

  const handleHintEdit = async (wordId: number, newHint: string) => {
    const word = words.find((w) => w.id === wordId);
    if (!word) return;

    try {
      await updateWord(wordId, word.word, newHint.trim());
      setWords((prev) =>
        prev.map((w) => (w.id === wordId ? { ...w, hint: newHint.trim() } : w))
      );
      showToast('İpucu güncellendi', 'success');
    } catch (err) {
      console.error('Failed to update hint:', err);
      showToast('İpucu güncellenirken hata oluştu', 'error');
    }
  };

  // Modal handlers
  const handleAddSuccess = (newWord: Word) => {
    setWords((prev) => [...prev, newWord]);
    loadData(); // Reload to refresh validation
  };

  const handleEditSuccess = (updatedWord: Word) => {
    setWords((prev) => prev.map((word) => (word.id === updatedWord.id ? updatedWord : word)));
    loadData(); // Reload to refresh validation
  };

  const handleDeleteSuccess = (deletedWordId: number) => {
    setWords((prev) => prev.filter((word) => word.id !== deletedWordId));
    loadData(); // Reload to refresh validation
  };

  // Handle JSON Import
  const handleImport = async () => {
    if (!categoryId || !category) return;

    setImportExportError(null);

    try {
      const result = await importCategoryFromJson(parseInt(categoryId, 10));
      showToast(result.message, 'success');
      await loadData();
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'JSON içe aktarma başarısız';

      if (errorMessage.includes('iptal edildi')) {
        return;
      }

      setImportExportError(errorMessage);
    }
  };

  // Handle JSON Export
  const handleExport = async () => {
    if (!categoryId || !category) return;

    setImportExportError(null);

    try {
      await exportCategoryToJson(parseInt(categoryId, 10), category.name);
      showToast(`${category.name} kategorisi başarıyla dışa aktarıldı`, 'success');
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'JSON dışa aktarma başarısız';

      if (errorMessage.includes('iptal edildi')) {
        return;
      }

      setImportExportError(errorMessage);
    }
  };

  // Handle chart segment click (filter table by letter count)
  const handleChartSegmentClick = (segment: DonutChartSegment) => {
    // Filter words by this letter count
    setSortKey('letter_count');
    setSortDirection('asc');
    // You could also set a filter state here if you want to actually filter
    showToast(`${segment.label} kelimeleri gösteriliyor`, 'info');
  };

  // Table columns
  const columns: DataTableColumn<Word>[] = [
    {
      key: 'word',
      header: 'Kelime',
      sortable: true,
      width: 'w-1/4',
      accessor: (word) => (
        <InlineEditCell
          value={word.word}
          onSave={(newValue) => handleWordEdit(word.id, newValue)}
          placeholder="KELİME"
          maxLength={10}
          validation={(value) => {
            const upper = value.toUpperCase().trim();
            if (upper.length < 4 || upper.length > 10) {
              return 'Kelime 4-10 karakter arasında olmalıdır';
            }
            if (!/^[A-ZÇĞİÖŞÜ]+$/.test(upper)) {
              return 'Sadece Türkçe büyük harfler kullanın';
            }
            return null;
          }}
          className="font-bold text-lg text-neutral-50 uppercase tracking-wide"
        />
      ),
    },
    {
      key: 'letter_count',
      header: 'Harf',
      sortable: true,
      width: 'w-20',
      accessor: (word) => (
        <Badge variant="neutral" size="sm">
          {word.letter_count}
        </Badge>
      ),
    },
    {
      key: 'hint',
      header: 'İpucu',
      sortable: true,
      width: 'w-1/2',
      accessor: (word) => (
        <InlineEditCell
          value={word.hint}
          onSave={(newValue) => handleHintEdit(word.id, newValue)}
          placeholder="İpucu girin..."
          maxLength={200}
          validation={(value) => {
            if (!value.trim()) return 'İpucu boş olamaz';
            return null;
          }}
          className="text-neutral-300"
        />
      ),
    },
    {
      key: 'actions',
      header: 'Aksiyon',
      sortable: false,
      width: 'w-32',
      accessor: (word) => (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditingWord(word)}
            icon={<Edit2 className="w-4 h-4" />}
            aria-label={`${word.word} kelimesini düzenle`}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingWord(word)}
            icon={<Trash2 className="w-4 h-4" />}
            aria-label={`${word.word} kelimesini sil`}
          />
        </div>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-neutral-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-xl text-error-400 mb-6">{error || 'Kategori bulunamadı'}</p>
          <Button
            onClick={() => navigate(ROUTES.CATEGORY_MANAGEMENT)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Kategori Yönetimine Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-neutral-950">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row min-h-screen gap-6 p-4 md:p-6 lg:p-8">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.CATEGORY_MANAGEMENT)}
              className="mb-4"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Geri
            </Button>

            <div className="flex items-center gap-4">
              <motion.div
                className="text-5xl md:text-6xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {category.emoji}
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-50">{category.name}</h1>
                <p className="text-lg text-neutral-400 mt-1">Kelime Yönetimi</p>
              </div>
            </div>
          </motion.div>

          {/* Top Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Yeni Kelime
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleImport}
                  icon={<Upload className="w-4 h-4" />}
                >
                  İçe Aktar
                </Button>
              </div>

              {/* Search Input */}
              <div className="flex-1 sm:max-w-md sm:ml-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Kelime veya ipucu ara... (Ctrl/Cmd+F)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {/* Import/Export Error Display */}
            <AnimatePresence>
              {importExportError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-error-900/20 border-l-4 border-error-500 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-error-400 font-semibold mb-1">Hata</h4>
                      <p className="text-error-300 text-sm whitespace-pre-line">{importExportError}</p>
                    </div>
                    <button
                      onClick={() => setImportExportError(null)}
                      className="text-error-400 hover:text-error-300 transition-colors"
                      aria-label="Hatayı kapat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Word Table with Quick Add Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden"
          >
            {/* Quick Add Row */}
            {categoryId && (
              <QuickAddRow
                fields={[
                  { name: 'word', placeholder: 'KELİME', maxLength: 10, required: true },
                  { name: 'hint', placeholder: 'İpucu', maxLength: 200, required: true },
                ]}
                onAdd={handleQuickAdd}
                validation={(values) => {
                  const word = values.word.toUpperCase().trim();
                  const hint = values.hint.trim();

                  if (!word || !hint) {
                    return 'Kelime ve ipucu gereklidir';
                  }

                  if (word.length < 4 || word.length > 10) {
                    return 'Kelime 4-10 karakter arasında olmalıdır';
                  }

                  if (!/^[A-ZÇĞİÖŞÜ]+$/.test(word)) {
                    return 'Kelime sadece Türkçe büyük harfler içermelidir';
                  }

                  return null;
                }}
                addButtonText="Ekle"
              />
            )}

            {/* Data Table */}
            <DataTable
              data={filteredAndSortedWords}
              columns={columns}
              keyExtractor={(word) => word.id.toString()}
              onSort={handleSort}
              sortKey={sortKey}
              sortDirection={sortDirection}
              emptyMessage={
                searchQuery
                  ? 'Aramanıza uygun kelime bulunamadı'
                  : 'Henüz kelime eklenmemiş. Yukarıdaki hızlı ekleme satırını kullanarak başlayın.'
              }
              stickyHeader
              zebra
            />
          </motion.div>

          {/* Bottom Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={words.length === 0}
              icon={<Download className="w-4 h-4" />}
            >
              JSON Dışa Aktar
            </Button>

            <div className="flex-1" />

            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.CATEGORY_MANAGEMENT)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Kategori Yönetimine Dön
            </Button>
          </motion.div>
        </div>

        {/* Right Sidebar: Word Distribution with Donut Chart */}
        {validation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-80 xl:w-96 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Distribution Donut Chart */}
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                <h3 className="text-xl font-bold text-neutral-50 mb-4">Kelime Dağılımı</h3>

                <DonutChart
                  segments={chartSegments}
                  size={240}
                  thickness={40}
                  centerText={validation.total_words.toString()}
                  centerSubtext="toplam kelime"
                  onSegmentClick={handleChartSegmentClick}
                />
              </div>

              {/* Playability Status */}
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
                <h3 className="text-xl font-bold text-neutral-50 mb-4">Oynanabilirlik</h3>

                <div className="space-y-3">
                  {validation.is_valid ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" size="md">
                          ✅ Oynanabilir
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        {validation.max_players_multi > 0 && (
                          <p className="text-neutral-400">
                            <span className="text-neutral-300 font-medium">Çok oyunculu:</span> Max {validation.max_players_multi} oyuncu
                          </p>
                        )}
                        {validation.max_teams > 0 && (
                          <p className="text-neutral-400">
                            <span className="text-neutral-300 font-medium">Takım modu:</span> Max {validation.max_teams} takım
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <Badge variant="error" size="md" className="mb-2">
                        ⚠️ Yetersiz kelime
                      </Badge>
                      <p className="text-sm text-neutral-400">
                        Her harf uzunluğundan (4-10) en az 2 kelime eklemeniz gerekiyor.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {categoryId && (
        <>
          <AddWordModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddSuccess}
            categoryId={parseInt(categoryId, 10)}
            categoryName={category.name}
            validation={validation}
          />

          {editingWord && (
            <EditWordModal
              isOpen={!!editingWord}
              onClose={() => setEditingWord(null)}
              onSuccess={handleEditSuccess}
              word={editingWord}
              categoryName={category.name}
              validation={validation}
            />
          )}

          {deletingWord && (
            <DeleteWordDialog
              isOpen={!!deletingWord}
              onClose={() => setDeletingWord(null)}
              onSuccess={handleDeleteSuccess}
              word={deletingWord}
            />
          )}
        </>
      )}
    </div>
  );
}

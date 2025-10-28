/**
 * Word Management Screen
 * Task 27: Word Management Screen
 * PRD Reference: Section 5.3 - Category Word Management
 *
 * Features:
 * - Word list display (table format)
 * - Search functionality
 * - Add/Edit/Delete words
 * - Right sidebar: Word distribution (4-10 letters)
 * - Playability status indicator
 * - JSON Import/Export buttons (Task 30)
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowLeft, Upload, Download, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Table, Column } from '../ui/Table';
import { AddWordModal, EditWordModal, DeleteWordDialog } from '../modals';
import { WordDistributionSidebar } from '../WordDistributionSidebar';
import { getWordsByCategory } from '../../api/word';
import { getCategoryById, validateCategory } from '../../api/category';
import { Category, Word, ValidationResult } from '../../types/database';
import { ROUTES } from '../../routes/constants';
import { useToast } from '../ui/Toast';

/**
 * WordManagementScreen Component
 *
 * Layout:
 * - Header: Category emoji + name, back button
 * - Top bar: Add Word, Import JSON, Search
 * - Main content: Word table (word, letter count, hint, actions)
 * - Right sidebar: Word distribution (4-10 letters), playability status
 * - Bottom bar: Export JSON, Back buttons
 */
export function WordManagementScreen() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  // Sort state
  const [sortKey, setSortKey] = useState<string>('word');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        (word) =>
          word.word.toLowerCase().includes(query) ||
          word.hint.toLowerCase().includes(query)
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

  // Handle sort
  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  // Handle add word success
  const handleAddSuccess = (newWord: Word) => {
    setWords((prev) => [...prev, newWord]);
    loadData(); // Reload to refresh validation
  };

  // Handle edit word success
  const handleEditSuccess = (updatedWord: Word) => {
    setWords((prev) =>
      prev.map((word) => (word.id === updatedWord.id ? updatedWord : word))
    );
    loadData(); // Reload to refresh validation
  };

  // Handle delete word success
  const handleDeleteSuccess = (deletedWordId: number) => {
    setWords((prev) => prev.filter((word) => word.id !== deletedWordId));
    loadData(); // Reload to refresh validation
  };

  // Handle JSON Import (placeholder for Task 30)
  const handleImport = () => {
    showToast('JSON içe aktarma özelliği Task 30\'da implement edilecek', 'info');
  };

  // Handle JSON Export (placeholder for Task 30)
  const handleExport = () => {
    showToast('JSON dışa aktarma özelliği Task 30\'da implement edilecek', 'info');
  };

  // Table columns
  const columns: Column<Word>[] = [
    {
      key: 'word',
      header: 'Kelime',
      accessor: (word) => (
        <span className="font-bold text-lg text-white uppercase tracking-wide">
          {word.word}
        </span>
      ),
      sortable: true,
      width: 'w-1/4',
    },
    {
      key: 'letter_count',
      header: 'Harf',
      accessor: (word) => (
        <Badge variant="neutral" size="sm">
          {word.letter_count}
        </Badge>
      ),
      sortable: true,
      width: 'w-20',
    },
    {
      key: 'hint',
      header: 'İpucu',
      accessor: (word) => (
        <span className="text-slate-300">{word.hint}</span>
      ),
      sortable: true,
      width: 'w-1/2',
    },
    {
      key: 'actions',
      header: 'Aksiyon',
      accessor: (word) => (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditingWord(word)}
            aria-label={`${word.word} kelimesini düzenle`}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingWord(word)}
            aria-label={`${word.word} kelimesini sil`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      sortable: false,
      width: 'w-32',
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-xl text-red-400 mb-6">{error || 'Kategori bulunamadı'}</p>
          <Button onClick={() => navigate(ROUTES.CATEGORY_MANAGEMENT)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kategori Yönetimine Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.CATEGORY_MANAGEMENT)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {category.name}
                </h1>
                <p className="text-lg text-slate-400 mt-1">Kelime Yönetimi</p>
              </div>
            </div>
          </motion.div>

          {/* Top Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Add Word Button */}
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kelime Ekle
            </Button>

            {/* Import JSON Button (Task 30) */}
            <Button
              variant="secondary"
              onClick={handleImport}
              className="sm:w-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              JSON'dan İçe Aktar
            </Button>

            {/* Search Input */}
            <div className="flex-1 sm:max-w-md ml-auto">
              <Input
                type="text"
                placeholder="Kelime veya ipucu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
                className="w-full"
              />
            </div>
          </motion.div>

          {/* Word Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
          >
            <Table
              data={filteredAndSortedWords}
              columns={columns}
              keyExtractor={(word) => word.id.toString()}
              onSort={handleSort}
              sortKey={sortKey}
              sortDirection={sortDirection}
              emptyMessage={
                searchQuery
                  ? 'Aramanıza uygun kelime bulunamadı'
                  : 'Henüz kelime eklenmemiş. "Yeni Kelime Ekle" butonuna tıklayarak başlayın.'
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
            className="flex flex-col sm:flex-row gap-3 mt-6"
          >
            {/* Export JSON Button (Task 30) */}
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={words.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              JSON Dışa Aktar
            </Button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Back Button */}
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.CATEGORY_MANAGEMENT)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kategori Yönetimine Dön
            </Button>
          </motion.div>
        </div>

        {/* Right Sidebar: Word Distribution */}
        {validation && (
          <WordDistributionSidebar validation={validation} />
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

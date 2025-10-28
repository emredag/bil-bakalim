/**
 * DeleteCategoryDialog Component
 * Task 25: Category Management Screen
 * PRD Reference: Section 5.6 - Category Deletion
 *
 * Confirmation dialog for deleting a category
 */

import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { deleteCategory } from '../../api/category';
import { Category, ValidationResult } from '../../types/database';

export interface DeleteCategoryDialogProps {
  isOpen: boolean;
  category: Category | null;
  validation: ValidationResult | null;
  onClose: () => void;
  onSuccess: (categoryId: number) => void;
}

/**
 * DeleteCategoryDialog - Confirmation dialog for category deletion
 *
 * Features:
 * - Warning message with word count
 * - Cannot delete default categories
 * - Destructive action confirmation
 * - Success/error toast notifications
 */
export function DeleteCategoryDialog({
  isOpen,
  category,
  validation,
  onClose,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete
  const handleDelete = async () => {
    if (!category) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteCategory(category.id);

      showToast(`${category.name} kategorisi silindi`, 'success');

      onSuccess(category.id);
      onClose();
    } catch (error: any) {
      console.error('Category deletion error:', error);
      
      // Check if it's a validation error (default category)
      const errorMessage = error?.message || 'Kategori silinirken hata oluştu';
      showToast(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!category) {
    return null;
  }

  const wordCount = validation?.total_words || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOverlayClick={!isDeleting}>
      <div className="space-y-6">
        {/* Header with Icon */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Kategoriyi Sil
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Warning Message */}
        <div className="space-y-4">
          <p className="text-slate-300 text-base md:text-lg">
            <span className="font-bold text-white">{category.emoji} {category.name}</span>{' '}
            kategorisini silmek istediğinizden emin misiniz?
          </p>

          {wordCount > 0 && (
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">
                ⚠️ Bu işlem geri alınamaz ve <strong>{wordCount} kelime</strong> silinecek.
              </p>
            </div>
          )}

          {category.is_default && (
            <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-lg p-4">
              <p className="text-amber-400 text-sm font-medium">
                🔒 Bu varsayılan bir kategoridir ve silinemez.
              </p>
            </div>
          )}

          <p className="text-slate-400 text-sm">
            Silinen kategori ve kelimeleri geri getirilemez.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            İptal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || category.is_default}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

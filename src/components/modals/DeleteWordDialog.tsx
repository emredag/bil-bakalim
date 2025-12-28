/**
 * DeleteWordDialog Component
 * Task 27: Word Management - Delete Word
 * PRD Reference: Section 5.6 - Word Deletion
 *
 * Confirmation dialog for deleting a word:
 * - Shows word to be deleted
 * - Warning message
 * - Confirm/Cancel actions
 */

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { deleteWord } from '../../api/word';
import { Word } from '../../types/database';

export interface DeleteWordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (wordId: number) => void;
  word: Word;
}

/**
 * DeleteWordDialog - Confirmation dialog for word deletion
 *
 * Features:
 * - Clear warning message
 * - Shows word being deleted
 * - Destructive action confirmation
 * - Toast notification on success
 */
export function DeleteWordDialog({ isOpen, onClose, onSuccess, word }: DeleteWordDialogProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete confirmation
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteWord(word.id);

      showToast(`"${word.word}" kelimesi silindi`, 'success');

      onSuccess(word.id);
      onClose();
    } catch (error) {
      console.error('Word deletion error:', error);
      showToast('Kelime silinirken hata oluştu', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kelime Sil" size="md">
      <div className="space-y-6">
        {/* Warning Icon and Message */}
        <div className="flex items-start gap-4 p-4 bg-error-500/10 border-2 border-error-500/30 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-error-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-error-400 mb-2">
              Bu kelimeyi silmek istediğinizden emin misiniz?
            </h3>
            <p className="text-sm text-neutral-300 mb-3">Bu işlem geri alınamaz.</p>

            {/* Word Being Deleted */}
            <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700">
              <p className="text-xs text-neutral-400 mb-1">Silinecek Kelime:</p>
              <p className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
                {word.word}
              </p>
              <p className="text-sm text-neutral-300">
                <span className="text-neutral-400">İpucu:</span> {word.hint}
              </p>
              <p className="text-xs text-neutral-400 mt-2">Harf sayısı: {word.letter_count}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting}
            className="flex-1"
            icon={<Trash2 className="w-4 h-4" />}
          >
            Evet, Sil
          </Button>
        </div>
      </div>
    </Modal>
  );
}

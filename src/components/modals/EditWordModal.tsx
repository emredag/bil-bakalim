/**
 * EditWordModal Component
 * Task 27/28: Word Management - Edit Word
 * PRD Reference: Section 5.5 - Word Editing
 *
 * Modal for editing an existing word with:
 * - Word input (editable, with uniqueness check)
 * - Hint input (editable)
 * - Same validation as AddWordModal
 * - Distribution info display
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { updateWord, getWordsByCategory } from '../../api/word';
import { Word, ValidationResult } from '../../types/database';
import { useKeyboardShortcuts } from '../../hooks';

export interface EditWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (word: Word) => void;
  word: Word;
  categoryName: string;
  validation: ValidationResult | null;
}

/**
 * EditWordModal - Modal for editing existing words
 *
 * Features:
 * - Pre-filled form with current word data
 * - Same validation as AddWordModal
 * - Duplicate checking (excluding current word)
 * - Real-time letter count
 * - Distribution info display
 */
export function EditWordModal({
  isOpen,
  onClose,
  onSuccess,
  word: currentWord,
  categoryName,
  validation,
}: EditWordModalProps) {
  const { showToast } = useToast();
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingWords, setExistingWords] = useState<Word[]>([]);
  const [errors, setErrors] = useState<{
    word?: string;
    hint?: string;
  }>({});

  // Initialize form when modal opens or word changes
  useEffect(() => {
    if (isOpen && currentWord) {
      setWord(currentWord.word);
      setHint(currentWord.hint);
      setErrors({});
      loadExistingWords();
    }
  }, [isOpen, currentWord]);

  // Keyboard shortcuts (PRD Section 11.4)
  useKeyboardShortcuts({
    onSave: () => {
      if (isOpen && !isSubmitting) {
        handleSubmit(new Event('submit') as any);
      }
    },
    disableNavigation: isOpen,
  });

  // Load existing words for duplicate checking
  const loadExistingWords = async () => {
    try {
      const words = await getWordsByCategory(currentWord.category_id);
      setExistingWords(words);
    } catch (error) {
      console.error('Failed to load existing words:', error);
    }
  };

  // Handle word input - auto-uppercase and filter non-letters
  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Convert to uppercase
    value = value.toUpperCase();
    
    // Allow only Turkish letters (A-Z, Ç, Ğ, İ, Ö, Ş, Ü)
    value = value.replace(/[^A-ZÇĞİÖŞÜ]/g, '');
    
    // Limit to 10 characters
    value = value.slice(0, 10);
    
    setWord(value);
    
    // Clear word error when typing
    if (errors.word) {
      setErrors((prev) => ({ ...prev, word: undefined }));
    }
  };

  // Handle hint input
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 100); // Max 100 chars
    setHint(value);
    
    // Clear hint error when typing
    if (errors.hint) {
      setErrors((prev) => ({ ...prev, hint: undefined }));
    }
  };

  // Get current count for this letter length
  const getCurrentCount = (): number => {
    if (!validation || word.length === 0) return 0;
    const item = validation.words_by_length.find(
      (w) => w.letter_count === word.length
    );
    return item ? item.count : 0;
  };

  // Check if sufficient words exist for this length
  const isSufficient = (): boolean => {
    const count = getCurrentCount();
    return count >= 2; // PRD: minimum 2 per length
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // Word validation
    if (!word.trim()) {
      newErrors.word = 'Kelime gereklidir';
    } else if (word.length < 4) {
      newErrors.word = 'Kelime en az 4 harf olmalıdır';
    } else if (word.length > 10) {
      newErrors.word = 'Kelime en fazla 10 harf olabilir';
    } else {
      // Check for duplicate (excluding current word)
      const isDuplicate = existingWords.some(
        (w) => 
          w.id !== currentWord.id && 
          w.word.toLowerCase() === word.toLowerCase()
      );
      if (isDuplicate) {
        newErrors.word = 'Bu kelime kategoride zaten mevcut';
      }
    }

    // Hint validation
    if (!hint.trim()) {
      newErrors.hint = 'İpucu gereklidir';
    } else if (hint.length > 100) {
      newErrors.hint = 'İpucu en fazla 100 karakter olabilir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedWord = await updateWord(
        currentWord.id,
        word.trim(),
        hint.trim()
      );

      showToast(
        `"${updatedWord.word}" kelimesi güncellendi`,
        'success'
      );

      onSuccess(updatedWord);
      onClose();
    } catch (error) {
      console.error('Word update error:', error);
      showToast('Kelime güncellenirken hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if anything changed
  const hasChanges = 
    word !== currentWord.word || 
    hint !== currentWord.hint;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kelime Düzenle"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Info */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-sm text-slate-400">
            <strong className="text-white">{categoryName}</strong> kategorisinde kelime düzenliyorsunuz
          </p>
        </div>

        {/* Original Word Info (if word changed) */}
        {word !== currentWord.word && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-4"
          >
            <p className="text-sm text-amber-400">
              Orijinal kelime: <strong className="text-xl">{currentWord.word}</strong>
            </p>
          </motion.div>
        )}

        {/* Word Input */}
        <div>
          <label htmlFor="word-input" className="block text-sm font-semibold text-white mb-2">
            Kelime <span className="text-red-400">*</span>
          </label>
          <Input
            id="word-input"
            type="text"
            value={word}
            onChange={handleWordChange}
            placeholder="Örn: FUTBOL"
            error={errors.word}
            className="text-xl font-bold uppercase tracking-wide"
            autoFocus
          />
          {/* Real-time letter count */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-slate-400">
              Sadece harf (A-Z), 4-10 karakter
            </p>
            <Badge
              variant={
                word.length === 0
                  ? 'neutral'
                  : word.length >= 4 && word.length <= 10
                  ? 'success'
                  : 'error'
              }
              size="sm"
            >
              {word.length} harf
            </Badge>
          </div>
        </div>

        {/* Hint Input */}
        <div>
          <label htmlFor="hint-input" className="block text-sm font-semibold text-white mb-2">
            İpucu <span className="text-red-400">*</span>
          </label>
          <Input
            id="hint-input"
            type="text"
            value={hint}
            onChange={handleHintChange}
            placeholder="Örn: 11 kişiyle oynanan takım sporu"
            error={errors.hint}
          />
          <p className="text-sm text-slate-400 mt-2">
            {hint.length}/100 karakter
          </p>
        </div>

        {/* Distribution Info */}
        {word.length >= 4 && word.length <= 10 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              p-4 rounded-lg border-2 flex items-start gap-3
              ${
                isSufficient()
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }
            `}
          >
            <AlertCircle
              className={`
                w-5 h-5 flex-shrink-0 mt-0.5
                ${isSufficient() ? 'text-green-400' : 'text-amber-400'}
              `}
            />
            <div className="flex-1">
              <p
                className={`
                  text-sm font-medium mb-1
                  ${isSufficient() ? 'text-green-400' : 'text-amber-400'}
                `}
              >
                Bu kategoride {word.length} harfli {getCurrentCount()} kelime var
              </p>
              <p className="text-xs text-slate-400">
                {isSufficient()
                  ? 'Yeterli kelime sayısı mevcut'
                  : 'Minimum 2 kelime gerekli'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting || !hasChanges}
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Güncelle
          </Button>
        </div>
      </form>
    </Modal>
  );
}

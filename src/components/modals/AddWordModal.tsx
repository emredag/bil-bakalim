/**
 * AddWordModal Component
 * Task 27/28: Word Management - Add Word
 * PRD Reference: Section 5.4 - New Word Addition
 *
 * Modal for adding a new word to a category with:
 * - Word input (required, auto-uppercase, A-Z only, 4-10 chars)
 * - Real-time letter count display
 * - Hint input (required, max 100 chars)
 * - Info box showing current distribution for that letter length
 * - Form validation
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { addWord, getWordsByCategory } from '../../api/word';
import { Word, ValidationResult } from '../../types/database';

export interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (word: Word) => void;
  categoryId: number;
  categoryName: string;
  validation: ValidationResult | null;
}

/**
 * AddWordModal - Modal for adding new words to a category
 *
 * Features:
 * - Auto-uppercase word input
 * - Real-time letter count
 * - Character restrictions (A-Z, Turkish characters)
 * - Length validation (4-10 letters)
 * - Duplicate checking
 * - Distribution info display
 * - Success/error toast notifications
 */
export function AddWordModal({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  categoryName,
  validation,
}: AddWordModalProps) {
  const { showToast } = useToast();
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingWords, setExistingWords] = useState<Word[]>([]);
  const [errors, setErrors] = useState<{
    word?: string;
    hint?: string;
  }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setWord('');
      setHint('');
      setErrors({});
      loadExistingWords();
    }
  }, [isOpen, categoryId]);

  // Load existing words for duplicate checking
  const loadExistingWords = async () => {
    try {
      const words = await getWordsByCategory(categoryId);
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
      // Check for duplicate (case-insensitive)
      const isDuplicate = existingWords.some(
        (w) => w.word.toLowerCase() === word.toLowerCase()
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
      const newWord = await addWord(categoryId, word.trim(), hint.trim());

      showToast(
        `"${newWord.word}" kelimesi eklendi`,
        'success'
      );

      onSuccess(newWord);
      onClose();
    } catch (error) {
      console.error('Word addition error:', error);
      showToast('Kelime eklenirken hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Kelime Ekle"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Info */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-sm text-slate-400">
            <strong className="text-white">{categoryName}</strong> kategorisine kelime ekliyorsunuz
          </p>
        </div>

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
                {getCurrentCount() === 0
                  ? `Bu kategoride ${word.length} harfli kelime yok`
                  : `Bu kategoride ${word.length} harfli ${getCurrentCount()} kelime var`}
              </p>
              <p className="text-xs text-slate-400">
                {isSufficient()
                  ? `${getCurrentCount() + 1}. kelime eklenecek (yeterli)`
                  : getCurrentCount() === 0
                  ? 'İlk kelime eklenecek (minimum 2 gerekli)'
                  : '2. kelime eklenecek (minimum gereklilik sağlanacak)'}
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
            disabled={isSubmitting}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  );
}

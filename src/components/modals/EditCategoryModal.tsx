/**
 * EditCategoryModal Component
 * Task 25: Category Management Screen
 * PRD Reference: Section 5.2 - Category Edit
 *
 * Modal for editing an existing category
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmojiPicker, EmojiButton } from '../EmojiPicker';
import { useToast } from '../ui/Toast';
import { updateCategory } from '../../api/category';
import { Category } from '../../types/database';
import { useKeyboardShortcuts } from '../../hooks';

export interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess: (category: Category) => void;
}

/**
 * EditCategoryModal - Modal for editing categories
 *
 * Features:
 * - Pre-filled form with existing category data
 * - Same validation as create modal
 * - Live preview of changes
 * - Success/error toast notifications
 */
export function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [description, setDescription] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    emoji?: string;
  }>({});

  // Load category data when modal opens
  useEffect(() => {
    if (isOpen && category) {
      setName(category.name);
      setEmoji(category.emoji);
      setDescription(category.description || '');
      setErrors({});
      setShowEmojiPicker(false);
    }
  }, [isOpen, category]);

  // Keyboard shortcuts (PRD Section 11.4)
  useKeyboardShortcuts({
    onSave: () => {
      if (isOpen && !isSubmitting) {
        handleSubmit(new Event('submit') as any);
      }
    },
    disableNavigation: isOpen,
  });

  // Validation
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    } else if (name.length > 50) {
      newErrors.name = 'Kategori adı en fazla 50 karakter olabilir';
    }

    if (!emoji) {
      newErrors.emoji = 'Emoji seçmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedCategory = await updateCategory(
        category.id,
        name.trim(),
        emoji,
        description.trim() || undefined
      );

      showToast(`${updatedCategory.name} kategorisi güncellendi`, 'success');

      onSuccess(updatedCategory);
      onClose();
    } catch (error) {
      console.error('Category update error:', error);
      showToast('Kategori güncellenirken hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    setShowEmojiPicker(false);
    setErrors((prev) => ({ ...prev, emoji: undefined }));
  };

  if (!category) {
    return null;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Kategoriyi Düzenle</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-700"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning for default category */}
          {category.is_default && (
            <div className="bg-warning-500/10 border-2 border-warning-500/50 rounded-lg p-4">
              <p className="text-warning-400 text-sm font-medium">
                ⚠️ Bu varsayılan bir kategoridir. Düzenleyebilirsiniz ancak silemezsiniz.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Form */}
            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="edit-category-name"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Kategori Adı <span className="text-error-400">*</span>
                </label>
                <Input
                  id="edit-category-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Örn: Spor, Yiyecek, Teknoloji"
                  maxLength={50}
                  error={errors.name}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-neutral-400 mt-1">{name.length}/50 karakter</p>
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Emoji <span className="text-error-400">*</span>
                </label>
                <div className="flex items-start space-x-3">
                  <EmojiButton emoji={emoji} onClick={() => setShowEmojiPicker(true)} size="lg" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-400">
                      Kategoriyi temsil edecek bir emoji seçin
                    </p>
                    {errors.emoji && <p className="text-sm text-error-400 mt-1">{errors.emoji}</p>}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="edit-category-description"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  id="edit-category-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategori hakkında kısa bir açıklama"
                  maxLength={200}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-xs text-neutral-400 mt-1">{description.length}/200 karakter</p>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Önizleme</label>
              <motion.div
                className="bg-neutral-900 rounded-2xl p-6 border-2 border-neutral-700 h-full min-h-[300px] flex flex-col items-center justify-center space-y-4"
                key={`${name}-${emoji}-${description}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Preview Emoji */}
                <div className="text-6xl md:text-7xl">{emoji}</div>

                {/* Preview Name */}
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">{name}</h3>

                {/* Preview Description */}
                {description && (
                  <p className="text-sm text-neutral-400 text-center line-clamp-3">{description}</p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-neutral-700">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !name.trim() || !emoji}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Emoji Picker Modal */}
      <AnimatePresence>
        {showEmojiPicker && (
          <EmojiPicker
            type="category"
            selectedEmoji={emoji}
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            variant="modal"
          />
        )}
      </AnimatePresence>
    </>
  );
}

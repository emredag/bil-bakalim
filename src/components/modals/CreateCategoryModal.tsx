/**
 * CreateCategoryModal Component
 * Task 25: Category Management Screen
 * PRD Reference: Section 5.2 - New Category Creation
 *
 * Modal for creating a new category with:
 * - Category name input (required, max 50 chars)
 * - Emoji picker
 * - Description input (optional, max 200 chars)
 * - Live preview card
 * - Form validation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmojiPicker, EmojiButton } from '../EmojiPicker';
import { useToast } from '../ui/Toast';
import { createCategory, getAllCategories } from '../../api/category';
import { Category } from '../../types/database';

export interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  onSuccessAndAddWords?: (category: Category) => void;
}

/**
 * CreateCategoryModal - Modal for creating new categories
 *
 * Features:
 * - Form validation (name, emoji required)
 * - Character limits (name: 50, description: 200)
 * - Live preview of category card
 * - Emoji picker integration
 * - Success/error toast notifications
 */
export function CreateCategoryModal({ isOpen, onClose, onSuccess, onSuccessAndAddWords }: CreateCategoryModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [description, setDescription] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCategories, setExistingCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    emoji?: string;
  }>({});

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setEmoji('');
      setDescription('');
      setErrors({});
      setShowEmojiPicker(false);
      // Load existing categories for uniqueness validation
      loadExistingCategories();
    }
  }, [isOpen]);

  // Load existing categories
  const loadExistingCategories = async () => {
    try {
      const categories = await getAllCategories();
      setExistingCategories(categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    } else if (name.length > 50) {
      newErrors.name = 'Kategori adı en fazla 50 karakter olabilir';
    } else {
      // Check for duplicate category name (case-insensitive)
      const isDuplicate = existingCategories.some(
        (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicate) {
        newErrors.name = 'Bu kategori adı zaten kullanılıyor';
      }
    }

    if (!emoji) {
      newErrors.emoji = 'Emoji seçmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (just save)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const category = await createCategory(
        name.trim(),
        emoji,
        description.trim() || undefined
      );

      showToast(`${category.name} kategorisi oluşturuldu`, 'success');

      onSuccess(category);
      onClose();
    } catch (error) {
      console.error('Category creation error:', error);
      showToast('Kategori oluşturulurken hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submit (save and navigate to word management)
  const handleSubmitAndAddWords = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const category = await createCategory(
        name.trim(),
        emoji,
        description.trim() || undefined
      );

      showToast(`${category.name} kategorisi oluşturuldu`, 'success');

      // Navigate to word management
      if (onSuccessAndAddWords) {
        onSuccessAndAddWords(category);
      }
      onClose();
    } catch (error) {
      console.error('Category creation error:', error);
      showToast('Kategori oluşturulurken hata oluştu', 'error');
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Yeni Kategori Oluştur
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Form */}
            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Kategori Adı <span className="text-red-400">*</span>
                </label>
                <Input
                  id="category-name"
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
                <p className="text-xs text-slate-400 mt-1">
                  {name.length}/50 karakter
                </p>
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Emoji <span className="text-red-400">*</span>
                </label>
                <div className="flex items-start space-x-3">
                  <EmojiButton
                    emoji={emoji}
                    onClick={() => setShowEmojiPicker(true)}
                    size="lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">
                      Kategoriyi temsil edecek bir emoji seçin
                    </p>
                    {errors.emoji && (
                      <p className="text-sm text-red-400 mt-1">{errors.emoji}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="category-description"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  id="category-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategori hakkında kısa bir açıklama"
                  maxLength={200}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {description.length}/200 karakter
                </p>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Önizleme
              </label>
              <motion.div
                className="bg-slate-900 rounded-2xl p-6 border-2 border-slate-700 h-full min-h-[300px] flex flex-col items-center justify-center space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Preview Emoji */}
                <div className="text-6xl md:text-7xl">
                  {emoji || '❓'}
                </div>

                {/* Preview Name */}
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                  {name || 'Kategori Adı'}
                </h3>

                {/* Preview Description */}
                {description && (
                  <p className="text-sm text-slate-400 text-center line-clamp-3">
                    {description}
                  </p>
                )}

                {/* Preview Placeholder */}
                {!name && !emoji && !description && (
                  <p className="text-sm text-slate-500 text-center">
                    Formu doldurun, önizleme burada görünecek
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmitAndAddWords}
              disabled={isSubmitting || !name.trim() || !emoji}
            >
              <Plus className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Oluşturuluyor...' : 'Oluştur ve Kelime Ekle'}
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

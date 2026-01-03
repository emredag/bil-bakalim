/**
 * Category API - Tauri Command Wrappers
 * PRD Reference: Section 5.1 - Category Management
 */
import { invoke } from '@tauri-apps/api/core';
import { save, open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { Category, ValidationResult, CategoryExportData, ImportResult } from '../types/database';

/**
 * Get all categories from database
 * PRD Reference: Section 5.1
 */
export async function getAllCategories(): Promise<Category[]> {
  return invoke<Category[]>('get_all_categories');
}

/**
 * Get a category by ID
 * PRD Reference: Section 5.1
 */
export async function getCategoryById(id: number): Promise<Category> {
  return invoke<Category>('get_category_by_id', { id });
}

/**
 * Create a new category
 * PRD Reference: Section 5.2
 */
export async function createCategory(
  name: string,
  emoji: string,
  description?: string
): Promise<Category> {
  return invoke<Category>('create_category', { name, emoji, description: description || null });
}

/**
 * Update an existing category
 * PRD Reference: Section 5.2
 */
export async function updateCategory(
  id: number,
  name: string,
  emoji: string,
  description?: string
): Promise<Category> {
  return invoke<Category>('update_category', { id, name, emoji, description: description || null });
}

/**
 * Delete a category
 * PRD Reference: Section 5.6
 * Note: Cannot delete default category
 */
export async function deleteCategory(id: number): Promise<void> {
  return invoke<void>('delete_category', { id });
}

/**
 * Validate category playability
 * PRD Reference: Section 3.3
 */
export async function validateCategory(id: number): Promise<ValidationResult> {
  return invoke<ValidationResult>('validate_category', { id });
}

/**
 * Export category and words to JSON file
 * PRD Reference: Section 5.7 - JSON Export
 *
 * Opens a save dialog and writes category data to selected file
 * Default filename: [category-name].json
 */
export async function exportCategoryToJson(
  categoryId: number,
  categoryName: string
): Promise<void> {
  // Get category data from backend
  let exportData: CategoryExportData;
  try {
    exportData = await invoke<CategoryExportData>('export_category_json', { categoryId });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Kategori verileri alınamadı: ${error.message}`);
    }
    throw new Error('Kategori verileri alınırken beklenmeyen bir hata oluştu.');
  }

  // Check if category has words
  if (!exportData.words || exportData.words.length === 0) {
    throw new Error(
      'Bu kategoride henüz kelime bulunmuyor. Dışa aktarma yapabilmek için önce kelime eklemelisiniz.'
    );
  }

  // Open save dialog
  const filePath = await save({
    defaultPath: `bil-bakalim-${categoryName.toLowerCase().replace(/\s+/g, '-')}.json`,
    filters: [
      {
        name: 'JSON',
        extensions: ['json'],
      },
    ],
  });

  if (!filePath) {
    throw new Error('Dosya kaydetme iptal edildi');
  }

  // Write JSON to file
  try {
    const jsonContent = JSON.stringify(exportData, null, 2);
    await writeTextFile(filePath, jsonContent);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Dosya kaydedilemedi: ${error.message}`);
    }
    throw new Error(
      'Dosya kaydedilirken beklenmeyen bir hata oluştu. Lütfen farklı bir konum seçin.'
    );
  }
}

/**
 * Import words from JSON file into category
 * PRD Reference: Section 5.7 - JSON Import
 *
 * Opens a file dialog, reads and validates JSON, then imports words
 * Returns statistics about import (words added, skipped)
 */
export async function importCategoryFromJson(categoryId: number): Promise<ImportResult> {
  // Open file dialog
  const filePath = await open({
    multiple: false,
    filters: [
      {
        name: 'JSON',
        extensions: ['json'],
      },
    ],
  });

  if (!filePath) {
    throw new Error('Dosya seçimi iptal edildi');
  }

  // Read file content
  let fileContent: string;
  try {
    fileContent = await readTextFile(filePath);
  } catch (error) {
    throw new Error('Dosya okunamadı. Lütfen geçerli bir dosya seçtiğinizden emin olun.');
  }

  // Check if file is empty
  if (!fileContent || fileContent.trim().length === 0) {
    throw new Error('Dosya boş. Lütfen içerik içeren bir JSON dosyası seçin.');
  }

  // Parse JSON
  let jsonData: CategoryExportData;
  try {
    jsonData = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      'JSON formatı hatalı. Dosya geçerli bir JSON formatında değil. Lütfen JSON formatını kontrol edin.'
    );
  }

  // Validate JSON structure - category
  if (!jsonData.category) {
    throw new Error(
      'JSON yapısı hatalı: "category" alanı bulunamadı. Lütfen dosyanın doğru formatta olduğundan emin olun.'
    );
  }

  // Validate category fields
  if (!jsonData.category.name || typeof jsonData.category.name !== 'string') {
    throw new Error('JSON yapısı hatalı: "category.name" alanı gerekli ve metin olmalıdır.');
  }

  if (!jsonData.category.emoji || typeof jsonData.category.emoji !== 'string') {
    throw new Error('JSON yapısı hatalı: "category.emoji" alanı gerekli ve metin olmalıdır.');
  }

  // Validate JSON structure - words
  if (!jsonData.words) {
    throw new Error(
      'JSON yapısı hatalı: "words" alanı bulunamadı. Lütfen dosyanın doğru formatta olduğundan emin olun.'
    );
  }

  if (!Array.isArray(jsonData.words)) {
    throw new Error('JSON yapısı hatalı: "words" alanı bir liste (array) olmalıdır.');
  }

  // Check if words array is empty
  if (jsonData.words.length === 0) {
    throw new Error(
      'JSON dosyasında kelime bulunamadı. Lütfen en az bir kelime içeren bir dosya seçin.'
    );
  }

  // Validate each word structure
  const invalidWords: string[] = [];
  jsonData.words.forEach((word, index) => {
    if (!word.word || typeof word.word !== 'string') {
      invalidWords.push(`${index + 1}. kelime: "word" alanı eksik veya geçersiz`);
    }
    if (typeof word.letter_count !== 'number') {
      invalidWords.push(`${index + 1}. kelime: "letter_count" alanı eksik veya sayı değil`);
    }
    if (!word.hint || typeof word.hint !== 'string') {
      invalidWords.push(`${index + 1}. kelime: "hint" alanı eksik veya geçersiz`);
    }
  });

  if (invalidWords.length > 0) {
    throw new Error(
      `JSON yapısı hatalı. Aşağıdaki sorunlar bulundu:\n${invalidWords.slice(0, 5).join('\n')}${
        invalidWords.length > 5 ? `\n...ve ${invalidWords.length - 5} sorun daha` : ''
      }`
    );
  }

  // Send to backend for import
  try {
    const result = await invoke<ImportResult>('import_category_json', {
      categoryId,
      jsonData,
    });

    return result;
  } catch (error) {
    // Backend error
    if (error instanceof Error) {
      throw new Error(`İçe aktarma hatası: ${error.message}`);
    }
    throw new Error('Kelimeler içe aktarılırken beklenmeyen bir hata oluştu.');
  }
}

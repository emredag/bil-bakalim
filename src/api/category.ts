/**
 * Category API - Tauri Command Wrappers
 * PRD Reference: Section 5.1 - Category Management
 */
import { invoke } from '@tauri-apps/api/core';
import { Category, ValidationResult } from '../types/database';

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

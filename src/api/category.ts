/**
 * Category API - Tauri Command Wrappers
 */
import { invoke } from '@tauri-apps/api/core';

export interface Category {
  id: number;
  name: string;
  emoji: string;
  description: string | null;
  word_count: number;
  playable: boolean;
  created_at: string;
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  return invoke<Category[]>('get_all_categories');
}

/**
 * Get a category by ID
 */
export async function getCategoryById(id: number): Promise<Category> {
  return invoke<Category>('get_category_by_id', { id });
}

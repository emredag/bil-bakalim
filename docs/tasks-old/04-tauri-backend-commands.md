# Task 04: Tauri Backend Commands

## Description
Implement all Tauri Rust commands for database operations, file handling, and settings management.

## Requirements from PRD
- **Section:** 14. TAURI BACKEND İŞLEMLERİ → 14.1 Tauri Commands (Rust)

## Category Commands
- `get_all_categories()` → Tüm kategorileri getir
- `get_category_by_id(id)` → Tek kategori detayı
- `create_category(name, emoji, desc)` → Yeni kategori
- `update_category(id, name, emoji, desc)` → Kategori güncelle
- `delete_category(id)` → Kategori sil
- `validate_category(id)` → Oynanabilirlik kontrolü

## Word Commands
- `get_words_by_category(category_id)` → Kategorinin kelimeleri
- `add_word(category_id, word, hint)` → Yeni kelime
- `update_word(id, word, hint)` → Kelime güncelle
- `delete_word(id)` → Kelime sil
- `get_random_words(category_id, count, exclude_ids)` → Oyun için kelime seçimi
- `validate_category_for_mode(category_id, mode, participant_count)` → Mod için yeterli kelime var mı?

## File Commands
- `export_category_json(category_id, path)` → JSON export
- `import_category_json(path)` → JSON import
- `backup_database(path)` → DB yedekleme
- `restore_database(path)` → DB geri yükleme

## Settings Commands
- `get_settings()` → Tüm ayarlar
- `update_setting(key, value)` → Ayar güncelle

## Game History Commands
- `save_game_result(game_data, participants, word_results)` → Yarışma sonucu kaydet
- `get_game_history(filters, pagination)` → Geçmiş yarışmaları getir
- `get_game_detail(game_id)` → Tek yarışma detayı
- `get_game_statistics()` → Genel istatistikler
- `export_game_history_json(path)` → Geçmişi JSON'a aktar
- `delete_game_history(game_id)` → Tek yarışma sil
- `delete_all_game_history()` → Tüm geçmişi sil

## Error Types
- DatabaseError - Veritabanı hataları
- ValidationError - Validasyon hataları
- NotFoundError - Kayıt bulunamadı
- DuplicateError - Tekrar kayıt
- FileSystemError - Dosya işlem hataları

## Acceptance Criteria
- [ ] All category commands implemented
- [ ] All word commands implemented
- [ ] All file commands implemented
- [ ] All settings commands implemented
- [ ] All game history commands implemented
- [ ] Error handling implemented
- [ ] Commands properly exposed to frontend

# Tauri Backend Commands
> PRD Reference: Section 14 - Tauri Backend Operations
> Category: Backend
> Status: Not Started
> Priority: High
> Estimated Time: 2 days

---

## 🎯 Objective
Implement all Tauri Rust backend commands to handle database operations, file management, and settings. These commands serve as the bridge between the React frontend and SQLite database, providing all CRUD operations for categories, words, game history, and system settings.

All commands must be exposed to the frontend via Tauri's invoke mechanism and include comprehensive error handling.

---

## 🧾 Requirements
All mandatory work items within this task, as defined in the PRD.

- PRD 14.1: Implement category commands (get_all, get_by_id, create, update, delete, validate)
- PRD 14.1: Implement word commands (get_by_category, add, update, delete, get_random, validate_for_mode)
- PRD 14.1: Implement file commands (export_category_json, import_category_json, backup_database, restore_database)
- PRD 14.1: Implement settings commands (get_settings, update_setting)
- PRD 14.1: Implement game history commands (save_game_result, get_game_history, get_game_detail, get_game_statistics, export_game_history_json, delete operations)
- PRD 14.1: get_random_words must accept count and exclude_ids for multiplayer mode
- PRD 14.1: validate_category_for_mode must check participant count requirements
- PRD 14.2: Implement error types (DatabaseError, ValidationError, NotFoundError, DuplicateError, FileSystemError)
- PRD 14.2: All errors must return user-friendly messages to frontend

---

## ⚙️ Technical Details
Technical scope of the task as per PRD.

**Technology:**
- Rust with Tauri framework
- rusqlite for database operations
- serde for JSON serialization
- Tauri File System API and Dialog API

**Command Categories:**

**Category Commands:**
```rust
#[tauri::command]
fn get_all_categories() -> Result<Vec<Category>, Error>
fn get_category_by_id(id: i32) -> Result<Category, Error>
fn create_category(name: String, emoji: String, desc: Option<String>) -> Result<Category, Error>
fn update_category(id: i32, name: String, emoji: String, desc: Option<String>) -> Result<Category, Error>
fn delete_category(id: i32) -> Result<(), Error>
fn validate_category(id: i32) -> Result<ValidationResult, Error>
```

**Word Commands:**
```rust
#[tauri::command]
fn get_words_by_category(category_id: i32) -> Result<Vec<Word>, Error>
fn add_word(category_id: i32, word: String, hint: String) -> Result<Word, Error>
fn update_word(id: i32, word: String, hint: String) -> Result<Word, Error>
fn delete_word(id: i32) -> Result<(), Error>
fn get_random_words(category_id: i32, count: usize, exclude_ids: Vec<i32>) -> Result<Vec<Word>, Error>
fn validate_category_for_mode(category_id: i32, mode: String, participant_count: i32) -> Result<bool, Error>
```

**File Commands:**
```rust
#[tauri::command]
fn export_category_json(category_id: i32, path: String) -> Result<(), Error>
fn import_category_json(path: String) -> Result<ImportResult, Error>
fn backup_database(path: String) -> Result<(), Error>
fn restore_database(path: String) -> Result<(), Error>
```

**Settings Commands:**
```rust
#[tauri::command]
fn get_settings() -> Result<HashMap<String, String>, Error>
fn update_setting(key: String, value: String) -> Result<(), Error>
```

**Game History Commands:**
```rust
#[tauri::command]
fn save_game_result(game_data: GameData, participants: Vec<ParticipantData>, word_results: Vec<WordResult>) -> Result<i32, Error>
fn get_game_history(filters: Option<Filters>, pagination: Option<Pagination>) -> Result<Vec<GameHistory>, Error>
fn get_game_detail(game_id: i32) -> Result<GameDetail, Error>
fn get_game_statistics() -> Result<Statistics, Error>
fn export_game_history_json(path: String) -> Result<(), Error>
fn delete_game_history(game_id: i32) -> Result<(), Error>
fn delete_all_game_history() -> Result<(), Error>
```

**Error Types (PRD 14.2):**
```rust
#[derive(Debug, serde::Serialize)]
enum AppError {
    DatabaseError(String),
    ValidationError(String),
    NotFoundError(String),
    DuplicateError(String),
    FileSystemError(String),
}
```

**Related Files:**
- `src-tauri/src/commands/` - Command modules
- `src-tauri/src/models/` - Data models
- `src-tauri/src/errors.rs` - Error types

---

## 🧩 Implementation Steps
Step-by-step guide on how to implement this task.

1. Create command module structure in `src-tauri/src/commands/`
2. Create data models (Category, Word, GameHistory, etc.) in `src-tauri/src/models/`
3. Implement error types and error handling in `src-tauri/src/errors.rs`
4. Implement category commands (CRUD + validation)
5. Implement word commands including get_random_words algorithm
6. Implement validation logic for category playability
7. Implement file commands using Tauri File System API
8. Implement JSON export/import with proper formatting
9. Implement settings commands
10. Implement game history save command with transaction support
11. Implement game history query commands with filtering and pagination
12. Implement statistics calculation command
13. Register all commands in `src-tauri/src/main.rs`
14. Add comprehensive error handling to all commands
15. Test each command from frontend

---

## ✅ Acceptance Criteria
What conditions must be met for this task to be considered complete?

- All category commands implemented and working
- All word commands implemented and working
- get_random_words returns exactly 14 words (2 per letter length 4-10)
- get_random_words excludes already selected words in multiplayer mode
- validate_category_for_mode correctly checks word requirements
- All file commands implemented with Tauri File System API
- JSON export/import format matches PRD specification
- All settings commands implemented
- All game history commands implemented
- save_game_result uses transactions for data consistency
- All commands properly exposed to frontend via Tauri
- All error types implemented with user-friendly messages
- Error handling returns proper Error enum variants
- Commands return proper Result types
- All commands compile without warnings
- Frontend can successfully invoke all commands

---

## 🧪 Test Scenarios
Test steps for each acceptance criterion.

| Test No | Scenario | Expected Result |
|----------|----------|----------------|
| T-001 | Call get_all_categories | Returns all categories array |
| T-002 | Call create_category with valid data | Category created and returned |
| T-003 | Call create_category with duplicate name | Returns DuplicateError |
| T-004 | Call delete_category on default category | Returns ValidationError or prevented |
| T-005 | Call get_random_words for single player | Returns exactly 14 words (2 per length) |
| T-006 | Call get_random_words with exclude_ids | Excluded words not in result |
| T-007 | Call validate_category_for_mode (single, 14 words) | Returns true (playable) |
| T-008 | Call validate_category_for_mode (multi, 2 players, 20 words) | Returns false (need 28 words) |
| T-009 | Call export_category_json | JSON file created with correct format |
| T-010 | Call import_category_json with valid file | Words imported successfully |
| T-011 | Call import_category_json with invalid JSON | Returns FileSystemError or ValidationError |
| T-012 | Call save_game_result | Game saved with all participants and word results |
| T-013 | Call get_game_history | Returns filtered and paginated results |
| T-014 | Call get_game_statistics | Returns correct aggregated statistics |
| T-015 | Call update_setting | Setting value updated in database |
| T-016 | Call command with invalid ID | Returns NotFoundError |

---

## 🔗 Dependencies
Other tasks that must be completed before this task can start, or required system resources.

- `02-database-schema-setup.md` must be completed (database schema ready)
- `03-initial-data-seeding.md` must be completed (test data available)

---

## 📄 Deliverables
List of concrete outputs that will be produced when task is completed.

- `src-tauri/src/commands/category.rs` - Category commands
- `src-tauri/src/commands/word.rs` - Word commands
- `src-tauri/src/commands/file.rs` - File operation commands
- `src-tauri/src/commands/settings.rs` - Settings commands
- `src-tauri/src/commands/game_history.rs` - Game history commands
- `src-tauri/src/commands/mod.rs` - Command module exports
- `src-tauri/src/models/` - Data model definitions
- `src-tauri/src/errors.rs` - Error types and conversions
- All commands registered in main.rs
- Type definitions for frontend (TypeScript types)

---

## 🧭 Notes
Information that helps understand the process but is not directly part of PRD.

> The get_random_words algorithm must ensure 2 words from each letter length (4-10) are selected randomly.

> Use transactions for operations that modify multiple tables (e.g., save_game_result).

> Tauri commands automatically serialize Result types to JSON for the frontend.

> Consider creating a database connection pool for better performance.

> JSON export format should include category metadata and all words for easy sharing.

> The exclude_ids parameter in get_random_words is critical for multiplayer mode to ensure each player gets unique words.

---

## 📚 References
- [PRD Document - Section 14: Tauri Backend Operations](../docs/PRD.md#14-tauri-backend-i̇şlemleri)
- [PRD Document - Section 14.1: Tauri Commands](../docs/PRD.md#141-tauri-commands-rust)
- [PRD Document - Section 14.2: Error Management](../docs/PRD.md#142-hata-yönetimi)
- [Tauri Commands Documentation](https://tauri.app/v1/guides/features/command)

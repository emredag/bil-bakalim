# Database Schema Setup
> PRD Reference: Section 2.4 - Database Structure (SQLite)
> Category: Backend
> Status: Not Started
> Priority: High
> Estimated Time: 6 hours

---

## 🎯 Objective
Create the complete SQLite database schema with all required tables, indexes, foreign key constraints, and check constraints as defined in the PRD. This task establishes the data persistence layer for categories, words, settings, and game history.

The database must be stored in the user's application data directory and support all game modes (single player, multiplayer, and team) with comprehensive game history tracking.

---

## 🧾 Requirements
All mandatory work items within this task, as defined in the PRD.

- PRD 2.4: Database must be SQLite stored in user data directory (`$APPDATA`, `~/.local/share`, etc.)
- PRD 2.4: Create `categories` table with fields: id, name, emoji, description, is_default, created_at, updated_at
- PRD 2.4: Create `words` table with fields: id, category_id (FK), word, letter_count, hint, created_at
- PRD 2.4: Create `settings` table with fields: key (PK), value
- PRD 2.4: Create `game_history` table with fields: id, category_id (FK), category_name, game_mode, played_at, total_time_seconds, created_at
- PRD 2.4: Create `game_participants` table with fields: id, game_history_id (FK), participant_name, participant_type, score, words_found, words_skipped, letters_revealed, rank, created_at
- PRD 2.4: Create `game_word_results` table with fields: id, game_history_id (FK), participant_id (FK), word, word_hint, result, points_earned, letters_used, created_at
- PRD 2.4: Implement CHECK constraint on words.letter_count BETWEEN 4 AND 10
- PRD 2.4: Implement all foreign key relationships
- PRD 13.2: Create indexes for performance optimization

---

## ⚙️ Technical Details
Technical scope of the task as per PRD.

**Technology:**
- SQLite database
- Rust with rusqlite crate
- Database location: Platform-specific user data directory

**Database Tables Schema:**

**categories:**
```sql
id              INTEGER PRIMARY KEY AUTOINCREMENT
name            TEXT NOT NULL
emoji           TEXT
description     TEXT
is_default      BOOLEAN DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

**words:**
```sql
id              INTEGER PRIMARY KEY AUTOINCREMENT
category_id     INTEGER NOT NULL FOREIGN KEY REFERENCES categories(id)
word            TEXT NOT NULL
letter_count    INTEGER NOT NULL CHECK (letter_count BETWEEN 4 AND 10)
hint            TEXT NOT NULL
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

**settings:**
```sql
key             TEXT PRIMARY KEY
value           TEXT
```

**game_history:**
```sql
id                  INTEGER PRIMARY KEY AUTOINCREMENT
category_id         INTEGER FOREIGN KEY REFERENCES categories(id)
category_name       TEXT NOT NULL
game_mode           TEXT NOT NULL
played_at           DATETIME NOT NULL
total_time_seconds  INTEGER
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

**game_participants:**
```sql
id                  INTEGER PRIMARY KEY AUTOINCREMENT
game_history_id     INTEGER NOT NULL FOREIGN KEY REFERENCES game_history(id)
participant_name    TEXT NOT NULL
participant_type    TEXT NOT NULL
score               INTEGER DEFAULT 0
words_found         INTEGER DEFAULT 0
words_skipped       INTEGER DEFAULT 0
letters_revealed    INTEGER DEFAULT 0
rank                INTEGER
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

**game_word_results:**
```sql
id                  INTEGER PRIMARY KEY AUTOINCREMENT
game_history_id     INTEGER NOT NULL FOREIGN KEY REFERENCES game_history(id)
participant_id      INTEGER FOREIGN KEY REFERENCES game_participants(id)
word                TEXT NOT NULL
word_hint           TEXT
result              TEXT NOT NULL
points_earned       INTEGER DEFAULT 0
letters_used        INTEGER DEFAULT 0
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Indexes (PRD 13.2):**
- `idx_words_category` ON words(category_id)
- `idx_words_letter_count` ON words(letter_count)
- `idx_game_history_played_at` ON game_history(played_at)
- `idx_game_history_category` ON game_history(category_id)
- `idx_game_participants_game` ON game_participants(game_history_id)
- `idx_game_word_results_game` ON game_word_results(game_history_id)

**Enum Values:**
- game_mode: "single" | "multi" | "team"
- participant_type: "player" | "team"
- result: "found" | "skipped" | "timeout"

---

## 🧩 Implementation Steps
Step-by-step guide on how to implement this task.

1. Create database initialization module in `src-tauri/src/db/mod.rs`
2. Implement database connection function to user data directory
3. Create migration script for `categories` table with all fields and constraints
4. Create migration script for `words` table with foreign key to categories
5. Add CHECK constraint on `letter_count` field (4-10 range)
6. Create migration script for `settings` table
7. Create migration script for `game_history` table
8. Create migration script for `game_participants` table
9. Create migration script for `game_word_results` table
10. Create all indexes for query performance optimization
11. Implement foreign key enforcement (PRAGMA foreign_keys = ON)
12. Create database initialization function that runs all migrations
13. Add error handling for database operations
14. Test database creation and schema validation
15. Document database schema in code comments

---

## ✅ Acceptance Criteria
What conditions must be met for this task to be considered complete?

- All six tables created with correct schema
- All foreign key constraints properly implemented and enforced
- CHECK constraint on words.letter_count working correctly (4-10 range)
- All indexes created successfully
- Database file created in correct platform-specific location
- Database initialization runs without errors on first app launch
- Foreign keys are enforced (PRAGMA foreign_keys = ON)
- All datetime fields use CURRENT_TIMESTAMP default
- All default values applied correctly
- Database schema documented in code
- Connection pooling or proper connection management implemented
- Error handling for database failures implemented

---

## 🧪 Test Scenarios
Test steps for each acceptance criterion.

| Test No | Scenario | Expected Result |
|----------|----------|----------------|
| T-001 | Initialize database on first run | All tables created successfully |
| T-002 | Insert category without name | Error: NOT NULL constraint failed |
| T-003 | Insert word with letter_count = 3 | Error: CHECK constraint failed |
| T-004 | Insert word with letter_count = 11 | Error: CHECK constraint failed |
| T-005 | Insert word with letter_count = 7 | Success: Word inserted |
| T-006 | Delete category referenced by words | Error: Foreign key constraint (or cascade delete works) |
| T-007 | Query words by category_id | Fast query using index |
| T-008 | Insert setting with duplicate key | Error or update based on PRIMARY KEY |
| T-009 | Verify database file location | File exists in platform-specific user data directory |
| T-010 | Insert game history with all fields | All fields saved correctly with defaults |
| T-011 | Query game history ordered by date | Fast query using played_at index |
| T-012 | Insert participant without game_history_id | Error: Foreign key constraint |

---

## 🔗 Dependencies
Other tasks that must be completed before this task can start, or required system resources.

- `01-project-setup.md` must be completed (Tauri and Rust environment ready)
- rusqlite dependency must be installed in Cargo.toml

---

## 📄 Deliverables
List of concrete outputs that will be produced when task is completed.

- `src-tauri/src/db/mod.rs` - Database module
- `src-tauri/src/db/schema.rs` - Schema definitions and migrations
- `src-tauri/src/db/connection.rs` - Database connection management
- SQLite database file in user data directory (created on first run)
- Database initialization code
- Schema documentation comments
- Migration scripts for all tables
- Index creation scripts

---

## 🧭 Notes
Information that helps understand the process but is not directly part of PRD.

> Ensure PRAGMA foreign_keys = ON is set for every database connection to enforce referential integrity.

> Use transactions for migrations to ensure atomic schema updates.

> The database file should be named `word-game.db` or similar.

> Consider implementing database version tracking for future schema migrations.

> Platform-specific paths:
> - Windows: `%APPDATA%\com.wordgame.app\word-game.db`
> - macOS: `~/Library/Application Support/com.wordgame.app/word-game.db`
> - Linux: `~/.local/share/bil-bakalim/word-game.db`

---

## 📚 References
- [PRD Document - Section 2.4: Database Structure](../docs/PRD.md#24-veritabanı-yapısı-sqlite)
- [PRD Document - Section 13.2: Database Schema](../docs/PRD.md#132-veritabanı-schema)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [rusqlite Documentation](https://docs.rs/rusqlite/)

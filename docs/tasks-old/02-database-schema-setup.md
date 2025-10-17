# Task 02: Database Schema Setup

## Description
Create SQLite database schema with all required tables, indexes, and constraints.

## Requirements from PRD
- **Section:** 2.4 Veritabanı Yapısı (SQLite)
- **Section:** 13. VERİTABANI MİGRASYONU VE İLK KURULUM → 13.2 Veritabanı Schema

## Database Tables

### categories
- id (INTEGER PRIMARY KEY)
- name (TEXT NOT NULL)
- emoji (TEXT)
- description (TEXT)
- is_default (BOOLEAN DEFAULT 0)
- created_at (DATETIME)
- updated_at (DATETIME)

### words
- id (INTEGER PRIMARY KEY)
- category_id (INTEGER FOREIGN KEY)
- word (TEXT NOT NULL)
- letter_count (INTEGER NOT NULL)
- hint (TEXT NOT NULL)
- created_at (DATETIME)
- CHECK (letter_count BETWEEN 4 AND 10)

### settings
- key (TEXT PRIMARY KEY)
- value (TEXT)

### game_history
- id (INTEGER PRIMARY KEY)
- category_id (INTEGER FOREIGN KEY)
- category_name (TEXT NOT NULL)
- game_mode (TEXT NOT NULL)
- played_at (DATETIME NOT NULL)
- total_time_seconds (INTEGER)
- created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

### game_participants
- id (INTEGER PRIMARY KEY)
- game_history_id (INTEGER FOREIGN KEY)
- participant_name (TEXT NOT NULL)
- participant_type (TEXT NOT NULL)
- score (INTEGER DEFAULT 0)
- words_found (INTEGER DEFAULT 0)
- words_skipped (INTEGER DEFAULT 0)
- letters_revealed (INTEGER DEFAULT 0)
- rank (INTEGER)
- created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

### game_word_results
- id (INTEGER PRIMARY KEY)
- game_history_id (INTEGER FOREIGN KEY)
- participant_id (INTEGER FOREIGN KEY)
- word (TEXT NOT NULL)
- word_hint (TEXT)
- result (TEXT NOT NULL)
- points_earned (INTEGER DEFAULT 0)
- letters_used (INTEGER DEFAULT 0)
- created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

## Indexes
- idx_words_category ON words(category_id)
- idx_words_letter_count ON words(letter_count)
- idx_game_history_played_at ON game_history(played_at)
- idx_game_history_category ON game_history(category_id)
- idx_game_participants_game ON game_participants(game_history_id)
- idx_game_word_results_game ON game_word_results(game_history_id)

## Acceptance Criteria
- [ ] All tables created with correct schema
- [ ] Foreign key constraints implemented
- [ ] Check constraints applied
- [ ] All indexes created
- [ ] Database file location: `$APPDATA`, `~/.local/share`, vb.

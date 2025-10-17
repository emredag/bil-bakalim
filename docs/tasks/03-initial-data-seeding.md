# Initial Data Seeding
> PRD Reference: Section 12 - Initial Data, Section 13.3 - Default Data Insertion
> Category: Setup
> Status: Not Started
> Priority: High
> Estimated Time: 3 hours

---

## 🎯 Objective
Populate the database with the default "Genel Kelimeler" category containing exactly 70 words (10 words for each letter length from 4-10), and insert default application settings as specified in the PRD.

This task ensures users have a ready-to-play category immediately upon first launch, providing a complete initial experience for the word game.

---

## 🧾 Requirements
All mandatory work items within this task, as defined in the PRD.

- PRD 12.1: Create default category "Genel Kelimeler" with emoji 📦
- PRD 12.1: Category description: "Günlük yaşamda sık kullanılan genel kelimeler - İngilizce öğrenimi için temel kelimeler"
- PRD 12.1: Set category as default (is_default = true)
- PRD 12.1: Insert exactly 70 words with correct distribution:
  - 10 words with 4 letters
  - 10 words with 5 letters
  - 10 words with 6 letters
  - 10 words with 7 letters
  - 10 words with 8 letters
  - 10 words with 9 letters
  - 10 words with 10 letters
- PRD 12.1: Each word must have Turkish hint/description
- PRD 13.3: Insert default settings (sound_enabled, default_time, default_guesses, animation_speed)
- PRD 3.2: Default category cannot be deleted (is_default flag prevents deletion)

---

## ⚙️ Technical Details
Technical scope of the task as per PRD.

**Technology:**
- Rust backend with rusqlite
- SQLite database
- Seed data executed on first launch

**Default Category:**
- Name: "Genel Kelimeler"
- Emoji: 📦
- Description: "Günlük yaşamda sık kullanılan genel kelimeler - İngilizce öğrenimi için temel kelimeler"
- is_default: true

**Word Distribution (Total 70 words):**
Each letter count (4-10) has exactly 10 words:
- 4-letter: BOOK, GAME, TIME, LOVE, MEAL, ROAD, COLD, WORD, ROOM, RAIN
- 5-letter: DANCE, WATCH, STUDY, BREAD, MUSIC, DREAM, APPLE, CHAIR, SPORT, WATER
- 6-letter: SCHOOL, TRAVEL, NATURE, ANIMAL, MOTHER, FATHER, FRIEND, FAMILY, SUMMER, WINTER
- 7-letter: SUBJECT, CULTURE, TEACHER, STUDENT, COUNTRY, HOLIDAY, PICTURE, PROJECT, LIBRARY, MORNING
- 8-letter: LANGUAGE, HOMEWORK, HOSPITAL, EXERCISE, COMPUTER, BUILDING, LEARNING, QUESTION, SUNSHINE, NOTEBOOK
- 9-letter: VOLUNTEER, INTERVIEW, EDUCATION, ADVENTURE, YESTERDAY, AFTERNOON, DANGEROUS, APARTMENT, KNOWLEDGE, CAREFULLY
- 10-letter: TECHNOLOGY, TELEVISION, DICTIONARY, POPULATION, DIFFERENCE, UNIVERSITY, IMPORTANCE, SMARTPHONE, GOVERNMENT, BASKETBALL

**Default Settings:**
```
sound_enabled: "true"
default_time: "300"
default_guesses: "3"
animation_speed: "normal"
```

**Related Files:**
- `src-tauri/src/db/seed.rs` - Seed data logic
- `src-tauri/src/db/data/default_words.rs` - Word list data

---

## 🧩 Implementation Steps
Step-by-step guide on how to implement this task.

1. Create seed module in `src-tauri/src/db/seed.rs`
2. Create data file with all 70 words and hints from PRD Section 12.1
3. Implement function to check if database is already seeded
4. Implement function to insert default category "Genel Kelimeler"
5. Implement function to insert all 70 words in a transaction
6. Implement function to insert default settings
7. Create seed orchestration function that runs all seed operations
8. Add seed function call to database initialization (runs only on first launch)
9. Add verification to ensure exactly 10 words per letter count
10. Test seeding with fresh database
11. Test that seeding is skipped if data already exists
12. Verify default category is marked as is_default = true

---

## ✅ Acceptance Criteria
What conditions must be met for this task to be considered complete?

- Default category "Genel Kelimeler" created with correct name, emoji, and description
- Category marked as is_default = true
- Exactly 70 words inserted
- Each letter count (4-10) has exactly 10 words
- All words have correct Turkish hints as specified in PRD 12.1
- All word letter_count values are correct
- Default settings inserted (sound_enabled, default_time, default_guesses, animation_speed)
- Seeding only runs on first launch (check prevents duplicate seeding)
- Seeding is wrapped in transaction (all-or-nothing)
- Database has playable content immediately after first launch
- Category validates as playable for single player mode
- No errors during seeding process

---

## 🧪 Test Scenarios
Test steps for each acceptance criterion.

| Test No | Scenario | Expected Result |
|----------|----------|----------------|
| T-001 | Launch app with fresh database | Default category created |
| T-002 | Query categories table | "Genel Kelimeler" exists with is_default = 1 |
| T-003 | Count words in default category | Exactly 70 words returned |
| T-004 | Count 4-letter words | Exactly 10 words with letter_count = 4 |
| T-005 | Count 5-letter words | Exactly 10 words with letter_count = 5 |
| T-006 | Count 6-letter words | Exactly 10 words with letter_count = 6 |
| T-007 | Count 7-letter words | Exactly 10 words with letter_count = 7 |
| T-008 | Count 8-letter words | Exactly 10 words with letter_count = 8 |
| T-009 | Count 9-letter words | Exactly 10 words with letter_count = 9 |
| T-010 | Count 10-letter words | Exactly 10 words with letter_count = 10 |
| T-011 | Query word "BOOK" | Returns with hint "Kitap - okumak için kullanılan basılı eser" |
| T-012 | Query settings table | All 4 default settings exist |
| T-013 | Launch app second time | Seeding skipped, no duplicates |
| T-014 | Validate category for single mode | Returns playable (14+ words available) |

---

## 🔗 Dependencies
Other tasks that must be completed before this task can start, or required system resources.

- `02-database-schema-setup.md` must be completed (database tables exist)
- Database connection initialized

---

## 📄 Deliverables
List of concrete outputs that will be produced when task is completed.

- `src-tauri/src/db/seed.rs` - Main seeding module
- `src-tauri/src/db/data/default_words.rs` - Complete word list with hints
- Seeding function integrated into database initialization
- Default category in database (on first launch)
- 70 words in database
- 4 default settings in database

---

## 🧭 Notes
Information that helps understand the process but is not directly part of PRD.

> All 70 words and their exact Turkish hints are specified in PRD Section 12.1. Copy them precisely.

> Use a transaction to ensure all-or-nothing insertion. If any word fails, roll back entire seeding.

> Consider storing word data as static arrays in Rust for compile-time verification.

> The seeding should be idempotent - running it multiple times should not create duplicates.

> Verify word uniqueness constraint works by attempting to insert duplicate words.

---

## 📚 References
- [PRD Document - Section 12.1: Initial Words (Genel Kelimeler)](../docs/PRD.md#121-genel-kelimeler-kategorisi-70-kelime)
- [PRD Document - Section 13.3: Default Data Insertion](../docs/PRD.md#133-varsayılan-veri-ekleme)
- [PRD Document - Section 3.2: Default Category](../docs/PRD.md#32-varsayılan-kategori)

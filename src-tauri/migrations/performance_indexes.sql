-- Performance Optimization - Task 40
-- PRD Section 2.3 - Database Query Optimization
-- Add indexes to frequently queried columns

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_is_default ON categories(is_default);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at DESC);

-- Words table indexes  
CREATE INDEX IF NOT EXISTS idx_words_category_id ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_words_letter_count ON words(letter_count);
CREATE INDEX IF NOT EXISTS idx_words_category_letter ON words(category_id, letter_count);

-- Game history indexes
CREATE INDEX IF NOT EXISTS idx_game_history_category_id ON game_history(category_id);
CREATE INDEX IF NOT EXISTS idx_game_history_played_at ON game_history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_history_game_mode ON game_history(game_mode);

-- Game participants indexes
CREATE INDEX IF NOT EXISTS idx_game_participants_game_id ON game_participants(game_history_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_type ON game_participants(participant_type);
CREATE INDEX IF NOT EXISTS idx_game_participants_rank ON game_participants(rank);

-- Game word results indexes
CREATE INDEX IF NOT EXISTS idx_game_word_results_game_id ON game_word_results(game_history_id);
CREATE INDEX IF NOT EXISTS idx_game_word_results_participant_id ON game_word_results(participant_id);
CREATE INDEX IF NOT EXISTS idx_game_word_results_result ON game_word_results(result);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_game_history_category_date ON game_history(category_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_word_results_game_participant ON game_word_results(game_history_id, participant_id);

-- Analyze tables for query optimizer
ANALYZE categories;
ANALYZE words;
ANALYZE game_history;
ANALYZE game_participants;
ANALYZE game_word_results;
ANALYZE settings;

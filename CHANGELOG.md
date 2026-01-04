# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Version Management**: Centralized version control to single source (package.json)
  - `tauri.conf.json` now reads version from package.json automatically
  - `versionService.ts` uses build-time injection via Vite
  - Added `sync-version` script to synchronize Cargo.toml
  - Removed all hardcoded version strings

## [1.3.0] - 2025-01-27

### Added
- **Automatic Update Checking**: Check for new versions from GitHub Releases
  - New `versionService.ts` for GitHub API integration
  - `UpdateNotification` modal with platform-specific download links
  - Manual version check button in Settings
- **Settings Reset**: Reset all settings to default values with confirmation dialog
- **Developer Info Section**: Added developer credits and version links to Settings

### Changed
- **Back Buttons**: Refactored to icon-only buttons with aria-labels for accessibility
- **Export File Naming**: Changed prefix from "tahmin-oyunu" to "bil-bakalim"
- **Default Effects Volume**: Changed default from 80 to 100

### Fixed
- **Database Table Names**: Corrected table names in reset_all_data function
  - `game_history_words` → `game_word_results`
  - `game_history_participants` → `game_participants`

### Documentation
- **How to Play Screen**: Complete rewrite with new game mechanics
  - Dynamic timer values from settings
  - Updated game flow explanation for normal/guess modes
  - Improved keyboard shortcuts documentation
  - Enhanced scoring explanation with penalty formula

## [1.2.0] - 2025-12-28

### Added
- **Guess Mode (Tahmin Modu)**: Brand new dual-timer game mechanic
  - "Tahmin Et" button enters guess mode with a configurable countdown timer (default 30s)
  - Global game timer pauses during guess mode
  - "Doğru/Yanlış" buttons for host to mark correct/wrong answers
  - Wrong guesses now apply negative scoring (same point value deducted)
  - Timeout automatically marks answer as wrong with penalty
- **Configurable Timer Settings**: New settings for game customization
  - Game duration setting (default 300 seconds / 5 minutes)
  - Guess timer duration setting (default 30 seconds)
  - Show/hide game buttons option for projection mode
- **JSON Import for Categories**: Import words from JSON files into categories
  - Category selection modal for import target
  - Duplicate word detection and skip
  - Success/error feedback with toast notifications
- **DataTable Row Click Handler**: Click table rows to navigate (category management)
- **Game Rules Documentation**: Added detailed documentation for guess mode mechanics

### Changed
- **CircularTimer Component**: Enhanced with multiple sizes (sm/md/lg), pause state, and accent colors
- **ControlPanel Component**: Complete redesign for two-mode operation (normal/guess)
- **GameHeader Component**: Added guess mode visual indicator with amber border
- **Button Component**: Added `icon` prop for consistent icon placement (refactored across app)
- **QuickActionsMenu**: Rendered as portal to fix dropdown overflow clipping issues
- **Results Screens**: Added wrong guess tracking with negative score display
- **Session Tracker Utility**: Added for preventing duplicate saves and memory leaks

### Fixed
- **Turkish Unicode Letter Counting**: Backend now uses `chars().count()` for proper ş, ğ, ü, ö, ç, ı, İ handling
- **Navigation Race Condition**: Delayed resetGame in results screens to prevent redirect issues
- **Game Setup Cleanup**: Clear form data on back navigation from participant setup
- **Input Icon Padding**: Improved icon alignment in Input component
- **PauseOverlay Button Text**: Updated to clearer Turkish labels

### Technical
- Added `words_wrong` field to GameParticipant and ParticipantData types
- Added `guessTimeRemaining`, `isGuessing` state to game store
- Implemented `startGuess`, `guessTimerTick`, `handleGuessTimeout`, `endGuessMode` actions
- Added `WordResult` type with 'wrong' and 'timeout' values
- HeroSection simplified by removing unused onManageCategories prop

## [1.1.0] - 2025-11-28

### Fixed
- **Game Rules Implementation**: Fixed winner determination algorithm to follow official game rules
  - Ranking now correctly uses: Score → Letters Revealed (fewer wins) → Time (faster wins)
  - Previously incorrect tiebreaker logic (words found) has been replaced
- **Elapsed Time Tracking**: Added missing `elapsed_time_seconds` field to database
  - Created database migration for `game_participants` table
  - Updated backend models and commands to save/retrieve player times
  - Fixed issue where time data was not persisted to game history

### Added
- **Enhanced Result Pages**: Added time column to all result displays
  - ResultsMultiplayer: Shows individual player times in rankings
  - ResultsTeamMode: Shows team completion times
  - GameHistoryDetailScreen: Time data now visible in history details
- **Mode-Specific History UI**: Differentiated game history detail screens by mode
  - Single Player: Performance-focused layout with success theme (green)
  - Multiplayer: Competitive layout with ranking emphasis and primary theme (blue)
  - Team Mode: Team-focused layout with secondary theme (purple)
  - Each mode now has distinct visual identity following design system

### Changed
- **History Detail UX**: Improved visual hierarchy and information architecture
  - Removed "Rank" column from single player view (not applicable)
  - Added mode-specific headers with emojis and descriptions
  - Enhanced winner highlighting with mode-appropriate colors
  - Fixed time display for multiplayer/team modes (was showing total, now shows "In Table")

### Technical
- Backend: Added `elapsed_time_seconds INTEGER` column to `game_participants` table
- Frontend: Updated TypeScript types to include optional `elapsed_time_seconds` field
- Database: Implemented idempotent migration with backward compatibility
- UI: Applied design system color tokens consistently across all history views

## [1.0.1] - 2025-11-27

### Changed
- Updated to current brand logo (converted from PNG to SVG)
- Added logo to main "Bil Bakalım" title with rounded corners
- Removed logo from "Yeni Yarışma Başlat" button

### Fixed
- Fixed scroll issues across all screens (14+ screens updated)
- Improved WelcomeScreen responsiveness and centering
- Applied consistent `min-h-screen overflow-y-auto` pattern throughout the app

## [1.0.0] - 2025-11-27

### Initial Release

#### Features
- **Interactive Word Guessing Game**: Turkish word guessing game with letter reveal mechanics
- **Multiple Game Modes**: 
  - Single Player: Solo gameplay experience
  - Multiplayer: Compete with friends
  - Team Mode: Collaborative team gameplay
- **Category System**: 50+ pre-loaded categories with 3000+ Turkish words
- **Rich UI Components**: 
  - Modern design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Professional sound effects
- **Game Mechanics**:
  - Letter-by-letter reveal system
  - Skip functionality
  - Pause system
  - Scoring system
  - Timer system
- **Data Management**:
  - SQLite database with rusqlite
  - Category management
  - Word management
  - Game history tracking
- **Cross-Platform**: Desktop app for Windows, macOS, and Linux using Tauri 2.x

#### Technical Stack
- **Frontend**: React 18.3.1 + TypeScript 5.6.2
- **Backend**: Rust with Tauri 2.x
- **Database**: SQLite with rusqlite 0.32
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS 4.0.1
- **Animations**: Framer Motion 12.1.0
- **Build Tool**: Vite 6.0.3

---

**Note:** For detailed development tasks, see `docs/tasks/` directory.

[1.2.0]: https://github.com/emredag/bil-bakalim/releases/tag/v1.2.0
[1.1.0]: https://github.com/emredag/bil-bakalim/releases/tag/v1.1.0
[1.0.1]: https://github.com/emredag/bil-bakalim/releases/tag/v1.0.1
[1.0.0]: https://github.com/emredag/bil-bakalim/releases/tag/v1.0.0

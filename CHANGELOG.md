# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/emredag/bil-bakalim/releases/tag/v1.1.0
[1.0.1]: https://github.com/emredag/bil-bakalim/releases/tag/v1.0.1
[1.0.0]: https://github.com/emredag/bil-bakalim/releases/tag/v1.0.0

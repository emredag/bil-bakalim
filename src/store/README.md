# State Management - Task 36

## Overview

This module implements global state management using **Zustand** for the Word Game application, as specified in PRD Section 2.1.

## Architecture

The state management system is divided into three main stores:

### 1. Game Store (`gameStore.ts`)
Manages active game session state including:
- Current game configuration and mode (single/multi/team)
- Participants and their progress
- Timer and scoring system
- Word selection and letter reveal state
- Game lifecycle (play, pause, resume, end)

**Key Features:**
- Handles all game mechanics (reveal letters, submit guess, skip word)
- Enforces PRD rules (e.g., cannot reveal letters after guessing)
- Manages 5-minute total timer for all 14 words
- Tracks participant scores and statistics

### 2. Settings Store (`settingsStore.ts`)
Manages application settings with localStorage persistence:
- Sound and volume controls
- Theme preferences (dark/light)
- Language selection (tr/en)
- Tutorial and hints visibility
- Auto-persists to localStorage

**Key Features:**
- Zustand persist middleware for automatic saving
- Type-safe settings with validation
- Default settings fallback
- Batch update support

### 3. Category Store (`categoryStore.ts`)
Manages category and word data with in-memory caching:
- Category list cache
- Selected category words
- Validation results cache
- Loading and error states

**Key Features:**
- Reduces backend calls with smart caching
- Invalidates cache when data changes
- Supports CRUD operations on categories and words
- Validation result memoization

## Type System

Complete TypeScript definitions in `src/types/`:

- **`database.ts`**: Backend data models (Category, Word, GameHistory, etc.)
- **`game.ts`**: Game-specific types (GameSession, GameWord, Participant, etc.)
- **`settings.ts`**: Settings configuration with defaults

## Usage Examples

### Game Store

```typescript
import { useGameStore } from '@/store';

function GameScreen() {
  const { session, startGame, revealLetter, pauseGame } = useGameStore();
  
  // Start a new game
  const handleStart = () => {
    startGame(config, words);
  };
  
  // Reveal a letter
  const handleRevealLetter = () => {
    revealLetter(participantIndex, wordIndex, letterIndex);
  };
  
  return (
    <div>
      <p>Time: {session?.elapsedTimeSeconds}</p>
      <p>Score: {session?.participants[0].score}</p>
    </div>
  );
}
```

### Settings Store

```typescript
import { useSettingsStore } from '@/store';

function SettingsScreen() {
  const { soundEnabled, setSoundEnabled, musicVolume, setMusicVolume } = useSettingsStore();
  
  return (
    <div>
      <input 
        type="checkbox" 
        checked={soundEnabled}
        onChange={(e) => setSoundEnabled(e.target.checked)}
      />
      <input 
        type="range" 
        value={musicVolume}
        onChange={(e) => setMusicVolume(Number(e.target.value))}
      />
    </div>
  );
}
```

### Category Store

```typescript
import { useCategoryStore } from '@/store';

function CategoryList() {
  const { categories, selectCategory, selectedCategoryId } = useCategoryStore();
  
  return (
    <ul>
      {categories.map(cat => (
        <li 
          key={cat.id}
          onClick={() => selectCategory(cat.id)}
          className={selectedCategoryId === cat.id ? 'active' : ''}
        >
          {cat.emoji} {cat.name}
        </li>
      ))}
    </ul>
  );
}
```

## State Flow

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
│  (Subscribe to stores via hooks, trigger actions)       │
└──────────────────┬────────────────────┬─────────────────┘
                   │                    │
                   ▼                    ▼
         ┌─────────────────┐  ┌─────────────────┐
         │   Game Store    │  │ Settings Store  │
         │   (Session)     │  │  (Persisted)    │
         └─────────────────┘  └─────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ Category Store  │
         │   (Cache)       │
         └─────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  Tauri Backend  │
         │   (SQLite DB)   │
         └─────────────────┘
```

## PRD Compliance

✅ **Section 2.1 - Technology Stack**
- Using Zustand for state management
- TypeScript for type safety
- React 18+ hooks integration

✅ **Section 4.6 - Game Mechanics**
- Implements all game rules (reveal, guess, skip)
- Enforces "no letters after guess" rule
- 5-minute timer for all 14 words
- Scoring system with penalties

✅ **Section 3 - Category System**
- Category validation caching
- Word management by category
- Multi-mode support (single/multi/team)

## Testing

Run the store integration tests:

```bash
# In browser console after clicking "🧪 Test Stores" button
# Or programmatically:
import { runStoreTests } from '@/test-stores';
runStoreTests();
```

Tests cover:
- Settings persistence and updates
- Category CRUD operations and caching
- Game lifecycle and mechanics
- State immutability
- Type safety

## DevTools

Zustand DevTools integration is enabled in development:
- Install Redux DevTools Extension for Chrome/Firefox
- Open DevTools → Redux tab
- See real-time state changes and time-travel debugging

## Performance

- **Minimal re-renders**: Only subscribed components re-render
- **Selector optimization**: Use selectors to avoid unnecessary updates
- **Cache invalidation**: Smart cache clearing on data changes
- **Persist optimization**: Settings auto-save throttled via Zustand middleware

## Future Enhancements

- [ ] Add undo/redo support for game actions
- [ ] Implement game state recovery after crash
- [ ] Add analytics tracking hooks
- [ ] Create store composition utilities
- [ ] Add state migration for schema changes

## References

- PRD Section 2.1: Technology Stack
- PRD Section 2.4: Database Structure
- PRD Section 3: Category System
- PRD Section 4: Game Flow
- Zustand Documentation: https://zustand-demo.pmnd.rs/

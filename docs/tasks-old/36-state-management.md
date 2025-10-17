# Task 36: State Management

## Description
Implement global state management using Zustand or Context API.

## Requirements from PRD
- **Section:** 2.1 Teknoloji Stack → Frontend → Zustand / Context API

## State Stores Required

### Game State
- Current game mode (single/multi/team)
- Selected category
- Participants/teams
- Current word index
- Timer state
- Score state
- Word results
- Game phase (setup/playing/paused/finished)

### Category State
- All categories
- Selected category
- Category validation status

### Settings State
- Sound enabled/disabled
- Sound volume
- Fullscreen on start
- Animation speed

### UI State
- Active screen/route
- Modal states
- Loading states
- Toast notifications

## Acceptance Criteria
- [ ] State management library installed (Zustand or Context API)
- [ ] Game state store implemented
- [ ] Category state store implemented
- [ ] Settings state store implemented
- [ ] UI state store implemented
- [ ] State persists where needed (settings)
- [ ] State updates trigger re-renders correctly
- [ ] No unnecessary re-renders
- [ ] State accessible from all components
- [ ] Actions/mutations clearly defined

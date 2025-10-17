# Task 37: Routing and Navigation

## Description
Implement routing system for navigating between screens.

## Requirements from PRD
Based on all screen sections in Section 4 (OYUN AKIŞI)

## Routes Required
- `/` - Main Menu
- `/category-select` - Category Selection
- `/mode-select` - Game Mode Selection
- `/participant-setup` - Participant/Team Setup
- `/game` - Game Screen
- `/results` - Results Screen
- `/history` - Game History List
- `/history/:id` - Game History Detail
- `/category-management` - Category Management
- `/category/:id/words` - Word Management
- `/settings` - Settings
- `/how-to-play` - How to Play

## Navigation Features
- Back button support
- Route parameters (e.g., game ID, category ID)
- Route guards (prevent navigating to game without setup)
- History management

## Acceptance Criteria
- [ ] Routing library installed (React Router or similar)
- [ ] All routes defined
- [ ] Navigation between screens works
- [ ] Back button navigates correctly
- [ ] Route parameters work
- [ ] Route guards prevent invalid navigation
- [ ] Browser history managed correctly
- [ ] Deep linking works (if applicable)

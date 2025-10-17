# Game Mode Selection
> PRD Reference: Section 4.3 - Game Mode Selection
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 6 hours

---

## 🎯 Objective
Implement game mode selection screen with 3 mode cards (Single, Multiplayer, Team) and validation based on category word count. Disable modes that don't have sufficient words as specified in PRD Section 4.3.

---

## 🧾 Requirements
- PRD 4.3: Display 3 game mode cards: Single Player (👤), Multiplayer (👥), Team (🏆)
- PRD 4.3: Single Player: 1 player, 14 words, timer, score, summary
- PRD 4.3: Multiplayer: 2-6 players, each gets different 14 words, requires (participants × 14) words minimum
- PRD 4.3: Team: 2-4 teams, each team gets different 14 words, requires (teams × 14) words minimum
- PRD 4.3: Mode validation based on category word count
- PRD 4.3: Disabled modes shown dimmed
- PRD 4.3: Warning message for insufficient words ("Bu mod için en az X kelime gerekli")
- PRD 4.3: Mode cards large and visual
- PRD 4.3: Short description + required word count for each mode
- PRD 4.3: Back and Forward buttons

---

## ⚙️ Technical Details
**Technology:** React, TypeScript, Tailwind CSS
**Validation:** validate_category_for_mode command from backend
**Mode Data:** Each mode has minimum word requirement calculation
**UI:** Large cards with icons, disabled state styling, tooltips

---

## 🧩 Implementation Steps
1. Create GameModeSelection page component
2. Receive selected category from previous screen
3. Create ModeCard component with enabled/disabled states
4. Implement Single Player mode card
5. Implement Multiplayer mode card
6. Implement Team mode card
7. Validate each mode against category word count
8. Disable modes with insufficient words
9. Display warning messages for disabled modes
10. Add Back button (to category selection)
11. Wire up Forward button to participant setup
12. Add tooltips explaining requirements

---

## ✅ Acceptance Criteria
- All 3 mode cards displayed prominently
- Single Player mode available if category has 14+ words
- Multiplayer mode disabled if insufficient words for selected participant count
- Team mode disabled if insufficient words for selected team count
- Disabled modes shown dimmed/grayed out
- Warning messages explain word requirements
- Mode selection stores selected mode
- Back button returns to category selection
- Forward button navigates to participant setup
- Mode icons and descriptions displayed correctly

---

## 🧪 Test Scenarios
| Test No | Scenario | Expected Result |
|----------|----------|----------------|
| T-001 | Category with 14 words | Only Single Player enabled |
| T-002 | Category with 42 words | Single and 2-player Multi enabled |
| T-003 | Category with 70 words | All modes enabled |
| T-004 | Click disabled mode | No action, tooltip shows requirement |
| T-005 | Click enabled Single Player | Navigate to participant setup (single) |
| T-006 | Click enabled Multiplayer | Navigate to participant setup (multi) |
| T-007 | Click enabled Team | Navigate to participant setup (team) |
| T-008 | Click Back button | Return to category selection |

---

## 🔗 Dependencies
- `04-tauri-backend-commands.md` (validate_category_for_mode command)
- `09-category-selection-screen.md` (selected category data)
- `29-category-validation.md` (validation logic)

---

## 📄 Deliverables
- `src/pages/GameModeSelection.tsx` - Mode selection page
- `src/components/ModeCard.tsx` - Game mode card component
- `src/utils/modeValidation.ts` - Mode validation utilities

---

## 🧭 Notes
> Mode validation is critical - incorrect validation breaks the game.

> Clear messaging helps users understand why modes are disabled.

> Consider pre-validating all modes simultaneously for better UX.

---

## 📚 References
- [PRD Document - Section 4.3: Mode Selection](../docs/PRD.md#43-mod-seçimi)
- [PRD Document - Section 3.3: Category Validation](../docs/PRD.md#33-kategori-validasyonu)

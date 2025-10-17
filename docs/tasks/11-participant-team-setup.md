# Participant/Team Setup

> PRD Reference: Section 4.4 - Participant/Team Configuration
> See also: [UI/UX Design Spec](../ui-ux-design.md#participant-team-setup)
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 1 day

---

## 🎯 Objective

Implement participant and team setup screens for all three game modes (single, multiplayer, team) allowing users to configure player names, team assignments, and validate word count requirements as specified in PRD Section 4.4.

---

## 🧾 Requirements

- PRD 4.4: Single Player mode: name input + Start button
- PRD 4.4: Multiplayer mode: 2-6 participants with name inputs, add/remove buttons, drag & drop reordering
- PRD 4.4: Team mode: 2-4 teams, each with name, color/emoji, 2-4 players per team with names and order
- PRD 4.4: Word count validation display: "Gerekli kelime: X | Mevcut: Y ✓"
- PRD 4.4: Dynamic add/remove participant buttons
- PRD 4.4: Start button enabled only when requirements met

---

## ⚙️ Technical Details

**Technology:** React, TypeScript, react-beautiful-dnd for drag & drop
**Validation:** Real-time word requirement calculation
**State:** Zustand or Context API for participant data

---

## 🧩 Implementation Steps

1. Create ParticipantSetup page with mode-based rendering
2. Implement Single Player form (name input)
3. Implement Multiplayer form (2-6 participants, add/remove, reorder)
4. Implement Team form (teams, players, colors)
5. Add real-time word count validation
6. Enable/disable Start button based on validation
7. Add drag & drop for player reordering
8. Wire up Start button to game screen
9. Validate all inputs before proceeding

---

## ✅ Acceptance Criteria

- Single mode collects player name
- Multi mode supports 2-6 participants with add/remove
- Team mode supports 2-4 teams with 2-4 players each
- Drag & drop reordering works
- Word count validation displayed accurately
- Start button disabled until valid
- All data passed to game screen correctly

---

## 🧪 Test Scenarios

| Test No | Scenario                       | Expected Result                      |
| ------- | ------------------------------ | ------------------------------------ |
| T-001   | Single mode: enter name        | Start button enabled                 |
| T-002   | Multi mode: add 3 participants | All names collected                  |
| T-003   | Multi mode: remove participant | Participant removed from list        |
| T-004   | Multi mode: drag to reorder    | Order updated                        |
| T-005   | Team mode: create 2 teams      | Teams created with players           |
| T-006   | Insufficient words             | Start button disabled, warning shown |
| T-007   | Click Start with valid data    | Navigate to game screen              |

---

## 🔗 Dependencies

- `10-game-mode-selection.md` (mode selection data)

---

## 📄 Deliverables

- `src/pages/ParticipantSetup.tsx`
- `src/components/ParticipantForm.tsx`
- `src/components/TeamBuilder.tsx`

---

## 🧭 Notes

> Validate participant names are not empty before allowing start.

---

## 📚 References

- [PRD - Section 4.4](../docs/PRD.md#44-yarışmacıtakım-ayarlama)

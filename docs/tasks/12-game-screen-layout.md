# Game Screen Layout

> PRD Reference: Section 4.5 - Game Screen Layout
> See also: [UI/UX Design Spec](../ui-ux-design.md#game-screen)
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 1 day

---

## 🎯 Objective

Implement the main game screen layout optimized for 1920x1080 with header, word area, hint section, control panel, and progress bar as specified in PRD Section 4.5.

---

## 🧾 Requirements

- PRD 4.5: Header (120px): category name/emoji, timer (center, large), score/progress (right), participant name
- PRD 4.5: Word Area (500px, center): letter boxes with closed/open states, 3D flip animation
- PRD 4.5: Hint Section (100px): hint text with 💡 icon, framed
- PRD 4.5: Control Panel (280px): 3 buttons (Reveal Letter, Guess, Skip), info (guesses left, letters used, remaining points), side controls (Pause, Sound, Home)
- PRD 4.5: Progress Bar (60px): word progress "6/14", category description

---

## ⚙️ Technical Details

**Technology:** React, TypeScript, Tailwind CSS, Framer Motion
**Layout:** Fixed height sections, centered on 1920x1080
**Responsive:** Scales to 1366x768

---

## 🧩 Implementation Steps

1. Create GameScreen component with layout structure
2. Implement Header with category, timer, score
3. Implement Word Area with letter boxes
4. Implement Hint Section with styled container
5. Implement Control Panel with buttons and info
6. Implement Progress Bar
7. Wire up all components with game state
8. Test responsive behavior
9. Add animations for state changes

---

## ✅ Acceptance Criteria

- Layout matches PRD specification
- All sections positioned correctly
- Letter boxes display properly
- Timer updates every second
- Buttons functional and styled
- Responsive at 1920x1080 and 1366x768
- Animations smooth

---

## 🧪 Test Scenarios

| Test No | Scenario            | Expected Result                        |
| ------- | ------------------- | -------------------------------------- |
| T-001   | Load game screen    | All sections visible                   |
| T-002   | Timer counting down | Updates every second                   |
| T-003   | Letter boxes        | Closed state shows "?"                 |
| T-004   | Reveal letter       | Open state shows letter with animation |
| T-005   | Progress bar        | Shows X/14 correctly                   |

---

## 🔗 Dependencies

- `05-ui-design-system.md`
- `06-animations-framer-motion.md`

---

## 📄 Deliverables

- `src/pages/GameScreen.tsx`
- `src/components/game/GameHeader.tsx`
- `src/components/game/WordArea.tsx`
- `src/components/game/HintSection.tsx`
- `src/components/game/ControlPanel.tsx`
- `src/components/game/ProgressBar.tsx`

---

## 🧭 Notes

> Optimize for 1920x1080 but ensure playability at 1366x768.

---

## 📚 References

- [PRD - Section 4.5](../docs/PRD.md#45-oyun-ekranı-ana-oyun)

# Game Screen Layout

> PRD Reference: Section 4.5 - Game Screen Layout
> **Complete Design Spec:** [UI/UX Design Spec - Game Screen](../ui-ux-design.md#game-screen) - TV-optimized layout
> **See also:** [Game Mechanics UI](../ui-ux-design.md#mechanics) - Interaction patterns and visual feedback
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 1 day

---

## 🎯 Objective

Implement the main game screen layout with **TV show quality presentation** and **fully responsive design** (works on any screen size) including header (timer, score, active player), word area (letter tiles with 3D flip and status glow), hint section, control panel (Reveal, Guess, Skip), progress bar, and TV effects (confetti, light reflections) as specified in PRD Section 4.5 and ui-ux-design.md#game-screen.

---

## 🧾 Requirements

**Core Requirements (PRD 4.5):**
- PRD 4.5: Header (120px): category name/emoji, timer (center, large), score/progress (right), participant name
- PRD 4.5: Word Area (500px, center): letter boxes with closed/open states, 3D flip animation
- PRD 4.5: Hint Section (100px): hint text with 💡 icon, framed
- PRD 4.5: Control Panel (280px): 3 buttons (Reveal Letter, Guess, Skip), info (guesses left, letters used, remaining points), side controls (Pause, Sound, Home)
- PRD 4.5: Progress Bar (60px): word progress "6/14", category description

**TV Show Quality Enhancements (ui-ux-design.md#game-screen):**
- **Header (120px):** Left: category/emoji, Center: LARGE timer (dominant focal point), Right: score + progress + active player badge
- **Word Area (500px, center):**
  - Letter tiles: Dynamic row/column spacing with live scale
  - Closed state: `bg-slate-700 border-2 border-slate-600 rounded-lg w-16 h-20` with "?" icon
  - Open state: `bg-amber-400 text-slate-900 rounded-lg w-16 h-20` with letter (text-4xl font-extrabold)
  - **Status glow:** Correct = green glow animation, Wrong = red flash
  - 3D flip: `rotateY 0→180deg, scale 1→1.1→1, 0.6s spring`
- **Hint Section (100px):**
  - Large readable text + 💡 icon
  - Framed with border/background for visibility
- **Control Panel (280px):**
  - 3 main buttons: Harf Aç (H), Tahmin Et (T), Pas Geç (P) - minimum 48×48px
  - Info bar: Remaining guesses, letters revealed, remaining points
  - Side controls: Pause, Sound toggle, Home (with confirmation)
- **Progress Bar (60px):** Word progress "6/14" + short category description
- **TV Effects:**
  - Subtle light reflections on success
  - Confetti animation on correct answer (canvas-based, z-30 layer)
  - Timer pulse (last 30s), red flash (last 10s)

---

## ⚙️ Technical Details

**Technology:** React, TypeScript, Tailwind CSS, Framer Motion
**Layout:**
- **Fully responsive sections** with fluid heights (adapt to viewport)
- Responsive safe area margins (`p-4 md:p-6 lg:p-8`)
- Z-index layering: Content (0), Confetti (30), Modals (20)
**Fluid Responsive Behavior:**
- **Small screens (< 768px):** Compact layout, smaller letter tiles (`w-10 h-12`), tighter spacing
- **Medium screens (768-1024px):** Balanced layout, medium letter tiles (`w-12 h-14`)
- **Large screens (> 1024px):** Spacious layout, large letter tiles (`w-14 h-16`)
- **Extra large (> 1536px):** Maximum spacing, extra large tiles (`w-16 h-20`), enlarged typography
**Animations:**
- Letter flip: 3D rotateY with spring, 0.6s
- Correct answer: Green glow + 3x pulse + confetti (canvas) + score count-up
- Wrong answer: Shake `x: 0→-10→10→0, 0.3s` + red flash
- Timer warnings: Pulse (30s), fast pulse + red (10s)
**Performance:**
- 60 FPS animations (transform/opacity only)
- Canvas-based confetti (z-30 layer)
- Respect "reduce motion" preference

---

## 🧩 Implementation Steps

1. Create GameScreen component with TV-optimized layout structure
2. **Implement Header (120px):**
   - Left: Category name + emoji
   - Center: Timer (LARGE, `tabular-nums`, dominant)
   - Right: Score + progress indicator + active player badge
3. **Implement Word Area (500px, center):**
   - Letter tile grid with dynamic spacing
   - Closed state: Slate bg with "?" icon
   - Open state: Amber bg with letter (extrabold)
   - 3D flip animation: `rotateY 0→180, scale 1→1.1→1, spring 0.6s`
   - Status glow effects: Green (correct), Red flash (wrong)
4. **Implement Hint Section (100px):**
   - Large readable hint text
   - 💡 icon (large, accessible)
   - Framed container with border/background
5. **Implement Control Panel (280px):**
   - 3 main buttons (Harf Aç, Tahmin Et, Pas Geç) - min 48×48px
   - Info bar: Guesses left, letters used, remaining points
   - Side controls: Pause, Sound, Home (with modals)
6. **Implement Progress Bar (60px):**
   - Word progress "X/14"
   - Short category description
7. **Add TV effects:**
   - Confetti animation (canvas, z-30) on correct answer
   - Score count-up animation
   - Timer pulse warnings (30s, 10s)
   - Subtle light reflections on success
8. Wire up all components with game state (Zustand/Context)
9. **Test across multiple viewport sizes:**
   - Small (< 768px): Compact, readable, functional
   - Medium (768-1024px): Balanced layout
   - Large (> 1024px): Spacious, comfortable
   - Extra Large (> 1536px): Max spacing, enlarged elements
10. Add keyboard shortcuts (H, T, P, Space, M, ESC)
11. Verify accessibility and "reduce motion" support across all viewports

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

**Core Components:**
- `src/pages/GameScreen.tsx` - Main game screen layout
- `src/components/game/GameHeader.tsx` - Header with timer/score/player
- `src/components/game/WordArea.tsx` - Letter tile grid with animations
- `src/components/game/LetterTile.tsx` - Individual letter tile with 3D flip
- `src/components/game/HintSection.tsx` - Hint display with icon
- `src/components/game/ControlPanel.tsx` - Main controls + info bar
- `src/components/game/ProgressBar.tsx` - Word progress indicator

**TV Effects:**
- `src/components/game/Confetti.tsx` - Canvas-based confetti animation
- `src/components/game/StatusGlow.tsx` - Green/red glow effects
- `src/hooks/useCountUp.ts` - Score count-up animation hook
- `src/hooks/useTimerPulse.ts` - Timer warning pulse hook

---

## 🧭 Notes

> **TV Presentation Critical:** This is the core gameplay screen - must be perfectly readable from 3-8 meters on classroom projectors and TVs.

> **Timer Dominance:** The timer must be the largest, most visible element in the header - use `tabular-nums` to prevent layout shift during countdown.

> **Letter Tiles:** Use dynamic spacing with live scale to accommodate different word lengths (4-10 letters) while maintaining readability.

> **Status Glow:** Green glow for correct answers provides immediate positive feedback visible from distance. Red flash for wrong answers must be brief to avoid distraction.

> **3D Flip Performance:** Use Framer Motion's spring animation for natural feel, but ensure 60 FPS. Test on lower-end hardware.

> **Confetti:** Canvas-based confetti on z-30 layer must not block game controls. Auto-clear after animation completes.

> **Reduce Motion:** For users with motion sensitivity, replace 3D flip with simple fade, remove confetti, and simplify pulse animations.

> **Fully Responsive:** Works perfectly on ANY screen size. Letter tiles and spacing scale fluidly using Tailwind responsive classes (`w-10 h-12 md:w-12 md:h-14 lg:w-14 lg:h-16 xl:w-16 xl:h-20`).

---

## 📚 References

**Primary Design Specifications:**
- [UI/UX Design Spec - Game Screen](../ui-ux-design.md#game-screen) - **Complete TV-optimized layout**
- [UI/UX Design Spec - Game Mechanics UI](../ui-ux-design.md#mechanics) - Interaction patterns and feedback
- [UI/UX Design Spec - Motion Patterns](../ui-ux-design.md#motion) - Letter flip, glow, confetti animations
- [UI/UX Design Spec - Component Library](../ui-ux-design.md#components) - Letter tile, progress, buttons
- [UI/UX Design Spec - Sound Design](../ui-ux-design.md#sound) - Audio feedback integration
- [UI/UX Design Spec - Accessibility](../ui-ux-design.md#a11y) - Keyboard shortcuts, reduce motion

**PRD References:**
- [PRD - Section 4.5: Game Screen](../prd.md#45-oyun-ekranı-ana-oyun)
- [PRD - Section 4.6: Game Mechanics](../prd.md#46-oyun-mekanikleri)
- [PRD - Section 8: UI/UX Design Requirements](../prd.md#8-uiux-tasarim-gereksinimleri)

# Skip Mechanic
> PRD Reference: Section 4.6
> Category: Frontend
> Status: ✅ Completed
> Priority: Medium
> Estimated Time: 3 hours

---

## 🎯 Objective
Implement skip mechanic with confirmation dialog, 0 points, and move to next word as per PRD 4.6

---

## 🧾 Requirements

**From PRD Section 4.6 - Pas Geçme:**

1. "Pas Geç" butonuna tıkla
2. Onay popup'ı: "Pas geçmek istediğinizden emin misiniz?"
3. [Evet] → 0 puan, sonraki kelime
4. [Hayır] → popup kapat

**Sound Effect (PRD 10.1):**
- Whoosh sound on skip
- White noise sweep, 0.2s
- Low-pass filter (sliding)

---

## ⚙️ Technical Details

**Technology:** React, TypeScript, Framer Motion, Zustand

**Components:**
- `GameScreen.tsx` - Skip button handler and modal
- `ControlPanel.tsx` - Skip button UI with keyboard shortcut (P)
- `Modal.tsx` - Skip confirmation dialog
- `gameStore.ts` - skipWord action
- `soundService.ts` - playWhoosh sound effect

---

## 🧩 Implementation Steps

### ✅ Step 1: Skip Button in Control Panel
- Button with destructive/secondary style
- "Pas Geç" label with ⏭️ SkipForward icon
- Keyboard shortcut indicator: [P]
- Always enabled (canSkip: true)

### ✅ Step 2: Skip Confirmation Modal
- Modal title: "Kelimeyi Pas Geç"
- Warning message: "Bu kelimeyi geçmek istediğinizden emin misiniz?"
- Info message: "Kelimeyi geçerseniz puan alamazsınız"
- Two buttons:
  - "Evet, Geç" (destructive style)
  - "İptal" (secondary style)

### ✅ Step 3: Skip Logic in Game Store
- Mark word as `result: 'skipped'`
- Set `pointsEarned: 0`
- Increment `wordsSkipped` counter
- Move to next word: `currentWordIndex += 1`

### ✅ Step 4: Sound Effect
- Play whoosh sound on skip confirmation
- Web Audio API implementation with white noise and low-pass filter

### ✅ Step 5: Keyboard Shortcut
- [P] key opens skip confirmation modal
- Works during active gameplay (not when paused)

---

## ✅ Acceptance Criteria

- [x] "Pas Geç" button visible in control panel
- [x] Button displays keyboard shortcut [P]
- [x] Clicking button opens confirmation modal
- [x] Modal shows warning and info messages
- [x] "Evet, Geç" button skips word with 0 points
- [x] "İptal" button closes modal without action
- [x] Word marked as 'skipped' in session data
- [x] `wordsSkipped` counter incremented
- [x] Move to next word automatically
- [x] Whoosh sound plays on skip
- [x] Keyboard shortcut [P] works
- [x] Skip tracked in game results

---

## 🧪 Test Scenarios

| Test No | Scenario | Expected Result | Status |
|---------|----------|-----------------|--------|
| T-001 | Click "Pas Geç" button | Modal opens with confirmation | ✅ PASSED |
| T-002 | Click "İptal" in modal | Modal closes, game continues | ✅ PASSED |
| T-003 | Click "Evet, Geç" in modal | Word skipped, 0 points, next word loaded | ✅ PASSED |
| T-004 | Check `wordsSkipped` counter | Incremented by 1 | ✅ PASSED |
| T-005 | Check word result | `result: 'skipped'` | ✅ PASSED |
| T-006 | Press [P] key | Skip modal opens | ✅ PASSED |
| T-007 | Listen for whoosh sound | Sound plays on skip confirmation | ✅ PASSED |
| T-008 | Skip multiple words | Each skip tracked correctly | ✅ PASSED |

---

## 🔗 Dependencies

- ✅ Task 12: Game Screen Layout (skip button and modal UI)
- ✅ Task 13: Word Selection Algorithm (word progression logic)
- ✅ Task 07: Sound System (whoosh sound effect)
- ✅ Task 36: State Management (gameStore skipWord action)

---

## 📄 Deliverables

✅ **Files Modified:**
1. `src/components/screens/GameScreen.tsx`
   - Skip modal state management
   - handleSkip() function
   - Skip confirmation dialog UI
   - Keyboard shortcut (P) handler

2. `src/components/game/ControlPanel.tsx`
   - Skip button with icon and keyboard shortcut
   - onSkip callback prop

3. `src/store/gameStore.ts`
   - skipWord() action implementation

4. `src/services/soundService.ts`
   - playWhoosh() method (already implemented)

---

## 🧭 Notes

**PRD Compliance:**
- ✅ Confirmation dialog as specified in PRD 4.6
- ✅ 0 points awarded on skip
- ✅ Whoosh sound effect as per PRD 10.1
- ✅ Tracked in results (wordsSkipped counter)

**Implementation Notes:**
- Skip is always available (no conditions)
- Modal uses destructive button style to emphasize loss
- Sound plays after confirmation, not on button click
- Works in all game modes (single/multi/team)

---

## 📚 References
- [PRD Document - Section 4.6](../PRD.md#46-oyun-mekanikleri)
- [PRD Document - Section 10.1](../PRD.md#101-sound-system)
- [UI/UX Design - Game Screen](../ui-ux-design.md#game-screen)

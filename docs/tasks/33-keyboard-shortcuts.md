# Keyboard Shortcuts
> PRD Reference: Section 11
> Category: Frontend
> Status: Completed
> Priority: Medium
> Estimated Time: 1 day

---

## 🎯 Objective
Implement all keyboard shortcuts (global, game screen, popup, category management) as per PRD Section 11

---

## 🧾 Requirements
From PRD Section 11:

### 11.1 Global Kısayollar
- F11: Tam ekran aç/kapat
- Ctrl/Cmd + Q: Uygulamadan çık
- Ctrl/Cmd + ,: Ayarlar
- Esc: Geri / İptal (modallar için)
- M: Ses toggle (global)

### 11.2 Oyun Ekranı Kısayolları
- H: Harf Aç
- D: Doğru (kelimeyi doğru bildiniz - inline button)
- Y: Yanlış (kelimeyi yanlış bildiniz - inline button)
- P: Pas Geç
- Space: Duraklat/Devam
- M: Ses Aç/Kapat
- Esc: Ana Menü

### 11.3 Dialog Kısayolları (Pause/Skip/Home only)
- Enter: Onayla (onay dialogları)
- Esc: İptal (tüm dialoglar)

### 11.4 Kategori/Kelime Yönetimi
- Ctrl/Cmd + N: Yeni kategori/kelime
- Ctrl/Cmd + S: Kaydet (form'larda)
- Ctrl/Cmd + F: Arama (listelerde)

---

## ⚙️ Technical Details
**Technology:** React, TypeScript, Custom Hook

**Components:**
- `useKeyboardShortcuts` hook - Global keyboard handler
- Game screen keyboard handlers
- Modal keyboard handlers
- Form keyboard handlers

---

## 🧩 Implementation Steps

### ✅ Step 1: Create useKeyboardShortcuts Hook
Created `src/hooks/useKeyboardShortcuts.ts` with:
- F11 fullscreen toggle
- Ctrl/Cmd + Q quit application
- Ctrl/Cmd + , settings navigation
- M sound toggle
- Context-aware handlers (onNew, onSave, onSearch)

### ✅ Step 2: Global Shortcuts in Screens
Added useKeyboardShortcuts to:
- MainMenuScreen
- CategorySelectionScreen
- CategoryManagementScreen (+ Ctrl+N, Ctrl+F)
- WordManagementScreen (+ Ctrl+N, Ctrl+F)
- SettingsScreen
- HowToPlayScreen
- GameHistoryScreen

### ✅ Step 3: Form Save Shortcuts
Added Ctrl+S to:
- AddWordModal
- EditWordModal
- CreateCategoryModal
- EditCategoryModal

### ✅ Step 4: Game Screen Dialog Shortcuts
Enhanced GameScreen with:
- Guess Modal: D/Enter (correct), Y (wrong), N (cancel)
- Skip Modal: Enter (confirm)
- Home Modal: Enter (confirm)
- M key for sound toggle

### ✅ Step 5: Search Input Focus
Added Ctrl+F for:
- CategoryManagementScreen search
- WordManagementScreen search
- Updated placeholders with hint

---

## ✅ Acceptance Criteria
- [x] F11 toggles fullscreen
- [x] Ctrl/Cmd+Q quits app
- [x] Ctrl/Cmd+, opens settings
- [x] Esc goes back/cancels (modals)
- [x] H key reveals letter in game
- [x] T key opens guess popup
- [x] P key skips word
- [x] Space pauses/resumes game
- [x] M key toggles sound (game and global)
- [x] D/Enter confirms correct guess
- [x] Y/N for wrong/cancel guess
- [x] Ctrl/Cmd+N creates new item
- [x] Ctrl/Cmd+S saves forms
- [x] Ctrl/Cmd+F focuses search
- [x] All shortcuts work correctly
- [x] No conflicts between shortcuts

---

## 🧪 Test Scenarios
| Test No | Scenario | Expected Result | Status |
|----------|----------|----------------|---------|
| T-001 | Press F11 on any screen | Fullscreen toggles | ✅ |
| T-002 | Press Ctrl/Cmd+Q | App closes | ✅ |
| T-003 | Press Ctrl/Cmd+, from main menu | Navigate to settings | ✅ |
| T-004 | Press M on main menu | Sound toggles | ✅ |
| T-005 | Press H during game (before guess) | Random letter reveals | ✅ |
| T-006 | Press T during game | Guess modal opens | ✅ |
| T-007 | Press D or Enter in guess modal | Mark as correct | ✅ |
| T-008 | Press Y in guess modal | Mark as wrong | ✅ |
| T-009 | Press N in guess modal | Cancel modal | ✅ |
| T-010 | Press P during game | Skip confirmation opens | ✅ |
| T-011 | Press Space during game | Game pauses | ✅ |
| T-012 | Press M during game | Sound toggles | ✅ |
| T-013 | Press Esc during game | Home confirmation opens | ✅ |
| T-014 | Press Ctrl/Cmd+N in category management | Create category modal opens | ✅ |
| T-015 | Press Ctrl/Cmd+F in category management | Search input focuses | ✅ |
| T-016 | Press Ctrl/Cmd+N in word management | Add word modal opens | ✅ |
| T-017 | Press Ctrl/Cmd+F in word management | Search input focuses | ✅ |
| T-018 | Press Ctrl/Cmd+S in add word modal | Form submits | ✅ |
| T-019 | Press Ctrl/Cmd+S in edit word modal | Form submits | ✅ |
| T-020 | Press Ctrl/Cmd+S in create category | Form submits | ✅ |
| T-021 | Press Esc in any modal | Modal closes | ✅ |

---

## 🔗 Dependencies
- Task 01-32: All previous screens and components
- Tauri Window API
- React event handlers

---

## 📄 Deliverables
- [x] `src/hooks/useKeyboardShortcuts.ts` - Global keyboard shortcut hook
- [x] `src/hooks/index.ts` - Hook exports
- [x] Updated all screen components with keyboard support
- [x] Updated all modal components with save shortcuts
- [x] Enhanced GameScreen with dialog shortcuts
- [x] Input placeholders with keyboard hints

---

## 🧭 Notes
- macOS uses Cmd key, Windows/Linux uses Ctrl
- Game screen has own handler (doesn't use hook to avoid conflicts)
- Modal ESC already handled by Modal component
- Shortcuts disabled in text inputs (except search focus)
- disableNavigation flag for modals prevents settings navigation

---

## 📚 References
- [PRD Document - Section 11](../PRD.md)
- [UI/UX Design - Keyboard Shortcuts](../ui-ux-design.md#howto-shortcuts)


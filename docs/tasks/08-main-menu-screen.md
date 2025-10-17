# Main Menu Screen

> PRD Reference: Section 4.1 - Main Menu Screen
> **Complete Design Spec:** [UI/UX Design Spec - Main Menu](../ui-ux-design.md#main-menu) - TV show quality layout
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 4 hours

---

## 🎯 Objective

Create the main menu (başlangıç ekranı) as the primary navigation hub with **TV show quality presentation** including hero layout, 5 action cards in grid (2×3), safe area margins, gradient backgrounds, and subtle particle effects. This screen serves as the entry point to all major features and must be optimized for classroom projection and large TV displays as specified in PRD Section 4.1 and ui-ux-design.md#main-menu.

---

## 🧾 Requirements

**Core Requirements (PRD 4.1):**
- PRD 4.1: Logo and title displayed prominently (large, centered)
- PRD 4.1: 5 action cards in grid layout: Start Game, Category Management, Game History, Settings, How to Play
- PRD 4.1: Emoji icons for each card: 🏁 📚 📊 ⚙️ ℹ️
- PRD 4.1: Version info displayed in corner
- PRD 4.1: GitHub repo link (optional, in corner)
- PRD 4.1: Gradient background (dark theme)
- PRD 4.1: Large, touchable cards (minimum 48×48px interaction areas)
- PRD 4.1: Hover animations on cards
- PRD 4.1: Modern, minimal design

**TV Show Quality Enhancements (ui-ux-design.md#main-menu):**
- Hero layout with centered logo/title (large typography)
- Action card grid: 2×3 pattern with proper spacing
- Safe area margins: 24-48px outer frame for projection edge tolerance
- 12-column grid system with 80-96px gutter for large screen comfort
- Gradient background: `from-slate-900 via-slate-800 to-slate-900`
- Subtle particle/parıltı layer for visual interest (performance-friendly)
- Large cards with strong hover effects (scale 1.05, shadow transitions)
- Short description subtitle for each card
- Bottom bar: Version info and GitHub link

---

## ⚙️ Technical Details

**Technology:** React, TypeScript, Tailwind CSS, Framer Motion
**Layout:**
- **Responsive safe area:** `p-4 md:p-6 lg:p-8 xl:p-12` outer margins
- **Fluid 12-column grid** with viewport-aware gutters (`gap-4 md:gap-6 lg:gap-8`)
- Centered flex container with responsive card grid (1 col on small, 2 cols on medium, 3 cols on large)
- Hero section: Large centered logo/title (fluid typography)
**Design:**
- Dark gradient background: `from-slate-900 via-slate-800 to-slate-900`
- Slate-based card colors with blue accent on hover
- Subtle particle/parıltı background layer (optional, performance-optimized)
- **Fully responsive cards:** Scale fluidly from small to large viewports
- **Responsive touch targets:** Min 44×44px (small) to 48×48px+ (large) for all screen sizes
**Navigation:** React Router for navigation to each section
**Accessibility:** Keyboard navigation (Tab/Enter), focus indicators, ARIA labels

---

## 🧩 Implementation Steps

1. Create MainMenu component with safe area wrapper (24-48px margins)
2. **Implement TV-optimized layout:**
   - 12-column grid system container
   - Hero section: Centered logo/title with large typography
   - Action card grid: 2×3 pattern with 80-96px gutters
3. Create ActionCard component with:
   - Emoji icon (large, accessible)
   - Title (text-2xl or larger)
   - Short description subtitle
   - Minimum 48×48px interaction area
   - Hover scale (1.05) and shadow transition
4. Implement 5 action cards with proper spacing
5. **Add TV-quality backgrounds:**
   - Gradient: `from-slate-900 via-slate-800 to-slate-900`
   - Optional: Subtle particle/parıltı layer (canvas or CSS, performance-optimized)
6. Implement hover animations using Framer Motion (transform/opacity for performance)
7. Add bottom bar with version info and GitHub link
8. Wire up navigation to each section (React Router)
9. **Test across multiple viewport sizes:**
   - Small (< 768px): Single column, compact spacing
   - Medium (768-1024px): 2 columns
   - Large (> 1024px): 3 columns, full spacing
   - Extra Large (> 1536px): Max-width container, enlarged typography
10. Add keyboard navigation support (Tab, Enter, focus rings)
11. Verify accessibility (WCAG 2.1 AA, screen reader support) across all viewports

---

## ✅ Acceptance Criteria

- Logo and title prominently displayed
- All 5 action cards visible in attractive grid
- Cards have proper emoji icons and descriptions
- Hover animations work smoothly
- Version info visible in corner
- Navigation to all 5 sections working
- Gradient background applied correctly
- Responsive on 1920x1080 and 1366x768
- Modern, minimal aesthetic achieved
- Keyboard navigation functional

---

## 🧪 Test Scenarios

| Test No | Scenario                     | Expected Result                 |
| ------- | ---------------------------- | ------------------------------- |
| T-001   | Load main menu               | All 5 cards displayed in grid   |
| T-002   | Hover over "Start Game" card | Scale and shadow animation      |
| T-003   | Click "Start Game"           | Navigate to category selection  |
| T-004   | Click "Category Management"  | Navigate to category management |
| T-005   | Click "Game History"         | Navigate to game history        |
| T-006   | Click "Settings"             | Navigate to settings            |
| T-007   | Click "How to Play"          | Navigate to tutorial            |
| T-008   | Check version info           | Version number displayed        |
| T-009   | Tab through cards            | Keyboard focus moves correctly  |

---

## 🔗 Dependencies

- `05-ui-design-system.md` (design tokens and Card component)
- `06-animations-framer-motion.md` (hover animations)
- `37-routing-navigation.md` (routing setup)

---

## 📄 Deliverables

- `src/pages/MainMenu.tsx` - Main menu page component
- `src/components/ActionCard.tsx` - Reusable action card component
- Updated routing configuration

---

## 🧭 Notes

> **TV Presentation:** The main menu is the first screen users see on classroom projection or large TV - make it visually striking with high-contrast elements readable from 3-8 meters.

> **Safe Area Critical:** Always maintain 24-48px margins to account for projection edge cutoff on smartboards and TVs.

> The main menu sets the tone for the entire TV show quality experience - use strong visual hierarchy and dramatic (yet performance-friendly) effects.

> **Responsive Grid:** Card grid adapts fluidly: 1 column (small), 2 columns (medium), 3 columns (large). Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern.

> **Particle Layer:** If adding subtle background particles/parıltı, ensure it's performance-optimized (60 FPS) and respects "reduce motion" preference.

> All hover states must use `transform/opacity` for 60 FPS performance - avoid animating width/height.

> Consider using Framer Motion's `staggerChildren` for a dramatic entrance animation when the main menu loads.

---

## 📚 References

**Primary Design Specifications:**
- [UI/UX Design Spec - Main Menu](../ui-ux-design.md#main-menu) - **Complete TV show quality layout spec**
- [UI/UX Design Spec - Design Principles](../ui-ux-design.md#tasarım-ilkeleri)
- [UI/UX Design Spec - Layout System](../ui-ux-design.md#layout-sistemi-1920×1080-baz-çerçeve)
- [UI/UX Design Spec - Component Library](../ui-ux-design.md#components)
- [UI/UX Design Spec - Motion Patterns](../ui-ux-design.md#motion)
- [UI/UX Design Spec - Accessibility](../ui-ux-design.md#a11y)

**PRD References:**
- [PRD Document - Section 4.1: Main Menu](../prd.md#41-başlangıç-ekranı-ana-menü)
- [PRD Document - Section 8: UI/UX Design Requirements](../prd.md#8-uiux-tasarim-gereksinimleri)

# Main Menu Screen

> PRD Reference: Section 4.1 - Main Menu Screen
> See also: [UI/UX Design Spec](../ui-ux-design.md#main-menu)
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 4 hours

---

## 🎯 Objective

Create the main menu (başlangıç ekranı) as the primary navigation hub with 5 action cards, branding, and modern dark theme design. This screen serves as the entry point to all major features of the word game application as specified in PRD Section 4.1.

---

## 🧾 Requirements

- PRD 4.1: Logo and title displayed prominently (large, centered)
- PRD 4.1: 5 action cards in grid layout: Start Game, Category Management, Game History, Settings, How to Play
- PRD 4.1: Emoji icons for each card: 🏁 📚 📊 ⚙️ ℹ️
- PRD 4.1: Version info displayed in corner
- PRD 4.1: GitHub repo link (optional, in corner)
- PRD 4.1: Gradient background (dark theme)
- PRD 4.1: Large, touchable cards
- PRD 4.1: Hover animations on cards
- PRD 4.1: Modern, minimal design

---

## ⚙️ Technical Details

**Technology:** React, TypeScript, Tailwind CSS, Framer Motion
**Layout:** Centered flex container with grid of 5 cards
**Design:** Dark gradient background, slate-based card colors, blue accent on hover
**Navigation:** React Router for navigation to each section

---

## 🧩 Implementation Steps

1. Create MainMenu component
2. Design logo/title section (centered, large typography)
3. Create ActionCard component with emoji, title, description
4. Implement 5 action cards in grid layout (2-2-1 or 3-2 pattern)
5. Add gradient background
6. Implement hover animations using Framer Motion
7. Add version info to footer/corner
8. Add GitHub link (if applicable)
9. Wire up navigation to each section
10. Test responsive layout
11. Add keyboard navigation support

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

> The main menu is the first screen users see - make it visually appealing and intuitive.

> Card grid should adapt to different screen sizes gracefully.

> Consider adding subtle background patterns or particles for visual interest.

---

## 📚 References

- [PRD Document - Section 4.1: Main Menu](../docs/PRD.md#41-başlangıç-ekranı-ana-menü)

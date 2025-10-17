# Category Selection Screen
> PRD Reference: Section 4.2 - Category Selection Screen
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 6 hours

---

## 🎯 Objective
Implement the category selection screen where users choose which word category to play with. Display category cards with validation status badges indicating playability for different game modes as specified in PRD Section 4.2.

---

## 🧾 Requirements
- PRD 4.2: Page title "Kategori Seçin"
- PRD 4.2: Scrollable grid of category cards with emoji, name, word count, playability status badge, Play button
- PRD 4.2: Empty state message when no categories exist
- PRD 4.2: "Yeni Kategori Oluştur" quick access button
- PRD 4.2: Back button for navigation
- PRD 4.2: Validation badge showing playability status (green checkmark, yellow warning, red X)
- PRD 4.2: Play button enabled/disabled based on validation
- PRD 3.3: Display how many participants can play based on word count

---

## ⚙️ Technical Details
**Technology:** React, TypeScript, Tailwind CSS
**Data Source:** Tauri backend get_all_categories command
**Validation:** validate_category command from backend
**Card Design:** Emoji (large), category name, word count, badge, play button
**Layout:** Grid with 3-4 cards per row, scrollable

---

## 🧩 Implementation Steps
1. Create CategorySelection page component
2. Fetch all categories from backend on load
3. Create CategoryCard component
4. Implement category validation status logic
5. Display validation badges (✅ ⚠️ ❌)
6. Enable/disable Play button based on validation
7. Add empty state UI (no categories message)
8. Add "Create New Category" quick button
9. Implement Back button navigation
10. Add scrollable grid layout
11. Wire up Play button to mode selection
12. Add loading states during fetch

---

## ✅ Acceptance Criteria
- Categories loaded from database successfully
- Category cards display emoji, name, word count
- Validation status badge shows correctly for each category
- Play button enabled only for playable categories
- Empty state message shown when no categories
- Quick create button navigates to category creation
- Back button returns to main menu
- Grid is scrollable if many categories
- Responsive layout works at different resolutions
- Loading state shown while fetching categories

---

## 🧪 Test Scenarios
| Test No | Scenario | Expected Result |
|----------|----------|----------------|
| T-001 | Load screen with categories | All categories displayed in grid |
| T-002 | Category with 70+ words | Green badge "Oynanabilir" |
| T-003 | Category with 14-27 words | Yellow badge "Sınırlı" |
| T-004 | Category with <14 words | Red badge "Oynanamaz", Play disabled |
| T-005 | Click Play on valid category | Navigate to mode selection |
| T-006 | Click Play on invalid category | Button disabled, no navigation |
| T-007 | No categories exist | Empty state message shown |
| T-008 | Click "Create New Category" | Navigate to category creation |
| T-009 | Click Back button | Return to main menu |

---

## 🔗 Dependencies
- `04-tauri-backend-commands.md` (get_all_categories, validate_category commands)
- `05-ui-design-system.md` (Card component)
- `29-category-validation.md` (validation logic)

---

## 📄 Deliverables
- `src/pages/CategorySelection.tsx` - Main page component
- `src/components/CategoryCard.tsx` - Category card component
- `src/components/ValidationBadge.tsx` - Playability badge component
- `src/hooks/useCategories.ts` - Categories data hook

---

## 🧭 Notes
> Validation should run on component mount to ensure accurate playability status.

> Consider caching category data to reduce backend calls.

> Tooltip on validation badge can explain requirements in detail.

---

## 📚 References
- [PRD Document - Section 4.2: Category Selection](../docs/PRD.md#42-kategori-seçim-ekranı)
- [PRD Document - Section 3.3: Category Validation](../docs/PRD.md#33-kategori-validasyonu)

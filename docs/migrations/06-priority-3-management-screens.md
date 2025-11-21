# Priority 3 Screens - UI/UX Migration
## Management & History Screens

**Priority:** 3 (Content Management)
**Components:** `CategoryManagementScreen.tsx`, `WordManagementScreen.tsx`, `GameHistoryScreen.tsx`
**Complexity:** High

---

## Category Management Screen

### Current Problems
- Looks like admin panel (not user-friendly)
- No bulk actions
- Modal-heavy (slow workflow)
- No drag-drop organization
- Cards identical to selection screen

### New Design: "Data Table with Quick Actions"

**Key Improvements:**
1. **Table view** with sortable columns
2. **Inline editing** (click to edit name)
3. **Bulk selection** (checkbox, select all, bulk delete)
4. **Quick actions menu** (⋮ icon, opens dropdown)
5. **Import/Export** prominent in header
6. **Keyboard shortcuts** (N for new, Del for delete selected)

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [+ New] [Import] [Export]    [Search 🔍]   │
├─────────────────────────────────────────────┤
│ ☐ Name         Words  Valid  Last Played    │
│ ☐ Hayvanlar    45     ✅     2 hrs ago  ⋮   │
│ ☐ Ülkeler      38     ✅     1 day ago  ⋮   │
│ ☐ Yiyecekler   12     ⚠️     Never      ⋮   │
├─────────────────────────────────────────────┤
│ 3 selected [Delete] [Export]                │
└─────────────────────────────────────────────┘
```

---

## Word Management Screen

### Current Problems
- Boring data table
- Modal workflow slow
- Right sidebar disconnected
- No inline editing
- No word suggestions

### New Design: "Inline Editing Table + Side Panel"

**Key Improvements:**
1. **Inline add** (row at top, quick add)
2. **Inline edit** (double-click cell)
3. **Integrated sidebar** (sticky, updates in real-time)
4. **Bulk import preview** (show before committing)
5. **Word suggestions** (based on category, AI-powered)
6. **Better distribution viz** (donut chart, not bars)

**Layout:**
```
┌─────────────────────────────┬─────────────┐
│ [+ Quick Add]  [Import]     │  STATS      │
│ ┌─────────────────────────┐ │  🍩 Chart   │
│ │ Word  │ Len │ Hint │ ⋮  │ │  4: ██ 12   │
│ │ ASLAN │ 5   │ Kral │ ⋮  │ │  5: ███ 15  │
│ │ (editable cells)          │ │  ...        │
│ └─────────────────────────┘ │  Status     │
│                             │  ✅ Playable│
└─────────────────────────────┴─────────────┘
```

---

## Game History Screen

### Current Problems
- Stats cards generic
- Filter in modal (hidden)
- Game cards all same
- Pagination dated
- No insights/trends

### New Design: "Analytics Dashboard"

**Key Improvements:**
1. **Rich dashboard** (charts, trends, insights)
2. **Inline filters** (chip-based, always visible)
3. **Timeline view** option (alternative to list)
4. **Game thumbnails** (visual preview)
5. **Infinite scroll** or virtual scrolling
6. **Comparison mode** (select 2+ games, compare)
7. **Export options** (CSV, PDF report)

**Layout:**
```
┌──────────────────────────────────────────┐
│ DASHBOARD                                │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐│
│ │ Games │ │ Wins  │ │ Avg   │ │ Trend ││
│ │  127  │ │  45   │ │ 8,200 │ │  ↗    ││
│ └───────┘ └───────┘ └───────┘ └───────┘│
│                                          │
│ Filters: [All ×] [Hayvanlar ×] [2025 ×]│
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ Game Card (with thumbnail)           ││
│ │ 🐾 Hayvanlar • 2 hours ago           ││
│ │ Ali won (8,500 pts) • View Details   ││
│ └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

---

**Implementation Estimate:** 10-12 hours (all 3 screens)
**Status:** Ready for Implementation

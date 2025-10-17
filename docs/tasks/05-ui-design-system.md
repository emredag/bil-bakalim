# UI Design System

> PRD Reference: Section 8 - UI/UX Design Requirements
> **Complete Design Specification:** [UI/UX Design Spec](../ui-ux-design.md) - TV show quality standards
> Category: Frontend
> Status: Not Started
> Priority: High
> Estimated Time: 1 day

---

## 🎯 Objective

Implement a comprehensive design system with **TV show quality aesthetics** including color palette, typography (fluid/clamp), component styles, layout system, and UI patterns as specified in the PRD Section 8 and the complete design specification document. This task establishes the visual foundation and consistent styling for the entire application using Tailwind CSS.

**Design Principles (from ui-ux-design.md):**
1. **TV Show Aesthetics:** High energy, gold accents, bright highlights, dramatic animations (performance-friendly)
2. **Remote Visibility:** Readable from 3-8 meters; minimum 48px touch targets
3. **Clear Hierarchy:** Timer, score, active player, and word area are top priority
4. **Accessibility:** WCAG 2.1 AA compliant

The design system must follow the modern dark theme aesthetic with **fully responsive** TV presentation optimizations for classroom projection and displays of any size (from small laptops to large TVs, using fluid scaling).

---

## 🧾 Requirements

All mandatory work items within this task, as defined in PRD and ui-ux-design.md.

**Core Requirements (PRD 8.1-8.3):**
- PRD 8.1: Implement modern dark theme color palette (Slate-based backgrounds)
- PRD 8.1: Define all accent colors (Blue, Violet, Gold/Amber)
- PRD 8.1: Define status colors (Success, Error, Warning, Info)
- PRD 8.1: Define text colors (Primary, Secondary, Tertiary)
- PRD 8.1: Implement gradient definitions for backgrounds, cards, and buttons
- PRD 8.2: Set up Inter font from Google Fonts as main font
- PRD 8.2: Set up JetBrains Mono for monospace needs
- PRD 8.2: Define typography scale (H1-H3, body text, button text, word letters)
- PRD 8.3: Create base button styles (Primary, Secondary, Destructive)
- PRD 8.3: Create card component styles with hover states
- PRD 8.3: Create input field styles with focus states
- PRD 8.3: Create modal/dialog styles
- PRD 8.3: Create letter box styles (closed and open states with glow effects)

**TV Show Quality Enhancements (ui-ux-design.md):**
- Design tokens: 8px-based spacing scale, rounded-xl/2xl radius, shadow & glow patterns
- Layout system: 24-48px safe area margins, 12-column grid (80-96px gutter)
- Z-index layers: Content (0), Tooltip (10), Modal (20), Confetti (30), Toast (40)
- Typography enhancements: `tabular-nums` for timer/score, fluid clamp() for headings
- Additional components: Toast, Tooltip, Badge, Tabs, Tables, Progress (timer ring/bar, count-up), Team Chip
- Letter tile status glow: Green glow (correct), red flash (wrong)
- Minimum interaction targets: 48×48px for remote/smartboard use

---

## ⚙️ Technical Details

Technical scope of the task as per PRD.

**Technology:**

- Tailwind CSS for styling
- Google Fonts for typography
- CSS custom properties for theme variables

**Color Palette (PRD 8.1):**

**Backgrounds:**

- Primary: #0f172a (Slate-900)
- Secondary: #1e293b (Slate-800)
- Tertiary: #334155 (Slate-700)

**Accents:**

- Primary: #3b82f6 (Blue-500)
- Secondary: #8b5cf6 (Violet-500)
- Gold: #fbbf24 (Amber-400)

**Status:**

- Success: #10b981 (Emerald-500)
- Error: #ef4444 (Red-500)
- Warning: #f59e0b (Amber-500)
- Info: #3b82f6 (Blue-500)

**Text:**

- Primary: #f1f5f9 (Slate-100)
- Secondary: #cbd5e1 (Slate-300)
- Tertiary: #94a3b8 (Slate-400)

**Gradients:**

- Background: `from-slate-900 via-slate-800 to-slate-900`
- Cards: `from-slate-800 to-slate-700`
- Buttons: `from-blue-600 to-blue-700`

**Typography (PRD 8.2):**

- H1: text-6xl (60px) font-bold
- H2: text-4xl (36px) font-semibold
- H3: text-2xl (24px) font-semibold
- Body: text-base (16px), text-lg (18px), text-sm (14px)
- Word Letters: text-5xl (48px) font-extrabold
- Buttons: text-lg (18px) font-semibold

**Component Styles (PRD 8.3):**

**Buttons:**

- Primary: `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`
- Secondary: `bg-slate-700 hover:bg-slate-600 text-slate-100`
- Destructive: `bg-red-600 hover:bg-red-700 text-white`

**Cards:**

- Base: `bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700`
- Hover: `hover:scale-105 hover:shadow-2xl transition-transform duration-200`

**Inputs:**

- Base: `bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100`
- Focus: `focus:ring-2 focus:ring-blue-500`

**Modals:**

- Overlay: `bg-black/50 backdrop-blur-sm`
- Content: `bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md`

**Letter Boxes:**

- Closed: `bg-slate-700 border-2 border-slate-600 rounded-lg w-16 h-20`
- Open: `bg-amber-400 text-slate-900 rounded-lg w-16 h-20`

**Related Files:**

- `tailwind.config.js` - Tailwind configuration
- `src/styles/` - Custom CSS and theme files
- `src/components/ui/` - Reusable UI components

---

## 🧩 Implementation Steps

Step-by-step guide on how to implement this task.

1. Configure Tailwind CSS with custom theme colors from PRD and design spec
2. **Extend Tailwind config with TV show enhancements:**
   - 8px-based spacing scale (2, 4, 6, 8, 12, 16, 24, 32, 48, 64)
   - Safe area utilities (24-48px margins)
   - Z-index layer utilities
   - Shadow & glow patterns (`ring-amber-400/40`)
3. Import Inter and JetBrains Mono fonts from Google Fonts
4. **Add typography enhancements:**
   - CSS `font-variant-numeric: tabular-nums` for timer/score
   - Fluid typography with `clamp()` for headings (1366-3840px range)
5. Create CSS custom properties for theme colors
6. Define Tailwind theme extensions for custom colors and gradients
7. Create base button component variants (Primary, Secondary, Destructive) with min 48×48px
8. Create Card component with hover states (scale 1.05, shadow transitions)
9. Create Input component with focus states (blue ring)
10. Create Modal/Dialog component with blur backdrop
11. Create LetterBox component (closed/open states with status glow effects)
12. **Create additional TV-quality components:**
    - Toast (4s auto-dismiss, color strips)
    - Tooltip, Badge, Tabs/Segmented
    - Tables (zebra rows, sticky header, responsive stack)
    - Progress (timer ring/bar, score count-up)
    - Team Chip (rounded-full with color/emoji)
13. Document all design tokens and component usage
14. Create style guide documentation
15. **Test all components across multiple viewport sizes:** Small (< 768px), Medium (768-1024px), Large (> 1024px), Extra Large (> 1536px)

---

## ✅ Acceptance Criteria

What conditions must be met for this task to be considered complete?

- Tailwind CSS configured with all custom colors from PRD
- All background, accent, status, and text colors available as Tailwind classes
- Inter font loaded and applied as default font
- JetBrains Mono available for monospace usage
- All typography sizes defined and working
- Button components created with all 3 variants
- Card component with hover animation working
- Input fields with focus ring working
- Modal/Dialog component with blur backdrop working
- Letter box component with both states styled correctly
- All gradients defined and usable
- Design system documented
- Components render correctly at 1920x1080 and 1366x768

---

## 🧪 Test Scenarios

Test steps for each acceptance criterion.

| Test No | Scenario                           | Expected Result                            |
| ------- | ---------------------------------- | ------------------------------------------ |
| T-001   | Apply bg-slate-900 class           | Background color matches #0f172a           |
| T-002   | Apply text-blue-500 class          | Text color matches #3b82f6                 |
| T-003   | Render Button Primary              | Blue gradient background with hover effect |
| T-004   | Render Button Secondary            | Slate background with hover effect         |
| T-005   | Hover over Card component          | Scale increases to 1.05 smoothly           |
| T-006   | Focus Input field                  | Blue ring appears around input             |
| T-007   | Render Modal                       | Blurred backdrop with centered content     |
| T-008   | Render closed LetterBox            | Slate background with "?" icon             |
| T-009   | Render open LetterBox              | Amber background with letter visible       |
| T-010   | Check Inter font loading           | Text uses Inter font family                |
| T-011   | Apply text-6xl font-bold           | Heading matches H1 specifications          |
| T-012   | Test responsive design at 1366x768 | All components scale appropriately         |

---

## 🔗 Dependencies

Other tasks that must be completed before this task can start, or required system resources.

- `01-project-setup.md` must be completed (Tailwind CSS installed)

---

## 📄 Deliverables

List of concrete outputs that will be produced when task is completed.

**Core Deliverables:**
- `tailwind.config.js` with complete theme configuration (including TV enhancements)
- `src/styles/globals.css` with custom CSS, font imports, and typography utilities
- `src/components/ui/Button.tsx` - Button component (min 48×48px)
- `src/components/ui/Card.tsx` - Card component with hover scale
- `src/components/ui/Input.tsx` - Input component with focus ring
- `src/components/ui/Modal.tsx` - Modal/Dialog component with blur backdrop
- `src/components/ui/LetterBox.tsx` - Letter box component with status glow

**TV Show Quality Components:**
- `src/components/ui/Toast.tsx` - Toast notification component
- `src/components/ui/Tooltip.tsx` - Tooltip component
- `src/components/ui/Badge.tsx` - Badge/label component
- `src/components/ui/Tabs.tsx` - Tabs/Segmented control component
- `src/components/ui/Table.tsx` - Table component (zebra, sticky header, responsive)
- `src/components/ui/Progress.tsx` - Progress (ring/bar, count-up animation)
- `src/components/ui/TeamChip.tsx` - Team identifier chip

**Documentation:**
- Design system documentation with TV show quality guidelines
- Style guide with examples and accessibility notes
- Component usage guide with responsive behavior

---

## 🧭 Notes

Information that helps understand the process but is not directly part of PRD.

> **TV Presentation Optimization:** This design system is optimized for classroom projection, smartboards, and large TV displays. All components must be readable from 3-8 meters distance.

> Use Tailwind's @apply directive sparingly - prefer utility classes for better tree-shaking.

> Inter font provides excellent readability for the word game context. Use `tabular-nums` for timer and score to prevent layout shift.

> **Fluid Typography:** Use CSS `clamp()` for headings to ensure proper scaling from 1366×768 to 4K displays without breakpoints.

> The Amber-400 color for revealed letters creates strong visual contrast against the dark theme - perfect for TV visibility.

> All hover states should use transition-all with 200ms duration for smooth animations. Use `transform/opacity` for performance.

> **Safe Area Margins:** Always apply 24-48px margins on outer frames to account for projection edge cutoff.

> **Accessibility First:** Minimum 48×48px touch targets for smartboard/remote use. All interactive elements must be keyboard accessible.

> Consider creating a Storybook or similar component catalog for easy reference and testing across resolutions.

---

## 📚 References

**Primary Design Specifications:**
- [UI/UX Design Spec - Complete Document](../ui-ux-design.md) - **TV show quality standards**
- [UI/UX Design Spec - Design Principles](../ui-ux-design.md#tasarım-ilkeleri)
- [UI/UX Design Spec - Visual Language & Tokens](../ui-ux-design.md#görsel-dil-ve-tasarım-tokenları)
- [UI/UX Design Spec - Layout System](../ui-ux-design.md#layout-sistemi-1920×1080-baz-çerçeve)
- [UI/UX Design Spec - Component Library](../ui-ux-design.md#components)
- [UI/UX Design Spec - Accessibility](../ui-ux-design.md#a11y)
- [UI/UX Design Spec - QA Checklist](../ui-ux-design.md#qa-checklist)

**PRD References:**
- [PRD Document - Section 8: UI/UX Design Requirements](../prd.md#8-uiux-tasarim-gereksinimleri)
- [PRD Document - Section 8.1: Color Palette](../prd.md#81-renk-paleti)
- [PRD Document - Section 8.2: Typography](../prd.md#82-tipografi)
- [PRD Document - Section 8.3: Component Design](../prd.md#83-bileşen-tasarımı)

**External Resources:**
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

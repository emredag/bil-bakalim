# Priority 2 Screens - UI/UX Migration
## Participant Setup & Welcome Screen

**Priority:** 2 (Setup Flow)
**Components:** `ParticipantSetupScreen.tsx`, `WelcomeScreen.tsx`
**Complexity:** Low-Medium

---

## Participant Setup Screen

### Current Problems
- Generic forms
- Poor mobile layout (2/3 - 1/3 split doesn't work on mobile)
- Validation feedback disconnected
- No participant preview
- Team color picker missing
- Boring input fields

### New Design

**Layout:**
- **Single column** on mobile (form fills width)
- **Step wizard** option (optional, keep single page)
- **Live preview** of participants as you add them
- **Visual team builder** with color swatches

**Key Improvements:**
1. Inline validation (show errors immediately)
2. Participant cards (show avatars, reorder with drag)
3. Color picker for teams (visual swatches, not dropdown)
4. Emoji picker for teams (searchable grid)
5. Smart defaults (suggest names, colors)

**Component Updates:**
```tsx
// Participant card with drag handle
<ParticipantCard
  participant={participant}
  onRemove={() => remove(index)}
  onReorder={(from, to) => reorder(from, to)}
  draggable
/>

// Team builder with visual controls
<TeamBuilder
  team={team}
  onUpdateColor={(color) => updateTeam(team.id, { color })}
  onUpdateEmoji={(emoji) => updateTeam(team.id, { emoji })}
  onAddMember={() => addMember(team.id)}
/>
```

---

## Welcome Screen

### Current Problems
- Generic welcome pattern
- Static layout
- Database status too technical
- Emoji wiggle animation childish
- No brand personality

### New Design

**Concept:** "Onboarding Flow" with steps

**Layout:**
```
┌─────────────────────────────────────┐
│         Step 1 of 3                 │
│                                     │
│   🎯 Welcome to Kelime Oyunu!       │
│                                     │
│   TV-style word guessing game       │
│   Perfect for classrooms            │
│                                     │
│   [Let's Go →]                      │
└─────────────────────────────────────┘
```

**Multi-step flow:**
1. Welcome + intro
2. Quick tutorial (optional skip)
3. Choose first category

**Improvements:**
- Modern hero layout
- Animated illustrations (not emojis)
- Skip option for returning users
- Remember "don't show again" preference
- Smooth page transitions between steps

---

**Implementation Estimate:** 4-6 hours
**Status:** Ready for Implementation

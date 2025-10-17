# Task 16: Skip (Pas Geç) Mechanic

## Description
Implement skip word mechanic with confirmation dialog.

## Requirements from PRD
- **Section:** 4.6 Oyun Mekanikleri → Pas Geçme

## Flow
1. "Pas Geç" butonuna tıkla
2. Onay popup'ı: "Pas geçmek istediğinizden emin misiniz?"
3. [Evet] → 0 puan, sonraki kelime
4. [Hayır] → popup kapat

## Behavior
- Word marked as skipped
- 0 points awarded
- Move to next word
- Whoosh sound effect

## Acceptance Criteria
- [ ] "Pas Geç" button works
- [ ] Confirmation dialog shown
- [ ] Yes: word skipped, 0 points
- [ ] Yes: moves to next word
- [ ] No: dialog closed, game continues
- [ ] Whoosh sound plays on skip
- [ ] Skipped word tracked in results

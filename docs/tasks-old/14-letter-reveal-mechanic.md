# Task 14: Letter Reveal Mechanic

## Description
Implement letter reveal (harf açma) mechanic with animations and point deduction.

## Requirements from PRD
- **Section:** 4.6 Oyun Mekanikleri → Harf Açma

## Flow
1. "Harf Aç" butonuna tıkla
2. Tahmin yapılmamış olmalı (yapıldıysa buton devre dışı)
3. Rastgele kapalı harf seç
4. 3D flip animasyonu (0.6s)
5. Harf görünür hale gel
6. -100 puan kes
7. Pop ses efekti çal
8. Kalan puan güncellenir

## Critical Rules
- ⚠️ **Tahmin yapıldıktan sonra harf alınamaz** (oyun kuralı)
- Tüm harfler açıkken buton devre dışı
- Her harf açma -100 puan

## Acceptance Criteria
- [ ] "Harf Aç" button works
- [ ] Random closed letter selected
- [ ] 3D flip animation plays (0.6s)
- [ ] Letter revealed correctly
- [ ] -100 points deducted
- [ ] Pop sound effect plays
- [ ] Score updated in UI
- [ ] Button disabled after guess made
- [ ] Button disabled when all letters open
- [ ] Animation runs smoothly at 60fps

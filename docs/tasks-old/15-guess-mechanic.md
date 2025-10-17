# Task 15: Guess Mechanic

## Description
Implement guess (tahmin etme) mechanic with popup, validation, and animations.

## Requirements from PRD
- **Section:** 4.6 Oyun Mekanikleri → Tahmin Etme

## Flow
1. "Tahmin Et" butonuna tıkla
2. Modal popup aç:
   - "Yarışmacının cevabı doğru mu?"
   - [✓ Doğru] [✗ Yanlış] butonları
3. **Doğru:**
   - Tüm harfleri aç (animasyonlu)
   - Yeşil yanıp sönme efekti
   - Puan ekle (animasyonlu sayaç)
   - Konfeti animasyonu
   - Başarı sesi
   - 2 saniye bekle
   - Sonraki kelimeye geç
4. **Yanlış:**
   - Ekran kırmızı titre (0.3s)
   - Tahmin hakkı azalt
   - Hata sesi
   - Tahmin hakkı 0 ise → pas geç otomatik
5. **ÖNEMLİ:** Tahmin yapıldıktan sonra yeniden harf alınamaz (oyun kuralı)

## Rules
- Maksimum 3 tahmin hakkı per word
- After guess, letter reveal disabled
- Auto skip if no guesses left

## Acceptance Criteria
- [ ] "Tahmin Et" button opens modal
- [ ] Modal shows correct/wrong buttons
- [ ] Correct: all letters revealed with animation
- [ ] Correct: green flash effect
- [ ] Correct: points added with count-up animation
- [ ] Correct: confetti animation
- [ ] Correct: success sound plays
- [ ] Correct: 2 second delay before next word
- [ ] Wrong: screen shake (red tint)
- [ ] Wrong: guess count decremented
- [ ] Wrong: error sound plays
- [ ] Wrong: auto skip if 0 guesses left
- [ ] Letter reveal disabled after guess

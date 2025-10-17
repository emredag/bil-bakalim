# Task 17: Timer System

## Description
Implement game timer with warnings and auto-end functionality.

## Requirements from PRD
- **Section:** 4.6 Oyun Mekanikleri → Süre Yönetimi

## Timer Rules
- Toplam oyun süresi: 5 dakika (300 saniye) - tüm 14 kelime için
- Süre tüm kelimeler için ortaktır - her kelimede sıfırlanmaz
- Her saniye sayaç güncelle
- Son 30 saniye: Kırmızı renk + nabız animasyonu
- Son 10 saniye: Hızlı yanıp sönme + tick sesi
- Süre 0: Oyun biter (bitirilen kelimeler kadar puan alınır)

## Visual Warnings
- Normal: Blue/white timer
- Last 30 seconds: Red color + pulse animation
- Last 10 seconds: Fast pulse + tick sound every second

## Acceptance Criteria
- [ ] Timer starts at 300 seconds
- [ ] Timer counts down every second
- [ ] Timer shared across all 14 words (no reset)
- [ ] Last 30 sec: red color + pulse animation
- [ ] Last 10 sec: fast pulse + tick sound
- [ ] Timer reaches 0: game ends automatically
- [ ] Completed words count toward final score
- [ ] Timer pauses when game paused

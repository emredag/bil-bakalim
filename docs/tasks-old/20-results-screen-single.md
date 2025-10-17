# Task 20: Results Screen - Single Player

## Description
Implement results screen for single player mode with statistics and word details.

## Requirements from PRD
- **Section:** 4.7 Sonuç Ekranı → Tek Yarışmacı

## Components
- 🎉 Başlık
- Kategori bilgisi
- Yarışmacı adı
- Toplam puan (büyük)
- İstatistikler:
  - Bulunan kelime / Toplam
  - Alınan toplam harf
  - Geçen süre
  - Ortalama süre/kelime
- Detaylı kelime listesi (genişletilebilir):
  - Her kelime için:
    - İsim (harf sayısı)
    - Alınan puan
    - Durum (✅ bulundu / ⏭ pas)
- Aksiyon butonları:
  - 🏠 Ana Menü
  - 🔄 Tekrar Oyna
  - 📊 Geçmiş Yarışmaları Gör

## Auto-Save
- Oyun bittiğinde tüm sonuçlar otomatik olarak veritabanına kaydedilir

## Acceptance Criteria
- [ ] Victory title displayed
- [ ] Category info shown
- [ ] Player name displayed
- [ ] Total score prominently shown
- [ ] Statistics calculated correctly
- [ ] Word list expandable
- [ ] Each word shows: name, points, status
- [ ] Action buttons work (Home, Replay, History)
- [ ] Results auto-saved to database

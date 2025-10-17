# Task 24: Game History Detail Screen

## Description
Implement detailed view of a single game with participant rankings and word results.

## Requirements from PRD
- **Section:** 4.9 Yarışma Detay Ekranı

## Layout
- Başlık: "Yarışma Detayları"
- Üst Bilgiler:
  - 📅 Tarih: "15 Ekim 2025, 14:30"
  - 📦 Kategori: "Genel Kelimeler"
  - 🎮 Mod: "Çoklu Yarışmacı"
  - ⏱️ Toplam Süre: "12:45"

## Participant Rankings
- Tablo formatı:

| Sıra | İsim   | Puan | Bulunan | Pas | Harf |
|------|--------|------|---------|-----|------|
| 🥇 1 | Ahmet  | 850  | 12/14   | 2   | 15   |
| 🥈 2 | Mehmet | 720  | 10/14   | 4   | 18   |
| 🥉 3 | Ayşe   | 680  | 9/14    | 5   | 20   |

## Detailed Word Results
- Her katılımcı için genişletilebilir bölüm
- Her kelimenin durumu:
  - Kelime adı ve harf sayısı
  - Sonuç: ✅ Bulundu / ⏭ Pas / ⏱️ Süre Doldu
  - Alınan puan
  - Kullanılan harf sayısı
  - İpucu

## Action Buttons
- 🔄 Bu Kategoride Tekrar Oyna
- 📊 Kategori İstatistikleri (opsiyonel)
- 🏠 Ana Menü
- ← Geri

## Acceptance Criteria
- [ ] Game details loaded from database
- [ ] Header info displayed correctly
- [ ] Participant table sorted by rank
- [ ] Medal icons for top 3
- [ ] Expandable word results per participant
- [ ] Word status icons correct
- [ ] Points and letters shown per word
- [ ] Hint displayed for each word
- [ ] Replay button starts new game with same category
- [ ] Back button returns to history list

# Task 23: Game History List Screen

## Description
Implement game history list with filtering, sorting, and statistics.

## Requirements from PRD
- **Section:** 4.8 Geçmiş Yarışmalar Ekranı

## Layout Components
- Başlık: "Geçmiş Yarışmalar"
- Filtreleme ve Sıralama:
  - Tarih aralığı seçimi
  - Kategori filtresi (dropdown)
  - Oyun modu filtresi (tek/çoklu/takım)
  - Sıralama: Tarih (yeni→eski), Tarih (eski→yeni), Puan (yüksek→düşük)
- İstatistik Özeti (üst bar):
  - Toplam oyun sayısı
  - En çok oynanan kategori
  - En yüksek puan
  - Toplam oyun süresi
- Yarışma Listesi (tablo veya kartlar):
  - Her yarışma için:
    - 📅 Tarih ve saat
    - 📦 Kategori (emoji + isim)
    - 🎮 Oyun modu
    - 👤 Katılımcı sayısı
    - 🏆 Kazanan (en yüksek puan)
    - ⏱️ Süre
    - [🔍 Detay Gör] butonu
- Sayfalama (10/25/50 kayıt)
- Alt Aksiyonlar:
  - [📥 Tüm Geçmişi Dışa Aktar] butonu (JSON formatında)
  - [🗑️ Tüm Geçmişi Sil] butonu (onay ile)
- Geri butonu

## Empty State
- "Henüz hiç yarışma yapılmamış"
- "İlk yarışmanızı başlatın!" mesajı
- [Yarışma Başlat] butonu

## Acceptance Criteria
- [ ] Game history loaded from database
- [ ] Date range filter works
- [ ] Category filter works
- [ ] Game mode filter works
- [ ] Sorting options work
- [ ] Statistics summary displayed correctly
- [ ] Game cards/rows show all info
- [ ] Detail button navigates to detail screen
- [ ] Pagination works (10/25/50 per page)
- [ ] Export all history to JSON
- [ ] Delete all with confirmation
- [ ] Empty state shown when no history

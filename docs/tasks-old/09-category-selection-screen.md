# Task 09: Category Selection Screen

## Description
Implement category selection screen with category cards and validation status.

## Requirements from PRD
- **Section:** 4.2 Kategori Seçim Ekranı

## Components
- Başlık: "Kategori Seçin"
- Kategori kartları (kaydırılabilir grid):
  - Emoji ve isim (büyük)
  - Kelime sayısı
  - Oynanabilirlik durumu (badge)
  - "Oyna" butonu (aktif/pasif)
- Boş durum mesajı (kategori yoksa)
- "Yeni Kategori Oluştur" butonu (hızlı erişim)
- Geri butonu

## Card Design
```
┌────────────────────────┐
│   ⚽                   │
│   Spor                │
│                       │
│   18 kelime           │
│   ✅ Oynanabilir      │
│                       │
│   [Oyna →]            │
└────────────────────────┘
```

## Validation Display
- ✅ Oynanabilir (yeşil)
- ⚠️ Kısmi oynanabilir (sarı)
- ❌ Oynanamaz (kırmızı)

## Acceptance Criteria
- [ ] Categories loaded from database
- [ ] Category cards display correctly
- [ ] Validation status shown accurately
- [ ] Play button enabled/disabled based on validation
- [ ] Empty state message shown when no categories
- [ ] Quick create button works
- [ ] Back button navigates correctly
- [ ] Scrollable grid layout

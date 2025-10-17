# Task 25: Category Management Screen

## Description
Implement category management screen with list, search, and CRUD actions.

## Requirements from PRD
- **Section:** 5.1 Ana Kategori Yönetim Ekranı

## Layout
- Başlık: "Kategori Yönetimi"
- "Yeni Kategori Oluştur" butonu (üstte, büyük)
- Arama/Filtreleme çubuğu
- Kategori listesi (grid veya liste):
  - Her kategori için kart:
    - Emoji ve isim
    - Kelime sayısı
    - Oynanabilirlik durumu
    - Aksiyonlar:
      - 👁️ Kelimeleri Gör
      - ✏️ Düzenle
      - 🗑️ Sil (varsayılan kategori hariç)
- Boş durum mesajı
- Geri butonu

## Category Card Design
```
┌─────────────────────────────────┐
│ ⚽ Spor                          │
│ 18 kelime | ✅ Oynanabilir      │
│ "Spor ve aktivite terimleri"    │
│                                 │
│ [👁️ Gör] [✏️ Düzenle] [🗑️ Sil]  │
└─────────────────────────────────┘
```

## Acceptance Criteria
- [ ] Categories loaded from database
- [ ] Create button opens creation modal
- [ ] Search/filter works
- [ ] Category cards display correctly
- [ ] View button navigates to word management
- [ ] Edit button opens edit modal
- [ ] Delete button works (with confirmation)
- [ ] Default category cannot be deleted
- [ ] Empty state shown if no categories
- [ ] Back button works

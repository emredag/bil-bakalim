# Task 27: Word Management Screen

## Description
Implement word management screen for a category with CRUD operations and validation display.

## Requirements from PRD
- **Section:** 5.3 Kategori Kelime Yönetimi

## Layout
- Başlık: "[Emoji] [Kategori Adı] - Kelime Yönetimi"
- Üst bar:
  - "Yeni Kelime Ekle" butonu
  - "JSON'dan İçe Aktar" butonu
  - Arama çubuğu
- Kelime listesi (tablo veya kart):
  - Kelime (büyük harf)
  - Harf sayısı
  - İpucu
  - Aksiyonlar: [✏️ Düzenle] [🗑️ Sil]
- Sağ sidebar: Dağılım Kontrolü
  - Her harf uzunluğu için (4-10):
    - "4 harf: 2 ✅" (yeterli - yeşil)
    - "5 harf: 1 ❌" (yetersiz - kırmızı)
  - Toplam kelime sayısı
  - Oynanabilirlik durumu (büyük badge)
- Alt bar:
  - "JSON Dışa Aktar" butonu
  - "Geri" butonu

## Word Table Row
```
| Kelime    | Harf | İpucu                      | Aksiyon      |
|-----------|------|----------------------------|--------------|
| COMPUTER  | 8    | Elektronik hesaplama cihazı| [✏️] [🗑️]  |
```

## Acceptance Criteria
- [ ] Category name and emoji in header
- [ ] Add word button opens creation modal
- [ ] Import JSON button works
- [ ] Search filters word list
- [ ] Words displayed in table/cards
- [ ] Edit button opens edit modal
- [ ] Delete button works with confirmation
- [ ] Distribution sidebar shows counts per length
- [ ] Green/red indicators for sufficient/insufficient
- [ ] Total word count displayed
- [ ] Playability status badge shown
- [ ] Export JSON button works
- [ ] Back button returns to category list

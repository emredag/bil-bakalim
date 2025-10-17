# Task 30: JSON Import/Export

## Description
Implement JSON import/export functionality for categories and words.

## Requirements from PRD
- **Section:** 5.7 JSON Import/Export

## Export
- "JSON Dışa Aktar" butonuna tıkla
- Tauri Dialog API ile kaydetme konumu seç
- Varsayılan dosya adı: `[kategori-adi].json`
- Format:
```json
{
  "category": {
    "name": "Spor",
    "emoji": "⚽",
    "description": "Spor ve aktivite terimleri"
  },
  "words": [
    {
      "word": "FOOTBALL",
      "letter_count": 8,
      "hint": "11 kişiyle oynanan takım sporu"
    }
  ]
}
```
- Başarı toast'ı

## Import
- "JSON'dan İçe Aktar" butonuna tıkla
- Tauri Dialog API ile dosya seç
- JSON formatı valide edilir:
  - Schema kontrolü
  - Kelime formatı kontrolü (harf sayısı, A-Z)
- Validasyon hataları gösterilir
- Başarılı: Kelimeler eklenir (duplicate'ler atlanır)
- Toast mesajı: "X kelime eklendi, Y kelime zaten vardı"

## Acceptance Criteria
- [ ] Export button opens save dialog
- [ ] Default filename suggested
- [ ] JSON exported in correct format
- [ ] All category and word data included
- [ ] Success toast shown after export
- [ ] Import button opens file dialog
- [ ] JSON schema validated
- [ ] Word format validated (A-Z, 4-10 chars)
- [ ] Duplicate words skipped
- [ ] Import success message shows counts
- [ ] Error messages for invalid JSON

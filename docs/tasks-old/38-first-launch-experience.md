# Task 38: First Launch Experience

## Description
Implement first launch detection and welcome screen.

## Requirements from PRD
- **Section:** 13.1 İlk Kurulum Akışı

## First Launch Flow

### 1. Veritabanı Kontrolü
- `~/.local/share/kelime-oyunu/` dizinini kontrol et
- `kelime-oyunu.db` dosyası var mı?

### 2. Veritabanı Oluşturma (yoksa)
- SQLite veritabanı oluştur
- Tabloları oluştur (schema)
- Varsayılan kategoriyi ekle (70 kelimeyle)
- Varsayılan ayarları kaydet

### 3. Hoş Geldiniz Ekranı
- "Kelime Oyunu'na Hoş Geldiniz!" mesajı
- Kısa tanıtım
- "Hemen Başla" butonu → Ana Menü

## Acceptance Criteria
- [ ] Database existence checked on launch
- [ ] If no DB, create with schema
- [ ] Default category with 70 words seeded
- [ ] Default settings saved
- [ ] Welcome screen shown on first launch only
- [ ] Welcome screen skipped on subsequent launches
- [ ] "Start" button navigates to main menu
- [ ] Database location correct for platform

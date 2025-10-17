# Task 03: Initial Data Seeding

## Description
Populate database with default category "Genel Kelimeler" and 70 words, plus default settings.

## Requirements from PRD
- **Section:** 12. BAŞLANGIÇ VERİLERİ → 12.1 Genel Kelimeler Kategorisi (70 Kelime)
- **Section:** 13.3 Varsayılan Veri Ekleme

## Default Category
- **İsim:** "Genel Kelimeler"
- **Emoji:** 📦
- **Açıklama:** "Günlük yaşamda sık kullanılan genel kelimeler - İngilizce öğrenimi için temel kelimeler"
- **Varsayılan:** true
- **Silinemez:** true

## Word Distribution (70 words total)
- **4 Harfli:** 10 kelime
- **5 Harfli:** 10 kelime
- **6 Harfli:** 10 kelime
- **7 Harfli:** 10 kelime
- **8 Harfli:** 10 kelime
- **9 Harfli:** 10 kelime
- **10 Harfli:** 10 kelime

## Example Words (4 harfli)
1. BOOK - "Kitap - okumak için kullanılan basılı eser"
2. GAME - "Oyun - eğlence amaçlı oynanan aktivite"
3. TIME - "Zaman - olayların sırası ve süresi"
4. LOVE - "Sevgi, aşk - güçlü duygusal bağ"
5. MEAL - "Öğün - sabah, öğle veya akşam yemeği"
6. ROAD - "Yol - araçların ve insanların geçtiği güzergah"
7. COLD - "Soğuk - düşük sıcaklık"
8. WORD - "Kelime - anlamlı harf grubu"
9. ROOM - "Oda - binanın bir bölümü"
10. RAIN - "Yağmur - gökten düşen su damlacıkları"

(See PRD Section 12.1 for complete list of all 70 words)

## Default Settings
- sound_enabled: true
- default_time: 300
- default_guesses: 3
- animation_speed: normal

## Acceptance Criteria
- [ ] Default category "Genel Kelimeler" created
- [ ] All 70 words inserted with correct hints
- [ ] Each letter count (4-10) has exactly 10 words
- [ ] Default settings saved
- [ ] Category marked as is_default=true

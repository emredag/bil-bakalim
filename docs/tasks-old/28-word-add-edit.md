# Task 28: Word Add and Edit

## Description
Implement word creation and editing modals with validation.

## Requirements from PRD
- **Section:** 5.4 Yeni Kelime Ekleme
- **Section:** 5.5 Kelime Düzenleme

## Add Word Modal
- Başlık: "Yeni Kelime Ekle"
- Form alanları:
  - Kelime (zorunlu, otomatik büyük harf, sadece A-Z)
    - Gerçek zamanlı harf sayısı gösterimi
    - Karakter kısıtı: 4-10
  - İpucu (zorunlu, max 100 karakter)
    - Türkçe açıklama/tanım
- Bilgi kutusu:
  - "Bu kategoride 8 harfli 2 kelime var, 3. eklenecek"
  - Renk kodu: Yeşil (yeterli), Kırmızı (ilk kelime)
- Butonlar:
  - "Kaydet" (primary)
  - "İptal" (secondary)

## Edit Word Modal
- Başlık: "Kelime Düzenle"
- Form alanları aynı (kelime, ipucu)
- Kelime değiştirilebilir (benzersizlik kontrolü)
- İpucu değiştirilebilir
- Butonlar: "Güncelle" / "İptal"

## Validation
- Kelime benzersiz olmalı (kategori içinde)
- Sadece harf (A-Z)
- 4-10 karakter arası
- İpucu boş olmamalı
- Başarılı kayıt: Toast mesajı + liste güncellenir

## Acceptance Criteria
- [ ] Add modal opens correctly
- [ ] Word input auto-uppercase
- [ ] Only A-Z letters allowed
- [ ] Character count shown in real-time
- [ ] 4-10 character validation
- [ ] Hint required (max 100 chars)
- [ ] Info box shows current count for letter length
- [ ] Duplicate check within category
- [ ] Save button adds to database
- [ ] Edit modal pre-fills with existing data
- [ ] Update button saves changes
- [ ] Toast notification on success
- [ ] Word list refreshes after save

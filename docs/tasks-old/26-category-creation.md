# Task 26: Category Creation

## Description
Implement category creation modal with name, emoji, and description inputs.

## Requirements from PRD
- **Section:** 5.2 Yeni Kategori Oluşturma

## Modal/Page
- Başlık: "Yeni Kategori Oluştur"
- Form alanları:
  - Kategori Adı (zorunlu, max 50 karakter)
  - Emoji Seçici:
    - Grid düzeni (8x6)
    - Popüler emojiler: ⚽ 🍕 💻 📚 🏠 🌍 🎮 🎵 🎨 🚗 ✈️ 🏥
    - Seçilen emoji vurgulanır
  - Açıklama (opsiyonel, max 200 karakter)
- Önizleme kartı (sağda)
- Butonlar:
  - "Oluştur ve Kelime Ekle" (primary)
  - "İptal" (secondary)

## Validation
- Kategori adı benzersiz olmalı
- Emoji seçilmeli
- Başarılı oluşturma sonrası → Kelime yönetim ekranına git

## Acceptance Criteria
- [ ] Modal opens correctly
- [ ] Name input validates (required, max 50)
- [ ] Emoji picker shows grid of emojis
- [ ] Selected emoji highlighted
- [ ] Description optional (max 200)
- [ ] Preview card updates in real-time
- [ ] Duplicate name check
- [ ] Create button saves to database
- [ ] Navigate to word management after creation
- [ ] Cancel button closes modal

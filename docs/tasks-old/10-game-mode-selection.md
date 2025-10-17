# Task 10: Game Mode Selection

## Description
Implement game mode selection with validation based on category word count.

## Requirements from PRD
- **Section:** 4.3 Mod Seçimi

## 3 Game Modes

### 👤 Tek Yarışmacı
- Tek kişi oynar
- 14 kelime ile yarışır
- Süre tutulur
- Puan hesaplanır
- Özet ekran

### 👥 Çoklu Yarışmacı (2-6 kişi)
- Sırayla oynarlar
- Her yarışmacıya FARKLI 14 kelime verilir
- Kategori (yarışmacı sayısı × 14) kelime içermelidir
- Puan sıralaması yapılır
- Kazanan belirlenir

### 🏆 Takım Yarışması (2-4 takım)
- Her takıma oyuncular atanır
- Takımlar sırayla oynar
- Her takıma FARKLI 14 kelime verilir
- Kategori (takım sayısı × 14) kelime içermelidir
- Takım puanları toplanır
- Kazanan takım belirlenir

## Mode Validation
- Kategori kelime sayısı kontrol edilir
- Yetersiz kelime varsa mod devre dışı bırakılır
- "Bu mod için en az X kelime gerekli" uyarısı gösterilir

## UI Features
- Mod kartları (büyük, görsel)
- Her mod için kısa açıklama + gerekli kelime sayısı
- Devre dışı modlar soluk gösterilir
- Seçim sonrası isim girişi
- Geri ve İleri butonları

## Acceptance Criteria
- [ ] All 3 modes displayed as cards
- [ ] Mode validation based on category word count
- [ ] Disabled modes shown dimmed
- [ ] Warning messages for insufficient words
- [ ] Navigation to participant setup
- [ ] Back button works

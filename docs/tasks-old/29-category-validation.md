# Task 29: Category Validation System

## Description
Implement comprehensive category validation for different game modes.

## Requirements from PRD
- **Section:** 3.3 Kategori Validasyonu

## Validation Criteria

### Tek Yarışmacı Modu
- ✅ Toplam EN AZ 14 kelime olmalı (daha fazla olabilir, yüzlerce kelime bile)
- ✅ Her harf uzunluğundan (4,5,6,7,8,9,10) EN AZ 2'şer kelime olmalı

### Çoklu Yarışmacı Modu
- ✅ Toplam EN AZ (Yarışmacı Sayısı × 14) kelime olmalı
- ✅ Her harf uzunluğundan EN AZ (Yarışmacı Sayısı × 2) kelime olmalı
- Örnek: 3 yarışmacı → minimum 42 kelime (her uzunluktan 6'şar)

### Takım Yarışması Modu
- ✅ Toplam EN AZ (Takım Sayısı × 14) kelime olmalı
- ✅ Her harf uzunluğundan EN AZ (Takım Sayısı × 2) kelime olmalı
- Örnek: 2 takım → minimum 28 kelime (her uzunluktan 4'er)

## Validation Messages
- "✅ Tek yarışmacı için oynanabilir (14+ kelime)" (yeşil)
- "✅ 3 yarışmacıya kadar oynanabilir (42+ kelime)" (yeşil)
- "⚠️ Sadece tek yarışmacı modu için yeterli (42 kelime gerekli çoklu mod için)" (sarı)
- "❌ Oynanamaz: X harfli kelime sayısı yetersiz (en az 2 olmalı)" (kırmızı)
- "⚠️ Dikkat: Toplam X kelime, en az 14 kelime gerekli" (sarı)

## UI Behavior
- Kategori kartında kaç kişilik oynanabileceği gösterilir
- Yetersiz kelime varsa ilgili modlar devre dışı bırakılır
- Tooltip'te eksik bilgiler detaylı gösterilir
- Kategori yönetim ekranında eksik bilgiler vurgulanır

## Acceptance Criteria
- [ ] Validation function checks total word count
- [ ] Validation checks words per letter length
- [ ] Single player mode validation (14 words minimum)
- [ ] Multi player mode validation (participants × 14)
- [ ] Team mode validation (teams × 14)
- [ ] Correct validation messages shown
- [ ] Color coding (green/yellow/red) applied
- [ ] Modes disabled when insufficient words
- [ ] Tooltips show detailed missing info
- [ ] Real-time validation as words added/removed

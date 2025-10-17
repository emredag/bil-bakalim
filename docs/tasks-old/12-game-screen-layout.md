# Task 12: Game Screen Layout

## Description
Create main game screen layout optimized for 1920x1080 with all UI components.

## Requirements from PRD
- **Section:** 4.5 Oyun Ekranı (Ana Oyun)

## Layout (1920x1080 optimize)

### Üst Header (120px)
- Kategori adı ve emoji (sol)
- Süre sayacı (ortada, büyük)
- Puan ve ilerleme (sağ)
- Yarışmacı adı (mod bazlı)

### Kelime Alanı (500px, merkezi)
- Harf kutuları (büyük, eşit aralıklı)
- Kapalı: Koyu arka plan, "?" işareti
- Açık: Altın rengi arka plan, harf
- Animasyon: 3D flip

### İpucu Bölgesi (100px)
- İpucu metni (büyük, okunabilir)
- 💡 ikonu
- Çerçeve ile vurgulanmış

### Kontrol Paneli (280px)
- 3 ana buton (yan yana):
  - 🔤 Harf Aç
  - ✓ Tahmin Et
  - → Pas Geç
- Bilgi satırı:
  - Kalan tahmin hakkı
  - Alınan harf sayısı
  - Kalan puan
- Yan kontroller:
  - ⏸ Duraklat
  - 🔇 Ses
  - 🏠 Ana Menü

### Alt Bar (60px)
- Kelime ilerlemesi: "6 / 14"
- Kategori açıklaması (küçük)

## Acceptance Criteria
- [ ] Header displays category, timer, score
- [ ] Letter boxes render correctly
- [ ] Closed letters show "?"
- [ ] Open letters show actual letter
- [ ] Hint section displays prominently
- [ ] Control panel with 3 main buttons
- [ ] Info line shows remaining guesses, letters, points
- [ ] Side controls for pause, sound, home
- [ ] Progress bar shows word count
- [ ] Layout responsive to window size
- [ ] Optimized for 1920x1080

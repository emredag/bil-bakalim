# Task 31: Settings Screen

## Description
Implement settings screen with game options, data management, and app info.

## Requirements from PRD
- **Section:** 6. AYARLAR EKRANI

## Genel Ayarlar
- Ses Efektleri: [ON/OFF toggle]
- Tam Ekran Başlat: [ON/OFF toggle]
- Dil: [Türkçe] (gelecek güncellemeler için)

## Oyun Ayarları
- Varsayılan Süre: [5 dakika / 300 saniye] (sabit - oyun kurallarına göre)
- Varsayılan Tahmin Hakkı: [3] (sabit - her kelime için maksimum 3 tahmin)
- Animasyon Hızı: [Normal] (dropdown: Yavaş, Normal, Hızlı)

**NOT:** Süre ve tahmin hakkı oyun kurallarına göre sabittir, değiştirilemez.

## Veri Yönetimi
- [Veritabanını Yedekle] butonu
  - SQLite dosyasını dışa aktar
- [Veritabanını Geri Yükle] butonu
  - SQLite dosyasını içe aktar
- [Tüm Verileri Sıfırla] butonu
  - Onay dialog'u
  - Varsayılan kategoriye dön

## Hakkında
- Uygulama adı ve versiyonu
- Açık kaynak lisans bilgisi
- GitHub repo linki
- Katkıda bulunanlar (opsiyonel)

## Acceptance Criteria
- [ ] Sound effects toggle works
- [ ] Fullscreen on start toggle works
- [ ] Language selector (currently Türkçe only)
- [ ] Default time displayed (read-only)
- [ ] Default guesses displayed (read-only)
- [ ] Animation speed dropdown works
- [ ] Backup database button exports SQLite file
- [ ] Restore database button imports SQLite file
- [ ] Reset all data with confirmation dialog
- [ ] App name and version displayed
- [ ] License info shown
- [ ] GitHub link clickable
- [ ] Settings persist across app restarts

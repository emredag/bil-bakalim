# Bil Bakalım

> Eğitici ve eğlenceli Türkçe kelime tahmin oyunu - TV yarışma deneyimi

Bil Bakalım, sınıf içi eğitim ve yarışmalar için tasarlanmış modern bir masaüstü uygulamasıdır. Tauri, React ve TypeScript kullanılarak geliştirilmiş olup, büyük ekranlarda ve projektörlerde mükemmel görünüm ve performans sağlar.

## 🎯 Özellikler

### Oyun Modları
- **Tek Oyunculu Mod:** Kendi rekorunuzu kırmaya çalışın
- **Çoklu Oyuncu Modu:** 2-6 kişiyle yarışın
- **Takım Modu:** 2-4 takım halinde mücadele edin

### Oyun Mekaniği
- Her oyunda 14 kelime (4-10 harf arası, her harf uzunluğundan 2'şer kelime)
- 5 dakika (300 saniye) toplam süre
- Kelime başına 3 tahmin hakkı
- Harf açma sistemi (her harf -100 puan)
- Dinamik puanlama (harf_sayısı × 100 baz puan)
- İpucu desteği

### Kategori ve Kelime Yönetimi
- Sınırsız kategori oluşturma
- Kategori başına sınırsız kelime
- Emoji ile kategori personalizasyonu
- JSON formatında içe/dışa aktarma
- Otomatik kategori doğrulama (oyun modlarına göre kelime yeterliliği)

### Oyun Geçmişi ve İstatistikler
- Tüm oyunların otomatik kaydı
- Detaylı katılımcı istatistikleri
- Kelime bazında sonuç takibi
- Filtreleme ve arama özellikleri

### Kullanıcı Deneyimi
- **Responsive tasarım:** Küçük laptop'tan büyük TV'lere uyumlu
- **TV yarışma estetiği:** Yüksek kontrast, büyük tipografi, dramatik animasyonlar
- **Tam klavye desteği:** Tüm önemli işlemler için kısayollar
- **Sesli geri bildirim:** Dinamik ses efektleri ve bildirimler
- **Erişilebilirlik:** WCAG 2.1 AA uyumlu, ekran okuyucu desteği
- **Karanlık tema:** Göz yormayan modern arayüz

### Teknik Özellikler
- Yerli masaüstü uygulaması (Windows, macOS, Linux)
- Yerelde SQLite veritabanı (veri gizliliği)
- Offline çalışma
- Veritabanı yedekleme/geri yükleme
- Düşük sistem gereksinimleri

## 🚀 Kurulum

### Son Kullanıcılar İçin

1. [Releases](https://github.com/emredag/bil-bakalim/releases) sayfasından platformunuza uygun kurulum dosyasını indirin:
   - **Windows:** `Bil.Bakalim_1.0.0_x64-setup.exe` veya `Bil.Bakalim_1.0.0_x64_en-US.msi`
   - **macOS:** `Bil.Bakalim_1.0.0_x64.dmg`
   - **Linux:** `bil-bakalim_1.0.0_amd64.deb` veya `bil-bakalim_1.0.0_amd64.AppImage`

2. Kurulum dosyasını çalıştırın ve yönergeleri takip edin

3. Uygulamayı başlatın ve oynamaya başlayın!

### Geliştiriciler İçin

#### Gereksinimler
- **Node.js:** 18.x veya üzeri
- **Rust:** 1.70 veya üzeri
- **npm** veya **pnpm**

#### Kurulum Adımları

```bash
# Repository'yi klonlayın
git clone https://github.com/emredag/bil-bakalim.git
cd bil-bakalim

# Bağımlılıkları yükleyin
npm install

# Geliştirme modunda çalıştırın
npm run tauri dev
```

#### Build Komutları

```bash
# Production build (tüm platformlar)
npm run tauri build

# Sadece frontend build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Rust linting
npm run lint:rust

# Formatting
npm run format
npm run format:check

# Testing
npm run test
npm run test:coverage

# Tüm kalite kontrolleri
npm run quality:check
```

## 📖 Kullanım

### Hızlı Başlangıç

1. **İlk Açılış:** Uygulama ilk açılışta varsayılan kategoriler ve kelimelerle gelir
2. **Kategori Seçin:** Ana menüden "Yarışma Başlat" → Kategori seçin
3. **Mod Seçin:** Tek oyunculu, çoklu oyuncu veya takım modu seçin
4. **Katılımcıları Ekleyin:** Oyuncu/takım isimlerini girin
5. **Oynayın:** Kelimeleri tahmin edin, harf açın, puan kazanın!

### Klavye Kısayolları

Oyun sırasında:
- `H` - Harf aç
- `D` - Kelimeyi doğru bildiniz
- `Y` - Kelimeyi yanlış bildiniz
- `P` - Pas geç
- `Space` - Duraklat
- `M` - Ses aç/kapat
- `Esc` - Ana menü

Dialog'larda:
- `Enter` - Onayla
- `Esc` - İptal

### Kategori ve Kelime Yönetimi

1. Ana menüden "Kategori Yönetimi"ni açın
2. Yeni kategori oluşturun (emoji seçebilirsiniz)
3. Kategoriye kelimeler ekleyin (4-10 harf arası)
4. İpuçlarını ekleyin (opsiyonel)

**JSON İçe/Dışa Aktarma:**
```json
{
  "name": "Kategori Adı",
  "emoji": "📚",
  "description": "Kategori açıklaması",
  "words": [
    {
      "word": "KELIME",
      "hint": "İpucu metni"
    }
  ]
}
```

## 🏗️ Teknoloji Stack

### Frontend
- **React** 18.3.1 - UI kütüphanesi
- **TypeScript** 5.6.2 - Tip güvenliği
- **Tailwind CSS** 3.4.18 - Styling
- **Framer Motion** 12.23.24 - Animasyonlar
- **Zustand** 5.0.8 - State yönetimi
- **React Router** 7.9.4 - Routing
- **Lucide React** 0.546.0 - İkonlar
- **Vite** 6.0.3 - Build tool

### Backend
- **Tauri** 2.x - Desktop framework
- **Rust** - Backend runtime
- **SQLite** (rusqlite 0.32) - Veritabanı
- **Web Audio API** - Ses sistemi

### Testing & Quality
- **Vitest** 4.0.5 - Test framework
- **React Testing Library** 16.3.0 - Component testing
- **ESLint** 8.57.1 - JavaScript/TypeScript linting
- **Clippy** - Rust linting
- **Prettier** 3.6.2 - Code formatting
- **Husky** 9.1.7 - Git hooks

## 📚 Dokümantasyon

### Kullanıcılar İçin
- **[Kullanıcı Rehberi](docs/USER_GUIDE.md)** - Detaylı kullanım kılavuzu ve özellikler

### Geliştiriciler İçin
- **[Geliştirici Rehberi](docs/DEVELOPER_GUIDE.md)** - Kurulum, mimari ve geliştirme
- **[API Dokümantasyonu](docs/API.md)** - Tauri komutları referansı
- **[Mimari Dokümanı](docs/ARCHITECTURE.md)** - Sistem mimarisi ve veri akışı
- **[Kod Kalitesi](docs/CODE_QUALITY.md)** - Kod standartları ve araçlar
- **[Katkıda Bulunma](CONTRIBUTING.md)** - Katkı rehberi ve süreçleri
- **[Code Signing Policy](CODE_SIGNING_POLICY.md)** - İmzalama politikası
- **[Güvenlik Politikası](SECURITY.md)** - Güvenlik raporlama

### Proje Bilgisi
- **[Değişiklik Günlüğü](CHANGELOG.md)** - Sürüm notları ve geçmiş
- **[Arşiv Dokümanları](docs/archive/)** - Tarihsel tasarım ve planlama belgeleri

## 🧪 Testing

```bash
# Tüm testleri çalıştır
npm run test

# UI ile testleri çalıştır
npm run test:ui

# Coverage raporu
npm run test:coverage

# Sadece bir kez çalıştır (CI için)
npm run test:run
```

Test coverage hedefi: %80+

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

### Geliştirme Süreci

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesajı Formatı

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type'lar:** feat, fix, docs, style, refactor, test, chore

**Örnek:**
```
feat(game): add letter reveal animation

Added smooth flip animation when revealing letters
using Framer Motion

Closes #123
```

## 🐛 Sorun Bildirimi

Hata bulduysanız veya öneriniz varsa [GitHub Issues](https://github.com/emredag/bil-bakalim/issues) sayfasından bildirebilirsiniz.

## � Code Signing

**Free code signing provided by [SignPath.io](https://signpath.io), certificate by SignPath Foundation**

All releases are signed with a certificate issued to SignPath Foundation for open source projects. For details, see our [Code Signing Policy](CODE_SIGNING_POLICY.md).

**Team Roles:**
- **Committers and Reviewers:** [Emre Dağ](https://github.com/emredag)
- **Approvers:** [Emre Dağ](https://github.com/emredag)

**Privacy Policy:** This program will not transfer any information to other networked systems unless specifically requested by the user or the person installing or operating it. See [Code Signing Policy](CODE_SIGNING_POLICY.md) for full privacy details.

---

## �📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

Copyright (c) 2025 Emre Dağ

## 🙏 Teşekkürler

- [Tauri](https://tauri.app/) - Harika desktop framework
- [React](https://react.dev/) - UI kütüphanesi
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animasyon kütüphanesi
- Tüm açık kaynak katkıda bulunanlara

## 📞 İletişim

- **GitHub:** [@emredag](https://github.com/emredag)
- **Repository:** [bil-bakalim](https://github.com/emredag/bil-bakalim)
- **Issues:** [GitHub Issues](https://github.com/emredag/bil-bakalim/issues)

---

**Not:** Bu uygulama eğitim amaçlı geliştirilmiştir ve sınıf içi kullanım için optimize edilmiştir.

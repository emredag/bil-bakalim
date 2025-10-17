# Kelime Oyunu - Development Tasks

Bu klasör, **Kelime Oyunu** projesinin baştan sona tamamlanması için gereken tüm görevleri içerir.

## 📋 Genel Bakış

- **Toplam Task Sayısı:** 47 + 1 Index
- **Kaynak:** `/docs/PRD.md` - Product Requirements Document
- **Kapsam:** Proje kurulumundan build alımına kadar tüm süreç
- **PRD Uyumluluğu:** %100 - Hiçbir ekleme veya çıkarma yapılmamıştır

## 🎯 Önemli Notlar

### ✅ PRD Sadakati
- Her task PRD'deki bir bölüme karşılık gelir
- PRD'de olmayan hiçbir özellik eklenmemiştir
- PRD'deki hiçbir gereksinim atlanmamıştır
- Her task dosyasında ilgili PRD bölüm numarası belirtilmiştir

### 🎮 Kritik Oyun Kuralları

Aşağıdaki kurallar PRD Section 1'den alınmıştır ve **mutlaka** uygulanmalıdır:

1. Her oyuncuya **14 kelime** verilir (her uzunluktan 2'şer: 4-10 harf)
2. Çoklu/takım modunda **her katılımcıya farklı kelimeler** verilir
3. Toplam süre: **5 dakika (300 saniye)** - tüm kelimeler için ortak
4. Her kelime için **maksimum 3 tahmin hakkı**
5. Her harf açma **-100 puan** ceza
6. ⚠️ **TAHMİN YAPILDIKTAN SONRA HARF ALINAMAZ** (KRİTİK!)
7. Eşitlik: Puan → Az harf → Hızlı bitiren

## 📚 Nasıl Kullanılır?

### 1. Index'i Okuyun
Başlamadan önce `00-INDEX.md` dosyasını okuyun. Bu dosya:
- Tüm taskların kategorize listesini
- Geliştirme fazlarını
- Task bağımlılıklarını
içerir.

### 2. Task Dosyalarını İnceleyin
Her task dosyası şunları içerir:
- **Description:** Task açıklaması
- **Requirements from PRD:** PRD'deki ilgili bölüm referansı
- **Detailed Requirements:** Detaylı gereksinimler
- **Acceptance Criteria:** Tamamlanma kriterleri

### 3. Sırayla İlerleyin
Tasklar numaralandırılmış sırada ilerlemek için tasarlanmıştır, ancak bazı tasklar paralel çalışılabilir.

## 🗂️ Task Kategorileri

| Kategori | Task Aralığı | Açıklama |
|----------|--------------|----------|
| **Project Setup** | 01-04 | Proje kurulumu, veritabanı, backend |
| **UI/UX Foundation** | 05-07 | Tasarım sistemi, animasyonlar, ses |
| **Main Screens** | 08-12 | Ana menü, kategori seçimi, oyun ekranı |
| **Game Mechanics** | 13-19 | Oyun mekanikleri, puanlama |
| **Results & History** | 20-24 | Sonuç ekranları, geçmiş |
| **Management** | 25-30 | Kategori/kelime yönetimi |
| **Settings & Help** | 31-32 | Ayarlar, nasıl oynanır |
| **Enhancements** | 33-39 | Klavye, erişilebilirlik, routing |
| **Polish & Deploy** | 40-47 | Optimizasyon, test, build |

## 📊 İlerleme Takibi

Her task dosyasındaki "Acceptance Criteria" bölümünü kullanarak ilerlemenizi takip edebilirsiniz:

```markdown
## Acceptance Criteria
- [ ] Kriter 1
- [ ] Kriter 2
- [x] Tamamlanan kriter
```

## 🔗 Bağımlılıklar

Bazı tasklar diğerlerine bağımlıdır:

- Task 05 (UI Design) → Task 08-12 (Screens) için gerekli
- Task 04 (Backend Commands) → Tüm veri işlemleri için gerekli
- Task 13 (Word Selection) → Task 14-19 (Game Mechanics) için gerekli
- Task 36 (State Management) → Tüm screens için gerekli

## 🎯 Performans Hedefleri

PRD Section 2.3 ve 19.2'den:
- Uygulama başlatma: < 3 saniye
- Kategori yükleme: < 500ms
- Harf açma latency: < 50ms
- Animasyonlar: 60 FPS
- Bellek kullanımı: < 150 MB

## ✅ Test Coverage Hedefleri

PRD Section 19.3'ten:
- Unit tests: > %80
- Integration tests: > %60
- E2E tests: Kritik akışlar

## 📖 Referanslar

- **PRD:** `/docs/PRD.md`
- **Oyun Kuralları:** `/docs/oyun-kuralları.md`
- **Index:** `00-INDEX.md`

## 🚀 Başlamak İçin

1. `00-INDEX.md` dosyasını okuyun
2. Task 01'den başlayın
3. Her task için PRD'deki ilgili bölümü inceleyin
4. Acceptance criteria'ları tamamlayın
5. Sıradaki task'a geçin

---

**Not:** Bu tasklar tamamen PRD'ye dayalıdır. PRD'de olmayan hiçbir özellik eklenmemiş, PRD'deki hiçbir gereksinim atlanmamıştır.

**Generated:** 2025-10-17
**Source:** `/docs/PRD.md`

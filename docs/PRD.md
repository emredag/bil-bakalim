# KELİME OYUNU - PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. PROJE ÖZETİ

**Proje Adı:** Kelime Oyunu  
**Platform:** Masaüstü Uygulaması (Tauri Framework)  
**Kullanım Alanı:** Eğitim kurumları, sınıf içi yarışmalar, etkinlikler  
**Hedef Kitle:** Öğretmenler, eğitimciler, öğrenciler  
**Lisans:** MIT License (Open Source)  
**Ana Özellik:** Kategoriye dayalı interaktif kelime tahmin yarışması

**Temel Kullanım Senaryosu:**  
Bir öğretmen ders konusuna özel kelime kategorisi oluşturur (Spor, Yiyecek, Teknoloji vb.) ve o kategorideki kelimelerle sınıf içinde yarışma düzenler. Yarışmacılar kapalı harflerden oluşan kelimeleri ipuçları yardımıyla tahmin etmeye çalışır.

**Oyun Kuralları (Ana Hatlar):**
- 📝 Her oyuncuya **14 kelime** verilir (her uzunluktan 2'şer: 4-10 harf)
- 🔄 Çoklu/takım modunda **her katılımcıya farklı kelimeler** verilir
- 📚 Kategori minimum kelime: Tek mod için 14, çoklu için (katılımcı × 14)
- ⏱️ Toplam süre: **5 dakika (300 saniye)** - tüm kelimeler için ortak
- 🎯 Her kelime için **maksimum 3 tahmin hakkı**
- 💯 Her harf açma **-100 puan** ceza
- ⚠️ **Tahmin yapıldıktan sonra harf alınamaz**
- 👥 Takım modunda her takımın **oyuncuları belirlenir**
- 🏆 Eşitlik: Puan → Az harf → Hızlı bitiren

---

## 2. TEKNİK GEREKSİNİMLER

### 2.1 Teknoloji Stack

**Frontend:**
- React 18+ (UI geliştirme)
- TypeScript (tip güvenliği)
- Tailwind CSS (stil ve tasarım)
- Zustand / Context API (state yönetimi)
- Framer Motion (animasyonlar)
- Lucide React (ikonlar)

**Backend (Tauri):**
- Rust (Tauri backend)
- Tauri 1.5+ (desktop framework)
- SQLite (lokal veritabanı - kategori ve kelime yönetimi)
- Tauri File System API (JSON import/export)
- Tauri Dialog API (dosya seçici, onay popup'ları)

**Ses Sistemi:**
- Web Audio API (ses efektleri)
- Tauri Resource API (ses dosyaları için)

### 2.2 Platform Desteği
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Fedora, Debian)

### 2.3 Performans Hedefleri
- Uygulama başlatma: < 3 saniye
- Kategori yükleme: < 500ms
- Animasyonlar: 60 FPS
- Bellek kullanımı: < 150 MB
- Disk boyutu: 
  - Windows: ~20 MB
  - macOS: ~25 MB
  - Linux: ~18 MB

### 2.4 Veritabanı Yapısı (SQLite)

**Tablolar:**

```
categories
├─ id (INTEGER PRIMARY KEY)
├─ name (TEXT NOT NULL)
├─ emoji (TEXT)
├─ description (TEXT)
├─ is_default (BOOLEAN DEFAULT 0)
├─ created_at (DATETIME)
└─ updated_at (DATETIME)

words
├─ id (INTEGER PRIMARY KEY)
├─ category_id (INTEGER FOREIGN KEY)
├─ word (TEXT NOT NULL)
├─ letter_count (INTEGER NOT NULL)
├─ hint (TEXT NOT NULL)
├─ created_at (DATETIME)
└─ CHECK (letter_count BETWEEN 4 AND 10)

settings
├─ key (TEXT PRIMARY KEY)
└─ value (TEXT)

game_history
├─ id (INTEGER PRIMARY KEY)
├─ category_id (INTEGER FOREIGN KEY)
├─ category_name (TEXT NOT NULL)
├─ game_mode (TEXT NOT NULL)
├─ played_at (DATETIME NOT NULL)
├─ total_time_seconds (INTEGER)
└─ created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

game_participants
├─ id (INTEGER PRIMARY KEY)
├─ game_history_id (INTEGER FOREIGN KEY)
├─ participant_name (TEXT NOT NULL)
├─ participant_type (TEXT NOT NULL)
├─ score (INTEGER DEFAULT 0)
├─ words_found (INTEGER DEFAULT 0)
├─ words_skipped (INTEGER DEFAULT 0)
├─ letters_revealed (INTEGER DEFAULT 0)
├─ rank (INTEGER)
└─ created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

game_word_results
├─ id (INTEGER PRIMARY KEY)
├─ game_history_id (INTEGER FOREIGN KEY)
├─ participant_id (INTEGER FOREIGN KEY)
├─ word (TEXT NOT NULL)
├─ word_hint (TEXT)
├─ result (TEXT NOT NULL)
├─ points_earned (INTEGER DEFAULT 0)
├─ letters_used (INTEGER DEFAULT 0)
└─ created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)
```

**Açıklamalar:**
- `game_history`: Her yarışmanın genel bilgilerini saklar
- `game_participants`: Her yarışmadaki oyuncuların/takımların detaylarını saklar
- `game_word_results`: Her kelime için hangi katılımcının ne yaptığını saklar
- `game_mode`: "single" (tek yarışmacı), "multi" (çoklu), "team" (takım)
- `participant_type`: "player" (oyuncu) veya "team" (takım)
- `result`: "found" (bulundu), "skipped" (pas geçildi), "timeout" (süre doldu)

### 2.5 Güvenlik ve İzinler
- Dosya sistemi erişimi: Yalnızca kullanıcı tarafından seçilen dizinler
- Ağ erişimi: Gerekli değil (tamamen offline)
- Veritabanı: Kullanıcı veri dizininde (`$APPDATA`, `~/.local/share`, vb.)

---

## 3. KATEGORİ SİSTEMİ

### 3.1 Kategori Yapısı

Her kategori şunları içerir:
- **ID:** Benzersiz otomatik artan sayı
- **İsim:** Kategori adı (örn: "Spor", "Teknoloji")
- **Emoji:** Görsel tanımlayıcı (örn: ⚽, 💻)
- **Açıklama:** Kısa tanım (opsiyonel)
- **Varsayılan mı?** Boolean (sadece "Genel Kelimeler" true)
- **Kelime Listesi:** O kategoriye ait tüm kelimeler

### 3.2 Varsayılan Kategori

**İlk Kurulumda Yüklenen:**
- **📦 Genel Kelimeler** (70 kelime)
  - Varsayılan kategori, silinemez
  - Düzenlenebilir (kelime eklenip çıkarılabilir)
  - İngilizce öğrenimi için temel kelime seti

**Kullanıcı Oluşturabilir:**
- Sınırsız özel kategori
- Önerilen emoji listesi sunulur
- İsim, emoji ve açıklama girişi

### 3.3 Kategori Validasyonu

**Oynanabilir Kategori Kriterleri:**

**Tek Yarışmacı Modu İçin:**
- ✅ Toplam EN AZ 14 kelime olmalı (daha fazla olabilir, yüzlerce kelime bile)
- ✅ Her harf uzunluğundan (4,5,6,7,8,9,10) EN AZ 2'şer kelime olmalı

**Çoklu Yarışmacı Modu İçin:**
- ✅ Toplam EN AZ (Yarışmacı Sayısı × 14) kelime olmalı
- ✅ Her harf uzunluğundan EN AZ (Yarışmacı Sayısı × 2) kelime olmalı
- Örnek: 3 yarışmacı → minimum 42 kelime (her uzunluktan 6'şar)

**Takım Yarışması Modu İçin:**
- ✅ Toplam EN AZ (Takım Sayısı × 14) kelime olmalı
- ✅ Her harf uzunluğundan EN AZ (Takım Sayısı × 2) kelime olmalı
- Örnek: 2 takım → minimum 28 kelime (her uzunluktan 4'er)

**Validasyon Mesajları:**
- "✅ Tek yarışmacı için oynanabilir (14+ kelime)" (yeşil)
- "✅ 3 yarışmacıya kadar oynanabilir (42+ kelime)" (yeşil)
- "⚠️ Sadece tek yarışmacı modu için yeterli (42 kelime gerekli çoklu mod için)" (sarı)
- "❌ Oynanamaz: X harfli kelime sayısı yetersiz (en az 2 olmalı)" (kırmızı)
- "⚠️ Dikkat: Toplam X kelime, en az 14 kelime gerekli" (sarı)

**UI Davranışı:**
- Kategori kartında kaç kişilik oynanabileceği gösterilir
- Yetersiz kelime varsa ilgili modlar devre dışı bırakılır
- Tooltip'te eksik bilgiler detaylı gösterilir
- Kategori yönetim ekranında eksik bilgiler vurgulanır

---

## 4. OYUN AKIŞI

### 4.1 Başlangıç Ekranı (Ana Menü)

**Bileşenler:**
- Logo ve başlık (büyük, merkezi)
- 5 ana aksiyon kartı (grid düzeni):
  - 🏁 Yarışma Başlat
  - 📚 Kategori Yönetimi
  - 📊 Geçmiş Yarışmalar
  - ⚙️ Ayarlar
  - ℹ️ Nasıl Oynanır?
- Versiyon bilgisi (alt köşe)
- GitHub repo linki (opsiyonel, alt köşe)

**Tasarım Notları:**
- Gradient arkaplan (koyu tema)
- Büyük, dokunulabilir kartlar
- Hover animasyonları
- Modern, minimal tasarım

### 4.2 Kategori Seçim Ekranı

**Yarışma Başlat > Kategori Seç**

**Bileşenler:**
- Başlık: "Kategori Seçin"
- Kategori kartları (kaydırılabilir grid):
  - Emoji ve isim (büyük)
  - Kelime sayısı
  - Oynanabilirlik durumu (badge)
  - "Oyna" butonu (aktif/pasif)
- Boş durum mesajı (kategori yoksa)
- "Yeni Kategori Oluştur" butonu (hızlı erişim)
- Geri butonu

**Kart Tasarımı:**
```
┌────────────────────────┐
│   ⚽                   │
│   Spor                │
│                       │
│   18 kelime           │
│   ✅ Oynanabilir      │
│                       │
│   [Oyna →]            │
└────────────────────────┘
```

### 4.3 Mod Seçimi

**Kategori Seçildikten Sonra:**

**3 Ana Mod:**

1. **👤 Tek Yarışmacı**
   - Tek kişi oynar
   - 14 kelime ile yarışır
   - Süre tutulur
   - Puan hesaplanır
   - Özet ekran

2. **👥 Çoklu Yarışmacı** (2-6 kişi)
   - Sırayla oynarlar
   - Her yarışmacıya FARKLI 14 kelime verilir
   - Kategori (yarışmacı sayısı × 14) kelime içermelidir
   - Puan sıralaması yapılır
   - Kazanan belirlenir
   - **NOT:** Herkes farklı kelimelerle yarışır ama aynı zorlukta

3. **🏆 Takım Yarışması** (2-4 takım)
   - Her takıma oyuncular atanır
   - Takımlar sırayla oynar
   - Her takıma FARKLI 14 kelime verilir
   - Kategori (takım sayısı × 14) kelime içermelidir
   - Takım içinde oyuncular sırayla oynayabilir veya birlikte karar verebilir
   - Takım puanları toplanır
   - Kazanan takım belirlenir

**Mod Seçiminde Validasyon:**
- Kategori kelime sayısı kontrol edilir
- Yetersiz kelime varsa mod devre dışı bırakılır
- "Bu mod için en az X kelime gerekli" uyarısı gösterilir

**UI:**
- Mod kartları (büyük, görsel)
- Her mod için kısa açıklama + gerekli kelime sayısı
- Devre dışı modlar soluk gösterilir
- Seçim sonrası isim girişi
- Geri ve İleri butonları

### 4.4 Yarışmacı/Takım Ayarlama

**Tek Yarışmacı Modu:**
- İsim girişi
- "Başla" butonu

**Çoklu Yarışmacı Modu:**
- 2-6 yarışmacı isim girişi
- Dinamik ekle/çıkar butonları
- Sıralama değiştirme (drag & drop)
- Kelime sayısı kontrolü: "Bu mod için X kelime gerekli, kategoride Y kelime var"
- "Başla" butonu

**Takım Modu:**
- 2-4 takım oluşturma
- Her takım için:
  - Takım adı girişi
  - Takım rengi/emoji seçimi
  - Takım oyuncuları ekleme (2-4 oyuncu/takım)
    - Her oyuncunun adı
    - Oyuncu sırası (takım içinde kim önce oynayacak)
- Toplam kelime sayısı kontrolü
- "Başla" butonu

**Takım Modu Örnek UI:**
```
┌─────────────────────────────────┐
│ Takım 1: 🔴 Kırmızı Takım       │
│ Oyuncular:                      │
│  1. Ali                         │
│  2. Ayşe                        │
│  3. Mehmet                      │
│  [+ Oyuncu Ekle]                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Takım 2: 🔵 Mavi Takım          │
│ Oyuncular:                      │
│  1. Can                         │
│  2. Zeynep                      │
│  [+ Oyuncu Ekle]                │
└─────────────────────────────────┘

Gerekli kelime: 28 | Mevcut: 42 ✓
```

### 4.5 Oyun Ekranı (Ana Oyun)

**Layout (1920x1080 optimize):**

**Üst Header (120px):**
- Kategori adı ve emoji (sol)
- Süre sayacı (ortada, büyük)
- Puan ve ilerleme (sağ)
- Yarışmacı adı (mod bazlı)

**Kelime Alanı (500px, merkezi):**
- Harf kutuları (büyük, eşit aralıklı)
- Kapalı: Koyu arka plan, "?" işareti
- Açık: Altın rengi arka plan, harf
- Animasyon: 3D flip

**İpucu Bölgesi (100px):**
- İpucu metni (büyük, okunabilir)
- 💡 ikonu
- Çerçeve ile vurgulanmış

**Kontrol Paneli (280px):**
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

**Alt Bar (60px):**
- Kelime ilerlemesi: "6 / 14"
- Kategori açıklaması (küçük)

### 4.6 Oyun Mekanikleri

**Kelime Seçim Algoritması:**

**Tek Yarışmacı:**
- Kategoriden rastgele 14 kelime seçilir
- Her uzunluktan 2'şer kelime (4-10 harf)
- Karışık sırada sunulur

**Çoklu Yarışmacı:**
- Her yarışmacı için ayrı 14 kelime seçilir
- Toplam (yarışmacı sayısı × 14) kelime gerekir
- Kelimelerin tekrar etmemesi sağlanır
- Her yarışmacı kendi kelime setini görür
- Sıra değişiminde yarışmacıya özel kelimeler gösterilir

**Takım Modu:**
- Her takım için ayrı 14 kelime seçilir
- Toplam (takım sayısı × 14) kelime gerekir
- Kelimelerin tekrar etmemesi sağlanır
- Takım oyuncuları aynı kelimeleri görür ama farklı takımlar farklı kelimeler görür

**ÖNEMLI KURAL:** Tahmin yapıldıktan sonra yeniden harf alınamaz!

**Harf Açma:**
1. "Harf Aç" butonuna tıkla
2. Tahmin yapılmamış olmalı (yapıldıysa buton devre dışı)
3. Rastgele kapalı harf seç
4. 3D flip animasyonu (0.6s)
5. Harf görünür hale gel
6. -100 puan kes
7. Pop ses efekti çal
8. Kalan puan güncellenir

**Tahmin Etme:**
1. "Tahmin Et" butonuna tıkla
2. Modal popup aç:
   - "Yarışmacının cevabı doğru mu?"
   - [✓ Doğru] [✗ Yanlış] butonları
3. **Doğru:**
   - Tüm harfleri aç (animasyonlu)
   - Yeşil yanıp sönme efekti
   - Puan ekle (animasyonlu sayaç)
   - Konfeti animasyonu
   - Başarı sesi
   - 2 saniye bekle
   - Sonraki kelimeye geç
4. **Yanlış:**
   - Ekran kırmızı titre (0.3s)
   - Tahmin hakkı azalt
   - Hata sesi
   - Tahmin hakkı 0 ise → pas geç otomatik
5. **ÖNEMLİ:** Tahmin yapıldıktan sonra yeniden harf alınamaz (oyun kuralı)

**Pas Geçme:**
1. "Pas Geç" butonuna tıkla
2. Onay popup'ı: "Pas geçmek istediğinizden emin misiniz?"
3. [Evet] → 0 puan, sonraki kelime
4. [Hayır] → popup kapat

**Süre Yönetimi:**
- Toplam oyun süresi: 5 dakika (300 saniye) - tüm 14 kelime için
- Süre tüm kelimeler için ortaktır - her kelimede sıfırlanmaz
- Her saniye sayaç güncelle
- Son 30 saniye: Kırmızı renk + nabız animasyonu
- Son 10 saniye: Hızlı yanıp sönme + tick sesi
- Süre 0: Oyun biter (bitirilen kelimeler kadar puan alınır)

**Pause (Duraklat):**
- Tüm oyun dondurulur
- Blurred overlay + "Duraklatıldı" mesajı
- [Devam Et] [Ana Menü] butonları
- Süre sayacı durur

### 4.7 Sonuç Ekranı

**Otomatik Kayıt:**
- Oyun bittiğinde tüm sonuçlar otomatik olarak veritabanına kaydedilir
- Kayıt bilgileri:
  - Oyun tarihi ve saati
  - Kategori bilgisi
  - Oyun modu (tek/çoklu/takım)
  - Her katılımcının detaylı sonuçları
  - Her kelime için detaylı bilgiler

**Tek Yarışmacı:**
- 🎉 Başlık
- Kategori bilgisi
- Yarışmacı adı
- Toplam puan (büyük)
- İstatistikler:
  - Bulunan kelime / Toplam
  - Alınan toplam harf
  - Geçen süre
  - Ortalama süre/kelime
- Detaylı kelime listesi (genişletilebilir):
  - Her kelime için:
    - İsim (harf sayısı)
    - Alınan puan
    - Durum (✅ bulundu / ⏭ pas)
- Aksiyon butonları:
  - 🏠 Ana Menü
  - 🔄 Tekrar Oyna
  - 📊 Geçmiş Yarışmaları Gör

**Çoklu Yarışmacı:**
- Sıralama tablosu:
  - 1. 🥇 İsim - Puan
  - 2. 🥈 İsim - Puan
  - 3. 🥉 İsim - Puan
  - ...
- Her yarışmacı için detay (genişletilebilir)
- Aksiyon butonları aynı

**Takım Yarışması:**
- Kazanan takım vurgusu (büyük)
- Takım sıralaması
- Her takım için toplam puan
- Detaylı gösterim
- Aksiyon butonları aynı

### 4.8 Geçmiş Yarışmalar Ekranı

**Ana Menü > Geçmiş Yarışmalar**

**Layout:**
- Başlık: "Geçmiş Yarışmalar"
- Filtreleme ve Sıralama:
  - Tarih aralığı seçimi
  - Kategori filtresi (dropdown)
  - Oyun modu filtresi (tek/çoklu/takım)
  - Sıralama: Tarih (yeni→eski), Tarih (eski→yeni), Puan (yüksek→düşük)
- İstatistik Özeti (üst bar):
  - Toplam oyun sayısı
  - En çok oynanan kategori
  - En yüksek puan
  - Toplam oyun süresi
- Yarışma Listesi (tablo veya kartlar):
  - Her yarışma için:
    - 📅 Tarih ve saat
    - 📦 Kategori (emoji + isim)
    - 🎮 Oyun modu
    - 👤 Katılımcı sayısı
    - 🏆 Kazanan (en yüksek puan)
    - ⏱️ Süre
    - [🔍 Detay Gör] butonu
- Sayfalama (10/25/50 kayıt)
- Alt Aksiyonlar:
  - [📥 Tüm Geçmişi Dışa Aktar] butonu (JSON formatında)
  - [🗑️ Tüm Geçmişi Sil] butonu (onay ile)
- Geri butonu

**Dışa Aktarma:**
- JSON formatında tüm yarışma geçmişi
- Dosya adı: `yarisma-gecmisi-[tarih].json`
- İçerik: Tüm yarışmalar, katılımcılar ve kelime sonuçları

**Boş Durum:**
- "Henüz hiç yarışma yapılmamış"
- "İlk yarışmanızı başlatın!" mesajı
- [Yarışma Başlat] butonu

**Yarışma Kartı Tasarımı:**
```
┌──────────────────────────────────────────────┐
│ 📅 15 Ekim 2025, 14:30                       │
│ 📦 Genel Kelimeler | 👥 Çoklu Yarışmacı      │
│ 🏆 Ahmet (850 puan) | ⏱️ 12:45               │
│                                               │
│ 3 Yarışmacı: Ahmet, Mehmet, Ayşe            │
│                                    [🔍 Detay] │
└──────────────────────────────────────────────┘
```

### 4.9 Yarışma Detay Ekranı

**Geçmiş Yarışmalar > Detay**

**Layout:**
- Başlık: "Yarışma Detayları"
- Üst Bilgiler:
  - 📅 Tarih: "15 Ekim 2025, 14:30"
  - 📦 Kategori: "Genel Kelimeler"
  - 🎮 Mod: "Çoklu Yarışmacı"
  - ⏱️ Toplam Süre: "12:45"

**Katılımcı Sıralaması:**
- Tablo formatı:
  
| Sıra | İsim   | Puan | Bulunan | Pas | Harf |
|------|--------|------|---------|-----|------|
| 🥇 1 | Ahmet  | 850  | 12/14   | 2   | 15   |
| 🥈 2 | Mehmet | 720  | 10/14   | 4   | 18   |
| 🥉 3 | Ayşe   | 680  | 9/14    | 5   | 20   |

**Detaylı Kelime Sonuçları:**
- Her katılımcı için genişletilebilir bölüm
- Her kelimenin durumu:
  - Kelime adı ve harf sayısı
  - Sonuç: ✅ Bulundu / ⏭ Pas / ⏱️ Süre Doldu
  - Alınan puan
  - Kullanılan harf sayısı
  - İpucu

**Aksiyon Butonları:**
- 🔄 Bu Kategoride Tekrar Oyna
- 📊 Kategori İstatistikleri (opsiyonel)
- 🏠 Ana Menü
- ← Geri

**Örnek Detay (Genişletilmiş):**
```
▼ Ahmet - 850 puan
  
  1. BOOK (4) ✅ Bulundu | 400 puan | 0 harf
  2. GAME (4) ✅ Bulundu | 300 puan | 1 harf
  3. SCHOOL (6) ⏭ Pas | 0 puan | 3 harf
  ...
```

---

## 5. KATEGORİ YÖNETİMİ

### 5.1 Ana Kategori Yönetim Ekranı

**Layout:**
- Başlık: "Kategori Yönetimi"
- "Yeni Kategori Oluştur" butonu (üstte, büyük)
- Arama/Filtreleme çubuğu
- Kategori listesi (grid veya liste):
  - Her kategori için kart:
    - Emoji ve isim
    - Kelime sayısı
    - Oynanabilirlik durumu
    - Aksiyonlar:
      - 👁️ Kelimeleri Gör
      - ✏️ Düzenle
      - 🗑️ Sil (varsayılan kategori hariç)
- Boş durum mesajı
- Geri butonu

**Kategori Kartı Tasarımı:**
```
┌─────────────────────────────────┐
│ ⚽ Spor                          │
│ 18 kelime | ✅ Oynanabilir      │
│ "Spor ve aktivite terimleri"    │
│                                 │
│ [👁️ Gör] [✏️ Düzenle] [🗑️ Sil]  │
└─────────────────────────────────┘
```

### 5.2 Yeni Kategori Oluşturma

**Modal/Sayfa:**
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

**Validasyon:**
- Kategori adı benzersiz olmalı
- Emoji seçilmeli
- Başarılı oluşturma sonrası → Kelime yönetim ekranına git

### 5.3 Kategori Kelime Yönetimi

**Layout:**
- Başlık: "[Emoji] [Kategori Adı] - Kelime Yönetimi"
- Üst bar:
  - "Yeni Kelime Ekle" butonu
  - "JSON'dan İçe Aktar" butonu
  - Arama çubuğu
- Kelime listesi (tablo veya kart):
  - Kelime (büyük harf)
  - Harf sayısı
  - İpucu
  - Aksiyonlar: [✏️ Düzenle] [🗑️ Sil]
- Sağ sidebar: Dağılım Kontrolü
  - Her harf uzunluğu için (4-10):
    - "4 harf: 2 ✅" (yeterli - yeşil)
    - "5 harf: 1 ❌" (yetersiz - kırmızı)
  - Toplam kelime sayısı
  - Oynanabilirlik durumu (büyük badge)
- Alt bar:
  - "JSON Dışa Aktar" butonu
  - "Geri" butonu

**Kelime Satırı Tasarımı (Tablo):**
```
| Kelime    | Harf | İpucu                      | Aksiyon      |
|-----------|------|----------------------------|--------------|
| COMPUTER  | 8    | Elektronik hesaplama cihazı| [✏️] [🗑️]  |
```

### 5.4 Yeni Kelime Ekleme

**Modal:**
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

**Validasyon:**
- Kelime benzersiz olmalı (kategori içinde)
- Sadece harf (A-Z)
- 4-10 karakter arası
- İpucu boş olmamalı
- Başarılı kayıt: Toast mesajı + liste güncellenir

### 5.5 Kelime Düzenleme

**Modal:**
- Başlık: "Kelime Düzenle"
- Form alanları aynı (kelime, ipucu)
- Kelime değiştirilebilir (benzersizlik kontrolü)
- İpucu değiştirilebilir
- Butonlar: "Güncelle" / "İptal"

### 5.6 Kategori/Kelime Silme

**Onay Dialog:**
- "Bu kategoriyi silmek istediğinizden emin misiniz?"
- "Bu işlem geri alınamaz ve [X] kelime silinecek."
- [Evet, Sil] (destructive) / [İptal]
- Silme sonrası: Toast mesajı + liste güncellenir

### 5.7 JSON Import/Export

**Export:**
- "JSON Dışa Aktar" butonuna tıkla
- Tauri Dialog API ile kaydetme konumu seç
- Varsayılan dosya adı: `[kategori-adi].json`
- Format:
```json
{
  "category": {
    "name": "Spor",
    "emoji": "⚽",
    "description": "Spor ve aktivite terimleri"
  },
  "words": [
    {
      "word": "FOOTBALL",
      "letter_count": 8,
      "hint": "11 kişiyle oynanan takım sporu"
    }
  ]
}
```
- Başarı toast'ı

**Import:**
- "JSON'dan İçe Aktar" butonuna tıkla
- Tauri Dialog API ile dosya seç
- JSON formatı valide edilir:
  - Schema kontrolü
  - Kelime formatı kontrolü (harf sayısı, A-Z)
- Validasyon hataları gösterilir
- Başarılı: Kelimeler eklenir (duplicate'ler atlanır)
- Toast mesajı: "X kelime eklendi, Y kelime zaten vardı"

---

## 6. AYARLAR EKRANI

**Ayarlar Sayfası:**

**Genel Ayarlar:**
- Ses Efektleri: [ON/OFF toggle]
- Tam Ekran Başlat: [ON/OFF toggle]
- Dil: [Türkçe] (gelecek güncellemeler için)

**Oyun Ayarları:**
- Varsayılan Süre: [5 dakika / 300 saniye] (sabit - oyun kurallarına göre)
- Varsayılan Tahmin Hakkı: [3] (sabit - her kelime için maksimum 3 tahmin)
- Animasyon Hızı: [Normal] (dropdown: Yavaş, Normal, Hızlı)

**NOT:** Süre ve tahmin hakkı oyun kurallarına göre sabittir, değiştirilemez.

**Veri Yönetimi:**
- [Veritabanını Yedekle] butonu
  - SQLite dosyasını dışa aktar
- [Veritabanını Geri Yükle] butonu
  - SQLite dosyasını içe aktar
- [Tüm Verileri Sıfırla] butonu
  - Onay dialog'u
  - Varsayılan kategoriye dön

**Hakkında:**
- Uygulama adı ve versiyonu
- Açık kaynak lisans bilgisi
- GitHub repo linki
- Katkıda bulunanlar (opsiyonel)

---

## 7. NASIL OYNANIR? EKRANI

**Oyun Kuralları (Resmi Kurallar):**

**Temel Bilgiler:**
- 📝 Her yarışmacıya **14 kelime** verilir
- ⏱️ Toplam süre: **5 dakika (300 saniye)** - tüm kelimeler için
- 🎯 Her kelime için **maksimum 3 tahmin hakkı**
- 💯 Her harf açma **-100 puan** ceza
- ⚠️ **Tahmin yaptıktan sonra harf alınamaz**

**Kelime Dağılımı (Her Yarışmacı İçin):**
- 2 adet 4 harfli kelime
- 2 adet 5 harfli kelime
- 2 adet 6 harfli kelime
- 2 adet 7 harfli kelime
- 2 adet 8 harfli kelime
- 2 adet 9 harfli kelime
- 2 adet 10 harfli kelime

**Çoklu Yarışmacı ve Takım Modu:**
- 🔄 Her yarışmacı/takım **farklı 14 kelime** alır
- 📚 Kategori yeterli kelime içermelidir:
  - 2 kişi → 28 kelime
  - 3 kişi → 42 kelime
  - 4 kişi → 56 kelime
- 👥 Takım modunda her takımın oyuncuları belirlenir

**İnteraktif Tutorial:**

**Adımlar:**
1. **Kategori Seçin**
   - Görsel: Kategori seçim ekranı
   - Açıklama: "En az 14 kelime içeren kategoriyi seçin"
   - Not: Çoklu mod için daha fazla kelime gerekir

2. **Mod Seçin**
   - Görsel: Mod seçim kartları
   - Açıklama: "Tek, çoklu veya takım modu - kategori kelime sayısına göre"

3. **Yarışmacıları/Takımları Ayarlayın**
   - Tek mod: İsim girin
   - Çoklu mod: Yarışmacı sayısı seçin
   - Takım mod: Takımları ve oyuncuları oluşturun

4. **Kelimeyi Tahmin Edin**
   - Görsel: Oyun ekranı (kapalı harfler)
   - Açıklama: "İpucunu kullanarak kelimeyi bulmaya çalışın"

5. **Harf Açın veya Tahmin Edin**
   - Görsel: Butonlar
   - Açıklama: "Harf açarak yardım alın (-100 puan) veya tahmin edin"
   - ⚠️ "DİKKAT: Tahmin yaptıktan sonra harf alamazsınız!"

6. **Puan Kazanın**
   - Görsel: Puan sistemi
   - Açıklama: "Daha az harf açarak daha çok puan kazanın"

**Kazanma Kuralları:**
- 🥇 En yüksek puanlı kazanır
- Eşitlik durumunda: Az harf açan → Hızlı bitiren

**Puan Sistemi Tablosu:**
- Görsel tablo (daha önce verilen)
- Her harf uzunluğu için örnekler

**Klavye Kısayolları:**
- Tablo formatında gösterim
- H: Harf Aç
- T: Tahmin Et
- P: Pas Geç
- Space: Duraklat
- vb.

---

## 8. UI/UX TASARIM GEREKSİNİMLERİ

### 8.1 Renk Paleti

**Ana Renkler (Modern Dark Theme):**
- **Background:**
  - Primary: #0f172a (Slate-900)
  - Secondary: #1e293b (Slate-800)
  - Tertiary: #334155 (Slate-700)

- **Accent Renkler:**
  - Primary: #3b82f6 (Blue-500) - Ana butonlar, vurgular
  - Secondary: #8b5cf6 (Violet-500) - İkincil vurgular
  - Gold: #fbbf24 (Amber-400) - Açık harfler, ödüller

- **Durum Renkleri:**
  - Başarı: #10b981 (Emerald-500)
  - Hata: #ef4444 (Red-500)
  - Uyarı: #f59e0b (Amber-500)
  - Bilgi: #3b82f6 (Blue-500)

- **Metin Renkleri:**
  - Primary: #f1f5f9 (Slate-100)
  - Secondary: #cbd5e1 (Slate-300)
  - Tertiary: #94a3b8 (Slate-400)

**Gradient'ler:**
- Ana arkaplan: `from-slate-900 via-slate-800 to-slate-900`
- Kartlar: `from-slate-800 to-slate-700`
- Butonlar: `from-blue-600 to-blue-700`

### 8.2 Tipografi

**Font Ailesi:**
- Ana Font: Inter (Google Fonts)
  - Modern, okunabilir, çok ağırlıklı
- Monospace (kodlar için): JetBrains Mono

**Font Boyutları (Tailwind):**
- Başlıklar:
  - H1: text-6xl (60px) font-bold
  - H2: text-4xl (36px) font-semibold
  - H3: text-2xl (24px) font-semibold
- Gövde:
  - Normal: text-base (16px)
  - Büyük: text-lg (18px)
  - Küçük: text-sm (14px)
- Kelime Harfleri: text-5xl (48px) font-extrabold
- Butonlar: text-lg (18px) font-semibold

### 8.3 Bileşen Tasarımı

**Butonlar:**
- **Primary:**
  - Tailwind: `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl`
  - Gölge: `shadow-lg hover:shadow-xl`
  - Animasyon: `transition-all duration-200`

- **Secondary:**
  - Tailwind: `bg-slate-700 hover:bg-slate-600 text-slate-100`

- **Destructive:**
  - Tailwind: `bg-red-600 hover:bg-red-700 text-white`

**Kartlar:**
- Tailwind: `bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700`
- Hover: `hover:scale-105 hover:shadow-2xl transition-transform duration-200`

**Input Alanları:**
- Tailwind: `bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100`
- Focus ring: `focus:ring-2 focus:ring-blue-500`

**Modal/Dialog:**
- Overlay: `bg-black/50 backdrop-blur-sm`
- Content: `bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md`

**Harf Kutuları:**
- Kapalı:
  - `bg-slate-700 border-2 border-slate-600 rounded-lg w-16 h-20`
  - İçerik: "?" (text-4xl text-slate-400)
- Açık:
  - `bg-amber-400 text-slate-900 rounded-lg w-16 h-20`
  - İçerik: Harf (text-4xl font-extrabold)
- Animasyon: 3D flip (Framer Motion)

### 8.4 Animasyonlar (Framer Motion)

**Sayfa Geçişleri:**
- Fade in: `opacity: 0 → 1` (duration: 0.3s)
- Slide in: `x: 20 → 0` (duration: 0.3s, ease: easeOut)

**Harf Açılma (3D Flip):**
- Framer Motion variants:
  - `rotateY: 0deg → 180deg` (duration: 0.6s)
  - `scale: 1 → 1.1 → 1` (duration: 0.6s)
- Easing: spring animation

**Doğru Cevap:**
1. Tüm harfler yeşil glow (duration: 0.2s)
2. Scale pulse: `1 → 1.1 → 1` (3 kez)
3. Konfeti patlaması (canvas animasyonu)
4. Puan sayacı: Count-up animasyon

**Yanlış Cevap:**
- Shake animasyon: `x: 0 → -10 → 10 → 0` (duration: 0.3s)
- Kırmızı flash overlay (opacity pulse)

**Süre Uyarısı:**
- Son 30 saniye: Pulse animasyon (scale: 1 → 1.05)
- Son 10 saniye: Hızlı pulse + renk değişimi

**Kart Hover:**
- Scale: `1 → 1.05` (duration: 0.2s)
- Shadow: `shadow-lg → shadow-2xl`
- Border glow efekti

**Loading Durumları:**
- Skeleton loaders (Tailwind animate-pulse)
- Spinner (custom SVG animasyonu)

### 8.5 Responsive Tasarım

**Desteklenen Çözünürlükler:**
- **Full HD:** 1920x1080 (optimal)
- **HD:** 1366x768 (desteklenen)
- **4K:** 3840x2160 (ölçeklenebilir)

**Breakpoint'ler (Tauri pencere boyutu):**
- Minimum pencere: 1280x720
- Maksimum pencere: Sınırsız
- Tam ekran: Destekleniyor

**Responsive Davranış:**
- Harf kutuları: Ekran genişliğine göre scale
- Grid layout'lar: Otomatik sütun ayarlaması
- Font boyutları: Viewport birimlerine göre (vw, vh)

### 8.6 Erişilebilirlik (A11y)

**Klavye Navigasyonu:**
- Tab ile tüm interaktif elemanlara erişim
- Enter/Space ile buton aktivasyonu
- Esc ile modal/dialog kapatma
- Focus indicator'lar (ring)

**Renk Kontrastı:**
- WCAG 2.1 Level AA uyumlu
- Metin/arkaplan kontrastı: minimum 4.5:1
- Durum renkleri: sadece renge bağımlı olmayan (ikon + renk)

**Ekran Okuyucu Desteği:**
- Semantik HTML (nav, main, article, vb.)
- ARIA etiketleri (aria-label, aria-describedby)
- Alt metinler (emoji için)
- Canlı bölgeler (aria-live) puan güncellemeleri için

**Metin Ölçeklendirme:**
- 200%'e kadar zoom desteklenir
- Tailwind responsive font boyutları

---

## 9. PUANLAMA SİSTEMİ

### 9.1 Puan Hesaplama

**Formül:**
```
basePuan = harfSayisi × 100
toplamCeza = alinanHarfSayisi × 100
netPuan = max(0, basePuan - toplamCeza)
```

**Örnek:**
- 8 harfli kelime: 800 puan
- 2 harf açıldı: -200 puan
- Net puan: 600

### 9.2 Puan Tablosu

| Harf | Temel | 0 Harf | 1 Harf | 2 Harf | 3 Harf | 4 Harf |
|------|-------|--------|--------|--------|--------|--------|
| 4    | 400   | 400    | 300    | 200    | 100    | 0      |
| 5    | 500   | 500    | 400    | 300    | 200    | 100    |
| 6    | 600   | 600    | 500    | 400    | 300    | 200    |
| 7    | 700   | 700    | 600    | 500    | 400    | 300    |
| 8    | 800   | 800    | 700    | 600    | 500    | 400    |
| 9    | 900   | 900    | 800    | 700    | 600    | 500    |
| 10   | 1000  | 1000   | 900    | 800    | 700    | 600    |

### 9.3 Sıralama ve Kazanma Kuralları

**Kazanan Belirleme:**
1. **En yüksek toplam puan** alan yarışmacı kazanır

**Eşitlik Durumunda (Oyun Kurallarına Göre):**
1. Puanlar eşitse → **Daha az harf açan** kazanır
2. Hâlâ eşitse → **Daha kısa sürede bitiren** kazanır
3. Son çare → **Berabere** ilan edilir

**NOT:** Eşitlik kuralları resmi oyun kurallarından alınmıştır.

### 9.4 İstatistikler

**Oyuncu Bazlı:**
- Toplam oynanan oyun
- Toplam puan
- Ortalama puan
- En yüksek puan
- Toplam bulunan kelime
- Doğruluk oranı
- Ortalama süre

**Kategori Bazlı:**
- En çok oynanan kategori
- Kategori başına ortalama puan
- Kategori başına doğruluk oranı

---

## 10. SES SİSTEMİ

### 10.1 Ses Efektleri (Web Audio API)

**Üretilecek Sesler:**

1. **Harf Açma (Pop):**
   - Frequency: 440 Hz
   - Duration: 0.1s
   - Waveform: Sine
   - Envelope: Quick attack, quick decay

2. **Doğru Cevap (Başarı Jingle):**
   - Notalar: C5-E5-G5-C6
   - Duration: 1s
   - Waveform: Square
   - Envelope: Medium attack, long release

3. **Yanlış Cevap (Hata):**
   - Frequency: 200 Hz (düşük)
   - Duration: 0.3s
   - Waveform: Sawtooth
   - Envelope: Sharp attack, medium decay

4. **Pas Geç (Whoosh):**
   - White noise sweep
   - Duration: 0.2s
   - Filter: Low-pass (sliding)

5. **Süre Uyarısı (Tick):**
   - Frequency: 880 Hz
   - Duration: 0.05s
   - Waveform: Square
   - Interval: 1 saniye

6. **Kazanma (Fanfare):**
   - Notalar: C4-E4-G4-C5-E5-G5
   - Duration: 1.5s
   - Waveform: Triangle
   - Envelope: Medium attack, long release

7. **Buton Click:**
   - Frequency: 1000 Hz
   - Duration: 0.05s
   - Waveform: Sine

**Ses Ayarları:**
- Master volume slider (0-100%)
- Mute/Unmute toggle
- Sesler localStorage'da kayıtlı

### 10.2 Ses Sınıfı (TypeScript)

**Özellikler:**
- AudioContext yönetimi
- Ses cache sistemi
- Volume kontrolü
- Fade in/out
- Ses pool (performans için)

---

## 11. KLAVYE KISAYOLLARI

### 11.1 Global Kısayollar

| Tuş Kombinasyonu | İşlev | Ekran |
|------------------|-------|-------|
| `F11` | Tam ekran aç/kapat | Tüm ekranlar |
| `Ctrl/Cmd + Q` | Uygulamadan çık | Tüm ekranlar |
| `Ctrl/Cmd + ,` | Ayarlar | Tüm ekranlar |
| `Esc` | Geri / İptal | Tüm ekranlar |

### 11.2 Oyun Ekranı Kısayolları

| Tuş | İşlev | Açıklama |
|-----|-------|----------|
| `H` | Harf Aç | Rastgele harf açar |
| `T` | Tahmin Et | Tahmin popup'ı açar |
| `P` | Pas Geç | Pas geçme onayı ister |
| `Space` | Duraklat/Devam | Oyunu duraklat |
| `M` | Ses Aç/Kapat | Ses toggle |
| `Esc` | Ana Menü | Onaylı çıkış |

### 11.3 Popup/Dialog Kısayolları

| Tuş | İşlev | Kullanım |
|-----|-------|----------|
| `D` / `Enter` | Doğru | Tahmin popup'ında |
| `Y` / `N` | Yanlış | Tahmin popup'ında |
| `Enter` | Onayla | Tüm onay dialog'larında |
| `Esc` | İptal | Tüm dialog'larda |

### 11.4 Kategori/Kelime Yönetimi

| Tuş Kombinasyonu | İşlev |
|------------------|-------|
| `Ctrl/Cmd + N` | Yeni kategori/kelime |
| `Ctrl/Cmd + S` | Kaydet (form'larda) |
| `Ctrl/Cmd + F` | Arama (listelerde) |

---

## 12. BAŞLANGIÇ VERİLERİ

### 12.1 Genel Kelimeler Kategorisi (70 Kelime)

**Kategori Bilgileri:**
- İsim: "Genel Kelimeler"
- Emoji: 📦
- Açıklama: "Günlük yaşamda sık kullanılan genel kelimeler - İngilizce öğrenimi için temel kelimeler"
- Varsayılan: true

**Kelime Listesi:**

**4 Harfli (10 kelime):**
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

**5 Harfli (10 kelime):**
11. DANCE - "Dans etmek - müzik eşliğinde yapılan hareketler"
12. WATCH - "İzlemek / saat - görmek veya zaman ölçen cihaz"
13. STUDY - "Ders çalışmak - öğrenmek için araştırma yapmak"
14. BREAD - "Ekmek - un, su ve mayadan yapılan besin"
15. MUSIC - "Müzik - seslerden oluşan sanat dalı"
16. DREAM - "Hayal / rüya - uykuda görülen olaylar"
17. APPLE - "Elma - meyvesi yenen ağaç"
18. CHAIR - "Sandalye - oturmak için kullanılan mobilya"
19. SPORT - "Spor - fiziksel aktivite ve yarışma"
20. WATER - "Su - canlılar için hayati sıvı"

**6 Harfli (10 kelime):**
21. SCHOOL - "Okul - öğrencilerin eğitim gördüğü kurum"
22. TRAVEL - "Seyahat etmek - bir yerden başka bir yere gitmek"
23. NATURE - "Doğa - canlılar ve çevrenin bütünü"
24. ANIMAL - "Hayvan - insanlar dışındaki canlılar"
25. MOTHER - "Anne - çocuğu doğuran kadın"
26. FATHER - "Baba - çocuğun erkek ebeveyni"
27. FRIEND - "Arkadaş - yakın dost, ahbap"
28. FAMILY - "Aile - anne, baba ve çocukların oluşturduğu topluluk"
29. SUMMER - "Yaz mevsimi - yılın en sıcak dönemi"
30. WINTER - "Kış mevsimi - yılın en soğuk dönemi"

**7 Harfli (10 kelime):**
31. SUBJECT - "Ders - okul müfredatında yer alan konu"
32. CULTURE - "Kültür - toplumun yaşam biçimi ve değerleri"
33. TEACHER - "Öğretmen - eğitim veren kişi"
34. STUDENT - "Öğrenci - eğitim alan kişi"
35. COUNTRY - "Ülke - sınırları belli olan coğrafi bölge"
36. HOLIDAY - "Tatil - dinlenme ve eğlence dönemi"
37. PICTURE - "Resim - görsel sanat eseri"
38. PROJECT - "Proje - planlanan ve yürütülen iş"
39. LIBRARY - "Kütüphane - kitapların toplandığı yer"
40. MORNING - "Sabah - günün ilk saatleri"

**8 Harfli (10 kelime):**
41. LANGUAGE - "Dil - iletişim aracı, konuşma sistemi"
42. HOMEWORK - "Ödev - evde yapılan ders çalışması"
43. HOSPITAL - "Hastane - hastaların tedavi edildiği kurum"
44. EXERCISE - "Egzersiz - fiziksel veya zihinsel çalışma"
45. COMPUTER - "Bilgisayar - elektronik hesaplama ve veri işleme cihazı"
46. BUILDING - "Bina - insanların yaşadığı veya çalıştığı yapı"
47. LEARNING - "Öğrenme - bilgi ve beceri edinme süreci"
48. QUESTION - "Soru - bilgi almak için sorulan cümle"
49. SUNSHINE - "Güneş ışığı - güneşten gelen aydınlatma"
50. NOTEBOOK - "Defter - yazı yazmak için kullanılan kağıt demeti"

**9 Harfli (10 kelime):**
51. VOLUNTEER - "Gönüllü - karşılıksız yardım eden kişi"
52. INTERVIEW - "Röportaj / mülakat - soru-cevap görüşmesi"
53. EDUCATION - "Eğitim - öğretim ve öğrenme süreci"
54. ADVENTURE - "Macera - heyecan verici deneyim"
55. YESTERDAY - "Dün - bugünden bir gün önce"
56. AFTERNOON - "Öğleden sonra - öğle ile akşam arası"
57. DANGEROUS - "Tehlikeli - risk içeren, zararlı olabilecek"
58. APARTMENT - "Daire - büyük binanın içindeki konut"
59. KNOWLEDGE - "Bilgi - öğrenilen ve bilinen şeyler"
60. CAREFULLY - "Dikkatlice - özenli ve dikkatli bir şekilde"

**10 Harfli (10 kelime):**
61. TECHNOLOGY - "Teknoloji - bilimsel gelişmeler ve uygulamalar"
62. TELEVISION - "Televizyon - görüntülü yayın cihazı"
63. DICTIONARY - "Sözlük - kelimelerin anlamlarını açıklayan kitap"
64. POPULATION - "Nüfus - bir bölgede yaşayan insan sayısı"
65. DIFFERENCE - "Fark - iki şey arasındaki ayrım"
66. UNIVERSITY - "Üniversite - yüksek öğretim kurumu"
67. IMPORTANCE - "Önem - bir şeyin değeri ve anlamlılığı"
68. SMARTPHONE - "Akıllı telefon - internet bağlantılı mobil cihaz"
69. GOVERNMENT - "Hükümet - ülkeyi yöneten resmi kurum"
70. BASKETBALL - "Basketbol - potaya top atma sporu"

---

## 13. VERİTABANI MİGRASYONU VE İLK KURULUM

### 13.1 İlk Kurulum Akışı

**Uygulama İlk Kez Açıldığında:**

1. **Veritabanı Kontrolü:**
   - `~/.local/share/kelime-oyunu/` dizinini kontrol et
   - `kelime-oyunu.db` dosyası var mı?

2. **Veritabanı Oluşturma (yoksa):**
   - SQLite veritabanı oluştur
   - Tabloları oluştur (schema)
   - Varsayılan kategoriyi ekle (70 kelimeyle)
   - Varsayılan ayarları kaydet

3. **Hoş Geldiniz Ekranı:**
   - "Kelime Oyunu'na Hoş Geldiniz!" mesajı
   - Kısa tanıtım
   - "Hemen Başla" butonu → Ana Menü

### 13.2 Veritabanı Schema (SQL)

**Tablo Oluşturma Komutları:**

```sql
-- Kategoriler
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    description TEXT,
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Kelimeler
CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    letter_count INTEGER NOT NULL CHECK(letter_count BETWEEN 4 AND 10),
    hint TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, word)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_words_category ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_words_letter_count ON words(letter_count);

-- Ayarlar
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Oyun geçmişi
CREATE TABLE IF NOT EXISTS game_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    category_name TEXT NOT NULL,
    game_mode TEXT NOT NULL CHECK(game_mode IN ('single', 'multi', 'team')),
    played_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_time_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Oyun katılımcıları
CREATE TABLE IF NOT EXISTS game_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_history_id INTEGER NOT NULL,
    participant_name TEXT NOT NULL,
    participant_type TEXT NOT NULL CHECK(participant_type IN ('player', 'team')),
    score INTEGER DEFAULT 0,
    words_found INTEGER DEFAULT 0,
    words_skipped INTEGER DEFAULT 0,
    letters_revealed INTEGER DEFAULT 0,
    rank INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_history_id) REFERENCES game_history(id) ON DELETE CASCADE
);

-- Kelime sonuçları
CREATE TABLE IF NOT EXISTS game_word_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_history_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    word_hint TEXT,
    result TEXT NOT NULL CHECK(result IN ('found', 'skipped', 'timeout')),
    points_earned INTEGER DEFAULT 0,
    letters_used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_history_id) REFERENCES game_history(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES game_participants(id) ON DELETE CASCADE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_game_history_played_at ON game_history(played_at);
CREATE INDEX IF NOT EXISTS idx_game_history_category ON game_history(category_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_game ON game_participants(game_history_id);
CREATE INDEX IF NOT EXISTS idx_game_word_results_game ON game_word_results(game_history_id);
```

### 13.3 Varsayılan Veri Ekleme

**İlk kurulumda eklenecek veriler:**
- Genel Kelimeler kategorisi (yukarıdaki 70 kelime)
- Varsayılan ayarlar:
  - `sound_enabled: true`
  - `default_time: 300`
  - `default_guesses: 3`
  - `animation_speed: normal`

---

## 14. TAURI BACKEND İŞLEMLERİ

### 14.1 Tauri Commands (Rust)

**Gerekli Komutlar:**

**Kategori İşlemleri:**
- `get_all_categories()` → Tüm kategorileri getir
- `get_category_by_id(id)` → Tek kategori detayı
- `create_category(name, emoji, desc)` → Yeni kategori
- `update_category(id, name, emoji, desc)` → Kategori güncelle
- `delete_category(id)` → Kategori sil
- `validate_category(id)` → Oynanabilirlik kontrolü

**Kelime İşlemleri:**
- `get_words_by_category(category_id)` → Kategorinin kelimeleri
- `add_word(category_id, word, hint)` → Yeni kelime
- `update_word(id, word, hint)` → Kelime güncelle
- `delete_word(id)` → Kelime sil
- `get_random_words(category_id, count, exclude_ids)` → Oyun için kelime seçimi
  - `count`: Seçilecek kelime sayısı (genelde 14)
  - `exclude_ids`: Önceden seçilen kelime ID'leri (çoklu modda tekrar önleme)
- `validate_category_for_mode(category_id, mode, participant_count)` → Mod için yeterli kelime var mı?

**Dosya İşlemleri:**
- `export_category_json(category_id, path)` → JSON export
- `import_category_json(path)` → JSON import
- `backup_database(path)` → DB yedekleme
- `restore_database(path)` → DB geri yükleme

**Ayarlar:**
- `get_settings()` → Tüm ayarlar
- `update_setting(key, value)` → Ayar güncelle

**Oyun Geçmişi:**
- `save_game_result(game_data, participants, word_results)` → Yarışma sonucu kaydet
- `get_game_history(filters, pagination)` → Geçmiş yarışmaları getir
- `get_game_detail(game_id)` → Tek yarışma detayı
- `get_game_statistics()` → Genel istatistikler
- `export_game_history_json(path)` → Geçmişi JSON'a aktar
- `delete_game_history(game_id)` → Tek yarışma sil
- `delete_all_game_history()` → Tüm geçmişi sil

### 14.2 Hata Yönetimi

**Error Types:**
- `DatabaseError` - Veritabanı hataları
- `ValidationError` - Validasyon hataları
- `NotFoundError` - Kayıt bulunamadı
- `DuplicateError` - Tekrar kayıt
- `FileSystemError` - Dosya işlem hataları

**Frontend'de Hata Gösterimi:**
- Toast bildirimleri
- Error boundary (React)
- Kullanıcı dostu mesajlar

---

## 15. GÜVENLIK VE GİZLİLİK

### 15.1 Veri Güvenliği

**Lokal Veri:**
- Tüm veriler kullanıcının bilgisayarında
- Ağ erişimi YOK
- Şifreleme: SQLite varsayılan (opsiyonel: SQLCipher)
- Yedekleme: Kullanıcı kontrolünde

**Dosya İzinleri:**
- Veritabanı: Kullanıcı okuma/yazma
- Yedekler: Kullanıcı tarafından belirlenen dizin
- JSON dosyalar: Kullanıcı tarafından belirlenen dizin

### 15.2 Gizlilik

**Veri Toplama:**
- Hiçbir analitik YOKTUR
- Hiçbir telemetri YOKTUR
- İnternet bağlantısı gerekmez
- Tamamen offline çalışır

**Kullanıcı Verileri:**
- Yarışmacı isimleri lokal
- Oyun sonuçları lokal
- Dışa aktarma: Kullanıcı kararı

---

## 16. TEST SENARYOLARI

### 16.1 Kategori Sistemi Testleri

**Fonksiyonel Testler:**
- [ ] Varsayılan kategori yükleniyor mu?
- [ ] Yeni kategori oluşturulabiliyor mu?
- [ ] Kategori adı benzersizliği kontrol ediliyor mu?
- [ ] Kategori güncellenebiliyor mu?
- [ ] Kategori silinebiliyor mu? (varsayılan hariç)
- [ ] Varsayılan kategori silme engellenmiş mi?
- [ ] Kategori validasyonu doğru çalışıyor mu?
- [ ] Kelime eklenebiliyor mu?
- [ ] Aynı kelime tekrar eklenmeye çalışılırsa engellenmiş mi?
- [ ] Kelime güncellenebiliyor mu?
- [ ] Kelime silinebiliyor mu?

**Validasyon Testleri:**
- [ ] 4-10 harf arası kelime kontrolü çalışıyor mu?
- [ ] Sadece A-Z harf kontrolü çalışıyor mu?
- [ ] Her uzunluktan EN AZ 2 kelime kontrolü çalışıyor mu?
- [ ] Tek yarışmacı için minimum 14 kelime kontrolü çalışıyor mu?
- [ ] Çoklu yarışmacı için (katılımcı × 14) kelime kontrolü çalışıyor mu?
- [ ] Takım modu için (takım × 14) kelime kontrolü çalışıyor mu?
- [ ] Oynanabilirlik durumu doğru gösteriliyor mu?
- [ ] 13 kelimeli kategori oynanamıyor mu?
- [ ] 100 kelimeli kategori için kaç kişilik mod açık?

### 16.2 Oyun Akışı Testleri

**Oyun Başlatma:**
- [ ] Kategori seçimi çalışıyor mu?
- [ ] Oynanamaz kategoride oyun engellenmiş mi?
- [ ] Mod seçimi kelime sayısına göre filtreliyor mu?
- [ ] Yetersiz kelime varsa mod devre dışı mı?
- [ ] Yarışmacı isim girişi çalışıyor mu?
- [ ] Takım modunda oyuncu ekleme çalışıyor mu?
- [ ] Oyun ekranı doğru yükleniyor mu?

**Kelime Seçimi:**
- [ ] Tek yarışmacıya 14 kelime veriliyor mu?
- [ ] Çoklu modda her yarışmacıya farklı kelimeler mi?
- [ ] Takım modunda her takıma farklı kelimeler mi?
- [ ] Kelimeler tekrar etmiyor mu?
- [ ] Her uzunluktan 2'şer kelime seçiliyor mu?

**Oyun Mekanikleri:**
- [ ] Harf açma rastgele çalışıyor mu?
- [ ] Tahmin yapıldıktan sonra harf açma engellenmiş mi? (KRİTİK)
- [ ] Tüm harfler açıkken harf açma engellenmiş mi?
- [ ] Puan kesintisi doğru yapılıyor mu? (-100 puan/harf)
- [ ] Tahmin etme popup'ı açılıyor mu?
- [ ] Doğru cevap animasyonu çalışıyor mu?
- [ ] Yanlış cevap tahmin hakkı azaltıyor mu?
- [ ] Her kelime için maksimum 3 tahmin hakkı var mı?
- [ ] Tahmin hakkı bitince pas geçiliyor mu?
- [ ] Pas geçme çalışıyor mu?
- [ ] Süre sayacı doğru işliyor mu? (300 saniye toplam)
- [ ] Süre tüm kelimeler için ortak mı? (her kelimede sıfırlanmıyor mu?)
- [ ] Süre bitince oyun bitiyor mu?
- [ ] 14 kelime tamamlanınca oyun bitiyor mu?

**Çoklu Mod:**
- [ ] Sırayla yarışmacı değişimi çalışıyor mu?
- [ ] Her yarışmacı FARKLI 14 kelime görüyor mu? (KRİTİK)
- [ ] Kelimeler tekrar etmiyor mu?
- [ ] Puan sıralaması doğru yapılıyor mu?
- [ ] Eşitlik kuralları uygulanıyor mu? (puan → harf → süre)

**Takım Modu:**
- [ ] Takım oluşturma çalışıyor mu?
- [ ] Her takıma oyuncu eklenebiliyor mu?
- [ ] Her takım FARKLI 14 kelime görüyor mu? (KRİTİK)
- [ ] Takım içi oyuncu sırası çalışıyor mu?
- [ ] Takım puanları doğru toplanıyor mu?

### 16.3 UI/UX Testleri

**Animasyonlar:**
- [ ] Harf açılma 3D flip çalışıyor mu?
- [ ] Doğru cevap konfetisi çalışıyor mu?
- [ ] Yanlış cevap shake çalışıyor mu?
- [ ] Süre uyarısı animasyonu çalışıyor mu?
- [ ] Kart hover efektleri çalışıyor mu?

**Responsive:**
- [ ] 1920x1080 düzgün görünüyor mu?
- [ ] 1366x768 düzgün görünüyor mu?
- [ ] Tam ekran modu çalışıyor mu?
- [ ] Pencere yeniden boyutlandırma düzgün çalışıyor mu?

**Erişilebilirlik:**
- [ ] Klavye navigasyonu çalışıyor mu?
- [ ] Tab sırası mantıklı mı?
- [ ] Focus indicator'lar görünüyor mu?
- [ ] Ekran okuyucu desteği var mı?

### 16.4 Dosya İşlemleri Testleri

**JSON Export:**
- [ ] Kategori JSON'a aktarılabiliyor mu?
- [ ] Dosya adı doğru önerilmiş mi?
- [ ] Format doğru mu?
- [ ] Tüm kelimeler dahil mi?

**JSON Import:**
- [ ] Geçerli JSON import ediliyor mu?
- [ ] Geçersiz JSON reddediliyor mu?
- [ ] Duplicate kelimeler atlanıyor mu?
- [ ] Hatalı format mesajı gösteriliyor mu?

**Veritabanı Yedekleme:**
- [ ] DB yedeği alınabiliyor mu?
- [ ] DB geri yüklenebiliyor mu?
- [ ] Geri yükleme sonrası veriler düzgün mü?

### 16.5 Geçmiş Yarışmalar Testleri

**Kayıt İşlemleri:**
- [ ] Oyun bittiğinde sonuçlar otomatik kaydediliyor mu?
- [ ] Tek yarışmacı modu sonuçları doğru kaydediliyor mu?
- [ ] Çoklu yarışmacı modu sonuçları doğru kaydediliyor mu?
- [ ] Takım modu sonuçları doğru kaydediliyor mu?
- [ ] Her kelime için detaylı bilgiler kaydediliyor mu?
- [ ] Katılımcı bilgileri doğru kaydediliyor mu?

**Görüntüleme:**
- [ ] Geçmiş yarışmalar listesi doğru gösteriliyor mu?
- [ ] Filtreleme çalışıyor mu?
- [ ] Sıralama çalışıyor mu?
- [ ] Sayfalama çalışıyor mu?
- [ ] İstatistik özeti doğru mu?
- [ ] Boş durum mesajı gösteriliyor mu?

**Detay Ekranı:**
- [ ] Yarışma detayları doğru gösteriliyor mu?
- [ ] Katılımcı sıralaması doğru mu?
- [ ] Kelime sonuçları doğru mu?
- [ ] Genişletilebilir bölümler çalışıyor mu?

**Export/Delete:**
- [ ] Geçmiş JSON'a aktarılabiliyor mu?
- [ ] Export dosyası doğru formatlanmış mı?
- [ ] Tek yarışma silinebiliyor mu?
- [ ] Tüm geçmiş silinebiliyor mu?
- [ ] Silme onay dialog'u çalışıyor mu?

### 16.6 Klavye Kısayolları Testleri

**Global Kısayollar:**
- [ ] F11 tam ekran çalışıyor mu?
- [ ] Ctrl/Cmd+Q çıkış çalışıyor mu?
- [ ] Esc geri/iptal çalışıyor mu?

**Oyun Ekranı:**
- [ ] H tuşu harf açıyor mu?
- [ ] T tuşu tahmin popup'ı açıyor mu?
- [ ] P tuşu pas geçiyor mu?
- [ ] Space duraklat/devam çalışıyor mu?
- [ ] M tuşu ses toggle çalışıyor mu?

**Popup Kısayolları:**
- [ ] D/Enter doğru seçiyor mu?
- [ ] Y/N yanlış seçiyor mu?
- [ ] Esc dialog kapatıyor mu?

### 16.7 Edge Case Testleri

**Sınır Durumları:**
- [ ] Boş kategori oluşturulmaya çalışılırsa?
- [ ] 13 kelimeli kategoride tek yarışmacı modu başlatılırsa?
- [ ] 20 kelimeli kategoride 2 kişilik mod başlatılırsa? (28 gerekli)
- [ ] 50 kelimeli kategoride kaç kişi oynayabilir? (3 kişi max)
- [ ] 5 harfli kelime 3 adet, 6 harfli 1 adet varsa?
- [ ] Aynı isimde kategori oluşturulmaya çalışılırsa?
- [ ] Kelime yokken kelime eklenmeye çalışılırsa?
- [ ] 3 karakterli kelime eklenmeye çalışılırsa?
- [ ] 11 karakterli kelime eklenmeye çalışılırsa?
- [ ] Türkçe karakterli kelime eklenmeye çalışılırsa?
- [ ] Sayı içeren kelime eklenmeye çalışılırsa?

**Oyun Kuralları Edge Cases:**
- [ ] Tahmin sonrası harf açmaya çalışırsa ne olur?
- [ ] 4. tahmin yapılmaya çalışılırsa ne olur? (max 3)
- [ ] 300 saniye bitmeden 14 kelime bulunursa oyun bitiyor mu?
- [ ] Eşitlik durumunda kurallar doğru uygulanıyor mu?
- [ ] Çoklu modda kelimeler tekrar ediyor mu?
- [ ] Takım modunda oyuncu eklenemezse ne olur?

**Performans:**
- [ ] 100+ kelimeli kategori düzgün çalışıyor mu?
- [ ] 50+ kategori varken yavaşlama var mı?
- [ ] Uzun oyunlarda bellek sızıntısı var mı?
- [ ] 5 dakikalık süre doğru yönetiliyor mu?
- [ ] 6 kişilik oyunda (84 kelime seçimi) performans sorun var mı?

---

## 17. KURULUM VE DAĞITIM

### 17.1 Geliştirme Ortamı Gereksinimleri

**Sistem Gereksinimleri:**
- Node.js 18+ ve npm/yarn
- Rust 1.70+
- Tauri CLI

**Platform Bazlı:**
- **Windows:** Visual Studio Build Tools
- **macOS:** Xcode Command Line Tools
- **Linux:** Build essential, webkit2gtk

### 17.2 Build Yapılandırması

**Tauri Config (`tauri.conf.json`):**

**Uygulama Bilgileri:**
- App Name: "Kelime Oyunu"
- Version: "1.0.0"
- Identifier: "com.kelimeoyunu.app"

**Pencere Ayarları:**
- Başlangıç boyutu: 1920x1080
- Minimum boyut: 1280x720
- Resizable: true
- Fullscreen: true (F11)
- Title: "Kelime Oyunu"

**Güvenlik:**
- CSP: Default-src 'self'
- Dangling remote enable: false
- LocalStorage: enabled

### 17.3 Uygulama İkonları

**Gerekli İkon Boyutları:**
- 32x32, 128x128, 256x256, 512x512 (PNG)
- ICO (Windows)
- ICNS (macOS)
- PNG (Linux)

**İkon Tasarımı:**
- Ana renk: Mavi/Mor gradient
- Kelime/harf teması
- Modern, minimal stil
- Tüm platformlarda tanınabilir

### 17.4 Yayınlama

**Sürüm Numaralandırma:**
- Semantic versioning: MAJOR.MINOR.PATCH
- Örnek: 1.0.0 (ilk stabil sürüm)

**Dağıtım Kanalları:**
- GitHub Releases (tüm platformlar)
- Windows: Portable EXE + MSI installer
- macOS: DMG + .app bundle
- Linux: AppImage + .deb + .rpm

**Güncelleme Mekanizması:**
- Tauri Updater (opsiyonel)
- Manuel indirme (GitHub Releases)

---

## 18. DOKÜMANTASYON GEREKSİNİMLERİ

### 18.1 README.md

**İçerik:**
- Proje açıklaması
- Özellikler listesi
- Ekran görüntüleri
- Kurulum talimatları
- Kullanım kılavuzu
- Katkıda bulunma rehberi
- Lisans bilgisi

### 18.2 CONTRIBUTING.md

**İçerik:**
- Kod stili kuralları
- Commit mesaj formatı
- Branch stratejisi
- Pull request süreci
- Test gereksinimleri

### 18.3 LICENSE

**MIT License:**
- Tam metin dahil
- Copyright bilgisi
- İzinler ve kısıtlamalar

### 18.4 CHANGELOG.md

**Format:**
- Sürüm numarası ve tarih
- Added, Changed, Fixed, Removed kategorileri
- Her değişiklik madde madde

### 18.5 Kullanıcı Kılavuzu

**İçerik:**
- Kurulum adımları
- İlk başlangıç
- Kategori oluşturma
- Kelime ekleme
- Oyun oynama
- Ayarlar
- Sorun giderme
- SSS

---

## 19. KALİTE VE PERFORMANS METRİKLERİ

### 19.1 Kod Kalitesi

**TypeScript:**
- Strict mode enabled
- No implicit any
- No unused variables
- ESLint + Prettier

**Rust:**
- Clippy warnings: 0
- Cargo fmt uyumlu
- No unsafe code (mümkünse)

### 19.2 Performans Hedefleri

**Başlangıç:**
- Cold start: < 3 saniye
- Warm start: < 1 saniye

**Oyun İçi:**
- Harf açma latency: < 50ms
- Animasyon frame rate: 60 FPS
- Kategori değiştirme: < 200ms
- Kelime listesi yükleme: < 100ms

**Bellek:**
- İlk yükleme: < 100 MB
- Oyun sırasında: < 150 MB
- Peak kullanım: < 200 MB
- Memory leak: 0

**Disk:**
- Veritabanı boyutu (100 kategori, 3000 kelime): < 5 MB
- Uygulama boyutu:
  - Windows: 15-25 MB
  - macOS: 20-30 MB
  - Linux: 15-20 MB

### 19.3 Test Coverage

**Hedef Coverage:**
- Unit tests: > 80%
- Integration tests: > 60%
- E2E tests: Kritik akışlar

**Test Araçları:**
- Jest (React bileşenleri)
- React Testing Library
- Tauri test framework
- Rust unit tests

---

## 20. GELECEKTEKİ GELİŞTİRMELER (ROADMAP)

### 20.1 V1.1 - Gelişmiş Özellikler

**Planlanan:**
- Çoklu dil desteği (İngilizce UI)
- Tema değiştirme (Light/Dark/Auto)
- Özel ses dosyası yükleme
- Kategori paylaşma (QR kod ile)
- Oyun içi not alma
- Kelime favorileme
- Geçmiş yarışmalar için gelişmiş filtreler
- İstatistik grafikleri (çizgi, pasta grafikleri)
- Yarışma karşılaştırma (iki yarışmayı yan yana karşılaştırma)
- Kişisel rekorlar (en yüksek puan, en hızlı tamamlama, vs.)

**Tahmini Süre:** 2 ay

### 20.2 V1.2 - Sosyal Özellikler

**Planlanan:**
- Lokal network multiplayer
- Turnuva modu
- Achievement sistemi
- Liderlik tablosu (lokal)
- Profil sistemi
- İstatistik grafikleri

**Tahmini Süre:** 3 ay

### 20.3 V2.0 - Büyük Güncelleme

**Planlanan:**
- Cloud sync (opsiyonel)
- Mobil uygulama (React Native)
- Web versiyonu
- Topluluk kategori marketi
- Yapay zeka destekli ipucu oluşturma
- Sesli komut desteği

**Tahmini Süre:** 6 ay

### 20.4 Topluluk İstekleri

**Değerlendirme Süreci:**
- GitHub Issues üzerinden
- Oylamalı feature request sistemi
- Aylık roadmap güncellemesi
- Şeffaf önceliklendirme

---

## 21. DESTEK VE TOPLULUK

### 21.1 Topluluk Kanalları

**Planlanan:**
- GitHub Discussions (ana forum)
- Discord sunucusu (opsiyonel)
- Reddit community (opsiyonel)
- Twitter/X hesabı (duyurular)

### 21.2 Issue Yönetimi

**Etiket Sistemi:**
- `bug` - Hata raporları
- `enhancement` - Yeni özellik
- `documentation` - Dokümantasyon
- `good first issue` - Yeni katkıcılar için
- `help wanted` - Topluluk yardımı
- `question` - Soru
- `wontfix` - Yapılmayacak
- `duplicate` - Tekrar

**Issue Template:**
- Bug report şablonu
- Feature request şablonu
- Soru şablonu

### 21.3 Pull Request Süreci

**Gereksinimler:**
- Test coverage düşmemeli
- Kod formatı uygun olmalı
- Commit mesajları anlamlı
- CHANGELOG.md güncellenmiş
- Dokümantasyon güncellenmiş (gerekirse)

**Review Süreci:**
- En az 1 maintainer onayı
- CI/CD testleri geçmeli
- Çakışma olmamalı

---

## 22. LİSANSLAMA VE YASAL

### 22.1 Açık Kaynak Lisansı

**MIT License:**

```
MIT License

Copyright (c) 2024 [Proje Sahipleri]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 22.2 Üçüncü Parti Bağımlılıklar

**Lisans Uyumluluğu:**
- Tüm bağımlılıklar MIT uyumlu olmalı
- GPL lisanslı kütüphanelerden kaçınılmalı
- LICENSE-3RD-PARTY.md dosyası tutulmalı

**Kullanılan Başlıca Kütüphaneler:**
- React (MIT)
- Tauri (MIT/Apache-2.0)
- Tailwind CSS (MIT)
- Framer Motion (MIT)
- Lucide React (ISC)
- Zustand (MIT)

### 22.3 Marka ve Telif Hakları

**Uygulama Adı:**
- "Kelime Oyunu" generic bir isimdir
- Trademark başvurusu yapılmamıştır
- Topluluk projesinde değişebilir

**Logo ve Görsel Materyal:**
- Tüm görseller açık kaynaklıdır
- Topluluk katkıları MIT altındadır
- Üçüncü parti kaynaklar lisanslanmıştır

### 22.4 Gizlilik Politikası

**Veri Toplama:**
- Hiçbir kişisel veri toplanmaz
- Hiçbir analitik kullanılmaz
- Hiçbir telemetri yapılmaz
- Tamamen offline çalışır

**Kullanıcı İçeriği:**
- Tüm kategoriler ve kelimeler kullanıcının bilgisayarındadır
- Dışa aktarma kullanıcı kontrolündedir
- Hiçbir sunucuya veri gönderilmez

---

## 23. PROJE YÖNETİMİ

### 23.1 Geliştirme Metodolojisi

**Agile Yaklaşım:**
- 2 haftalık sprint'ler
- Haftalık progress review
- Kanban board (GitHub Projects)
- Milestone'lar ile versiyon takibi

### 23.2 Git Workflow

**Branch Stratejisi:**
- `main` - Stabil production branch
- `develop` - Geliştirme branch'i
- `feature/*` - Yeni özellikler
- `bugfix/*` - Hata düzeltmeleri
- `hotfix/*` - Acil düzeltmeler

**Commit Convention:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - Yeni özellik
- `fix` - Hata düzeltme
- `docs` - Dokümantasyon
- `style` - Kod formatı
- `refactor` - Kod iyileştirme
- `test` - Test ekleme
- `chore` - Diğer işler

**Örnek:**
```
feat(category): add JSON import/export functionality

Implemented JSON import and export for categories with
full validation and error handling.

Closes #42
```

### 23.3 CI/CD Pipeline

**GitHub Actions:**

**Pull Request:**
- Lint check (ESLint, Clippy)
- Type check (TypeScript)
- Unit tests
- Build test (tüm platformlar)
- Code coverage report

**Main Branch:**
- Yukarıdakiler
- E2E tests
- Release build
- Artifact upload

**Release:**
- Version bump
- Changelog update
- Build tüm platformlar
- GitHub Release oluştur
- Asset upload
- Announcement (GitHub Discussions)

### 23.4 Versiyon Yönetimi

**Semantic Versioning:**
- **MAJOR:** Breaking changes
- **MINOR:** Yeni özellikler (backward compatible)
- **PATCH:** Hata düzeltmeleri

**Örnek:**
- `1.0.0` - İlk stabil release
- `1.1.0` - Tema desteği eklendi
- `1.1.1` - Kategori silme hatası düzeltildi
- `2.0.0` - Veritabanı yapısı değişti

---

## 24. GÜVENLİK

### 24.1 Güvenlik İlkeleri

**Kod Güvenliği:**
- Input validation her zaman
- SQL injection koruması (prepared statements)
- XSS koruması (React default)
- Path traversal koruması (Tauri FS API)
- No eval() usage

**Bağımlılık Güvenliği:**
- Otomatik security audit (npm audit, cargo audit)
- Düzenli bağımlılık güncellemesi
- Vulnerability monitoring (Dependabot)

### 24.2 Güvenlik Raporlama

**Responsible Disclosure:**
- SECURITY.md dosyası
- Özel güvenlik e-postası
- 90 gün disclosure timeline
- Hall of Fame (raporlayan kişiler)

**Güvenlik Güncellemeleri:**
- Critical: Anında patch
- High: 7 gün içinde
- Medium: 30 gün içinde
- Low: Sonraki minor release

---

## 25. BAŞARI KRİTERLERİ

### 25.1 V1.0 Launch Kriterleri

**Fonksiyonel:**
- [ ] Tüm core özellikler çalışıyor
- [ ] Critical bug'lar çözülmüş
- [ ] Tüm testler geçiyor
- [ ] 3 platformda build alınabiliyor
- [ ] Kurulum sorunsuz yapılabiliyor

**Dokümantasyon:**
- [ ] README.md tamamlanmış
- [ ] Kullanıcı kılavuzu yazılmış
- [ ] API dokümantasyonu hazır
- [ ] CHANGELOG.md güncel
- [ ] LICENSE eklenmiş

**Kalite:**
- [ ] Test coverage > 80%
- [ ] Performance metrikleri karşılanmış
- [ ] Accessibility AA seviyesi
- [ ] Code review tamamlanmış
- [ ] Security audit yapılmış

### 25.2 Başarı Metrikleri (3 ay sonra)

**Teknik:**
- 0 critical bug
- < 5 high priority bug
- > 90% uptime (crash-free)

**Kullanıcı:**
- > 100 indirme
- > 10 GitHub star
- > 5 topluluk katkısı
- 0 negatif güvenlik raporu

**Topluluk:**
- > 20 GitHub issue açılmış
- > 5 pull request merge edilmiş
- > 3 kategori şablonu paylaşılmış

---

## 26. SÖZLÜK

**Terimler:**

- **Kategori:** Kelimelerin gruplandığı tema (Spor, Yiyecek, vb.)
- **Kelime Havuzu:** Bir kategorideki tüm kelimeler
- **14 Kelime:** Her oyuncuya/takıma verilen kelime sayısı (her uzunluktan 2'şer)
- **Minimum Kelime:** Tek mod için 14, çoklu için (katılımcı × 14)
- **5 Dakika Süresi:** Oyunun toplam süresi (300 saniye), tüm kelimeler için ortak
- **Farklı Kelimeler:** Çoklu/takım modunda her katılımcıya farklı kelime seti
- **Harf Açma:** Kapalı bir harfi görünür hale getirme (-100 puan ceza)
- **Tahmin Hakkı:** Her kelime için maksimum 3 yanlış tahmin hakkı
- **Tahmin Sonrası Kural:** Tahmin yapıldıktan sonra harf alınamaz (kritik kural)
- **Pas Geçme:** Kelimeyi atlamak, 0 puan
- **Base Puan:** Kelimeye verilen başlangıç puanı (harf sayısı × 100)
- **Net Puan:** Harf açma cezaları düşüldükten sonraki puan
- **Eşitlik Kuralları:** 1) Puan → 2) Daha az harf → 3) Daha hızlı bitiren
- **Validasyon:** Kategorinin oynanabilir olup olmadığını kontrol etme
- **Takım Oyuncuları:** Takım modunda her takımın belirlenmiş oyuncuları
- **Modal:** Ekranın üzerinde açılan popup pencere
- **Toast:** Kısa bildirim mesajı
- **Artifact:** Build çıktısı, kurulum dosyası

---

## 27. EK NOTLAR

### 27.1 Tasarım Felsefesi

**İlkeler:**
1. **Basitlik:** Karmaşık özelliklerden kaçın
2. **Performans:** Hız her zaman öncelik
3. **Erişilebilirlik:** Herkes kullanabilmeli
4. **Öğretici:** UI kendini açıklamalı
5. **Güvenilirlik:** Crash olmamalı
6. **Offline-First:** İnternet gerektirmemeli

### 27.2 Geliştirici Notları

**Best Practices:**
- Fonksiyonlar tek sorumluluk prensibi
- Magic number kullanmayın (constant tanımlayın)
- Yorum satırları neden açıklasın, ne değil
- Error handling her yerde
- Type safety'den taviz vermeyin

**Kod Organizasyonu:**
```
src/
├── components/        # React bileşenleri
│   ├── common/       # Tekrar kullanılabilir
│   ├── game/         # Oyun ekranı
│   ├── category/     # Kategori yönetimi
│   └── layout/       # Layout bileşenleri
├── hooks/            # Custom React hooks
├── store/            # State management
├── types/            # TypeScript types
├── utils/            # Yardımcı fonksiyonlar
├── constants/        # Sabitler
└── styles/           # Global stiller

src-tauri/
├── src/
│   ├── commands/     # Tauri komutları
│   ├── database/     # DB işlemleri
│   ├── models/       # Veri modelleri
│   └── utils/        # Rust utilities
└── Cargo.toml
```

### 27.3 Önemli Kararlar

**Neden Tauri?**
- Electron'dan 10x daha küçük
- Daha hızlı başlangıç
- Daha az bellek kullanımı
- Native performans
- Rust güvenliği

**Neden SQLite?**
- Dosya bazlı, kurulum gerektirmez
- Hafif ve hızlı
- ACID uyumlu
- Yaygın destek
- Yedekleme kolay

**Neden React?**
- Geniş ekosistem
- Developer experience
- Tailwind entegrasyonu
- Framer Motion desteği
- TypeScript uyumu

**Neden Offline-Only?**
- Gizlilik
- Basitlik
- Güvenilirlik
- Okullarda firewall problemleri yok
- Hız

---

## 28. KAYNAKLAR

### 28.1 Dokümantasyon

**Resmi Dokümanlar:**
- Tauri: https://tauri.app/
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/
- Framer Motion: https://www.framer.com/motion/

**Topluluk Kaynakları:**
- GitHub Discussions
- Stack Overflow
- Discord (Tauri)
- Reddit r/tauri

### 28.2 İlham Kaynakları

**Benzer Projekte:**
- Kelime oyunları (TV formatları)
- Wordle
- Hangman
- Scrabble
- Boggle

### 28.3 Tasarım İlhamı

**Design Systems:**
- Tailwind UI
- Shadcn/ui
- Radix UI
- Headless UI

**Color Palettes:**
- Tailwind Colors
- Coolors.co
- Adobe Color

---

## 29. SONUÇ

Bu dokümantasyon, Kelime Oyunu projesinin Tauri ile geliştirilmesi için kapsamlı bir rehber sunmaktadır. Tüm teknik gereksinimler, tasarım prensipleri, iş akışları ve kalite standartları detaylı olarak açıklanmıştır.

**Proje Özeti:**
- Modern, performanslı masaüstü uygulaması
- Eğitim odaklı, açık kaynak
- Kategori bazlı kelime yarışması
- Offline, güvenli, hızlı
- Cross-platform (Windows, macOS, Linux)

**Başarı İçin Anahtar Noktalar:**
1. Kullanıcı deneyimine odaklanın
2. Performanstan ödün vermeyin
3. Kod kalitesini koruyun
4. Topluluğu dinleyin
5. Şeffaf olun

**İletişim:**
- GitHub: [Repo URL]
- Issues: [Issues URL]
- Discussions: [Discussions URL]

---

**Doküman Versiyonu:** 1.0  
**Son Güncelleme:** 16 Ekim 2025  
**Durum:** Final Draft

---

Bu PRD, projenin tüm geliştirme sürecinde referans dokümanı olarak kullanılacaktır. Gerektiğinde güncellenecek ve versiyonlanacaktır.
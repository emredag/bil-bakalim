# Kelime Oyunu - Proje Genel Bakış

## 📋 İçindekiler

1. [Proje Hakkında](#proje-hakkında)
2. [Teknoloji Yığını](#teknoloji-yığını)
3. [Tüm Sayfalar (17 Sayfa)](#tüm-sayfalar)
4. [Routing Yapısı](#routing-yapısı)
5. [Ana Özellikler](#ana-özellikler)
6. [Oyun Kuralları](#oyun-kuralları)
7. [Teknik Mimari](#teknik-mimari)
8. [Veritabanı Yapısı](#veritabanı-yapısı)
9. [API Komutları](#api-komutları)
10. [JSON İçe/Dışa Aktarma](#json-içedışa-aktarma)

---

## Proje Hakkında

**Kelime Oyunu**, sınıf ortamında ve TV tarzı yarışmalarda kullanılmak üzere tasarlanmış eğitsel bir Türkçe kelime tahmin oyunudur.

### Temel Bilgiler

- **Proje Adı:** Kelime Oyunu (Word Game App)
- **Versiyon:** 1.0.0
- **Platform:** Cross-platform Desktop (Windows, macOS, Linux)
- **Lisans:** MIT
- **Durum:** Production-ready

### Amaç

- Sınıf ortamında projeksiyon/TV üzerinde oynanabilen kelime yarışması
- Tek oyunculu, çok oyunculu ve takım modları
- Kategori ve kelime yönetimi
- Oyun geçmişi takibi
- Profesyonel animasyonlar ve ses efektleri

---

## Teknoloji Yığını

### Frontend

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.6.2 | Type safety |
| **Vite** | 6.0.3 | Build tool & dev server |
| **Tailwind CSS** | 3.4.18 | Styling |
| **Framer Motion** | 12.23.24 | Animations |
| **Zustand** | 5.0.8 | State management |
| **React Router** | 7.9.4 | Routing |
| **Lucide React** | 0.546.0 | Icons |
| **@dnd-kit** | - | Drag & drop |

### Backend

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Tauri** | 2.x | Desktop framework |
| **Rust** | - | Backend runtime |
| **SQLite** | rusqlite 0.32 | Local database |
| **Web Audio API** | - | Sound effects |

### Test & Kalite

- **Vitest** 4.0.5 - Test framework
- **React Testing Library** 16.3.0 - Component testing
- **ESLint** 8.57.1 - Code linting
- **Prettier** 3.6.2 - Code formatting
- **Husky** 9.1.7 - Git hooks

---

## Tüm Sayfalar

Uygulama toplamda **17 ekran/sayfa** içermektedir.

### 1. Hoşgeldin Ekranı

**Route:** `/welcome`
**Dosya:** `WelcomeScreen.tsx`

**Amaç:**
İlk açılışta kullanıcıyı karşılayan ve veritabanı başlatma işlemini onaylayan ekran.

**Özellikler:**
- Hoşgeldin mesajı ve uygulama tanıtımı
- Animasyonlu parıltı ikonu ✨
- "Başla" butonu (Ana Menü'ye yönlendirir)
- Sadece ilk açılışta gösterilir

**Kullanıcı Akışı:**
```
İlk Açılış → Hoşgeldin Ekranı → Ana Menü
```

---

### 2. Ana Menü Ekranı

**Route:** `/` (ana sayfa)
**Dosya:** `MainMenuScreen.tsx`

**Amaç:**
Uygulamanın merkezi navigasyon hub'ı. Tüm ana özelliklere buradan erişilir.

**Özellikler:**
- **5 aksiyon kartı** responsive grid düzeninde:
  1. 🏁 **Yarışma Başlat** - Yeni oyun başlatır
  2. 📚 **Kategori Yönetimi** - Kategorileri düzenle
  3. 📊 **Geçmiş Yarışmalar** - Önceki oyunları görüntüle
  4. ⚙️ **Ayarlar** - Uygulama ayarları
  5. ℹ️ **Nasıl Oynanır?** - Oyun kuralları ve rehber

- Parçacık efektli gradient arkaplan
- Kademeli giriş animasyonları
- Klavye navigasyonu desteği
- Versiyon bilgisi ve GitHub linki

**Grid Yapısı:**
- Mobil: 1 sütun
- Tablet: 2 sütun
- Desktop: 3 sütun (12-column sistem)

**Kullanıcı Akışı:**
```
Ana Menü → [Seçilen Özellik]
```

---

### 3. Kategori Seçim Ekranı

**Route:** `/category-select`
**Dosya:** `CategorySelectionScreen.tsx`

**Amaç:**
Oyun için kategori seçimi yapılan ekran.

**Özellikler:**
- Tüm kategorilerin kart görünümünde listelenmesi
- Her kart şunları gösterir:
  - Kategori emojisi ve adı
  - Açıklama
  - Kelime sayısı dağılımı (4-10 harf)
  - Geçerlilik rozetleri (oynanabilir/oynanamaz)

- **Arama/Filtreleme** - Kategori adına göre arama
- **Doğrulama Göstergeleri:**
  - ✅ Oynanabilir (yeterli kelime var)
  - ⚠️ Eksik kelime

- **Boş Durum:** "Kategori Oluştur" butonu ile yeni kategori ekleme

**Kullanıcı Akışı:**
```
Ana Menü → Kategori Seçimi → Mod Seçimi
```

---

### 4. Oyun Modu Seçim Ekranı

**Route:** `/mode-select`
**Dosya:** `GameModeSelectionScreen.tsx`

**Amaç:**
Oyun modunun seçildiği ekran.

**Özellikler:**
- **3 büyük mod kartı:**

  **1. Tek Oyunculu**
  - 1 oyuncu
  - 14 kelime
  - 5 dakika süre
  - Minimum gereksinim: Her uzunluktan 2 kelime

  **2. Çok Oyunculu**
  - 2-6 oyuncu
  - Her oyuncuya 14 benzersiz kelime
  - Her oyuncuya 5 dakika
  - Minimum gereksinim: (Oyuncu sayısı × 2) kelime/uzunluk

  **3. Takım Modu**
  - 2-4 takım
  - Her takıma 14 benzersiz kelime
  - Her takıma 5 dakika
  - Minimum gereksinim: (Takım sayısı × 2) kelime/uzunluk

- **Mod Doğrulama:**
  - Yetersiz kelime varsa mod devre dışı bırakılır
  - Tooltip ile eksik gereksinimler gösterilir

**Kullanıcı Akışı:**
```
Kategori Seçimi → Mod Seçimi → Katılımcı Kurulumu
```

---

### 5. Katılımcı Kurulum Ekranı

**Route:** `/participant-setup`
**Dosya:** `ParticipantSetupScreen.tsx`

**Amaç:**
Oyuncular veya takımların yapılandırıldığı ekran.

**Özellikler:**

**Tek Oyunculu Mod:**
- İsim girişi alanı

**Çok Oyunculu Mod:**
- 2-6 oyuncu ekle/çıkar
- Sürükle-bırak ile sıralama
- Yinelenen isim kontrolü
- Her oyuncu için:
  - İsim girişi
  - Sıra numarası
  - Kaldır butonu

**Takım Modu:**
- 2-4 takım oluştur
- Her takım için:
  - Takım adı
  - Takım emojisi
  - Takım rengi
  - 2-4 üye ekle
  - Üye sıralaması
- Görsel takım çipleri

**Doğrulama:**
- Kelime gereksinimi özeti
- "Oyunu Başlat" butonu (geçerli olduğunda aktif)

**Kullanıcı Akışı:**
```
Mod Seçimi → Katılımcı Kurulumu → Oyun Ekranı
```

---

### 6. Oyun Ekranı

**Route:** `/game`
**Dosya:** `GameScreen.tsx`

**Amaç:**
Ana oynanış ekranı. Kelimelerin tahmin edildiği, harflerin açıldığı ekran.

**Ekran Düzeni:**

```
┌─────────────────────────────────────────┐
│ HEADER (120px)                          │
│ ⏱️ Süre | 🏆 Skor | 👤 İsim | 📂 Kategori│
├─────────────────────────────────────────┤
│                                         │
│ WORD AREA (500px)                       │
│    _ _ _ _ _ _ _                        │
│   (Harf Kareleri)                       │
│                                         │
├─────────────────────────────────────────┤
│ HINT SECTION (100px)                    │
│ 💡 İpucu: Ormanın kralı                 │
├─────────────────────────────────────────┤
│ CONTROL PANEL (280px)                   │
│ [Harf Aç] [Tahmin Et] [Atla]          │
│ Kalan tahmin: 3 | Açılan harf: 0       │
├─────────────────────────────────────────┤
│ PROGRESS BAR (60px)                     │
│ ████████░░░░  8/14                      │
└─────────────────────────────────────────┘
```

**Özellikler:**

**1. Zamanlayıcı**
- Katılımcı başına 5 dakika (300 saniye)
- Gerçek zamanlı geri sayım (MM:SS)
- Son 10 saniyede uyarı animasyonu
- Son 10 saniyede tik sesi
- Süre bitince otomatik bitiş

**2. Harf Açma**
- "Harf Aç" butonu veya H tuşu
- Rastgele gizli harf açılır
- 3D çevirme animasyonu
- Maliyet: -100 puan/harf
- **ÖNEMLİ:** Tahmin yaptıktan sonra harf açılamaz!

**3. Tahmin Etme**
- "Tahmin Et" butonu veya T tuşu
- Modal açılır, 2 seçenek:
  - ✅ **Doğru:** Kelime bulundu, puan kazanıldı, sonraki kelime
  - ❌ **Yanlış:** Kalan tahmin azalır
- Maksimum 3 tahmin/kelime
- 3 yanlış tahmin = Kelime atlandı (0 puan)

**4. Kelime Atlama**
- "Atla" butonu veya P tuşu
- Onay modalı
- Kelime atlanır, 0 puan

**5. Duraklatma**
- Space veya Esc tuşu
- Süre durur
- Overlay ekran
- Devam et / Ana Menü butonları

**6. Konfeti Efekti**
- Doğru tahminde patlama animasyonu

**7. Tur Geçişi (Çoklu/Takım modunda)**
- Her katılımcı arasında geçiş ekranı
- Sonraki oyuncunun/takımın adı
- "Hazırım" butonu (5 saniye sonra otomatik başlar)
- Ekran gözetlemeyi engeller

**Klavye Kısayolları:**
- `H` veya `Space` - Harf aç
- `T` veya `Enter` - Tahmin et
- `P` - Kelime atla
- `M` - Sesi aç/kapat
- `Esc` - Duraklat / Ana Menü

**Ses Efektleri:**
- Pop: Harf açıldı
- Success: Doğru tahmin
- Error: Yanlış tahmin
- Whoosh: Kelime atlandı
- Tick: Süre uyarısı
- Fanfare: Oyun bitti

**Kullanıcı Akışı:**
```
Katılımcı Kurulumu → Oyun → Sonuçlar
```

---

### 7. Sonuçlar Ekranı - Tek Oyunculu

**Route:** `/results`
**Dosya:** `ResultsScreen.tsx` (SinglePlayer variant)

**Amaç:**
Tek oyunculu oyun sonuçlarını gösterir.

**Özellikler:**
- **Kutlama Başlığı:** "Tebrikler!" veya "Oyun Bitti"
- **Kategori Bilgisi:** Emoji + Kategori adı
- **Oyuncu Adı**
- **Toplam Skor:** Büyük sayısal görünüm

**İstatistik Kartları:**
- 📊 Bulunan Kelimeler: 12/14
- 🔤 Açılan Harfler: 8
- ⏱️ Geçen Süre: 4:35
- ⚡ Ortalama Süre/Kelime: 19s

**Kelime Listesi (Genişletilebilir):**
Her kelime için:
- Kelime ve ipucu
- Sonuç: ✅ Bulundu / ⏭️ Atlandı / ⏰ Süre bitti
- Kazanılan puan
- Kullanılan harf sayısı

**Aksiyon Butonları:**
- 🏠 Ana Menü
- 🔄 Tekrar Oyna
- 📊 Geçmişi Görüntüle

**Veri:**
Oyun otomatik olarak veritabanına kaydedilir.

**Kullanıcı Akışı:**
```
Oyun Bitti → Sonuçlar → Ana Menü / Tekrar Oyna / Geçmiş
```

---

### 8. Sonuçlar Ekranı - Çok Oyunculu

**Route:** `/results`
**Dosya:** `ResultsScreen.tsx` (Multiplayer variant)

**Amaç:**
Çok oyunculu oyun sıralamasını gösterir.

**Özellikler:**
- **Kazanan Duyurusu:** 1. olan oyuncunun adı
- **Sıralama Tablosu:** Madalyalarla (🥇🥈🥉)
- **Podium Görünümü:** İlk 3 için

**Her Oyuncu Satırı:**
- Sıra numarası
- Oyuncu adı
- Toplam skor
- Bulunan kelime sayısı
- Genişletilebilir detaylar:
  - İstatistik kartları
  - Kelime listesi (tek oyunculu ile aynı)

**Beraberlik Göstergesi:**
Skorlar eşitse beraberlik bilgisi gösterilir.

**Beraberlik Çözme Mantığı:**
1. Yüksek skor kazanır
2. Eşitse, fazla kelime bulan kazanır
3. Hala eşitse, daha hızlı olanı kazanır

**Aksiyon Butonları:**
- Ana Menü, Tekrar Oyna, Geçmiş

**Kullanıcı Akışı:**
```
Oyun Bitti → Sıralama → Ana Menü / Tekrar Oyna / Geçmiş
```

---

### 9. Sonuçlar Ekranı - Takım Modu

**Route:** `/results`
**Dosya:** `ResultsScreen.tsx` (TeamMode variant)

**Amaç:**
Takım oyunu sıralamasını gösterir.

**Özellikler:**
- **Kazanan Takım Vurgusu:** Takım rengi ve emojisi ile
- **Takım Sıralaması Tablosu**

**Her Takım Satırı:**
- Sıra numarası
- Takım çipi (emoji + ad + renk)
- Toplam takım skoru
- Genişletilebilir detaylar:
  - Takım üyelerinin listesi
  - Toplam istatistik kartları
  - Kelime listesi

**Aksiyon Butonları:**
- Ana Menü, Tekrar Oyna, Geçmiş

**Kullanıcı Akışı:**
```
Oyun Bitti → Takım Sıralaması → Ana Menü / Tekrar Oyna / Geçmiş
```

---

### 10. Tur Geçiş Ekranı

**Konum:** `/game` içinde overlay olarak
**Dosya:** `TurnTransitionScreen.tsx`

**Amaç:**
Çoklu ve takım modunda oyuncular/takımlar arası geçiş.

**Özellikler:**
- Sonraki katılımcının adının büyük gösterimi
- Takım emojisi ve rengi (takım modunda)
- "Hazırım" butonu
- 5 saniye sonra otomatik başlama
- Önceki oyuncunun kalan süresini gizler (gözetlemeyi engeller)

**Kullanıcı Akışı:**
```
Oyuncu 1 Bitti → Geçiş Ekranı → Oyuncu 2 Başlar
```

---

### 11. Kategori Yönetimi Ekranı

**Route:** `/category-management`
**Dosya:** `CategoryManagementScreen.tsx`

**Amaç:**
Tüm kategorileri yönetme ekranı.

**Özellikler:**

**Üst Bar:**
- Arama/Filtre çubuğu
- ➕ Kategori Oluştur butonu

**Kategori Kartları Grid:**
- 1-3 sütun (responsive)
- Her kart gösterir:
  - Kategori emojisi 🐾
  - Kategori adı
  - Açıklama
  - Kelime sayısı dağılımı (4-10 harf)
  - Doğrulama rozetleri:
    - ✅ Tek oyuncu için uygun
    - ✅ Çoklu oyun için uygun (max X oyuncu)
    - ✅ Takım oyunu için uygun (max X takım)

**Kart Aksiyonları:**
- ✏️ Düzenle (modal)
- 🗑️ Sil (onay dialogu)
- 📝 Kelimeleri Yönet (→ Kelime Yönetimi ekranı)

**Kategori Oluştur/Düzenle Modal:**
- İsim (zorunlu)
- Emoji (opsiyonel)
- Açıklama (opsiyonel)
- Kaydet/İptal butonları

**Silme Kuralları:**
- Varsayılan kategoriler silinemez
- Silme işlemi için onay gerekir
- Cascade delete: Kategori silinirse kelimeleri de silinir

**Boş Durum:**
"Henüz kategori yok. Yeni kategori oluştur!" mesajı

**Kullanıcı Akışı:**
```
Ana Menü → Kategori Yönetimi → Kelime Yönetimi (seçilen kategori için)
```

---

### 12. Kelime Yönetimi Ekranı

**Route:** `/category/:categoryId/words`
**Dosya:** `WordManagementScreen.tsx`

**Amaç:**
Belirli bir kategorinin kelimelerini yönetme ekranı.

**Ekran Düzeni:**

```
┌───────────────────────────────────────────────────┐
│ HEADER: ← Geri | 🐾 Hayvanlar                     │
├───────────────────────────────────────────────────┤
│ TOP BAR: [+ Kelime Ekle] [📥 JSON Al] [🔍 Ara]   │
├─────────────────────────────────┬─────────────────┤
│ MAIN TABLE                      │ SIDEBAR         │
│ ┌─────────────────────────────┐ │ Kelime Dağılımı│
│ │Kelime│Harf│İpucu    │Aksiyon│ │ 4 harf: ■■ 2  │
│ │ASLAN │ 5  │Orman..  │✏️ 🗑️ │ │ 5 harf: ■■■ 3│
│ │KELEBEK 7  │Renkli.. │✏️ 🗑️ │ │ 6 harf: ■ 1  │
│ └─────────────────────────────┘ │ ...            │
│                                 │ Oynanabilirlik │
│                                 │ ✅ Tek oyuncu  │
│                                 │ ✅ 2 oyuncu    │
└─────────────────────────────────┴─────────────────┘
│ BOTTOM BAR: [📤 JSON Dışa Aktar]                 │
└───────────────────────────────────────────────────┘
```

**Özellikler:**

**1. Kelime Tablosu (Sıralanabilir):**
- Kelime (BÜYÜK HARF Türkçe)
- Harf Sayısı
- İpucu
- Aksiyonlar (Düzenle, Sil)

**2. Kelime Ekle Modal:**
- Kelime girişi (4-10 harf, Türkçe)
- İpucu girişi (zorunlu)
- Doğrulama:
  - 4-10 karakter arası
  - Sadece Türkçe büyük harfler (A-Z, Ç, Ğ, İ, Ö, Ş, Ü)
  - İpucu boş olamaz

**3. Kelime Düzenle Modal:**
- Mevcut değerler dolu gelir
- Kelime ve ipucu düzenlenebilir
- Aynı doğrulama kuralları

**4. Kelime Sil:**
- Onay dialogu
- Kalıcı silme

**5. Arama/Filtreleme:**
- Kelime veya ipucuna göre arama
- Gerçek zamanlı filtreleme

**6. Sıralama:**
- Kelimeye göre (A-Z)
- Harf sayısına göre (4-10)

**7. Sağ Kenar Çubuğu:**

**Kelime Dağılımı Grafiği:**
- Her harf uzunluğu için bar chart
- 4 harf: ██ 2
- 5 harf: ███ 3
- 6 harf: █ 1
- ...
- 10 harf: ████ 4

**Oynanabilirlik Durumu:**
- ✅ Tek oyuncu: Uygun (her uzunluktan 2+ kelime)
- ✅ Çoklu oyun: Max 2 oyuncu (her uzunluktan 4+ kelime)
- ⚠️ Takım oyunu: Yetersiz (her uzunluktan 6+ kelime gerekli)

**Gereksinim Kartları:**
Her mod için minimum kelime gereksinimi

**8. JSON İçe Aktarma:**
- Dosya seçici
- Format doğrulama
- Toplu kelime ekleme
- Hata raporlama

**9. JSON Dışa Aktarma:**
- Kategori + kelimeler JSON olarak indirilir
- Yedekleme veya paylaşma için kullanılır

**Gerçek Zamanlı Güncelleme:**
Kelime eklendiğinde/silindiğinde:
- Dağılım grafiği güncellenir
- Oynanabilirlik durumu yeniden hesaplanır

**Kullanıcı Akışı:**
```
Kategori Yönetimi → Kelime Yönetimi → Kelime Ekle/Düzenle/Sil
```

---

### 13. Oyun Geçmişi Ekranı

**Route:** `/history`
**Dosya:** `GameHistoryScreen.tsx`

**Amaç:**
Geçmiş oyunları görüntüleme ve analiz etme ekranı.

**Ekran Bölümleri:**

**1. İstatistik Özeti Kartları (Üst)**
4 kart yan yana:
- 🎮 **Toplam Oyun:** 127
- 🏆 **En Yüksek Skor:** 12,400 (Ali - 15.10.2025)
- 📚 **En Çok Oynanan:** Hayvanlar (45 oyun)
- ⏱️ **Toplam Süre:** 8s 45d 12s

**2. Filtreler**
- 📅 **Tarih Aralığı:** Başlangıç - Bitiş tarihi seçici
- 📂 **Kategori:** Tüm kategoriler dropdown
- 🎯 **Oyun Modu:** Tümü / Tek / Çoklu / Takım
- 🔽 **Sıralama:**
  - Tarih (Yeni → Eski)
  - Tarih (Eski → Yeni)
  - Skor (Yüksek → Düşük)

**3. Oyun Listesi (Sayfalı)**

Her oyun satırı gösterir:
- 📅 **Tarih/Saat:** 15.11.2025 14:30
- 📂 **Kategori:** 🐾 Hayvanlar
- 🎯 **Mod:** Rozet (Tek/Çoklu/Takım)
- 👥 **Katılımcı:** 4 oyuncu
- 🏆 **Kazanan:** Ali - 8,500
- ⏱️ **Süre:** 4:35
- 🔍 **Detay Butonu**

**Genişletilebilir Satır:**
Tüm katılımcılar ve skorları:
```
1. Ali - 8,500 (12 kelime)
2. Veli - 7,200 (10 kelime)
3. Ayşe - 6,800 (11 kelime)
```

**4. Sayfalama**
- Sayfa başına 10 oyun
- Önceki / Sonraki butonları
- Sayfa numarası gösterimi (1/13)

**5. Aksiyon Butonları (Sağ Üst)**
- 🗑️ **Tümünü Sil** (onay gerekir)
- 📤 **JSON Dışa Aktar** (tüm geçmiş)

**6. Oyun Satırı Aksiyonları**
- 👁️ **Detayları Görüntüle** (→ Detay ekranı)
- 🗑️ **Bu Oyunu Sil** (onay gerekir)

**Boş Durum:**
"Henüz hiç oyun oynamadınız. Hadi başlayalım!" mesajı

**Kullanıcı Akışı:**
```
Ana Menü → Geçmiş → Oyun Detayı (seçilen oyun için)
```

---

### 14. Oyun Geçmişi Detay Ekranı

**Route:** `/history/:id`
**Dosya:** `GameHistoryDetailScreen.tsx`

**Amaç:**
Geçmiş bir oyunun tam detaylarını görüntüleme (salt okunur).

**Özellikler:**
- Tam oyun bilgisi:
  - Kategori, Mod, Tarih/Saat
  - Toplam süre, Katılımcı sayısı

- Tüm katılımcı sıralaması
- Kelime kelime sonuçlar (her katılımcı için)
- Sonuç ekranıyla aynı düzen (ama salt okunur)

**Aksiyonlar:**
- ← **Geri** (geçmiş listesine)
- 📤 **Bu Oyunu Dışa Aktar** (JSON)

**Kullanıcı Akışı:**
```
Geçmiş → Detay → Geri
```

---

### 15. Ayarlar Ekranı

**Route:** `/settings`
**Dosya:** `SettingsScreen.tsx`

**Amaç:**
Uygulama ayarlarını yapılandırma ekranı.

**Bölümler:**

**1. Genel Ayarlar**
- 🔊 **Ses:** Açık/Kapalı toggle
- 🔉 **Efekt Sesi:** 0-100% slider
- 🎬 **Animasyon Hızı:** Yavaş / Normal / Hızlı (radio)

**2. Oyun Ayarları**
- ⏱️ **Süre Formatı:** MM:SS / Saniye (radio)
- 🎉 **Konfeti Efekti:** Açık/Kapalı toggle
- 💾 **Otomatik Kaydet:** Açık/Kapalı toggle

**3. Veri Yönetimi**
- 📊 **Veritabanı Boyutu:** 2.4 MB
- 📥 **Yedekle:** Veritabanını indir (.db dosyası)
- 📤 **Geri Yükle:** Veritabanı yükle (.db dosyası)
- 🗑️ **Tüm Verileri Sıfırla:** Onay gerekir, varsayılan kategoriler geri yüklenir

**4. Hakkında**
- ℹ️ **Versiyon:** 1.0.0
- 📜 **Lisans:** MIT
- 🔗 **GitHub:** Depo linki
- 👨‍💻 **Krediler:** Geliştirici bilgileri

**Ayar Kalıcılığı:**
Tüm ayarlar localStorage'a kaydedilir (settingsStore).

**Kullanıcı Akışı:**
```
Ana Menü → Ayarlar → Değişiklik Yap → Geri
```

---

### 16. Nasıl Oynanır Ekranı

**Route:** `/how-to-play`
**Dosya:** `HowToPlayScreen.tsx`

**Amaç:**
İnteraktif oyun rehberi ve tutorial.

**Sekmeler:**

**1. TUTORIAL (Adım Adım Rehber)**

6 adımlı görsel rehber:

**Adım 1: Kategori Seçimi**
- Oynamak istediğiniz kategoriyi seçin
- Kategori kartında kelime dağılımını kontrol edin
- ✅ Oynanabilir rozeti arayın

**Adım 2: Mod Seçimi**
- 3 mod arasından seçim yapın:
  - Tek oyunculu (1 kişi)
  - Çok oyunculu (2-6 kişi)
  - Takım (2-4 takım)

**Adım 3: Katılımcı Kurulumu**
- İsimler girin (tek/çoklu mod)
- Takım oluşturun (takım modu)
- Sıralama yapın

**Adım 4: Kelimeyi Tahmin Et**
- İpucunu okuyun
- Gizli harfleri görün: `_ _ _ _ _`
- 3 tahmin hakkınız var

**Adım 5: Harf Aç veya Tahmin Et**
- **Harf Aç (H):** Rastgele harf açılır (-100 puan)
- **Tahmin Et (T):** Doğru/Yanlış işaretle
- **Atla (P):** Kelimeyi geç (0 puan)

**Adım 6: Puan Kazan**
- Her harf = 100 puan
- Açılan her harf = -100 puan
- 14 kelimeyi 5 dakikada tamamla

**2. PUANLAMA (Detaylı Puan Sistemi)**

**Puan Tablosu:**

| Harf Sayısı | Temel Puan | 1 Harf Açık | 2 Harf Açık | 3 Harf Açık |
|-------------|------------|-------------|-------------|-------------|
| 4 harf      | 400        | 300         | 200         | 100         |
| 5 harf      | 500        | 400         | 300         | 200         |
| 6 harf      | 600        | 500         | 400         | 300         |
| 7 harf      | 700        | 600         | 500         | 400         |
| 8 harf      | 800        | 700         | 600         | 500         |
| 9 harf      | 900        | 800         | 700         | 600         |
| 10 harf     | 1000       | 900         | 800         | 700         |

**Formül:**
```
Kazanılan Puan = (Harf Sayısı × 100) - (Açılan Harf × 100)
```

**Örnekler:**
- ASLAN (5 harf, 0 açık): 500 puan ✅
- KELEBEK (7 harf, 2 açık): 500 puan ✅
- KARINCA (7 harf, 5 açık): 200 puan ⚠️
- Atlanmış/Süre Bitti: 0 puan ❌

**3. OYUN MODLARI (Karşılaştırma)**

**Karşılaştırma Tablosu:**

| Özellik | Tek Oyunculu | Çok Oyunculu | Takım Modu |
|---------|--------------|--------------|------------|
| **Katılımcı** | 1 oyuncu | 2-6 oyuncu | 2-4 takım |
| **Kelime** | 14 kelime | Her oyuncuya 14 | Her takıma 14 |
| **Süre** | 5 dakika | Oyuncu başına 5 dk | Takım başına 5 dk |
| **Sıralama** | Yok | Var (skorla) | Var (skorla) |
| **İşbirliği** | Yok | Yok | Var |
| **Min. Kelime** | 2×7 = 14 | (N×2)×7 = N×14 | (N×2)×7 = N×14 |

**Ne Zaman Kullanılır:**
- **Tek:** Pratik, kişisel rekor
- **Çoklu:** Sınıf yarışması, turnuva
- **Takım:** Grup çalışması, takım ruhu

**4. KLAVYE KISAYOLLARI**

**Oyun İçi:**
| Tuş | Aksiyon |
|-----|---------|
| `H` veya `Space` | Harf aç |
| `T` veya `Enter` | Tahmin et (modal aç) |
| `P` | Kelimeyi atla |
| `M` | Sesi aç/kapat |
| `Esc` | Oyunu duraklat |

**Modal İçi:**
| Tuş | Aksiyon |
|-----|---------|
| `Enter` veya `Y` | Onayla |
| `Esc` veya `N` | İptal |

**Yönetim Ekranları:**
| Tuş | Aksiyon |
|-----|---------|
| `N` | Yeni oluştur |
| `S` | Aramaya odaklan |
| `F` | Filtreleri aç |
| `Tab` | Sonraki alan |

**5. KURALLAR (Resmi Oyun Kuralları)**

**Kelime Yapısı:**
- Toplam 14 kelime (2×4 harf, 2×5 harf, ..., 2×10 harf)
- Artan zorluk (kısa → uzun)
- Rastgele sıralama

**Tahmin Kuralları:**
- Her kelime için 3 tahmin hakkı
- Tahmin yaptıktan sonra harf açılamaz (ÖNEMLİ!)
- 3 yanlış tahmin = Kelime atlanır (0 puan)

**Süre Kuralları:**
- Katılımcı başına 5 dakika (300 saniye)
- Süre bitmeden tüm kelimeler biterse: Kalan süre bonus vermez
- Süre biterse: Kalan kelimeler 0 puan

**Kazanma Koşulları:**
1. **Birincil:** En yüksek toplam skor
2. **Beraberlik Çözme 1:** Daha az harf açan
3. **Beraberlik Çözme 2:** Daha hızlı bitiren (daha az süre)

**Yasaklar:**
- Tahmin sonrası harf açma
- Önceki kelimelere geri dönme
- Süre manipülasyonu

**Kullanıcı Akışı:**
```
Ana Menü → Nasıl Oynanır → Sekmeler Arası Gezinti
```

---

### 17. Placeholder Ekranlar

**Amaç:**
Geliştirme aşamasında kullanılan genel placeholder ekranlar.

**Özellikler:**
- Ekran adı
- "Yakında geliyor" mesajı
- Ana Menü'ye dönüş butonu

**Not:** Production sürümünde bu ekranlar kullanılmaz.

---

## Routing Yapısı

### Route Hiyerarşisi

```
/ (ROOT)
│
├─ /welcome                      → WelcomeScreen
│   └─ (İlk açılışta gösterilir)
│
├─ / (HOME - Ana Menü)           → MainMenuScreen
│   │
│   ├─ OYUN AKIŞI
│   ├─ /category-select          → CategorySelectionScreen
│   ├─ /mode-select              → GameModeSelectionScreen
│   ├─ /participant-setup        → ParticipantSetupScreen
│   ├─ /game                     → GameScreen
│   └─ /results                  → ResultsScreen
│   │
│   ├─ YÖNETİM
│   ├─ /category-management      → CategoryManagementScreen
│   └─ /category/:id/words       → WordManagementScreen
│   │
│   ├─ GEÇMİŞ
│   ├─ /history                  → GameHistoryScreen
│   └─ /history/:id              → GameHistoryDetailScreen
│   │
│   ├─ UYGULAMA
│   ├─ /settings                 → SettingsScreen
│   └─ /how-to-play              → HowToPlayScreen
│
└─ /* (catch-all)                → Redirect to HOME
```

### Route Guard

**HomeRouteGuard:**
- İlk açılış kontrolü yapar
- İlk açılışsa → `/welcome`
- Değilse → `/` (Ana Menü)

### Navigasyon Akışları

**Tam Oyun Akışı:**
```
Ana Menü → Kategori Seçimi → Mod Seçimi → Katılımcı Kurulumu → Oyun → Sonuçlar → Ana Menü
```

**Kategori Yönetimi Akışı:**
```
Ana Menü → Kategori Yönetimi → Kelime Yönetimi → Ana Menü
```

**Geçmiş Görüntüleme Akışı:**
```
Ana Menü → Geçmiş → Oyun Detayı → Geçmiş → Ana Menü
```

---

## Ana Özellikler

### 1. Oyun Modları

#### Tek Oyunculu Mod
- **Katılımcı:** 1 oyuncu
- **Kelime:** 14 kelime (2×4, 2×5, ..., 2×10)
- **Süre:** 5 dakika (300 saniye)
- **Sıralama:** Yok (kişisel rekor)
- **Minimum Gereksinim:** Her uzunluktan 2 kelime (toplam 14)

**Kullanım Senaryosu:**
- Pratik yapma
- Kişisel rekor kırma
- Öğrenci bireysel çalışması

#### Çok Oyunculu Mod
- **Katılımcı:** 2-6 oyuncu
- **Kelime:** Her oyuncuya benzersiz 14 kelime
- **Süre:** Her oyuncu için 5 dakika
- **Sıralama:** Var (1., 2., 3., vb.)
- **Tur Sistemi:** Sırayla oynarlar
- **Minimum Gereksinim:** (Oyuncu sayısı × 2) kelime/uzunluk

**Kullanım Senaryosu:**
- Sınıf yarışması
- Turnuva organizasyonu
- Rekabetçi oyun

**Beraberlik Çözme:**
1. Yüksek skor kazanır
2. Eşitse, fazla kelime bulan kazanır
3. Hala eşitse, daha hızlı bitiren kazanır

#### Takım Modu
- **Katılımcı:** 2-4 takım (her takımda 2-4 üye)
- **Kelime:** Her takıma benzersiz 14 kelime
- **Süre:** Her takım için 5 dakika
- **Sıralama:** Var (takım bazında)
- **İşbirliği:** Takım üyeleri birlikte oynar
- **Minimum Gereksinim:** (Takım sayısı × 2) kelime/uzunluk

**Kullanım Senaryosu:**
- Grup çalışması
- Takım ruhu geliştirme
- İşbirlikçi öğrenme

**Özellikler:**
- Takım adı, emoji, renk özelleştirme
- Takım çipleri (görsel kimlik)
- Toplam takım skoru

---

### 2. Kategori Yönetimi

**Kategori Özellikleri:**
- **Ad:** (Zorunlu) Kategori ismi
- **Emoji:** (Opsiyonel) Görsel tanımlayıcı (örn: 🐾, 🌍, 🍕)
- **Açıklama:** (Opsiyonel) Kategori hakkında bilgi
- **Varsayılan Bayrağı:** Varsayılan kategoriler silinemez

**İşlemler:**
- ➕ **Oluştur:** Yeni kategori ekle
- ✏️ **Düzenle:** Kategori bilgilerini güncelle
- 🗑️ **Sil:** Kategoriyi ve tüm kelimelerini sil (varsayılan olanlar hariç)
- 📝 **Kelimeleri Yönet:** Kategori kelimelerine git

**Kategori Doğrulama:**
Sistem otomatik olarak hesaplar:
- Her harf uzunluğundaki kelime sayısı (4-10)
- Tek oyuncu için uygunluk
- Çoklu oyun için maksimum oyuncu sayısı
- Takım oyunu için maksimum takım sayısı

**Doğrulama Rozetleri:**
- ✅ Uygun (Tek oyuncu)
- ✅ Max 3 oyuncu (Çoklu)
- ⚠️ Yetersiz kelime (Takım)

**Varsayılan Kategoriler (İlk Kurulumda):**
1. 🐾 Hayvanlar
2. 🌍 Ülkeler
3. 🍕 Yiyecekler
4. 📝 Genel Kelimeler

---

### 3. Kelime Yönetimi

**Kelime Özellikleri:**
- **Kelime:** 4-10 karakter, BÜYÜK HARF Türkçe
- **Harf Sayısı:** Otomatik hesaplanır
- **İpucu:** (Zorunlu) Kelime için ipucu metni

**Doğrulama Kuralları:**
- Uzunluk: 4-10 karakter
- Karakter seti: A-Z, Ç, Ğ, İ, Ö, Ş, Ü (sadece büyük harf)
- İpucu boş olamaz

**İşlemler:**
- ➕ **Ekle:** Yeni kelime ekle (modal)
- ✏️ **Düzenle:** Kelime veya ipucunu güncelle
- 🗑️ **Sil:** Kelimeyi sil (onay gerekir)
- 🔍 **Ara:** Kelime veya ipucuna göre filtrele
- 📥 **JSON Al:** Toplu kelime ekleme
- 📤 **JSON Dışa Aktar:** Kategori yedekleme

**Görselleştirme:**
- **Kelime Dağılım Grafiği:** Her harf uzunluğu için bar chart
- **Oynanabilirlik Durumu:** Her mod için uygunluk göstergesi
- **Gereksinim Kartları:** Her mod için minimum kelime sayısı

**Gerçek Zamanlı Güncelleme:**
Kelime ekleme/silme işleminde:
- Tablo güncellenir
- Dağılım grafiği yenilenir
- Oynanabilirlik durumu yeniden hesaplanır
- Ana kategori kartı güncellenir

---

### 4. Kelime Seçim Algoritması

**Amaç:**
Her katılımcıya/takıma 14 benzersiz kelime atama (2 kelime × 7 uzunluk).

**Algoritma:**
```typescript
function selectWords(categoryId, participantCount, mode) {
  const allWords = [];

  // Her harf uzunluğu için (4-10)
  for (let length = 4; length <= 10; length++) {
    // Bu uzunluktaki tüm kelimeleri al
    const wordsOfLength = getWordsByLength(categoryId, length);

    // Karıştır
    shuffle(wordsOfLength);

    // Katılımcı sayısı × 2 kelime seç
    const needed = participantCount * 2;
    const selected = wordsOfLength.slice(0, needed);

    allWords.push(...selected);
  }

  // Her katılımcıya eşit dağıt
  const participantWords = [];
  for (let i = 0; i < participantCount; i++) {
    const words = [];
    for (let length = 4; length <= 10; length++) {
      // Bu uzunluktan 2 kelime al
      words.push(
        allWords.find(w => w.length === length && !used.includes(w)),
        allWords.find(w => w.length === length && !used.includes(w))
      );
    }
    participantWords.push(words);
  }

  return participantWords;
}
```

**Garanti:**
- Hiçbir kelime çoklu/takım modunda tekrar kullanılmaz
- Her katılımcı benzersiz 14 kelime alır
- Zorluk dengeli (her uzunluktan 2 kelime)

**Sıralama:**
Kelimeler uzunlukça sıralanır (4 → 10) ilerleyen zorluk için.

---

### 5. Puanlama Sistemi

**Temel Formül:**
```
Kazanılan Puan = (Harf Sayısı × 100) - (Açılan Harf Sayısı × 100)
```

**Puan Tablosu:**

| Kelime Uzunluğu | Temel Puan | 0 Harf | 1 Harf | 2 Harf | 3 Harf | Tüm Harfler |
|-----------------|------------|--------|--------|--------|--------|-------------|
| 4 harf          | 400        | 400    | 300    | 200    | 100    | 0           |
| 5 harf          | 500        | 500    | 400    | 300    | 200    | 100/0       |
| 6 harf          | 600        | 600    | 500    | 400    | 300    | 200/100/0   |
| 7 harf          | 700        | 700    | 600    | 500    | 400    | ...         |
| 8 harf          | 800        | 800    | 700    | 600    | 500    | ...         |
| 9 harf          | 900        | 900    | 800    | 700    | 600    | ...         |
| 10 harf         | 1000       | 1000   | 900    | 800    | 700    | ...         |

**Örnek Hesaplamalar:**

**Örnek 1: ASLAN (5 harf, 0 açık)**
```
Puan = (5 × 100) - (0 × 100) = 500 puan ✅
```

**Örnek 2: KELEBEK (7 harf, 2 açık)**
```
Puan = (7 × 100) - (2 × 100) = 500 puan ✅
```

**Örnek 3: KARINCA (7 harf, 5 açık)**
```
Puan = (7 × 100) - (5 × 100) = 200 puan ⚠️
```

**Örnek 4: Atlanmış/Süre Bitti**
```
Puan = 0 puan ❌
```

**Maksimum Puanlar:**
- 4 harf: 400
- 5 harf: 500
- 6 harf: 600
- 7 harf: 700
- 8 harf: 800
- 9 harf: 900
- 10 harf: 1000

**Maksimum Toplam (14 kelime, 0 harf açık):**
```
(400×2) + (500×2) + (600×2) + (700×2) + (800×2) + (900×2) + (1000×2)
= 800 + 1000 + 1200 + 1400 + 1600 + 1800 + 2000
= 9,800 puan
```

---

### 6. Ses Sistemi

**Teknoloji:** Web Audio API

**Ses Efektleri:**

| Ses | Tetikleyici | Açıklama | Süre |
|-----|-------------|----------|------|
| **Pop** | Harf açılır | Kısa bip sesi | 100ms |
| **Success** | Doğru tahmin | Yükselen jingle | 300ms |
| **Error** | Yanlış tahmin | Alçalan buzz | 250ms |
| **Whoosh** | Kelime atla | Süpürme sesi | 200ms |
| **Tick** | Süre uyarısı | Metronom tik | 50ms |
| **Fanfare** | Oyun bitişi | Kutlama melodisi | 1s |
| **Click** | Buton tıklama | Yumuşak tık | 50ms |

**Ses Kontrolleri:**
- 🔊 Açık/Kapalı toggle (M tuşu veya ayarlar)
- 🔉 Ses seviyesi slider (0-100%)
- Tüm sesler dinamik olarak oluşturulur (dosya yok)

**Oyun İçi Ses Davranışı:**
- Son 10 saniyede otomatik tik sesi
- Ses kapalıyken hiçbir efekt çalınmaz
- Ses seviyesi tüm efektleri etkiler

---

### 7. Animasyon Sistemi

**Teknoloji:** Framer Motion

**Animasyon Tipleri:**

**1. Sayfa Geçişleri**
- Fade in/out
- Slide (yukarıdan/aşağıdan)
- Süre: 300-600ms

**2. Harf Açılma (3D Flip)**
```typescript
{
  rotateX: [0, 90, 0],
  transition: { duration: 0.6 }
}
```
- Y ekseni etrafında 3D dönüş
- Kart çevirme efekti
- Harf ortaya çıkışı

**3. Konfeti Patlaması**
- Doğru tahminde tetiklenir
- 100+ renkli parçacık
- Yukarı fırlar, düşer, kaybolur
- Süre: 2-3 saniye
- Fizik simülasyonu (gravite)

**4. Kademeli Giriş (Stagger)**
```typescript
{
  staggerChildren: 0.1,
  delayChildren: 0.2
}
```
- Kartlar sırayla belirir
- Her kart 100ms arayla
- İlk kart 200ms gecikmeli

**5. Hover Efektleri**
- Scale: 1.05× büyüme
- Shadow: Gölge artışı
- Transition: 200ms smooth

**6. Progress Bar**
- Width geçişi (smooth)
- Color lerp (gradient shift)
- Duration: 400ms

**7. Loading States**
- Skeleton loaders (pulse)
- Spinner (rotate)
- Fade blink

**Animasyon Hızı Kontrolü (Ayarlar):**
- **Yavaş:** Tüm süreler ×1.5
- **Normal:** Varsayılan süreler
- **Hızlı:** Tüm süreler ×0.5

**GPU Hızlandırma:**
Tüm animasyonlar `transform` ve `opacity` kullanır (GPU-accelerated).

---

### 8. Oyun Geçmişi

**Amaç:**
Oynanan tüm oyunları SQLite veritabanına kaydet ve analiz et.

**Kaydedilen Veriler:**

**Oyun Seviyesi:**
- Kategori (ID ve ad)
- Oyun modu (tek/çoklu/takım)
- Tarih ve saat
- Toplam süre (saniye)

**Katılımcı Seviyesi:**
Her katılımcı için:
- Ad
- Tip (oyuncu/takım)
- Toplam skor
- Bulunan kelime sayısı
- Atlanan kelime sayısı
- Açılan harf sayısı
- Sıralama (1., 2., 3., vb.)

**Kelime Seviyesi:**
Her kelime için:
- Kelime
- İpucu
- Sonuç (found/skipped/timeout)
- Kazanılan puan
- Kullanılan harf sayısı

**Özellikler:**

**1. Filtreleme ve Arama**
- Tarih aralığı (başlangıç - bitiş)
- Kategori seçimi
- Oyun modu seçimi
- Sıralama (tarih/skor)

**2. İstatistikler**
- Toplam oyun sayısı
- En yüksek skor (oyuncu adı + tarih)
- En çok oynanan kategori
- Toplam oyun süresi

**3. İçe/Dışa Aktarma**
- JSON formatında tüm geçmişi dışa aktar
- Yedekleme amaçlı
- Başka cihaza aktarma

**4. Silme İşlemleri**
- Tekil oyun silme (onay gerekir)
- Tüm geçmişi silme (onay gerekir)
- Cascade delete (oyun + katılımcılar + kelimeler)

**Sayfalama:**
- Sayfa başına 10 oyun
- Önceki/Sonraki butonları
- Toplam sayfa gösterimi

---

### 9. İlk Açılış Deneyimi

**İlk Açılışta:**

**1. Hoşgeldin Ekranı**
- Animasyonlu karşılama
- Uygulama tanıtımı
- "Başla" butonu

**2. Veritabanı Başlatma**
- SQLite veritabanı oluşturulur
- Tablolar oluşturulur
- Indexler eklenir

**3. Varsayılan Kategoriler Eklenir**

**Kategori 1: Hayvanlar 🐾**
- Örnek kelimeler: ASLAN, KELEBEK, KAPLAN, vs.
- Her uzunluktan 3-5 kelime

**Kategori 2: Ülkeler 🌍**
- Örnek kelimeler: FRANSA, TÜRKİYE, ALMANYA, vs.

**Kategori 3: Yiyecekler 🍕**
- Örnek kelimeler: PIZZA, LAHMACUN, KEBAP, vs.

**Kategori 4: Genel Kelimeler 📝**
- Örnek kelimeler: OKUL, KİTAP, KALEM, vs.

**4. İlk Açılış Bayrağı Ayarlanır**
- localStorage'da işaretlenir
- Bir daha hoşgeldin ekranı gösterilmez

**Sonraki Açılışlar:**
Direkt Ana Menü'ye yönlendirilir.

---

### 10. Klavye Kısayolları

Uygulama tam klavye desteğine sahiptir.

**Oyun İçi Kısayollar:**
- `H` / `Space` → Harf aç
- `T` / `Enter` → Tahmin modalini aç
- `P` → Kelime atla (onay gerekir)
- `M` → Sesi aç/kapat
- `Esc` → Oyunu duraklat
- `Esc` (duraklama sırasında) → Ana Menü

**Modal Kısayolları:**
- `Enter` / `Y` → Onayla
- `Esc` / `N` → İptal

**Yönetim Ekranları:**
- `N` → Yeni oluştur (kategori/kelime)
- `S` → Arama alanına odaklan
- `F` → Filtreleri aç/kapat
- `Tab` → Sonraki alana git
- `Shift+Tab` → Önceki alana git

**Global Kısayollar:**
- `Ctrl/Cmd + K` → Hızlı arama (gelecek özellik)

**Erişilebilirlik:**
- Tüm butonlar Tab ile erişilebilir
- Focus göstergeleri görünür
- ARIA etiketleri ekli

---

## Oyun Kuralları

### Kelime Yapısı

**Toplam Kelime:** 14 kelime
**Dağılım:** Her harf uzunluğundan 2 kelime

| Harf Sayısı | Kelime Adedi | Toplam Harf |
|-------------|--------------|-------------|
| 4 harf      | 2 kelime     | 8 harf      |
| 5 harf      | 2 kelime     | 10 harf     |
| 6 harf      | 2 kelime     | 12 harf     |
| 7 harf      | 2 kelime     | 14 harf     |
| 8 harf      | 2 kelime     | 16 harf     |
| 9 harf      | 2 kelime     | 18 harf     |
| 10 harf     | 2 kelime     | 20 harf     |
| **TOPLAM**  | **14 kelime**| **98 harf** |

**Sıralama:**
Kelimeler uzunlukça sıralanır (4→10) ilerleyen zorluk için.

---

### Oynanış Kuralları

**1. Tahmin Hakları**
- Her kelime için **3 tahmin** hakkı vardır
- Yanlış tahmin sayacı her yanlışta azalır
- 3 yanlış tahmin sonrası kelime atlanır (0 puan)

**2. Harf Açma**
- İstediğiniz zaman `Harf Aç` butonuna basabilirsiniz
- Rastgele bir gizli harf açılır
- **Maliyet:** -100 puan/harf
- **ÖNEMLİ KURAL:** Tahmin yaptıktan sonra harf açamazsınız!

**3. Tahmin Etme**
- `Tahmin Et` butonuna basın
- Modal açılır: Doğru mu? Yanlış mı?
- **Doğru:** Puan kazanırsınız, sonraki kelimeye geçilir
- **Yanlış:** Tahmin hakkı azalır, kelime devam eder

**4. Kelime Atlama**
- `Atla` butonuna basın (onay gerekir)
- Kelime atlanır, 0 puan alırsınız
- Sonraki kelimeye geçilir

**5. Süre**
- Katılımcı başına **5 dakika (300 saniye)**
- Geri sayım şeklinde gösterilir
- Son 10 saniyede uyarı (tik sesi + animasyon)
- Süre bitince oyun durur, kalan kelimeler 0 puan

**6. Duraklama**
- `Esc` veya `Space` ile oyunu duraklatabilirsiniz
- Süre durur
- Devam veya Ana Menü seçenekleri

---

### Puanlama Kuralları

**Formül:**
```
Puan = (Harf Sayısı × 100) - (Açılan Harf × 100)
```

**Minimum:** 0 puan (negatif olmaz)
**Maksimum (kelime başına):** Harf Sayısı × 100

**Örnekler:**
- 7 harfli kelime, 0 harf açık: **700 puan** ✅
- 7 harfli kelime, 3 harf açık: **400 puan** ⚠️
- Atlanmış kelime: **0 puan** ❌
- Süre biten kelime: **0 puan** ❌

**Toplam Skor:**
14 kelimenin puanlarının toplamı.

**Maksimum Mümkün Skor:**
9,800 puan (tüm kelimelerde 0 harf açarak)

---

### Kazanma Koşulları

**Tek Oyunculu:**
- Kazanan/kaybeden yok
- Kişisel rekor takibi

**Çoklu Oyunculu ve Takım Modu:**

**1. Birincil Kriter: Toplam Skor**
En yüksek toplam skora sahip oyuncu/takım kazanır.

**2. Beraberlik Durumu 1: Açılan Harf Sayısı**
Skorlar eşitse, **daha az harf açan** kazanır.

**3. Beraberlik Durumu 2: Süre**
Hala eşitse, **daha az süre kullanan** kazanır.

**Beraberlik Örneği:**
```
Oyuncu A: 7,500 puan, 5 harf açtı, 4:30 süre
Oyuncu B: 7,500 puan, 5 harf açtı, 4:15 süre
→ Oyuncu B kazanır (daha hızlı)
```

---

### Yasaklar ve Kısıtlamalar

**❌ Yasak Hareketler:**
1. Tahmin yaptıktan sonra harf açma
2. Önceki kelimelere geri dönme
3. Süreyi manipüle etme (duraklama dışında)
4. Başka oyuncunun ekranını gözetleme (tur geçişi bunu engeller)

**✅ İzin Verilen Hareketler:**
1. Tahmin yapmadan önce istediğiniz kadar harf açabilirsiniz
2. Tahmin yapmadan kelime atlayabilirsiniz
3. İstediğiniz zaman oyunu duraklatabilirsiniz
4. Sesi açıp/kapatabilirsiniz

---

## Teknik Mimari

### Frontend Mimarisi

**Katmanlı Mimari:**
```
┌─────────────────────────────────┐
│   Presentation Layer            │ ← React Components
│   (Screens, UI Components)      │
├─────────────────────────────────┤
│   State Management Layer        │ ← Zustand Stores
│   (gameStore, categoryStore)    │
├─────────────────────────────────┤
│   Service Layer                 │ ← Business Logic
│   (wordService, soundService)   │
├─────────────────────────────────┤
│   API Layer                     │ ← Tauri Commands
│   (category, word, gameHistory) │
├─────────────────────────────────┤
│   IPC Layer                     │ ← Tauri IPC
│   (JSON serialization)          │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│   Backend (Rust)                │
└─────────────────────────────────┘
```

**Dizin Yapısı:**
```
src/
├── components/
│   ├── screens/           # 17 sayfa komponenti
│   │   ├── MainMenuScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── ...
│   ├── modals/           # Dialog komponenti
│   │   ├── GuessModal.tsx
│   │   ├── PauseOverlay.tsx
│   │   └── ...
│   ├── game/             # Oyun-specific komponenti
│   │   ├── LetterTile.tsx
│   │   ├── Timer.tsx
│   │   └── ...
│   ├── ui/               # Yeniden kullanılabilir UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   └── layouts/          # Layout wrapper'ları
│       ├── PageLayout.tsx
│       └── ...
├── store/                # Zustand state yönetimi
│   ├── gameStore.ts      # Oyun session state
│   ├── categoryStore.ts  # Kategori seçim state
│   └── settingsStore.ts  # App ayarları (persistent)
├── services/             # İş mantığı
│   ├── wordService.ts    # Kelime seçim algoritmaları
│   ├── soundService.ts   # Web Audio API wrapper
│   ├── firstLaunch.ts    # İlk açılış kontrolü
│   └── errorHandler.ts   # Global hata yönetimi
├── api/                  # Tauri command wrapper'ları
│   ├── category.ts       # 8 kategori komutu
│   ├── word.ts           # 6 kelime komutu
│   ├── gameHistory.ts    # 8 geçmiş komutu
│   └── database.ts       # 4 database komutu
├── types/                # TypeScript tanımları
│   ├── game.ts           # Oyun tipler
│   └── database.ts       # Database modeller
├── routes/               # React Router config
│   ├── router.tsx        # Route tanımları
│   └── constants.ts      # Route path'leri
├── hooks/                # Custom React hooks
│   ├── useCategories.ts
│   ├── useGameTimer.ts
│   └── ...
├── utils/                # Helper fonksiyonlar
│   ├── turkishUtils.ts   # Türkçe karakter işleme
│   └── validation.ts     # Doğrulama fonksiyonları
└── animations/           # Framer Motion variants
    └── variants.ts
```

---

### State Management (Zustand)

**3 Ana Store:**

**1. gameStore.ts - Oyun Session State**
```typescript
interface GameStore {
  // State
  currentGame: Game | null;
  participants: Participant[];
  activeParticipantIndex: number;
  currentWordIndex: number;
  revealedLetters: boolean[];
  timeRemaining: number;
  isPaused: boolean;

  // Actions
  startGame: (setup) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  tick: () => void; // Timer countdown
  revealLetter: () => void;
  submitGuess: (isCorrect: boolean) => void;
  skipWord: () => void;
  nextParticipant: () => void;
  endGame: () => void;
}
```

**2. categoryStore.ts - Kategori Seçim State**
```typescript
interface CategoryStore {
  selectedCategory: Category | null;
  selectedMode: GameMode | null;
  gameSetup: {
    participants?: Player[];
    teams?: Team[];
  };
  validationCache: Map<string, ValidationResult>;

  // Actions
  selectCategory: (category: Category) => void;
  selectMode: (mode: GameMode) => void;
  setGameSetup: (setup) => void;
  clearSelection: () => void;
}
```

**3. settingsStore.ts - App Ayarları (Persistent)**
```typescript
interface SettingsStore {
  soundEnabled: boolean;
  effectsVolume: number; // 0-100
  animationSpeed: 'slow' | 'normal' | 'fast';

  // Actions
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  setAnimationSpeed: (speed) => void;
}

// localStorage ile persist
persist(settingsStore, { name: 'settings' })
```

**Veri Akışı:**
```
User Action
    ↓
Event Handler (Component)
    ↓
Store Action
    ↓
State Update
    ↓
React Re-render
    ↓
UI Update
```

---

### Backend Mimarisi (Rust/Tauri)

**Dizin Yapısı:**
```
src-tauri/
├── src/
│   ├── main.rs           # Tauri app entry point
│   ├── lib.rs            # Library exports
│   ├── errors.rs         # Custom error types
│   │
│   ├── commands/         # Tauri commands
│   │   ├── mod.rs
│   │   ├── category.rs   # 8 kategori komutu
│   │   ├── word.rs       # 6 kelime komutu
│   │   ├── game_history.rs # 8 geçmiş komutu
│   │   ├── settings.rs   # 2 ayar komutu
│   │   └── database.rs   # 4 database komutu
│   │
│   ├── db/               # Database layer
│   │   ├── mod.rs
│   │   ├── connection.rs # SQLite connection pool
│   │   ├── schema.rs     # Table creation SQL
│   │   └── seed.rs       # Default data seeding
│   │
│   └── models/           # Data structures
│       ├── mod.rs
│       ├── category.rs   # Category struct
│       ├── word.rs       # Word struct
│       └── game.rs       # Game structs
│
├── Cargo.toml            # Rust dependencies
└── tauri.conf.json       # Tauri configuration
```

**Tauri Komut Yapısı:**
```rust
#[tauri::command]
async fn get_all_categories() -> Result<Vec<Category>, String> {
    let conn = db::connection::get()?;
    let categories = db::query_categories(&conn)?;
    Ok(categories)
}
```

**Hata Yönetimi:**
```rust
// Custom error type
pub enum AppError {
    DatabaseError(rusqlite::Error),
    ValidationError(String),
    NotFound(String),
}

// Error conversion
impl From<AppError> for String {
    fn from(err: AppError) -> String {
        match err {
            AppError::DatabaseError(e) => format!("DB Error: {}", e),
            AppError::ValidationError(msg) => msg,
            AppError::NotFound(msg) => format!("Not found: {}", msg),
        }
    }
}
```

---

### API Komutları (28 Tauri Command)

**Kategori Komutları (8):**
```typescript
// 1. Tüm kategorileri getir
invoke<Category[]>('get_all_categories')

// 2. ID'ye göre kategori getir
invoke<Category>('get_category_by_id', { id: 1 })

// 3. Yeni kategori oluştur
invoke<Category>('create_category', {
  name: 'Hayvanlar',
  emoji: '🐾',
  description: 'Hayvan isimleri'
})

// 4. Kategori güncelle
invoke<void>('update_category', {
  id: 1,
  name: 'Yeni Ad',
  emoji: '🎯',
  description: 'Yeni açıklama'
})

// 5. Kategori sil (cascade delete kelimeleri de siler)
invoke<void>('delete_category', { id: 1 })

// 6. Kategori doğrula (kelime gereksinimlerini kontrol et)
invoke<ValidationResult>('validate_category', { id: 1 })

// 7. Kategori JSON dışa aktar
invoke<string>('export_category_json', { id: 1 })

// 8. JSON'dan kategori/kelime içe aktar
invoke<void>('import_category_json', {
  json: '{"category": {...}, "words": [...]}',
  categoryId: 1 // Opsiyonel, mevcut kategoriye eklemek için
})
```

**Kelime Komutları (6):**
```typescript
// 1. Kategoriye göre kelimeleri getir
invoke<Word[]>('get_words_by_category', { categoryId: 1 })

// 2. Yeni kelime ekle
invoke<Word>('add_word', {
  categoryId: 1,
  word: 'ASLAN',
  hint: 'Ormanın kralı'
})

// 3. Kelime güncelle
invoke<void>('update_word', {
  id: 1,
  word: 'KAPLAN',
  hint: 'Çizgili kedi'
})

// 4. Kelime sil
invoke<void>('delete_word', { id: 1 })

// 5. Rastgele kelime seç (14 kelime, çakışmasız)
invoke<Word[]>('get_random_words', {
  categoryId: 1,
  excludeIds: [1, 2, 3] // Önceki katılımcıların kelimeleri
})

// 6. Mod için kategori doğrula
invoke<{ valid: boolean, maxParticipants: number }>('validate_category_for_mode', {
  categoryId: 1,
  mode: 'multi',
  participantCount: 4
})
```

**Oyun Geçmişi Komutları (8):**
```typescript
// 1. Tüm oyunları getir (filtrelenebilir)
invoke<GameHistory[]>('get_all_game_history', {
  filters: {
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    categoryId: 1,
    gameMode: 'multi',
    sortBy: 'date_desc'
  },
  page: 1,
  pageSize: 10
})

// 2. ID'ye göre oyun detayı getir
invoke<GameHistoryDetail>('get_game_history_by_id', { id: 1 })

// 3. İstatistik özeti getir
invoke<Stats>('get_game_history_stats')
// Döner: { totalGames, highestScore, mostPlayedCategory, totalTime }

// 4. Oyun geçmişi kaydet
invoke<number>('save_game_history', {
  categoryId: 1,
  categoryName: 'Hayvanlar',
  gameMode: 'multi',
  playedAt: '2025-11-20T10:30:00Z',
  totalTimeSeconds: 1200,
  participants: [...],
  wordResults: [...]
})

// 5. Oyun sil
invoke<void>('delete_game_history', { id: 1 })

// 6. Tüm geçmişi sil
invoke<void>('delete_all_game_history')

// 7. Oyuna ait katılımcıları getir
invoke<Participant[]>('get_game_participants', { gameId: 1 })

// 8. Tüm geçmişi JSON olarak dışa aktar
invoke<string>('export_game_history_json')
```

**Database Komutları (4):**
```typescript
// 1. Veritabanı boyutunu getir (byte cinsinden)
invoke<number>('get_database_size')

// 2. Veritabanı yedeği oluştur (dosya indir)
invoke<string>('backup_database')

// 3. Veritabanını geri yükle
invoke<void>('restore_database', { backupPath: '/path/to/backup.db' })

// 4. Tüm verileri sıfırla (varsayılan kategorileri geri yükle)
invoke<void>('reset_all_data')
```

**Settings Komutları (2):**
```typescript
// 1. Ayar değeri getir
invoke<string>('get_setting', { key: 'theme' })

// 2. Ayar değeri kaydet
invoke<void>('set_setting', { key: 'theme', value: 'dark' })
```

---

## Veritabanı Yapısı

### SQLite Schema

**6 Tablo:**

**1. categories - Kategori Tablosu**
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,              -- Kategori adı
    emoji TEXT,                      -- Görsel emoji (opsiyonel)
    description TEXT,                -- Açıklama (opsiyonel)
    is_default BOOLEAN DEFAULT 0,    -- Varsayılan bayrağı (silinemez)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_is_default ON categories(is_default);
```

**2. words - Kelime Tablosu**
```sql
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    word TEXT NOT NULL,                          -- Kelime (BÜYÜK HARF)
    letter_count INTEGER NOT NULL
        CHECK (letter_count BETWEEN 4 AND 10),   -- 4-10 arası
    hint TEXT NOT NULL,                          -- İpucu (zorunlu)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE                        -- Kategori silinince kelimeler de silinir
);

CREATE INDEX idx_words_category ON words(category_id);
CREATE INDEX idx_words_letter_count ON words(letter_count);
CREATE INDEX idx_words_category_letter ON words(category_id, letter_count);
```

**3. settings - Ayarlar Tablosu**
```sql
CREATE TABLE settings (
    key TEXT PRIMARY KEY,    -- Ayar anahtarı
    value TEXT               -- Ayar değeri (JSON string olabilir)
);
```

**4. game_history - Oyun Geçmişi Tablosu**
```sql
CREATE TABLE game_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    category_name TEXT NOT NULL,          -- Denormalize (kategori silinirse korunur)
    game_mode TEXT NOT NULL               -- 'single' | 'multi' | 'team'
        CHECK (game_mode IN ('single', 'multi', 'team')),
    played_at DATETIME NOT NULL,          -- Oyun tarihi
    total_time_seconds INTEGER,           -- Toplam süre (saniye)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL                -- Kategori silinirse null olur
);

CREATE INDEX idx_game_history_played_at ON game_history(played_at);
CREATE INDEX idx_game_history_category ON game_history(category_id);
CREATE INDEX idx_game_history_mode ON game_history(game_mode);
```

**5. game_participants - Oyun Katılımcıları Tablosu**
```sql
CREATE TABLE game_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_history_id INTEGER NOT NULL,
    participant_name TEXT NOT NULL,       -- Oyuncu/Takım adı
    participant_type TEXT NOT NULL        -- 'player' | 'team'
        CHECK (participant_type IN ('player', 'team')),
    score INTEGER DEFAULT 0,              -- Toplam skor
    words_found INTEGER DEFAULT 0,        -- Bulunan kelime sayısı
    words_skipped INTEGER DEFAULT 0,      -- Atlanan kelime sayısı
    letters_revealed INTEGER DEFAULT 0,   -- Açılan harf sayısı
    time_elapsed_seconds INTEGER,         -- Geçen süre (saniye)
    rank INTEGER,                         -- Sıralama (1, 2, 3, ...)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_history_id)
        REFERENCES game_history(id)
        ON DELETE CASCADE                 -- Oyun silinince katılımcılar da silinir
);

CREATE INDEX idx_game_participants_game ON game_participants(game_history_id);
CREATE INDEX idx_game_participants_rank ON game_participants(rank);
```

**6. game_word_results - Kelime Sonuçları Tablosu**
```sql
CREATE TABLE game_word_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_history_id INTEGER NOT NULL,
    participant_id INTEGER,
    word TEXT NOT NULL,                   -- Kelime
    word_hint TEXT,                       -- İpucu (denormalize)
    result TEXT NOT NULL                  -- 'found' | 'skipped' | 'timeout'
        CHECK (result IN ('found', 'skipped', 'timeout')),
    points_earned INTEGER DEFAULT 0,      -- Kazanılan puan
    letters_used INTEGER DEFAULT 0,       -- Kullanılan (açılan) harf sayısı
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_history_id)
        REFERENCES game_history(id)
        ON DELETE CASCADE,
    FOREIGN KEY (participant_id)
        REFERENCES game_participants(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_game_word_results_game ON game_word_results(game_history_id);
CREATE INDEX idx_game_word_results_participant ON game_word_results(participant_id);
```

---

### Entity Relationship Diagram

```
┌──────────────┐
│  categories  │
│              │
│ • id (PK)    │
│ • name       │
│ • emoji      │
│ • is_default │
└──────┬───────┘
       │
       │ 1:N
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌──────────────┐        ┌──────────────────┐
│    words     │        │  game_history    │
│              │        │                  │
│ • id (PK)    │        │ • id (PK)        │
│ • category_id│        │ • category_id    │
│ • word       │        │ • game_mode      │
│ • hint       │        │ • played_at      │
│ • letter_count        │ • total_time     │
└──────────────┘        └────────┬─────────┘
                                 │
                                 │ 1:N
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                     ▼                       ▼
           ┌──────────────────────┐  ┌──────────────────────┐
           │ game_participants    │  │ game_word_results    │
           │                      │  │                      │
           │ • id (PK)            │  │ • id (PK)            │
           │ • game_history_id    │  │ • game_history_id    │
           │ • name               │  │ • participant_id     │
           │ • score              │  │ • word               │
           │ • rank               │  │ • result             │
           └──────────────────────┘  │ • points_earned      │
                     │                └──────────────────────┘
                     │
                     │ 1:N
                     │
                     └────────────────┘
```

---

### Cascade Delete Davranışı

**1. Kategori Silindiğinde:**
```
categories (DELETED)
    ↓ CASCADE
words (DELETED) - Kategoriye ait tüm kelimeler silinir
game_history (SET NULL) - category_id null olur, oyun geçmişi korunur
```

**2. Oyun Silindiğinde:**
```
game_history (DELETED)
    ↓ CASCADE
game_participants (DELETED) - Katılımcılar silinir
    ↓ CASCADE
game_word_results (SET NULL) - participant_id null olur ama kayıtlar korunur
```

---

### Örnek Sorgular

**1. Kategoriye Göre Kelime Dağılımı:**
```sql
SELECT letter_count, COUNT(*) as count
FROM words
WHERE category_id = ?
GROUP BY letter_count
ORDER BY letter_count;
```

**2. En Yüksek Skor:**
```sql
SELECT
    gp.participant_name,
    gp.score,
    gh.played_at,
    gh.category_name
FROM game_participants gp
JOIN game_history gh ON gp.game_history_id = gh.id
ORDER BY gp.score DESC
LIMIT 1;
```

**3. En Çok Oynanan Kategori:**
```sql
SELECT
    category_name,
    COUNT(*) as play_count
FROM game_history
WHERE category_id IS NOT NULL
GROUP BY category_name
ORDER BY play_count DESC
LIMIT 1;
```

**4. Oyuncu Başına Ortalama Skor:**
```sql
SELECT
    participant_name,
    AVG(score) as avg_score,
    COUNT(*) as games_played
FROM game_participants
GROUP BY participant_name
ORDER BY avg_score DESC;
```

---

## JSON İçe/Dışa Aktarma

### Kategori JSON Formatı

**Dışa Aktarma:**
```json
{
  "category": {
    "name": "Hayvanlar",
    "emoji": "🐾",
    "description": "Hayvan isimleri ve türleri"
  },
  "words": [
    {
      "word": "ASLAN",
      "letter_count": 5,
      "hint": "Ormanın kralı olarak bilinen büyük kedi"
    },
    {
      "word": "KELEBEK",
      "letter_count": 7,
      "hint": "Renkli kanatları olan böcek"
    },
    {
      "word": "FİL",
      "letter_count": 3,
      "hint": "Hortumu olan büyük hayvan"
    }
  ]
}
```

**İçe Aktarma Kuralları:**
- `category` objesi opsiyonel (varsa yeni kategori oluşturulur)
- `category_id` parametresi verilirse mevcut kategoriye kelime eklenir
- Her kelime doğrulanır (4-10 harf, Türkçe karakter)
- Geçersiz kelimeler atlanır, hata raporu döner

---

### Oyun Geçmişi JSON Formatı

**Dışa Aktarma:**
```json
{
  "game_history": [
    {
      "id": 1,
      "category_name": "Hayvanlar",
      "game_mode": "multi",
      "played_at": "2025-11-20T14:30:00Z",
      "total_time_seconds": 1200,
      "participants": [
        {
          "id": 1,
          "name": "Ali",
          "type": "player",
          "score": 8500,
          "words_found": 12,
          "words_skipped": 2,
          "letters_revealed": 5,
          "time_elapsed_seconds": 285,
          "rank": 1
        },
        {
          "id": 2,
          "name": "Ayşe",
          "type": "player",
          "score": 7200,
          "words_found": 10,
          "words_skipped": 4,
          "letters_revealed": 8,
          "time_elapsed_seconds": 300,
          "rank": 2
        }
      ],
      "word_results": [
        {
          "participant_name": "Ali",
          "word": "ASLAN",
          "word_hint": "Ormanın kralı",
          "result": "found",
          "points_earned": 500,
          "letters_used": 0
        },
        {
          "participant_name": "Ali",
          "word": "KELEBEK",
          "word_hint": "Renkli böcek",
          "result": "found",
          "points_earned": 500,
          "letters_used": 2
        },
        {
          "participant_name": "Ali",
          "word": "KARINCA",
          "word_hint": "Çalışkan böcek",
          "result": "skipped",
          "points_earned": 0,
          "letters_used": 3
        }
      ]
    }
  ]
}
```

**Kullanım Alanları:**
- Yedekleme
- Başka cihaza aktarma
- Veri analizi
- Raporlama

---

## Performans Optimizasyonları

### Frontend Optimizasyonları

**1. Code Splitting**
- Lazy loading ile büyük ekranlar (Game, History, Management) ayrı bundle'larda
- Route-based splitting
- Vendor chunks ayrımı

**2. React Optimizasyonları**
- `React.memo` ile gereksiz re-render'ları engelle
- `useMemo` ile pahalı hesaplamaları cache'le
- `useCallback` ile fonksiyon referanslarını koruma

**3. Virtualization**
- Uzun listeler için virtual scrolling (oyun geçmişi)
- Sadece görünür elemanlar render edilir
- `react-window` veya `react-virtual` kullanımı

**4. Debouncing**
- Arama inputları 300ms debounce
- Gereksiz API çağrılarını engelle

**5. Animasyon Optimizasyonu**
- GPU-accelerated transforms (`translate3d`, `scale`)
- `will-change` CSS property
- `transform` ve `opacity` dışındaki animasyonlardan kaçın

---

### Backend Optimizasyonları

**1. Database Indexler**
7 index toplam:
- `words.category_id` - Kategoriye göre sorgu hızlı
- `words.letter_count` - Uzunluk filtreleme hızlı
- `game_history.played_at` - Tarih sıralama hızlı
- `game_participants.game_history_id` - Join hızlı

**2. Prepared Statements**
- SQL injection koruması
- Query planı cache'lenir
- Her sorgu için yeniden parse edilmez

**3. Transaction Batching**
- Toplu işlemler (JSON import) tek transaction'da
- Rollback desteği

**4. Connection Pooling**
- Singleton database connection
- Bağlantı açma/kapama maliyeti yok

---

### Build Optimizasyonları

**1. Vite Optimizasyonları**
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- ESBuild ile hızlı transpiling

**2. Tree Shaking**
- Kullanılmayan kod otomatik çıkarılır
- ES modules gerekli

**3. Asset Optimization**
- Resim optimizasyonu (WebP, compress)
- Font subsetting (sadece kullanılan karakterler)
- SVG minification

**4. Bundle Analizi**
```bash
npm run build -- --analyze
```
- Bundle boyutu görselleştirmesi
- Gereksiz bağımlıkları tespit

---

## Geliştirme Komutları

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build

# Tauri app'i başlat (development)
npm run tauri dev

# Tauri app build (production)
npm run tauri build

# Testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm test -- --watch

# Linting
npm run lint

# Linting otomatik düzeltme
npm run lint:fix

# Formatting
npm run format

# Type checking
npm run type-check

# Bundle analizi
npm run build -- --analyze
```

---

## Proje İstatistikleri

**Kod İstatistikleri:**
- Frontend: ~15,000 satır TypeScript/React
- Backend: ~3,000 satır Rust
- Test: ~2,000 satır
- Toplam: ~20,000 satır kod

**Dosya Sayıları:**
- React Components: 50+
- Tauri Commands: 28
- Database Tables: 6
- Routes: 17
- Custom Hooks: 10+

**Bağımlılıklar:**
- Production: 20+ paket
- Development: 30+ paket

**Bundle Boyutu (Optimized):**
- JavaScript: ~300 KB (gzipped)
- CSS: ~50 KB (gzipped)
- Tauri Binary: ~15 MB (platform-specific)

**Performans:**
- İlk yüklenme: <1s
- Route geçişi: <100ms
- Animasyon FPS: 60 FPS
- Database sorgu: <10ms

---

## Lisans ve Krediler

**Lisans:** MIT License

**Geliştirici:** Emre Dağ (github: emredag)

**Teşekkürler:**
- React ekibi
- Tauri ekibi
- Framer Motion ekibi
- Zustand ekibi
- Tüm açık kaynak katkıda bulunanlar

**Destek:**
- GitHub Issues: https://github.com/emredag/word-game-app/issues
- Email: info@emredag.dev

---

## Sürüm Geçmişi

**v1.0.0 (2025-11-20)**
- ✅ İlk production release
- ✅ 17 ekran tamamlandı
- ✅ 3 oyun modu
- ✅ Kategori ve kelime yönetimi
- ✅ Oyun geçmişi sistemi
- ✅ Ses ve animasyon sistemi
- ✅ Test/demo sayfaları temizlendi
- ✅ Production-ready duruma getirildi

---

**Son Güncelleme:** 20 Kasım 2025
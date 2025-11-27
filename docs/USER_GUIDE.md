# Kelime Oyunu - Kullanıcı Rehberi

> Kapsamlı kullanım kılavuzu - Kurulumdan oyun oynamaya tüm detaylar

Bu rehber, Kelime Oyunu uygulamasını kullanmaya başlamanız için gereken tüm bilgileri içerir.

## İçindekiler

1. [Kurulum](#kurulum)
2. [İlk Başlangıç](#ilk-başlangıç)
3. [Oyun Kuralları](#oyun-kuralları)
4. [Oyun Oynama](#oyun-oynama)
5. [Kategori Yönetimi](#kategori-yönetimi)
6. [Kelime Yönetimi](#kelime-yönetimi)
7. [Oyun Geçmişi](#oyun-geçmişi)
8. [Ayarlar](#ayarlar)
9. [Klavye Kısayolları](#klavye-kısayolları)
10. [Sorun Giderme](#sorun-giderme)
11. [Sık Sorulan Sorular](#sık-sorulan-sorular)

---

## Kurulum

### Windows

1. [Releases](https://github.com/emredag/bil-bakalim/releases) sayfasından `Kelime-Oyunu_1.0.0_x64_en-US.msi` dosyasını indirin
2. İndirilen `.msi` dosyasını çift tıklayarak açın
3. Kurulum sihirbazını takip edin:
   - "Next" butonuna tıklayın
   - Lisans sözleşmesini kabul edin
   - Kurulum konumunu seçin (varsayılan: `C:\Program Files\Kelime Oyunu`)
   - "Install" butonuna tıklayın
4. Kurulum tamamlandığında "Finish" butonuna tıklayın
5. Başlat menüsünden "Kelime Oyunu"nu başlatın

**Not:** Windows Defender veya antivirüs yazılımınız uyarı verebilir. "Run anyway" veya "Çalıştır" seçeneğini seçin (uygulama güvenlidir).

### macOS

1. [Releases](https://github.com/emredag/bil-bakalim/releases) sayfasından `Kelime-Oyunu_1.0.0_x64.dmg` dosyasını indirin
2. İndirilen `.dmg` dosyasını çift tıklayarak açın
3. Açılan pencerede "Kelime Oyunu" ikonunu "Applications" klasörüne sürükleyin
4. Applications klasöründen "Kelime Oyunu"nu başlatın
5. İlk açılışta "Unidentified developer" uyarısı alabilirsiniz:
   - System Preferences → Security & Privacy → General bölümüne gidin
   - "Open Anyway" butonuna tıklayın
   - Veya: Uygulamaya sağ tıklayıp "Open" seçin

**Not:** macOS 10.15 (Catalina) veya üzeri gereklidir.

### Linux

#### Debian/Ubuntu (.deb)

```bash
# DEB dosyasını indirin
wget https://github.com/emredag/bil-bakalim/releases/download/v1.0.0/kelime-oyunu_1.0.0_amd64.deb

# Kurulum
sudo dpkg -i kelime-oyunu_1.0.0_amd64.deb

# Bağımlılıkları düzeltin (gerekirse)
sudo apt-get install -f

# Uygulamayı başlatın
kelime-oyunu
```

#### AppImage (Tüm Dağıtımlar)

```bash
# AppImage dosyasını indirin
wget https://github.com/emredag/bil-bakalim/releases/download/v1.0.0/kelime-oyunu_1.0.0_amd64.AppImage

# Çalıştırılabilir yapın
chmod +x kelime-oyunu_1.0.0_amd64.AppImage

# Uygulamayı başlatın
./kelime-oyunu_1.0.0_amd64.AppImage
```

**Gereksinimler:**
- Ubuntu 20.04 veya üzeri
- Fedora 33 veya üzeri
- Debian 11 veya üzeri
- GTK 3.0 kütüphaneleri

---

## İlk Başlangıç

### Hoş Geldiniz Ekranı

Uygulamayı ilk kez açtığınızda "Hoş Geldiniz" ekranını göreceksiniz:

1. **Uygulama Tanıtımı:** Kelime Oyunu'nun ne olduğunu öğrenin
2. **Hızlı Rehber:** Temel özelliklere göz atın
3. **Varsayılan Kategoriler:** Uygulama 3 hazır kategori ile gelir:
   - 🐾 **Hayvanlar** (20 kelime)
   - 🍎 **Meyveler** (20 kelime)
   - 🌍 **Ülkeler** (20 kelime)

"Başla" butonuna tıklayarak ana menüye geçin.

### Ana Menü

Ana menüde 6 ana bölüm bulunur:

- **🎮 Yarışma Başlat:** Yeni oyun başlatın
- **📁 Kategori Yönetimi:** Kategorileri düzenleyin
- **📊 Geçmiş:** Önceki oyunları görüntüleyin
- **⚙️ Ayarlar:** Uygulama ayarlarını değiştirin
- **❓ Nasıl Oynanır:** Oyun kurallarını okuyun
- **ℹ️ Hakkında:** Uygulama bilgileri

---

## Oyun Kuralları

### Genel Yapı

- Her oyunda toplam **14 kelime** bulunur
- Kelimeler 4-10 harf arasında değişir
- Her harf uzunluğundan **2'şer kelime** vardır:
  - 2 adet 4 harfli (400 puan)
  - 2 adet 5 harfli (500 puan)
  - 2 adet 6 harfli (600 puan)
  - 2 adet 7 harfli (700 puan)
  - 2 adet 8 harfli (800 puan)
  - 2 adet 9 harfli (900 puan)
  - 2 adet 10 harfli (1000 puan)

### Süre

- Toplam süre: **5 dakika (300 saniye)**
- Süre tüm kelimeler için ortaktır
- Her kelimede sıfırlanmaz
- Süre dolduğunda oyun otomatik biter
- Süre her zaman ekranda görünür

### Harf Açma

- İstediğiniz zaman harf açabilirsiniz
- Her harf **-100 puan** ceza getirir
- Harfler rastgele değil, soldan sağa sırayla açılır
- **ÖNEMLİ:** Tahmin yaptıktan sonra harf açamazsınız!

### Tahmin Etme

- Her kelime için **3 tahmin hakkı** vardır
- **Doğru tahmin:**
  - Tüm harfler açılır
  - Puan kazanırsınız (temel puan - harf cezaları)
  - Sonraki kelimeye geçilir
  - Konfeti animasyonu
  - Başarı sesi
- **Yanlış tahmin:**
  - Tahmin hakkı azalır
  - Puan kaybetmezsiniz
  - Shake animasyonu
  - Hata sesi
- Tahmin sonrası harf açma devre dışı kalır

### Pas Geçme

- Kelimeyi bilemiyorsanız pas geçebilirsiniz
- Pas geçilen kelime için **0 puan** alırsınız
- Onay diyalogu gösterilir (yanlışlıkla pas geçmeyi önler)
- Sonraki kelimeye geçilir

### Puanlama

**Temel Puan = Harf Sayısı × 100**

| Harf Sayısı | Temel Puan |
|-------------|------------|
| 4 harf      | 400 puan   |
| 5 harf      | 500 puan   |
| 6 harf      | 600 puan   |
| 7 harf      | 700 puan   |
| 8 harf      | 800 puan   |
| 9 harf      | 900 puan   |
| 10 harf     | 1000 puan  |

**Final Puan = Temel Puan - (Açılan Harf Sayısı × 100)**

**Örnek:**
- 7 harfli kelime (HAVUÇ**) = 700 puan (baz)
- 2 harf açtınız = -200 puan
- Final puan = **500 puan**

### Kazanma Kuralları

**Tek Oyunculu:** Maksimum puanı hedefleyin!

**Çoklu Oyuncu ve Takım:** En yüksek puan kazanır.

**Eşitlik Durumunda:**
1. **Daha az harf açan** kazanır
2. Hâlâ eşitlik varsa, **daha kısa sürede bitiren** kazanır

---

## Oyun Oynama

### Yeni Oyun Başlatma

1. Ana menüden **"Yarışma Başlat"** seçin
2. **Kategori seçin** (arama yapabilirsiniz)
3. **Oyun modunu seçin:**
   - Tek Oyunculu
   - Çoklu Oyuncu
   - Takım Modu
4. **Katılımcıları ekleyin** (mod'a göre)
5. **"Oyunu Başlat"** butonuna tıklayın

### Tek Oyunculu Mod

1. İsminizi girin
2. "Başla" butonuna tıklayın
3. Oyunu oynayın
4. Sonuç ekranında istatistiklerinizi görün

**İdeal Kullanım:** Pratik yapma, kişisel rekor kırma

### Çoklu Oyuncu Modu

1. **Oyuncu ekleyin (2-6 kişi):**
   - "Oyuncu Ekle" butonuna tıklayın
   - İsim girin
   - İsterseniz renk seçin (otomatik atanır)
2. **Sıralamayı düzenleyin:**
   - Oyuncuları sürükle-bırak ile sıralayın
3. **Oyunu başlatın**
4. **Sırayla oynayın:** Her oyuncu kendi sırasında oynar
5. **Sonuç ekranında:** Podium/sıralama tablosunu görün

**İdeal Kullanım:** Bireysel yarışma, sınıf içi turnuva

### Takım Modu

1. **Takım oluşturun (2-4 takım):**
   - "Takım Ekle" butonuna tıklayın
   - Takım adı girin
   - Emoji ve renk seçin
2. **Her takıma oyuncu ekleyin:**
   - Takıma tıklayın
   - "Oyuncu Ekle" butonuna tıklayın
   - Oyuncu adlarını girin
3. **Takım içi sıralamayı ayarlayın**
4. **Oyunu başlatın**
5. **Takım puanları toplanır:** Her oyuncunun puanı takım puanına eklenir
6. **Sonuç ekranında:** Kazanan takım öne çıkar

**İdeal Kullanım:** Grup çalışması, takım rekabeti

### Oyun Ekranı

#### Üst Çubuk
- **Sol:** Kategori adı ve emoji
- **Orta:** Büyük zamanlayıcı (kalan süre)
- **Sağ:** Skor, ilerleme (6/14), aktif oyuncu

#### Orta Bölüm
- **Kelime alanı:** Harf kutuları (kapalı/açık)
- **İpucu şeridi:** Kelimenin ipucu metni

#### Kontrol Paneli
- **Harf Aç (H):** Bir harf açar
- **Doğru (D):** Kelimeyi doğru bildiniz
- **Yanlış (Y):** Kelimeyi yanlış bildiniz
- **Pas (P):** Kelimeyi atlar
- **Bilgi satırı:** Kalan tahmin, açılan harf, kazanılacak puan

#### Yan Kontroller
- **Pause (Esc):** Oyunu duraklatır
- **Ses (M):** Sesi aç/kapat
- **Ana Menü:** Oyundan çık (onay gerekir)

### Oyun Sırasında

1. **İpucu okuyun**
2. **Kelimeyi biliyor musunuz?**
   - **Evet:** "Doğru" (D) butonuna basın
   - **Hayır:** "Yanlış" (Y) butonuna basın veya harf açmaya devam edin
3. **Doğru bildiniz mi?**
   - **Evet:** Konfeti ve puan, sonraki kelimeye geçiş
   - **Hayır:** Tahmin hakkı azalır, tekrar deneyin
4. **3 tahmin de yanlışsa:** Otomatik pas geçilir (0 puan)
5. **Süre bitti mi?** Oyun otomatik biter

### Oyun Sonu

**Tek Oyunculu:**
- Toplam puan
- Doğru/yanlış/pas sayısı
- Ortalama süre
- Detaylı kelime listesi (akordeon)
- "Tekrar Oyna" butonu

**Çoklu Oyuncu:**
- Podium sıralaması (1., 2., 3.)
- Her oyuncu için detay paneli
- Kazanan vurgusu
- "Tekrar Oyna" veya "Ana Menü"

**Takım Modu:**
- Kazanan takım animasyonu
- Takım sıralaması
- Takım içi oyuncu detayları
- Toplam takım puanı

---

## Kategori Yönetimi

### Kategori Listesi Görüntüleme

1. Ana menüden **"Kategori Yönetimi"** seçin
2. Tüm kategorileri kart görünümünde görün:
   - Kategori emoji'si
   - Kategori adı
   - Kelime sayısı
   - Oynanabilirlik durumu (badge)
   - İşlem butonları (Görüntüle, Düzenle, Sil)

### Yeni Kategori Oluşturma

1. **"Yeni Kategori"** butonuna tıklayın
2. **Form doldurma:**
   - **Ad:** Kategori adı girin (örn: "Şehirler")
   - **Emoji:** Emoji seçici ile emoji seçin (örn: 🏙️)
   - **Açıklama:** Opsiyonel açıklama (örn: "Türkiye şehirleri")
3. **Önizleme:** Sağ tarafta canlı önizleme görürsünüz
4. **"Kaydet"** butonuna tıklayın
5. Başarı bildirimi görünür

**Not:** Yeni kategori boş olarak oluşturulur, sonra kelime eklemeniz gerekir.

### Kategori Düzenleme

1. Kategori kartında **"Düzenle"** butonuna tıklayın
2. Formu güncelleyin
3. "Kaydet" butonuna tıklayın
4. Değişiklikler anında yansır

### Kategori Silme

1. Kategori kartında **"Sil"** butonuna tıklayın
2. Onay diyaloğu görünür: "Bu kategori ve tüm kelimeleri silinecek"
3. "Evet, Sil" butonuna tıklayın
4. Kategori ve tüm kelimeleri veritabanından silinir

**Not:** Varsayılan kategoriler de silinebilir.

### Kategori Arama ve Filtreleme

- **Arama:** Üst kısımdaki arama kutusuna kategori adı yazın
- **Filtreler:**
  - "Tümü" - Tüm kategoriler
  - "Oynanabilir" - Yeterli kelimeye sahip kategoriler
  - "Yetersiz" - Kelime eksik kategoriler

### Oynanabilirlik Durumu

Her kategori için 3 oynanabilirlik badge'i vardır:

- **✅ Tek Oyuncu:** 14+ kelime (her harf uzunluğundan en az 2)
- **✅ Çoklu Oyuncu:** 28+ kelime (her harf uzunluğundan en az 4)
- **✅ Takım Modu:** 56+ kelime (her harf uzunluğundan en az 8)

**Örnek:**
- 20 kelime → Sadece Tek Oyuncu ✅
- 40 kelime → Tek + Çoklu ✅✅
- 80 kelime → Hepsi ✅✅✅

---

## Kelime Yönetimi

### Kategori Kelimelerini Görüntüleme

1. **Kategori Yönetimi** ekranından bir kategoriye tıklayın
2. **Kelime listesi** açılır:
   - Tablo görünümü
   - Sütunlar: Kelime, Harf Sayısı, İpucu, İşlemler
   - Arama kutusu
3. **Sağ panel:** Kelime dağılım istatistikleri
   - 4-10 harf arası her uzunluk için sayı
   - Toplam kelime
   - Oynanabilirlik durumu

### Yeni Kelime Ekleme

1. **"Kelime Ekle"** butonuna tıklayın
2. **Modal açılır:**
   - **Kelime:** BÜYÜK HARFLE kelime girin
     - Sadece Türkçe harfler (A-Z, Ç, Ğ, İ, Ö, Ş, Ü)
     - 4-10 harf arası
     - Boşluk veya özel karakter yok
   - **İpucu:** Kelimenin ipucunu girin (opsiyonel)
3. **Canlı validasyon:**
   - Harf sayacı gösterilir
   - Geçersiz karakterler hata verir
   - Kısa/uzun kelimeler uyarı verir
4. **"Ekle"** butonuna tıklayın
5. Başarı bildirimi ve liste güncellenir

**Örnekler:**
- ✅ ELMA (İpucu: "Kırmızı veya yeşil olabilen meyve")
- ✅ KİTAP (İpucu: "Okumak için kullanılır")
- ❌ elma (küçük harf)
- ❌ EL MA (boşluk)
- ❌ ABC (3 harf - çok kısa)

### Kelime Düzenleme

1. Kelime satırında **"Düzenle"** butonuna tıklayın
2. Modal açılır (kelime ve ipucu önceden doldurulmuş)
3. Değişiklikleri yapın
4. "Kaydet" butonuna tıklayın

**Not:** Kelimenin harf sayısını değiştirirseniz, oynanabilirlik durumu etkilenebilir.

### Kelime Silme

1. Kelime satırında **"Sil"** butonuna tıklayın
2. Onay diyaloğu: "Bu kelime silinecek"
3. "Evet, Sil" butonuna tıklayın
4. Kelime veritabanından silinir

### Kelime Arama

- Arama kutusuna kelime veya ipucu yazın
- Liste anında filtrelenir
- Büyük/küçük harf duyarsız

### JSON İçe Aktarma (Import)

Toplu kelime eklemek için JSON dosyası kullanabilirsiniz:

1. **"JSON'dan İçe Aktar"** butonuna tıklayın
2. **Dosya seçici** açılır
3. `.json` dosyası seçin
4. **Validasyon:**
   - JSON formatı kontrol edilir
   - Kelimeler validasyondan geçirilir
   - Geçersiz kelimeler atlanır
5. **Özet gösterilir:**
   - Başarıyla eklenen: X kelime
   - Hata: Y kelime
6. **"Onayla"** butonuna tıklayın
7. Kelimeler kategoriye eklenir

**JSON Formatı:**
```json
{
  "name": "Kategori Adı",
  "emoji": "📚",
  "description": "Kategori açıklaması",
  "words": [
    {
      "word": "ELMA",
      "hint": "Kırmızı veya yeşil meyve"
    },
    {
      "word": "ARMUT",
      "hint": "Yeşil veya sarı meyve"
    }
  ]
}
```

**Not:** İçe aktarma mevcut kelimeleri etkilemez, sadece yeni kelimeler ekler.

### JSON'a Dışa Aktarma (Export)

Kategoriyi ve tüm kelimelerini JSON dosyasına kaydedin:

1. **"JSON'a Dışa Aktar"** butonuna tıklayın
2. **Dosya kaydetme** diyaloğu açılır
3. Dosya adı ve konum seçin
4. "Kaydet" butonuna tıklayın
5. JSON dosyası oluşturulur

**Kullanım Senaryoları:**
- Kategorileri yedekleme
- Kategorileri başka bilgisayara taşıma
- Kategorileri paylaşma
- Kelime listesini Excel'de düzenleme

---

## Oyun Geçmişi

### Geçmiş Listesi

Ana menüden **"Geçmiş"** seçin:

- **Tablo görünümü:** Tüm oyunlar
- **Sütunlar:**
  - Tarih ve saat
  - Kategori
  - Oyun modu
  - Katılımcı sayısı
  - Süre (dakika:saniye)
  - Kazanan
- **İşlem:** Detay görüntüle, Sil

### Filtreleme ve Arama

- **Tarih filtresi:** Bugün, Bu hafta, Bu ay, Tüm zamanlar
- **Kategori filtresi:** Kategoriye göre filtrele
- **Mod filtresi:** Tek/Çoklu/Takım
- **Sıralama:** Tarih, Kategori, Mod

### Oyun Detayı

1. Oyun satırında **"Detay"** butonuna tıklayın
2. **Detay ekranı açılır:**
   - **Üst bilgiler:** Tarih, kategori, mod, süre
   - **Sıralama tablosu:** Katılımcılar ve puanları
   - **Katılımcı detayları (akordeon):**
     - Her katılımcı için kelime sonuçları
     - Kelime, sonuç (doğru/yanlış/pas), puan, harf kullanımı

### Oyun Silme

**Tekil Silme:**
1. Oyun satırında **"Sil"** butonuna tıklayın
2. Onay diyaloğu: "Bu oyun kaydı silinecek"
3. "Evet, Sil" butonuna tıklayın

**Toplu Silme:**
1. Geçmiş ekranında **"Tümünü Sil"** butonuna tıklayın
2. Onay diyaloğu: "TÜM oyun kayıtları silinecek"
3. "Evet, Tümünü Sil" butonuna tıklayın

**Not:** Silme işlemi geri alınamaz! Önemli oyunları silmeden önce düşünün.

---

## Ayarlar

Ana menüden **"Ayarlar"** seçin:

### Ses Ayarları

- **Ses Seviyesi:** Sürükleyici ile 0-100 arası ayarlayın
- **Ses Efektleri:** Açık/Kapalı (toggle)
- **Sesler:**
  - Harf açma: Pop sesi
  - Doğru cevap: Başarı jingle
  - Yanlış cevap: Hata buzz
  - Pas geçme: Whoosh
  - Zaman uyarısı: Tick (son 10 sn)
  - Oyun sonu: Fanfare

**Not:** Oyun sırasında da `M` tuşu ile sesi açıp kapatabilirsiniz.

### Veritabanı Yönetimi

#### Veritabanını Yedekle

1. **"Veritabanını Yedekle"** butonuna tıklayın
2. Dosya kaydetme diyaloğu açılır
3. Dosya adı girin (örn: `kelime-oyunu-yedek-2025-10-30.db`)
4. Konum seçin
5. "Kaydet" butonuna tıklayın
6. Başarı bildirimi: "Veritabanı yedeklendi"

**Ne yedeklenir:**
- Tüm kategoriler
- Tüm kelimeler
- Tüm oyun geçmişi
- Ayarlar

**Ne zaman yedeklenmeli:**
- Düzenli aralıklarla (önerilen: haftalık)
- Önemli değişikliklerden önce
- Bilgisayar değiştirmeden önce

#### Veritabanını Geri Yükle

1. **"Veritabanını Geri Yükle"** butonuna tıklayın
2. **UYARI:** Mevcut tüm veriler silinecek!
3. Onay diyaloğu: "Tüm veriler silinip yedekten yüklenecek"
4. "Evet, Geri Yükle" butonuna tıklayın
5. Yedek dosyasını seçin (`.db` dosyası)
6. Geri yükleme işlemi başlar
7. Başarı bildirimi: "Veritabanı geri yüklendi"
8. Uygulama otomatik yeniden yüklenir

**Ne zaman geri yüklenmeli:**
- Veri kaybı durumunda
- Eski yedeklere dönmek için
- Başka bilgisayardan veri aktarımı

#### Tüm Verileri Sıfırla

1. **"Tüm Verileri Sıfırla"** butonuna tıklayın
2. **UYARI:** Tüm kategoriler, kelimeler ve oyun geçmişi silinecek!
3. Onay diyaloğu: "Tüm veriler silinip varsayılanlara döndürülecek"
4. "Evet, Sıfırla" butonuna tıklayın
5. Veritabanı sıfırlanır
6. Varsayılan kategoriler ve kelimeler yüklenir
7. Uygulama otomatik yeniden yüklenir

**Ne zaman sıfırlanmalı:**
- Tamamen yeni başlangıç istiyorsanız
- Test verilerini temizlemek için
- Ciddi veri bozulması durumunda

### Hakkında

- **Versiyon:** 1.0.0
- **Lisans:** MIT License
- **GitHub:** Repository linki
- **Geliştirici:** Emre Dağ

---

## Klavye Kısayolları

Klavye kısayolları, oyunu daha hızlı ve rahat kullanmanızı sağlar.

### Oyun Ekranı

| Tuş | İşlev |
|-----|-------|
| `H` | Harf aç |
| `D` | Kelimeyi doğru bildiniz |
| `Y` | Kelimeyi yanlış bildiniz |
| `P` | Pas geç |
| `Space` | Oyunu duraklat |
| `M` | Sesi aç/kapat |
| `Esc` | Ana menü |

### Dialog'lar ve Onay Ekranları

| Tuş | İşlev |
|-----|-------|
| `Enter` | Onayla |
| `Esc` | İptal |

### Genel Navigasyon

| Tuş | İşlev |
|-----|-------|
| `Tab` | Sonraki alana geç |
| `Shift + Tab` | Önceki alana geç |
| `Esc` | Modal'ı kapat / Geri git |

### İpuçları

- **Hızlı oyun:** `Space` → `T` kombinasyonu ile hızlıca harf açıp tahmin edebilirsiniz
- **Fare kullanmayın:** Büyük ekranlarda/projektörlerde klavye daha pratiktir
- **Onay atlama:** `Enter` tuşu ile onay diyaloglarını hızlıca geçin

---

## Sorun Giderme

### Uygulama Açılmıyor

**Windows:**
- Antivirüs yazılımınızı kontrol edin, uygulamayı istisna listesine ekleyin
- "Run as Administrator" ile çalıştırmayı deneyin
- .NET Framework 4.8 yüklü mü kontrol edin

**macOS:**
- System Preferences → Security & Privacy → "Open Anyway" butonuna tıklayın
- Terminal'den açmayı deneyin: `open /Applications/Kelime\ Oyunu.app`

**Linux:**
- Çalıştırılabilir izni verin: `chmod +x kelime-oyunu`
- GTK kütüphanelerini yükleyin: `sudo apt-get install libgtk-3-0`

### Veritabanı Hatası

**Hata: "Database locked" veya "Database corrupted"**

1. Uygulamayı tamamen kapatın
2. Veritabanı dosyasını bulun:
   - **Windows:** `C:\Users\[KullanıcıAdı]\AppData\Roaming\com.kelimeoyunu.app\kelime-oyunu.db`
   - **macOS:** `~/Library/Application Support/com.kelimeoyunu.app/kelime-oyunu.db`
   - **Linux:** `~/.local/share/com.kelimeoyunu.app/kelime-oyunu.db`
3. Yedek dosyasından geri yükleyin veya dosyayı silin (varsayılanlara döner)

### Ses Çalışmıyor

1. Sistem ses seviyesini kontrol edin
2. Ayarlar → Ses → Ses efektlerinin açık olduğundan emin olun
3. Ses seviyesinin 0'dan yüksek olduğunu kontrol edin
4. Başka uygulamada ses çalıyor mu test edin

### Oyun Donuyor / Yavaş Çalışıyor

1. Bilgisayarınızın sistem gereksinimlerini karşıladığından emin olun
2. Diğer ağır uygulamaları kapatın
3. Tam ekran moduna geçin (F11)
4. Grafik kartı sürücülerinizi güncelleyin

### JSON İçe Aktarma Hatası

**Hata: "Invalid JSON format"**
- JSON dosyasının formatını kontrol edin
- [jsonlint.com](https://jsonlint.com/) ile JSON'u validate edin
- Türkçe karakterlerin doğru encoded olduğundan emin olun (UTF-8)

**Hata: "Some words were skipped"**
- Atlanan kelimeleri kontrol edin (4-10 harf arasında olmalı)
- Özel karakter veya boşluk olmadığından emin olun
- Sadece Türkçe büyük harfler kullanın

### Klavye Kısayolları Çalışmıyor

1. Başka uygulama focus'ta olabilir, Kelime Oyunu penceresine tıklayın
2. Dialog açıkken bazı kısayollar devre dışı kalabilir
3. Işletim sistemi kısayol çakışmasını kontrol edin
4. Uygulamayı yeniden başlatın

---

## Sık Sorulan Sorular

### Genel Sorular

**S: Kelime Oyunu ücretsiz mi?**
A: Evet, tamamen ücretsiz ve açık kaynaklıdır (MIT License).

**S: İnternet bağlantısı gerekir mi?**
A: Hayır, tamamen offline çalışır. Tüm veriler yerel bilgisayarınızda saklanır.

**S: Hangi platformlarda çalışır?**
A: Windows 10/11, macOS 10.15+, ve Linux (Ubuntu 20.04+, Fedora, Debian).

**S: Mobil versiyonu var mı?**
A: Şu anda sadece masaüstü versiyonu mevcut.

**S: Verilerim güvende mi?**
A: Evet, tüm veriler yerel bilgisayarınızda SQLite veritabanında saklanır. Hiçbir veri internete gönderilmez.

### Oyun Soruları

**S: Neden tahmin yaptıktan sonra harf açamıyorum?**
A: Bu oyunun temel kuralıdır. Tahmin yaptıktan sonra harf açma devre dışı kalır. Önce tüm harfleri açın, sonra tahmin edin.

**S: 3 yanlış tahmin sonrası ne olur?**
A: Otomatik pas geçilir ve 0 puan alırsınız, sonraki kelimeye geçilir.

**S: Süre dolmadan tüm kelimeleri bitirirsem ne olur?**
A: Oyun tamamlanır, kalan süre bonusunuz olarak sayılmaz ama eşitlik durumunda avantaj sağlar.

**S: Aynı kelime tekrar çıkar mı?**
A: Bir oyun içinde aynı kelime çıkmaz, farklı oyunlarda çıkabilir.

**S: Kelime sırası rastgele mi?**
A: Evet, her oyunda kelimeler rastgele seçilir ve karıştırılır.

### Kategori ve Kelime Soruları

**S: Kaç kategori oluşturabilirim?**
A: Sınırsız. İstediğiniz kadar kategori oluşturabilirsiniz.

**S: Bir kategoriye kaç kelime ekleyebilirim?**
A: Sınırsız. Ancak oynanabilirlik için minimum gereksinimler vardır (14/28/56).

**S: İngilizce kelime ekleyebilir miyim?**
A: Teknik olarak evet, ancak uygulama Türkçe karakterler için optimize edilmiştir.

**S: Kelime listesini Excel'de düzenleyip aktarabilir miyim?**
A: Evet! Excel'de listeyi hazırlayın, JSON formatına çevirin ve içe aktarın.

**S: Varsayılan kategorileri silebilir miyim?**
A: Evet, tüm kategoriler silinebilir.

### Teknik Sorular

**S: Veritabanı dosyasının konumu nedir?**
A:
- **Windows:** `%APPDATA%\com.kelimeoyunu.app\kelime-oyunu.db`
- **macOS:** `~/Library/Application Support/com.kelimeoyunu.app/`
- **Linux:** `~/.local/share/com.kelimeoyunu.app/`

**S: Uygulamayı birden fazla bilgisayarda kullanabilir miyim?**
A: Evet! Veritabanını yedekleyin ve diğer bilgisayarda geri yükleyin.

**S: Uygulamayı nasıl güncellerim?**
A: Yeni sürümü indirip yükleyin. Verileriniz korunur.

**S: Kaynak koduna nasıl erişebilirim?**
A: [GitHub repository](https://github.com/emredag/bil-bakalim)

**S: Hata rapor etmek istiyorum, nereye yazmalıyım?**
A: [GitHub Issues](https://github.com/emredag/bil-bakalim/issues) sayfasından.

### Kullanım Senaryoları

**S: Sınıfta nasıl kullanabilirim?**
A: Projektöre bağlayın, tam ekran yapın (F11), öğrencileri takım modunda yarıştırın.

**S: Uzaktan öğretimde kullanabilir miyim?**
A: Evet! Ekran paylaşımı yapın, öğrencilerle sırayla oynayın.

**S: Turnuva düzenleyebilir miyim?**
A: Evet! Çoklu oyuncu modunda tüm katılımcıları ekleyin, sonuçları kaydedin.

**S: Kelime listeleri nereden bulabilirim?**
A: Kendi listelerinizi oluşturabilir veya topluluktan paylaşılan JSON dosyalarını kullanabilirsiniz.

---

## Destek ve Geri Bildirim

### Yardım Kaynakları

- **GitHub Repository:** [bil-bakalim](https://github.com/emredag/bil-bakalim)
- **Issues:** [Bug raporları ve özellik istekleri](https://github.com/emredag/bil-bakalim/issues)
- **Dokümantasyon:** [docs/](https://github.com/emredag/bil-bakalim/tree/main/docs)

### İletişim

- **GitHub:** [@emredag](https://github.com/emredag)

---

## Ek Kaynaklar

- [README.md](../README.md) - Proje genel bakış
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Geliştirici rehberi
- [API.md](API.md) - Tauri komutları
- [ARCHITECTURE.md](ARCHITECTURE.md) - Sistem mimarisi
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Katkı rehberi
- [CHANGELOG.md](../CHANGELOG.md) - Sürüm notları

---

**Son Güncelleme:** 2025-10-30
**Versiyon:** 1.0.0

Keyifli oyunlar! 🎮

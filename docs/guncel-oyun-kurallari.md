# Kelime Oyunu - Akıllı Tahta Otomasyon ve Kurallar Dizini

Bu belge, öğretmenin moderatör olduğu ancak süre ve geçişlerin sistem tarafından otomatik yönetildiği oyun mekaniğini tanımlar.

## 1. Temel Oyun Parametreleri

* **Toplam Süre (Global Timer):** 300 Saniye (5 Dakika). Tüm oyun boyunca geri sayar.
* **Tahmin Süresi (Guess Timer):** 30 Saniye. Sadece "Tahmin Et" butonuna basıldığında tetiklenir.
* **Girdi Yöntemi:** Sadece Dokunmatik/Mouse Butonları (Klavye girişi yok).

---

## 2. Zamanlayıcı Mantığı (Timer Logic)

Sistemde iki farklı zamanlayıcı state (durum) yönetimi vardır:

### A. Soru Modu (Normal Akış)
* **Durum:** Soru ekranda, harfler kapalı.
* **Global Timer:** Aktif (Geri sayıyor).
* **Guess Timer:** Pasif (0 veya 30'da bekliyor).
* **Aksiyon:** Öğretmen harf açabilir veya tahmin modunu başlatabilir.

### B. Tahmin Modu (Kritik Akış)
* **Tetikleyici:** "Tahmin Et" butonuna basılması.
* **Global Timer:** **DURAKLATILIR (PAUSE).**
* **Guess Timer:** **OTOMATİK BAŞLAR (30 saniyeden geriye).**
* **Aksiyon:** Öğretmen sadece Doğru/Yanlış seçimi yapabilir.

---

## 3. Oyun Akışı ve Otomasyon Kuralları

Oyun döngüsü (Game Loop) aşağıdaki "Event" (Olay) tabanlı kurallara göre işler:

### Adım 1: Soru Gelmesi
* Soru ekrana gelir.
* Global Timer akmaya başlar.
* *Buton Durumu:* `Harf Ver` [Aktif], `Tahmin Et` [Aktif], `Doğru/Yanlış` [Gizli/Pasif].

### Adım 2: Tahmin Et Butonuna Basılması (Event: OnGuessStart)
1.  Global Timer durur.
2.  Ekranda **30 Saniyelik Geri Sayım** görsel olarak belirir ve saymaya başlar.
3.  `Harf Ver` butonu pasif (disabled) olur.
4.  `Doğru` ve `Yanlış` butonları görünür hale gelir.

### Adım 3: Sonuçlanma (3 Senaryo)

#### Senaryo A: Öğretmen "DOĞRU" Butonuna Basarsa
* **İşlem:** O anki puan (+) olarak eklenir.
* **Otomasyon:**
    1.  Guess Timer iptal edilir.
    2.  Kullanıcıya görsel bildirim (Yeşil ışık/Alkış) verilir.
    3.  **Otomatik Geçiş:** Sistem beklemeden bir sonraki soruya geçer.
    4.  Global Timer kaldığı yerden devam eder (Resume).

#### Senaryo B: Öğretmen "YANLIŞ" Butonuna Basarsa
* **İşlem:** O anki puan (-) olarak düşülür (Ceza).
* **Otomasyon:**
    1.  Guess Timer iptal edilir.
    2.  Doğru kelime ekranda gösterilir.
    3.  **Otomatik Geçiş:** Sistem bir sonraki soruya geçer.
    4.  Global Timer kaldığı yerden devam eder (Resume).

#### Senaryo C: 30 Saniyelik Süre Dolarsa (Event: OnTimeout)
* *Bu senaryoda öğretmenin butona basmasına gerek kalmaz.*
* **İşlem:** Sistem otomatik olarak **YANLIŞ CEVAP** prosedürünü uygular.
* **Otomasyon:**
    1.  O anki puan (-) olarak düşülür.
    2.  Ekranda "SÜRE BİTTİ" uyarısı ve doğru kelime gösterilir.
    3.  **Otomatik Geçiş:** Sistem bir sonraki soruya geçer.
    4.  Global Timer kaldığı yerden devam eder (Resume).

---

## 4. Puan Hesaplama Algoritması

Sistem, sonuçlanma anındaki "Mevcut Soru Değeri"ni kullanır.

* `Harf_Puani = 100`
* `Mevcut_Deger = (Toplam_Harf - Acilan_Harf) * Harf_Puani`

| Aksiyon | Puan Etkisi |
| :--- | :--- |
| **Doğru Butonu** | `Toplam Puan += Mevcut_Deger` |
| **Yanlış Butonu** | `Toplam Puan -= Mevcut_Deger` |
| **Zaman Aşımı (Timeout)** | `Toplam Puan -= Mevcut_Deger` |
| **Tamamen Harf Açma** | `Toplam Puan += 0` (Nötr - Puan değişmez) |

---

## 5. UI State Tablosu (Geliştirici Özeti)

Arayüzdeki butonların hangi durumda nasıl davranması gerektiği:

| Durum | Harf Ver Butonu | Tahmin Et Butonu | Doğru/Yanlış Butonları | Global Timer | Guess Timer |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Normal Akış** | Aktif | Aktif | Gizli | **Running** | Stopped |
| **Tahmin Modu** | Pasif (Disabled) | Pasif (Disabled) | **Görünür & Aktif** | Paused | **Running** |
| **Soru Geçişi** | Pasif | Pasif | Pasif | Running | Stopped |
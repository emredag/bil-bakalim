# Task 32: How to Play (Nasıl Oynanır) Screen

## Description
Implement interactive tutorial and game rules explanation screen.

## Requirements from PRD
- **Section:** 7. NASIL OYNANIR? EKRANI

## Oyun Kuralları (Resmi Kurallar)

### Temel Bilgiler
- 📝 Her yarışmacıya **14 kelime** verilir
- ⏱️ Toplam süre: **5 dakika (300 saniye)** - tüm kelimeler için
- 🎯 Her kelime için **maksimum 3 tahmin hakkı**
- 💯 Her harf açma **-100 puan** ceza
- ⚠️ **Tahmin yaptıktan sonra harf alınamaz**

### Kelime Dağılımı (Her Yarışmacı İçin)
- 2 adet 4 harfli kelime
- 2 adet 5 harfli kelime
- 2 adet 6 harfli kelime
- 2 adet 7 harfli kelime
- 2 adet 8 harfli kelime
- 2 adet 9 harfli kelime
- 2 adet 10 harfli kelime

### Çoklu Yarışmacı ve Takım Modu
- 🔄 Her yarışmacı/takım **farklı 14 kelime** alır
- 📚 Kategori yeterli kelime içermelidir:
  - 2 kişi → 28 kelime
  - 3 kişi → 42 kelime
  - 4 kişi → 56 kelime
- 👥 Takım modunda her takımın oyuncuları belirlenir

## İnteraktif Tutorial

### Adımlar
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

## Kazanma Kuralları
- 🥇 En yüksek puanlı kazanır
- Eşitlik durumunda: Az harf açan → Hızlı bitiren

## Puan Sistemi Tablosu
(See PRD Section 9.2 for complete table)

## Klavye Kısayolları
- H: Harf Aç
- T: Tahmin Et
- P: Pas Geç
- Space: Duraklat

## Acceptance Criteria
- [ ] Game rules clearly displayed
- [ ] Basic info section shown
- [ ] Word distribution explained
- [ ] Multi/team mode rules explained
- [ ] Interactive tutorial steps implemented
- [ ] Screenshots/visuals for each step
- [ ] Warning about no letters after guess highlighted
- [ ] Winning rules explained
- [ ] Score table displayed
- [ ] Keyboard shortcuts listed
- [ ] Navigation through tutorial works

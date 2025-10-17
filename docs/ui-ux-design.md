# Kelime Oyunu – UI/UX Tasarım Spesifikasyonu (TV Show Kalitesinde)

Bu belge, PRD'de tanımlanan gereksinimlere sadık kalarak; sınıflarda akıllı tahta, projeksiyon ve büyük ekran TV'lerde net görüntü ve güçlü sahne etkisi sağlayan, TV yarışması kalitesinde bir deneyim için UI/UX kurallarını tanımlar. Uygulama React + TypeScript + Tailwind + Framer Motion + Tauri teknolojileriyle geliştirilecektir.

- **Tam Responsive Tasarım:** Herhangi bir ekran boyutunda mükemmel çalışır (küçük laptop'tan büyük TV'lere)
- **Fluid Layout:** Viewport-aware scaling, flexible grids, relative units (%, vw, vh, rem)
- **Kullanım Bağlamı:** Uzaktan okunabilirlik, yüksek kontrast, büyük dokunma hedefleri, klavye/uzaktan kumanda ile kontrol edilebilirlik
- **Referanslar:** PRD bölümleri 4–12, 16, 19; docs/tasks 05–35; repo teknolojileri

## Tasarım İlkeleri

1. TV Yarışması Estetiği: Yüksek enerji, altın vurgular, parlak accent’ler, dramatik animasyonlar (ama performans dostu).
2. Uzak Görünürlük: 3–8 metre mesafeden okunabilir tipografi ve ikonografi; minimum 48px dokunma hedefi.
3. Net Hiyerarşi: Zaman, skor, aktif oyuncu ve kelime alanı en üst öncelikte.
4. Tutarlılık: Tek tip bileşen sistemi, tutarlı hareket ve ses dili.
5. Erişilebilirlik: WCAG 2.1 AA; renk + ikon/biçim kullanımı; klavye desteği; “reduce motion” saygısı.
6. Performans: 60 FPS animasyon, düşük latency (transform/opacity), skeleton yüklemeler.
7. Offline ve Güvenilir: Hata durumları yalın, geri bildirimler görünür ve anlaşılır.

## Görsel Dil ve Tasarım Token’ları

Tüm renkler ve tipografi Tailwind üzerinden yönetilir. Gerekirse `tailwind.config.js` içerisinde theme.extend ile token’lar genişletilir (bkz. docs/tasks/05-ui-design-system.md).

- Renkler (Dark Theme):
  - Arkaplan: slate-900 (#0f172a), slate-800 (#1e293b), slate-700 (#334155)
  - Accent: blue-500 (#3b82f6), violet-500 (#8b5cf6), gold/amber-400 (#fbbf24)
  - Durum: success emerald-500 (#10b981), error red-500 (#ef4444), warning amber-500 (#f59e0b), info blue-500 (#3b82f6)
  - Metin: slate-100, slate-300, slate-400
- Önerilen Gradient’ler:
  - App BG: from-slate-900 via-slate-800 to-slate-900
  - Kart: from-slate-800 to-slate-700
  - Primary Button: from-blue-600 to-blue-700
- Tipografi:
  - Font ailesi: Inter (UI), JetBrains Mono (kod/numara ops.)
  - Sayısal göstergeler (süre/puan): `font-variant-numeric: tabular-nums;` (CSS) — net atlama animasyonları ve hizalama
  - Başlık ölçeği (örnek Tailwind): H1 `text-4xl md:text-5xl lg:text-6xl`, H2 `text-2xl md:text-3xl lg:text-4xl`, H3 `text-xl md:text-2xl`, Body `text-sm md:text-base lg:text-lg`, Buton `text-base md:text-lg`, Harf kutusu `text-3xl md:text-4xl lg:text-5xl`
  - **Fluid Typography:** Başlıklar için `clamp()` kullanarak viewport'a göre akışkan büyüklük (örn: `clamp(1.5rem, 4vw, 3.5rem)`)
- Spacing & Radius:
  - Spacing: 8px tabanlı (2,4,6,8,12,16,24,32,48,64)
  - Radius: `rounded-xl` (buton/kart), `rounded-2xl` (modal/kart büyük)
- Gölge ve Parıltı:
  - Kart: `shadow-xl hover:shadow-2xl`
  - Vurgu: altın/glow `ring-amber-400/40` + hafif outer glow (TV hissi)

## Layout Sistemi (Fully Responsive)

- **Güvenli Kenar Boşlukları:** Dış çerçevede responsive "safe area" (örn: `p-4 md:p-6 lg:p-8 xl:p-12`); projeksiyon kesimlerini tolere eder.
- **Responsive Grid:** 12 sütun sistemi, viewport'a göre gutter (örn: `gap-4 md:gap-6 lg:gap-8`); küçük ekranlarda daha sıkı, büyük ekranlarda rahat nefes.
- **Fluid Components:** Tüm bileşenler viewport'a göre ölçeklenir (width: %, max-width, min-width kullanımı)
- **Z-Index Katmanları:**
  - z-0: İçerik
  - z-10: Tooltip, dropdown
  - z-20: Modallar
  - z-30: Konfeti/özel efekt
  - z-40: Global toast/alert
- Bileşen Minimum Boyutları: Etkileşim hedefi min 48×48px; buton padding `px-6 py-3` ve üzeri.
- Renkli Odak Alanları: Timer, Skor ve Aktif Oyuncu/Team bölümü üst çubukta baskın görünür.

## Bileşen Kütüphanesi

<a id="components"></a>

- Buttons:
  - Primary: `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition`
  - Secondary: `bg-slate-700 hover:bg-slate-600 text-slate-100`
  - Destructive: `bg-red-600 hover:bg-red-700 text-white`
  - Disabled durumu: %60 opaklık, cursor-not-allowed, tooltip ile neden (validasyon).
- Cards: `bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 hover:scale-105` (Framer Motion ile subtle hover scale).
- Inputs: `bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100 focus:ring-2`
- Modal/Dialog: Overlay `bg-black/50 backdrop-blur-sm`, içerik `bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-[720px]`
- Toast: Sağ üstte, 4 sn auto-dismiss; türüne göre renk şeritleri (success/error/info).
- Tooltip: `bg-slate-800 text-slate-100 border border-slate-700 px-3 py-2 rounded-lg`
- Badge: Durum/oynanabilirlik için kompakt renkli etiketler.
- Tabs/Segmented: Ayarlar ve yönetim ekranlarında.
- Table: Geçmiş ve kelime listeleri; zebra satır; sticky header; responsive stack 1366’de.
- Progress:
  - Timer Ring (dairesel) veya Bar (üst).
  - Score Count-up (sayısal animasyon).
- Letter Tile (Harf Kutusu):
  - Kapalı: `bg-slate-700 border-2 border-slate-600 rounded-lg w-12 h-14 md:w-14 md:h-16 lg:w-16 lg:h-20 flex items-center justify-center text-2xl md:text-3xl lg:text-4xl text-slate-400`
  - Açık: `bg-amber-400 text-slate-900 rounded-lg w-12 h-14 md:w-14 md:h-16 lg:w-16 lg:h-20 flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-extrabold`
  - **Responsive Sizing:** Küçük ekranlarda daha kompakt, büyük ekranlarda daha belirgin
  - Durum glow: Doğru anında yeşil glow, yanlışta kırmızı kısa flash.
- Team Chip: Renk/emoji ile takım kimliği; `rounded-full px-4 py-2`.

Not: Bileşenlerin detaylı teknik yönergeleri docs/tasks/05-ui-design-system.md ve 06-animations-framer-motion.md ile uyumludur.

## Hareket (Motion) ve Mikro Etkileşimler

<a id="motion"></a>

Framer Motion kullanın; performans için `transform/opacity` öncelikli. “Reduce motion” tercihi aktif ise animasyonları basitleştirin veya kapatın.

- Sayfa Geçişleri:
  - Fade: 0.3s, easeOut
  - Slide in (x: 20→0): 0.3s
- Harf Açma (3D Flip):
  - `rotateY: 0→180deg`, `scale: 1→1.1→1`, 0.6s, spring
- Doğru Cevap:
  - Harflerde kısa yeşil glow, kelime alanında 3x pulse, konfeti (canvas), skor count-up
- Yanlış Cevap:
  - Shake `x: 0→-10→10→0` 0.3s, kırmızı flash overlay
- Süre Uyarısı:
  - Son 30 sn: pulse (scale 1→1.05, yumuşak)
  - Son 10 sn: hızlı pulse + renk kırmızıya dönme + tick ses
- Hover: Kart/Buton scale 1→1.05, 0.2s, gölge artışı
- Skeleton: `animate-pulse` ile yükleme durumları

## Ses Tasarımı

<a id="sound"></a>

Web Audio API ile PRD’deki ses paletini uygulayın. Sesler düşük gecikme ve net geri bildirim sağlamalıdır.

- Olay–Ses Eşlemesi:
  - Harf Açma → Pop (0.1s)
  - Doğru → Başarı jingle
  - Yanlış → Hata buzz
  - Pas → Whoosh
  - Zaman → Tick (son 10 sn hızlanır)
  - Kazanma → Fanfare
  - Tüm butonlar → Click
- Ses Kontrolleri: Master volume, mute toggle; ayarlar sayfasından ve oyun üst çubuktan erişim.
- Erişilebilirlik: Sesli bildirimler, görsel eşdeğerleriyle birlikte.

## Erişilebilirlik (A11y)

<a id="a11y"></a>

- Klavye: Tüm etkileşimler Tab/Shift+Tab ile gezilebilir; Space/Enter ile tetiklenir; ESC ile modal kapanır (bkz. docs/tasks/33-keyboard-shortcuts.md).
- Kontrast: Minimum 4.5:1 metin kontrastı; durumları sadece renge bağlamayın, ikon/biçim ekleyin.
- Ekran Okuyucu: Semantik HTML; aria-label/aria-describedby; skor ve süre için `aria-live=polite`.
- Metin Ölçeklendirme: 200% zoom desteği; büyük ekranlarda clamp ile akışkan metin.
- Reduce Motion: Sistem tercihini algılayıp yoğun animasyonları azaltın.
- Büyük Hedefler: Minimum 48×48px etkileşim alanı; özellikle akıllı tahta/uzaktan kullanım için.

## Ekranlara Özel Tasarım Rehberi

<a id="screens"></a>

Aşağıdaki maddeler PRD Bölüm 4 ve docs/tasks 08–24 ile birebir hizalıdır.

<a id="main-menu"></a>

### 1) Ana Menü (docs/tasks/08-main-menu-screen.md)

- Hero başlık + uygulama logosu (ortalanmış).
- Aksiyon kartları (grid 2×3): Yarışma Başlat, Kategori Yönetimi, Geçmiş, Ayarlar, Nasıl Oynanır, (ops.) Hakkında.
- Büyük kartlar, güçlü hover, kısa açıklama alt satırı.
- Alt çubuk: Versiyon, GitHub linki.
- Arka plan: Koyu gradient + subtle parçacık/parıltı layer’ı (performans dostu).

<a id="category-selection"></a>

### 2) Kategori Seçimi (docs/tasks/09-category-selection-screen.md)

- Başlık ve arama/filtre çubuğu.
- Kartlarda emoji + isim + kelime sayısı + oynanabilirlik badge + [Oyna].
- Yetersiz modlar için disable ve tooltip ile mesaj.
- “Yeni Kategori” butonu belirgin.
- Boş durum illüstrasyonu + çağrı.

<a id="game-mode-selection"></a>

### 3) Mod Seçimi (docs/tasks/10-game-mode-selection.md)

- 3 büyük mod kartı (Tek, Çoklu, Takım) kısa açıklama ve gereksinim etiketi.
- Kategori yeterliliğine göre modlar aktif/pasif.
- Devam/Geri butonları sabit alt çubukta.

<a id="participant-team-setup"></a>

### 4) Yarışmacı/Takım Ayarları (docs/tasks/11-participant-team-setup.md)

- Tek mod: İsim alanı + Başla.
- Çoklu mod: 2–6 yarışmacı; ekle/çıkar; drag&drop sıralama.
- Takım mod: 2–4 takım; ad, renk/emoji, oyuncu listesi; takım içi sıra.
- Sağ yanda kelime yeterlilik özeti ve uyarılar.

<a id="game-screen"></a>

### 5) Oyun Ekranı (docs/tasks/12-game-screen-layout.md)

- Üst Header: Sol kategori/emoji, orta büyük Timer, sağ skor + ilerleme + aktif oyuncu.
- Orta: Kelime alanı (harf kutuları; satır/kolon spacing canlı scale).
- İpucu şeridi: Büyük okunabilir metin + ampul ikonu.
- Kontrol Paneli: Harf Aç, Tahmin Et, Pas; alt bilgi satırı (kalan tahmin, açılan harf, kalan puan).
- Yan kontrol: Pause, Ses, Ana Menü.
- Alt Bar: İlerleme 6/14 ve kısa kategori açıklaması.
- TV etkisi: Hafif ışık yansımaları, doğru cevaba konfeti.

<a id="mechanics"></a>

### 6) Oyun Mekanikleri (docs/tasks/13–19)

- Harf Aç: Tahmin yapılmadıysa aktif; flip 0.6s; skor -100; pop sesi.
- Tahmin: Modal “Doğru mu?” [✓/✗]; doğruysa tüm harfler açılır, yeşil glow, konfeti, başarı sesi; yanlışsa shake, hak düşer; hak 0 ise otomatik pas.
- Pas: Onay modalı, whoosh sesi, bir sonraki kelimeye akış.
- Süre: 300 sn; son 30/10 sn özel durumlar; süre 0’da oyun biter.
- Pause: Blur overlay “Duraklatıldı”, [Devam] [Ana Menü].

<a id="results"></a>

### 7) Sonuç Ekranları (docs/tasks/20–22)

- Tek: Büyük toplam puan, istatistikler, detaylı kelime listesi (akordeon), [Tekrar Oyna].
- Çoklu: Podium/sıralama tablosu; eşitlik kuralı gösterimi; her oyuncu için detay paneli.
- Takım: Kazanan takım vurgusu; takım renkleri/emoji; toplam puan ve detaylar.

<a id="history"></a>

### 8) Geçmiş ve Detay (docs/tasks/23–24)

- Liste: Tarih, kategori, mod, katılımcı sayısı, süre, kazanan; [Detay].
- Filtreler: Tarih, kategori, mod; sıralama; sayfalama.
- Detay: Üst bilgiler, sıralama tablosu, katılımcı akordeonlarında kelime sonuçları.
- Export/Sil: Onay diyalogları ve toast geri bildirimleri.

<a id="category-management"></a>

### 9) Kategori/Word Yönetimi (docs/tasks/25–31)

- Kategori listesi: Kart görünümü; [Gör/Düzenle/Sil].
- Yeni Kategori: Ad, emoji seçici, açıklama; canlı önizleme.
- Kelime Yönetimi: Tablo; arama; sağ panelde dağılım (4–10 harf durumları, toplam, oynanabilirlik).
- Ekle/Düzenle Modal: Canlı harf sayacı, validasyon; toast bildirim.
- JSON Import/Export: Dosya seçimleri ve validasyon özetleri.

<a id="howto-shortcuts"></a>

### 10) Nasıl Oynanır ve Kısayollar (docs/tasks/32–33)

- Görsellerle mini rehber; kritik kuralların vurgusu (tahmin sonrası harf yok).
- Kısayol Tablosu: H, T, P, Space, M, ESC; dialog kısayolları: D/Enter, Y/N.
- Ekranda hızlı yardım? (opsiyonel) “?” butonu ile overlay.

<a id="responsive"></a>

### 11) Tam Responsive Tasarım (docs/tasks/35)

- **Küçük Ekranlar (< 768px):** Kompakt layout, tek sütun grid, küçük typography, daha sıkı spacing
- **Orta Ekranlar (768px - 1024px):** Denge layout, 2-3 sütun grid, orta typography
- **Büyük Ekranlar (> 1024px):** Geniş layout, tam grid (12 sütun), büyük typography, bol spacing
- **Çok Büyük Ekranlar (> 1920px):** `max-width` container'lar, büyütülmüş typography (clamp ile), artırılmış hit targets
- **Fluid Scaling:** `clamp()`, `vw`, `vh`, `%` kullanarak sürekli ölçekleme
- **Tam ekran mod:** Herhangi bir viewport'ta önerilir

## Etkileşim ve Girdi Modeli

<a id="interaction"></a>

- **Klavye:** PRD 11'deki tüm kombinasyonlar; görsel ipuçları (buton altındaki harf).
- **Touch/Mouse:** Viewport'a uygun büyük hedefler (min 44×44px küçük ekranlar, 48×48px+ büyük ekranlar), hover alternatifleri (focus-visible stilleri).
- **Responsive Touch Targets:** Ekran boyutuna göre dinamik hit area (küçük ekranlarda daha kompakt ama dokunulabilir, büyük ekranlarda daha geniş)
- **"Yanlış tıklama koruması":** Tahmin sonrası Harf Aç butonu devre dışı; destructive aksiyonlarda onay gerekir.
- **Fokus Yönetimi:** Modal açıldığında ilk interaktif öğeye; kapanınca tetikleyen kontrole geri.

## Hata, Boş Durum ve Bildirim Dili

<a id="errors-empty"></a>

- Hata: Sorun açık anlatılır, çözüm önerisi sunulur; teknik detaylar gizlidir (Geliştirici mod hariç).
- Boş Durum: Ne yapmalı? Net çağrı butonu (“Yarışma Başlat”, “Kelime Ekle”).
- Bildirim: Kısa, olumlu dil; başarı/uyarı/hata renkleri ve ikonları.

## Performans ve Kalite Notları

<a id="performance-quality"></a>

- Görseller/efektler: SVG ve CSS öncelikli; ağır gölgelerden kaçın; 3D efektler kısa ve seyrek.
- Sanal liste/virtualization: Çok kategori/kelime olan listelerde.
- Animasyonlar: Toplu state değişimlerinde eşzamanlılığı sınırlayın; “staggerChildren” ile küçük gecikmeler.
- Test Kontrol Listesi: docs/tasks/43-testing-setup.md + PRD 16 (UI/UX, erişilebilirlik, responsive).

## Uygulama Notları (Teknik Eşleştirme)

- Tailwind: Renk/spacing/typography token’larını theme.extend ile ekleyin; komponent utility sınıflarını `@apply` ile ortaklaştırabilirsiniz.
- Framer Motion: Route geçişleri ve kritik etkileşimler için variants; performans için layoutId ve `will-change`.
- Zustand/Context: UI state’leri (modal açık/kapalı, pause, ses, reduceMotion) tek yerden yönetilir.
- Tauri: F11 tam ekran; dosya diyalogları; JSON/DB işlemleri; güvenlik kısıtları (CSP).
- Erişilebilirlik: Headless UI/Radix UI kalıplarıyla uyumlu ARIA örüntüleri.

## Tasarım QA Checklist (Özet)

<a id="qa-checklist"></a>

- [ ] **Çoklu Viewport Testi:** Küçük (< 768px), Orta (768-1024px), Büyük (> 1024px), Çok Büyük (> 1920px) ekranlarda test
- [ ] **Uzaktan Okunabilirlik:** Timer/Skor/İpucu her ekran boyutunda ve mesafeden belirgin mi?
- [ ] **Responsive Scaling:** Harf kutuları, butonlar, typography tüm viewport'larda uygun mu?
- [ ] **Fluid Layout:** Container'lar, grid'ler viewport'a göre doğru ölçekleniyor mu?
- [ ] **Touch Targets:** Minimum 44×44px (küçük), 48×48px+ (büyük) hit area'lar sağlanıyor mu?
- [ ] **Tahmin sonrası harf açma blokajı** net mi?
- [ ] **Erişilebilirlik:** Tab sırası, focus ring, aria-live alanları tüm viewport'larda
- [ ] **Reduce motion** saygısı ve "pulse/flash" sınırlandırma
- [ ] **Ses ve görsel feedback** eşleşmesi
- [ ] **Boş durumlar ve hata mesajları** tüm ekran boyutlarında anlaşılır mı?
- [ ] **Çoklu/takım modunda** ayrışan renk/kimlik
- [ ] **Sonuç ekranında** sıralama ve eşitlik kuralları görünür
- [ ] **Breakpoint Consistency:** Tailwind breakpoints (sm, md, lg, xl, 2xl) tutarlı kullanılıyor mu?

## Referanslar ve İlişkilendirme

- PRD: UI/UX gereksinimleri 4–12, 16, 19; puanlama, kısayollar, ses, kategori validasyonları.
- docs/tasks:
  - 05-ui-design-system.md: Token ve bileşen kuralları
  - 06-animations-framer-motion.md: Hareket kuralları
  - 08–12: Ana ekran akışları
  - 13–19: Oyun mekaniği UI
  - 20–24: Sonuç ve geçmiş ekranları
  - 25–31: Kategori & kelime yönetimi
  - 32–35: Yardım, kısayollar, a11y ve responsive
  - 43: Test setupları

Bu doküman, TV yarışması kalitesinde bir deneyimi garanti edecek görsel/hareket/erişilebilirlik standartlarını tanımlar ve mühendislik ile tasarım arasında tek kaynaklı gerçeklik (SSOT) olarak kullanılmalıdır.

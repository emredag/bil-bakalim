# Task 38 - First Launch Experience - Test Talimatları

## 🎯 Test Edilerek Tamamlanması Gereken İşler

### ✅ Yapılan Değişiklikler
1. **First Launch Detection Service** oluşturuldu (`src/services/firstLaunch.ts`)
2. **Welcome Screen** oluşturuldu (`src/components/screens/WelcomeScreen.tsx`)
3. **Router'da first launch redirect** eklendi
4. **Ana Menüye Test Butonları** eklendi (sadece dev mode'da görünür)
5. **Test Page** oluşturuldu (`/first-launch-test`)

### 🧪 Test Senaryoları

#### Test 1: İlk Açılış Deneyimi (Tauri App'de)

**Durum:** Tauri uygulaması çalışıyor (localhost:1420)

**Adımlar:**
1. ✅ Uygulamayı aç (npm run tauri dev ile başlatıldı)
2. ✅ Ana menüde artık **5 test butonu** göreceksiniz (dev mode'da):
   - 🧪 First Launch Test
   - 🎬 Animation Demo
   - 🔊 Sound Demo
   - ♿ A11y Demo
   - ❌ Error Demo
3. ✅ **"🧪 First Launch Test"** butonuna tıklayın
4. ✅ Test sayfasında **"Reset First Launch State"** butonuna tıklayın
5. ✅ **"Navigate to Home"** butonuna tıklayın
6. ✅ **BEKLENEN:** Otomatik olarak Welcome Screen'e yönlendirilmelisiniz

#### Test 2: Welcome Screen Kontrolü

Welcome Screen'de kontrol edilecekler:
- [ ] ✨ Mavi-mor gradient "Kelime Oyunu'na Hoş Geldiniz!" başlığı
- [ ] 🎯 Parlayan Sparkles ikonu (animated)
- [ ] 📝 4 özellik kartı görünüyor:
  - 🎯 Kategoriye Dayalı Oyun
  - 👥 Çoklu Oyun Modları
  - 🏆 Yarışma Geçmişi
  - ⚙️ Tamamen Özelleştirilebilir
- [ ] 💾 "Veritabanı Hazır" statüsü (1 saniye sonra yeşil ✓ ile)
- [ ] 🎮 "Hemen Başla" butonu (1 saniye sonra aktif olur)
- [ ] 🎨 Smooth animasyonlar (fade-in, scale, icon rotation)

#### Test 3: İlk Açılışı Tamamlama

**Adımlar:**
1. [ ] Welcome Screen'de **"Hemen Başla"** butonuna tıklayın
2. [ ] **BEKLENEN:** Ana menüye yönlendirilmelisiniz
3. [ ] Ana menüde 5 normal buton + 5 test butonu göreceksiniz
4. [ ] First Launch Test butonuna tekrar gidin
5. [ ] **BEKLENEN:** "First Launch Already Completed" durumunu göreceksiniz

#### Test 4: Sonraki Açılışlar

**Adımlar:**
1. [ ] Uygulamayı kapatın (Cmd+Q veya window'u kapatın)
2. [ ] Uygulamayı tekrar başlatın: `npm run tauri dev`
3. [ ] **BEKLENEN:** Direkt ana menü açılmalı, welcome screen gösterilmemeli
4. [ ] Bu, localStorage'ın persist ettiğini kanıtlar

#### Test 5: Manuel Reset Testi

**Adımlar:**
1. [ ] Ana menüden "First Launch Test" butonuna tıklayın
2. [ ] Current State: "First Launch Already Completed" göreceksiniz
3. [ ] **"Reset First Launch State"** butonuna tıklayın
4. [ ] ✅ Success mesajı: "First launch state reset!"
5. [ ] Current State: "First Launch State Active" olmalı
6. [ ] **"Navigate to Home"** butonuna tıklayın
7. [ ] **BEKLENEN:** Tekrar Welcome Screen'e yönlendirilmelisiniz

#### Test 6: Veritabanı Kontrolü

**Terminal'de kontrol edin:**
```bash
# Terminal output'ta bu satırı görmelisiniz:
"Database already seeded, skipping..."
```

**Veritabanı dosyası lokasyonu:**
- macOS: `~/Library/Application Support/com.kelimeoyunu.app/word-game.db`
- Windows: `%APPDATA%\com.kelimeoyunu.app\word-game.db`
- Linux: `~/.local/share/com.kelimeoyunu.app/word-game.db`

**Kontrol:**
```bash
# macOS'ta:
ls -lh ~/Library/Application\ Support/com.kelimeoyunu.app/

# Veritabanı boyutunu görün:
du -sh ~/Library/Application\ Support/com.kelimeoyunu.app/word-game.db
```

### 🎨 UI/UX Detayları (Manuel Gözlem)

Welcome Screen'de kontrol edilecek tasarım detayları:

**Renkler:**
- [ ] Koyu arka plan: slate-900 → slate-800 gradient
- [ ] Başlık: Mavi-mor gradient (blue-400 → violet-400)
- [ ] Card background: slate-800
- [ ] Success indicator: Emerald-400 (yeşil)
- [ ] Buttons: Blue-600 → Violet-600 gradient

**Animasyonlar:**
- [ ] Sayfa açılış: Fade + scale (0.9 → 1.0)
- [ ] Icon: Rotate + scale animation (infinite loop)
- [ ] Cards: Staggered fade-in (bottom → up)
- [ ] Database status: Fade transition

**Typography:**
- [ ] Başlık: 4xl → 5xl → 6xl (responsive)
- [ ] Feature titles: Semibold, white
- [ ] Descriptions: Regular, slate-400
- [ ] Button: lg → xl, bold

**Spacing:**
- [ ] Outer padding: 4 → 6 → 8 (responsive)
- [ ] Card padding: 8 → 12
- [ ] Gap between elements: 4 → 8

### 🚀 Production Test (Opsiyonel)

Production build'de test butonları **görünmemeli**:

```bash
# Build app
npm run tauri build

# Run built app
# macOS: open src-tauri/target/release/bundle/macos/kelime-oyunu.app
# Windows: src-tauri/target/release/kelime-oyunu.exe
# Linux: src-tauri/target/release/kelime-oyunu
```

**Kontrol:**
- [ ] Ana menüde **sadece 5 buton** var (test butonları yok)
- [ ] İlk açılışta welcome screen gösteriliyor
- [ ] Sonraki açılışlarda direkt ana menü

### ✅ Onay Kriterleri

Tüm testler başarılı ise:
- [ ] First launch detection çalışıyor
- [ ] Welcome screen ilk açılışta gösteriliyor
- [ ] Welcome screen içeriği doğru ve animasyonlu
- [ ] "Hemen Başla" butonu çalışıyor
- [ ] First launch flag persist ediyor
- [ ] Sonraki açılışlarda welcome screen gösterilmiyor
- [ ] Test butonları dev mode'da ana menüde görünüyor
- [ ] Test sayfası ile manuel reset yapılabiliyor
- [ ] Veritabanı otomatik initialize oluyor
- [ ] Production build'de test butonları görünmüyor

### 📝 Notlar

1. **localStorage Key:** `kelime-oyunu-first-launch-completed`
2. **Test Page URL:** `/first-launch-test` (sadece ana menüden erişilebilir)
3. **Welcome Screen Route:** `/welcome`
4. **Database Seed:** Task 03'te tamamlandı, otomatik çalışıyor

### 🐛 Bilinen Sorunlar

- ❌ Yok (tüm testler başarılı olmalı)

### 📦 Commit Mesajı Önerisi

```
Task 38: Implement first launch experience

Features:
- Add first launch detection service with localStorage
- Create welcome screen with app introduction and features
- Add database initialization status indicator
- Implement router-level first launch redirect
- Add dev-only test buttons to main menu
- Create first launch test page for manual testing

Technical Details:
- Service: src/services/firstLaunch.ts
- Component: src/components/screens/WelcomeScreen.tsx
- Test Page: src/components/screens/FirstLaunchTest.tsx
- Router: Auto-redirect to /welcome on first launch
- Main Menu: Shows 5 test buttons in dev mode only

Database initialization (from Task 02-04):
- Auto-creates database on app startup
- Seeds default category with 70 words
- Creates default settings

PRD Reference: Section 13.1 - İlk Kurulum Akışı
```

---

## 🎬 Quick Start

```bash
# Start Tauri app
npm run tauri dev

# In app:
# 1. Click "🧪 First Launch Test" button
# 2. Click "Reset First Launch State"
# 3. Click "Navigate to Home"
# 4. See Welcome Screen
# 5. Click "Hemen Başla"
# 6. Back to Main Menu
```

Başarılar! 🚀

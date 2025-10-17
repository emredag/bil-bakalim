# Kelime Oyunu - Task Index

This directory contains all tasks required to build the Kelime Oyunu (Word Game) application from scratch, based entirely on the PRD (Product Requirements Document).

## Task Overview

**Total Tasks: 47**

All tasks are derived directly from the PRD without additions or omissions. Each task references its corresponding PRD section.

---

## Task Categories

### 🔧 Project Setup & Infrastructure (Tasks 01-04)
- **01** - Project Setup (Tauri, React, TypeScript, Dependencies)
- **02** - Database Schema Setup (SQLite tables, indexes, constraints)
- **03** - Initial Data Seeding (Default category with 70 words)
- **04** - Tauri Backend Commands (Rust commands for all operations)

### 🎨 UI/UX Foundation (Tasks 05-07)
- **05** - UI Design System (Colors, typography, components)
- **06** - Animations with Framer Motion (All animations)
- **07** - Sound System (Web Audio API, sound effects)

### 🏠 Main Screens (Tasks 08-12)
- **08** - Main Menu Screen (Ana menü, 5 action cards)
- **09** - Category Selection Screen (Kategori seçimi)
- **10** - Game Mode Selection (Tek/Çoklu/Takım)
- **11** - Participant and Team Setup (Oyuncu/takım ayarlama)
- **12** - Game Screen Layout (Ana oyun ekranı)

### 🎮 Game Mechanics (Tasks 13-19)
- **13** - Word Selection Algorithm (Kelime seçim algoritması)
- **14** - Letter Reveal Mechanic (Harf açma)
- **15** - Guess Mechanic (Tahmin etme)
- **16** - Skip Mechanic (Pas geçme)
- **17** - Timer System (Süre yönetimi)
- **18** - Pause System (Duraklatma)
- **19** - Scoring System (Puanlama ve sıralama)

### 📊 Results & History (Tasks 20-24)
- **20** - Results Screen - Single Player (Tek yarışmacı sonuç)
- **21** - Results Screen - Multi Player (Çoklu yarışmacı sonuç)
- **22** - Results Screen - Team Mode (Takım modu sonuç)
- **23** - Game History List Screen (Geçmiş yarışmalar listesi)
- **24** - Game History Detail Screen (Yarışma detayı)

### 📚 Category & Word Management (Tasks 25-30)
- **25** - Category Management Screen (Kategori yönetimi)
- **26** - Category Creation (Kategori oluşturma)
- **27** - Word Management Screen (Kelime yönetimi)
- **28** - Word Add and Edit (Kelime ekleme/düzenleme)
- **29** - Category Validation System (Kategori validasyonu)
- **30** - JSON Import/Export (JSON içe/dışa aktarma)

### ⚙️ Settings & Help (Tasks 31-32)
- **31** - Settings Screen (Ayarlar ekranı)
- **32** - How to Play Screen (Nasıl oynanır ekranı)

### 🎹 Input & Accessibility (Tasks 33-35)
- **33** - Keyboard Shortcuts (Klavye kısayolları)
- **34** - Accessibility (A11y) (Erişilebilirlik)
- **35** - Responsive Design (Responsive tasarım)

### 🔗 App Infrastructure (Tasks 36-39)
- **36** - State Management (Zustand/Context API)
- **37** - Routing and Navigation (Routing sistemi)
- **38** - First Launch Experience (İlk kurulum deneyimi)
- **39** - Error Handling (Hata yönetimi)

### 🚀 Optimization & Build (Tasks 40-46)
- **40** - Performance Optimization (Performans optimizasyonu)
- **41** - Tauri Configuration (Tauri yapılandırması)
- **42** - Application Icons (Uygulama ikonları)
- **43** - Testing Setup (Test kurulumu)
- **44** - Documentation (Dokümantasyon)
- **45** - Code Quality and Linting (Kod kalitesi)
- **46** - Build and Packaging (Build ve paketleme)

### ✅ Final QA (Task 47)
- **47** - Final Testing and QA (Final test ve QA)

---

## Development Flow

### Phase 1: Foundation (Tasks 01-07)
Set up project, database, UI system, animations, and sound.

### Phase 2: Core Screens (Tasks 08-12)
Build main menu, category selection, mode selection, and game screen.

### Phase 3: Game Logic (Tasks 13-19)
Implement all game mechanics, scoring, and timer.

### Phase 4: Results & History (Tasks 20-24)
Build results screens and game history functionality.

### Phase 5: Management (Tasks 25-30)
Implement category and word management features.

### Phase 6: Settings & Help (Tasks 31-32)
Add settings and tutorial screens.

### Phase 7: Enhancements (Tasks 33-39)
Add keyboard shortcuts, accessibility, routing, and error handling.

### Phase 8: Polish & Deploy (Tasks 40-47)
Optimize, test, document, and build for distribution.

---

## Critical Game Rules (Must Follow)

From PRD Section 1 - Oyun Kuralları:

1. ✅ Her oyuncuya **14 kelime** verilir (her uzunluktan 2'şer: 4-10 harf)
2. ✅ Çoklu/takım modunda **her katılımcıya farklı kelimeler** verilir
3. ✅ Toplam süre: **5 dakika (300 saniye)** - tüm kelimeler için ortak
4. ✅ Her kelime için **maksimum 3 tahmin hakkı**
5. ✅ Her harf açma **-100 puan** ceza
6. ⚠️ **Tahmin yapıldıktan sonra harf alınamaz** (KRİTİK KURAL!)
7. ✅ Eşitlik: Puan → Az harf → Hızlı bitiren

---

## PRD Compliance

✅ **100% PRD Coverage**
- All tasks derived from PRD sections
- No additions beyond PRD requirements
- No omissions of PRD requirements
- Each task references PRD section numbers

---

## Usage

1. Read tasks sequentially for development flow
2. Each task has:
   - Description
   - PRD section references
   - Detailed requirements
   - Acceptance criteria
3. Check off acceptance criteria as completed
4. Tasks can be worked on in parallel within phases

---

## Notes

- Tasks are designed to be modular and independent where possible
- Some tasks have dependencies (e.g., Task 12 depends on Task 05)
- All game rules from PRD are enforced in relevant tasks
- Performance targets from PRD are included in Task 40
- All test scenarios from PRD Section 16 are covered in Task 47

---

**Generated from PRD:** `/docs/PRD.md`
**Last Updated:** 2025-10-17

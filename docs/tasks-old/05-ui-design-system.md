# Task 05: UI Design System

## Description
Implement design system with colors, typography, components, and animations.

## Requirements from PRD
- **Section:** 8. UI/UX TASARIM GEREKSİNİMLERİ

## Color Palette (Modern Dark Theme)

### Background
- Primary: #0f172a (Slate-900)
- Secondary: #1e293b (Slate-800)
- Tertiary: #334155 (Slate-700)

### Accent Colors
- Primary: #3b82f6 (Blue-500)
- Secondary: #8b5cf6 (Violet-500)
- Gold: #fbbf24 (Amber-400)

### Status Colors
- Başarı: #10b981 (Emerald-500)
- Hata: #ef4444 (Red-500)
- Uyarı: #f59e0b (Amber-500)
- Bilgi: #3b82f6 (Blue-500)

### Text Colors
- Primary: #f1f5f9 (Slate-100)
- Secondary: #cbd5e1 (Slate-300)
- Tertiary: #94a3b8 (Slate-400)

### Gradients
- Ana arkaplan: `from-slate-900 via-slate-800 to-slate-900`
- Kartlar: `from-slate-800 to-slate-700`
- Butonlar: `from-blue-600 to-blue-700`

## Typography

### Font Family
- Ana Font: Inter (Google Fonts)
- Monospace: JetBrains Mono

### Font Sizes (Tailwind)
- H1: text-6xl (60px) font-bold
- H2: text-4xl (36px) font-semibold
- H3: text-2xl (24px) font-semibold
- Normal: text-base (16px)
- Büyük: text-lg (18px)
- Küçük: text-sm (14px)
- Kelime Harfleri: text-5xl (48px) font-extrabold
- Butonlar: text-lg (18px) font-semibold

## Component Styles

### Buttons
- **Primary:** `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`
- **Secondary:** `bg-slate-700 hover:bg-slate-600 text-slate-100`
- **Destructive:** `bg-red-600 hover:bg-red-700 text-white`

### Cards
- Base: `bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700`
- Hover: `hover:scale-105 hover:shadow-2xl transition-transform duration-200`

### Input Fields
- Base: `bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100`
- Focus: `focus:ring-2 focus:ring-blue-500`

### Modal/Dialog
- Overlay: `bg-black/50 backdrop-blur-sm`
- Content: `bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md`

### Letter Boxes
- Kapalı: `bg-slate-700 border-2 border-slate-600 rounded-lg w-16 h-20` with "?" text-4xl text-slate-400
- Açık: `bg-amber-400 text-slate-900 rounded-lg w-16 h-20` with harf text-4xl font-extrabold

## Acceptance Criteria
- [ ] Tailwind CSS configured
- [ ] Color palette implemented
- [ ] Typography system set up
- [ ] Component base styles created
- [ ] Design system documented

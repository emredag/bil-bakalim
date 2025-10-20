# Kelime Oyunu - Branding & Visual Identity

> **Task 42 - Application Icons and Branding**
> PRD Reference: Section 17.3

---

## 🎨 Brand Colors

### Primary Gradient
- **Blue to Violet**: `#3b82f6` → `#8b5cf6`
- **Usage**: App background, primary buttons, icon background
- **Tailwind**: `from-blue-500 to-violet-500`

### Accent Colors
- **Gold**: `#fbbf24` (amber-400)
- **Orange**: `#f59e0b` (amber-500)
- **Usage**: Highlighted letters, success states, central icon element

### Dark Theme
- **Background**: `#0f172a` (slate-900)
- **Secondary**: `#1e293b` (slate-800)
- **Tertiary**: `#334155` (slate-700)

---

## 📱 Application Icon

### Design Concept
- **Central Element**: Large "K" letter (Kelime Oyunu)
- **Theme**: 4 letter boxes in corners (game mechanic)
- **Style**: Modern, minimal, flat design
- **Colors**: Blue/Violet gradient background + Gold "K"

### Icon Files

**Source:**
- `public/icon.svg` - 512×512 SVG (master file)

**Generated (User must create):**
- `public/favicon.ico` - 32×32 ICO
- `public/favicon-16x16.png` - 16×16 PNG
- `public/favicon-32x32.png` - 32×32 PNG
- `public/apple-touch-icon.png` - 180×180 PNG

**Tauri (Optional upgrade):**
- `src-tauri/icons/256x256.png` - 256×256 PNG
- `src-tauri/icons/512x512.png` - 512×512 PNG

---

## 🖼️ Logo Usage

### Main Logo
- **Text**: "Kelime Oyunu"
- **Emoji**: 🎯 (target/game symbol)
- **Font**: Inter 900 (Black)
- **Size**: Responsive `text-4xl md:text-5xl lg:text-6xl`

### Icon-only Usage
- Minimum size: 16×16px
- Clear space: 10% of icon size on all sides
- Do not rotate or distort
- Maintain aspect ratio

---

## 🎯 Typography

### Fonts
- **UI**: Inter (400, 500, 600, 700, 800, 900)
- **Monospace**: JetBrains Mono (numbers, code)

### Headings
- **H1**: `clamp(2.25rem, 5vw, 3.75rem)` - 700 weight
- **H2**: `clamp(1.5rem, 3.5vw, 2.25rem)` - 600 weight
- **H3**: `clamp(1.25rem, 2.5vw, 1.5rem)` - 600 weight

---

## 📐 Design Principles

1. **TV Show Quality**: High energy, dramatic but performance-friendly
2. **Accessibility**: WCAG 2.1 AA compliance, 4.5:1 contrast minimum
3. **Responsive**: Fluid scaling for all screen sizes (640px - ∞)
4. **Consistent**: Unified component system, motion, and sound
5. **Modern**: Clean, minimal, professional

---

## 🔧 Technical Specs

### Icon Formats (PRD 17.3)
- **Windows**: ICO (multi-resolution)
- **macOS**: ICNS (512×512@2x, 256×256@2x, 128×128@2x, etc.)
- **Linux**: PNG (32×32, 128×128, 256×256, 512×512)
- **Web**: SVG (scalable), PNG fallbacks

### File Sizes
- SVG: < 5 KB (optimized)
- PNG: Use PNG-8 for simple graphics, PNG-24 for gradients
- ICO: 32×32 with 256 colors

---

## 📝 Usage Examples

### HTML
```html
<link rel="icon" type="image/svg+xml" href="/icon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
```

### Tauri
```json
{
  "bundle": {
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

---

## 🚀 PNG Conversion Instructions

### Online Tool (Recommended)
1. Visit https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Generate these sizes:
   - **16×16** → `favicon-16x16.png`
   - **32×32** → `favicon-32x32.png` AND `favicon.ico`
   - **180×180** → `apple-touch-icon.png`
   - **256×256** → `256x256.png` (optional, for Tauri)
   - **512×512** → `512x512.png` (optional, for Tauri)
4. Save all files to `public/` directory

### Command Line (Alternative)
```bash
# Using ImageMagick
convert public/icon.svg -resize 16x16 public/favicon-16x16.png
convert public/icon.svg -resize 32x32 public/favicon-32x32.png
convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
convert public/icon.svg -resize 256x256 src-tauri/icons/256x256.png
convert public/icon.svg -resize 512x512 src-tauri/icons/512x512.png

# ICO format
convert public/favicon-32x32.png public/favicon.ico
```

---

## ✅ Checklist

- [x] SVG icon designed (PRD compliant)
- [x] index.html updated (title, favicon links)
- [ ] PNG files generated (user task)
- [ ] favicon.ico created (user task)
- [ ] Tested in browser (user task)
- [ ] Tested in Tauri build (optional)

---

## 📚 References

- [PRD Section 17.2](../PRD.md#172-build-yapılandırması) - Build Configuration
- [PRD Section 17.3](../PRD.md#173-uygulama-i̇konları) - Application Icons
- [UI/UX Design Spec](../ui-ux-design.md) - Design System
- [Tauri Icon Guide](https://tauri.app/v1/guides/features/icons)

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**License**: MIT

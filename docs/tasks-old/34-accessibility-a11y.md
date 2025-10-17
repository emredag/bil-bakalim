# Task 34: Accessibility (A11y)

## Description
Implement accessibility features for keyboard navigation, screen readers, and WCAG compliance.

## Requirements from PRD
- **Section:** 8.6 Erişilebilirlik (A11y)

## Klavye Navigasyonu
- Tab ile tüm interaktif elemanlara erişim
- Enter/Space ile buton aktivasyonu
- Esc ile modal/dialog kapatma
- Focus indicator'lar (ring)

## Renk Kontrastı
- WCAG 2.1 Level AA uyumlu
- Metin/arkaplan kontrastı: minimum 4.5:1
- Durum renkleri: sadece renge bağımlı olmayan (ikon + renk)

## Ekran Okuyucu Desteği
- Semantik HTML (nav, main, article, vb.)
- ARIA etiketleri (aria-label, aria-describedby)
- Alt metinler (emoji için)
- Canlı bölgeler (aria-live) puan güncellemeleri için

## Metin Ölçeklendirme
- 200%'e kadar zoom desteklenir
- Tailwind responsive font boyutları

## Acceptance Criteria
- [ ] Tab navigation works for all interactive elements
- [ ] Tab order is logical
- [ ] Enter/Space activates buttons
- [ ] Esc closes modals/dialogs
- [ ] Focus rings visible and clear
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Status not conveyed by color alone
- [ ] Semantic HTML elements used
- [ ] ARIA labels on all interactive elements
- [ ] Alt text for emojis/icons
- [ ] aria-live regions for score updates
- [ ] 200% zoom supported without breaking layout
- [ ] Screen reader tested (basic functionality)

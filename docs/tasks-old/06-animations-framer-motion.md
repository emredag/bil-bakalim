# Task 06: Animations with Framer Motion

## Description
Implement all animations using Framer Motion for smooth and engaging user experience.

## Requirements from PRD
- **Section:** 8.4 Animasyonlar (Framer Motion)

## Page Transitions
- Fade in: `opacity: 0 → 1` (duration: 0.3s)
- Slide in: `x: 20 → 0` (duration: 0.3s, ease: easeOut)

## Letter Reveal (3D Flip)
- `rotateY: 0deg → 180deg` (duration: 0.6s)
- `scale: 1 → 1.1 → 1` (duration: 0.6s)
- Easing: spring animation

## Correct Answer
1. Tüm harfler yeşil glow (duration: 0.2s)
2. Scale pulse: `1 → 1.1 → 1` (3 kez)
3. Konfeti patlaması (canvas animasyonu)
4. Puan sayacı: Count-up animasyon

## Wrong Answer
- Shake animasyon: `x: 0 → -10 → 10 → 0` (duration: 0.3s)
- Kırmızı flash overlay (opacity pulse)

## Time Warning
- Son 30 saniye: Pulse animasyon (scale: 1 → 1.05)
- Son 10 saniye: Hızlı pulse + renk değişimi

## Card Hover
- Scale: `1 → 1.05` (duration: 0.2s)
- Shadow: `shadow-lg → shadow-2xl`
- Border glow efekti

## Loading States
- Skeleton loaders (Tailwind animate-pulse)
- Spinner (custom SVG animasyonu)

## Acceptance Criteria
- [ ] Framer Motion installed and configured
- [ ] Page transitions implemented
- [ ] 3D flip animation for letters
- [ ] Correct answer animation with confetti
- [ ] Wrong answer shake animation
- [ ] Time warning pulse animation
- [ ] Card hover effects
- [ ] Loading states
- [ ] All animations run at 60 FPS

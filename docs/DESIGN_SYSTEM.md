# Design System - Kelime Oyunu

**Version:** 2.0.0
**Status:** Foundation for UI/UX Redesign
**Last Updated:** 2025-11-20

---

## 📋 İçindekiler

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography System](#typography-system)
4. [Spacing System](#spacing-system)
5. [Component Library](#component-library)
6. [Animation System](#animation-system)
7. [Icon System](#icon-system)
8. [Illustration Guidelines](#illustration-guidelines)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)

---

## Design Philosophy

### Vision
**"Modern Playful Professional"** - Duolingo meets Linear meets Vercel

Eğitim odaklı ama sıkıcı değil, profesyonel ama soğuk değil, modern ama erişilebilir.

### Core Principles

**1. Clarity First**
- Her element net bir amaca hizmet eder
- Görsel hiyerarşi her zaman belirgindir
- Kullanıcı ne yapacağını her zaman bilir

**2. Delightful Interactions**
- Her tıklama, hover, transition bir mikro-sevinç verir
- Animasyonlar doğal ve anlamlıdır
- Feedback her zaman anlıktır

**3. Consistency is Key**
- Aynı problem her yerde aynı şekilde çözülür
- Component'ler her yerde aynı davranır
- Design language tüm ekranlarda tutarlıdır

**4. Performance Matters**
- Animasyonlar 60fps'de çalışır
- Layout shift'ler minimize edilir
- Loading states her zaman gösterilir

**5. Accessible by Default**
- WCAG 2.1 AA compliance
- Keyboard navigation her yerde
- Screen reader friendly
- High contrast support

---

## Color System

### Philosophy
Eski sistemin ağır, soğuk slate teması yerine **sıcak, canlı ama yine de sofistike** bir palet.

### Primary Palette

#### Neutral Colors (Background & Surfaces)
Soğuk slate yerine daha sıcak charcoal/warm gray tonları.

```css
/* Neutral Scale */
--neutral-50: #fafafa;   /* Çok açık gri - text on dark */
--neutral-100: #f5f5f5;  /* Açık gri - subtle backgrounds */
--neutral-200: #e5e5e5;  /* Border - light mode */
--neutral-300: #d4d4d4;  /* Border - hover states */
--neutral-400: #a3a3a3;  /* Tertiary text */
--neutral-500: #737373;  /* Secondary text */
--neutral-600: #525252;  /* Primary text (light mode) */
--neutral-700: #404040;  /* Elevated surface (dark) */
--neutral-800: #262626;  /* Surface (dark) */
--neutral-900: #171717;  /* Background (dark) */
--neutral-950: #0a0a0a;  /* Deep background (dark) */

/* Semantic Neutrals */
--bg-primary: var(--neutral-950);     /* Ana arkaplan */
--bg-secondary: var(--neutral-900);   /* İkincil arkaplan */
--bg-elevated: var(--neutral-800);    /* Yükseltilmiş yüzeyler (cards) */
--bg-hover: var(--neutral-700);       /* Hover states */

--text-primary: var(--neutral-50);    /* Ana metin */
--text-secondary: var(--neutral-400); /* İkincil metin */
--text-tertiary: var(--neutral-500);  /* Üçüncül metin */

--border-subtle: rgba(255, 255, 255, 0.08);  /* İnce kenarlıklar */
--border-default: rgba(255, 255, 255, 0.12); /* Normal kenarlıklar */
--border-strong: rgba(255, 255, 255, 0.18);  /* Güçlü kenarlıklar */
```

#### Brand Colors (Primary & Accent)
Muted blue yerine canlı, enerji veren renkler.

```css
/* Primary - Vibrant Blue/Purple */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-200: #bae6fd;
--primary-300: #7dd3fc;
--primary-400: #38bdf8;
--primary-500: #0ea5e9;   /* Main primary */
--primary-600: #0284c7;
--primary-700: #0369a1;
--primary-800: #075985;
--primary-900: #0c4a6e;

/* Accent - Warm Amber/Orange */
--accent-50: #fffbeb;
--accent-100: #fef3c7;
--accent-200: #fde68a;
--accent-300: #fcd34d;
--accent-400: #fbbf24;
--accent-500: #f59e0b;    /* Main accent */
--accent-600: #d97706;
--accent-700: #b45309;
--accent-800: #92400e;
--accent-900: #78350f;

/* Secondary - Purple (for variety) */
--secondary-50: #faf5ff;
--secondary-100: #f3e8ff;
--secondary-200: #e9d5ff;
--secondary-300: #d8b4fe;
--secondary-400: #c084fc;
--secondary-500: #a855f7;  /* Main secondary */
--secondary-600: #9333ea;
--secondary-700: #7e22ce;
--secondary-800: #6b21a8;
--secondary-900: #581c87;
```

#### Status Colors (Semantic)
Kullanıcıya anlamlı feedback veren renkler.

```css
/* Success - Vibrant Green */
--success-50: #f0fdf4;
--success-100: #dcfce7;
--success-200: #bbf7d0;
--success-300: #86efac;
--success-400: #4ade80;
--success-500: #22c55e;   /* Main success */
--success-600: #16a34a;
--success-700: #15803d;
--success-800: #166534;
--success-900: #14532d;

/* Error - Friendly Coral Red */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-200: #fecaca;
--error-300: #fca5a5;
--error-400: #f87171;
--error-500: #ef4444;     /* Main error */
--error-600: #dc2626;
--error-700: #b91c1c;
--error-800: #991b1b;
--error-900: #7f1d1d;

/* Warning - Bright Yellow */
--warning-50: #fefce8;
--warning-100: #fef9c3;
--warning-200: #fef08a;
--warning-300: #fde047;
--warning-400: #facc15;
--warning-500: #eab308;   /* Main warning */
--warning-600: #ca8a04;
--warning-700: #a16207;
--warning-800: #854d0e;
--warning-900: #713f12;

/* Info - Cool Cyan */
--info-50: #ecfeff;
--info-100: #cffafe;
--info-200: #a5f3fc;
--info-300: #67e8f9;
--info-400: #22d3ee;
--info-500: #06b6d4;      /* Main info */
--info-600: #0891b2;
--info-700: #0e7490;
--info-800: #155e75;
--info-900: #164e63;
```

#### Category Colors (Thematic)
Her kategori için unique color theme.

```css
/* Category color mapping */
--category-animals: #10b981;    /* Emerald - doğa */
--category-countries: #3b82f6;  /* Blue - dünya */
--category-food: #f59e0b;       /* Amber - sıcak */
--category-general: #8b5cf6;    /* Purple - çeşitli */
--category-custom-1: #ec4899;   /* Pink */
--category-custom-2: #14b8a6;   /* Teal */
--category-custom-3: #f97316;   /* Orange */
--category-custom-4: #06b6d4;   /* Cyan */
```

### Gradients

#### Background Gradients
```css
/* Main app background */
--gradient-bg-primary: linear-gradient(
  135deg,
  var(--neutral-950) 0%,
  var(--neutral-900) 50%,
  var(--neutral-950) 100%
);

/* Elevated surfaces */
--gradient-surface: linear-gradient(
  135deg,
  var(--neutral-800) 0%,
  var(--neutral-700) 100%
);

/* Hero sections */
--gradient-hero: linear-gradient(
  135deg,
  var(--primary-900) 0%,
  var(--secondary-900) 100%
);
```

#### Overlay Gradients
```css
/* Modal backdrop */
--gradient-overlay: linear-gradient(
  to bottom,
  rgba(10, 10, 10, 0.8),
  rgba(10, 10, 10, 0.9)
);

/* Card hover overlay */
--gradient-card-hover: linear-gradient(
  135deg,
  rgba(14, 165, 233, 0.05) 0%,
  rgba(168, 85, 247, 0.05) 100%
);
```

#### Mesh Gradients (For special elements)
```css
/* Animated background for celebrations */
--mesh-gradient-celebration:
  radial-gradient(at 40% 20%, var(--primary-500) 0px, transparent 50%),
  radial-gradient(at 80% 0%, var(--accent-500) 0px, transparent 50%),
  radial-gradient(at 0% 50%, var(--secondary-500) 0px, transparent 50%),
  radial-gradient(at 80% 50%, var(--primary-500) 0px, transparent 50%),
  radial-gradient(at 0% 100%, var(--accent-500) 0px, transparent 50%),
  radial-gradient(at 80% 100%, var(--secondary-500) 0px, transparent 50%);
```

### Shadow System

```css
/* Elevation shadows */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Glow effects (colored shadows) */
--glow-primary: 0 0 20px rgba(14, 165, 233, 0.4);
--glow-accent: 0 0 20px rgba(245, 158, 11, 0.4);
--glow-success: 0 0 20px rgba(34, 197, 94, 0.4);
--glow-error: 0 0 20px rgba(239, 68, 68, 0.4);

/* Inner shadows */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
```

---

## Typography System

### Font Stack

```css
/* Display - For hero sections, large headings */
--font-display: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont,
                'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                sans-serif;

/* Body - Primary text, UI elements */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Mono - Numbers, code, timer */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco',
             'Courier New', monospace;
```

### Type Scale

#### Display (Hero Headings)
```css
--text-display-2xl: 4.5rem;    /* 72px */
--text-display-xl: 3.75rem;    /* 60px */
--text-display-lg: 3rem;       /* 48px */
--text-display-md: 2.25rem;    /* 36px */
--text-display-sm: 1.875rem;   /* 30px */

/* Line heights for display */
--leading-display: 1.1;
```

#### Headings
```css
--text-h1: 2.25rem;    /* 36px */
--text-h2: 1.875rem;   /* 30px */
--text-h3: 1.5rem;     /* 24px */
--text-h4: 1.25rem;    /* 20px */
--text-h5: 1.125rem;   /* 18px */
--text-h6: 1rem;       /* 16px */

/* Line heights for headings */
--leading-heading: 1.25;
```

#### Body
```css
--text-body-xl: 1.25rem;   /* 20px */
--text-body-lg: 1.125rem;  /* 18px */
--text-body-base: 1rem;    /* 16px */
--text-body-sm: 0.875rem;  /* 14px */
--text-body-xs: 0.75rem;   /* 12px */

/* Line heights for body */
--leading-body-relaxed: 1.75;
--leading-body-normal: 1.5;
--leading-body-tight: 1.25;
```

#### UI (Buttons, Labels)
```css
--text-ui-lg: 1rem;        /* 16px */
--text-ui-base: 0.875rem;  /* 14px */
--text-ui-sm: 0.75rem;     /* 12px */
--text-ui-xs: 0.625rem;    /* 10px */

/* Line heights for UI */
--leading-ui: 1.5;
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0em;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### Usage Examples

```css
/* Hero Title */
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4.5rem); /* Responsive */
  font-weight: var(--font-extrabold);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-tight);
}

/* Section Heading */
.section-heading {
  font-family: var(--font-body);
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  line-height: var(--leading-heading);
  letter-spacing: var(--tracking-normal);
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-body-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-body-relaxed);
  letter-spacing: var(--tracking-normal);
}

/* Button Text */
.button-text {
  font-family: var(--font-body);
  font-size: var(--text-ui-base);
  font-weight: var(--font-semibold);
  line-height: var(--leading-ui);
  letter-spacing: var(--tracking-wide);
  text-transform: none; /* Lowercase button text is modern */
}

/* Score Display (Mono) */
.score-display {
  font-family: var(--font-mono);
  font-size: var(--text-display-md);
  font-weight: var(--font-bold);
  line-height: 1;
  letter-spacing: var(--tracking-tight);
  font-variant-numeric: tabular-nums; /* Aligned numbers */
}
```

---

## Spacing System

### Base Unit: 4px
Tüm spacing değerleri 4px'in katları olmalı (tutarlılık için).

### Spacing Scale

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
--spacing-40: 10rem;    /* 160px */
--spacing-48: 12rem;    /* 192px */
--spacing-64: 16rem;    /* 256px */
```

### Semantic Spacing

```css
/* Component spacing */
--space-component-xs: var(--spacing-2);   /* 8px */
--space-component-sm: var(--spacing-4);   /* 16px */
--space-component-md: var(--spacing-6);   /* 24px */
--space-component-lg: var(--spacing-8);   /* 32px */
--space-component-xl: var(--spacing-12);  /* 48px */

/* Section spacing */
--space-section-sm: var(--spacing-16);    /* 64px */
--space-section-md: var(--spacing-24);    /* 96px */
--space-section-lg: var(--spacing-32);    /* 128px */
--space-section-xl: var(--spacing-48);    /* 192px */

/* Container padding */
--container-padding-mobile: var(--spacing-4);   /* 16px */
--container-padding-tablet: var(--spacing-6);   /* 24px */
--container-padding-desktop: var(--spacing-8);  /* 32px */
--container-padding-wide: var(--spacing-12);    /* 48px */
```

### Layout Containers

```css
/* Max widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Safe areas (for TV/projection) */
--safe-area-sm: 5%;     /* Mobile */
--safe-area-md: 8%;     /* Tablet */
--safe-area-lg: 10%;    /* Desktop */
--safe-area-xl: 12%;    /* TV/Projection */
```

---

## Component Library

### Button Component

#### Variants
```typescript
type ButtonVariant =
  | 'primary'      // Main CTA
  | 'secondary'    // Secondary actions
  | 'tertiary'     // Subtle actions
  | 'ghost'        // Minimal style
  | 'link'         // Text link style
  | 'destructive'; // Dangerous actions
```

#### Sizes
```typescript
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

#### Specs

**Primary Button**
```css
.button-primary {
  /* Layout */
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: 0.75rem; /* 12px */

  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-ui-base);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);

  /* Colors */
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  box-shadow: var(--shadow-md);

  /* Hover */
  &:hover {
    background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    box-shadow: var(--shadow-lg), var(--glow-primary);
    transform: translateY(-2px);
  }

  /* Active */
  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  /* Focus */
  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  /* Disabled */
  &:disabled {
    background: var(--neutral-700);
    color: var(--neutral-500);
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  /* Loading */
  &.loading {
    position: relative;
    color: transparent;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      margin: auto;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Size Variations**
```css
.button-xs {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-ui-sm);
  border-radius: 0.5rem;
}

.button-sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-ui-sm);
  border-radius: 0.625rem;
}

.button-md {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--text-ui-base);
  border-radius: 0.75rem;
}

.button-lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--text-ui-lg);
  border-radius: 0.875rem;
}

.button-xl {
  padding: var(--spacing-5) var(--spacing-10);
  font-size: var(--text-body-lg);
  border-radius: 1rem;
}
```

### Card Component

#### Variants
```typescript
type CardVariant =
  | 'elevated'     // With shadow
  | 'outlined'     // With border
  | 'filled'       // Solid background
  | 'interactive'; // Hover effects
```

#### Specs

**Elevated Card (Default)**
```css
.card-elevated {
  /* Layout */
  border-radius: 1rem; /* 16px */
  padding: var(--spacing-6);

  /* Surface */
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);

  /* Hover (if interactive) */
  &.interactive {
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      background: var(--bg-hover);
      border-color: var(--border-default);
    }

    &:active {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }

  /* Focus */
  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
}
```

**Card Sections**
```css
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.card-title {
  font-size: var(--text-h4);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.card-description {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-1);
}

.card-body {
  /* Flexible content area */
}

.card-footer {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-subtle);
}
```

### Input Component

#### Specs

**Text Input**
```css
.input {
  /* Layout */
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: 0.75rem;

  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-body-base);
  font-weight: var(--font-normal);
  color: var(--text-primary);

  /* Surface */
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-sm);

  /* Transitions */
  transition: all 0.15s ease;

  /* Placeholder */
  &::placeholder {
    color: var(--text-tertiary);
  }

  /* Focus */
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: var(--shadow-md), 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  /* Error */
  &.error {
    border-color: var(--error-500);

    &:focus {
      box-shadow: var(--shadow-md), 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  /* Success */
  &.success {
    border-color: var(--success-500);

    &:focus {
      box-shadow: var(--shadow-md), 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
  }

  /* Disabled */
  &:disabled {
    background: var(--neutral-800);
    color: var(--text-tertiary);
    cursor: not-allowed;
    border-color: var(--border-subtle);
  }
}

/* Input with icon */
.input-wrapper {
  position: relative;

  .input-icon {
    position: absolute;
    left: var(--spacing-4);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
  }

  &.has-icon .input {
    padding-left: var(--spacing-10);
  }
}

/* Floating label */
.input-floating-label {
  position: relative;

  label {
    position: absolute;
    left: var(--spacing-4);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    font-size: var(--text-body-base);
    transition: all 0.2s ease;
    pointer-events: none;
    background: var(--bg-elevated);
    padding: 0 var(--spacing-1);
  }

  input:focus + label,
  input:not(:placeholder-shown) + label {
    top: 0;
    font-size: var(--text-body-sm);
    color: var(--primary-500);
  }
}
```

### Modal Component

#### Specs

**Glassmorphism Modal**
```css
.modal-backdrop {
  /* Overlay */
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Center modal */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);

  /* Animation */
  animation: fadeIn 0.2s ease;
}

.modal-content {
  /* Layout */
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 1.5rem;
  overflow: hidden;

  /* Glassmorphism */
  background: rgba(38, 38, 38, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-2xl);

  /* Animation */
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-subtle);
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  max-height: 60vh;
}

.modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

.modal-close {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}
```

### Badge Component

#### Specs
```css
.badge {
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: 0.375rem;

  /* Typography */
  font-size: var(--text-ui-xs);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;

  /* Default */
  background: var(--neutral-700);
  color: var(--text-primary);
}

/* Variants */
.badge-primary {
  background: rgba(14, 165, 233, 0.15);
  color: var(--primary-400);
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success-400);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-error {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error-400);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-warning {
  background: rgba(234, 179, 8, 0.15);
  color: var(--warning-400);
  border: 1px solid rgba(234, 179, 8, 0.3);
}
```

### Table Component

#### Specs
```css
.table-container {
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}

.table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: var(--bg-hover);
    border-bottom: 1px solid var(--border-default);
  }

  th {
    padding: var(--spacing-3) var(--spacing-4);
    text-align: left;
    font-size: var(--text-ui-sm);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  tbody tr {
    border-bottom: 1px solid var(--border-subtle);
    transition: background-color 0.15s ease;

    &:hover {
      background: var(--bg-hover);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: var(--spacing-4);
    font-size: var(--text-body-base);
    color: var(--text-primary);
  }
}

/* Sortable header */
.table-sortable-header {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  &:hover {
    color: var(--text-primary);
  }

  .sort-icon {
    opacity: 0.3;
    transition: opacity 0.15s ease;
  }

  &.active .sort-icon {
    opacity: 1;
    color: var(--primary-500);
  }
}
```

### Toast Component

#### Specs
```css
.toast {
  /* Layout */
  min-width: 320px;
  max-width: 480px;
  padding: var(--spacing-4);
  border-radius: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);

  /* Surface */
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-xl);

  /* Animation */
  animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: var(--text-body-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}

.toast-description {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
}

/* Variants */
.toast-success {
  border-left: 3px solid var(--success-500);

  .toast-icon {
    color: var(--success-500);
  }
}

.toast-error {
  border-left: 3px solid var(--error-500);

  .toast-icon {
    color: var(--error-500);
  }
}

.toast-warning {
  border-left: 3px solid var(--warning-500);

  .toast-icon {
    color: var(--warning-500);
  }
}

.toast-info {
  border-left: 3px solid var(--info-500);

  .toast-icon {
    color: var(--info-500);
  }
}
```

---

## Animation System

### Philosophy
Animasyonlar **doğal, anlamlı ve performant** olmalı. Spring physics kullanarak mekanik değil, organik hissetmeli.

### Timing Functions

```css
/* Easing curves */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);      /* Standard */
--ease-out: cubic-bezier(0, 0, 0.2, 1);           /* Decelerate */
--ease-in: cubic-bezier(0.4, 0, 1, 1);            /* Accelerate */
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);       /* Quick response */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Overshoot */

/* Spring physics (for Framer Motion) */
--spring-default: { type: 'spring', stiffness: 300, damping: 30 };
--spring-gentle: { type: 'spring', stiffness: 200, damping: 25 };
--spring-wobbly: { type: 'spring', stiffness: 180, damping: 12 };
--spring-stiff: { type: 'spring', stiffness: 400, damping: 40 };
--spring-slow: { type: 'spring', stiffness: 100, damping: 20 };
```

### Duration Scale

```css
--duration-instant: 100ms;   /* Micro-interactions */
--duration-fast: 150ms;      /* Hover states */
--duration-normal: 250ms;    /* Default transitions */
--duration-slow: 350ms;      /* Complex animations */
--duration-slower: 500ms;    /* Page transitions */
--duration-slowest: 700ms;   /* Special effects */
```

### Animation Patterns

#### Page Transitions
```typescript
// Framer Motion variants
const pageTransition = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};
```

#### Stagger Animation
```typescript
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};
```

#### Hover Lift
```typescript
const hoverLift = {
  rest: {
    y: 0,
    scale: 1
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    y: -2,
    scale: 0.98
  }
};
```

#### Scale Pulse (Success feedback)
```typescript
const scalePulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.3,
    times: [0, 0.5, 1],
    ease: 'easeOut'
  }
};
```

#### Shimmer Loading
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-800) 0%,
    var(--neutral-700) 50%,
    var(--neutral-800) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}
```

#### Confetti Celebration
```typescript
const confettiConfig = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: [
    '#0ea5e9',  // primary
    '#f59e0b',  // accent
    '#a855f7',  // secondary
    '#22c55e',  // success
    '#ec4899'   // pink
  ],
  ticks: 200,
  gravity: 1,
  decay: 0.94,
  startVelocity: 30
};
```

### Performance Guidelines

1. **Use GPU-accelerated properties only**
   - ✅ `transform`, `opacity`, `filter`
   - ❌ `top`, `left`, `width`, `height`, `margin`, `padding`

2. **Avoid layout thrashing**
   - Batch DOM reads and writes
   - Use `requestAnimationFrame` for smooth updates

3. **Respect reduced motion preference**
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

4. **Optimize animation complexity**
   - Limit concurrent animations
   - Use `will-change` sparingly
   - Remove `will-change` after animation

---

## Icon System

### Library: Lucide React
Already in use, great choice. Consistent, customizable, tree-shakeable.

### Sizing Scale
```css
--icon-xs: 14px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
--icon-2xl: 40px;
--icon-3xl: 48px;
```

### Usage Guidelines

**Inline with text**
```tsx
<span className="inline-flex items-center gap-2">
  <Icon size={16} />
  <span>Button Text</span>
</span>
```

**Icon-only buttons**
```tsx
<button className="icon-button" aria-label="Close">
  <Icon size={20} />
</button>
```

**Custom category icons** (when needed)
```tsx
// Use Lucide icons mapped to categories
const categoryIcons = {
  animals: <PawPrint />,
  countries: <Globe />,
  food: <Pizza />,
  general: <BookOpen />
};
```

---

## Illustration Guidelines

### Currently Missing - To Be Added

**Illustration Style:**
- **Type:** Flat/geometric with subtle gradients
- **Inspiration:** Undraw, Blush, Humaaans
- **Colors:** Match design system palette
- **Usage:** Empty states, errors, onboarding

**Needed Illustrations:**
1. Empty state (no data)
2. Error state (404, 500)
3. Success state (celebration)
4. Onboarding welcome
5. Tutorial steps
6. Category placeholders

**Implementation:**
- SVG format for scalability
- Inline or imported as components
- Consistent stroke width (2px)
- Use design system colors

---

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Mobile landscape, small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops, desktop */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop, TV */
```

### Container Queries (Modern approach)
```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

### Touch Targets
```css
/* Minimum touch target size */
--touch-target-min: 44px;  /* iOS guideline */
--touch-target-comfortable: 48px;

/* Apply to interactive elements */
button, a, input[type="checkbox"], input[type="radio"] {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
}
```

### Responsive Typography
```css
/* Fluid typography using clamp */
.hero-title {
  font-size: clamp(2.25rem, 5vw, 4.5rem);
}

.section-heading {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.body-text {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast**
- Text vs background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

**Focus Indicators**
```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: inherit;
}

/* Never remove focus outline without replacement */
:focus:not(:focus-visible) {
  outline: none;
}
```

**Keyboard Navigation**
- All interactive elements must be keyboard accessible
- Logical tab order (no positive tabindex)
- Skip links for navigation
- Keyboard shortcuts visible in UI

**Screen Reader Support**
```tsx
// Use semantic HTML
<nav aria-label="Main navigation">
  <button aria-label="Close modal" aria-pressed="false">
    <Icon aria-hidden="true" />
  </button>
</nav>

// Live regions for dynamic content
<div role="status" aria-live="polite" aria-atomic="true">
  Score updated: 7500 points
</div>
```

**Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Semantic HTML**
- Use `<button>` for actions, `<a>` for navigation
- Use `<section>`, `<article>`, `<aside>`, `<nav>`
- Headings in logical order (h1 → h2 → h3)
- Forms with proper labels and fieldsets

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create CSS custom properties file
- [ ] Configure Tailwind with design tokens
- [ ] Set up Framer Motion spring configurations
- [ ] Import and configure fonts
- [ ] Create base component CSS classes

### Phase 2: Core Components
- [ ] Button component with all variants
- [ ] Input/Textarea components
- [ ] Card component
- [ ] Modal/Dialog component
- [ ] Badge component
- [ ] Toast notification system

### Phase 3: Composite Components
- [ ] Form components
- [ ] Table component
- [ ] Navigation components
- [ ] Data display components
- [ ] Loading states (skeleton, shimmer)

### Phase 4: Animations
- [ ] Page transition system
- [ ] Stagger animation utilities
- [ ] Micro-interaction library
- [ ] Celebration animations
- [ ] Reduced motion support

### Phase 5: Testing
- [ ] Accessibility audit (axe-core)
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Color contrast validation
- [ ] Performance testing (60fps)

---

## Maintenance & Evolution

### Versioning
Design system follows semantic versioning:
- Major: Breaking changes to components
- Minor: New components or non-breaking enhancements
- Patch: Bug fixes and small tweaks

### Documentation Updates
Update this document when:
- New components are added
- Color palette changes
- Typography scale changes
- New animation patterns emerge
- Accessibility guidelines update

### Design Tokens
All design decisions are tokenized for:
- Easy theme switching
- Consistent updates across app
- Scalability and maintenance

---

**Last Updated:** 2025-11-20
**Next Review:** After Phase 1 implementation

---

Bu design system tüm migration dokümanlarının temeli olacak. Her sayfa redesign'ında bu sistemden referans alınacak.
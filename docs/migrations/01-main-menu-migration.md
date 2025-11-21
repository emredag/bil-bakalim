# Main Menu Screen - UI/UX Migration

**Priority:** 1 (Critical Path)
**Component:** `src/components/screens/MainMenuScreen.tsx`
**Status:** Redesign Required
**Complexity:** Medium

---

## 📊 Current State Analysis

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ Particle Background (animated)              │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │        🎯 Kelime Oyunu              │   │
│  │  Eğlenceli Kelime Tahmin Yarışması │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ 🏁   │ │ 📚   │ │ 📊   │               │
│  │Yarışma│ │Kategori│ │Geçmiş │               │
│  │Başlat│ │Yönetim│ │Yarışma│               │
│  └──────┘ └──────┘ └──────┘               │
│                                             │
│  ┌──────┐ ┌──────┐                         │
│  │ ⚙️   │ │ ℹ️    │                         │
│  │Ayarlar│ │Nasıl │                         │
│  │      │ │Oynanır│                         │
│  └──────┘ └──────┘                         │
│                                             │
│  v1.0.0 • MIT License                       │
│  GitHub'da Görüntüle →                      │
└─────────────────────────────────────────────┘
```

### Current Component Hierarchy
```
MainMenuScreen
├── ParticleBackground (animated particles)
├── motion.header (hero section)
│   ├── h1 (title with emoji)
│   └── p (description)
├── motion.main (action cards container)
│   └── grid (12-column system)
│       └── ActionCard × 5
│           └── Card (ui component)
│               ├── emoji (large icon)
│               ├── h2 (title)
│               └── p (description)
└── motion.footer (version + github link)
```

### Current Styling
```tsx
// Background
className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"

// Hero Title
fontSize: 'clamp(3rem, 7vw, 5.5rem)'
className="font-extrabold text-white drop-shadow-2xl"

// Description
fontSize: 'clamp(1.125rem, 2.5vw, 2rem)'
className="text-slate-200 font-medium drop-shadow-lg"

// Grid
className="grid grid-cols-12 gap-6 md:gap-12 lg:gap-20 xl:gap-24"

// Card (ActionCard → Card)
className="bg-slate-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-xl border border-slate-700"

// Card hover
scale: 1 → 1.05
shadow: shadow-xl → shadow-2xl
```

### Current Animations
```typescript
// Header animation
initial={{ opacity: 0, y: -30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}

// Stagger container
staggerChildren: 0.1
delayChildren: 0.2

// Card animation
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}

// Footer animation
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 1, duration: 0.5 }}
```

---

## ❌ Design Problems Identified

### 1. Visual Hierarchy Issues
- **Problem:** All 5 cards look identical - no visual distinction between primary action (Start Game) and secondary actions (Settings, Help)
- **Impact:** User doesn't know where to focus first
- **Priority:** High

### 2. Outdated Background
- **Problem:** Particle background feels dated (2015-era "constellation" effect)
- **Impact:** Makes app look old, distracts from content
- **Priority:** High

### 3. Boring Card Design
- **Problem:** Cards are too similar, rely only on emojis for differentiation
- **Impact:** No visual interest, forgettable design
- **Priority:** High

### 4. Heavy Color Scheme
- **Problem:** Cold, dark slate colors (slate-900, slate-800) create oppressive feel
- **Impact:** Visually exhausting, lacks energy
- **Priority:** Medium

### 5. No Contextual Information
- **Problem:** Cards show only title and description - no stats, recent activity, quick actions
- **Impact:** Missed opportunity for engagement, feels static
- **Priority:** Medium

### 6. Static Layout
- **Problem:** Grid is predictable, no visual rhythm or flow
- **Impact:** Boring, generic dashboard feel
- **Priority:** Low

### 7. Generic Footer
- **Problem:** Footer feels like an afterthought, GitHub link not compelling
- **Impact:** Wasted space, no branding
- **Priority:** Low

---

## ✨ New Design Vision

### Design Direction
**"Hero-First Dashboard"** - Emphasize primary action, add contextual richness, create visual hierarchy

**Inspiration:**
- **Duolingo:** Hero CTA, engaging stats, playful design
- **Linear:** Clean cards, subtle shadows, modern spacing
- **Vercel:** Gradient accents, glassmorphism, depth

### Key Improvements
1. **Hero CTA** - Prominent "Start New Game" button
2. **Quick Stats Dashboard** - Recent activity, total games, high score
3. **Visual Hierarchy** - Primary vs secondary actions clearly distinguished
4. **Modern Background** - Mesh gradients, subtle ambient effects
5. **Rich Cards** - Icons, stats, contextual info, quick actions
6. **Dynamic Content** - Show recent games, recommendations

---

## 🎨 Visual Specifications

### New Layout Structure
```
┌─────────────────────────────────────────────────────┐
│ Mesh Gradient Background (subtle, modern)           │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │          🎯 Kelime Oyunu                      │  │
│  │   Eğlenceli Kelime Tahmin Yarışması          │  │
│  │                                               │  │
│  │   [🚀 Yeni Yarışma Başlat] ← HERO CTA       │  │
│  │   veya son oyununa devam et                   │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Quick Stats Dashboard (3 cards)              │  │
│  │ [📊 127 Oyun] [🏆 High Score] [⏱️ Play Time] │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Recent Activity                                     │
│  ┌─────────────────────────────────────┐           │
│  │ 🐾 Hayvanlar • 2 hours ago          │           │
│  │ Ali won with 8,500 points            │           │
│  │ [View Details] [Play Again]          │           │
│  └─────────────────────────────────────┘           │
│                                                      │
│  Quick Actions                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │📚 Manage│ │📊 History │ │⚙️ Settings│ │ℹ️ Help│    │
│  └────────┘ └────────┘ └────────┘ └────────┘      │
│                                                      │
│  Footer with branding                                │
└─────────────────────────────────────────────────────┘
```

### Color Palette (from Design System)
```css
/* Background */
--bg-primary: #0a0a0a (neutral-950)
--bg-secondary: #171717 (neutral-900)
--bg-elevated: #262626 (neutral-800)

/* Accent Colors */
--primary: #0ea5e9 (blue-500)
--accent: #f59e0b (amber-500)
--secondary: #a855f7 (purple-500)

/* Gradients */
--gradient-hero: linear-gradient(135deg, #0c4a6e 0%, #581c87 100%)
--gradient-mesh: radial-gradient(at 40% 20%, #0ea5e9 0px, transparent 50%),
                radial-gradient(at 80% 0%, #f59e0b 0px, transparent 50%),
                radial-gradient(at 0% 100%, #a855f7 0px, transparent 50%)

/* Surface Colors */
--surface-primary: rgba(38, 38, 38, 0.9) with glassmorphism
--surface-hover: rgba(64, 64, 64, 1)
```

### Typography
```css
/* Hero Title */
font-family: 'Plus Jakarta Sans', sans-serif
font-size: clamp(2.5rem, 6vw, 4rem)
font-weight: 800 (extrabold)
line-height: 1.1
letter-spacing: -0.025em (tracking-tight)
color: white

/* Hero Description */
font-family: 'Inter', sans-serif
font-size: clamp(1rem, 2vw, 1.5rem)
font-weight: 500 (medium)
line-height: 1.5
color: rgba(255, 255, 255, 0.8)

/* Section Headings */
font-size: 1.5rem (text-2xl)
font-weight: 700 (bold)
color: white

/* Card Titles */
font-size: 1.125rem (text-lg)
font-weight: 600 (semibold)
color: white

/* Card Descriptions */
font-size: 0.875rem (text-sm)
font-weight: 400 (normal)
color: rgba(255, 255, 255, 0.6)
```

### Spacing
```css
/* Container padding */
padding: clamp(1rem, 5vw, 3rem) /* Responsive safe area */

/* Section gaps */
gap: 3rem (48px) /* Between hero, stats, recent, actions */

/* Card gaps */
gap: 1.5rem (24px) /* Between cards in grid */

/* Internal card padding */
padding: 1.5rem (24px)
```

---

## 🧩 Component Breakdown

### 1. Hero Section (New)

**Purpose:** Welcome user, show primary CTA

**Component:** `<HeroSection>`

**Structure:**
```tsx
<section className="hero-section">
  <motion.div>
    <h1>🎯 Kelime Oyunu</h1>
    <p>Eğlenceli Kelime Tahmin Yarışması</p>
    <Button variant="primary" size="xl">
      🚀 Yeni Yarışma Başlat
    </Button>
    {lastGame && (
      <p className="text-sm">
        veya <Link>son oyununa devam et</Link>
      </p>
    )}
  </motion.div>
</section>
```

**Styling:**
```css
.hero-section {
  /* Layout */
  text-align: center;
  padding: 4rem 2rem;

  /* Background */
  background: var(--gradient-hero);
  border-radius: 2rem;
  overflow: hidden;
  position: relative;

  /* Glow effect */
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.2);

  /* Mesh gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-mesh);
    opacity: 0.15;
    pointer-events: none;
  }
}
```

**Animation:**
```typescript
const heroVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.1
    }
  }
};
```

---

### 2. Quick Stats Dashboard (New)

**Purpose:** Show overview stats at a glance

**Component:** `<QuickStats>`

**Structure:**
```tsx
<section className="quick-stats">
  <motion.div className="stats-grid">
    <StatCard
      icon={BarChart3}
      label="Total Games"
      value={stats.totalGames}
      trend="+12 this week"
    />
    <StatCard
      icon={Trophy}
      label="High Score"
      value={stats.highScore}
      subtitle="Ali • 15.10.2025"
    />
    <StatCard
      icon={Clock}
      label="Play Time"
      value={formatTime(stats.totalTime)}
      subtitle="across all games"
    />
  </motion.div>
</section>
```

**Styling:**
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  /* Glassmorphism */
  background: rgba(38, 38, 38, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;

  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* Hover */
  transition: all 0.2s ease;
  &:hover {
    background: rgba(64, 64, 64, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-400);
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Animation:**
```typescript
const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const statCardVariants = {
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

---

### 3. Recent Activity (New)

**Purpose:** Show last played game, quick replay option

**Component:** `<RecentActivity>`

**Structure:**
```tsx
<section className="recent-activity">
  <h2>Recent Activity</h2>
  {lastGame ? (
    <motion.div className="activity-card">
      <div className="activity-header">
        <span className="category-badge">
          {lastGame.categoryEmoji} {lastGame.categoryName}
        </span>
        <span className="timestamp">
          {formatRelativeTime(lastGame.playedAt)}
        </span>
      </div>
      <div className="activity-body">
        <p className="activity-result">
          🏆 {lastGame.winner} won with {lastGame.score} points
        </p>
        {lastGame.mode === 'multi' && (
          <p className="activity-details">
            {lastGame.participantCount} players
          </p>
        )}
      </div>
      <div className="activity-footer">
        <Button variant="secondary" size="sm">
          View Details
        </Button>
        <Button variant="primary" size="sm">
          Play Again
        </Button>
      </div>
    </motion.div>
  ) : (
    <div className="empty-state">
      <p>No games played yet. Start your first game!</p>
    </div>
  )}
</section>
```

**Styling:**
```css
.activity-card {
  /* Elevated card */
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Hover */
  transition: all 0.2s ease;
  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-400);
}
```

---

### 4. Quick Actions Grid (Updated)

**Purpose:** Secondary navigation

**Component:** `<QuickActions>` (formerly main cards)

**Structure:**
```tsx
<section className="quick-actions">
  <h2>Quick Actions</h2>
  <motion.div className="actions-grid">
    <ActionCard
      icon={BookOpen}
      title="Manage Categories"
      description="Create and edit categories"
      onClick={() => navigate('/category-management')}
      variant="secondary"
    />
    <ActionCard
      icon={History}
      title="View History"
      description="Past games and stats"
      onClick={() => navigate('/history')}
      variant="secondary"
    />
    <ActionCard
      icon={Settings}
      title="Settings"
      description="App configuration"
      onClick={() => navigate('/settings')}
      variant="secondary"
    />
    <ActionCard
      icon={Info}
      title="How to Play"
      description="Learn the rules"
      onClick={() => navigate('/how-to-play')}
      variant="secondary"
    />
  </motion.div>
</section>
```

**Styling:**
```css
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

/* Compact card for secondary actions */
.action-card-secondary {
  /* Glassmorphism subtle */
  background: rgba(38, 38, 38, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  padding: 1.25rem;

  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  min-height: 140px;

  /* Hover */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(64, 64, 64, 0.6);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
}

.action-card-icon {
  /* Lucide icon, not emoji */
  width: 32px;
  height: 32px;
  color: var(--primary-400);
  opacity: 0.8;
  transition: all 0.2s ease;

  .action-card-secondary:hover & {
    opacity: 1;
    transform: scale(1.1);
  }
}

.action-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.action-card-description {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
```

---

### 5. Background (Updated)

**Remove:** `<ParticleBackground>` component
**Replace:** Mesh gradient with subtle glow

**Implementation:**
```css
.main-menu-background {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  z-index: -1;

  /* Mesh gradient overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-mesh);
    opacity: 0.08;
    filter: blur(80px);
    animation: meshFloat 20s ease-in-out infinite;
  }
}

@keyframes meshFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-20px, 20px) scale(1.1);
  }
}
```

---

## 📝 Implementation Steps

### Phase 1: Cleanup (Remove old patterns)
1. **Remove ParticleBackground**
   ```diff
   - import { ParticleBackground } from '../ParticleBackground';
   - <ParticleBackground />
   ```

2. **Replace gradient background**
   ```diff
   - className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
   + className="main-menu-background"
   ```

3. **Update import for Design System colors**
   ```tsx
   import '../styles/design-system.css'; // New CSS custom properties
   ```

---

### Phase 2: Create New Components

**File:** `src/components/main-menu/HeroSection.tsx`
```tsx
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';

export function HeroSection({ onStartGame, lastGame }) {
  return (
    <motion.section
      className="hero-section"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-content">
        <h1>🎯 Kelime Oyunu</h1>
        <p>Eğlenceli Kelime Tahmin Yarışması</p>
        <Button
          variant="primary"
          size="xl"
          onClick={onStartGame}
          icon={<Sparkles />}
        >
          Yeni Yarışma Başlat
        </Button>
        {lastGame && (
          <p className="hero-subtitle">
            veya{' '}
            <button
              className="hero-link"
              onClick={() => resumeGame(lastGame.id)}
            >
              son oyununa devam et
            </button>
          </p>
        )}
      </div>
    </motion.section>
  );
}
```

**File:** `src/components/main-menu/QuickStats.tsx`
```tsx
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Clock } from 'lucide-react';
import { useGameHistory } from '../../hooks/useGameHistory';

export function QuickStats() {
  const { stats } = useGameHistory();

  return (
    <section className="quick-stats">
      <motion.div
        className="stats-grid"
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          icon={BarChart3}
          label="Toplam Oyun"
          value={stats.totalGames}
          trend={`+${stats.recentGames} bu hafta`}
        />
        <StatCard
          icon={Trophy}
          label="En Yüksek Skor"
          value={stats.highScore.score}
          subtitle={`${stats.highScore.player} • ${formatDate(stats.highScore.date)}`}
        />
        <StatCard
          icon={Clock}
          label="Toplam Süre"
          value={formatDuration(stats.totalTime)}
          subtitle="tüm oyunlar"
        />
      </motion.div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, subtitle, trend }) {
  return (
    <motion.div className="stat-card" variants={statCardVariants}>
      <Icon className="stat-icon" size={24} />
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      {trend && <div className="stat-trend">{trend}</div>}
    </motion.div>
  );
}
```

**File:** `src/components/main-menu/RecentActivity.tsx`
```tsx
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useGameHistory } from '../../hooks/useGameHistory';
import { formatRelativeTime } from '../../utils/time';

export function RecentActivity() {
  const { lastGame } = useGameHistory();

  if (!lastGame) {
    return (
      <section className="recent-activity">
        <h2>Son Aktivite</h2>
        <div className="empty-state">
          <p>Henüz oyun oynamadınız. İlk oyununuzu başlatın!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-activity">
      <h2>Son Aktivite</h2>
      <motion.div
        className="activity-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="activity-header">
          <span className="category-badge">
            {lastGame.categoryEmoji} {lastGame.categoryName}
          </span>
          <span className="timestamp">
            {formatRelativeTime(lastGame.playedAt)}
          </span>
        </div>
        <div className="activity-body">
          <p className="activity-result">
            🏆 {lastGame.winner.name} kazandı - {lastGame.winner.score} puan
          </p>
          {lastGame.mode !== 'single' && (
            <p className="activity-details">
              {lastGame.participantCount} oyuncu
            </p>
          )}
        </div>
        <div className="activity-footer">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/history/${lastGame.id}`)}
          >
            Detayları Gör
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => replayGame(lastGame)}
          >
            Tekrar Oyna
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
```

**File:** `src/components/main-menu/QuickActions.tsx`
```tsx
import { motion } from 'framer-motion';
import { BookOpen, History, Settings, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: BookOpen,
      title: 'Kategori Yönetimi',
      description: 'Kategorileri düzenle',
      onClick: () => navigate('/category-management'),
    },
    {
      icon: History,
      title: 'Geçmiş Yarışmalar',
      description: 'Önceki oyunları gör',
      onClick: () => navigate('/history'),
    },
    {
      icon: Settings,
      title: 'Ayarlar',
      description: 'Uygulamayı yapılandır',
      onClick: () => navigate('/settings'),
    },
    {
      icon: Info,
      title: 'Nasıl Oynanır?',
      description: 'Kuralları öğren',
      onClick: () => navigate('/how-to-play'),
    },
  ];

  return (
    <section className="quick-actions">
      <h2>Hızlı Erişim</h2>
      <motion.div
        className="actions-grid"
        variants={actionsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {actions.map((action, index) => (
          <motion.button
            key={index}
            className="action-card-secondary"
            variants={actionCardVariants}
            onClick={action.onClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <action.icon className="action-card-icon" size={32} />
            <div className="action-card-title">{action.title}</div>
            <div className="action-card-description">{action.description}</div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
```

---

### Phase 3: Update MainMenuScreen

**File:** `src/components/screens/MainMenuScreen.tsx`
```tsx
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../main-menu/HeroSection';
import { QuickStats } from '../main-menu/QuickStats';
import { RecentActivity } from '../main-menu/RecentActivity';
import { QuickActions } from '../main-menu/QuickActions';
import { useKeyboardShortcuts } from '../../hooks';
import './MainMenuScreen.css'; // New styles

export function MainMenuScreen() {
  const navigate = useNavigate();

  // Global keyboard shortcuts
  useKeyboardShortcuts();

  const handleStartGame = () => {
    navigate('/category-select');
  };

  return (
    <div className="main-menu-screen">
      {/* Mesh gradient background */}
      <div className="main-menu-background" />

      <div className="main-menu-container">
        {/* Hero Section with primary CTA */}
        <HeroSection onStartGame={handleStartGame} />

        {/* Quick Stats Dashboard */}
        <QuickStats />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Actions Grid */}
        <QuickActions />

        {/* Footer */}
        <footer className="main-menu-footer">
          <p>v1.0.0 • MIT License • Emre Dağ</p>
          <a
            href="https://github.com/emredag/word-game-app"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub'da Görüntüle →
          </a>
        </footer>
      </div>
    </div>
  );
}
```

---

### Phase 4: Create CSS Styles

**File:** `src/components/screens/MainMenuScreen.css`
```css
.main-menu-screen {
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
}

.main-menu-background {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  z-index: -1;
}

.main-menu-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(at 40% 20%, var(--primary-500) 0px, transparent 50%),
              radial-gradient(at 80% 0%, var(--accent-500) 0px, transparent 50%),
              radial-gradient(at 0% 100%, var(--secondary-500) 0px, transparent 50%);
  opacity: 0.08;
  filter: blur(80px);
  animation: meshFloat 20s ease-in-out infinite;
}

@keyframes meshFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-20px, 20px) scale(1.1);
  }
}

.main-menu-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(1rem, 5vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 3rem;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary-900) 0%, var(--secondary-900) 100%);
  border-radius: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.2);
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(at 40% 20%, var(--primary-500) 0px, transparent 50%),
              radial-gradient(at 80% 0%, var(--accent-500) 0px, transparent 50%);
  opacity: 0.15;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero-section h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: white;
  margin: 0;
}

.hero-section p {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.hero-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.hero-link {
  background: none;
  border: none;
  color: var(--accent-400);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.hero-link:hover {
  color: var(--accent-300);
}

/* Quick Stats */
.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quick-stats h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(38, 38, 38, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(64, 64, 64, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  color: var(--primary-400);
  opacity: 0.8;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-400);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-subtitle {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.stat-trend {
  font-size: 0.75rem;
  color: var(--success-400);
  font-weight: 600;
}

/* Recent Activity */
.recent-activity {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recent-activity h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.activity-card {
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s ease;
}

.activity-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-400);
}

.timestamp {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.activity-result {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.activity-details {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.activity-footer {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  color: var(--text-tertiary);
  background: rgba(38, 38, 38, 0.4);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quick-actions h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.action-card-secondary {
  background: rgba(38, 38, 38, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  min-height: 140px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card-secondary:hover {
  background: rgba(64, 64, 64, 0.6);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.action-card-icon {
  color: var(--primary-400);
  opacity: 0.8;
  transition: all 0.2s ease;
}

.action-card-secondary:hover .action-card-icon {
  opacity: 1;
  transform: scale(1.1);
}

.action-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.action-card-description {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* Footer */
.main-menu-footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-400);
  text-decoration: none;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--accent-300);
}

/* Responsive */
@media (max-width: 768px) {
  .main-menu-container {
    gap: 2rem;
  }

  .hero-section {
    padding: 3rem 1.5rem;
  }

  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .activity-footer {
    flex-direction: column;
  }

  .activity-footer button {
    width: 100%;
  }
}
```

---

## ⚡ Technical Notes

### Logic Preservation
- **Navigation:** Tüm route'lar aynı kalacak (ROUTES constants)
- **Keyboard shortcuts:** useKeyboardShortcuts hook korunacak
- **Accessibility:** ARIA labels, keyboard navigation korunacak

### New Hooks Needed
```tsx
// src/hooks/useGameHistory.ts
export function useGameHistory() {
  const [stats, setStats] = useState(null);
  const [lastGame, setLastGame] = useState(null);

  useEffect(() => {
    // Fetch stats from Tauri
    invoke('get_game_history_stats').then(setStats);
    invoke('get_all_game_history', { limit: 1 }).then(games => {
      if (games.length > 0) setLastGame(games[0]);
    });
  }, []);

  return { stats, lastGame };
}
```

### Performance
- React.memo for stat cards
- Virtual scrolling for activity feed (if many games)
- Lazy loading for quick actions

---

## 🎬 Animation Specs

### Page Entry
```typescript
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};
```

### Hero Animation
```typescript
const heroVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.1
    }
  }
};
```

### Stagger Animations
```typescript
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
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

---

## 📱 Responsive Behavior

### Mobile (<768px)
- Single column layout for all grids
- Hero button full width
- Stats cards stack vertically
- Quick actions 2 columns
- Reduced padding

### Tablet (768px-1024px)
- Stats grid: 2 columns
- Actions grid: 2 columns
- Hero section responsive padding

### Desktop (>1024px)
- Stats grid: 3 columns
- Actions grid: 4 columns
- Max container width: 1400px
- Generous spacing

---

## ♿ Accessibility Notes

### WCAG 2.1 AA Compliance
- Color contrast ≥ 4.5:1 (text)
- Color contrast ≥ 3:1 (UI components)
- Focus indicators visible
- Keyboard navigation preserved
- ARIA labels for screen readers

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals (if any)
- Shortcuts preserved from useKeyboardShortcuts

### Screen Reader Support
```tsx
<section aria-label="Quick statistics">
  <h2>Quick Stats</h2>
  {/* ... */}
</section>

<button aria-label="Start new game">
  Yeni Yarışma Başlat
</button>
```

---

## 📊 Before/After Comparison

### Before
- ❌ Particle background (dated, distracting)
- ❌ All cards identical (no hierarchy)
- ❌ No contextual info (static)
- ❌ Cold slate colors (uninviting)
- ❌ Generic card grid (boring)

### After
- ✅ Modern mesh gradients (subtle, sophisticated)
- ✅ Clear visual hierarchy (hero CTA, stats, recent, actions)
- ✅ Rich contextual info (stats, last game, quick actions)
- ✅ Warm accent colors (inviting, energetic)
- ✅ Dashboard layout (engaging, informative)

---

## 🎯 Success Metrics

### Visual Impact
- First impression improved (hero section with clear CTA)
- Visual hierarchy clear (primary vs secondary actions)
- Modern aesthetic achieved (glassmorphism, mesh gradients)

### User Engagement
- Quick stats provide overview at a glance
- Recent activity encourages replay
- Reduced clicks to start game (hero CTA)

### Performance
- No performance degradation (removed particle background)
- Smooth animations (GPU-accelerated transforms)
- Fast page load (optimized components)

---

**Implementation Time Estimate:** 6-8 hours
**Testing Time:** 2-3 hours
**Total:** ~10 hours

**Dependencies:**
- Design System CSS variables
- Updated Button component
- New useGameHistory hook
- Lucide icons

**Next Steps After Implementation:**
- A/B test hero CTA placement
- Add personalization (greeting by time of day)
- Consider adding achievements/badges
- Implement command palette (Cmd+K)

---

**Last Updated:** 2025-11-20
**Status:** Ready for Implementation
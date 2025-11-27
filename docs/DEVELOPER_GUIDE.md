# Kelime Oyunu - Geliştirici Rehberi

> Mimari, setup ve geliştirme için kapsamlı rehber

Bu dokümantasyon, Kelime Oyunu uygulamasının teknik mimarisini, geliştirme ortamı kurulumunu ve katkıda bulunma rehberini içerir.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Proje Yapısı](#proje-yapısı)
4. [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
5. [Mimari](#mimari)
6. [State Yönetimi](#state-yönetimi)
7. [Routing ve Navigasyon](#routing-ve-navigasyon)
8. [Yeni Özellik Ekleme](#yeni-özellik-ekleme)
9. [Testing](#testing)
10. [Build ve Deploy](#build-ve-deploy)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Genel Bakış

Kelime Oyunu, **Tauri 2.x** framework'ü kullanılarak geliştirilmiş bir masaüstü uygulamasıdır. Frontend **React 18 + TypeScript**, backend **Rust**, veritabanı **SQLite** kullanır.

**Temel Özellikler:**
- Yerli masaüstü uygulaması (Windows, macOS, Linux)
- Offline çalışma
- Düşük kaynak kullanımı (~150 MB RAM, ~20 MB disk)
- Hızlı başlangıç (<3 saniye)
- Modern UI/UX (TV yarışma estetiği)

---

## Teknoloji Stack

### Frontend

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| React | 18.3.1 | UI kütüphanesi |
| TypeScript | 5.6.2 | Tip güvenliği |
| Vite | 6.0.3 | Build tool |
| Tailwind CSS | 3.4.18 | Styling |
| Framer Motion | 12.23.24 | Animasyonlar |
| Zustand | 5.0.8 | State yönetimi |
| React Router | 7.9.4 | Routing |
| Lucide React | 0.546.0 | İkonlar |

### Backend

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| Tauri | 2.x | Desktop framework |
| Rust | 2021 edition | Backend runtime |
| rusqlite | 0.32 | SQLite binding |
| tauri-plugin-fs | 2.4.2 | Dosya sistemi |
| tauri-plugin-dialog | 2.4.0 | Dosya diyalogları |

### Testing & Quality

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| Vitest | 4.0.5 | Test framework |
| React Testing Library | 16.3.0 | Component testing |
| ESLint | 8.57.1 | JS/TS linting |
| Clippy | - | Rust linting |
| Prettier | 3.6.2 | Formatting |
| Husky | 9.1.7 | Git hooks |

---

## Proje Yapısı

```
bil-bakalim/
├── src/                        # Frontend kaynak kodu
│   ├── api/                    # Tauri command wrappers
│   │   ├── category.ts         # Kategori API
│   │   ├── word.ts             # Kelime API
│   │   ├── gameHistory.ts      # Oyun geçmişi API
│   │   └── database.ts         # Veritabanı API
│   ├── animations/             # Animasyon bileşenleri
│   │   ├── Confetti.tsx        # Konfeti efekti
│   │   ├── PageTransition.tsx  # Sayfa geçişleri
│   │   ├── SkeletonLoader.tsx  # Yükleme iskeletleri
│   │   ├── config.ts           # Animasyon konfigürasyonu
│   │   └── variants.ts         # Framer Motion variants
│   ├── components/             # React bileşenleri
│   │   ├── A11y/               # Erişilebilirlik bileşenleri
│   │   ├── forms/              # Form bileşenleri
│   │   ├── game/               # Oyun bileşenleri
│   │   ├── layouts/            # Layout bileşenleri
│   │   ├── modals/             # Modal bileşenleri
│   │   ├── screens/            # Ekran bileşenleri
│   │   └── ui/                 # Temel UI bileşenleri
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCategories.ts    # Kategori hook
│   │   ├── useSound.ts         # Ses hook
│   │   ├── useErrorHandler.ts  # Hata yönetimi hook
│   │   └── useFocusTrap.ts     # Fokus yönetimi hook
│   ├── services/               # İş mantığı servisleri
│   │   ├── audio/              # Ses sistemi
│   │   ├── firstLaunch.ts      # İlk açılış servisi
│   │   └── wordService.ts      # Kelime seçim algoritması
│   ├── stores/                 # Zustand stores
│   │   ├── gameStore.ts        # Oyun state
│   │   ├── categoryStore.ts    # Kategori state
│   │   └── settingsStore.ts    # Ayarlar state
│   ├── types/                  # TypeScript type definitions
│   │   ├── database.ts         # DB modelleri
│   │   ├── errors.ts           # Hata tipleri
│   │   └── settings.ts         # Ayar tipleri
│   ├── routes/                 # Route tanımları
│   ├── App.tsx                 # Ana uygulama bileşeni
│   └── main.tsx                # Giriş noktası
├── src-tauri/                  # Tauri backend (Rust)
│   ├── src/
│   │   ├── commands/           # Tauri commands
│   │   │   ├── category.rs     # Kategori komutları
│   │   │   ├── word.rs         # Kelime komutları
│   │   │   ├── game_history.rs # Oyun geçmişi komutları
│   │   │   ├── settings.rs     # Ayarlar komutları
│   │   │   └── database.rs     # Veritabanı komutları
│   │   ├── db/                 # Veritabanı modülü
│   │   │   ├── connection.rs   # DB bağlantı yönetimi
│   │   │   ├── schema.rs       # DB şema
│   │   │   └── seed.rs         # Varsayılan veriler
│   │   ├── models/             # Rust data modelleri
│   │   ├── errors.rs           # Hata tipleri
│   │   ├── main.rs             # Giriş noktası
│   │   └── lib.rs              # Kütüphane modülü
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # Tauri konfigürasyonu
├── docs/                       # Dokümantasyon
├── tests/                      # Test dosyaları
├── public/                     # Statik dosyalar
├── package.json                # npm dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── vite.config.ts              # Vite config
└── vitest.config.ts            # Vitest config
```

---

## Geliştirme Ortamı Kurulumu

### Gereksinimler

- **Node.js:** 18.x veya üzeri
- **Rust:** 1.70 veya üzeri
- **npm/pnpm:** Paket yöneticisi
- **Git:** Versiyon kontrolü

### Kurulum Adımları

```bash
# 1. Repository'yi klonlayın
git clone https://github.com/emredag/bil-bakalim.git
cd bil-bakalim

# 2. Node bağımlılıklarını yükleyin
npm install

# 3. Rust bağımlılıklarını yükleyin (otomatik)
cd src-tauri
cargo build
cd ..

# 4. Geliştirme modunda çalıştırın
npm run tauri dev
```

### IDE Kurulumu

**VS Code (Önerilen):**

Gerekli uzantılar:
- Tauri (tauri-apps.tauri-vscode)
- rust-analyzer (rust-lang.rust-analyzer)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "rust-analyzer.checkOnSave": true,
  "rust-analyzer.check.command": "clippy"
}
```

---

## Mimari

### Katmanlar

```
┌─────────────────────────────────────────────┐
│           UI Layer (React)                  │
│  Components, Screens, Hooks                 │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│        State Layer (Zustand)                │
│  gameStore, categoryStore, settingsStore    │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│       Service Layer (Business Logic)        │
│  wordService, audioService, firstLaunch     │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│        API Layer (Tauri Commands)           │
│  invoke() wrappers in /api                  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│       Backend Layer (Rust)                  │
│  Commands, Database, Business Logic         │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│       Data Layer (SQLite)                   │
│  Categories, Words, Game History, Settings  │
└─────────────────────────────────────────────┘
```

### Data Flow

**Okuma (Read):**
```
Component → Hook → API Wrapper → invoke() → Rust Command → SQLite → Response
```

**Yazma (Write):**
```
Component → Event Handler → API Wrapper → invoke() → Rust Command → SQLite
                                                                     │
Component ← State Update ← Store ← Success Response ←────────────────┘
```

---

## State Yönetimi

### Zustand Stores

#### 1. Game Store (`stores/gameStore.ts`)

Oyun state'ini yönetir.

**State:**
```typescript
interface GameState {
  // Game session
  categoryId: number | null;
  categoryName: string | null;
  gameMode: 'single' | 'multi' | 'team' | null;
  participants: Participant[];
  currentParticipantIndex: number;

  // Word state
  words: Word[];
  currentWordIndex: number;
  revealedLetters: boolean[];
  guessesRemaining: number;

  // Timer
  timeRemaining: number;
  isPaused: boolean;

  // Scoring
  currentScore: number;
  totalScore: number;
}
```

**Actions:**
```typescript
{
  startGame: (categoryId, mode, participants) => void;
  revealLetter: () => void;
  submitGuess: (guess: string) => void;
  skipWord: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
}
```

**Kullanım:**
```typescript
import { useGameStore } from '@/stores/gameStore';

function GameScreen() {
  const { timeRemaining, isPaused, pauseGame } = useGameStore();

  return (
    <div>
      <p>Kalan Süre: {timeRemaining}s</p>
      <button onClick={pauseGame}>Duraklat</button>
    </div>
  );
}
```

#### 2. Category Store (`stores/categoryStore.ts`)

Kategori state'ini yönetir.

**State:**
```typescript
interface CategoryState {
  categories: Category[];
  selectedCategoryId: number | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
```typescript
{
  loadCategories: () => Promise<void>;
  selectCategory: (id: number) => void;
  createCategory: (data: NewCategory) => Promise<Category>;
  updateCategory: (id: number, data: UpdateCategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}
```

#### 3. Settings Store (`stores/settingsStore.ts`)

Ayarlar state'ini yönetir ve localStorage ile persist eder.

**State:**
```typescript
interface SettingsState {
  soundEnabled: boolean;
  effectsVolume: number;
  showHints: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}
```

---

## Routing ve Navigasyon

### Route Tanımları (`routes/index.ts`)

```typescript
export const routes = [
  { path: '/', element: <WelcomeScreen /> },
  { path: '/main-menu', element: <MainMenuScreen /> },
  { path: '/category-selection', element: <CategorySelectionScreen /> },
  { path: '/mode-selection', element: <GameModeSelectionScreen /> },
  { path: '/participant-setup', element: <ParticipantSetupScreen /> },
  { path: '/game', element: <GameScreen /> },
  { path: '/results', element: <ResultsScreen /> },
  { path: '/history', element: <GameHistoryScreen /> },
  { path: '/history/:id', element: <GameHistoryDetailScreen /> },
  { path: '/category-management', element: <CategoryManagementScreen /> },
  { path: '/word-management/:id', element: <WordManagementScreen /> },
  { path: '/settings', element: <SettingsScreen /> },
  { path: '/how-to-play', element: <HowToPlayScreen /> },
];
```

### Navigasyon

```typescript
import { useNavigate } from 'react-router-dom';

function CategoryCard({ category }: Props) {
  const navigate = useNavigate();
  const selectCategory = useCategoryStore(state => state.selectCategory);

  const handleSelect = () => {
    selectCategory(category.id);
    navigate('/mode-selection');
  };

  return <button onClick={handleSelect}>Seç</button>;
}
```

---

## Yeni Özellik Ekleme

### 1. Yeni Ekran Ekleme

**Adım 1: Component Oluştur**

`src/components/screens/MyNewScreen.tsx`:
```typescript
import { PageLayout } from '@/components/layouts/PageLayout';

export function MyNewScreen() {
  return (
    <PageLayout title="Yeni Ekran">
      <div className="space-y-6">
        {/* İçerik */}
      </div>
    </PageLayout>
  );
}
```

**Adım 2: Route Ekle**

`src/routes/index.ts`:
```typescript
import { MyNewScreen } from '@/components/screens/MyNewScreen';

export const routes = [
  // ... mevcut route'lar
  { path: '/my-new-screen', element: <MyNewScreen /> },
];
```

**Adım 3: Navigasyon Ekle**

```typescript
<Button onClick={() => navigate('/my-new-screen')}>
  Yeni Ekrana Git
</Button>
```

### 2. Yeni Tauri Command Ekleme

**Adım 1: Rust Command Yaz**

`src-tauri/src/commands/my_module.rs`:
```rust
use crate::db;
use crate::errors::AppError;

#[tauri::command]
pub fn my_new_command(param: String) -> Result<String, AppError> {
    let conn = db::get_connection()?;

    // İş mantığı...

    Ok("Success".to_string())
}
```

**Adım 2: Command'i Export Et**

`src-tauri/src/commands/mod.rs`:
```rust
pub mod my_module;
pub use my_module::*;
```

**Adım 3: Command'i Register Et**

`src-tauri/src/main.rs` veya `lib.rs`:
```rust
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        // ... mevcut commandlar
        my_new_command,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
```

**Adım 4: Frontend Wrapper Yaz**

`src/api/myModule.ts`:
```typescript
import { invoke } from '@tauri-apps/api/core';

export async function myNewCommand(param: string): Promise<string> {
  return await invoke<string>('my_new_command', { param });
}
```

**Adım 5: Component'te Kullan**

```typescript
import { myNewCommand } from '@/api/myModule';

function MyComponent() {
  const handleClick = async () => {
    try {
      const result = await myNewCommand('test');
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleClick}>Test</button>;
}
```

### 3. Yeni UI Bileşeni Ekleme

**Adım 1: Component Oluştur**

`src/components/ui/MyComponent.tsx`:
```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface MyComponentProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = 'primary', className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-4',
          variant === 'primary' && 'bg-blue-600',
          variant === 'secondary' && 'bg-slate-700',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
```

**Adım 2: Export Et**

`src/components/ui/index.ts`:
```typescript
export { MyComponent } from './MyComponent';
```

**Adım 3: Kullan**

```typescript
import { MyComponent } from '@/components/ui';

<MyComponent variant="primary">İçerik</MyComponent>
```

---

## Testing

### Unit Tests (Vitest)

**Component Test:**

`src/components/ui/Button.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**Service Test:**

`src/services/wordService.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { selectRandomWords } from './wordService';

describe('wordService', () => {
  it('selects 14 words correctly', () => {
    const words = [/* mock words */];
    const selected = selectRandomWords(words, []);

    expect(selected).toHaveLength(14);
  });
});
```

### Test Komutları

```bash
# Testleri çalıştır (watch mode)
npm run test

# Testleri bir kez çalıştır (CI için)
npm run test:run

# Coverage raporu
npm run test:coverage

# UI ile test
npm run test:ui
```

---

## Build ve Deploy

### Development Build

```bash
# Frontend + Backend birlikte
npm run tauri dev

# Sadece frontend
npm run dev

# Sadece backend
cd src-tauri && cargo build
```

### Production Build

```bash
# Tüm platformlar için build
npm run tauri build

# Platform-specific
npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
npm run tauri build -- --target x86_64-apple-darwin      # macOS Intel
npm run tauri build -- --target aarch64-apple-darwin     # macOS Apple Silicon
npm run tauri build -- --target x86_64-unknown-linux-gnu # Linux
```

**Build Output:**
- Windows: `src-tauri/target/release/bundle/msi/*.msi`
- macOS: `src-tauri/target/release/bundle/dmg/*.dmg`
- Linux: `src-tauri/target/release/bundle/deb/*.deb` ve `*.AppImage`

### Build Optimization

**Tauri Config (`src-tauri/tauri.conf.json`):**
```json
{
  "bundle": {
    "targets": ["msi", "dmg", "deb", "appimage"],
    "resources": [],
    "icon": ["icons/icon.png"]
  },
  "security": {
    "csp": "default-src 'self'; style-src 'self' 'unsafe-inline'"
  }
}
```

**Vite Config (`vite.config.ts`):**
```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
});
```

---

## Best Practices

### Code Style

**TypeScript:**
- Explicit return types
- No `any` type
- Strict null checks
- Interface over type

**React:**
- Functional components
- Custom hooks for logic
- React.memo for optimization
- Forward refs for UI components

**Naming:**
- Components: PascalCase (`GameScreen.tsx`)
- Hooks: camelCase with `use` prefix (`useCategories.ts`)
- Utils: camelCase (`formatTime.ts`)
- Types: PascalCase (`GameState`)

### Performance

**React Optimization:**
```typescript
// ✅ Good: Memoized component
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// ✅ Good: Memoized callback
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);

// ✅ Good: Memoized value
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

**Bundle Size:**
- Use dynamic imports
- Tree-shaking
- Code splitting
- Lazy load routes

### Security

**Content Security Policy:**
```json
{
  "csp": "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:"
}
```

**Tauri Allowlist:**
```json
{
  "allowlist": {
    "all": false,
    "fs": {
      "scope": ["$APPDATA/*"]
    },
    "dialog": {
      "all": true
    }
  }
}
```

---

## Troubleshooting

### Development Issues

**Problem:** Tauri dev sırasında "Error while spawning command"
**Çözüm:**
```bash
cd src-tauri
cargo clean
cargo build
cd ..
npm run tauri dev
```

**Problem:** TypeScript type errors
**Çözüm:**
```bash
npm run type-check
# Hataları düzelt
```

**Problem:** ESLint errors
**Çözüm:**
```bash
npm run lint:fix
```

### Build Issues

**Problem:** Rust compilation errors
**Çözüm:**
```bash
rustup update
cd src-tauri
cargo update
```

**Problem:** Bundle size too large
**Çözüm:**
- Check bundle analyzer: `npm run build -- --analyze`
- Remove unused dependencies
- Add tree-shaking
- Use dynamic imports

---

## İlgili Kaynaklar

- [API Dokümantasyonu](API.md) - Tüm Tauri commands
- [Mimari Dokümanı](ARCHITECTURE.md) - Sistem mimarisi detayları
- [Katkıda Bulunma](../CONTRIBUTING.md) - Katkı rehberi
- [Kod Kalitesi](CODE_QUALITY.md) - Kod standartları
- [Tauri Docs](https://tauri.app/v2/) - Tauri resmi dökümanları
- [React Docs](https://react.dev/) - React resmi dökümanları

---

**Son Güncelleme:** 2025-10-30
**Versiyon:** 1.0.0

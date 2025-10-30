# Kelime Oyunu - Sistem Mimarisi

> Detaylı mimari tasarım ve teknik kararlar

Bu dokümantasyon, Kelime Oyunu uygulamasının sistem mimarisini, komponent ilişkilerini, data flow'unu ve teknik kararların gerekçelerini açıklar.

## İçindekiler

1. [Sistem Genel Bakış](#sistem-genel-bakış)
2. [Mimari Katmanlar](#mimari-katmanlar)
3. [Component Mimarisi](#component-mimarisi)
4. [Data Flow](#data-flow)
5. [State Yönetimi](#state-yönetimi)
6. [Backend Mimarisi](#backend-mimarisi)
7. [Veritabanı Şeması](#veritabanı-şeması)
8. [Performance Considerations](#performance-considerations)
9. [Security](#security)
10. [Teknik Kararlar ve Gerekçeleri](#teknik-kararlar-ve-gerekçeleri)

---

## Sistem Genel Bakış

Kelime Oyunu, **Event-Driven Architecture** ve **Layered Architecture** pattern'lerini birleştiren hibrit bir mimariye sahiptir.

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
│                       (React Components)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Screens  │  │  Modals  │  │   Game   │  │    UI    │      │
│  │          │  │          │  │Components│  │Components│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                       State Management Layer                    │
│                         (Zustand Stores)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  gameStore  │  │categoryStore │  │settingsStore │         │
│  └─────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                        Service Layer                            │
│                    (Business Logic)                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │ Word       │  │   Audio    │  │  First     │              │
│  │ Selection  │  │  Service   │  │  Launch    │              │
│  └────────────┘  └────────────┘  └────────────┘              │
└────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      API Abstraction Layer                      │
│                    (Tauri Command Wrappers)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │  category  │  │    word    │  │  database  │              │
│  │    API     │  │    API     │  │    API     │              │
│  └────────────┘  └────────────┘  └────────────┘              │
└────────────────────────────────────────────────────────────────┘
                                 │
                        IPC (Tauri invoke)
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                       Backend Layer (Rust)                      │
│                        (Tauri Commands)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │  Category  │  │    Word    │  │    Game    │              │
│  │  Commands  │  │  Commands  │  │   History  │              │
│  └────────────┘  └────────────┘  └────────────┘              │
└────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                          │
│                         (SQLite)                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │Categories  │  │   Words    │  │   Game     │              │
│  │            │  │            │  │  History   │              │
│  └────────────┘  └────────────┘  └────────────┘              │
└────────────────────────────────────────────────────────────────┘
```

---

## Mimari Katmanlar

### 1. Presentation Layer (React Components)

**Sorumluluklar:**
- UI rendering
- User input handling
- Visual feedback
- Animasyonlar

**Bileşenler:**
- `screens/` - Tam sayfa ekranları
- `modals/` - Dialog ve modal'lar
- `game/` - Oyun-specific bileşenleri
- `ui/` - Generic UI bileşenleri

**Pattern:** Container/Presenter Pattern

```typescript
// Container (Logic)
function GameScreenContainer() {
  const gameState = useGameStore();
  const handleRevealLetter = useCallback(() => {
    gameState.revealLetter();
  }, []);

  return <GameScreenPresenter {...gameState} onRevealLetter={handleRevealLetter} />;
}

// Presenter (Presentation)
function GameScreenPresenter({ timeRemaining, onRevealLetter }: Props) {
  return (
    <div>
      <p>{timeRemaining}s</p>
      <button onClick={onRevealLetter}>Harf Aç</button>
    </div>
  );
}
```

### 2. State Management Layer (Zustand)

**Sorumluluklar:**
- Global state management
- State synchronization
- Side effects
- Persistence (settings)

**Stores:**
- `gameStore` - Oyun state (words, timer, score)
- `categoryStore` - Kategori listesi ve seçili kategori
- `settingsStore` - Uygulama ayarları

**Pattern:** Flux Architecture

```typescript
// Action → Reducer → State Update → UI Re-render
```

### 3. Service Layer

**Sorumluluklar:**
- Business logic
- Complex calculations
- External integrations
- Utility functions

**Services:**
- `wordService` - Kelime seçim algoritması
- `audioService` - Web Audio API wrapper
- `firstLaunch` - İlk açılış kontrolü

**Örnek:**
```typescript
// wordService.ts
export function selectRandomWords(
  allWords: Word[],
  excludeIds: number[]
): Word[] {
  // Complex word selection algorithm
  const selected = [];
  for (let letterCount = 4; letterCount <= 10; letterCount++) {
    const filtered = allWords.filter(
      w => w.letter_count === letterCount && !excludeIds.includes(w.id)
    );
    const shuffled = shuffle(filtered);
    selected.push(...shuffled.slice(0, 2));
  }
  return shuffle(selected);
}
```

### 4. API Abstraction Layer

**Sorumluluklar:**
- Tauri command wrapping
- Error handling
- Type safety
- Caching (optional)

**Pattern:** Facade Pattern

```typescript
// api/category.ts
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await invoke<Category[]>('get_all_categories');
  } catch (error) {
    throw handleTauriError(error);
  }
}
```

### 5. Backend Layer (Rust)

**Sorumluluklar:**
- Tauri command implementation
- Database operations
- File system operations
- Business logic validation

**Commands:**
- Category CRUD (8 commands)
- Word CRUD (6 commands)
- Game History (8 commands)
- Settings (2 commands)
- Database Management (4 commands)

### 6. Data Access Layer (SQLite)

**Sorumluluklar:**
- Data persistence
- Query optimization
- Transaction management
- Foreign key constraints

---

## Component Mimarisi

### Component Hierarchy

```
App
├── ErrorBoundary
│   └── Router
│       ├── WelcomeScreen (first launch)
│       └── MainMenuScreen
│           ├── CategorySelectionScreen
│           │   └── GameModeSelectionScreen
│           │       └── ParticipantSetupScreen
│           │           └── GameScreen
│           │               └── ResultsScreen
│           ├── CategoryManagementScreen
│           │   └── WordManagementScreen
│           ├── GameHistoryScreen
│           │   └── GameHistoryDetailScreen
│           ├── SettingsScreen
│           └── HowToPlayScreen
```

### Component Communication

**Parent → Child (Props):**
```typescript
<GameHeader
  timeRemaining={timeRemaining}
  currentScore={currentScore}
  categoryName={categoryName}
/>
```

**Child → Parent (Callbacks):**
```typescript
<ControlPanel
  onRevealLetter={handleRevealLetter}
  onSubmitGuess={handleSubmitGuess}
  onSkip={handleSkip}
/>
```

**Sibling Communication (Shared State):**
```typescript
// Both components access gameStore
const Component1 = () => {
  const timeRemaining = useGameStore(state => state.timeRemaining);
};

const Component2 = () => {
  const pauseGame = useGameStore(state => state.pauseGame);
};
```

### Component Composition

**Atomic Design Principles:**

```
Atoms (Basic UI)
  ├── Button
  ├── Input
  ├── Badge
  └── LetterBox

Molecules (Combinations)
  ├── SearchBar (Input + Button)
  ├── CategoryCard (Badge + Button)
  └── WordRow (LetterBox × N)

Organisms (Complex Components)
  ├── ControlPanel (Multiple buttons + info)
  ├── GameHeader (Multiple info displays)
  └── ParticipantList (Multiple cards)

Templates (Layouts)
  └── PageLayout (Header + Content + Footer)

Pages (Screens)
  ├── GameScreen
  ├── CategorySelectionScreen
  └── ...
```

---

## Data Flow

### Read Flow (Data Fetching)

```
User Action (button click)
        ↓
Event Handler (onClick)
        ↓
API Call (getAllCategories)
        ↓
Tauri invoke()
        ↓
Rust Command (get_all_categories)
        ↓
Database Query (SELECT * FROM categories)
        ↓
Result Mapping (Row → Category struct)
        ↓
Serialization (Rust → JSON)
        ↓
IPC Transfer
        ↓
Deserialization (JSON → TypeScript)
        ↓
Store Update (setCategories)
        ↓
React Re-render
        ↓
UI Update
```

### Write Flow (Data Mutation)

```
User Input (form submit)
        ↓
Form Validation (client-side)
        ↓
API Call (createCategory)
        ↓
Tauri invoke() with payload
        ↓
Rust Command (create_category)
        ↓
Validation (server-side)
        ↓
Database Insert
        ↓
Get Last Insert ID
        ↓
Fetch Created Record
        ↓
Return to Frontend
        ↓
Optimistic Update (store)
        ↓
UI Update
```

### Game Loop Data Flow

```
Start Game
    ↓
Load Words (API call)
    ↓
Initialize Game State (store)
    ↓
┌─────────────────┐
│  Game Loop      │
│                 │
│  User Action    │
│      ↓          │
│  Update State   │
│      ↓          │
│  Check Win      │─────► End Game
│      ↓          │
│  Render         │
│      ↓          │
│  Wait Input     │
│      │          │
└─────┘          │
    ↑____________│
                 │
                 ▼
         Save to History
```

---

## State Yönetimi

### Game Store Architecture

```typescript
interface GameStore {
  // Session Data
  sessionId: string;
  categoryId: number;
  gameMode: GameMode;
  participants: Participant[];

  // Word State
  words: Word[];
  currentWordIndex: number;
  revealedLetters: boolean[]; // [F, T, F, T, F] for "AS_AN"

  // Scoring
  currentScore: number;
  lettersRevealed: number;
  guessesRemaining: number;

  // Timer
  timeRemaining: number;
  intervalId: number | null;

  // Actions
  startGame: () => void;
  revealLetter: () => void;
  submitGuess: (guess: string) => void;
  skipWord: () => void;
  nextWord: () => void;
  endGame: () => void;
}
```

### State Updates

**Immutable Updates:**
```typescript
// ❌ Bad (mutates state)
state.revealedLetters[index] = true;

// ✅ Good (creates new array)
revealedLetters: state.revealedLetters.map((val, i) =>
  i === index ? true : val
),
```

**Derived State:**
```typescript
// Computed in selector, not stored
const isWordComplete = useGameStore(state =>
  state.revealedLetters.every(Boolean)
);
```

### State Persistence

**Settings Store (localStorage):**
```typescript
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
```

---

## Backend Mimarisi

### Command Organization

```
src-tauri/src/commands/
├── category.rs          # 8 commands
│   ├── get_all_categories
│   ├── get_category_by_id
│   ├── create_category
│   ├── update_category
│   ├── delete_category
│   ├── validate_category
│   ├── export_category_json
│   └── import_category_json
├── word.rs              # 6 commands
│   ├── get_words_by_category
│   ├── add_word
│   ├── update_word
│   ├── delete_word
│   ├── get_random_words
│   └── validate_category_for_mode
├── game_history.rs      # 8 commands
├── settings.rs          # 2 commands
└── database.rs          # 4 commands
```

### Error Handling

**Custom Error Types:**
```rust
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    DatabaseError(String),

    #[error("Not found: {0}")]
    NotFoundError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Serialization error: {0}")]
    SerializationError(String),

    #[error("{0}")]
    Other(String),
}

// Convert to Tauri-compatible error
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        // Custom serialization
    }
}
```

### Database Connection Management

**Singleton Pattern:**
```rust
use std::sync::Mutex;
use once_cell::sync::Lazy;

static DB_PATH: Lazy<Mutex<Option<PathBuf>>> = Lazy::new(|| {
    Mutex::new(None)
});

pub fn get_connection() -> Result<Connection, AppError> {
    let path = get_db_path()?;
    Connection::open(&path)
        .map_err(|e| AppError::DatabaseError(e.to_string()))
}
```

---

## Veritabanı Şeması

### Entity Relationship Diagram

```
┌──────────────┐
│  categories  │
│──────────────│
│ id (PK)      │◄─────────┐
│ name         │          │
│ emoji        │          │ 1:N
│ description  │          │
│ is_default   │          │
│ created_at   │          │
│ updated_at   │          │
└──────────────┘          │
                          │
┌──────────────┐          │
│    words     │          │
│──────────────│          │
│ id (PK)      │          │
│ category_id  │──────────┘
│ word         │
│ letter_count │
│ hint         │
│ created_at   │
└──────────────┘

┌─────────────────┐
│  game_history   │
│─────────────────│
│ id (PK)         │◄─────────┐
│ category_id     │          │
│ category_name   │          │ 1:N
│ game_mode       │          │
│ played_at       │          │
│ total_time_sec  │          │
│ created_at      │          │
└─────────────────┘          │
                             │
┌──────────────────────┐     │
│ game_participants    │     │
│──────────────────────│     │
│ id (PK)              │     │
│ game_history_id (FK) │─────┘
│ participant_name     │
│ participant_type     │
│ score                │
│ words_found          │
│ words_skipped        │
│ letters_revealed     │
│ rank                 │
│ created_at           │
└──────────────────────┘
         │ 1:N
         │
         ▼
┌──────────────────────┐
│ game_word_results    │
│──────────────────────│
│ id (PK)              │
│ game_history_id (FK) │
│ participant_id (FK)  │
│ word                 │
│ word_hint            │
│ result               │
│ points_earned        │
│ letters_used         │
│ created_at           │
└──────────────────────┘
```

### Indexes

```sql
-- Categories
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_default ON categories(is_default);

-- Words
CREATE INDEX idx_words_category_id ON words(category_id);
CREATE INDEX idx_words_letter_count ON words(letter_count);
CREATE INDEX idx_words_category_letter ON words(category_id, letter_count);

-- Game History
CREATE INDEX idx_game_history_category_id ON game_history(category_id);
CREATE INDEX idx_game_history_played_at ON game_history(played_at);
CREATE INDEX idx_game_history_game_mode ON game_history(game_mode);

-- Game Participants
CREATE INDEX idx_game_participants_history_id ON game_participants(game_history_id);
CREATE INDEX idx_game_participants_rank ON game_participants(rank);

-- Game Word Results
CREATE INDEX idx_game_word_results_participant_id ON game_word_results(participant_id);
```

---

## Performance Considerations

### Frontend Performance

**1. Component Optimization:**
```typescript
// React.memo for expensive components
export const GameHeader = React.memo(({ timeRemaining, score }: Props) => {
  return <header>...</header>;
});

// useMemo for expensive calculations
const sortedParticipants = useMemo(() => {
  return participants.sort((a, b) => b.score - a.score);
}, [participants]);

// useCallback for event handlers
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

**2. Code Splitting:**
```typescript
// Route-level code splitting
const GameScreen = lazy(() => import('./components/screens/GameScreen'));

// Component-level lazy loading
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));
```

**3. Virtual Scrolling:**
```typescript
// For long lists (game history)
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

**4. Debouncing:**
```typescript
// Search input
const debouncedSearch = useMemo(
  () =>
    debounce((value: string) => {
      performSearch(value);
    }, 300),
  []
);
```

### Backend Performance

**1. Database Queries:**
```rust
// Use parameterized queries
let query = "SELECT * FROM words WHERE category_id = ?1 AND letter_count = ?2";

// Use transactions for bulk operations
let tx = conn.transaction()?;
for word in words {
    tx.execute("INSERT INTO ...", params![...])?;
}
tx.commit()?;

// Use LIMIT for pagination
"SELECT * FROM game_history ORDER BY played_at DESC LIMIT 50 OFFSET 0"
```

**2. Connection Pooling:**
```rust
// Reuse connections
pub fn get_connection() -> Result<Connection, AppError> {
    // Returns cached connection
}
```

---

## Security

### Frontend Security

**1. Input Validation:**
```typescript
// Client-side validation
const validateWord = (word: string): boolean => {
  // Only Turkish uppercase letters
  return /^[A-ZÇĞİÖŞÜ]+$/.test(word) && word.length >= 4 && word.length <= 10;
};
```

**2. XSS Prevention:**
```typescript
// React automatically escapes content
<div>{userInput}</div> // Safe

// Avoid dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Dangerous!
```

### Backend Security

**1. SQL Injection Prevention:**
```rust
// ✅ Good: Parameterized query
conn.execute(
    "INSERT INTO words (word) VALUES (?1)",
    params![word]
)?;

// ❌ Bad: String interpolation
conn.execute(&format!("INSERT INTO words (word) VALUES ('{}')", word))?;
```

**2. Path Traversal Prevention:**
```rust
// Tauri allowlist restricts file access
{
  "allowlist": {
    "fs": {
      "scope": ["$APPDATA/*"] // Only app data directory
    }
  }
}
```

**3. Content Security Policy:**
```json
{
  "security": {
    "csp": "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
  }
}
```

---

## Teknik Kararlar ve Gerekçeleri

### 1. Neden Tauri?

**Avantajlar:**
- ✅ Küçük bundle size (~20 MB vs Electron ~150 MB)
- ✅ Düşük memory kullanımı (~150 MB vs ~500 MB)
- ✅ Native performance (Rust backend)
- ✅ Better security (CSP, allowlist)
- ✅ Cross-platform (Windows, macOS, Linux)

**Dezavantajlar:**
- ❌ Daha genç ecosystem
- ❌ Daha az community resources

### 2. Neden SQLite?

**Avantajlar:**
- ✅ Serverless (no setup)
- ✅ Zero-config
- ✅ File-based (easy backup/restore)
- ✅ Fast for single-user app
- ✅ ACID transactions

**Alternatifler:**
- PostgreSQL/MySQL: Overkill for single-user desktop app
- IndexedDB: Frontend-only, harder to query

### 3. Neden Zustand?

**Avantajlar:**
- ✅ Minimal boilerplate vs Redux
- ✅ Better TypeScript support
- ✅ Hooks-based API
- ✅ Middleware support (persist, devtools)
- ✅ Küçük bundle size (2 KB)

**Alternatifler:**
- Redux: Too much boilerplate
- Context API: Performance issues with frequent updates
- Jotai/Recoil: Atomic pattern not needed

### 4. Neden Framer Motion?

**Avantajlar:**
- ✅ Declarative API
- ✅ Layout animations (magic!)
- ✅ Gesture support
- ✅ SVG animations
- ✅ Great TypeScript support

**Alternatifler:**
- React Spring: More physics-based, harder API
- CSS animations: Limited capabilities
- GSAP: Larger bundle, imperative API

### 5. Neden Vite?

**Avantajlar:**
- ✅ Lightning-fast HMR
- ✅ Native ES modules
- ✅ Better than Webpack for development
- ✅ Built-in TypeScript support
- ✅ Optimized production builds

**Alternatifler:**
- Create React App: Slower, deprecated
- Webpack: Slower HMR, complex config

---

## Scalability Considerations

### Horizontal Scaling

**Current:** Single-user desktop app (no scaling needed)

**Future Consideration:** Multi-user server:
- Replace SQLite with PostgreSQL
- Add REST API layer
- Implement authentication
- Add caching layer (Redis)

### Vertical Scaling

**Database Size:**
- Current: ~5 MB (1000 words, 100 games)
- Projected: ~50 MB (10,000 words, 1000 games)
- Limit: SQLite handles up to 281 TB

**Memory:**
- Current: ~150 MB
- Projected: ~200 MB (with more data)
- Optimization: Implement virtual scrolling for large lists

---

## Future Improvements

### Architecture

1. **Service Worker:** Offline-first with cache
2. **WebRTC:** Multiplayer over network
3. **Plugin System:** Extensible game modes
4. **Cloud Sync:** Optional cloud backup (Firebase/Supabase)

### Performance

1. **Lazy Loading:** More aggressive code splitting
2. **Web Workers:** Heavy calculations off main thread
3. **IndexedDB Cache:** Cache frequently accessed data
4. **Streaming:** Stream large exports/imports

### Testing

1. **E2E Tests:** Playwright/Cypress
2. **Visual Regression:** Chromatic/Percy
3. **Performance Tests:** Lighthouse CI
4. **Load Tests:** SQLite query performance

---

## İlgili Dokümantasyon

- [README.md](../README.md) - Proje genel bakış
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Geliştirme rehberi
- [API.md](API.md) - API referansı
- [USER_GUIDE.md](USER_GUIDE.md) - Kullanıcı rehberi

---

**Son Güncelleme:** 2025-10-30
**Versiyon:** 1.0.0

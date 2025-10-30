# Kelime Oyunu - API Dokümantasyonu

> Tauri Backend Commands Reference

Bu dokümantasyon, Kelime Oyunu uygulamasının Tauri backend'inde kullanılabilir tüm komutları (commands) listeler. Her komut için parametreler, dönüş değerleri ve kullanım örnekleri verilmiştir.

## İçindekiler

1. [Kullanım](#kullanım)
2. [Kategori Komutları](#kategori-komutları) (8 komut)
3. [Kelime Komutları](#kelime-komutları) (6 komut)
4. [Ayarlar Komutları](#ayarlar-komutları) (2 komut)
5. [Veritabanı Komutları](#veritabanı-komutları) (4 komut)
6. [Oyun Geçmişi Komutları](#oyun-geçmişi-komutları) (8 komut)
7. [Veri Modelleri](#veri-modelleri)
8. [Hata Yönetimi](#hata-yönetimi)

**Toplam: 28 Tauri Command**

---

## Kullanım

Tauri command'leri `@tauri-apps/api` paketi üzerinden çağrılır:

```typescript
import { invoke } from '@tauri-apps/api/core';

// Örnek kullanım
const categories = await invoke<Category[]>('get_all_categories');
```

**Not:** Tüm command'ler Promise döner ve async/await ile kullanılmalıdır.

---

## Kategori Komutları

### 1. `get_all_categories`

Tüm kategorileri getirir.

**Parametreler:** Yok

**Dönüş:** `Promise<Category[]>`

**Örnek:**
```typescript
const categories = await invoke<Category[]>('get_all_categories');
console.log(categories);
// [{ id: 1, name: "Hayvanlar", emoji: "🐾", ... }, ...]
```

**Sıralama:** Varsayılan kategoriler önce, sonra alfabetik

---

### 2. `get_category_by_id`

ID'ye göre tek bir kategori getirir.

**Parametreler:**
- `id` (number) - Kategori ID'si

**Dönüş:** `Promise<Category>`

**Hatalar:**
- `NotFoundError` - Kategori bulunamazsa

**Örnek:**
```typescript
const category = await invoke<Category>('get_category_by_id', { id: 1 });
console.log(category.name); // "Hayvanlar"
```

---

### 3. `create_category`

Yeni kategori oluşturur.

**Parametreler:**
- `name` (string) - Kategori adı
- `emoji` (string) - Kategori emoji'si
- `description` (string | null) - Kategori açıklaması (opsiyonel)

**Dönüş:** `Promise<Category>`

**Örnek:**
```typescript
const newCategory = await invoke<Category>('create_category', {
  name: 'Şehirler',
  emoji: '🏙️',
  description: 'Türkiye şehirleri'
});
console.log(newCategory.id); // Otomatik oluşturulan ID
```

---

### 4. `update_category`

Mevcut kategoriyi günceller.

**Parametreler:**
- `id` (number) - Kategori ID'si
- `name` (string) - Yeni kategori adı
- `emoji` (string) - Yeni emoji
- `description` (string | null) - Yeni açıklama (opsiyonel)

**Dönüş:** `Promise<Category>`

**Hatalar:**
- `NotFoundError` - Kategori bulunamazsa

**Örnek:**
```typescript
const updated = await invoke<Category>('update_category', {
  id: 5,
  name: 'Türkiye Şehirleri',
  emoji: '🇹🇷',
  description: 'Güncellenmiş açıklama'
});
```

---

### 5. `delete_category`

Kategoriyi siler.

**Parametreler:**
- `id` (number) - Kategori ID'si

**Dönüş:** `Promise<void>`

**Hatalar:**
- `ValidationError` - Varsayılan kategori silinemez
- `NotFoundError` - Kategori bulunamazsa

**Not:** Kategori silindiğinde tüm kelimeleri de silinir (CASCADE)

**Örnek:**
```typescript
await invoke('delete_category', { id: 5 });
```

---

### 6. `validate_category`

Kategorinin oynanabilirlik durumunu kontrol eder.

**Parametreler:**
- `id` (number) - Kategori ID'si

**Dönüş:** `Promise<ValidationResult>`

**ValidationResult İçeriği:**
- `is_valid` (boolean) - Kategori oynanabilir mi?
- `total_words` (number) - Toplam kelime sayısı
- `words_by_length` (array) - Her harf uzunluğu için kelime sayısı
- `max_players_single` (number) - Tek oyuncu için (0 veya 1)
- `max_players_multi` (number) - Maksimum oyuncu sayısı
- `max_teams` (number) - Maksimum takım sayısı
- `message` (string) - Açıklayıcı mesaj

**Örnek:**
```typescript
const validation = await invoke<ValidationResult>('validate_category', { id: 1 });
console.log(validation.message);
// "✅ 6 yarışmacıya/takıma kadar oynanabilir (84 kelime)"
```

**Kurallar:**
- Her oyuncu için 14 kelime gerekir (her harf uzunluğundan 2'şer)
- Tek oyuncu: minimum 14 kelime (her uzunluktan 2+)
- Çoklu oyuncu (2 kişi): minimum 28 kelime (her uzunluktan 4+)
- Takım modu (2 takım): minimum 28 kelime (her uzunluktan 4+)

---

### 7. `export_category_json`

Kategoriyi ve tüm kelimelerini JSON olarak export eder.

**Parametreler:**
- `category_id` (number) - Export edilecek kategori ID'si

**Dönüş:** `Promise<CategoryExportData>`

**CategoryExportData İçeriği:**
- `category` - Kategori bilgileri (name, emoji, description)
- `words` - Kelime listesi (word, letter_count, hint)

**Örnek:**
```typescript
const exportData = await invoke<CategoryExportData>('export_category_json', {
  category_id: 1
});

// JSON dosyasına kaydet
const json = JSON.stringify(exportData, null, 2);
// Kullanıcı dosya seçici ile kaydetme...
```

**Export Format:**
```json
{
  "category": {
    "name": "Hayvanlar",
    "emoji": "🐾",
    "description": "Hayvan isimleri"
  },
  "words": [
    { "word": "ASLAN", "letter_count": 5, "hint": "Ormanların kralı" },
    { "word": "FİL", "letter_count": 3, "hint": "Hortumlu hayvan" }
  ]
}
```

---

### 8. `import_category_json`

JSON dosyasından kelimeleri kategoriye import eder.

**Parametreler:**
- `category_id` (number) - İçe aktarılacak kategori ID'si
- `json_data` (CategoryExportData) - JSON verisi

**Dönüş:** `Promise<ImportResult>`

**ImportResult İçeriği:**
- `words_added` (number) - Başarıyla eklenen kelime sayısı
- `words_skipped` (number) - Atlanan kelime sayısı
- `message` (string) - Sonuç mesajı

**Validasyon Kuralları:**
- Kelime 4-10 harf arasında olmalı
- Sadece A-Z harfleri (Türkçe karakterler dahil)
- Duplicate kelimeler atlanır
- Geçersiz kelimeler atlanır

**Örnek:**
```typescript
const result = await invoke<ImportResult>('import_category_json', {
  category_id: 1,
  json_data: exportData // CategoryExportData formatında
});

console.log(result.message);
// "15 kelime eklendi, 3 kelime zaten vardı veya geçersizdi"
```

---

## Kelime Komutları

### 1. `get_words_by_category`

Kategoriye ait tüm kelimeleri getirir.

**Parametreler:**
- `category_id` (number) - Kategori ID'si

**Dönüş:** `Promise<Word[]>`

**Sıralama:** Harf sayısı (artan), sonra alfabetik

**Örnek:**
```typescript
const words = await invoke<Word[]>('get_words_by_category', { category_id: 1 });
console.log(words.length); // 84
```

---

### 2. `add_word`

Kategoriye yeni kelime ekler.

**Parametreler:**
- `category_id` (number) - Kategori ID'si
- `word` (string) - Kelime (otomatik uppercase'e çevrilir)
- `hint` (string) - İpucu metni

**Dönüş:** `Promise<Word>`

**Validasyon:**
- 4-10 harf arasında olmalı
- Sadece harfler (A-Z, Türkçe karakterler)
- Otomatik uppercase

**Hatalar:**
- `ValidationError` - Kelime uzunluğu 4-10 değilse

**Örnek:**
```typescript
const newWord = await invoke<Word>('add_word', {
  category_id: 1,
  word: 'aslan', // Otomatik "ASLAN" olur
  hint: 'Ormanların kralı'
});
```

---

### 3. `update_word`

Mevcut kelimeyi günceller.

**Parametreler:**
- `id` (number) - Kelime ID'si
- `word` (string) - Yeni kelime
- `hint` (string) - Yeni ipucu

**Dönüş:** `Promise<Word>`

**Hatalar:**
- `ValidationError` - Geçersiz kelime
- `NotFoundError` - Kelime bulunamazsa

**Örnek:**
```typescript
const updated = await invoke<Word>('update_word', {
  id: 10,
  word: 'KAPLAN',
  hint: 'Çizgili yırtıcı'
});
```

---

### 4. `delete_word`

Kelimeyi siler.

**Parametreler:**
- `id` (number) - Kelime ID'si

**Dönüş:** `Promise<void>`

**Hatalar:**
- `NotFoundError` - Kelime bulunamazsa

**Örnek:**
```typescript
await invoke('delete_word', { id: 10 });
```

---

### 5. `get_random_words`

Oyun için rastgele kelime seçer.

**Parametreler:**
- `category_id` (number) - Kategori ID'si
- `exclude_ids` (number[]) - Hariç tutulacak kelime ID'leri (çoklu oyuncuda kullanılır)

**Dönüş:** `Promise<Word[]>` - Tam olarak 14 kelime

**Seçim Algoritması:**
- Her harf uzunluğundan (4-10) tam 2 kelime seçilir
- Toplam 14 kelime döner
- **Kelimeler harf sayısına göre SIRALANIR (4,4,5,5,6,6,7,7,8,8,9,9,10,10)**
- Her çift içindeki kelimeler rastgele seçilir (RANDOM())
- `exclude_ids` listesindeki kelimeler seçilmez
- **NOT:** Eski versiyonda shuffle yapılıyordu, artık yapılmıyor (oyun kuralları gereği)

**Hatalar:**
- `ValidationError` - Yeterli kelime yoksa

**Örnek:**
```typescript
// Tek oyunculu - exclude yok
const words = await invoke<Word[]>('get_random_words', {
  category_id: 1,
  exclude_ids: []
});
console.log(words.length); // 14

// Çoklu oyuncu - ilk oyuncunun kelimelerini hariç tut
const player2Words = await invoke<Word[]>('get_random_words', {
  category_id: 1,
  exclude_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
});
```

---

### 6. `validate_category_for_mode`

Kategorinin belirli mod ve katılımcı sayısı için uygun olup olmadığını kontrol eder.

**Parametreler:**
- `category_id` (number) - Kategori ID'si
- `mode` (string) - Oyun modu: "single", "multi", "team"
- `participant_count` (number) - Katılımcı/takım sayısı

**Dönüş:** `Promise<boolean>`

**Hesaplama:**
- Her katılımcı için 14 kelime gerekir
- Her harf uzunluğundan katılımcı sayısı × 2 kelime gerekir

**Örnek:**
```typescript
const isValid = await invoke<boolean>('validate_category_for_mode', {
  category_id: 1,
  mode: 'multi',
  participant_count: 4
});

if (!isValid) {
  alert('Bu kategori 4 oyuncu için yetersiz!');
}
```

---

## Ayarlar Komutları

### 1. `get_settings`

Tüm uygulama ayarlarını getirir.

**Parametreler:** Yok

**Dönüş:** `Promise<Settings>` - Key-value map

**Varsayılan Ayarlar:**
- `sound_enabled`: "true"
- `effects_volume`: "80"
- `animation_speed`: "normal"
- `theme`: "dark"
- `language`: "tr"
- `show_hints`: "true"
- `show_tutorial`: "true"

**Örnek:**
```typescript
const settings = await invoke<Settings>('get_settings');
console.log(settings.sound_enabled); // "true"
console.log(settings.effects_volume); // "80"
```

**TypeScript Type:**
```typescript
type Settings = Record<string, string>;
```

---

### 2. `update_setting`

Tek bir ayarı günceller veya oluşturur.

**Parametreler:**
- `key` (string) - Ayar anahtarı
- `value` (string) - Ayar değeri

**Dönüş:** `Promise<void>`

**Not:** Ayar yoksa oluşturur, varsa günceller (UPSERT)

**Örnek:**
```typescript
// Ses seviyesini güncelle
await invoke('update_setting', {
  key: 'effects_volume',
  value: '60'
});

// Yeni ayar oluştur
await invoke('update_setting', {
  key: 'custom_setting',
  value: 'my_value'
});
```

---

## Veritabanı Komutları

### 1. `backup_database`

Veritabanını dosyaya yedekler.

**Parametreler:**
- `backup_path` (string) - Yedek dosyasının tam yolu

**Dönüş:** `Promise<string>` - Başarı mesajı

**Hatalar:**
- `DatabaseError` - Veritabanı bulunamazsa veya kopyalanamazsa

**Örnek:**
```typescript
import { save } from '@tauri-apps/plugin-dialog';

// Kullanıcıdan dosya yolu al
const filePath = await save({
  filters: [{
    name: 'Database',
    extensions: ['db']
  }]
});

if (filePath) {
  const message = await invoke<string>('backup_database', {
    backup_path: filePath
  });
  console.log(message); // "Database backed up successfully to: ..."
}
```

**Yedeklenen Veriler:**
- Tüm kategoriler
- Tüm kelimeler
- Tüm oyun geçmişi
- Tüm ayarlar

---

### 2. `restore_database`

Yedek dosyasından veritabanını geri yükler.

**Parametreler:**
- `restore_path` (string) - Yedek dosyasının tam yolu

**Dönüş:** `Promise<string>` - Başarı mesajı

**Hatalar:**
- `DatabaseError` - Yedek dosyası bulunamazsa

**ÖNEMLİ:**
- Mevcut tüm veriler silinir!
- Otomatik güvenlik yedeği oluşturulur (`word-game_pre_restore.db`)
- Uygulama yeniden başlatılmalıdır

**Örnek:**
```typescript
import { open } from '@tauri-apps/plugin-dialog';

// Kullanıcıdan yedek dosyası seç
const filePath = await open({
  filters: [{
    name: 'Database',
    extensions: ['db']
  }]
});

if (filePath) {
  const confirmed = confirm('TÜM veriler silinecek! Devam edilsin mi?');
  if (confirmed) {
    const message = await invoke<string>('restore_database', {
      restore_path: filePath
    });
    console.log(message);
    // Uygulamayı yeniden başlat
    window.location.reload();
  }
}
```

---

### 3. `reset_all_data`

Tüm verileri siler ve varsayılanlara döner.

**Parametreler:** Yok

**Dönüş:** `Promise<string>` - Başarı mesajı

**ÖNEMLİ:**
- Tüm kategoriler silinir (varsayılan "Genel" hariç)
- Tüm kelimeler silinir
- Tüm oyun geçmişi silinir
- Ayarlar varsayılanlara döner
- GERİ ALINAMAZ!

**Örnek:**
```typescript
const confirmed = confirm('TÜM veriler silinecek! Bu işlem geri alınamaz!');
if (confirmed) {
  const message = await invoke<string>('reset_all_data');
  console.log(message);
  // "All data has been reset to defaults..."

  // Uygulamayı yeniden başlat
  window.location.reload();
}
```

---

### 4. `get_database_size`

Veritabanı dosyasının boyutunu döner.

**Parametreler:** Yok

**Dönüş:** `Promise<number>` - Boyut (bytes)

**Örnek:**
```typescript
const sizeBytes = await invoke<number>('get_database_size');
const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);
console.log(`Database size: ${sizeMB} MB`);
```

---

## Oyun Geçmişi Komutları

### 1. `get_all_game_history`

Tüm oyun geçmişini filtrelerle getirir.

**Parametreler:**
- `category_id` (number | null) - Kategoriye göre filtrele
- `game_mode` (string | null) - Moda göre filtrele ("single", "multi", "team")
- `start_date` (string | null) - Başlangıç tarihi (YYYY-MM-DD)
- `end_date` (string | null) - Bitiş tarihi (YYYY-MM-DD)
- `sort_by` (string | null) - Sıralama: "date_desc" (varsayılan), "date_asc", "score_desc"
- `limit` (number | null) - Maksimum kayıt sayısı (varsayılan: 50)
- `offset` (number | null) - Başlangıç offset (sayfalama için, varsayılan: 0)

**Dönüş:** `Promise<GameHistory[]>`

**Örnek:**
```typescript
// Tüm oyunlar (son 50)
const allGames = await invoke<GameHistory[]>('get_all_game_history', {
  category_id: null,
  game_mode: null,
  start_date: null,
  end_date: null,
  sort_by: null,
  limit: null,
  offset: null
});

// Bugünkü çoklu oyuncu oyunları
const todayMulti = await invoke<GameHistory[]>('get_all_game_history', {
  category_id: null,
  game_mode: 'multi',
  start_date: '2025-10-30',
  end_date: '2025-10-30',
  sort_by: 'date_desc',
  limit: 20,
  offset: 0
});

// Sayfalama (2. sayfa)
const page2 = await invoke<GameHistory[]>('get_all_game_history', {
  category_id: null,
  game_mode: null,
  start_date: null,
  end_date: null,
  sort_by: 'date_desc',
  limit: 50,
  offset: 50 // 2. sayfa için 50 offset
});
```

---

### 2. `get_game_history_by_id`

ID'ye göre tek bir oyun kaydı getirir.

**Parametreler:**
- `id` (number) - Oyun ID'si

**Dönüş:** `Promise<GameHistory>`

**Hatalar:**
- `NotFoundError` - Oyun bulunamazsa

**Örnek:**
```typescript
const game = await invoke<GameHistory>('get_game_history_by_id', { id: 5 });
console.log(game.category_name); // "Hayvanlar"
console.log(game.game_mode); // "multi"
```

---

### 3. `get_game_participants`

Oyundaki katılımcıları getirir.

**Parametreler:**
- `game_history_id` (number) - Oyun ID'si

**Dönüş:** `Promise<GameParticipant[]>`

**Sıralama:** Sıralama (rank) ve puana göre

**Örnek:**
```typescript
const participants = await invoke<GameParticipant[]>('get_game_participants', {
  game_history_id: 5
});

participants.forEach(p => {
  console.log(`${p.rank}. ${p.participant_name}: ${p.score} puan`);
});
// "1. Ahmet: 4200 puan"
// "2. Mehmet: 3800 puan"
```

---

### 4. `get_participant_word_results`

Katılımcının kelime sonuçlarını getirir.

**Parametreler:**
- `participant_id` (number) - Katılımcı ID'si

**Dönüş:** `Promise<GameWordResult[]>`

**Örnek:**
```typescript
const wordResults = await invoke<GameWordResult[]>('get_participant_word_results', {
  participant_id: 10
});

wordResults.forEach(wr => {
  console.log(`${wr.word}: ${wr.result} (${wr.points_earned} puan, ${wr.letters_used} harf)`);
});
// "ASLAN: correct (500 puan, 0 harf)"
// "KELEBEK: wrong (0 puan, 3 harf)"
```

---

### 5. `get_game_history_stats`

Oyun geçmişi istatistiklerini getirir.

**Parametreler:** Yok

**Dönüş:** `Promise<GameHistoryStats>`

**GameHistoryStats İçeriği:**
- `total_games` (number) - Toplam oyun sayısı
- `most_played_category` (tuple | null) - En çok oynanan kategori [ad, emoji]
- `highest_score` (number) - En yüksek puan
- `total_play_time_seconds` (number) - Toplam oyun süresi (saniye)

**Örnek:**
```typescript
const stats = await invoke<GameHistoryStats>('get_game_history_stats');
console.log(`Toplam ${stats.total_games} oyun oynandı`);
console.log(`En yüksek puan: ${stats.highest_score}`);
if (stats.most_played_category) {
  console.log(`En popüler: ${stats.most_played_category[1]} ${stats.most_played_category[0]}`);
}
```

---

### 6. `delete_game_history`

Tek bir oyun kaydını siler.

**Parametreler:**
- `id` (number) - Oyun ID'si

**Dönüş:** `Promise<void>`

**Hatalar:**
- `NotFoundError` - Oyun bulunamazsa

**Not:** Cascade delete - katılımcılar ve kelime sonuçları da silinir

**Örnek:**
```typescript
await invoke('delete_game_history', { id: 5 });
```

---

### 7. `delete_all_game_history`

Tüm oyun geçmişini siler.

**Parametreler:** Yok

**Dönüş:** `Promise<void>`

**ÖNEMLİ:** Tüm oyun kayıtları silinir, geri alınamaz!

**Örnek:**
```typescript
const confirmed = confirm('TÜM oyun geçmişi silinecek!');
if (confirmed) {
  await invoke('delete_all_game_history');
}
```

---

### 8. `save_game_to_history`

Tamamlanan oyunu geçmişe kaydeder.

**Parametreler:**
- `session` (GameSessionData) - Oyun oturumu verisi

**Dönüş:** `Promise<number>` - Oluşturulan game_history_id

**GameSessionData Yapısı:**
```typescript
interface GameSessionData {
  category_id: number;
  category_name: string;
  game_mode: 'single' | 'multi' | 'team';
  played_at: string; // ISO timestamp
  total_time_seconds: number | null;
  participants: ParticipantData[];
}

interface ParticipantData {
  name: string;
  participant_type: 'player' | 'team';
  score: number;
  words_found: number;
  words_skipped: number;
  letters_revealed: number;
  rank: number | null;
  word_results: WordResultData[];
}

interface WordResultData {
  word: string;
  word_hint: string | null;
  result: 'correct' | 'wrong' | 'skipped';
  points_earned: number;
  letters_used: number;
}
```

**Örnek:**
```typescript
const gameHistoryId = await invoke<number>('save_game_to_history', {
  session: {
    category_id: 1,
    category_name: 'Hayvanlar',
    game_mode: 'single',
    played_at: new Date().toISOString(),
    total_time_seconds: 240,
    participants: [
      {
        name: 'Ahmet',
        participant_type: 'player',
        score: 4200,
        words_found: 12,
        words_skipped: 2,
        letters_revealed: 8,
        rank: 1,
        word_results: [
          {
            word: 'ASLAN',
            word_hint: 'Ormanların kralı',
            result: 'correct',
            points_earned: 500,
            letters_used: 0
          },
          // ... 13 kelime daha
        ]
      }
    ]
  }
});

console.log(`Oyun kaydedildi, ID: ${gameHistoryId}`);
```

---

## Veri Modelleri

### Category

```typescript
interface Category {
  id: number;
  name: string;
  emoji: string;
  description: string | null;
  is_default: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
```

### Word

```typescript
interface Word {
  id: number;
  category_id: number;
  word: string; // Always UPPERCASE
  letter_count: number; // 4-10
  hint: string | null;
  created_at: string; // ISO timestamp
}
```

### ValidationResult

```typescript
interface ValidationResult {
  is_valid: boolean;
  total_words: number;
  words_by_length: WordCountByLength[];
  max_players_single: number; // 0 or 1
  max_players_multi: number;
  max_teams: number;
  message: string;
}

interface WordCountByLength {
  letter_count: number; // 4-10
  count: number;
}
```

### CategoryExportData

```typescript
interface CategoryExportData {
  category: {
    name: string;
    emoji: string;
    description: string | null;
  };
  words: Array<{
    word: string;
    letter_count: number;
    hint: string | null;
  }>;
}
```

### ImportResult

```typescript
interface ImportResult {
  words_added: number;
  words_skipped: number;
  message: string;
}
```

### Settings

```typescript
type Settings = Record<string, string>;
```

### GameHistory

```typescript
interface GameHistory {
  id: number;
  category_id: number;
  category_name: string;
  game_mode: 'single' | 'multi' | 'team';
  played_at: string; // ISO timestamp
  total_time_seconds: number | null;
  created_at: string; // ISO timestamp
}
```

### GameParticipant

```typescript
interface GameParticipant {
  id: number;
  game_history_id: number;
  participant_name: string;
  participant_type: 'player' | 'team';
  score: number;
  words_found: number;
  words_skipped: number;
  letters_revealed: number;
  rank: number | null;
  created_at: string; // ISO timestamp
}
```

### GameWordResult

```typescript
interface GameWordResult {
  id: number;
  game_history_id: number;
  participant_id: number;
  word: string;
  word_hint: string | null;
  result: 'correct' | 'wrong' | 'skipped';
  points_earned: number;
  letters_used: number;
  created_at: string; // ISO timestamp
}
```

### GameHistoryStats

```typescript
interface GameHistoryStats {
  total_games: number;
  most_played_category: [string, string] | null; // [name, emoji]
  highest_score: number;
  total_play_time_seconds: number;
}
```

---

## Hata Yönetimi

Tüm Tauri command'leri `Result<T, AppError>` döner. Hata durumunda Promise reject olur.

### Hata Tipleri

```typescript
type AppError =
  | { DatabaseError: string }
  | { NotFoundError: string }
  | { ValidationError: string }
  | { SerializationError: string }
  | { Other: string };
```

### Hata Yakalama

```typescript
try {
  const category = await invoke<Category>('get_category_by_id', { id: 999 });
} catch (error) {
  console.error('Hata:', error);
  // error = { NotFoundError: "Kategori bulunamadı" }

  if (typeof error === 'object' && error !== null) {
    if ('NotFoundError' in error) {
      alert('Kategori bulunamadı!');
    } else if ('ValidationError' in error) {
      alert('Validasyon hatası: ' + error.ValidationError);
    } else if ('DatabaseError' in error) {
      alert('Veritabanı hatası: ' + error.DatabaseError);
    }
  }
}
```

### Önerilen Hata İşleme Pattern'i

```typescript
// Error handler utility
function handleTauriError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    if ('NotFoundError' in error) return error.NotFoundError as string;
    if ('ValidationError' in error) return error.ValidationError as string;
    if ('DatabaseError' in error) return error.DatabaseError as string;
    if ('SerializationError' in error) return error.SerializationError as string;
    if ('Other' in error) return error.Other as string;
  }
  return 'Bilinmeyen hata';
}

// Kullanım
try {
  await invoke('delete_category', { id: 1 });
} catch (error) {
  const message = handleTauriError(error);
  toast.error(message);
}
```

---

## Best Practices

### 1. Type Safety

Tüm invoke çağrılarında generic type kullanın:

```typescript
// ✅ İyi
const categories = await invoke<Category[]>('get_all_categories');

// ❌ Kötü
const categories = await invoke('get_all_categories');
```

### 2. Error Handling

Her invoke çağrısını try-catch ile sarın:

```typescript
try {
  const result = await invoke('some_command', params);
} catch (error) {
  handleTauriError(error);
}
```

### 3. Loading States

Async işlemler için loading state kullanın:

```typescript
const [loading, setLoading] = useState(false);

const loadCategories = async () => {
  setLoading(true);
  try {
    const categories = await invoke<Category[]>('get_all_categories');
    setCategories(categories);
  } catch (error) {
    toast.error(handleTauriError(error));
  } finally {
    setLoading(false);
  }
};
```

### 4. Reactive Updates

Veri değişikliklerinde state'i güncelleyin:

```typescript
const createCategory = async (data: NewCategory) => {
  const newCategory = await invoke<Category>('create_category', data);
  setCategories(prev => [...prev, newCategory]);
};
```

### 5. Caching

Sık kullanılan verileri cache edin (Zustand store):

```typescript
// categoryStore.ts
const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loaded: false,

  loadCategories: async () => {
    if (get().loaded) return; // Cache check

    const categories = await invoke<Category[]>('get_all_categories');
    set({ categories, loaded: true });
  },

  invalidate: () => set({ loaded: false })
}));
```

---

## Örnek Kullanım Senaryoları

### Senaryo 1: Yeni Kategori Oluştur ve Kelime Ekle

```typescript
// 1. Kategori oluştur
const category = await invoke<Category>('create_category', {
  name: 'Meyveler',
  emoji: '🍎',
  description: 'Meyve isimleri'
});

// 2. Kelimeleri ekle
const words = ['ELMA', 'ARMUT', 'KİRAZ', 'MUZ'];
for (const word of words) {
  await invoke<Word>('add_word', {
    category_id: category.id,
    word,
    hint: `${word} bir meyvedir`
  });
}

// 3. Validasyon kontrolü
const validation = await invoke<ValidationResult>('validate_category', {
  id: category.id
});
console.log(validation.message);
```

### Senaryo 2: Oyun Başlat ve Kaydet

```typescript
// 1. Kategori validasyonu
const isValid = await invoke<boolean>('validate_category_for_mode', {
  category_id: 1,
  mode: 'single',
  participant_count: 1
});

if (!isValid) {
  throw new Error('Kategori yetersiz!');
}

// 2. Rastgele kelimeler al
const words = await invoke<Word[]>('get_random_words', {
  category_id: 1,
  exclude_ids: []
});

// 3. Oyunu oyna...
// (Oyun mantığı)

// 4. Oyunu kaydet
const gameId = await invoke<number>('save_game_to_history', {
  session: {
    category_id: 1,
    category_name: 'Hayvanlar',
    game_mode: 'single',
    played_at: new Date().toISOString(),
    total_time_seconds: 240,
    participants: [/* ... */]
  }
});
```

### Senaryo 3: JSON Import/Export

```typescript
// Export
const exportData = await invoke<CategoryExportData>('export_category_json', {
  category_id: 1
});

const json = JSON.stringify(exportData, null, 2);
const blob = new Blob([json], { type: 'application/json' });
// Dosya kaydetme...

// Import
const file = /* kullanıcıdan seçilen dosya */;
const text = await file.text();
const data = JSON.parse(text) as CategoryExportData;

const result = await invoke<ImportResult>('import_category_json', {
  category_id: 2,
  json_data: data
});
console.log(result.message);
```

---

**Son Güncelleme:** 2025-10-30
**Versiyon:** 1.0.0

## İlgili Dokümantasyon

- [README.md](../README.md) - Proje genel bakış
- [USER_GUIDE.md](USER_GUIDE.md) - Kullanıcı rehberi
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Geliştirici rehberi
- [ARCHITECTURE.md](ARCHITECTURE.md) - Sistem mimarisi

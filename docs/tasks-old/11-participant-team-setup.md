# Task 11: Participant and Team Setup

## Description
Implement participant/team configuration screens for different game modes.

## Requirements from PRD
- **Section:** 4.4 Yarışmacı/Takım Ayarlama

## Single Player Mode
- İsim girişi
- "Başla" butonu

## Multi Player Mode (2-6 players)
- 2-6 yarışmacı isim girişi
- Dinamik ekle/çıkar butonları
- Sıralama değiştirme (drag & drop)
- Kelime sayısı kontrolü: "Bu mod için X kelime gerekli, kategoride Y kelime var"
- "Başla" butonu

## Team Mode (2-4 teams)
- 2-4 takım oluşturma
- Her takım için:
  - Takım adı girişi
  - Takım rengi/emoji seçimi
  - Takım oyuncuları ekleme (2-4 oyuncu/takım)
    - Her oyuncunun adı
    - Oyuncu sırası (takım içinde kim önce oynayacak)
- Toplam kelime sayısı kontrolü
- "Başla" butonu

## Example Team UI
```
┌─────────────────────────────────┐
│ Takım 1: 🔴 Kırmızı Takım       │
│ Oyuncular:                      │
│  1. Ali                         │
│  2. Ayşe                        │
│  3. Mehmet                      │
│  [+ Oyuncu Ekle]                │
└─────────────────────────────────┘

Gerekli kelime: 28 | Mevcut: 42 ✓
```

## Acceptance Criteria
- [ ] Single player name input works
- [ ] Multi player: add/remove participants (2-6)
- [ ] Multi player: drag & drop reordering
- [ ] Team mode: create 2-4 teams
- [ ] Team mode: add players to each team
- [ ] Team mode: team name and emoji selection
- [ ] Word count validation displayed
- [ ] Start button enabled only when valid
- [ ] All inputs validated before proceeding

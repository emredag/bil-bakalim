# Task 13: Word Selection Algorithm

## Description
Implement word selection algorithm for different game modes ensuring fair distribution.

## Requirements from PRD
- **Section:** 4.6 Oyun Mekanikleri → Kelime Seçim Algoritması

## Single Player
- Kategoriden rastgele 14 kelime seçilir
- Her uzunluktan 2'şer kelime (4-10 harf)
- Karışık sırada sunulur

## Multi Player
- Her yarışmacı için ayrı 14 kelime seçilir
- Toplam (yarışmacı sayısı × 14) kelime gerekir
- Kelimelerin tekrar etmemesi sağlanır
- Her yarışmacı kendi kelime setini görür
- Sıra değişiminde yarışmacıya özel kelimeler gösterilir

## Team Mode
- Her takım için ayrı 14 kelime seçilir
- Toplam (takım sayısı × 14) kelime gerekir
- Kelimelerin tekrar etmemesi sağlanır
- Takım oyuncuları aynı kelimeleri görür ama farklı takımlar farklı kelimeler görür

## Algorithm Requirements
- Ensure 2 words per letter count (4-10)
- No duplicate words across participants/teams
- Random shuffle for presentation
- Balanced difficulty distribution

## Acceptance Criteria
- [ ] Single player gets 14 unique words
- [ ] 2 words per letter count (4-10)
- [ ] Multi player: each player gets different 14 words
- [ ] Team mode: each team gets different 14 words
- [ ] No duplicates across participants
- [ ] Words shuffled randomly
- [ ] Algorithm validates category has enough words

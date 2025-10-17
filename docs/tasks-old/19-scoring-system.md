# Task 19: Scoring System

## Description
Implement scoring system with point calculation and tie-breaking rules.

## Requirements from PRD
- **Section:** 9. PUANLAMA SİSTEMİ

## Point Formula
```
basePuan = harfSayisi × 100
toplamCeza = alinanHarfSayisi × 100
netPuan = max(0, basePuan - toplamCeza)
```

## Example
- 8 harfli kelime: 800 puan
- 2 harf açıldı: -200 puan
- Net puan: 600

## Score Table
| Harf | Temel | 0 Harf | 1 Harf | 2 Harf | 3 Harf | 4 Harf |
|------|-------|--------|--------|--------|--------|--------|
| 4    | 400   | 400    | 300    | 200    | 100    | 0      |
| 5    | 500   | 500    | 400    | 300    | 200    | 100    |
| 6    | 600   | 600    | 500    | 400    | 300    | 200    |
| 7    | 700   | 700    | 600    | 500    | 400    | 300    |
| 8    | 800   | 800    | 700    | 600    | 500    | 400    |
| 9    | 900   | 900    | 800    | 700    | 600    | 500    |
| 10   | 1000  | 1000   | 900    | 800    | 700    | 600    |

## Tie-Breaking Rules (Eşitlik)
1. **En yüksek toplam puan** alan yarışmacı kazanır
2. Puanlar eşitse → **Daha az harf açan** kazanır
3. Hâlâ eşitse → **Daha kısa sürede bitiren** kazanır
4. Son çare → **Berabere** ilan edilir

## Acceptance Criteria
- [ ] Point calculation formula implemented
- [ ] Base points = letter_count × 100
- [ ] Penalty = letters_revealed × 100
- [ ] Net points = max(0, base - penalty)
- [ ] Score updates in real-time
- [ ] Tie-breaking rules implemented correctly
- [ ] Rankings calculated accurately

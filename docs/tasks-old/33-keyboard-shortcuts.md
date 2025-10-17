# Task 33: Keyboard Shortcuts

## Description
Implement keyboard shortcuts for all game screens and actions.

## Requirements from PRD
- **Section:** 11. KLAVYE KISAYOLLARI

## Global Shortcuts
| Tuş Kombinasyonu | İşlev | Ekran |
|------------------|-------|-------|
| `F11` | Tam ekran aç/kapat | Tüm ekranlar |
| `Ctrl/Cmd + Q` | Uygulamadan çık | Tüm ekranlar |
| `Ctrl/Cmd + ,` | Ayarlar | Tüm ekranlar |
| `Esc` | Geri / İptal | Tüm ekranlar |

## Game Screen Shortcuts
| Tuş | İşlev | Açıklama |
|-----|-------|----------|
| `H` | Harf Aç | Rastgele harf açar |
| `T` | Tahmin Et | Tahmin popup'ı açar |
| `P` | Pas Geç | Pas geçme onayı ister |
| `Space` | Duraklat/Devam | Oyunu duraklat |
| `M` | Ses Aç/Kapat | Ses toggle |
| `Esc` | Ana Menü | Onaylı çıkış |

## Popup/Dialog Shortcuts
| Tuş | İşlev | Kullanım |
|-----|-------|----------|
| `D` / `Enter` | Doğru | Tahmin popup'ında |
| `Y` / `N` | Yanlış | Tahmin popup'ında |
| `Enter` | Onayla | Tüm onay dialog'larında |
| `Esc` | İptal | Tüm dialog'larda |

## Category/Word Management
| Tuş Kombinasyonu | İşlev |
|------------------|-------|
| `Ctrl/Cmd + N` | Yeni kategori/kelime |
| `Ctrl/Cmd + S` | Kaydet (form'larda) |
| `Ctrl/Cmd + F` | Arama (listelerde) |

## Acceptance Criteria
- [ ] F11 toggles fullscreen
- [ ] Ctrl/Cmd+Q quits app
- [ ] Ctrl/Cmd+, opens settings
- [ ] Esc goes back/cancels
- [ ] H key reveals letter in game
- [ ] T key opens guess popup
- [ ] P key skips word
- [ ] Space pauses/resumes game
- [ ] M key toggles sound
- [ ] D/Enter confirms correct guess
- [ ] Y/N for wrong guess
- [ ] Ctrl/Cmd+N creates new item
- [ ] Ctrl/Cmd+S saves forms
- [ ] Ctrl/Cmd+F focuses search
- [ ] All shortcuts work correctly
- [ ] No conflicts between shortcuts

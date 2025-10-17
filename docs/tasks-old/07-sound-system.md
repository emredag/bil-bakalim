# Task 07: Sound System

## Description
Implement Web Audio API based sound system with all required sound effects.

## Requirements from PRD
- **Section:** 10. SES SİSTEMİ

## Sound Effects (Web Audio API)

### 1. Harf Açma (Pop)
- Frequency: 440 Hz
- Duration: 0.1s
- Waveform: Sine
- Envelope: Quick attack, quick decay

### 2. Doğru Cevap (Başarı Jingle)
- Notalar: C5-E5-G5-C6
- Duration: 1s
- Waveform: Square
- Envelope: Medium attack, long release

### 3. Yanlış Cevap (Hata)
- Frequency: 200 Hz (düşük)
- Duration: 0.3s
- Waveform: Sawtooth
- Envelope: Sharp attack, medium decay

### 4. Pas Geç (Whoosh)
- White noise sweep
- Duration: 0.2s
- Filter: Low-pass (sliding)

### 5. Süre Uyarısı (Tick)
- Frequency: 880 Hz
- Duration: 0.05s
- Waveform: Square
- Interval: 1 saniye

### 6. Kazanma (Fanfare)
- Notalar: C4-E4-G4-C5-E5-G5
- Duration: 1.5s
- Waveform: Triangle
- Envelope: Medium attack, long release

### 7. Buton Click
- Frequency: 1000 Hz
- Duration: 0.05s
- Waveform: Sine

## Sound Settings
- Master volume slider (0-100%)
- Mute/Unmute toggle
- Settings saved in localStorage

## Sound Class Features
- AudioContext yönetimi
- Ses cache sistemi
- Volume kontrolü
- Fade in/out
- Ses pool (performans için)

## Acceptance Criteria
- [ ] AudioContext properly initialized
- [ ] All 7 sound effects implemented
- [ ] Volume control working
- [ ] Mute/unmute toggle working
- [ ] Sound settings persist in localStorage
- [ ] Sound caching for performance
- [ ] No audio glitches or delays

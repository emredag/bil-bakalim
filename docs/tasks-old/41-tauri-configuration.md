# Task 41: Tauri Configuration

## Description
Configure Tauri settings for window, security, and app metadata.

## Requirements from PRD
- **Section:** 17.2 Build Yapılandırması

## Tauri Config (`tauri.conf.json`)

### Uygulama Bilgileri
- App Name: "Kelime Oyunu"
- Version: "1.0.0"
- Identifier: "com.kelimeoyunu.app"

### Pencere Ayarları
- Başlangıç boyutu: 1920x1080
- Minimum boyut: 1280x720
- Resizable: true
- Fullscreen: true (F11)
- Title: "Kelime Oyunu"

### Güvenlik
- CSP: Default-src 'self'
- Dangling remote enable: false
- LocalStorage: enabled

### Platform Support
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Fedora, Debian)

## Acceptance Criteria
- [ ] tauri.conf.json configured correctly
- [ ] App name and version set
- [ ] Window size configured (1920x1080, min 1280x720)
- [ ] Fullscreen mode enabled
- [ ] CSP security policy set
- [ ] LocalStorage enabled
- [ ] Platform targets configured
- [ ] App identifier set
- [ ] All Tauri APIs properly allowed

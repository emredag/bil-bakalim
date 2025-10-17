# Task 46: Build and Packaging

## Description
Configure build process and create distributable packages for all platforms.

## Requirements from PRD
- **Section:** 17. KURULUM VE DAĞITIM
- **Section:** 17.4 Yayınlama

## Version Numbering
- Semantic versioning: MAJOR.MINOR.PATCH
- Örnek: 1.0.0 (ilk stabil sürüm)

## Distribution Channels
- GitHub Releases (tüm platformlar)
- Windows: Portable EXE + MSI installer
- macOS: DMG + .app bundle
- Linux: AppImage + .deb + .rpm

## Build Targets
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Fedora, Debian)

## Package Sizes
- Windows: ~20 MB
- macOS: ~25 MB
- Linux: ~18 MB

## Acceptance Criteria
- [ ] Build process configured for all platforms
- [ ] Windows: EXE and MSI installer created
- [ ] macOS: DMG and .app bundle created
- [ ] Linux: AppImage, .deb, .rpm created
- [ ] Version number set to 1.0.0
- [ ] All builds tested on target platforms
- [ ] Package sizes within targets
- [ ] Installers work correctly
- [ ] Digital signatures (optional but recommended)
- [ ] GitHub Releases configured

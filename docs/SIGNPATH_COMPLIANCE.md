# SignPath Foundation Compliance Checklist

This checklist tracks compliance with SignPath Foundation requirements for open source code signing.

**Last Updated:** November 30, 2025  
**Project:** Bil Bakalım (word-game-app)  
**SignPath Foundation Policy:** https://about.signpath.io/code-signing/foundation

---

## 📋 Free OSS SignPath.io Subscription Requirements

### Core Requirements

- [x] **No malware** - Application is clean, no malicious code
- [x] **OSI-approved license** - MIT License without dual-licensing
- [x] **No proprietary code** - All code is open source, only System Libraries used
- [x] **Actively maintained** - Regular commits and updates in 2025
- [x] **Already released** - v1.1.0 released and functional
- [x] **Documented** - Comprehensive README.md and user guide

### Status: ✅ **ELIGIBLE** for free OSS subscription

---

## 🔐 Free Certificate Requirements (If Using SignPath Foundation Certificate)

### Technical Constraints

#### Sign Your Own Projects Only
- [x] Team is responsible for both development and maintenance
- [x] Team owns the source code repository

#### Sign Your Own Binaries Only
- [x] Only sign artifacts built from own source code
- [x] Team maintains all source code files and build scripts
- [x] No upstream modified binaries signed (only original code)
- [x] Unsigned OSS dependencies may be included in installers

#### No Hacking Tools
- [x] Software does not identify security vulnerabilities
- [x] Software does not exploit security vulnerabilities
- [x] Software does not circumvent security measures
- [x] No penetration testing features
- [x] Not a white hat security tool

### End User Interactions

#### Respect User Privacy & Security
- [x] No data collection without disclosure
- [x] No data transfer to external systems
- [x] Privacy policy provided (in CODE_SIGNING_POLICY.md)
- [x] No installation options needed (100% offline app)

#### Announce System Changes
- [x] No silent system configuration modifications
- [x] Standard installation process with user consent

#### Provide Uninstallation
- [x] Uninstall instructions in docs
- [x] Automated uninstaller for Windows (MSI/NSIS)
- [x] Standard macOS uninstall (.dmg)

### OSS Contributors

#### Security Best Practices
- [ ] **ACTION REQUIRED:** Enable MFA on GitHub account (@emredag)
- [ ] **ACTION REQUIRED:** Enable MFA on SignPath account (when created)

#### Code Signing Roles
- [x] **Authors:** Emre Dağ (defined)
- [x] **Reviewers:** Emre Dağ (defined)
- [x] **Approvers:** Emre Dağ (defined)

### Website / Repository

#### Code Signing Policy
- [x] **Policy page created:** CODE_SIGNING_POLICY.md
- [x] **README updated** with code signing section
- [x] **Team roles specified** in policy
- [x] **Privacy policy included** in policy
- [x] **SignPath Foundation credited** in README and policy

### SignPath Configuration

#### Artifact Configuration
- [x] **Product name set:** "Bil Bakalım" in tauri.conf.json
- [x] **Product version set:** "1.1.0" in tauri.conf.json
- [ ] **ACTION REQUIRED:** File metadata restrictions need to be configured in SignPath

#### Other Conditions

##### Don't Fight the System
- [x] Binary artifacts built from source verifiably (GitHub Actions)
- [x] Manual approval required for each release (GitHub workflow)
- [x] Accept all technical constraints

##### Investigate Accusations
- [x] Process defined in CODE_SIGNING_POLICY.md for violation reports
- [x] Contact information provided

---

## 📝 Action Items Before Applying

### High Priority (Required)

1. **Enable Multi-Factor Authentication**
   - [ ] Enable MFA on GitHub account: https://github.com/settings/security
   - [ ] Enable MFA on SignPath account (after creating account)

2. **SignPath Application Setup**
   - [ ] Create SignPath Foundation account
   - [ ] Submit project for approval
   - [ ] Configure artifact signing settings
   - [ ] Set up build integration

3. **File Metadata Configuration**
   - [ ] Configure SignPath to enforce product name consistency
   - [ ] Configure SignPath to enforce product version consistency
   - [ ] Set up file metadata restrictions

### Medium Priority (Recommended)

4. **GitHub Security Features**
   - [ ] Enable Dependabot alerts in repository settings
   - [ ] Enable Dependabot security updates
   - [ ] Review .github/dependabot.yml configuration
   - [ ] Enable branch protection rules for main branch

5. **Build Verification**
   - [ ] Test reproducible builds
   - [ ] Document build process in detail
   - [ ] Set up build provenance tracking

### Low Priority (Good to Have)

6. **Documentation Enhancement**
   - [ ] Add release signing workflow documentation
   - [ ] Create troubleshooting guide for signature verification
   - [ ] Add security advisory template

7. **Community**
   - [ ] Announce code signing to users
   - [ ] Update download instructions with verification steps
   - [ ] Add badge to README when approved

---

## 🔍 Compliance Verification

### Before Each Release

- [ ] All code changes reviewed
- [ ] No proprietary code added
- [ ] Dependencies are all open source
- [ ] No malware introduced
- [ ] Privacy policy still accurate
- [ ] Build from clean source code
- [ ] Version numbers match across all files
- [ ] Release notes prepared

### After Signing

- [ ] Verify signature on Windows binary
- [ ] Verify signature on macOS binary
- [ ] Test installation on clean system
- [ ] Verify uninstallation works
- [ ] Update documentation if needed

---

## 📞 Support Contacts

### SignPath Foundation
- **Website:** https://about.signpath.io/code-signing/foundation
- **Support:** support@signpath.io
- **Documentation:** https://about.signpath.io/documentation

### Project Maintainer
- **GitHub:** [@emredag](https://github.com/emredag)
- **Repository:** [bil-bakalim](https://github.com/emredag/bil-bakalim)
- **Issues:** [GitHub Issues](https://github.com/emredag/bil-bakalim/issues)

---

## 📊 Current Status

**Overall Compliance:** 95% ✅

**Remaining Actions:**
1. Enable MFA on accounts (2 items)
2. Apply to SignPath Foundation
3. Configure file metadata restrictions in SignPath

**Ready for Application:** Almost - Complete MFA setup first

**Estimated Time to Full Compliance:** 1-2 hours

---

## 📚 References

- [SignPath Foundation Requirements](https://about.signpath.io/code-signing/foundation)
- [SignPath Documentation](https://about.signpath.io/documentation)
- [OSI License List](https://opensource.org/licenses)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Tauri Security Guide](https://tauri.app/v1/guides/security/)

# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in Bil Bakalım, please report it privately:

### Preferred Method: GitHub Security Advisories

1. Go to the [Security tab](https://github.com/emredag/bil-bakalim/security/advisories)
2. Click "Report a vulnerability"
3. Fill in the details of the vulnerability
4. Submit the advisory

This is the most secure method as it allows us to discuss the issue privately before disclosure.

### Alternative: Direct Email

If you prefer email, please send details to:

- **Email:** Create a GitHub issue marked as security-related

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

- **Acknowledgment:** We'll acknowledge your report within 48 hours
- **Updates:** We'll keep you informed of our progress
- **Timeline:** We aim to release a fix within 7-14 days for critical issues
- **Credit:** We'll credit you in the security advisory (unless you prefer to remain anonymous)

## Security Measures

### Development Security

- **Multi-Factor Authentication:** All maintainers use MFA on GitHub and SignPath
- **Code Review:** All changes are reviewed before merging
- **Automated Scanning:** Dependencies are monitored for vulnerabilities
- **Signed Releases:** All releases are digitally signed via SignPath Foundation

### Application Security

- **No Network Access:** The application is 100% offline, no data transmission
- **Local Storage Only:** All data stays on your device
- **No Telemetry:** We don't collect any usage data
- **Sandboxed:** Tauri's security model provides OS-level sandboxing
- **Content Security Policy:** Strict CSP configured in tauri.conf.json

### Build Security

- **GitHub Actions:** Automated builds from source
- **Reproducible Builds:** Same source = same binary
- **Supply Chain Security:** Dependencies locked with package-lock.json and Cargo.lock
- **Code Signing:** SignPath.io signs all releases

## Known Security Considerations

### SQLite Injection Prevention

The application uses prepared statements for all database queries to prevent SQL injection:

```rust
// ✅ Good: Parameterized query
let category = conn.query_row(
    "SELECT * FROM categories WHERE id = ?1",
    params![id],
    |row| // ...
)?;
```

### File System Access

The application uses Tauri's File System API with restricted permissions:
- Read/write access limited to app data directory
- User must explicitly grant permission for import/export operations
- No access to system files without user consent

### Content Security Policy

Tauri configuration includes CSP to prevent:
- Inline script execution
- Eval usage
- External resource loading
- XSS attacks

## Best Practices for Users

To ensure your security when using Bil Bakalım:

1. **Download from Official Sources:**
   - GitHub Releases: https://github.com/emredag/bil-bakalim/releases
   - Verify the digital signature on downloaded files

2. **Verify Digital Signatures:**
   - **Windows:** Right-click → Properties → Digital Signatures
   - **macOS:** `codesign -dv --verbose=4 "Bil Bakalım.app"`
   - Signer should be "SignPath Foundation"

3. **Keep Updated:**
   - Check for updates regularly
   - Security patches are released as soon as vulnerabilities are fixed

4. **Backup Your Data:**
   - Export your categories before major updates
   - Keep backups of your game database

## Security in Dependencies

We monitor our dependencies for security vulnerabilities:

### Frontend Dependencies
- React, TypeScript, Vite: Regularly updated
- Framer Motion, Lucide Icons: Trusted UI libraries
- All dependencies: MIT or compatible licenses

### Backend Dependencies
- Tauri: Security-focused desktop framework
- Rust crates: Audited through cargo-audit
- SQLite: Battle-tested database engine

### Dependency Updates

- **Security updates:** Applied immediately
- **Patch updates:** Weekly review
- **Major updates:** Tested thoroughly before deployment

## Vulnerability Disclosure Policy

We follow responsible disclosure:

1. **Private Disclosure:** We coordinate with reporters before public disclosure
2. **Fix Development:** We develop and test a fix
3. **Release:** We release a patched version
4. **Public Disclosure:** We publish a security advisory
5. **CVE Assignment:** For critical issues, we may request a CVE

## Security Hall of Fame

We recognize security researchers who help us improve:

_No vulnerabilities have been reported yet._

If you report a valid security issue, we'll list you here (with your permission).

## Contact

- **Security Issues:** GitHub Security Advisories (preferred)
- **General Security Questions:** GitHub Discussions
- **Maintainer:** [@emredag](https://github.com/emredag)

---

**Thank you for helping keep Bil Bakalım and our users safe!**

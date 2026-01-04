# Code Signing Policy

## Provider

**Free code signing provided by [SignPath.io](https://signpath.io), certificate by SignPath Foundation**

This project uses SignPath Foundation's free code signing service for open source projects. SignPath Foundation issues the certificate and is the official publisher listed in the signature.

---

## Team Structure & Roles

### Authors & Committers
Team members trusted to modify the source code in the project's version control system:

- **[Emre Dağ](https://github.com/emredag)** - Project Owner & Maintainer
  - All commits and merges
  - Repository ownership
  - Code reviews

### Reviewers
All code changes are reviewed before merging to the main branch:

- **[Emre Dağ](https://github.com/emredag)** - Primary Reviewer
- Pull requests from external contributors require review before merge

### Approvers
Team members authorized to approve releases for code signing:

- **[Emre Dağ](https://github.com/emredag)** - Release Signing Approver
  - Verifies release readiness
  - Approves SignPath signing requests
  - Creates GitHub releases

### Contact

- **GitHub:** [@emredag](https://github.com/emredag)
- **Repository:** [bil-bakalim](https://github.com/emredag/bil-bakalim)
- **Issues:** [GitHub Issues](https://github.com/emredag/bil-bakalim/issues)

---

## Privacy Policy

**This program will not transfer any information to other networked systems unless specifically requested by the user or the person installing or operating it.**

### Data Collection & Storage

Bil Bakalım is a completely **offline desktop application**:

- ✅ **No telemetry** - The application does not collect or send any usage data
- ✅ **No analytics** - No tracking of user behavior or statistics
- ✅ **No network communication** - The app operates 100% offline
- ✅ **Local storage only** - All data is stored locally in an SQLite database on your device
- ✅ **No user accounts** - No registration, login, or cloud services

### Data You Control

All data created within the application remains on your local device:

- Game history and statistics
- Categories and words you create
- Application settings and preferences
- Database backups (if you choose to create them)

### Third-Party Components

The application uses the following open source components. These libraries operate locally and do not transmit data:

| Component | License | Purpose | Privacy Impact |
|-----------|---------|---------|----------------|
| Tauri | MIT/Apache-2.0 | Desktop application framework | No data transmission |
| React | MIT | UI library | No data transmission |
| SQLite | Public Domain | Local database | Data stored locally only |
| Framer Motion | MIT | Animations | No data transmission |

For a complete list of dependencies, see:
- Frontend: [`package.json`](package.json)
- Backend: [`src-tauri/Cargo.toml`](src-tauri/Cargo.toml)

All dependencies are **open source** and operate **locally** without network access.

---

## Security & Verification

### Multi-Factor Authentication

All project maintainers with commit access and signing approval authority use multi-factor authentication (MFA) on:

- GitHub account (repository access)
- SignPath account (code signing approval)

### Build Verification

All signed releases are built through our automated CI/CD pipeline:

1. **Source Code**: All code is publicly visible at [github.com/emredag/bil-bakalim](https://github.com/emredag/bil-bakalim)
2. **Build Process**: GitHub Actions builds from tagged releases
3. **Signing**: SignPath.io signs the built artifacts
4. **Distribution**: Signed binaries published to [GitHub Releases](https://github.com/emredag/bil-bakalim/releases)

### Verification Steps

To verify a signed binary:

1. **Windows**: Right-click the .exe or .msi → Properties → Digital Signatures
   - Signer: "SignPath Foundation"
   - Timestamp: Should match release date
   
2. **macOS**: 
   ```bash
   codesign -dv --verbose=4 "Bil Bakalım.app"
   spctl -a -vv "Bil Bakalım.app"
   ```

3. **Check Release Authenticity**: 
   - Verify the release tag matches the version
   - Check commit SHA matches the tag
   - Verify release notes and changelog

---

## Code of Conduct

This project follows the [SignPath Foundation Code of Conduct](https://about.signpath.io/code-signing/foundation#code-of-conduct) and our own [Contributing Guidelines](CONTRIBUTING.md).

### Our Commitments

- ✅ **Sign our own projects only** - We maintain and develop this codebase
- ✅ **Sign our own binaries only** - All builds come from our source code
- ✅ **No malware** - Clean, educational software only
- ✅ **No hacking tools** - This is a word guessing game for education
- ✅ **Respect user privacy** - No data collection or transmission
- ✅ **Open source** - All code is publicly available under MIT License
- ✅ **Active maintenance** - Regular updates and security patches

### Upstream Dependencies

If we use upstream open source libraries in signed installers:
- We include only open source dependencies
- We prefer signed libraries when available
- We document all dependencies in our build files
- We follow dependency security best practices

### Reporting Violations

If you believe a signed binary from this project violates the SignPath Foundation Code of Conduct or contains malware, please report it immediately:

- **Security Issues**: Create a private security advisory on GitHub
- **SignPath Foundation**: support@signpath.io
- **Project Maintainer**: [GitHub Issues](https://github.com/emredag/bil-bakalim/issues)

We take all reports seriously and will investigate promptly.

---

## Signing Process

### Release Workflow

1. **Development**: Code changes are committed to feature branches
2. **Review**: Pull requests are reviewed and merged to `main`
3. **Version Tag**: A version tag (e.g., `v1.2.0`) is created
4. **Automated Build**: GitHub Actions triggers build for Windows and macOS
5. **SignPath Signing**: Artifacts are submitted to SignPath.io for signing
6. **Approval**: Project approver reviews and approves the signing request
7. **Release**: Signed binaries are published to GitHub Releases

### Manual Approval Required

Every release requires manual approval by a designated approver before signing. This ensures:

- Release notes are complete and accurate
- Version number is correct
- Build artifacts match the source code
- No security vulnerabilities in dependencies
- Release is ready for public distribution

---

## Compliance

This project complies with:

- **OSI Open Source Definition** - MIT License
- **SignPath Foundation Requirements** - Code of Conduct
- **No Proprietary Code** - All dependencies are open source
- **Build Transparency** - Public CI/CD pipeline
- **Privacy Regulations** - No data collection

---

## Changes to This Policy

This code signing policy may be updated as:
- SignPath Foundation requirements evolve
- Industry best practices change
- Project team structure changes

All updates will be committed to the repository and reflected in future releases.

**Last Updated:** November 30, 2025  
**Policy Version:** 1.0

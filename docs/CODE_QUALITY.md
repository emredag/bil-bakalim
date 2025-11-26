# Code Quality Standards

> **Task 45**: Code Quality Setup and Standards
> **PRD Reference**: Section 19.1 - Kod Kalitesi

This document outlines the code quality tools, standards, and practices for the Kelime Oyunu project.

---

## Table of Contents

- [Overview](#overview)
- [TypeScript/React Standards](#typescriptreact-standards)
- [Rust Standards](#rust-standards)
- [Available Commands](#available-commands)
- [Pre-commit Hooks](#pre-commit-hooks)
- [IDE Integration](#ide-integration)
- [Continuous Improvement](#continuous-improvement)

---

## Overview

The project uses automated tooling to ensure consistent code quality across TypeScript/React (frontend) and Rust (backend) codebases.

### Quality Tools

| Tool | Purpose | Config File |
|------|---------|-------------|
| **ESLint** | TypeScript/React linting | `.eslintrc.json` |
| **Prettier** | Code formatting | `.prettierrc` |
| **TypeScript** | Type checking | `tsconfig.json` |
| **Clippy** | Rust linting | `src-tauri/clippy.toml`, `Cargo.toml` |
| **rustfmt** | Rust formatting | `src-tauri/rustfmt.toml` |
| **Husky** | Git hooks | `.husky/` |
| **lint-staged** | Pre-commit automation | `package.json` |

---

## TypeScript/React Standards

### TypeScript Compiler Settings

Strict mode is enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

✅ **Status**: Fully configured and enforced

### ESLint Configuration

ESLint is configured with:
- TypeScript support (`@typescript-eslint`)
- React best practices (`eslint-plugin-react`)
- React Hooks rules (`eslint-plugin-react-hooks`)
- Accessibility checks (`eslint-plugin-jsx-a11y`)
- Prettier integration (`eslint-config-prettier`)

**Current Status**:
- **0 errors** ✅
- **278 warnings** ⚠️ (gradual improvement expected)

**Key Rules**:
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn
- All type safety rules: warn (not error, to allow gradual improvement)

### Prettier Configuration

Code formatting is automated with Prettier:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

✅ **Status**: All files formatted consistently

### Type Safety Improvements

**Completed**:
- Global type definitions for `window.webkitAudioContext`
- Removed critical `any` usages in audio services

**In Progress** (278 warnings):
- Form event handlers
- Error boundary types
- Framer Motion variant types
- React Hook dependencies

---

## Rust Standards

### Cargo Configuration

Linting rules are defined in `src-tauri/Cargo.toml`:

```toml
[lints.clippy]
all = "warn"
pedantic = "warn"
nursery = "warn"
cargo = "warn"

[lints.rust]
unsafe_code = "forbid"
unused_must_use = "warn"
```

✅ **unsafe_code**: FORBIDDEN - No unsafe code blocks allowed
✅ **Clippy**: Configured for comprehensive linting

### rustfmt Configuration

Consistent formatting enforced by `src-tauri/rustfmt.toml`:

```toml
edition = "2021"
max_width = 100
hard_tabs = false
tab_spaces = 4
newline_style = "Unix"
reorder_imports = true
```

---

## Available Commands

### TypeScript/React

```bash
# Linting
npm run lint                # Check for lint errors
npm run lint:fix            # Auto-fix lint errors

# Formatting
npm run format              # Format all files
npm run format:check        # Check if files are formatted

# Type Checking
npm run type-check          # Run TypeScript compiler (no emit)
```

### Rust

```bash
# Linting
npm run lint:rust           # Run Clippy

# Formatting
npm run format:rust         # Format Rust code
npm run format:rust:check   # Check Rust formatting
```

### Combined Quality Check

```bash
# Run ALL quality checks
npm run quality:check
```

This command runs:
1. TypeScript type checking
2. ESLint
3. Prettier check
4. Rust Clippy
5. Rust format check

**Exit code**: 0 if all checks pass, non-zero if any fail

---

## Pre-commit Hooks

### Automated Quality Checks

**Husky** runs `lint-staged` before every commit:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,json}": [
      "prettier --write"
    ]
  }
}
```

**What happens on commit**:
1. Staged `.ts`/`.tsx` files are linted with ESLint (auto-fix applied)
2. Staged files are formatted with Prettier
3. If any check fails, commit is aborted
4. You can review and stage the auto-fixes

### Bypassing Hooks (Emergency Only)

```bash
git commit --no-verify -m "Emergency fix"
```

⚠️ **Use sparingly** - Only for urgent hotfixes. Fix quality issues ASAP after bypassing.

---

## IDE Integration

### VS Code (Recommended)

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer",
    "editor.formatOnSave": true
  }
}
```

**Required Extensions**:
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- rust-analyzer (`rust-lang.rust-analyzer`)

### Other IDEs

- **WebStorm/IntelliJ**: Enable ESLint and Prettier plugins
- **Sublime Text**: Install SublimeLinter-eslint and JsPrettier
- **Vim/Neovim**: Use ALE or coc-eslint

---

## Continuous Improvement

### Current Quality Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| TypeScript strict mode | ✅ Enabled | ✅ Enabled | 100% |
| ESLint errors | 0 | 0 | ✅ 100% |
| ESLint warnings | 0 | 278 | ⚠️ 0% |
| Prettier formatted | 100% | 100% | ✅ 100% |
| Clippy warnings | 0 | ~50 | ⚠️ Acceptable |
| Unsafe Rust code | 0 blocks | 0 blocks | ✅ 100% |

### Improvement Plan

**Phase 1** (Completed - Task 45):
- ✅ Setup ESLint, Prettier, Clippy, rustfmt
- ✅ Configure pre-commit hooks
- ✅ Fix critical type safety issues (window.webkitAudioContext)
- ✅ Document standards

**Phase 2** (Ongoing):
- Gradually fix ESLint warnings (target: 50% reduction)
- Add missing JSDoc comments for public APIs
- Improve accessibility compliance (jsx-a11y warnings)

**Phase 3** (Future):
- Tighten ESLint rules (warnings → errors)
- Add custom ESLint rules for project-specific patterns
- Implement automated code review checks (GitHub Actions)

### Contributing to Code Quality

**When adding new code**:
1. Run `npm run lint:fix` before committing
2. Ensure `npm run type-check` passes
3. Add proper TypeScript types (avoid `any`)
4. Follow existing code patterns
5. Pre-commit hooks will catch most issues

**When reviewing PRs**:
1. Check CI status (when implemented in Task 46)
2. Verify no new ESLint errors introduced
3. Ensure code follows Prettier formatting
4. Look for type safety improvements

---

## Troubleshooting

### ESLint "Parsing error"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prettier not formatting

```bash
# Check file is not ignored
cat .prettierignore

# Verify Prettier config
npx prettier --check src/path/to/file.ts
```

### Clippy too strict

```bash
# Allow specific warnings in file
#[allow(clippy::rule_name)]
```

### Pre-commit hook failing

```bash
# Check what's failing
npx lint-staged --debug

# Fix issues manually
npm run lint:fix
npm run format
git add .
git commit
```

---

## References

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Clippy Lints](https://rust-lang.github.io/rust-clippy/master/)
- [rustfmt Configuration](https://rust-lang.github.io/rustfmt/)

---

**Last Updated**: 2025-11-26
**Maintained by**: Emre Dağ ([@emredag](https://github.com/emredag))
**Questions?**: See CONTRIBUTING.md or open an issue

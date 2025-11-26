# Contributing to Kelime Oyunu

Thank you for your interest in contributing to Kelime Oyunu! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Format](#commit-message-format)
- [Branch Strategy](#branch-strategy)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+ (with Cargo)
- **Git**
- **Tauri CLI** (installed via npm)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/emredag/word-game-app.git
cd word-game-app

# Install dependencies
npm install

# Run development server
npm run dev
```

### Project Structure

```
word-game-app/
├── src/                    # React/TypeScript frontend
│   ├── components/         # React components
│   ├── store/              # Zustand state management
│   ├── services/           # Business logic
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri commands
│   │   ├── db/             # Database operations
│   │   └── models/         # Data models
│   └── Cargo.toml
├── docs/                   # Project documentation
└── tests/                  # Test files
```

---

## Development Workflow

### 1. Choose an Issue

- Check [GitHub Issues](https://github.com/emredag/word-game-app/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to claim it

### 2. Create a Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, maintainable code
- Follow code style guidelines (see below)
- Add/update tests as needed
- Update documentation if necessary

### 4. Test Your Changes

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format

# Run full quality check
npm run quality:check
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

Pre-commit hooks will automatically:
- Lint your TypeScript/React code
- Format your code with Prettier
- Abort commit if issues are found

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

---

## Code Style Guidelines

### TypeScript/React

#### Naming Conventions

- **Components**: PascalCase (`GameScreen.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCategories.ts`)
- **Utilities**: camelCase (`categoryValidation.ts`)
- **Types/Interfaces**: PascalCase (`Category`, `GameMode`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMER`)

#### Component Structure

```tsx
// 1. Imports
import React from 'react';
import { useGameStore } from '../store/gameStore';

// 2. Types/Interfaces
interface GameScreenProps {
  categoryId: number;
  mode: GameMode;
}

// 3. Component
export const GameScreen: React.FC<GameScreenProps> = ({ categoryId, mode }) => {
  // Hooks
  const { startGame } = useGameStore();

  // Event handlers
  const handleStart = () => {
    startGame(categoryId, mode);
  };

  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

#### Type Safety

- **Avoid `any`**: Use proper types or `unknown`
- **Use strict null checks**: Check for `null`/`undefined`
- **Define return types**: Explicitly type function returns
- **Use type inference**: Let TypeScript infer when obvious

```typescript
// ❌ Bad
const getUser = (id: any) => {
  return users.find(u => u.id === id);
};

// ✅ Good
const getUser = (id: number): User | undefined => {
  return users.find((u) => u.id === id);
};
```

### Rust

#### Naming Conventions

- **Structs**: PascalCase (`Category`)
- **Functions**: snake_case (`get_all_categories`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_WORD_LENGTH`)
- **Modules**: snake_case (`category.rs`)

#### Code Organization

```rust
// 1. Imports
use crate::db;
use crate::models::Category;

// 2. Public function with documentation
/// Get all categories from the database
///
/// # Errors
/// Returns `AppError` if database query fails
pub fn get_all_categories() -> Result<Vec<Category>, AppError> {
    // Implementation
}

// 3. Private helper functions
fn validate_category(name: &str) -> bool {
    !name.is_empty() && name.len() <= 50
}
```

#### Best Practices

- **Error handling**: Use `Result<T, E>` for fallible operations
- **Avoid unwrap**: Use proper error handling instead of `.unwrap()`
- **Document public APIs**: Add doc comments for public functions
- **No unsafe code**: Project forbids `unsafe` blocks

---

## Commit Message Format

We follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(game): add pause functionality to game screen

Add pause button and overlay to allow players to pause during gameplay.
Implements PRD Section 9.6.

Closes #42

---

fix(audio): resolve webkitAudioContext type error

Replace `any` type assertion with proper Window interface extension.

---

docs(readme): update installation instructions

Add Tauri prerequisites and troubleshooting section.

---

chore(deps): upgrade React to 18.3.1
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor" not "moves cursor")
- Keep subject line under 72 characters
- Reference issues/PRs in footer

---

## Branch Strategy

### Main Branches

- `main`: Production-ready code
- `develop`: Integration branch for features (if used)

### Supporting Branches

- `feature/*`: New features (`feature/pause-game`)
- `fix/*`: Bug fixes (`fix/audio-sync`)
- `docs/*`: Documentation (`docs/api-reference`)
- `refactor/*`: Code refactoring (`refactor/state-management`)

### Branch Naming

```bash
<type>/<short-description>

# Examples
feature/add-team-mode
fix/timer-precision
docs/contributing-guide
refactor/extract-validation
```

---

## Pull Request Process

### Before Submitting

1. ✅ Run `npm run quality:check` - all checks must pass
2. ✅ Update documentation if needed
3. ✅ Add/update tests for new functionality
4. ✅ Ensure no merge conflicts with `main`
5. ✅ Update CHANGELOG.md (if applicable)

### PR Title Format

Use conventional commit format:

```
feat(scope): add new feature
fix(scope): resolve bug
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] All existing tests pass
- [ ] Added new tests
- [ ] Manually tested on [OS/Browser]

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks**: CI runs linting, type checking, tests
2. **Code review**: At least one approval required
3. **Testing**: Reviewer tests changes locally
4. **Approval**: PR approved and merged by maintainer

---

## Testing Requirements

### Unit Tests

- Test individual functions and components
- Aim for high code coverage
- Use descriptive test names

```typescript
describe('categoryValidation', () => {
  it('should accept category with 3 words', () => {
    const result = validateMinWords(3);
    expect(result.isValid).toBe(true);
  });

  it('should reject category with 2 words', () => {
    const result = validateMinWords(2);
    expect(result.isValid).toBe(false);
  });
});
```

### Integration Tests

- Test component interactions
- Test Tauri command integration
- Test database operations

### Manual Testing

Before submitting PR, manually test:
- Happy path scenarios
- Edge cases
- Error handling
- UI responsiveness
- Accessibility (keyboard navigation)

---

## Documentation

### Code Documentation

#### TypeScript/React

```typescript
/**
 * Validates if a category meets minimum word requirements
 *
 * @param categoryId - The ID of the category to validate
 * @param minWords - Minimum number of words required (default: 3)
 * @returns Validation result with error messages
 */
export const validateCategory = (
  categoryId: number,
  minWords = 3
): ValidationResult => {
  // Implementation
};
```

#### Rust

```rust
/// Get all categories from the database
///
/// # Errors
/// Returns `AppError::Database` if query fails
///
/// # Examples
/// ```
/// let categories = get_all_categories()?;
/// ```
pub fn get_all_categories() -> Result<Vec<Category>, AppError> {
    // Implementation
}
```

### Project Documentation

When adding major features:
- Update `docs/PRD.md` if requirements change
- Add section to relevant task files in `docs/tasks/`
- Update `README.md` if user-facing changes
- Add entry to `CHANGELOG.md`

---

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/emredag/word-game-app/discussions)
- **Bugs**: Create an [Issue](https://github.com/emredag/word-game-app/issues)

---

## Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` file
- GitHub contributors page
- Release notes for significant contributions

---

**Thank you for contributing to Kelime Oyunu!** 🎉

Your contributions help make this project better for everyone.

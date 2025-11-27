# Project Setup
> PRD Reference: Section 2 - Technical Requirements
> Category: Setup
> Status: Not Started
> Priority: High
> Estimated Time: 4 hours

---

## 🎯 Objective
Set up the initial Tauri project with React, TypeScript, and all required dependencies as specified in the PRD technical stack. This task establishes the foundational development environment for the word game desktop application.

The objective is to create a working Tauri-based desktop application scaffold that integrates React 18+ for the frontend with TypeScript for type safety, ready for subsequent development tasks.

---

## 🧾 Requirements
All mandatory work items within this task, as defined in the PRD.

- PRD 2.1: Frontend framework must be React 18+ with TypeScript
- PRD 2.1: Styling must use Tailwind CSS
- PRD 2.1: State management using Zustand or Context API
- PRD 2.1: Animations with Framer Motion
- PRD 2.1: Icons from Lucide React
- PRD 2.1: Backend framework must be Tauri 1.5+
- PRD 2.1: Backend language must be Rust
- PRD 2.1: SQLite for local database
- PRD 2.1: Tauri File System API for JSON import/export
- PRD 2.1: Tauri Dialog API for file dialogs and popups
- PRD 2.1: Web Audio API for sound effects
- PRD 2.1: Tauri Resource API for sound file management
- PRD 2.2: Platform support for Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+, Fedora, Debian)

---

## ⚙️ Technical Details
Technical scope of the task as per PRD.

**Technology Stack:**
- **Frontend:** React 18+, TypeScript, Tailwind CSS, Zustand/Context API, Framer Motion, Lucide React
- **Backend:** Rust, Tauri 1.5+
- **Database:** SQLite (local)
- **APIs:** Tauri File System API, Tauri Dialog API, Web Audio API, Tauri Resource API

**Development Environment Requirements (PRD 17.1):**
- Node.js 18+ and npm/yarn
- Rust 1.70+
- Tauri CLI
- **Platform-specific:**
  - Windows: Visual Studio Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: Build essential, webkit2gtk

**Project Structure:**
```
bil-bakalim/
├── src/               # React frontend
├── src-tauri/         # Rust backend
├── public/            # Static assets
└── package.json       # Dependencies
```

---

## 🧩 Implementation Steps
Step-by-step guide on how to implement this task.

1. Install Tauri CLI globally: `npm install -g @tauri-apps/cli`
2. Create new Tauri project with React template: `npm create tauri-app`
3. Configure TypeScript support in the project
4. Install and configure Tailwind CSS with PostCSS
5. Install frontend dependencies:
   - `react@^18.0.0`
   - `typescript@^5.0.0`
   - `zustand` (or setup Context API)
   - `framer-motion`
   - `lucide-react`
6. Configure Rust dependencies in `src-tauri/Cargo.toml`:
   - `tauri` version 1.5+
   - `rusqlite` for SQLite support
   - `serde` for JSON serialization
7. Set up Tauri configuration in `tauri.conf.json`:
   - Enable File System API
   - Enable Dialog API
   - Configure app metadata
8. Create basic folder structure for components, services, and types
9. Verify development server runs: `npm run tauri dev`
10. Verify build process works: `npm run tauri build`

---

## ✅ Acceptance Criteria
What conditions must be met for this task to be considered complete?

- Tauri project initialized successfully
- React 18+ with TypeScript configured and working
- All required frontend dependencies installed and importable
- Tailwind CSS configured and styles applying correctly
- Rust backend compiles without errors
- SQLite support available in Rust
- Tauri File System API and Dialog API enabled
- Development server runs without errors (`npm run tauri dev`)
- Application window opens and displays React content
- Build process completes successfully for current platform
- Hot reload working in development mode
- TypeScript type checking passes with no errors

---

## 🧪 Test Scenarios
Test steps for each acceptance criterion.

| Test No | Scenario | Expected Result |
|----------|----------|----------------|
| T-001 | Run `npm run tauri dev` | Application window opens displaying React content |
| T-002 | Make a change to React component | Hot reload triggers and changes appear |
| T-003 | Run TypeScript compiler `tsc --noEmit` | No type errors reported |
| T-004 | Import Tailwind CSS classes | Styles apply correctly to elements |
| T-005 | Import Framer Motion component | Library imports without errors |
| T-006 | Import Lucide React icons | Icons render correctly |
| T-007 | Run `npm run tauri build` | Build completes and generates executable |
| T-008 | Check Rust compilation | Backend compiles without warnings or errors |
| T-009 | Verify SQLite dependency | rusqlite available in Cargo.toml |
| T-010 | Check Tauri APIs enabled | File System and Dialog APIs accessible |

---

## 🔗 Dependencies
Other tasks that must be completed before this task can start, or required system resources.

- None (this is the first task in the project)
- **System Requirements:**
  - Node.js 18+ installed
  - Rust 1.70+ installed
  - Platform-specific build tools installed
  - Internet connection for downloading dependencies

---

## 📄 Deliverables
List of concrete outputs that will be produced when task is completed.

- Initialized Tauri project structure
- `package.json` with all frontend dependencies
- `src-tauri/Cargo.toml` with all Rust dependencies
- `tauri.conf.json` with proper configuration
- `tailwind.config.js` configuration file
- `tsconfig.json` TypeScript configuration
- Basic folder structure:
  - `src/components/`
  - `src/services/`
  - `src/types/`
  - `src/utils/`
- Working development environment
- Build scripts configured

---

## 🧭 Notes
Information that helps understand the process but is not directly part of PRD.

> This task sets up the foundation for the entire project. Ensure all dependencies are installed with compatible versions to avoid conflicts later.

> Tauri 1.5+ is required for the latest security features and API stability.

> Consider using npm or yarn consistently throughout the project - do not mix package managers.

> The development build will be larger than production builds; this is expected behavior.

---

## 📚 References
- [PRD Document - Section 2: Technical Requirements](../docs/PRD.md#2-teknik-gereksinimler)
- [PRD Document - Section 17.1: Development Environment](../docs/PRD.md#171-geliştirme-ortamı)
- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

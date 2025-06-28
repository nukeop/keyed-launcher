# Keyed Launcher - Implementation Plan

## 📋 Project Overview

A high-performance, multiplatform launcher built with Tauri (Rust + TypeScript) targeting Windows, macOS, and Linux. The goal is to create a performant, batteries-included, customizable launcher that opens within 50-100ms and runs at 60+ FPS.

## 🎯 Phase 1: Dancing Skeleton

### 1. Core Application Setup

#### 1.1 Initialize Tauri Application ✅

- **Goal**: Set up basic Tauri app structure with TypeScript frontend and Rust backend
- **Tasks**:
  - ✅ Initialize Tauri project with `tauri init`
  - ✅ Configure TypeScript for frontend
  - ✅ Set up Vite as build tool
  - ✅ Configure Tauri for multiplatform builds
  - ✅ Set up proper folder structure (`src-tauri/`, `src/`, `public/`)

#### 1.2 Performance Optimization Foundation ✅

- **Goal**: Ensure sub-100ms startup and 60+ FPS capability
- **Tasks**:
  - ✅ Configure Tauri window settings for optimal performance
  - ✅ Set up hardware acceleration
  - ✅ Implement efficient state management
  - ✅ Configure bundle optimization settings
  - ✅ Set up performance monitoring tools

### 2. Global Shortcut System

#### 2.1 Background Service Architecture ⏳

- **Goal**: Enable instant launcher activation via global shortcut
- **Approach**: Lightweight background service that keeps app minimized/hidden
- **Tasks**:
  - ✅ Implement Tauri system tray integration
  - ✅ Set up global shortcut registration (Ctrl+Space or Cmd+Space)
  - ✅ Create window show/hide functionality
  - ~~Implement startup behavior (launch on system boot)~~ (Skipped - let users handle manually)
  - ⏳ Handle platform-specific permissions (accessibility on macOS, etc.)

#### 2.2 Window Management ✅

- **Goal**: Instant window appearance and proper focus handling
- **Tasks**:
  - ✅ Configure frameless, always-on-top window
  - ✅ Implement proper window positioning (center of active screen)
  - ✅ Handle multi-monitor scenarios
  - ✅ Set up escape key and click-outside to hide functionality
  - ⏳ Implement smooth show/hide animations

### 3. CI/CD Pipeline Setup ✅

#### 3.1 Main Build Pipeline ✅

- **File**: `.github/workflows/build.yml`
- **Triggers**: Push to main, pull requests
- **Tasks**:
  - ✅ Set up matrix builds for Windows, macOS, Linux
  - ✅ Install Rust toolchain and Node.js
  - ✅ Run linting (ESLint, Clippy)
  - ✅ Execute test suites (frontend and backend)
  - ✅ Build Tauri applications for all platforms
  - ✅ Upload build artifacts

#### 3.2 Code Coverage Pipeline ✅

- **File**: `.github/workflows/coverage.yml`
- **Triggers**: Push to main
- **Tasks**:
  - ✅ Run tests with coverage collection
  - ✅ Generate coverage reports (frontend: Jest/Vitest, backend: cargo-tarpaulin)
  - ✅ Upload to Codecov or similar service
  - ✅ Set up coverage badges

#### 3.3 Release Pipeline ✅

- **File**: `.github/workflows/release.yml`
- **Triggers**: Git tags (v*.*.\*)
- **Tasks**:
  - ✅ Build release binaries for all platforms
  - ✅ Generate changelog from commits
  - ✅ Create GitHub release with assets
  - ✅ Upload platform-specific installers (.msi, .dmg, .deb/.AppImage)

#### 3.4 Debug Build Pipeline ✅

- **File**: `.github/workflows/debug.yml`
- **Triggers**: Manual workflow dispatch
- **Tasks**:
  - ✅ Build debug versions with enhanced logging
  - ✅ Upload debug artifacts with extended retention
  - ✅ Enable developer tools in builds

### 4. Development Infrastructure

#### 4.1 Project Templates

- **Pull Request Template** (`.github/pull_request_template.md`):
  - Description requirements
  - Testing checklist
  - Platform testing confirmation
  - Performance impact assessment
- **Issue Templates** (`.github/ISSUE_TEMPLATE/`):
  - Bug report template with system info
  - Feature request template
  - Performance issue template

#### 4.2 Development Documentation

- **README.md**: Project overview, quick start, contribution guide
- **CONTRIBUTING.md**: Detailed development setup and guidelines
- **docs/development.md**: Local development environment setup

### 5. Technical Architecture

#### 5.1 Frontend Stack

- **Framework**: TypeScript + React + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand or native browser state
- **Build Tool**: Vite with Tauri plugin

#### 5.2 Backend Stack

- **Core**: Rust with Tauri framework
- **Global Shortcuts**: `global-hotkey` crate
- **System Integration**: Platform-specific crates for OS features
- **Performance**: `tokio` for async operations

#### 5.3 Performance Requirements

- **Startup Time**: < 100ms from shortcut to visible window
- **Frame Rate**: Maintain 60+ FPS during interactions
- **Memory Usage**: < 50MB base footprint
- **CPU Usage**: < 1% when idle in background

## 📁 Project Structure

```
keyed-launcher/
├── src/                          # Frontend TypeScript code
│   ├── components/              # UI components
│   ├── stores/                  # State management
│   └── utils/                   # Utility functions
├── src-tauri/                   # Rust backend code
│   ├── src/
│   │   ├── main.rs             # Entry point
│   │   ├── shortcuts.rs        # Global shortcut handling
│   │   └── window.rs           # Window management
│   ├── Cargo.toml             # Rust dependencies
│   └── tauri.conf.json        # Tauri configuration
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
├── docs/                       # Documentation
└── package.json               # Node.js dependencies
```

## 🚀 Implementation Order

1. ✅ **Setup Tauri Project** - Initialize basic structure and dependencies
2. ⏳ **Window Management** - Create frameless window with show/hide functionality
3. ⏳ **Global Shortcuts** - Implement system-wide hotkey registration
4. **Background Service** - Set up system tray and startup behavior
5. **Performance Optimization** - Configure for speed and smoothness
6. ✅ **CI/CD Pipelines** - Set up all four workflow files
7. **Documentation** - Create README and contribution guides
8. **Project Templates** - Add PR and issue templates

## ⚡ Performance Targets

- **Cold Start**: < 100ms (shortcut press to window visible)
- **Warm Show**: < 50ms (subsequent window shows)
- **Frame Rate**: 60+ FPS sustained during use
- **Memory**: < 50MB base, < 100MB during heavy use
- **CPU**: < 1% idle, < 10% during active search

## 🔧 Development Commands

```bash
# Development
npm run tauri dev

# Build
npm run tauri build

# Test
npm run test              # Frontend tests
cargo test --manifest-path src-tauri/Cargo.toml  # Backend tests

# Lint
npm run lint
cargo clippy --manifest-path src-tauri/Cargo.toml
```

## 📝 Success Criteria

- ✅ Tauri app builds and runs on all platforms
- ⏳ Global shortcut opens launcher within performance targets
- ⏳ All CI/CD pipelines pass and produce artifacts
- ⏳ Complete documentation for contributors
- ⏳ Project ready for feature development

This implementation plan provides the foundation for a high-performance, multiplatform launcher while maintaining focus on the core dancing skeleton requirements.

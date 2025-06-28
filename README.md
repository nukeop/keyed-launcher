# Keyed Launcher

Application launcher built with Tauri (Rust + TypeScript). Runs on Windows, macOS, and Linux.

## Features

- Global shortcut: `Cmd+Shift+Space` (macOS) / `Ctrl+Shift+Space` (Windows/Linux)
- System tray integration
- Frameless, transparent window
- Performance tracking (development builds)

## Installation

### Prerequisites

- Node.js 18+ and npm
- Rust 1.77.2+ with Cargo
- Platform requirements:
  - Windows: WebView2 runtime
  - macOS: Xcode Command Line Tools
  - Linux: webkit2gtk-dev, build-essential

### Build and Run

```bash
git clone https://github.com/nukeop/keyed-launcher.git
cd keyed-launcher
npm install

# Development
npm run tauri:dev

# Production build
npm run tauri:build
```

## Usage

The launcher runs in the background with a system tray icon.

- **Show/Hide**: `Cmd+Shift+Space` (macOS) / `Ctrl+Shift+Space` (Windows/Linux)
- **Hide**: `Escape` key or click outside the window
- **System Tray**: Right-click for show/hide or quit

## Development

### Tech Stack

- Frontend: TypeScript + React + Vite + Tailwind CSS
- Backend: Rust with Tauri framework
- State Management: Zustand
- Testing: Vitest + Testing Library

### Commands

```bash
# Development
npm run tauri:dev          # Start development server
npm run dev               # Frontend only

# Building
npm run tauri:build       # Build production app
npm run build            # Build frontend only

# Testing
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint            # Check code style
npm run lint:fix        # Fix linting issues
```

### Build Output

```bash
npm run tauri:build
```

Platform-specific outputs in `src-tauri/target/release/bundle/`:
- Windows: `.msi` installer and `.exe` executable
- macOS: `.dmg` installer and `.app` bundle  
- Linux: `.deb`, `.rpm` packages and `.AppImage`

## Configuration

### Global Shortcut
Modify in `src-tauri/src/shortcuts.rs`. Default: `CmdOrCtrl+Shift+Space`

### Window Settings
Configure in `src-tauri/tauri.conf.json`:
- Size: 600x400 pixels
- Frameless and transparent
- Always on top, skip taskbar
- Starts hidden

## Contributing

1. Fork the repository
2. Clone: `git clone https://github.com/your-username/keyed-launcher.git`
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/name`
5. Make changes and test
6. Commit and push
7. Open Pull Request

Code style: ESLint + Prettier (TypeScript), cargo fmt + clippy (Rust)

## License

AGPL-3.0 License - see LICENSE file for details.

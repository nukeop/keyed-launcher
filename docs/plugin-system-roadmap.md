# Plugin System Roadmap

## Current State ✅ COMPLETED
- ✅ Monorepo with `packages/launcher/`
- ✅ Built-in plugin system working
- ✅ Plugin types: Commands, Components, Themes, Settings
- ✅ External Plugin SDK Package (`@keyed-launcher/plugin-sdk`)
- ✅ Clean API Architecture (single source of truth)
- ✅ Type-safe API Bridge (`window.__LAUNCHER_API__`)

## Phase 2: Plugin SDK Package ✅ COMPLETED

### Tasks
- ✅ Create `packages/plugin-sdk/`
- ✅ Move plugin types from launcher to SDK
- ✅ Extract plugin API interfaces 
- ✅ Set up Vite build system for SDK
- ✅ Create typed API bridge (without tRPC complexity)
- ✅ Update launcher to import from SDK
- ✅ Implement window.__LAUNCHER_API__ bridge in launcher
- ✅ Test with existing bundled plugins
- ✅ API cleanup & deduplication
- ✅ Bundled plugins using SDK API as examples
- ✅ NPM release pipeline (GitHub Actions)
- [ ] Publish SDK to NPM

### Clean API Architecture 🎯
```
┌─ Plugin SDK (NPM Package) ─────────────────┐
│  Client API → window.__LAUNCHER_API__      │
│  Types, Interfaces, Hooks                  │
└────────────────────────────────────────────┘
                     ▲
                     │ imports
                     │
┌─ Launcher App ─────────────────────────────┐
│  API Bridge → Tauri APIs                   │  
│  Plugin Loading, Commands, UI              │
└────────────────────────────────────────────┘
                     ▲
                     │ same API
                     │
┌─ Bundled Plugins ─────────────────────────┐
│  Use SDK API (serve as examples)           │
│  app-launcher, volume-control, etc.        │
└────────────────────────────────────────────┘
```

### API Modules
- **System**: `PluginAPI.system.getApplications()`
- **Shell**: `PluginAPI.shell.execute(program, args)`  
- **Clipboard**: `PluginAPI.clipboard.readText/writeText()`
- **Environment**: `PluginAPI.environment.getEnvironment()`
- **Notifications**: `PluginAPI.notifications.show(message, type)`
### Package Structure
```
packages/plugin-sdk/
├── src/
│   ├── types/
│   │   └── index.ts        # ✅ Plugin, Command, Manifest types
│   ├── api/
│   │   ├── client.ts       # ✅ API bridge implementation  
│   │   ├── global.ts       # ✅ Window API type declarations
│   │   ├── system.ts       # ✅ System operations (apps, etc.)
│   │   ├── clipboard.ts    # ✅ Clipboard operations
│   │   ├── environment.ts  # ✅ Environment info
│   │   ├── notifications.ts # ✅ User notifications
│   │   ├── shell.ts        # ✅ Shell commands
│   │   └── index.ts        # ✅ API exports
│   └── index.ts            # ✅ Main SDK exports
├── package.json            # ✅ SDK package config
├── vite.config.ts          # ✅ Vite build config
└── tsconfig.json           # ✅ TypeScript config
```

packages/launcher/
├── src/plugins/
│   ├── api-bridge.ts       # ✅ Implements PluginAPIBridge
│   ├── types.ts            # ✅ Re-exports from SDK
│   └── bundled/            # ✅ Uses SDK API consistently
```

## Phase 3: External Plugin Support 🎯 NEXT

### High Priority Tasks
- [ ] Plugin directory setup - Create `~/.launcher/plugins/` structure
- [ ] External plugin loading - Discovery and dynamic import system
- [ ] Plugin compilation pipeline - TypeScript → JavaScript for external plugins
- [ ] Basic plugin validation - Manifest validation and safety checks

### Medium Priority Tasks  
- [ ] Plugin sandboxing and permissions system
- [ ] Error isolation and recovery
- [ ] Plugin update mechanism
- [ ] Plugin marketplace integration

## Phase 4: Developer Experience 🚀

### Developer Tools
- [ ] `create-launcher-plugin` CLI - Scaffold new plugins
- [ ] Plugin development server - Hot reload for plugin development
- [ ] Plugin build system - Optimized builds for distribution
- [ ] Comprehensive documentation - API docs, guides, examples
- [ ] Example plugin templates - Common plugin patterns

### Publishing & Distribution
- [ ] NPM publishing workflow - Automated SDK releases
- [ ] Plugin registry - Centralized plugin discovery
- [ ] Version management - Plugin compatibility matrix

## Immediate Next Steps 🎯

### 1. Publish SDK to NPM
```bash
git tag plugin-sdk@1.0.0
git push origin plugin-sdk@1.0.0
```
This will trigger the GitHub Actions workflow to publish to NPM.

### 2. Create External Plugin Directory Structure
```
~/.launcher/
├── plugins/
│   ├── installed/          # User-installed plugins
│   ├── downloads/          # Plugin downloads cache
│   └── config/             # Plugin configurations
└── launcher.config.json    # Global launcher config
```

### 3. Build External Plugin Loading System
- Plugin discovery mechanism
- Dynamic import with error handling  
- Plugin lifecycle management (load/unload/reload)

### 4. Create Development Tools
- `create-launcher-plugin` CLI scaffolding
- Plugin development documentation
- Example external plugin

## Success Metrics 📊
- ✅ SDK builds and types work correctly
- ✅ Bundled plugins use consistent API
- ✅ Clean architecture with no duplication
- [ ] External plugin can be loaded and executed
- [ ] Plugin development workflow is smooth
- [ ] Community can create and share plugins

# Plugin System Roadmap

## Current State
- ✅ Monorepo with `packages/launcher/`
- ✅ Built-in plugin system working
- ✅ Plugin types: Commands, Components, Themes, Settings
- ✅ Plugin API in `src/plugins/api/`

## Phase 2: Plugin SDK Package

### Tasks
- ✅ Create `packages/plugin-sdk/`
- ✅ Move plugin types from launcher to SDK
- ✅ Extract plugin API interfaces 
- ✅ Set up Vite build system for SDK
- ✅ Create typed API bridge (without tRPC complexity)
- [ ] Update launcher to import from SDK
- [ ] Implement window.__LAUNCHER_API__ bridge in launcher
- [ ] Test with existing bundled plugins
- [ ] Publish SDK to NPM

### Structure
```
packages/plugin-sdk/
├── src/
│   ├── types/
│   │   └── index.ts        # Plugin, Command, Manifest types
│   ├── api/
│   │   ├── client.ts       # API bridge implementation
│   │   ├── global.ts       # Window API type declarations
│   │   ├── system.ts       # System operations (apps, etc.)
│   │   ├── clipboard.ts    # Clipboard operations
│   │   ├── environment.ts  # Environment info
│   │   ├── notifications.ts # User notifications
│   │   ├── shell.ts        # Shell commands
│   │   └── index.ts        # API exports
│   └── index.ts            # Main SDK exports
├── package.json            # SDK package config
├── vite.config.ts          # Vite build config
└── tsconfig.json           # TypeScript config
```

## Phase 3: External Plugin Support

### Tasks
- [ ] Plugin directory for external plugins
- [ ] Plugin discovery and loading system
- [ ] TypeScript compilation for external plugins
- [ ] Plugin sandboxing and permissions
- [ ] Error isolation

## Phase 4: Developer Tools

### Tasks  
- [ ] `create-launcher-plugin` CLI
- [ ] Plugin development server
- [ ] Plugin build system
- [ ] API documentation
- [ ] Example plugins

## Next Actions
1. ✅ ~~Create plugin SDK package~~
2. ✅ ~~Extract types and API~~
3. Update launcher imports
4. Implement API bridge in launcher
5. Test with external plugin
6. Document plugin development

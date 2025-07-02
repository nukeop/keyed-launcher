# Plugin System ### Command Types

Commands are categorized by their execution behavior:

### `no-view`
Direct actions, no additional UI. Examples: launch app, open URL, copy to clipboard.
- Execute immediately when selected
- Optional HUD notification for feedback
- Return to command palette after execution
- Returns `Promise<void>`

### `view`  
Simple commands with basic React UI. Examples: file browser, simple forms.
- Render basic React components using minimal component set
- Single-view only
- Uses built-in layout components
- Returns `Promise<React.ReactElement>` Architecture (Minimal Viable Plugin System)

Plugins provide commands that contribute to the launcher experience:
```
Plugin → Commands → Entries → Command Palette + Simple Views
```

- **Plugin**: Package providing functionality with manifest and commands
- **Command**: Executable function with minimal UI support
- **Entry**: Searchable item in command palette (generated from commands)
- **View**: Simple React component (initially just basic layouts)

**Design Philosophy**: Start minimal, design for extensibility. Build-in functionalities (like app discovery) should be implemented as bundled plugins to validate the plugin architecture.

## Command Types

Commands are categorized by their execution behavior:

### `no-view`
Direct actions, no additional UI. Examples: launch app, open URL, copy to clipboard.
- Execute immediately when selected
- Optional HUD notification for feedback
- Return to command palette after execution

### `view`  
Simple commands with basic React UI. Examples: file browser, simple forms.
- Render basic React components using minimal component set
- Single-view only
- Uses built-in layout components

## Domain Categories

Commands grouped by purpose:

- **Applications**: App launchers and management
- **System**: Settings, controls, and monitoring
- **Files**: File operations and browser
- **Web**: Web actions, bookmarks, search
- **Tools**: Utilities and productivity
- **Developer**: Git, Docker, API tools, databases
- **Media**: Music, video, image management
- **Communication**: Email, chat, social
- **Plugin-defined**: Custom categories (e.g., "Kubernetes", "AWS")

Uncategorized commands default to "Other".

## Data Structures

### Plugin Manifest
```typescript
interface PluginManifest {
  // Plugin identity (store-ready)
  id: string;              // Globally unique ID (e.g., "com.author.plugin-name")
  name: string;            // Display name
  version: string;         // Semantic version (e.g., "1.2.3")
  apiVersion: string;      // Plugin API version (e.g., "1.0.0")
  description: string;     // Brief description
  author: string;          // Author name
  
  // Store metadata (optional, for future store)
  namespace?: string;      // Publisher namespace (e.g., "raycast", "community")
  license?: string;        // License identifier (e.g., "MIT", "GPL-3.0")
  homepage?: string;       // Plugin homepage URL
  repository?: string;     // Source code repository
  keywords?: string[];     // Store search keywords
  category?: string;       // Store category
  
  // Dependencies (for future plugin ecosystem)
  dependencies?: Record<string, string>;     // Plugin dependencies
  peerDependencies?: Record<string, string>; // Required peer plugins
  
  // Runtime requirements
  permissions: PluginPermissions;
  
  // Commands provided by this plugin
  commands: CommandManifest[];
  
  // Installation metadata (managed by system)
  _installMeta?: PluginInstallMeta;
}

// Installation tracking (system-managed)
interface PluginInstallMeta {
  installedAt: Date;
  installedFrom: 'bundled' | 'store' | 'url' | 'local';
  storeUrl?: string;       // Store page URL
  downloadUrl?: string;    // Download source
  checksum?: string;       // Package integrity check
  signature?: string;      // Digital signature (for store)
  autoUpdate: boolean;     // User preference for auto-updates
}

interface CommandManifest {
  name: string;            // Unique command identifier within plugin
  title: string;           // Display name
  subtitle?: string;       // Brief description
  description: string;     // Detailed description
  mode: 'view' | 'no-view';
  category?: string;       // Domain category
  keywords?: string[];     // Search terms
  icon?: string;           // Icon identifier or URL
  
  // Command execution
  handler: string;         // Path to command file (relative to plugin root)
}

// Permission system
interface PluginPermissions {
  filesystem?: 'read' | 'write' | 'none';
  network?: 'local' | 'internet' | 'none';
  shell?: 'restricted' | 'full' | 'none';
  system?: 'read' | 'write' | 'none';
}
```

### Runtime Interfaces
```typescript
interface LauncherEntry {
  id: string;              // Unique ID (pluginId.commandName)
  commandName: string;     // Command identifier
  title: string;           // Display name
  subtitle?: string;       // Brief description
  description: string;     // Detailed description
  mode: 'view' | 'no-view';
  category?: string;       // Domain category
  pluginId: string;        // Plugin ID
  keywords?: string[];     // Search terms
  icon?: string;           // Icon identifier
  shortcut?: string;       // Display shortcut hint
  
  // Execution context
  execute: NoViewCommand | ViewCommand;
}

interface NoViewCommand {
  mode: 'no-view';
  execute: (context: CommandContext) => Promise<void>;
}

interface ViewCommand {
  mode: 'view';
  execute: (context: CommandContext) => Promise<React.ReactElement>;
}

interface CommandContext {
  environment: {
    apiVersion: string;
    theme: string;
    platform: string;
    isDebug: boolean;
  };
}

interface Plugin {
  // Plugin metadata
  manifest: PluginManifest;
  
  // Runtime state
  isEnabled: boolean;
  isLoaded: boolean;
  lastLoaded?: Date;
  
  // Lifecycle hooks
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;
}
```

## Plugin Loading & Management

### JavaScript Execution Environment
Plugins run in the same WebView context as the main application (similar to Raycast):
- Plugins are ES modules loaded into the main JavaScript context
- Direct React component integration for `view` commands  
- Shared access to launcher APIs and utilities
- Plugin crashes are contained by disabling the failing plugin
- Plugins can only render their own views - built-in UI and other plugins are unreachable

### Command Namespacing
Commands are automatically namespaced to prevent conflicts:
- Full command ID format: `pluginId.commandName`
- Example: `com.keyed.app-launcher.search-apps`
- UI displays plugin context: "Search Apps (App Launcher)"
- Last loaded plugin wins in case of identical full IDs

### Asynchronous Plugin Loading
Plugins are loaded dynamically and asynchronously as they are discovered:

```typescript
interface PluginLoader {
  // Watch config directories for new plugins
  watchPluginDirectories: (paths: string[]) => void;
  
  // Load plugin from directory or file
  loadPlugin: (path: string) => Promise<Plugin>;
  
  // Unload plugin and clean up resources
  unloadPlugin: (pluginId: string) => Promise<void>;
  
  // Reload plugin (for development)
  reloadPlugin: (pluginId: string) => Promise<void>;
  
  // Get all loaded plugins
  getLoadedPlugins: () => Plugin[];
  
  // Store-ready installation methods
  installFromStore: (pluginId: string, version?: string) => Promise<Plugin>;
  installFromUrl: (url: string) => Promise<Plugin>;
  installFromLocal: (path: string) => Promise<Plugin>;
  
  // Update management
  checkForUpdates: (pluginId?: string) => Promise<PluginUpdate[]>;
  updatePlugin: (pluginId: string, version?: string) => Promise<Plugin>;
}

interface PluginUpdate {
  pluginId: string;
  currentVersion: string;
  availableVersion: string;
  changelog?: string;
  releaseNotes?: string;
  isSecurityUpdate: boolean;
}

interface PluginDiscovery {
  // Watch file system for plugin changes
  onPluginAdded: (callback: (path: string) => void) => void;
  onPluginRemoved: (callback: (path: string) => void) => void;
  onPluginModified: (callback: (path: string) => void) => void;
  
  // Scan for existing plugins
  scanPluginDirectories: (paths: string[]) => Promise<string[]>;
}
```

### Plugin Directory Structure
```
~/.config/keyed-launcher/plugins/
├── bundled/                    # Built-in plugins
│   └── app-launcher/          # Application Launcher (MVP)
├── store/                      # Store-installed plugins
│   ├── com.keyed.github/     # Namespaced plugin IDs
│   └── com.community.weather/
├── user/                       # User-installed plugins (URLs, local)
│   ├── my-custom-plugin/
│   └── downloaded-plugin/
└── development/                # Development plugins
    └── work-in-progress-plugin/
```

### Plugin Package Format
Supports both directory-based and packaged plugins:

**Directory Format** (Development):
```
my-plugin/
├── manifest.json              # Plugin manifest
├── index.js                   # Main entry point
├── commands/                  # Command implementations
└── assets/                    # Icons, images, etc.
```

**Package Format** (Distribution):
```
plugin-package.tar.gz           # Standard compressed archive
├── manifest.json              # Plugin manifest
├── package.json               # Optional npm-style metadata
├── index.js                   # Main entry point
├── commands/                  # Command implementations
├── assets/                    # Icons, images, etc.
└── SIGNATURE                  # Digital signature (store only)
```

### Real-time Plugin Management
- **File Watching**: Monitor plugin directories for new tarballs (extends existing theme watcher)
- **Hot Reloading**: Automatically reload plugins when files change (development)
- **Lazy Loading**: Load plugins only when first accessed
- **Error Recovery**: Handle plugin loading failures gracefully, disable failing plugins
- **Live Updates**: Update search index immediately when plugins change

## UI Component System

### Basic Components
```typescript
export { List, ListItem } from './components/List';
export { Detail } from './components/Detail';
```

### Basic Actions
```typescript
Action.OpenInBrowser      // Open URL in browser
Action.CopyToClipboard    // Copy text to clipboard
Action.Close              // Close/return to palette
```

## Plugin Examples

### Bundled Core Plugins
- **Application Launcher**: System app discovery and launching (MVP focus)

### Plugin Architecture Validation
Build core launcher features as plugins to ensure the plugin system is:
- Flexible enough for real-world use cases
- Performant for essential operations
- Simple enough for easy development

## Search & Discovery

### Simple Indexing
- **Primary**: Command title, exact matches
- **Secondary**: Keywords, category
- **Basic ranking**: Exact matches, then fuzzy matches, then frecency

### Search Features
- **Fuzzy search** with basic typo tolerance
- **Category filtering**: Simple `category:apps` syntax
- **Instant results** with basic performance optimization

## Plugin Development

### Basic Plugin Structure
```
my-plugin/
├── package.json          # Plugin manifest
├── index.js             # Main entry point
└── commands/
    ├── search-apps.js   # Command handlers
    └── launch-app.js
```

### Development APIs
```typescript
import { 
  useEnvironment,        // Access theme, platform, debug mode
  useClipboard,          // Basic clipboard operations
  useNotifications       // Simple notifications
} from '@keyed/api';
```

## Security & Permissions

### Permission Declaration
Plugins must declare required permissions in their manifest:

```json
{
  "permissions": {
    "filesystem": "read",     // For app discovery
    "shell": "restricted",    // For launching apps
    "network": "none"         // No network access
  }
}
```

### User Transparency & Trust
- Show permission requests during plugin installation
- Allow users to review and approve permissions
- Clear indicators when plugins access sensitive resources
- Plugin trust levels: `bundled` > `store-verified` > `community` > `unverified`

### Store Security Features (Future)
- **Digital Signatures**: Store plugins are cryptographically signed
- **Automated Scanning**: Static analysis for security issues
- **Community Reporting**: User-driven security feedback
- **Sandboxing**: Runtime isolation for untrusted plugins

## Implementation Plan

### Core Implementation Tasks
- [ ] Plugin manifest system with API versioning
- [ ] Asynchronous plugin loading and file watching
- [ ] Basic command registration and execution
- [ ] Simple command execution (`no-view` and basic `view`)
- [ ] Essential UI components (List, Detail only)
- [ ] Permission system with user transparency
- [ ] Basic search and entry indexing
- [ ] **Store-ready features**:
  - [ ] Globally unique plugin IDs with namespacing
  - [ ] Plugin installation metadata tracking
  - [ ] Package format specification
  - [ ] Update checking infrastructure

### Validation Strategy
Build Application Launcher as bundled plugin to validate the plugin architecture.

**Reference**: See `plugin-system-future-ideas.md` for advanced features and future development plans.

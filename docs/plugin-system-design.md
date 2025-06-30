# Plugin System Design

## Core Architecture

Plugins contribute entries to the command palette:
```
Plugin → Entries → Command Palette
```

- **Plugin**: Package providing functionality
- **Entry**: Selectable item in command palette
- **Command Palette**: Main interface displaying all entries

## Entry Types

Entries are categorized by execution behavior:

### `no-view`
Direct actions, no additional UI. Examples: launch app, open URL, toggle setting.

### `view`  
Interactive commands with custom UI. Examples: file browser, system monitor, todo manager.

### `background`
Long-running operations. Examples: resource monitor, file watcher, sync services.

## Domain Categories

Entries grouped by purpose:

- **Applications**: App launchers
- **System**: Settings and controls
- **Files**: File operations
- **Web**: Web actions
- **Tools**: Utilities
- **Plugin-defined**: Custom categories (e.g., "Git", "Docker")

Uncategorized entries default to "Other".

## Data Structure

```typescript
interface LauncherEntry {
  id: string;              // Unique ID
  name: string;            // Unique within plugin
  title: string;           // Display name
  subtitle?: string;       // Domain hint
  description: string;     // Purpose
  mode: 'view' | 'no-view' | 'background';
  action: () => void | Promise<void>;
  category?: string;       // Domain category
  pluginId: string;        // UUID of plugin
  keywords?: string[];     // Search terms
  icon?: string;           // Visual identifier
  shortcut?: string;       // Keyboard hint
}

interface Plugin {
  id: string;              // UUID
  name: string;
  version: string;
  description: string;
  author: string;
  entries: LauncherEntry[];
}
```

## Plugin Examples

### Core (Built-in)
- Application Launcher
- System Commands
- File Browser

### Third-Party Categories
- **Productivity**: Todo lists, notes, calendars
- **Developer**: Git, Docker, API tools
- **System**: Cloud services, media control
- **Workflow**: Text processing, automation

## Search & Discovery

### Indexing
- Title (primary)
- Subtitle
- Keywords
- Category
- Plugin name

### Ranking
1. Exact title matches
2. Title prefix matches
3. Subtitle matches
4. Keyword matches
5. Frecency (frequency + recency)

## Future Extensions

- Entry arguments for user input
- Custom UI components for `view` mode
- Plugin communication
- Performance optimizations (lazy loading, virtualization)

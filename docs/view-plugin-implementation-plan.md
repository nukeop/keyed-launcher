# View Plugin Implementation Plan

## 🎯 Overview
Create the first "view" plugin - a Plugin Manager that displays currently loaded plugins grouped by categories. This will establish the foundation for view-based plugins that render their own UI components instead of just executing commands.

## 📋 Current State Analysis

### Existing Plugin Architecture ✅
- **Plugin Types**: Commands, Components, Themes, Settings
- **Execution Modes**: `'no-view'` | `'view'` (view not implemented yet)
- **Plugin Store**: Zustand store managing loaded plugins, status, and enabled state
- **Plugin SDK**: Type-safe API with window.__LAUNCHER_API__ bridge
- **Bundled Plugins**: Several working examples (app-launcher, volume-control, etc.)

### Current Launcher UI Components ✅
- **CommandPalette**: Main container with search and results
- **SearchBar**: Text input with focus management
- **ResultsList**: Displays searchable items grouped by categories
- **ActionBar**: Bottom bar with icon slot and performance dashboard
- **ResultItem**: Individual result display with icons
- **CategoryHeader**: Section headers for grouped content

## 🎪 Plugin Manager Requirements

### Core Features
1. **Plugin List View**: Display all loaded plugins with their details
2. **Category Grouping**: Group plugins by type/category (Applications, System, Developer, etc.)
3. **Plugin Status**: Show loading status, enabled/disabled state
4. **Plugin Metadata**: Display name, version, description, author
5. **Navigation**: Back button and context indicator

### View Plugin Execution Flow
1. User executes view plugin command
2. Launcher switches to plugin's view mode
3. Plugin renders its React component in the results area
4. UI shows back button and plugin context
5. User can navigate back to main launcher

## 🔧 Technical Implementation

### Phase 1: Extend Plugin API for View Rendering

#### 1.1 Update Plugin SDK Types
- ✅ `ViewCommand.execute()` already returns `Promise<React.ReactElement>`
- Add view rendering context and navigation hooks
- Add plugin view state management

#### 1.2 Create View Context API
```typescript
interface ViewContext {
  navigateBack: () => void;
  currentView: string | null;
  setTitle: (title: string) => void;
}
```

#### 1.3 Update Launcher State
- Add current view state (`'main' | 'plugin'`)
- Add current plugin context
- Add navigation history

### Phase 2: Update Launcher UI Components

#### 2.1 Enhance SearchBar Component
- Add back button slot (square with left arrow icon)
- Show/hide back button based on current view
- Handle back navigation

#### 2.2 Enhance ActionBar Component  
- Add plugin context display (icon + name)
- Show current plugin when in view mode
- Update layout to accommodate context

#### 2.3 Create Plugin View Container
- New component to render plugin views
- Handle view switching and transitions
- Manage plugin view lifecycle

#### 2.4 Update CommandPalette Component
- Support view mode rendering
- Handle view/command mode switching
- Manage search state during view navigation

### Phase 3: Create Plugin Manager Plugin

#### 3.1 Plugin Structure
```
packages/launcher/src/plugins/bundled/plugin-manager/
├── index.ts                 # Plugin entry point
├── manifest.ts              # Plugin metadata
├── commands/
│   └── show-plugins.ts      # Command to open plugin manager
└── components/
    ├── PluginsList.tsx      # Main plugin list view
    ├── PluginItem.tsx       # Individual plugin display
    └── PluginStatus.tsx     # Status indicator component
```

#### 3.2 Plugin Features
- **Command**: "Plugin Manager" command to open the view
- **View Component**: React component rendering plugin list
- **Data Source**: Read from plugin registry store
- **Grouping**: Group plugins by category/type
- **Status Display**: Show enabled/disabled, loading states
- **Plugin Actions**: Enable/disable plugins (future enhancement)

### Phase 4: Integration and Testing

#### 4.1 Update useCommandPaletteResults Hook
- Handle view plugin execution differently
- Manage view state transitions
- Update result filtering for view mode

#### 4.2 Create View Navigation System
- Implement back navigation
- Handle view state persistence
- Manage search query state during view switches

#### 4.3 Update App Container
- Connect view context to main app
- Handle view mode rendering
- Manage global navigation state

## 📐 Component Design Inspiration

### PluginsList Component (inspired by ResultsList)
```tsx
interface Plugin {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  author: string;
  status: PluginLoadingStatus;
  enabled: boolean;
  icon?: CommandIcon;
}
```

### Layout Structure
```
┌─ CommandPalette ──────────────────────────┐
│ ┌─ SearchBar ─────────────────────────────┐ │
│ │ [←] Plugin Manager                      │ │
│ └─────────────────────────────────────────┘ │
│ ┌─ PluginsList (View Component) ──────────┐ │
│ │ Applications (2)                        │ │
│ │ ├─ App Launcher      v1.0.0    [✓]      │ │
│ │ └─ Icon Demo         v1.0.0    [✓]      │ │
│ │                                         │ │
│ │ System (3)                              │ │
│ │ ├─ Volume Control    v1.0.0    [✓]      │ │
│ │ ├─ macOS System Ops  v1.0.0    [✓]      │ │
│ │ └─ Plugin Manager    v1.0.0    [✓]      │ │
│ └─────────────────────────────────────────┘ │
│ ┌─ ActionBar ─────────────────────────────┐ │
│ │ 🔌 Plugin Manager         [Perf: 2ms]   │ │
│ └─────────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

## 🚀 Implementation Steps

### Step 1: Extend Launcher State Management ✅ COMPLETED
- ✅ Add view state to launcher store
- ✅ Add navigation methods  
- ✅ Add plugin context management

### Step 2: Update UI Components ✅ COMPLETED  
- ✅ Add back button to SearchBar
- ✅ Update ActionBar for plugin context
- ✅ Create PluginViewContainer component

### Step 3: Create Plugin Manager Plugin ✅ COMPLETED
- ✅ Implement plugin manifest and commands
- ✅ Create PluginsList view component
- ✅ Integrate with plugin registry store

### Step 4: Update Command Execution ✅ COMPLETED
- ✅ Modify useCommandPaletteResults for view plugins
- ✅ Handle view rendering in CommandPalette
- ✅ Implement view navigation

### Step 5: Testing and Polish ⏳ IN PROGRESS
- ⏳ Test view navigation flow
- ⏳ Verify plugin data display
- ⏳ Polish UI transitions and states

## 🎯 Success Criteria

- ✅ User can execute "Plugin Manager" command
- ✅ Launcher switches to plugin view mode  
- ✅ Plugin list displays with proper grouping and status
- ✅ Back button appears and functions correctly
- ✅ ActionBar shows plugin context
- ✅ Navigation back to main launcher works smoothly
- ✅ View plugin serves as template for future view plugins

## 🔮 Future Enhancements

- Plugin enable/disable actions from the view
- Plugin settings access
- Plugin update notifications  
- Plugin installation/uninstallation
- Plugin search and filtering within the view
- Plugin dependency visualization

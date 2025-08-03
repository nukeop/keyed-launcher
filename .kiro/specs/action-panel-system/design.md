# Design Document

## Overview

The ActionPanel system extends the existing List component architecture to support Raycast-inspired actions. The system consists of three main components:

1. **ActionPanel** - Container for actions that can be attached to List.Item components
2. **Action** - Individual action components with keyboard shortcuts and handlers
3. **ActionBar Integration** - Enhanced ActionBar that displays primary action and action panel shortcut

The design leverages the existing List context system while adding action-specific context management for keyboard shortcuts and action execution.

## Architecture

### Component Hierarchy

```
List
├── List.Item (with actions prop)
│   
ActionPanel
├── Action
└── Action.CopyToClipboard
```

### Context Architecture

The system uses a dedicated ActionContext for managing actions, separate from the existing ListContext:

```typescript
// ActionContext for managing actions and shortcuts
type ActionContextType = {
  registerItemActions: (itemId: string, actions: ActionDefinition[]) => void;
  unregisterItemActions: (itemId: string) => void;
  getActionsForItem: (itemId: string) => ActionDefinition[];
  isActionPanelOpen: boolean;
  toggleActionPanel: () => void;
}

// ListContext remains unchanged but communicates with ActionContext
// to provide selected item's actions to ActionBar
```

### Action Management

Actions are managed through the ActionContext which handles:
- Action registration/cleanup per list item as a list
- Keyboard shortcut registration/cleanup with shortcut => action mapping
- Action execution via keyboard shortcuts
- Action panel visibility state

## Components and Interfaces

### ActionPanel Component

```typescript
interface ActionPanelProps {
  children: ReactNode;
  title?: string;
}

const ActionPanel: FC<ActionPanelProps> = ({ children, title }) => {
  // Registers actions with ActionContext
  // Provides context to child Action components
}
```

### Action Component

```typescript
interface ActionProps {
  title: string;
  onAction: () => void;
  autoFocus?: boolean;
  icon?: CommandIcon; // Reuse existing IconRenderer types
  shortcut?: Keyboard.Shortcut;
  style?: 'default' | 'warning' | 'danger' | 'success' | 'info';
}

const Action: FC<ActionProps> = ({ 
  title, 
  onAction, 
  autoFocus, 
  icon, 
  shortcut, 
  style = 'default' 
}) => {
  // Registers shortcut with ActionContext
  // Renders action in action panel
}
```

### Built-in Action Components

```typescript
interface CopyToClipboardProps {
  content: string | number;
  title?: string;
  concealed?: boolean;
  icon?: CommandIcon;
  onCopy?: (content: string | number) => void;
  shortcut?: Keyboard.Shortcut;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({ 
  content,
  title,
  concealed = false,
  icon,
  onCopy,
  shortcut 
}) => {
  // Uses Action component internally
  // Handles clipboard copy via Tauri command
  // Shows HUD notification after copy
  // Closes main window after copy
}

// Attached as Action.CopyToClipboard
Action.CopyToClipboard = CopyToClipboard;
```

### Enhanced List.Item

```typescript
interface ItemProps {
  // ... existing props
  actions?: ReactElement<ActionPanelProps>;
}

const Item: FC<ItemProps> = ({ actions, ...props }) => {
  // Registers actions with ListContext
  // Renders item with action support
}
```

## Data Models

### Action Registry

```typescript
// Actions are simply passed as a list to the currently selected List.Item
// No registry needed - actions are managed per selected item

type ActionDefinition = {
  title: string;
  handler: () => void;
  shortcut?: Keyboard.Shortcut;
  autoFocus?: boolean;
  icon?: CommandIcon;
  style?: 'default' | 'warning' | 'danger' | 'success' | 'info';
};
```

### Keyboard System

```typescript
namespace Keyboard {
  type Key = 
    | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
    | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
    | 'return' | 'escape' | 'space' | 'tab' | 'backspace' | 'delete'
    | 'arrowUp' | 'arrowDown' | 'arrowLeft' | 'arrowRight'
    | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' | 'f9' | 'f10' | 'f11' | 'f12';

  type Modifier = 'cmd' | 'ctrl' | 'alt' | 'shift';

  type KeyCombination = {
    key: Key;
    modifiers: Modifier[];
  };

  type Shortcut = KeyCombination | {
    linux?: KeyCombination;
    macOS?: KeyCombination;
    windows?: KeyCombination;
  };

  namespace Shortcut {
    enum Common {
      Copy = 'copy',
      Paste = 'paste',
      Cut = 'cut',
      SelectAll = 'selectAll',
      Undo = 'undo'
    }
  }
}
```

### Shortcut Mapping

```typescript
type ShortcutActionMap = Map<string, ActionDefinition>;
// Key format: "cmd+c" or "ctrl+shift+a"
// Last registered action wins for duplicate shortcuts
```

## Error Handling

### Runtime Errors

- **Action Execution**: Room for catching exceptions in action handlers
- **Context Errors**: Missing ActionPanel or ActionContext throws descriptive errors
- **Cleanup**: Automatic cleanup of shortcuts when components unmount

## Testing Strategy

Testing strategy will be planned separately after implementation details are finalized.
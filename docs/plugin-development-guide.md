# Plugin Development Guide

Learn how to create plugins for the launcher with step-by-step examples.

## Plugin Types

Two types of plugins are supported:

- **No-View Plugins**: Execute functions (like volume control, system commands)
- **View Plugins**: Render React components (like plugin manager, file browsers)

## Creating a Plugin

### 1. Directory Structure

Create your plugin directory in `packages/launcher/src/plugins/bundled/`:

```
my-plugin/
├── manifest.json          # Plugin metadata
├── index.ts              # Plugin entry point
├── commands/             # Command handlers
│   └── my-command.ts     # Individual commands
└── components/           # React components (for view plugins)
    └── MyView.tsx
```

### 2. Create manifest.json

Define your plugin metadata and commands:

```json
{
  "id": "com.yourname.my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "apiVersion": "1.0.0",
  "description": "A sample plugin",
  "author": "Your Name",
  "namespace": "yourname",
  "license": "MIT",
  "category": "Utilities",
  "keywords": ["utility", "example"],
  "commands": [
    {
      "name": "my-command",
      "displayName": "My Command",
      "subtitle": "Does something useful",
      "description": "Executes my custom functionality",
      "mode": "no-view",
      "category": "Utilities",
      "icon": {
        "type": "emoji",
        "emoji": "⚡"
      },
      "handler": "my-command"
    }
  ]
}
```

### 3. No-View Plugin Example

**commands/my-command.ts** (executes a function):
```typescript
import { PluginAPI } from '@keyed-launcher/plugin-sdk';

export default async function myCommand() {
  await PluginAPI.notifications.show('Hello from my plugin!', 'info');
}
```

**index.ts**:
```typescript
export async function onStartup(): Promise<void> {
  console.log('My plugin loaded');
}
```

### 4. View Plugin Example

**commands/my-view.ts** (renders a component):
```typescript
import { MyView } from '../components/MyView';

export default MyView;
```

**components/MyView.tsx**:
```typescript
import { FC } from 'react';

interface MyViewProps {
  searchQuery?: string;
}

export const MyView: FC<MyViewProps> = ({ searchQuery }) => {
  return (
    <div className="p-4">
      <h1 className="text-white text-xl mb-4">My Custom View</h1>
      {searchQuery && (
        <p className="text-gray-400">Searching for: {searchQuery}</p>
      )}
      <div className="space-y-2">
        <div className="p-3 bg-white/5 rounded-lg">
          <h3 className="text-white">Feature 1</h3>
          <p className="text-gray-400 text-sm">Description here</p>
        </div>
      </div>
    </div>
  );
};
```

**index.ts**:
```typescript
export async function onStartup(): Promise<void> {
  console.log('My view plugin loaded');
}
```

## Plugin API

Access launcher functionality through the Plugin SDK:

```typescript
import { PluginAPI } from '@keyed-launcher/plugin-sdk';

// System operations
const apps = await PluginAPI.system.getApplications();

// Shell commands
await PluginAPI.shell.execute('echo', ['Hello World']);

// Clipboard
await PluginAPI.clipboard.writeText('Copied text');
const text = await PluginAPI.clipboard.readText();

// Notifications
await PluginAPI.notifications.show('Success!', 'success');

// Environment info
const env = PluginAPI.environment.getEnvironment();
```

## Icons

Use any of the supported icon types:

```json
// Emoji
{"type": "emoji", "emoji": "🚀"}

// Named icon (Lucide)
{"type": "named", "name": "Settings"}

// Named with gradient
{
  "type": "named", 
  "name": "Zap",
  "gradient": {"from": "blue-500", "to": "purple-600"}
}

// Base64 image
{"type": "base64", "data": "data:image/png;base64,..."}
```

More in the [Icons doc](./icon-system.md).

## Testing Your Plugin

1. Add your plugin directory to the bundled plugins
2. The launcher will automatically discover and load it
3. Your commands will appear in search results
4. For view plugins, executing the command navigates to your component

## Examples

Check out the built-in plugins for reference:
- `plugin-manager`: View plugin example
- `volume-control-macos`: No-view plugin with multiple commands
- `app-launcher`: Dynamic command registration

Happy plugin building! 🚀

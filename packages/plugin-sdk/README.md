# @keyed-launcher/plugin-sdk

Plugin SDK for [Keyed Launcher](https://github.com/nukeop/keyed-launcher) - Create powerful plugins with TypeScript support and type-safe APIs.

## Installation

```bash
npm install @keyed-launcher/plugin-sdk
```

## Quick Start

```typescript
import { PluginAPI, PluginManifest } from '@keyed-launcher/plugin-sdk';

// Plugin manifest
export const manifest: PluginManifest = {
  id: 'my-awesome-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0',
  description: 'A plugin that does awesome things',
  commands: [
    {
      id: 'hello-world',
      name: 'Hello World',
      description: 'Say hello to the world'
    }
  ]
};

// Plugin initialization
export async function onStartup() {
  console.log('🚀 My Awesome Plugin started!');
}

// Use the launcher APIs
export async function sayHello() {
  await PluginAPI.notifications.show('Hello from my plugin!', 'success');
  
  const apps = await PluginAPI.system.getApplications();
  console.log(`Found ${apps.length} applications`);
}
```

## Available APIs

### System API
```typescript
// Get installed applications
const apps = await PluginAPI.system.getApplications();
```

### Shell API
```typescript
// Execute shell commands
await PluginAPI.shell.execute('echo', ['Hello World']);
```

### Clipboard API
```typescript
// Read from clipboard
const text = await PluginAPI.clipboard.readText();

// Write to clipboard
await PluginAPI.clipboard.writeText('Hello World');
```

### Environment API
```typescript
// Get environment information
const env = PluginAPI.environment.getEnvironment();
console.log(env.platform, env.debug);
```

### Notifications API
```typescript
// Show notifications
PluginAPI.notifications.show('Success!', 'success');
PluginAPI.notifications.show('Error occurred', 'error');
PluginAPI.notifications.show('Information', 'info');
```

## Plugin Types

### Command Plugins
Create commands that users can invoke:

```typescript
import { CommandContext, LauncherEntry } from '@keyed-launcher/plugin-sdk';

export const commands: LauncherEntry[] = [
  {
    id: 'my-command',
    commandName: 'my-command',
    title: 'My Command',
    description: 'Does something useful',
    mode: 'no-view',
    execute: async (context: CommandContext) => {
      // Your command logic here
    }
  }
];
```

### View Plugins
Create plugins with custom React components:

```typescript
import React from 'react';
import { CommandContext } from '@keyed-launcher/plugin-sdk';

export const viewCommand = {
  mode: 'view' as const,
  execute: async (context: CommandContext) => {
    return <div>Custom plugin UI</div>;
  }
};
```

## TypeScript Support

The SDK provides full TypeScript support with comprehensive type definitions:

```typescript
import type {
  PluginManifest,
  CommandManifest,
  LauncherEntry,
  CommandContext,
  Plugin
} from '@keyed-launcher/plugin-sdk';
```

## Development

For plugin development guides and examples, visit the [Keyed Launcher documentation](https://github.com/nukeop/keyed-launcher).

## License

AGPL-3.0 - see the [LICENSE](https://github.com/nukeop/keyed-launcher/blob/master/LICENSE) file for details.

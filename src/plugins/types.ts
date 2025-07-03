export interface PluginManifest {
  // Plugin identity (store-ready)
  id: string; // Globally unique ID (e.g., "com.author.plugin-name")
  name: string; // Display name
  version: string; // Semantic version (e.g., "1.2.3")
  apiVersion: string; // Plugin API version (e.g., "1.0.0")
  description: string; // Brief description
  author: string; // Author name

  // Store metadata (optional, for future store)
  namespace?: string; // Publisher namespace (e.g., "raycast", "community")
  license?: string; // License identifier (e.g., "MIT", "GPL-3.0")
  homepage?: string; // Plugin homepage URL
  repository?: string; // Source code repository
  keywords?: string[]; // Store search keywords
  category?: string; // Store category

  // Dependencies (for future plugin ecosystem)
  dependencies?: Record<string, string>; // Plugin dependencies
  peerDependencies?: Record<string, string>; // Required peer plugins

  // Runtime requirements
  permissions: PluginPermissions;

  // Commands provided by this plugin
  commands: CommandManifest[];

  // Installation metadata (managed by system)
  _installMeta?: PluginInstallMeta;
}

export interface PluginInstallMeta {
  installedAt: Date;
  installedFrom: 'bundled' | 'store' | 'url' | 'local';
  storeUrl?: string; // Store page URL
  downloadUrl?: string; // Download source
  checksum?: string; // Package integrity check
  signature?: string; // Digital signature (for store)
  autoUpdate: boolean; // User preference for auto-updates
}

export interface CommandManifest {
  name: string; // Unique command identifier within plugin
  title: string; // Display name
  subtitle?: string; // Brief description
  description: string; // Detailed description
  mode: 'view' | 'no-view';
  category?: string; // Domain category
  keywords?: string[]; // Search terms
  icon?: string; // Icon identifier or URL

  // Command execution
  handler: string; // Path to command file (relative to plugin root)
}

export interface PluginPermissions {
  filesystem?: 'read' | 'write' | 'none';
  network?: 'local' | 'internet' | 'none';
  shell?: 'restricted' | 'full' | 'none';
  system?: 'read' | 'write' | 'none';
}

export interface CommandContext {
  environment: {
    theme: string;
    platform: string;
    debug: boolean;
  };
}

export interface LauncherEntry {
  id: string; // Unique ID (pluginId.commandName)
  commandName: string; // Command identifier
  title: string; // Display name
  subtitle?: string; // Brief description
  description: string; // Detailed description
  mode: 'view' | 'no-view';
  category?: string; // Domain category
  pluginId: string; // Plugin ID
  keywords?: string[]; // Search terms
  execute: NoViewCommand | ViewCommand;
}

export interface NoViewCommand {
  mode: 'no-view';
  execute: (context: CommandContext) => Promise<void>;
}

export interface ViewCommand {
  mode: 'view';
  execute: (context: CommandContext) => Promise<React.ReactElement>;
}

export interface Plugin {
  manifest: PluginManifest;
  onStartup?: () => Promise<void>;
  onUnload?: () => Promise<void>;
}

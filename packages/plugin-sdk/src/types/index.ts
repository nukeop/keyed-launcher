import { ThemeContextType } from '../theming';
import React from 'react';

// Icon types
export interface EmojiIcon {
  type: 'emoji';
  emoji: string;
}

export interface Base64Icon {
  type: 'base64';
  data: string; // Base64-encoded image data (with data:image/... prefix)
}

export interface NamedIcon {
  type: 'named';
  name: string; // Icon name from Lucide React
  gradient?: {
    from: string; // Tailwind color (e.g., 'blue-500')
    to: string; // Tailwind color (e.g., 'purple-600')
  };
}

export type CommandIcon = EmojiIcon | Base64Icon | NamedIcon | string;

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
  displayName: string; // Display name
  subtitle?: string; // Brief description
  description: string; // Detailed description
  mode: 'view' | 'no-view';
  category?: string; // Domain category
  keywords?: string[]; // Search terms
  icon?: CommandIcon; // Icon configuration

  // Command execution
  handler: string; // Path to command file (relative to plugin root)
}

export interface CommandContext {
  environment: {
    theme: ThemeContextType;
    platform: string;
    debug: boolean;
  };
}

export enum ItemKind {
  Application = 'Application',
  Command = 'Command',
  PluginCommand = 'Plugin Command',
  QuickLink = 'Quick Link',
  SystemSettings = 'System Settings',
}

export interface LauncherEntry {
  id: string; // Unique ID (pluginId.commandName)
  commandName: string; // Command identifier
  title: string; // Display name
  subtitle?: string; // Brief description
  kind?: ItemKind; // See ItemKind
  description: string; // Detailed description
  mode: 'view' | 'no-view' | 'inline';
  category?: string; // Domain category
  pluginId: string; // Plugin ID
  keywords?: string[]; // Search terms
  icon?: CommandIcon; // Icon configuration
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

export namespace Action {
  export interface OpenInBrowser {
    type: 'open-in-browser';
    url: string;
  }

  export interface CopyToClipboard {
    type: 'copy-to-clipboard';
    text: string;
  }

  export interface Close {
    type: 'close';
  }
}

export type BasicAction =
  | Action.OpenInBrowser
  | Action.CopyToClipboard
  | Action.Close;

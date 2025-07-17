import { RegisteredCommand } from '../stores/commands';
import {
  CommandManifest,
  InlineCommand,
  LauncherEntry,
  NoViewCommand,
  ViewCommand,
} from '@keyed-launcher/plugin-sdk';
import { Mock, vi } from 'vitest';

export class MockCommandBuilder {
  private manifest: Partial<CommandManifest> = {};
  private entry: Partial<LauncherEntry> = {};
  private executeFunction?: LauncherEntry['execute']['execute'];
  private pluginId: RegisteredCommand['pluginId'] = 'com.test.mock-plugin';
  private source: RegisteredCommand['source'] = 'plugin';

  withName(name: string): MockCommandBuilder {
    this.manifest.name = name;
    this.entry.commandName = name;
    return this;
  }

  withDisplayName(displayName: string): MockCommandBuilder {
    this.manifest.displayName = displayName;
    this.entry.title = displayName;
    return this;
  }

  withDescription(description: string): MockCommandBuilder {
    this.manifest.description = description;
    this.entry.description = description;
    return this;
  }

  withMode(mode: CommandManifest['mode']): MockCommandBuilder {
    this.manifest.mode = mode;
    this.entry.mode = mode;
    return this;
  }

  withHandler(handler: string): MockCommandBuilder {
    this.manifest.handler = handler;
    return this;
  }

  withId(id: string): MockCommandBuilder {
    this.entry.id = id;
    return this;
  }

  withSubtitle(subtitle: string): MockCommandBuilder {
    this.entry.subtitle = subtitle;
    return this;
  }

  withIcon(icon: LauncherEntry['icon']): MockCommandBuilder {
    this.entry.icon = icon;
    return this;
  }

  withCategory(category: string): MockCommandBuilder {
    this.entry.category = category;
    this.manifest.category = category;
    return this;
  }

  withPluginId(pluginId: string): MockCommandBuilder {
    this.pluginId = pluginId;
    this.entry.pluginId = pluginId;
    return this;
  }

  withSource(source: RegisteredCommand['source']): MockCommandBuilder {
    this.source = source;
    return this;
  }

  withExecuteFunction(
    executeFunction: LauncherEntry['execute']['execute'],
  ): MockCommandBuilder {
    this.executeFunction = executeFunction;
    return this;
  }

  withMockExecuteFunction(): MockCommandBuilder {
    this.executeFunction = vi.fn();
    return this;
  }

  buildManifest(): CommandManifest {
    return {
      ...this.manifest,
      name: this.manifest.name || 'mock-command',
      displayName: this.manifest.displayName || 'Mock Command',
      description: this.manifest.description || 'A mock command for testing',
      mode: this.manifest.mode || 'no-view',
      handler: this.manifest.handler || 'commands/mock.js',
    };
  }

  buildEntry(): LauncherEntry {
    const executeFunction = this.executeFunction || vi.fn();

    return {
      ...this.entry,
      id: this.entry.id ?? '1',
      commandName: this.entry.commandName ?? 'mock-command',
      title: this.entry.title ?? 'Mock Command',
      description: this.entry.description ?? 'A mock command for testing',
      mode: this.entry.mode ?? 'no-view',
      pluginId: this.entry.pluginId ?? this.pluginId ?? 'com.test.mock-plugin',
      execute: {
        mode: this.entry.mode ?? 'no-view',
        execute: executeFunction,
      } as NoViewCommand | ViewCommand | InlineCommand,
    };
  }

  buildCommand(): RegisteredCommand {
    const manifest = this.buildManifest();
    const entry = this.buildEntry();

    return {
      pluginId: this.pluginId,
      commandName: manifest.name,
      entry,
      source: this.source,
    };
  }

  build(): {
    manifest: CommandManifest;
    entry: LauncherEntry;
    command: RegisteredCommand;
    executeFunction?: Mock;
  } {
    return {
      manifest: this.buildManifest(),
      entry: this.buildEntry(),
      command: this.buildCommand(),
      executeFunction: this.executeFunction as Mock,
    };
  }
}

export const createMockCommand = (name?: string) => {
  return new MockCommandBuilder()
    .withName(name || 'mock-command')
    .withMockExecuteFunction()
    .build();
};

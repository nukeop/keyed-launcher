import {
  Plugin,
  PluginManifest,
  CommandManifest,
} from '@keyed-launcher/plugin-sdk';

export class MockPluginBuilder {
  private manifest: Partial<PluginManifest> = {};
  private onStartup?: () => Promise<void>;
  private onUnload?: () => Promise<void>;

  withId(id: string): MockPluginBuilder {
    this.manifest.id = id;
    return this;
  }

  withName(name: string): MockPluginBuilder {
    this.manifest.name = name;
    return this;
  }

  withVersion(version: string): MockPluginBuilder {
    this.manifest.version = version;
    return this;
  }

  withAuthor(author: string): MockPluginBuilder {
    this.manifest.author = author;
    return this;
  }

  withDescription(description: string): MockPluginBuilder {
    this.manifest.description = description;
    return this;
  }

  withCommand(command: Partial<CommandManifest>): MockPluginBuilder {
    if (!this.manifest.commands) {
      this.manifest.commands = [];
    }

    const fullCommand: CommandManifest = {
      name: command.name || 'default-command',
      displayName: command.displayName || 'Default Command',
      description: command.description || 'Default description',
      mode: command.mode || 'no-view',
      handler: command.handler || 'commands/default.js',
      ...command,
    };

    this.manifest.commands.push(fullCommand);
    return this;
  }

  withStartupHook(hook: () => Promise<void>): MockPluginBuilder {
    this.onStartup = hook;
    return this;
  }

  withUnloadHook(hook: () => Promise<void>): MockPluginBuilder {
    this.onUnload = hook;
    return this;
  }

  build(): Plugin {
    const fullManifest: PluginManifest = {
      id: this.manifest.id || 'com.test.mock-plugin',
      name: this.manifest.name || 'Mock Plugin',
      version: this.manifest.version || '1.0.0',
      apiVersion: this.manifest.apiVersion || '1.0.0',
      description: this.manifest.description || 'A mock plugin for testing',
      author: this.manifest.author || 'Test Author',
      commands: this.manifest.commands || [],
      ...this.manifest,
    };

    const plugin: Plugin = {
      manifest: fullManifest,
    };

    if (this.onStartup) {
      plugin.onStartup = this.onStartup;
    }

    if (this.onUnload) {
      plugin.onUnload = this.onUnload;
    }

    return plugin;
  }
}

export const createMockPlugin = (id?: string): Plugin => {
  return new MockPluginBuilder().withId(id || 'com.test.mock-plugin').build();
};

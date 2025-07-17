import { RegisteredCommand, useCommandRegistry } from '../stores/commands';
import { usePluginRegistry } from '../stores/plugins';
import { MockCommandBuilder } from './mockCommandBuilder';
import { MockPluginBuilder } from './mockPluginBuilder';
import { Plugin } from '@keyed-launcher/plugin-sdk';

export const withDefaultPlugins = () => {
  const { manifest: commandManifest1 } = new MockCommandBuilder()
    .withName('calculator')
    .withDisplayName('Calculator')
    .withDescription('Calculator for calculating')
    .withCategory('Applications')
    .withMode('no-view')
    .withHandler('commands/calculator')
    .withId('1')
    .withPluginId('tools-plugin')
    .withMockExecuteFunction()
    .build();

  const { manifest: commandManifest2 } = new MockCommandBuilder()
    .withName('terminal')
    .withDisplayName('Terminal')
    .withDescription('Terminal for command line access')
    .withCategory('Applications')
    .withMode('no-view')
    .withHandler('commands/terminal')
    .withId('2')
    .withPluginId('tools-plugin')
    .withMockExecuteFunction()
    .build();

  const { manifest: commandManifest3 } = new MockCommandBuilder()
    .withName('finder')
    .withDisplayName('Finder')
    .withDescription('File manager for finding files')
    .withCategory('Applications')
    .withMode('no-view')
    .withHandler('commands/finder')
    .withId('3')
    .withPluginId('tools-plugin')
    .withMockExecuteFunction()
    .build();

  const plugin = new MockPluginBuilder()
    .withId('com.tools-plugin')
    .withName('Tools Plugin')
    .withVersion('1.0.0')
    .withDescription('Tools plugin')
    .withCommand(commandManifest1)
    .withCommand(commandManifest2)
    .withCommand(commandManifest3)
    .build();

  clear();
  usePluginRegistry.getState().registerPlugin(plugin);
};

export const withPlugin = (plugin: Plugin) => {
  usePluginRegistry.getState().registerPlugin(plugin);
};

export const withCommand = (command: RegisteredCommand) => {
  useCommandRegistry.getState().registerCommand(command);
};

export const clear = () => {
  usePluginRegistry.getState().clearPlugins();
  useCommandRegistry.getState().clearCommands();
};

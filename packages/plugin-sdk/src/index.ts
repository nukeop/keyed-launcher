export * from './types';

export type {
  PluginManifest,
  PluginInstallMeta,
  CommandManifest,
  CommandContext,
  LauncherEntry,
  NoViewCommand,
  ViewCommand,
  Plugin,
  EmojiIcon,
  Base64Icon,
  NamedIcon,
  CommandIcon,
} from './types';

export { Keyboard } from './types/keyboard';

export {
  resolveShortcut,
  getCommonShortcut,
  formatKeyOrModifier,
} from './utils/keyboardUtils';

export {
  getPlatform,
  initializePlatform,
  type Platform,
} from './utils/platformUtils';

export { groupEntriesByCategory } from './utils/categoryUtils';

export {
  PluginAPI,
  useEnvironment,
  useNotifications,
  getAPIBridge,
} from './api';

export type { MacOSApp, Environment, PluginAPIBridge } from './api';

export * from './theming';
export * from './components';
export * from './providers';

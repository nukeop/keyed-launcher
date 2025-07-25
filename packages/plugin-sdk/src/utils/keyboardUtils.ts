import { Keyboard } from '../types/keyboard';
import { getPlatform } from './platformUtils';

export const resolveShortcut = (
  shortcut: Keyboard.Shortcut,
): Keyboard.KeyCombination => {
  if ('key' in shortcut) {
    return shortcut;
  }

  const platform = getPlatform();

  if (platform === 'macOS' && shortcut.macOS) {
    return shortcut.macOS;
  } else if (platform === 'windows' && shortcut.windows) {
    return shortcut.windows;
  } else if (platform === 'linux' && shortcut.linux) {
    return shortcut.linux;
  }

  throw new Error('No valid shortcut found for any platform');
};

const commonShortcuts: Record<Keyboard.Shortcut.Common, Keyboard.Shortcut> = {
  [Keyboard.Shortcut.Common.Copy]: {
    macOS: { key: 'c', modifiers: ['cmd'] },
    windows: { key: 'c', modifiers: ['ctrl'] },
    linux: { key: 'c', modifiers: ['ctrl'] },
  },
  [Keyboard.Shortcut.Common.Paste]: {
    macOS: { key: 'v', modifiers: ['cmd'] },
    windows: { key: 'v', modifiers: ['ctrl'] },
    linux: { key: 'v', modifiers: ['ctrl'] },
  },
  [Keyboard.Shortcut.Common.Cut]: {
    macOS: { key: 'x', modifiers: ['cmd'] },
    windows: { key: 'x', modifiers: ['ctrl'] },
    linux: { key: 'x', modifiers: ['ctrl'] },
  },
  [Keyboard.Shortcut.Common.SelectAll]: {
    macOS: { key: 'a', modifiers: ['cmd'] },
    windows: { key: 'a', modifiers: ['ctrl'] },
    linux: { key: 'a', modifiers: ['ctrl'] },
  },
  [Keyboard.Shortcut.Common.Undo]: {
    macOS: { key: 'z', modifiers: ['cmd'] },
    windows: { key: 'z', modifiers: ['ctrl'] },
    linux: { key: 'z', modifiers: ['ctrl'] },
  },
};

export const getCommonShortcut = (
  common: Keyboard.Shortcut.Common,
): Keyboard.Shortcut => commonShortcuts[common];

export const formatKeyOrModifier = (
  keyOrModifier: Keyboard.Modifier | Keyboard.Key,
): string => {
  const platform = getPlatform();
  if (platform === 'macOS') {
    return formatMacOsKeyOrModifier(keyOrModifier);
  } else {
    return formatLinuxKeyOrModifier(keyOrModifier);
  }
};

export const formatMacOsKeyOrModifier = (
  keyOrModifier: Keyboard.Modifier | Keyboard.Key,
) => {
  switch (keyOrModifier) {
    case 'super':
    case 'cmd':
      return '⌘';
    case 'ctrl':
      return '⌃';
    case 'alt':
      return '⌥';
    case 'shift':
      return '⇧';
    case 'backspace':
      return '⌫';
    case 'delete':
      return '⌦';
    default:
      return formatCommonKeyOrModifier(keyOrModifier);
  }
};

export const formatLinuxKeyOrModifier = (
  keyOrModifier: Keyboard.Modifier | Keyboard.Key,
) => {
  switch (keyOrModifier) {
    case 'ctrl':
      return 'Ctrl';
    case 'alt':
      return 'Alt';
    case 'shift':
      return 'Shift';
    case 'super':
      return 'Super';
    case 'backspace':
      return 'Backspace';
    case 'delete':
      return 'Delete';
    default:
      return formatCommonKeyOrModifier(keyOrModifier);
  }
};

export const formatCommonKeyOrModifier = (
  keyOrModifier: Keyboard.Modifier | Keyboard.Key,
) => {
  switch (keyOrModifier) {
    case 'return':
      return '⏎';
    case 'escape':
      return 'ESC';
    case 'tab':
      return '⇥';
    case 'arrowUp':
      return '↑';
    case 'arrowDown':
      return '↓';
    case 'arrowLeft':
      return '←';
    case 'arrowRight':
      return '→';
    default:
      return keyOrModifier.toUpperCase();
  }
};

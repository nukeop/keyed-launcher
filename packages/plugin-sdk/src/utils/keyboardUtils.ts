import { Keyboard } from '../types/keyboard';
import { getPlatform, Platform } from './platformUtils';

export async function resolveShortcut(
  shortcut: Keyboard.Shortcut,
): Promise<Keyboard.KeyCombination> {
  if ('key' in shortcut) {
    return shortcut;
  }

  const platform = await getPlatform();

  if (platform === 'macOS' && shortcut.macOS) {
    return shortcut.macOS;
  } else if (platform === 'windows' && shortcut.windows) {
    return shortcut.windows;
  } else if (platform === 'linux' && shortcut.linux) {
    return shortcut.linux;
  }

  throw new Error('No valid shortcut found for any platform');
}

export function getCommonShortcut(
  common: Keyboard.Shortcut.Common,
): Keyboard.Shortcut {
  const shortcuts: Record<Keyboard.Shortcut.Common, Keyboard.Shortcut> = {
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

  return shortcuts[common];
}

export async function formatShortcut(
  combination: Keyboard.KeyCombination,
): Promise<string> {
  const modifierMap: Record<Keyboard.Modifier, Record<Platform, string>> = {
    cmd: {
      macOS: '⌘',
      windows: 'Win',
      linux: 'Super',
      unknown: 'Cmd',
    },
    ctrl: {
      macOS: '⌃',
      windows: 'Ctrl',
      linux: 'Ctrl',
      unknown: 'Ctrl',
    },
    alt: {
      macOS: '⌥',
      windows: 'Alt',
      linux: 'Alt',
      unknown: 'Alt',
    },
    shift: {
      macOS: '⇧',
      windows: 'Shift',
      linux: 'Shift',
      unknown: 'Shift',
    },
  };

  const keyMap: Record<string, string> = {
    return: '↵',
    escape: 'Esc',
    space: 'Space',
    tab: 'Tab',
    backspace: '⌫',
    delete: '⌦',
    arrowUp: '↑',
    arrowDown: '↓',
    arrowLeft: '←',
    arrowRight: '→',
  };

  const targetPlatform = await getPlatform();

  const modifiers = combination.modifiers
    .map((mod) => modifierMap[mod][targetPlatform])
    .join(targetPlatform === 'macOS' ? '' : '+');

  const key = keyMap[combination.key] || combination.key.toUpperCase();

  return targetPlatform === 'macOS'
    ? `${modifiers}${key}`
    : modifiers
      ? `${modifiers}+${key}`
      : key;
}

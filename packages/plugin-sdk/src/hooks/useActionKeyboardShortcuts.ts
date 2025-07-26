import { useActionContext } from '../providers';
import { Keyboard } from '../types/keyboard';
import { resolveShortcut } from '../utils/keyboardUtils';
import { useEffect, useRef } from 'react';

type ShortcutMatcher = {
  matches: (event: KeyboardEvent) => boolean;
  shortcut: Keyboard.Shortcut;
  actionIndex: number;
};

const convertKeyToEventKey = (key: Keyboard.Key): string => {
  switch (key) {
    case 'return':
      return 'Enter';
    case 'escape':
      return 'Escape';
    case 'space':
      return ' ';
    case 'tab':
      return 'Tab';
    case 'backspace':
      return 'Backspace';
    case 'delete':
      return 'Delete';
    case 'arrowUp':
      return 'ArrowUp';
    case 'arrowDown':
      return 'ArrowDown';
    case 'arrowLeft':
      return 'ArrowLeft';
    case 'arrowRight':
      return 'ArrowRight';
    default:
      return key.toLowerCase();
  }
};

const checkModifiers = (
  event: KeyboardEvent,
  modifiers: Keyboard.Modifier[],
): boolean => {
  const requiredModifiers = new Set(modifiers);

  const hasCmd = event.metaKey;
  const hasCtrl = event.ctrlKey;
  const hasAlt = event.altKey;
  const hasShift = event.shiftKey;

  for (const modifier of requiredModifiers) {
    switch (modifier) {
      case 'cmd':
      case 'super':
        if (!hasCmd) return false;
        break;
      case 'ctrl':
        if (!hasCtrl) return false;
        break;
      case 'alt':
        if (!hasAlt) return false;
        break;
      case 'shift':
        if (!hasShift) return false;
        break;
    }
  }

  const expectedModifierCount = requiredModifiers.size;
  const actualModifierCount = [hasCmd, hasCtrl, hasAlt, hasShift].filter(
    Boolean,
  ).length;

  return expectedModifierCount === actualModifierCount;
};

const createShortcutMatcher = (
  shortcut: Keyboard.Shortcut,
  actionIndex: number,
): ShortcutMatcher => {
  const resolved = resolveShortcut(shortcut);
  const eventKey = convertKeyToEventKey(resolved.key);

  return {
    matches: (event: KeyboardEvent) => {
      return (
        event.key === eventKey && checkModifiers(event, resolved.modifiers)
      );
    },
    shortcut,
    actionIndex,
  };
};

export const useActionKeyboardShortcuts = () => {
  const { keyboardShortcuts, actionCallbacks } = useActionContext();
  const matchersRef = useRef<ShortcutMatcher[]>([]);

  useEffect(() => {
    matchersRef.current = keyboardShortcuts.map((shortcut, index) =>
      createShortcutMatcher(shortcut, index),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const matcher of matchersRef.current) {
        if (matcher.matches(event)) {
          event.preventDefault();
          const callback = actionCallbacks[matcher.actionIndex];
          if (callback) {
            callback();
          }
          break; // Only handle the first match
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcuts, actionCallbacks]);
};

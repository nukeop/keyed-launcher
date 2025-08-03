import { CommandIcon } from '../../types';
import { Keyboard } from '../../types/keyboard';
import { resolveShortcut } from '../../utils/keyboardUtils';
import { IconRenderer } from '../IconRenderer';
import { KeyCombo } from '../KeyCombo';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type ActionProps = {
  title: string;
  autoFocus?: boolean;
  icon?: CommandIcon;
  onAction: () => void;
  shortcut: Keyboard.Shortcut;
  style: 'default' | 'warning' | 'danger' | 'success' | 'info';
};

export const Action: FC<ActionProps> = ({
  title,
  autoFocus,
  icon,
  onAction,
  shortcut,
  style = 'default',
}) => {
  return (
    <button
      autoFocus={autoFocus}
      className={twMerge(
        'bg-none text-white flex justify-between items-center p-2 rounded bg-white/10',
        style === 'danger' && 'text-red-400',
        style === 'warning' && 'text-amber-400',
        style === 'success' && 'text-green-400',
        style === 'info' && 'text-blue-400',
      )}
      onClick={onAction}
    >
      <span className="flex flex-row items-center gap-2">
        {icon && <IconRenderer icon={icon} />}
        {title}
      </span>
      <KeyCombo combo={resolveShortcut(shortcut)} />
    </button>
  );
};

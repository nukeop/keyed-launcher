import { forwardRef } from 'react';
import { CommandIcon } from '@keyed-launcher/plugin-sdk';
import { IconRenderer } from './IconRenderer';

interface ResultItemProps {
  title: string;
  subtitle?: string;
  icon?: CommandIcon;
  isSelected?: boolean;
  onClick?: () => void;
  shortcut?: string;
  'data-testid'?: string;
}

export const ResultItem = forwardRef<HTMLDivElement, ResultItemProps>(
  (
    {
      title,
      subtitle,
      icon,
      isSelected = false,
      onClick,
      shortcut,
      'data-testid': testId,
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={`flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm ${isSelected ? 'bg-white/20' : 'hover:bg-white/5'}`}
      onClick={onClick}
      data-testid={testId}
      data-selected={isSelected}
    >
      {icon && (
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center">
          <IconRenderer icon={icon} className="h-8 w-8" size={32} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-row items-center justify-start">
        <div className="truncate text-white">{title}</div>
        {subtitle && (
          <div className="ml-2 truncate text-zinc-400">{subtitle}</div>
        )}
      </div>

      {shortcut && (
        <div className="ml-3 font-mono text-xs text-gray-500">{shortcut}</div>
      )}
    </div>
  ),
);

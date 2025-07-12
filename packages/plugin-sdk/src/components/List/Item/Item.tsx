import { CommandIcon, ItemKind } from '../../../types';
import { IconRenderer } from '../../IconRenderer';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export type ItemProps = {
  className?: string;
  title: string;
  subtitle?: string;
  kind?: ItemKind;
  icon?: CommandIcon;
  isSelected?: boolean;
  onAction?: () => void;
  'data-testid'?: string;
};

interface ItemComponent
  extends ForwardRefExoticComponent<
    ItemProps & RefAttributes<HTMLDivElement>
  > {}

const ItemBase = forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      title,
      subtitle,
      kind,
      icon,
      isSelected,
      onAction,
      'data-testid': testId,
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={twMerge(
        'flex flex-row cursor-pointer items-center rounded-md px-2 py-2 text-sm',
        isSelected ? 'bg-white/10' : 'hover:bg-white/5',
        className,
      )}
      onClick={onAction}
      data-testid={testId ?? 'plugin-list-item'}
    >
      <div className="flex flex-row justify-between flex-1">
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {icon && <IconRenderer icon={icon} className="h-8 w-8" size={32} />}
        </div>

        <div className="flex min-w-0 flex-1 flex-row items-center justify-start">
          <div className="truncate text-white text-base">{title}</div>
          {subtitle && (
            <div className="ml-2 truncate text-white/50 text-base">
              {subtitle}
            </div>
          )}
        </div>
        <div className="flex flex-row items-center text-base text-white/50">
          {kind}
        </div>
      </div>
    </div>
  ),
);

export const Item = ItemBase as ItemComponent;

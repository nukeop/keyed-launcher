import { useActionContext } from '../../../providers/ActionContext';
import { CommandIcon, ItemKind } from '../../../types';
import { IconRenderer } from '../../IconRenderer';
import { useListContext } from '../ListContext';
import {
  FC,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useEffect,
  useRef,
} from 'react';
import { twMerge } from 'tailwind-merge';

export type ItemProps = {
  className?: string;
  id: string;
  title: string;
  subtitle?: string;
  kind?: ItemKind;
  icon?: CommandIcon;
  actions?: ReactNode;
  onAction?: () => void;
  'data-testid'?: string;
};

interface ItemComponent
  extends ForwardRefExoticComponent<
    ItemProps & RefAttributes<HTMLDivElement>
  > {}

const ItemBase: FC<ItemProps> = ({
  className,
  id,
  title,
  subtitle,
  kind,
  icon,
  actions,
  onAction,
  'data-testid': testId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { registerItem, unregisterItem, selectedId } = useListContext();
  const { setCurrentActions } = useActionContext();
  const isSelected = selectedId === id;

  useEffect(() => {
    registerItem(id, ref);
    return () => unregisterItem(id);
  }, [id]);

  useEffect(() => {
    if (isSelected) {
      ref.current?.focus();
      ref?.current?.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  useEffect(() => {
    if (isSelected && actions) {
      setCurrentActions(actions);
    } else if (isSelected && !actions) {
      setCurrentActions(null);
    }
  }, [isSelected, actions, setCurrentActions]);

  return (
    <div
      ref={ref}
      className={twMerge(
        'flex flex-row cursor-pointer items-center rounded-md px-2 py-2 text-sm',
        isSelected ? 'bg-white/10' : 'hover:bg-white/5',
        className,
      )}
      onClick={onAction}
      data-testid={testId ?? 'plugin-list-item'}
      data-selected={isSelected}
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
  );
};

export const Item = ItemBase as ItemComponent;

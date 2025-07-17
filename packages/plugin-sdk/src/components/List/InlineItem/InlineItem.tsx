import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

export type InlineItemProps = {
  className?: string;
  children: React.ReactNode;
  isSelected?: boolean;
  onAction?: () => void;
  'data-testid'?: string;
};

interface InlineItemComponent
  extends ForwardRefExoticComponent<
    InlineItemProps & RefAttributes<HTMLDivElement>
  > {}

const InlineItemBase = forwardRef<HTMLDivElement, InlineItemProps>(
  (
    { className, children, isSelected, onAction, 'data-testid': testId },
    ref,
  ) => (
    <div
      ref={ref}
      className={twMerge(
        'flex flex-row cursor-pointer items-center rounded-md px-4 py-3 mb-2',
        'border border-white/20 bg-white/5',
        isSelected ? 'bg-white/15 border-white/30' : 'hover:bg-white/10',
        className,
      )}
      onClick={onAction}
      data-testid={testId ?? 'inline-item'}
      data-selected={isSelected}
    >
      <div className="flex-1 text-white">{children}</div>
    </div>
  ),
);

export const InlineItem = InlineItemBase as InlineItemComponent;

import { NamedIcon } from '../types';
import { isBareNamedIcon, isGradientNamedIcon } from '../utils/iconUtils';
import { icons } from 'lucide-react';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type NamedIconRendererProps = {
  icon: NamedIcon;
  className?: string;
  size?: number;
};

export const NamedIconRenderer: FC<NamedIconRendererProps> = ({
  icon,
  className,
  size = 20,
}) => {
  let NamedIcon = icons[icon.name as keyof typeof icons];

  if (!NamedIcon) {
    NamedIcon = icons.Circle;
  }

  if (isGradientNamedIcon(icon)) {
    const gradientClasses = icon.gradient
      ? `bg-gradient-to-br from-${icon.gradient.from} to-${icon.gradient.to}`
      : 'bg-gradient-to-br from-indigo-500 to-purple-600';
    return (
      <div
        data-testid="named-icon"
        className={twMerge(
          'flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ring-1 ring-white/20 transition-all duration-200 hover:scale-105 hover:shadow-md',
          gradientClasses,
          className,
        )}
      >
        <NamedIcon className={'h-5 w-5 text-white'} size={size} />
      </div>
    );
  } else if (isBareNamedIcon(icon)) {
    return (
      <NamedIcon
        className={twMerge('h-5 w-5 text-white', className)}
        size={size}
      />
    );
  }
};

import { isBase64Icon, isEmojiIcon, isNamedIcon } from '../utils/iconUtils';
import { CommandIcon } from '@keyed-launcher/plugin-sdk';
import { icons } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IconRendererProps {
  icon: CommandIcon | undefined;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  className = 'h-8 w-8',
  size = 32,
}) => {
  if (!icon) {
    return null;
  }

  if (isEmojiIcon(icon)) {
    return (
      <div
        data-testid="emoji-icon"
        className={twMerge(
          className,
          'flex items-center justify-center text-lg',
        )}
      >
        {icon.emoji}
      </div>
    );
  }

  if (isBase64Icon(icon)) {
    return (
      <img
        data-testid="base64-icon"
        className={className}
        src={icon.data}
        alt="Icon"
        style={{ width: size, height: size }}
      />
    );
  }

  if (isNamedIcon(icon)) {
    const NamedIcon = icons[icon.name as keyof typeof icons];

    if (!NamedIcon) {
      const FallbackIcon = icons.Circle;
      return (
        <div
          data-testid="fallback-named-icon"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500 shadow-sm ring-1 ring-white/20 transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <FallbackIcon className="h-5 w-5 text-white" size={20} />
        </div>
      );
    }

    const gradientClasses = icon.gradient
      ? `bg-gradient-to-br from-${icon.gradient.from} to-${icon.gradient.to}`
      : 'bg-gradient-to-br from-indigo-500 to-purple-600';

    return (
      <div
        data-testid="named-icon"
        className={twMerge(
          'flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ring-1 ring-white/20 transition-all duration-200 hover:scale-105 hover:shadow-md',
          gradientClasses,
        )}
      >
        <NamedIcon className="h-5 w-5 text-white" size={20} />
      </div>
    );
  }

  return null;
};

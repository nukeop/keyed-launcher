import { CommandIcon } from '..';
import { isBase64Icon, isEmojiIcon, isNamedIcon } from '../utils/iconUtils';
import { NamedIconRenderer } from './NamedIconRenderer';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IconRendererProps {
  icon: CommandIcon | undefined;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  className = 'h-5 w-5',
  size = 20,
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
    return <NamedIconRenderer icon={icon} className={className} size={size} />;
  }

  return null;
};

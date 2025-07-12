import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ItemProps {
  text: string;
  color?: string;
  className?: string;
}

export const Item: React.FC<ItemProps> = ({ text, color, className = '' }) => {
  return (
    <span
      className={twMerge(
        'inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium',
        className,
        color ? 'text-white' : 'text-gray-800',
        color && `bg-[${color}]`,
      )}
    >
      {text}
    </span>
  );
};

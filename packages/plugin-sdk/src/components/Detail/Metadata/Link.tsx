import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface LinkProps {
  title: string;
  target: string;
  text?: string;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({
  title,
  target,
  text,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>
      <div className="text-xs font-semibold text-gray-600">{title}</div>
      <a
        href={target}
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {text || target}
      </a>
    </div>
  );
};

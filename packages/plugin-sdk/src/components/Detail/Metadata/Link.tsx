import { LinkIcon } from 'lucide-react';
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
      <div className="text-xs font-medium text-gray-400">{title}</div>
      <a
        href={target}
        className="flex flex-row items-center text-sm text-blue-500 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {text || target}
        <span className="rounded-full bg-white/20 text-white p-1 ml-1">
          <LinkIcon size={12} />
        </span>
      </a>
    </div>
  );
};

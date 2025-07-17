import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export interface SeparatorProps {
  className?: string;
}

export const Separator: FC<SeparatorProps> = ({ className = '' }) => {
  return <div className={twMerge('h-px bg-white/10 my-2', className)} />;
};

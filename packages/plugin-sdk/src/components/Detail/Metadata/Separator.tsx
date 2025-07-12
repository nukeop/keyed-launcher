import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface SeparatorProps {
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className = '' }) => {
  return <div className={twMerge('h-px bg-gray-200 my-2', className)} />;
};

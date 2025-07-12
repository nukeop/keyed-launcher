import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface LabelProps {
  title: string;
  text?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  title,
  text,
  icon,
  className = '',
}) => {
  return (
    <div className={twMerge('flex items-start gap-2', className)}>
      {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1">
        <div className="text-xs font-semibold text-gray-600 mb-1">{title}</div>
        {text && <div className="text-sm text-gray-900">{text}</div>}
      </div>
    </div>
  );
};

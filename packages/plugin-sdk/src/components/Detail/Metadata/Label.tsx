import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export interface LabelProps {
  title: string;
  text?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Label: FC<LabelProps> = ({
  title,
  text,
  icon,
  className = '',
}) => {
  return (
    <div className={twMerge('flex items-start gap-2', className)}>
      {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1">
        <div className="text-xs font-medium text-gray-400">{title}</div>
        {text && <div className="text-sm text-white">{text}</div>}
      </div>
    </div>
  );
};

import { CommandIcon } from '@keyed-launcher/plugin-sdk';
import { IconRenderer } from './IconRenderer';

interface CategoryHeaderProps {
  title: string;
  icon?: CommandIcon;
  'data-testid'?: string;
}

export function CategoryHeader({
  title,
  icon,
  'data-testid': testId,
}: CategoryHeaderProps) {
  return (
    <div
      className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-400"
      data-testid={testId}
    >
      <div className="flex items-center">
        {icon && (
          <div className="mr-2 flex h-4 w-4 items-center justify-center">
            <IconRenderer icon={icon} className="h-4 w-4" size={16} />
          </div>
        )}
        {title.toUpperCase()}
      </div>
    </div>
  );
}

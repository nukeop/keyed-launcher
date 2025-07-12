import { CommandIcon, IconRenderer } from '@keyed-launcher/plugin-sdk';

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
      className="px-2 pt-4 pb-2 text-sm font-medium tracking-wide text-gray-400"
      data-testid={testId}
    >
      <div className="flex items-center">
        {icon && (
          <div className="mr-2 flex h-4 w-4 items-center justify-center">
            <IconRenderer icon={icon} className="h-4 w-4" size={16} />
          </div>
        )}
        {title}
      </div>
    </div>
  );
}

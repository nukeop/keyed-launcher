import { CommandIcon, IconRenderer } from '../../..';
import { FC } from 'react';

export type CategoryHeaderProps = {
  title: string;
  icon?: CommandIcon;
  'data-testid'?: string;
};

interface CategoryHeaderComponent extends FC<CategoryHeaderProps> {}

const CategoryHeaderBase: FC<CategoryHeaderProps> = ({
  title,
  icon,
  'data-testid': testId,
}) => {
  return (
    <div
      className="px-2 py-2 text-sm font-medium tracking-wide text-gray-400"
      data-testid={testId ?? 'plugin-list-category-header'}
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
};

export const CategoryHeader = CategoryHeaderBase as CategoryHeaderComponent;
